import { combineReducers } from 'redux'

import loginState from './loginState'
import articles from './articles'
import drafts from './drafts'
import msgs from './msgs'
import says from './says'
import links from './links'
import classes from './classes'
import tags from './tags'
import logs from './logs'
import shows from './shows'
import about from './about'
export default combineReducers({
  loginState,
  articles,
  drafts,
  msgs,
  says,
  links,
  classes,
  tags,
  logs,
  shows,
  about
})
