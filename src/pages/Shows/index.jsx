import { useState } from 'react'
import { Modal, Table, message, notification, Popconfirm, Space, Button } from 'antd'
import { PictureOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { getShows } from '../../redux/actions'
import { db, auth } from '../../utils/cloudBase'
import { visitorText, adminUid } from '../../utils/constants'

const Shows = (props) => {
  const [tableLoading, setTableLoading] = useState(false)
  const columns = [
    {
      title: 'Order',
      dataIndex: 'order',
      key: '_id'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: '_id',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Desc',
      dataIndex: 'desc',
      key: '_id'
    },
    {
      title: 'Cover',
      dataIndex: 'cover',
      key: '_id',
      render: (text) => <img src={text} className='w-300 h-300' alt='' />
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
      title: '操作',
      key: '_id',
      render: (record) => (
        <Space size='middle'>
          <Button type='primary' onClick={() => editProject(record._id)}>
            修改
          </Button>

          <Popconfirm placement='topRight' title='确定删除该项目吗？' onConfirm={() => deleteProject(record._id)} okText='Yes' cancelText='No'>
            <Button type='primary' danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]
  const getAllShows = () => {
    setTableLoading(true)
    db.collection('shows')
      .limit(1000)
      .get()
      .then((res) => {
        res.data.sort((a, b) => a.order - b.order)
        props.getShows(res.data)
        setTableLoading(false)
      })
  }

  const [showVisible, setShowVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [cover, setCover] = useState('')
  const [link, setLink] = useState('')
  const [order, setOrder] = useState('')

  const afterShowChange = (isEdit) => {
    getAllShows()
    projectCancel()
    const message = isEdit ? '修改作品成功' : '添加作品成功'
    const icon = isEdit ? <EditOutlined style={{ color: 'blue' }} /> : <PictureOutlined style={{ color: 'blue' }} />
    notification.open({
      message,
      icon,
      placement: 'bottomLeft',
      duration: 1.5
    })
  }
  const projectOK = () => {
    if (!name || !desc || !cover || !link) {
      message.info('请输入完整作品信息！')
      return
    }
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    if (isEdit) {
      // 编辑
      db.collection('shows')
        .doc(id)
        .update({
          name,
          desc,
          cover,
          link,
          order
        })
        .then((res) => {
          if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
            message.warning(visitorText)
            return
          }
          afterShowChange(1)
        })
    } else {
      // 添加
      db.collection('shows')
        .add({
          name,
          desc,
          cover,
          link,
          order
        })
        .then((res) => {
          if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
            message.warning(visitorText)
            return
          }
          afterShowChange(0)
        })
    }
  }

  const projectCancel = () => {
    clearShowInput()
    setShowVisible(false)
    setIsEdit(false)
  }

  const clearShowInput = () => {
    setId('')
    setName('')
    setDesc('')
    setCover('')
    setLink('')
    setOrder('')
  }

  const editProject = (ID) => {
    setId(ID)
    // 打开对话框
    setShowVisible(true)
    // 打开编辑状态
    setIsEdit(true)
    const showObj = props.shows.filter((item) => item._id === ID)[0]
    const { name, desc, cover, link, order } = showObj
    setName(name)
    setDesc(desc)
    setCover(cover)
    setLink(link)
    setOrder(order)
  }

  const deleteProject = (ID) => {
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    db.collection('shows')
      .doc(ID)
      .remove()
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        getAllShows()
        notification.open({
          message: '删除作品成功',
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
          onClick={() => setShowVisible(true)}
        >
          添加作品
        </div>
        <Modal title='添加作品' open={showVisible} onOk={projectOK} onCancel={projectCancel}>
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
            <div className='justify-around h-40'>
              <div className='w-50 text-right bold mr-6'>cover:</div>
              <input
                className='px-10 flex-1 b-no border'
                type='text'
                value={cover}
                onChange={(e) => {
                  setCover(e.target.value)
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
              <div className='w-50 text-right bold mr-6'>order:</div>
              <input
                className='px-10 flex-1 b-no border'
                type='text'
                value={order}
                onChange={(e) => {
                  setOrder(e.target.value)
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
        dataSource={props.shows}
        rowKey={(columns) => columns._id}
        showSorterTooltip={true}
      />
    </>
  )
}
export default connect((state) => ({ shows: state.shows }), { getShows })(Shows)
