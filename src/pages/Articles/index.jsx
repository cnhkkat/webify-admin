import { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Table, Tag, Space, Button, Popconfirm, notification, Select, message } from 'antd'
import { DeleteOutlined, RedoOutlined } from '@ant-design/icons'
import moment from 'moment'
import { db, _, auth } from '../../utils/cloudBase'
import { isContained } from '../../utils/functions'
import { getClasses, getArticles, getMsgs } from '../../redux/actions'
import { visitorText, adminUid } from '../../utils/constants'
import { useNavigate, useLocation } from 'react-router-dom'
import './index.css'

const { Option } = Select
const Articles = ({ tags, classes, articles, getClasses, getArticles, getMsgs }) => {
  const navigate = useNavigate()
  // ——————————————————————搜索框——————————————————————
  const searchWords = useRef()
  const [searchClass, setSearchClass] = useState(null)
  const [searchTag, setSearchTag] = useState([])
  // 通过输入文字搜索
  const searchByWords = () => {
    setSearchClass(null)
    setSearchTag([])
    const keyWords = searchWords.current.value.toLowerCase()
    // 如果输入框内容为空，则展示所有文章
    if (!keyWords) {
      setArticlesShow(articles)
      return
    }
    // 过滤出搜索到的文章
    const newArticlesShow = articles.filter((item) => item.title.toLowerCase().indexOf(keyWords) !== -1)
    // 将搜索到的文章，放入要显示的state
    setArticlesShow(newArticlesShow)
  }
  // 通过选择分类搜索
  const searchByClass = (classesName) => {
    searchWords.current.value = ''
    setSearchTag([])
    if (!classesName) {
      setArticlesShow(articles)
      return
    }
    const newArticlesShow = articles.filter((item) => item.classes === classesName)
    setArticlesShow(newArticlesShow)
  }
  // 通过选择标签搜索
  const searchByTag = (tagsArr) => {
    searchWords.current.value = ''
    setSearchClass(null)
    if (tagsArr.length === 0) {
      setArticlesShow(articles)
      return
    }
    const articlesLen = articles.length
    const articlesByTag = []
    for (let i = 0; i < articlesLen; i++) {
      if (isContained(articles[i].tags, tagsArr)) {
        articlesByTag.push(articles[i])
      }
    }
    setArticlesShow(articlesByTag)
  }
  // 清空搜索内容
  const resetSearch = () => {
    searchWords.current.value = ''
    setSearchClass(null)
    setSearchTag([])
    setArticlesShow(articles)
  }
  // ————————————————————搜索框end————————————————————————

  // ——————————————————————渲染文章表格——————————————————————
  // 需要展示文章的state
  const [articlesShow, setArticlesShow] = useState([])
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
      title: '发布日期',
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
          <Tag color='#2db7f5'>{text}</Tag>
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
            let color = tag.length > 5 ? 'geekblue' : 'green'
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
          <Button type='primary' onClick={() => editArticle(record._id)}>
            修改
          </Button>

          <Popconfirm
            placement='topRight'
            title='确定要删除该文章吗？'
            onConfirm={() => {
              if (auth.currentUser.uid !== adminUid) {
                message.warning(visitorText)
                return
              }
              deleteArticle(record._id)
              classMinOne(record.classes)
              deleteMsgs(record.titleEng)
            }}
            okText='Yes'
            cancelText='No'
          >
            <Button type='primary' danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]
  // 获取最新所有文章，并放入redux
  const getNewArticles = () => {
    setTableLoading(true)
    db.collection('articles')
      .limit(1000)
      .get()
      .then((res) => {
        getArticles(res.data)
        setTableLoading(false)
      })
  }
  // redux中文章数据更新，当前页面的state更新
  useEffect(() => {
    // 用作展示的state
    setArticlesShow(articles)
  }, [articles])
  // ————————————————————渲染文章表格end——————————————————————————

  // ——————————————————————对文章的操作——————————————————————
  // 删除文章
  const deleteArticle = (id) => {
    db.collection('articles')
      .doc(id)
      .remove()
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        // 获取最新文章数据
        getNewArticles()
        // 删除成功，提示消息
        notification.open({
          message: '删除成功',
          icon: <DeleteOutlined style={{ color: 'blue' }} />,
          placement: 'bottomLeft',
          duration: 1.5
        })
      })
  }
  // 向数据库获取所有分类
  const getAllClasses = () => {
    db.collection('classes')
      .limit(1000)
      .get()
      .then((res) => {
        getClasses(res.data)
      })
  }
  // 相应分类数目-1
  const classMinOne = (oldClass) => {
    // console.log(oldClass);
    db.collection('classes')
      .where({ class: oldClass })
      .update({
        count: _.inc(-1)
      })
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') return
        getAllClasses()
      })
  }
  // 修改文章
  const editArticle = (id) => {
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }
    // 跳转到添加文章页面，并传入该文章id
    navigate(`/addArticle?id=${id}&isDraft=`)
  }
  // 添加文章：转到新建文章页面
  const turnAddPage = () => {
    // history.push('/pages/addArticle')
    navigate('/addArticle')
  }
  // ———————————————————————对文章的操作end—————————————————————————

  // 删除相应评论/回复
  const deleteMsgs = (titleEng) => {
    db.collection('allComments')
      .where({
        postTitle: _.eq(titleEng)
      })
      .remove()
      .then(() => {
        // 获取最新评论数据
        getAllMsgs()
        // 删除成功，提示消息
        message.success('删除相应评论成功！')
      })
  }

  const getAllMsgs = () => {
    db.collection('allComments')
      .limit(1000)
      .get()
      .then((res) => {
        getMsgs(res.data)
      })
  }

  return (
    <>
      <div className='searchBox'>
        <div className='addArticleBtn' onClick={turnAddPage}>
          写文章
        </div>
        <input type='text' ref={searchWords} className='Search' placeholder='输入文章标题...' onChange={searchByWords} />

        <Select
          showSearch
          allowClear
          style={{ width: '200px' }}
          placeholder='请选择文章分类'
          className='searchClass'
          value={searchClass}
          onChange={(value) => {
            searchByClass(value)
            setSearchClass(value)
          }}
        >
          {classes.map((item) => (
            <Option key={item.class}>{item.class}</Option>
          ))}
        </Select>
        <Select
          mode='multiple'
          showSearch
          showArrow
          allowClear
          style={{ width: '200px' }}
          placeholder='请选择文章标签'
          className='searchTag'
          value={searchTag}
          onChange={(value) => {
            searchByTag(value)
            setSearchTag(value)
          }}
        >
          {tags.map((item) => (
            <Option key={item.tag}>{item.tag}</Option>
          ))}
        </Select>
        <div className='resetBtn' onClick={resetSearch}>
          <RedoOutlined />
        </div>
      </div>
      <Table
        // size='middle'
        className='Table'
        bordered
        loading={tableLoading}
        pagination={{
          position: ['bottomCenter'],
          defaultPageSize: 11,
          hideOnSinglePage: true,
          showTitle: false,
          size: ['small']
        }}
        columns={columns}
        dataSource={articlesShow}
        rowKey={(columns) => columns._id}
        showSorterTooltip={false}
      />
    </>
  )
}

export default connect(
  (state) => ({
    tags: state.tags,
    classes: state.classes,
    articles: state.articles
  }),
  { getClasses, getArticles, getMsgs }
)(Articles)
