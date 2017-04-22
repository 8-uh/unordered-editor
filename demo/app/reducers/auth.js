import {createReducer} from '../common/redux'

export const types = {
  SIGN_IN_REQUEST: 'SIGN_IN_REQUEST',
  SIGN_IN_SUCCESS: 'SIGN_IN_SUCCESS',
  SIGN_IN_FAILURE: 'SIGN_IN_FAILURE'
}

const initialState = {
  signInRequesting: false,
  auth: null
}

export default createReducer(initialState, types)

export const actions = {
  signIn: (name, password) => ({type: types.SIGN_IN_REQUEST, payload: {signInRequesting: true}, name, password})
}
