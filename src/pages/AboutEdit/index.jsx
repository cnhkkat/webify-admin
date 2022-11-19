import { useState, useEffect } from 'react'
import { db, auth } from '../../utils/cloudBase'
import { notification, message } from 'antd'
import { SkinOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { getAbout } from '../../redux/actions'
import { visitorText, adminUid } from '../../utils/constants'
import marked from 'marked'
import hljs from 'highlight.js'
import { useNavigate } from 'react-router-dom'
import '../../github-dark.css'

const AboutEdit = (props) => {
  const [content, setContent] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getAboutData()
  }, [])

  // 配制marked和highlight
  useEffect(() => {
    // 配置highlight
    hljs.configure({
      tabReplace: '',
      classPrefix: 'hljs-',
      languages: ['CSS', 'HTML', 'JavaScript', 'Python', 'TypeScript', 'Markdown']
    })
    // 配置marked
    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight: (code) => hljs.highlightAuto(code).value,
      gfm: true, //默认为true。 允许 Git Hub标准的markdown.
      tables: true, //默认为true。 允许支持表格语法。该选项要求 gfm 为true。
      breaks: true //默认为false。 允许回车换行。该选项要求 gfm 为true。
    })
  }, [])

  // 获取关于详情
  const getAboutData = () => {
    db.collection('about')
      .get()
      .then((res) => {
        props.getAbout(res.data)
      })
  }
  // 返回到"关于"页面
  const turnToAbout = () => {
    navigate('/about')
  }
  // 更新
  const upDateAbout = () => {
    if (!content) {
      message.info('请写点什么再更新！')
      return
    }
    if (auth.currentUser.uid !== adminUid) {
      message.warning(visitorText)
      return
    }

    db.collection('about')
      .update({
        content
      })
      .then((res) => {
        if (res.code && res.code === 'DATABASE_PERMISSION_DENIED') {
          message.warning(visitorText)
          return
        }
        getAboutData()
        turnToAbout()
        notification.open({
          message: '更新成功！',
          icon: <SkinOutlined style={{ color: 'blue' }} />,
          placement: 'bottomLeft',
          duration: 1.5
        })
      })
  }
  return (
    <>
      <div className='ml-100 pt-20'>
        <div className='justify-between mb-10'>
          <div className='h-40 w-90 fs-16 white center bg-blue hover-bg br-20 ml-30 hover-shadow-blue u-select-no' onClick={turnToAbout}>
            返回
          </div>
          <span className='fs-20 white'>关于本站</span>
          <div className='h-40 w-90 fs-16 white center bg-blue hover-bg br-20 ml-30 hover-shadow-blue u-select-no mr-10' onClick={upDateAbout}>
            更新
          </div>
        </div>

        <div className='flex space-around min-h-300'>
          <div
            className='w-50p bg-light-blue p-30 fs-18 break-word b-no overflow-y '
            contentEditable='plaintext-only'
            suppressContentEditableWarning
            onInput={(e) => {
              setContent(e.target.innerText)
            }}
          >
            {props.about[0].content}
          </div>

          <div
            className='w-50p bg-white p-30 fs-18 break-word b-no overflow-y '
            dangerouslySetInnerHTML={{
              __html: marked(content).replace(/<pre>/g, "<pre id='hljs'>")
            }}
          ></div>
        </div>
      </div>
    </>
  )
}

export default connect((state) => ({ about: state.about }), { getAbout })(AboutEdit)
