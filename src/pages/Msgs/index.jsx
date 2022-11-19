import { useState } from 'react'
import { connect } from 'react-redux'
import { notification, Table, Space, Button, Popconfirm, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import moment from 'moment'

import { db, auth } from '../../utils/cloudBase'
import { getMsgs } from '../../redux/actions'
import { blogUrl, visitorText, adminUid } from '../../utils/constants'

const Msgs = (props) => {
  const [tableLoading, setTableLoading] = useState(false)

  const columns = [
    {
      title: '内容',
      dataIndex: 'content',
      key: '_id',
      render: (text) => <p className='msgs-content'>{text}</p>
    },
    {
      title: '昵称',
      dataIndex: 'name',
      key: '_id',
      render: (text) => <strong>{text === 'rashu' ? 'rashu🍉' : text}</strong>
    },
    {
      title: '联系邮箱',
      dataIndex: 'email',
      key: '_id'
    },
    {
      title: '网址',
      dataIndex: 'link',
      key: '_id',
      render: (text) => (
        <a href={text} target='_blank' rel='noreferrer'>
          {text}
        </a>
      )
    },
    {
      title: '类型',
      key: '_id',
      render: (record) => <>{record.postTitle ? (record.replyId ? '评论「回复」' : '评论') : record.replyId ? '留言「回复」' : '留言'}</>
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: '_id',
      sorter: (a, b) => a.date - b.date,
      render: (text) => <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>,
      sortDirections: ['descend'],
      defaultSortOrder: ['ascend']
    },

    {
      title: '操作',
      key: '_id',
      render: (record) => (
        <Space size='middle'>
          <Button type='primary'>
            <a href={record.postTitle ? `${blogUrl}/post?title=${record.postTitle}` : `${blogUrl}/msg`} target='_blank' rel='noreferer noreferrer'>
              查看
            </a>
          </Button>
          <Popconfirm placement='topRight' title='确定要删除该评论吗？' onConfirm={() => deleteMsg(record._id)} okText='Yes' cancelText='No'>
            <Button type='primary' danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const getAllMsgs = () => {
    setTableLoading(true)
    db.collection('allComments')
      .limit(1000)
      .get()
      .then((res) => {
        props.getMsgs(res.data)
        setTableLoading(false)
      })
  }

  // 删除评论
  const deleteMsg = (ID) => {
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    db.collection('allComments')
      .doc(ID)
      .remove()
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        getAllMsgs()
        notification.open({
          message: '删除成功',
          icon: <DeleteOutlined style={{ color: 'blue' }} />,
          placement: 'bottomLeft',
          duration: 1.5
        })
      })
  }

  return (
    <>
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
        dataSource={props.msgs}
        rowKey={(columns) => columns._id}
        showSorterTooltip={true}
      ></Table>
    </>
  )
}
export default connect((state) => ({ msgs: state.msgs }), { getMsgs })(Msgs)
