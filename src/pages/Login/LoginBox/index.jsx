import { useState } from 'react'
import { auth } from '../../../utils/cloudBase'
import { connect } from 'react-redux'
import { login } from '../../../redux/actions'
import { notification } from 'antd'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons'
import { avatarUrl, visitorEmail, visitorPwd } from '../../../utils/constants'
import './index.css'

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
    <div className='loginBox'>
      <img src={avatarUrl} alt='avatar' className='avatar' />
      <div className='EmailBox'>
        <div className='Email'>邮箱</div>
        <input type='text' className='inputEmail' value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className='pwdBox'>
        <div className='pwd'>密码</div>
        <input type='password' className='inputpwd' value={pwd} onChange={(e) => setPwd(e.target.value)} />
      </div>
      <div className='loginBtn' onClick={() => onLogin(false)}>
        管理员登录
      </div>
      <div className='visitorBtn' onClick={() => onLogin(true)}>
        游客登录
      </div>
    </div>
  )
}

export default connect(() => ({}), { login })(LoginBox)
