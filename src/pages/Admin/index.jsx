import { useEffect, useState } from 'react'
import Nav from '../../components/Nav'
import Content from '../../components/Content'
import { connect } from 'react-redux'
import { db } from '../../utils/cloudBase'
// import moment from 'moment'
import { getArticles, getClasses, getTags, getDrafts, getSays, getLinks, getShows, getAbout, getLogs, getMsgs } from '../../redux/actions'

const Admin = (props) => {
  const [isMounted, setIsMounted] = useState(true)

  const getDataFromDB = (dbName) => {
    db.collection(dbName)
      .limit(1000)
      .get()
      .then((res) => {
        switch (dbName) {
          case 'articles': {
            console.log(res.data)
            props.getArticles(res.data)
            break
          }
          case 'drafts': {
            props.getDrafts(res.data)
            break
          }
          case 'classes': {
            props.getClasses(res.data)
            break
          }
          case 'tags': {
            props.getTags(res.data)
            break
          }
          case 'about': {
            props.getAbout(res.data)
            break
          }
          case 'links': {
            props.getLinks(res.data)
            break
          }
          case 'logs': {
            props.getLogs(res.data)
            break
          }
          case 'says': {
            props.getSays(res.data)
            break
          }
          case 'shows': {
            res.data.sort((a, b) => a.order - b.order)
            props.getShows(res.data)
            break
          }
          case 'allComments': {
            props.getMsgs(res.data)
            break
          }
          default:
            break
        }
      })
  }

  useEffect(() => {
    if (isMounted) {
      getDataFromDB('articles')
      getDataFromDB('drafts')
      getDataFromDB('classes')
      getDataFromDB('tags')
      getDataFromDB('about')
      getDataFromDB('links')
      getDataFromDB('logs')
      getDataFromDB('says')
      getDataFromDB('shows')
      getDataFromDB('allComments')
    }
    return () => {
      setIsMounted(false)
    }
  }, [isMounted])

  return (
    <div className='AdminBox'>
      <Nav />
      {/* <Content /> */}
    </div>
  )
}

export default connect(() => ({}), {
  getArticles,
  getClasses,
  getTags,
  getArticles,
  getDrafts,
  getSays,
  getLinks,
  getShows,
  getAbout,
  getLogs,
  getMsgs
})(Admin)
