import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {Provider} from 'react-redux'
import {renderRoutes} from 'react-router-config'

import routes from '../app/routes'

export default (props) => {
  const {store} = props
  return (
    <Provider store={store}>
      <Router>
        {renderRoutes(routes)}
      </Router>
    </Provider>
  )
}
