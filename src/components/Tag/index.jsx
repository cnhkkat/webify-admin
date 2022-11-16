import { useState } from 'react'
import { Popconfirm, Modal, message } from 'antd'
import { connect } from 'react-redux'
import { CloseOutlined } from '@ant-design/icons'
import { getTags, getArticles, getDrafts } from '../../redux/actions'
import { db, _, auth } from '../../utils/cloudBase'
import { visitorText, adminUid } from '../../utils/constants'

const Tag = (props) => {
  const tagColor = ['#8ee5e0', '#e783a2', '#30cfd0', '#c29af4', '#ffe100', '#80aedc', '#f093fb', '#f5576c', '#fa709a', '#ff891b']
  const colorLen = tagColor.length
  const [tagEditVisible, setTagEditVisible] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [tagEditInput, setTagEditInput] = useState('')
  const [oldTag, setOldTag] = useState('')
  const [tagId, setTagId] = useState('')

  // 数据库获取所有标签
  const getAllTags = () => {
    db.collection('tags')
      .limit(1000)
      .get()
      .then((res) => {
        props.getTags(res.data)
      })
  }
  const getAllArticles = (dbName) => {
    db.collection(dbName)
      .limit(1000)
      .get()
      .then((res) => {
        if (dbName === 'articles') {
          props.getArticles(res.data)
          message.success('更新文章标签成功！')
        } else {
          props.getDrafts(res.data)
          message.success('更新草稿标签成功！')
        }
      })
  }
  // 清空ID、编辑输入框、旧标签名
  const clearAllState = () => {
    setTagEditInput('')
    setOldTag('')
    setTagId('')
  }
  // 添加标签
  const addTag = async () => {
    if (!tagInput.length) {
      message.info('标签名不能为空！')
      return
    }
    // 判断是否存在
    const sameTagName = props.tags.filter((item) => item.tag === tagInput)
    // 如果标签存在，直接返回
    if (sameTagName.length) {
      message.warning('该标签已存在！')
      return
    }
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    db.collection('tags')
      .add({
        tag: tagInput
      })
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        setTagInput('')
        message.success('添加标签成功！')
        getAllTags()
      })
  }
  const deleteTagFrom = (dbName, theTag) => {
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    // const text = dbName === 'articles' ? '文章' : '草稿';
    db.collection(dbName)
      .where({
        tags: _.all([theTag])
      })
      .update({
        tags: _.pull(theTag)
      })
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') return
        getAllArticles(dbName)
      })
  }
  // 删除标签
  const deleteTag = (id, theTag) => {
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    // 删除标签数据库中的标签
    db.collection('tags')
      .doc(id)
      .remove()
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        message.success('删除标签成功！')
        getAllTags()
      })
    // 删除该标签下所有文章的相应标签
    deleteTagFrom('articles', theTag)
    // 删除该标签下所有草稿的相应标签
    deleteTagFrom('drafts', theTag)
  }
  const editTagFrom = async (dbName) => {
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    // 修改该标签下所有文章的相应标签,分两步:
    // （1）在有该便签的所有文章下，添加修改后的标签
    // const text = dbName === 'articles' ? '文章' : '草稿';
    await db
      .collection(dbName)
      .where({
        tags: _.all([oldTag])
      })
      .update({
        tags: _.addToSet(tagEditInput)
      })
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') return
      })
    // （2）在有该便签的所有文章下，删除该标签
    db.collection(dbName)
      .where({
        tags: _.all([oldTag])
      })
      .update({
        tags: _.pull(oldTag)
      })
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') return
        // message.success(`更新${text}标签成功！`);
        getAllArticles(dbName)
      })
  }
  // 对话框确认：编辑标签
  const editTag = async () => {
    // 判断是否存在
    const sameTagName = props.tags.filter((item) => item.tag === tagEditInput)
    // 如果标签存在，直接返回
    if (sameTagName.length) {
      message.warning('该标签已存在！')
      return
    }
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    // 修改标签数据库中的标签
    db.collection('tags')
      .doc(tagId)
      .update({
        tag: tagEditInput
      })
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        message.success('修改标签成功！')
        setTagEditVisible(false)
        getAllTags()
        clearAllState()
      })
    editTagFrom('articles')
    editTagFrom('drafts')
  }
  // 双击标签，打开标签对话框
  const openEditModal = (id, theTag) => {
    setTagEditInput(theTag)
    setOldTag(theTag)
    setTagId(id)
    setTagEditVisible(true)
  }
  // 对话框取消
  const tagEditCancel = () => {
    setTagEditVisible(false)
    clearAllState()
  }
  return (
    <div className='bg-white hover-shadow-black p-10 h-300 w-310 br-10'>
      <div className='fs-20 u-select-no'>标签</div>
      <div className='fs-16 my-10 center'>
        <input
          type='text'
          placeholder='请输入新的标签...'
          className='flex-1 border px-10 h-36 hover-shadow-blue'
          onKeyUp={(e) => {
            if (e.keyCode === 13) addTag()
          }}
          value={tagInput}
          onChange={(e) => {
            setTagInput(e.target.value)
          }}
        />
        <div className='h-36 w-60 center bg-blue white hover-bg hover-shadow-blue' onClick={addTag}>
          新建
        </div>
      </div>
      <div className='w-310 wrap'>
        <Modal title='修改标签' centered open={tagEditVisible} onOk={editTag} onCancel={tagEditCancel} width={400} okText='确认' cancelText='取消'>
          <input
            type='text'
            className='border px-10 fs-16 w-1p hover-shadow-blue'
            value={tagEditInput}
            onChange={(e) => setTagEditInput(e.target.value)}
            onKeyUp={(e) => {
              if (e.keyCode === 13) editTag()
            }}
          />
        </Modal>
        {props.tags.map((item, index) => (
          <div
            className='center h-36 mr-6 p-10 hover-shadow-black scale-big black mb-10'
            style={{ backgroundColor: tagColor[(index + 1) % colorLen] }}
            onDoubleClick={() => openEditModal(item._id, item.tag)}
            key={item._id}
          >
            {item.tag}
            <Popconfirm placement='top' title='确定要删除该标签吗？' onConfirm={() => deleteTag(item._id, item.tag)} okText='Yes' cancelText='No'>
              <CloseOutlined className='fs-14 ml-6' />
            </Popconfirm>
          </div>
        ))}
      </div>
    </div>
  )
}

export default connect(
  (state) => ({
    tags: state.tags
  }),
  {
    getTags,
    getArticles,
    getDrafts
  }
)(Tag)
