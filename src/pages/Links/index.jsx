import { useState } from 'react'
import { Modal, notification, Table, Space, Button, Popconfirm, message } from 'antd'
import { UserOutlined, DeleteOutlined, UserSwitchOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { getLinks } from '../../redux/actions'
import { db, auth } from '../../utils/cloudBase'
import { visitorText, adminUid } from '../../utils/constants'

const Links = (props) => {
  const [tableLoading, setTableLoading] = useState(false)
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: '_id',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: '_id',
      render: (text) => (
        <a href={text} target='_blank' rel='noreferrer'>
          {text}
        </a>
      )
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: '_id'
    },
    {
      title: 'Desc',
      dataIndex: 'desc',
      key: '_id'
    },
    {
      title: '操作',
      key: '_id',
      render: (record) => (
        <Space size='middle'>
          <Button type='primary' onClick={() => editLink(record._id)}>
            修改
          </Button>

          <Popconfirm placement='topRight' title='确定要删除该友链吗？' onConfirm={() => deleteLink(record._id)} okText='Yes' cancelText='No'>
            <Button type='primary' danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const getLinksData = () => {
    setTableLoading(true)
    db.collection('links')
      .limit(1000)
      .get()
      .then((res) => {
        props.getLinks(res.data)
        setTableLoading(false)
      })
  }
  const [addLinkVisible, setAddLinkVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [link, setLink] = useState('')
  const [avatar, setAvatar] = useState('')
  const [desc, setDesc] = useState('')

  const addLinkOK = () => {
    if (!name || !link || !avatar || !desc) {
      message.info('请输入完整友链信息！')
      return
    }
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    if (isEdit) {
      // 更新友链
      updateLink()
    } else {
      // 添加友链
      addLink()
    }
  }

  const clearLinkInput = () => {
    setId('')
    setName('')
    setLink('')
    setAvatar('')
    setDesc('')
  }

  const addLinkCancel = () => {
    setAddLinkVisible(false)
    clearLinkInput()
    setIsEdit(false)
  }

  const afterLinkChange = (isEdit) => {
    const message = isEdit ? '更新友链成功' : '添加友链成功'
    const icon = isEdit ? <UserSwitchOutlined style={{ color: 'blue' }} /> : <UserOutlined style={{ color: 'blue' }} />
    // 获取所有友链
    getLinksData()
    addLinkCancel()
    notification.open({
      message,
      icon,
      placement: 'bottomLeft',
      duration: 1.5
    })
  }

  const addLink = () => {
    // 添加友链
    db.collection('links')
      .add({
        name,
        link,
        avatar,
        desc
      })
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        afterLinkChange(false)
      })
  }

  const updateLink = () => {
    // 修改友链
    db.collection('links')
      .doc(id)
      .update({
        name,
        link,
        avatar,
        desc
      })
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        afterLinkChange(1)
      })
  }

  const editLink = (ID) => {
    setId(ID)
    setIsEdit(true)
    setAddLinkVisible(true)
    const linkObj = props.links.filter((item) => item._id === ID)[0]
    const { name, link, avatar, desc } = linkObj
    setName(name)
    setLink(link)
    setAvatar(avatar)
    setDesc(desc)
  }

  const deleteLink = (id) => {
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    db.collection('links')
      .doc(id)
      .remove()
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        getLinksData()
        notification.open({
          message: '删除友链成功',
          icon: <DeleteOutlined style={{ color: 'blue' }} />,
          placement: 'bottomLeft',
          duration: 1.5
        })
      })
  }

  return (
    <>
      <div className='ml-100 pt-20'>
        <div
          className='h-40 w-90 fs-16 white center bg-blue hover-bg br-20 ml-30 mb-10 hover-shadow-blue u-select-no'
          onClick={() => setAddLinkVisible(true)}
        >
          添加友链
        </div>
        <Modal title={isEdit ? '修改友链' : '添加友链'} open={addLinkVisible} onOk={addLinkOK} onCancel={addLinkCancel}>
          <div className='column'>
            <div className='justify-around h-40'>
              <div className='w-50 text-right bold mr-6'>name:</div>
              <input
                className='px-10 flex-1 b-no border'
                type='text'
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                }}
              />
            </div>
            <div className='justify-around h-40'>
              <div className='w-50 text-right bold mr-6'>link:</div>
              <input
                className='px-10 flex-1 b-no border'
                type='text'
                value={link}
                onChange={(e) => {
                  setLink(e.target.value)
                }}
              />
            </div>
            <div className='justify-around h-40'>
              <div className='w-50 text-right bold mr-6'>avatar:</div>
              <input
                className='px-10 flex-1 b-no border'
                type='text'
                value={avatar}
                onChange={(e) => {
                  setAvatar(e.target.value)
                }}
              />
            </div>
            <div className='justify-around h-40'>
              <div className='w-50 text-right bold mr-6'>desc:</div>
              <input
                className='px-10 flex-1 b-no border'
                type='text'
                value={desc}
                onChange={(e) => {
                  setDesc(e.target.value)
                }}
              />
            </div>
          </div>
        </Modal>
      </div>
      <Table
        size='middle'
        className='ml-100'
        bordered
        loading={tableLoading}
        pagination={{
          position: ['bottomCenter'],
          defaultPageSize: 8,
          hideOnSinglePage: true,
          showTitle: false,
          size: ['small']
        }}
        columns={columns}
        dataSource={props.links}
        rowKey={(columns) => columns._id}
        showSorterTooltip={true}
      />
    </>
  )
}

export default connect((state) => ({ links: state.links }), { getLinks })(Links)
