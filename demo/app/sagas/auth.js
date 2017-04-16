import {fork, takeLatest, put} from 'redux-saga/effects'
import {types} from '../reducers/auth'

export function * signIn (action) {
  const {name, password} = action
  const result = yield mockSignIn(name, password)
  yield put({
    type: types.SIGN_IN_SUCCESS,
    payload: {
      auth: result
    }
  })
}

export default function * () {
  yield fork(() => takeLatest(types.SIGN_IN_REQUEST, signIn))
}

function mockSignIn (name, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({name: 'unordered'})
    }, 2000)
  })
}
