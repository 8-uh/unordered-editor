React = require 'react'
{IndexRoute, Route} = require 'react-router'

MainView = require '../views/main'
HomeView = require '../views/home'

module.exports =
  <Route path='/' component={MainView}>
    <IndexRoute component={HomeView} />
  </Route>
