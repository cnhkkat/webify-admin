import { useState } from 'react'
import { List, Modal, message, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { getClasses, getArticles } from '../../redux/actions'
import { db, auth } from '../../utils/cloudBase'
import { visitorText, adminUid } from '../../utils/constants'

const Class = (props) => {
  const [classEditVisible, setClassEditVisible] = useState(false)
  const [classInput, setClassInput] = useState('')
  const [classEditInput, setClassEditInput] = useState('')
  const [classId, setClassId] = useState('')
  const [oldClass, setOldClass] = useState('')

  // 获取最新所有文章，并放入redux
  const getNewArticles = () => {
    db.collection('articles')
      .limit(10)
      .get()
      .then((res) => {
        props.getArticles(res.data)
      })
  }
  // 向数据库获取所有分类
  const getAllClasses = () => {
    db.collection('classes')
      .limit(1000)
      .get()
      .then((res) => {
        props.getClasses(res.data)
        getNewArticles()
      })
  }
  // 添加分类
  const addClass = async () => {
    if (!classInput.length) {
      message.info('分类名不能为空！')
      return
    }
    // 判断是否存在
    const sameClassName = props.classes.filter((item) => item.class === classInput)
    // 如果分类存在，直接返回
    if (sameClassName.length) {
      message.warning('该分类已存在！')
      return
    }
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    db.collection('classes')
      .add({
        class: classInput,
        count: 0
      })
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        setClassInput('')
        message.success('添加分类成功！')
        getAllClasses()
      })
  }
  const deleteClassFrom = (dbName, theClass) => {
    if (auth.currentUser.uid !== adminUid) return
    const text = dbName === 'articles' ? '文章' : '草稿'
    db.collection(dbName)
      .where({ classes: theClass })
      .update({
        classes: ''
      })
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') return
        message.success(`更新${text}分类成功！`)
      })
  }
  // 删除分类
  const deleteClass = (id, theClass) => {
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    // 从分类数据库中删除该分类
    db.collection('classes')
      .doc(id)
      .remove()
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        message.success('删除分类成功！')
        getAllClasses()
      })
    // 删除该分类下所有文章的分类属性
    deleteClassFrom('articles', theClass)
    // 删除该分类下所有草稿的分类属性
    deleteClassFrom('drafts', theClass)
  }
  // 清空ID、编辑输入框、旧分类名
  const clearAllState = () => {
    setClassEditInput('')
    setOldClass('')
    setClassId('')
  }
  // 对话框取消
  const classEditCancel = () => {
    setClassEditVisible(false)
    clearAllState()
  }
  const editClassFrom = (dbName) => {
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    const text = dbName === 'articles' ? '文章' : '草稿'
    db.collection(dbName)
      .where({ classes: oldClass })
      .update({
        classes: classEditInput
      })
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') return
        message.success(`更新${text}分类成功！`)
      })
  }
  // 对话框确认：编辑分类
  const editClass = async () => {
    // 判断是否存在
    const sameClassName = props.classes.filter((item) => item.class === classEditInput)
    // 如果分类存在，直接返回
    if (sameClassName.length) {
      message.warning('该分类已存在！')
      return
    }
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    // 修改分类数据库中的数据
    db.collection('classes')
      .doc(classId)
      .update({
        class: classEditInput
      })
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        message.success('修改分类成功！')
        setClassEditVisible(false)
        getAllClasses()
        clearAllState()
      })
    // 修改该分类下所有文章的分类名
    editClassFrom('articles')
    // 修改该分类下所有草稿的分类名
    editClassFrom('drafts')
  }
  // 打开分类对话框
  const openEditModal = (id, oldClassName) => {
    setClassEditInput(oldClassName)
    setOldClass(oldClassName)
    setClassId(id)
    setClassEditVisible(true)
  }
  return (
    <div className='w-310 h-300 bg-white hover-shadow-black br-10'>
      <div className='fs-20 u-select-no pt-10 pl-10'>分类</div>
      <div className='fs-16 m-10 center'>
        <input
          type='text'
          placeholder='请输入新的分类...'
          className='flex-1 border px-10 h-36 hover-shadow-blue'
          value={classInput}
          onKeyUp={(e) => {
            if (e.keyCode === 13) addClass()
          }}
          onChange={(e) => setClassInput(e.target.value)}
        />
        <div className='h-36 w-60 center bg-blue white hover-bg hover-shadow-blue' onClick={addClass}>
          新建
        </div>
      </div>
      <div className='h-200 overflow scrollbar'>
        <Modal
          title='修改分类'
          centered
          open={classEditVisible}
          onOk={editClass}
          onCancel={classEditCancel}
          width={300}
          okText='确认'
          cancelText='取消'
        >
          <input
            type='text'
            className='border px-10 fs-16 w-1p hover-shadow-blue'
            value={classEditInput}
            onChange={(e) => setClassEditInput(e.target.value)}
            onKeyUp={(e) => {
              if (e.keyCode === 13) editClass()
            }}
          />
        </Modal>
        <List
          size='small'
          bordered={false}
          dataSource={props.classes}
          renderItem={(item) => (
            <List.Item className='justify-between fs-16 u-select-no'>
              <div className='white w-22 h-22 br-50 bg-blue center'>{item.count}</div>
              <span className='f-basis-160'>《{item.class}》</span>
              <EditOutlined className='hover-blue' onClick={() => openEditModal(item._id, item.class)} />
              <Popconfirm
                placement='top'
                title='确定要删除该分类吗？'
                onConfirm={() => deleteClass(item._id, item.class)}
                okText='Yes'
                cancelText='No'
              >
                <DeleteOutlined className='hover-red' />
              </Popconfirm>
            </List.Item>
          )}
        />
      </div>
    </div>
  )
}

export default connect(
  (state) => ({
    classes: state.classes
  }),
  {
    getClasses,
    getArticles
  }
)(Class)
