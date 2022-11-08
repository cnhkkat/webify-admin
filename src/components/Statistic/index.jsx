import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import './index.css'
import { NavLink } from 'react-router-dom'

const Statistic = (props) => {
  const [type, setType] = useState('')
  const [num, setNum] = useState(0)
  useEffect(() => {
    const { articles, drafts, links, msgs, says } = props
    switch (props.type) {
      case 'articles': {
        setType('文章')
        setNum(articles.length)
        break
      }
      case 'drafts': {
        setType('草稿')
        setNum(drafts.length)
        break
      }
      case 'links': {
        setType('友链')
        setNum(links.length)
        break
      }
      case 'msgs': {
        setType('留言')
        setNum(msgs.length)
        break
      }
      case 'says': {
        setType('说说')
        setNum(says.length)
        break
      }
      default: {
        break
      }
    }
  }, [props])
  return (
    <div className='statisticItem'>
      <NavLink to={`/${props.type}`}>
        <div className='type'>{type}数</div>
        <div className='number'>{num}</div>
      </NavLink>
    </div>
  )
}
export default connect(
  (state) => ({
    articles: state.articles,
    drafts: state.drafts,
    links: state.links,
    says: state.says,
    msgs: state.msgs
  }),
  {}
)(Statistic)
