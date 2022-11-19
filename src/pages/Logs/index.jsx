import { useState } from 'react'
import { Modal, notification, Table, Space, Button, Popconfirm, message } from 'antd'
import { FormOutlined, MessageOutlined, DeleteOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import moment from 'moment'
import { db, auth } from '../../utils/cloudBase'
import { getLogs } from '../../redux/actions'
import { visitorText, adminUid } from '../../utils/constants'
import marked from 'marked'
import hljs from 'highlight.js'
import '../../github-dark.css'

const Logs = (props) => {
  hljs.configure({
    tabReplace: '',
    classPrefix: 'hljs-',
    languages: ['CSS', 'HTML', 'JavaScript', 'Python', 'TypeScript', 'Markdown']
  })

  marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: (code) => hljs.highlightAuto(code).value,
    gfm: true, //默认为true。 允许 Git Hub标准的markdown.
    tables: true, //默认为true。 允许支持表格语法。该选项要求 gfm 为true。
    breaks: true //默认为false。 允许回车换行。该选项要求 gfm 为true。
  })

  const [tableLoading, setTableLoading] = useState(false)
  const [addLogVisible, setAddLogVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [id, setId] = useState('')
  const [date, setDate] = useState('')
  const [logContent, setLogContent] = useState('')

  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: '_id',
      width: '150px',
      sorter: (a, b) => a.date - b.date,
      render: (text) => <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>,
      sortDirections: ['descend'],
      defaultSortOrder: ['ascend']
    },
    {
      title: '碎片笔记',
      dataIndex: 'logContent',
      width: '800px',
      render: (value) => {
        return <div className='text-left' dangerouslySetInnerHTML={{ __html: marked(value).replace(/<pre>/g, "<pre id='hljs'>") }}></div>
      }
    },
    {
      title: '操作',
      key: '_id',
      render: (record) => (
        <Space size='middle'>
          <Button type='primary' onClick={() => editLog(record._id)}>
            修改
          </Button>

          <Popconfirm placement='topRight' title='确定删除该碎片吗？' onConfirm={() => deleteLog(record._id)} okText='Yes' cancelText='No'>
            <Button type='primary' danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const getAllLogs = () => {
    setTableLoading(true)
    db.collection('logs')
      .limit(1000)
      .get()
      .then((res) => {
        props.getLogs(res.data)
        setTableLoading(false)
      })
  }
  const showAddLog = () => {
    setDate(moment().format('YYYY-MM-DD HH:mm:ss'))
    setAddLogVisible(true)
  }
  const clearLogInput = () => {
    setId('')
    setLogContent('')
    setDate('')
  }

  const addLogOK = () => {
    if (!date) {
      message.info('请输入时间！')
      return
    }
    if (logContent.length === 0) {
      message.info('内容不能为空')
      return
    }
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    if (isEdit) {
      // 更新事件
      updateLog()
    } else {
      // 添加事件
      addLog()
    }
  }
  const addLogCancel = () => {
    setAddLogVisible(false)
    // 清空输入框
    clearLogInput()
    setIsEdit(false)
  }

  const afterLogChange = (isEdit) => {
    const message = isEdit ? '更新成功' : '添加成功'
    const icon = isEdit ? <FormOutlined style={{ color: 'blue' }} /> : <MessageOutlined style={{ color: 'blue' }} />
    // 获取所有事件
    getAllLogs()
    addLogCancel()
    notification.open({
      message,
      icon,
      placement: 'bottomLeft',
      duration: 1.5
    })
  }
  const addLog = () => {
    db.collection('logs')
      .add({
        // date: new Date(date).getTime(),
        date,
        logContent
      })
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        // 添加后的操作
        afterLogChange(false)
      })
  }
  const updateLog = () => {
    db.collection('logs')
      .doc(id)
      .update({
        date: new Date(date).getTime(),
        logContent
      })
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        // 更新后的操作
        afterLogChange(true)
      })
  }

  const editLog = (ID) => {
    setId(ID)
    setIsEdit(true)
    setAddLogVisible(true)
    const logObj = props.logs.filter((item) => item._id === ID)[0]
    const { date, logContent } = logObj
    setDate(moment(date).format('YYYY-MM-DD HH:mm:ss'))
    setLogContent(logContent)
  }
  const deleteLog = (ID) => {
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    db.collection('logs')
      .doc(ID)
      .remove()
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        getAllLogs()
        notification.open({
          message: '删除事件成功',
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
          onClick={() => {
            showAddLog(true)
          }}
        >
          添加碎片
        </div>
        <Modal title={isEdit ? '更新碎片' : '发表碎片'} open={addLogVisible} onOk={addLogOK} onCancel={addLogCancel}>
          <div className='flex'>
            <span className='w-50 bold'>时间:</span>
            <input
              className='b-no border h-48 w-1p pl-10 hover-shadow-blue'
              type='text'
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
              }}
            />
          </div>
          <div className='flex justify-between mt-10'>
            <span className='w-50 bold'>内容:</span>
            <textarea
              className='h-120 w-1p b-no p-10 border fs-16 hover-shadow-blue'
              type='text'
              value={logContent}
              onChange={(e) => {
                setLogContent(e.target.value)
              }}
            />
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
        dataSource={props.logs}
        rowKey={(columns) => columns._id}
        showSorterTooltip={false}
      ></Table>
    </>
  )
}

export default connect((state) => ({ logs: state.logs }), { getLogs })(Logs)
