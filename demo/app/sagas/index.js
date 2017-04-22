import {fork} from 'redux-saga/effects'

import auth from './auth'

export default function * () {
  yield fork(auth)
}
