import { NavLink } from 'react-router-dom'
import './index.css'

const Nav = () => {
  const router = [
    {
      to: '/',
      content: '首页'
    },
    {
      to: '/articles',
      content: '文章'
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
      content: '留言板'
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
      to: '/about',
      content: '关于'
    },
    {
      to: '/logs',
      content: '日志'
    },
    {
      to: '/drafts',
      content: '草稿箱'
    }
  ]
  return (
    <div className='NavBox'>
      <div className='appName'>Ra薯小站</div>
      <ul className='funcBtns'>
        {router.map((item, index) => (
          <li key={index}>
            <NavLink to={item.to} className={({ isActive }) => (isActive ? 'navActive funcLi' : 'funcLi')}>
              {item.content}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Nav
