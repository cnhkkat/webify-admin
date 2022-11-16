import { useState } from 'react'
import { message, Table, Tag, Space, Button, Popconfirm, notification } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { getDrafts } from '../../redux/actions'
import moment from 'moment'
import { db, auth } from '../../utils/cloudBase'
import { visitorText, adminUid } from '../../utils/constants'
import { useNavigate } from 'react-router-dom'

const Drafts = (props) => {
  // ——————————————————————渲染草稿表格——————————————————————
  const navigate = useNavigate()
  const [tableLoading, setTableLoading] = useState(false)
  // 表头
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: '_id',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: '保存日期',
      dataIndex: 'date',
      key: '_id',
      sorter: (a, b) => a.date - b.date,
      render: (text) => <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>,
      sortDirections: ['descend'],
      defaultSortOrder: ['ascend']
    },
    {
      title: '分类',
      dataIndex: 'classes',
      key: '_id',
      render: (text) => (
        <>
          <Tag color='#03a9f7'>{text}</Tag>
        </>
      )
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: '_id',
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'orange' : 'green'
            return (
              <Tag color={color} key={tag}>
                {tag}
              </Tag>
            )
          })}
        </>
      )
    },
    {
      title: 'URL',
      dataIndex: 'url',
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
          <Button type='primary' onClick={() => editDraft(record._id)}>
            修改
          </Button>

          <Popconfirm placement='topRight' title='确定要删除该文章吗？' onConfirm={() => deleteDraft(record._id)} okText='Yes' cancelText='No'>
            <Button type='primary' danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]
  // 获取所有最新草稿，并保存到redux
  const getNewDrafts = () => {
    setTableLoading(true)
    db.collection('drafts')
      .limit(1000)
      .get()
      .then((res) => {
        props.getDrafts(res.data)
        setTableLoading(false)
      })
  }
  // ——————————————————————渲染草稿表格end——————————————————————

  // ——————————————————————对草稿的操作——————————————————————
  // 编辑草稿
  const editDraft = (id) => {
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    // 跳转到添加文章页面，并传入该文章id
    navigate(`/addArticle?id=${id}&isDraft=1`)
  }
  // 删除草稿
  const deleteDraft = (id) => {
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    db.collection('drafts')
      .doc(id)
      .remove()
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        // 删除成功，提示消息
        notification.open({
          message: '删除成功',
          icon: <DeleteOutlined style={{ color: 'blue' }} />,
          placement: 'bottomLeft',
          duration: 1.5
        })
        // 获取最新草稿数据
        getNewDrafts()
      })
  }
  // ——————————————————————对草稿的操作end——————————————————————

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
        dataSource={props.drafts}
        rowKey={(columns) => columns._id}
        showSorterTooltip={false}
      />
    </>
  )
}

export default connect((state) => ({ drafts: state.drafts }), { getDrafts })(Drafts)
