import { useState } from 'react'
import { auth } from '../../../utils/cloudBase'
import { connect } from 'react-redux'
import { login } from '../../../redux/actions'
import { notification } from 'antd'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons'
import { avatarUrl, visitorEmail, visitorPwd } from '../../../utils/constants'

const LoginBox = (props) => {
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')

  const openNotification = (state) => {
    const message = state ? '登录成功' : '登录失败'
    const description = state ? '欢迎进入博客后台管理系统' : '用户名或密码不正确，请重新登录！'
    const icon = state ? <CheckOutlined style={{ color: 'blue' }} /> : <CloseOutlined style={{ color: 'red' }} />

    notification.open({
      message,
      description,
      icon,
      placement: 'topRight',
      duration: 1.5
    })
  }

  const onLogin = (isVisitor) => {
    const EMAIL = isVisitor ? visitorEmail : email
    const PWD = isVisitor ? visitorPwd : pwd
    auth
      .signInWithEmailAndPassword(EMAIL, PWD)
      .then(() => {
        props.login(true)
        openNotification(true)
      })
      .catch(() => {
        props.login(false)
        openNotification(false)
      })
  }

  return (
    <div className='w-400 h-300 bg-orange shadow m-auto px-10 pt-90 relative br-20'>
      <img src={avatarUrl} alt='avatar' className='w-120 h-120 shadow position-center absolute br-50' />
      <div className='hover-bg hover-shadow-blue flex'>
        <div className='w-90 bg-blue  center fs-20 u-select-no'>邮箱</div>
        <input type='text' className='px-10 b-no w-310' value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className='hover-bg hover-shadow-blue flex mt-10'>
        <div className='w-90 bg-blue center fs-20 u-select-no'>密码</div>
        <input type='password' className='px-10 b-no w-310' value={pwd} onChange={(e) => setPwd(e.target.value)} />
      </div>
      <div className='justify-around mt-30'>
        <div className='w-120 h-40 br-20 bg-blue center fs-20 hover-bg hover-shadow-blue u-select-no' onClick={() => onLogin(true)}>
          游客
        </div>
        <div className='w-120 h-40 bg-blue br-20 center fs-20 hover-bg hover-shadow-blue u-select-no' onClick={() => onLogin(false)}>
          管理员登录
        </div>
      </div>
    </div>
  )
}

export default connect(() => ({}), { login })(LoginBox)
