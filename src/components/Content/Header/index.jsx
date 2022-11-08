import { login } from '../../../redux/actions'
import { connect } from 'react-redux'
import { notification, Popconfirm } from 'antd'
import { EnterOutlined, LoginOutlined } from '@ant-design/icons'
import './index.css'
// import { blogUrl } from '../../../utils/constant'

const Header = (props) => {
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
    <div className='HeaderBox'>
      {/* <a href={blogUrl} className='blogBtn' target='_blank' rel='noreferrer'>
        <HomeOutlined />
      </a> */}
      <Popconfirm className='logoutBtn' placement='topRight' title='确定要退出登录吗？' onConfirm={turnLogout} okText='Yes' cancelText='No'>
        <LoginOutlined />
      </Popconfirm>
    </div>
  )
}

export default connect(() => ({}), { login })(Header)
