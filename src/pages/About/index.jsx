import { connect } from 'react-redux'
import marked from 'marked'
import hljs from 'highlight.js'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getAbout } from '../../redux/actions'
import { db } from '../../utils/cloudBase'
const About = ({ about, getAbout }) => {
  const navigate = useNavigate()
  useEffect(() => {
    db.collection('about')
      .get()
      .then((res) => {
        getAbout(res.data)
      })
  }, [])
  hljs.configure({
    tabReplace: '',
    classPrefix: 'hljs-',
    languages: ['CSS', 'HTML', 'JavaScript', 'Python', 'TypeScript', 'Markdown']
  })
  marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: (code) => hljs.highlightAuto(code).value,
    gfm: true, //默认为true。 允许 Git Hub标准的markdown.
    tables: true, //默认为true。 允许支持表格语法。该选项要求 gfm 为true。
    breaks: true //默认为false。 允许回车换行。该选项要求 gfm 为true。
  })

  const turnToAboutEdit = () => {
    navigate('/aboutEdit')
  }

  return (
    <>
      <div className='ml-100 pt-20'>
        <div
          className='h-40 w-90 fs-16 white center bg-blue hover-bg br-20 ml-30 mb-10 hover-shadow-blue u-select-no'
          onClick={() => {
            turnToAboutEdit()
          }}
        >
          修改
        </div>

        <div
          className='w-1p h-1p bg-white p-30 fs-18 break-word markdownStyle'
          dangerouslySetInnerHTML={{
            __html: marked(about[0]?.content || '').replace(/<pre>/g, "<pre id='hljs'>")
          }}
        ></div>
      </div>
    </>
  )
}
export default connect((state) => ({ about: state.about }), { getAbout })(About)
