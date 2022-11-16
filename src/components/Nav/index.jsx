import { NavLink } from 'react-router-dom'
import { notification, Popconfirm } from 'antd'
import { EnterOutlined, LoginOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { login } from '../../redux/actions'

const Nav = (props) => {
  const router = [
    {
      to: '/',
      content: '首页'
    },
    {
      to: '/articles',
      content: '博客'
    },
    {
      to: '/logs',
      content: '碎片'
    },
    // {
    //     to: '/gallery',
    //     content: '图库',
    // },
    {
      to: '/says',
      content: '说说'
    },
    {
      to: '/msgs',
      content: '评论'
    },
    {
      to: '/links',
      content: '友链'
    },
    {
      to: '/shows',
      content: '项目'
    },
    {
      to: '/drafts',
      content: '草稿'
    },
    {
      to: '/about',
      content: '关于'
    }
  ]

  const openLogout = () => {
    notification.open({
      message: '已退出',
      description: '期待再次访问！',
      icon: <EnterOutlined style={{ color: 'blue' }} />,
      placement: 'topRight',
      duration: 1.5
    })
  }
  const turnLogout = () => {
    // 清空本地数据
    localStorage.clear()
    // 改变登录状态
    props.login(false)
    // 提示消息
    openLogout()
  }

  return (
    <>
      <div className='fixed mt-10'>
        <div className='bg-orange fs-20  br-10 p-10 hover-shadow-blue'>Ra薯小站</div>
        <div className='shadow mt-10 column'>
          {router.map((item, index) => (
            <span key={index} className='h-40 center'>
              <NavLink to={item.to} className={({ isActive }) => (isActive ? 'orange' : 'white')}>
                {item.content}
              </NavLink>
            </span>
          ))}
        </div>
      </div>
      <div className='fixed b-30 m-10'>
        {/* <a href={blogUrl} className='' target='_blank' rel='noreferrer'>
        <HomeOutlined />
      </a> */}
        <Popconfirm
          className='w-50 h-40 center fs-20 br-10 black bg-orange  hover-shadow-blue '
          placement='topRight'
          title='确定要退出登录吗？'
          onConfirm={turnLogout}
          okText='Yes'
          cancelText='No'
        >
          <LoginOutlined />
        </Popconfirm>
      </div>
    </>
  )
}

export default connect(() => ({}), { login })(Nav)
