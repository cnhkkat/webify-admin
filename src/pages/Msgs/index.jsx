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
      title: 'åå®¹',
      dataIndex: 'content',
      key: '_id',
      render: (text) => <p className='msgs-content'>{text}</p>
    },
    {
      title: 'æµç§°',
      dataIndex: 'name',
      key: '_id',
      render: (text) => <strong>{text === 'rashu' ? 'rashuð' : text}</strong>
    },
    {
      title: 'èç³»é®ç®±',
      dataIndex: 'email',
      key: '_id'
    },
    {
      title: 'ç½å',
      dataIndex: 'link',
      key: '_id',
      render: (text) => (
        <a href={text} target='_blank' rel='noreferrer'>
          {text}
        </a>
      )
    },
    {
      title: 'ç±»å',
      key: '_id',
      render: (record) => <>{record.postTitle ? (record.replyId ? 'è¯è®ºãåå¤ã' : 'è¯è®º') : record.replyId ? 'çè¨ãåå¤ã' : 'çè¨'}</>
    },
    {
      title: 'æ¥æ',
      dataIndex: 'date',
      key: '_id',
      sorter: (a, b) => a.date - b.date,
      render: (text) => <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>,
      sortDirections: ['descend'],
      defaultSortOrder: ['ascend']
    },

    {
      title: 'æä½',
      key: '_id',
      render: (record) => (
        <Space size='middle'>
          <Button type='primary'>
            <a href={record.postTitle ? `${blogUrl}/post?title=${record.postTitle}` : `${blogUrl}/msg`} target='_blank' rel='noreferer noreferrer'>
              æ¥ç
            </a>
          </Button>
          <Popconfirm placement='topRight' title='ç¡®å®è¦å é¤è¯¥è¯è®ºåï¼' onConfirm={() => deleteMsg(record._id)} okText='Yes' cancelText='No'>
            <Button type='primary' danger>
              å é¤
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

  // å é¤è¯è®º
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
          message: 'å é¤æå',
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
