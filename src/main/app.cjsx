React = {PropTypes, Component} = require 'react'
{Provider} = require 'react-redux'
{Router} = require 'react-router'

require './app.css'

module.exports =
  class App extends Component
    @propTypes:
      history: PropTypes.object.isRequired
      routes: PropTypes.object.isRequired
      store: PropTypes.object.isRequired

    render: ->
      {history, routes, store} = @props
      <Provider store={store}>
        <Router history={history}>
          {routes}
        </Router>
      </Provider>
