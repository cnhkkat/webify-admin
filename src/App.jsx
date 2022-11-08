import { useEffect } from 'react'
import { connect } from 'react-redux'
import { auth } from '../src/utils/cloudBase'
import { login } from '../src/redux/actions'
import Login from './pages/Login'
import Admin from './pages/Admin'
import { Outlet } from 'react-router-dom'
import './App.css'

const App = ({ loginState, login }) => {
  useEffect(() => {
    auth.hasLoginState() ? login(true) : login(false)
  }, [loginState])

  return (
    <>
      {loginState ? (
        <>
          <Admin /> <Outlet />
        </>
      ) : (
        <Login />
      )}
    </>
  )
}

export default connect((state) => ({ loginState: state.loginState }), { login })(App)
