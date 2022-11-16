import { GET_ABOUT } from '../constant'

const initState = ''

export default function addReducer(preState = initState, action) {
  const { type, data } = action
  switch (type) {
    case GET_ABOUT:
      return data
    default:
      return preState
  }
}
