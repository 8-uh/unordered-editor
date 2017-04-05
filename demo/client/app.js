import React from 'react'
import {Router} from 'react-router'
import {Provider} from 'react-redux'

import routes from '../app/routes'

export default (props) => {
  const {store, history} = props
  return (
    <Provider store={store}>
      <Router history={history} key={new Date()}>
        {routes}
      </Router>
    </Provider>
  )
}
