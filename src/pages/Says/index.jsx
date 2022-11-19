import { useState } from 'react'
import { connect } from 'react-redux'
import { Modal, notification, Table, Space, Button, Popconfirm, message } from 'antd'
import { FormOutlined, MessageOutlined, DeleteOutlined } from '@ant-design/icons'
import moment from 'moment'

import { db, auth } from '../../utils/cloudBase'
import { getSays } from '../../redux/actions'
import { visitorText, adminUid } from '../../utils/constants'

const Says = (props) => {
  const [tableLoading, setTableLoading] = useState(false)
  const [addSayVisible, setAddSayVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [id, setId] = useState('')
  const [date, setDate] = useState('')
  const [content, setContent] = useState('')

  const columns = [
    {
      title: '发布日期',
      dataIndex: 'date',
      key: '_id',
      sorter: (a, b) => a.date - b.date,
      render: (text) => <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>,
      sortDirections: ['ascend'],
      defaultSortOrder: ['descend']
    },
    {
      title: '说说内容',
      dataIndex: 'content',
      key: '_id',
      width: '500px',
      render: (text) => <p>{text}</p>
    },
    {
      title: '操作',
      key: '_id',
      width: '500px',
      render: (record) => (
        <Space size='middle'>
          <Button type='primary' onClick={() => editSay(record._id)}>
            修改
          </Button>
          <Popconfirm placement='topRight' title='确定要删除该说说吗？' onConfirm={() => deleteSay(record._id)} okText='Yes' cancelText='No'>
            <Button type='primary' danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const getAllSays = () => {
    setTableLoading(true)
    db.collection('says')
      .limit(1000)
      .get()
      .then((res) => {
        props.getSays(res.data)
        setTableLoading(false)
      })
  }

  const clearSayInput = () => {
    setId('')
    setDate('')
    setContent('')
  }

  const addSayOK = () => {
    if (!content) {
      message.info('内容不能为空哦！')
      return
    }
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    if (isEdit) {
      updateSay()
    } else {
      addSay()
    }
  }

  const addSayCancel = () => {
    setAddSayVisible(false)
    clearSayInput()
    setIsEdit(false)
  }

  const afterSayChange = (isEdit) => {
    const message = isEdit ? '更新说说成功' : '发表说说成功'
    const icon = isEdit ? <FormOutlined style={{ color: 'blue' }} /> : <MessageOutlined style={{ color: 'blue' }} />
    getAllSays()
    addSayCancel()
    notification.open({
      message,
      icon,
      placement: 'bottomLeft',
      duration: 1.5
    })
  }

  // 添加说说
  const addSay = () => {
    db.collection('says')
      .add({
        content,
        date: new Date().getTime()
      })
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        afterSayChange(false)
      })
  }

  //更新说说
  const updateSay = () => {
    db.collection('says')
      .doc(id)
      .update({
        content,
        date
      })
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        afterSayChange(true)
      })
  }

  //编辑说说
  const editSay = (ID) => {
    setId(ID)
    setIsEdit(true)
    setAddSayVisible(true)
    const sayObj = props.says.filter((item) => item._id === ID)[0]
    const { content, date } = sayObj
    setContent(content)
    setDate(date)
  }

  // 删除说说
  const deleteSay = (ID) => {
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    db.collection('says')
      .doc(ID)
      .remove()
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        getAllSays()
        notification.open({
          message: '删除说说成功',
          icon: <DeleteOutlined style={{ color: 'blue' }} />,
          placement: 'bottomLeft',
          duration: 1.5
        })
      })
  }

  return (
    <>
      <div className='ml-100 pt-20 mb-10'>
        <div
          className='h-40 w-90 fs-16 white center bg-blue hover-bg br-20 ml-30 hover-shadow-blue u-select-no'
          onClick={() => setAddSayVisible(true)}
        >
          发布说说
        </div>
        <Modal title={isEdit ? '更新说说' : '发表说说'} open={addSayVisible} onOk={addSayOK} onCancel={addSayCancel}>
          <textarea
            className='h-120 w-1p b-no p-10 border fs-16 hover-shadow-blue'
            type='text'
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
            }}
          />
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
        dataSource={props.says}
        rowKey={(columns) => columns._id}
        showSorterTooltip={true}
      ></Table>
    </>
  )
}
export default connect((state) => ({ says: state.says }), { getSays })(Says)
