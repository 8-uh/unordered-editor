React = {PropTypes, Component} = require 'react'
style = require './index.css'

module.exports =
  class MainView extends Component
    @propTypes:
      location: PropTypes.object.isRequired
      children: PropTypes.object.isRequired

    @contextTypes:
      router: PropTypes.object.isRequired

    render: ->
      {children} = @props
      <div className={style.root}>
        <c-body>{children}</c-body>
      </div>
