import { combineReducers } from 'redux'

import loginState from './loginState'
import articles from './articles'

export default combineReducers({
  loginState,
  articles
})
