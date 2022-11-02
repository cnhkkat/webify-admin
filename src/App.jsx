import { useEffect } from 'react'
import { connect } from 'react-redux'
import { auth } from '../src/utils/cloudBase'
import { login } from '../src/redux/actions'
import Login from './pages/Login'
import Admin from './pages/Admin'
import './App.css'

const App = ({ loginState, login }) => {
  useEffect(() => {
    auth.hasLoginState() ? login(true) : login(false)
  }, [loginState, login])

  return <>{loginState ? <Admin /> : <Login />}</>
}

export default connect((state) => ({ loginState: state.loginState }), { login })(App)
