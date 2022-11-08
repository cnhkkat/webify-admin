import { useState, useEffect } from 'react'
import moment from 'moment'
import { avatarUrl, adminUid, visitorAvatar } from '../../utils/constants'
import { auth } from '../../utils/cloudBase'
import './index.css'

const Welcome = () => {
  const [name, setName] = useState('游客')
  const [avatar, setAvatar] = useState(visitorAvatar)
  const [timeText, setTimeText] = useState('')

  useEffect(() => {
    if (auth.currentUser.uid === adminUid) {
      setName('Ra薯')
      setAvatar(avatarUrl)
    }
  }, [])
  useEffect(() => {
    const hour = moment().hours()
    const timeText =
      hour < 6
        ? '凌晨好啊,眼睛要休息啦'
        : hour < 9
        ? '早上好啊,开启幸福的一天哦'
        : hour < 11
        ? '上午好啊,今天心情怎么样'
        : hour < 13
        ? '中午好啊,记得午休哦'
        : hour < 17
        ? '下午好啊,记得喝水哦'
        : hour < 19
        ? '傍晚好啊,出来看看落日吧'
        : hour < 22
        ? '晚上好啊,饭后记得散步哦'
        : '夜深了,早点休息哦'
    setTimeText(timeText)
  }, [])
  return (
    <div className='WelcomeBox'>
      <img src={avatar} alt='头像' className='home-avatar' />
      <span className='welcomeTitle'>
        {timeText} ~ <span>{name}</span>
      </span>
    </div>
  )
}

export default Welcome
