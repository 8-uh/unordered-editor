React = {PropTypes, Component} = require 'react'
Editor = require '../editor'
style = require './index.css'

module.exports = class Pane extends Component
  constructor: (props) ->
    super props
    @state =
      innerBody: props.body or null
      innerLeft: null
      innerRight: null
      innerUp: null
      innerDown: null

  setBody: (component) ->
    @setState {innerBody: component}

  setLeft: (component) -> @setState {innerLeft: component}

  setRight: (component, props) ->
    if component
      @setState {innerRight: {component, props}}
    else
      @setState {innerRight: null}

  setUp: (component) -> @setState {innerUp: component}

  setDown: (component) -> @setState {innerDown: component}

  getCurrentEditor: -> @refs.editor

  render: ->
    {innerLeft, innerUp, innerBody, innerRight, innerDown} = @state
    rightStyle =
      width: innerRight and '50%' or '0'
    <u-pane class={style.root}>
      <u-pane-left>
        {innerLeft}
      </u-pane-left>
      <u-pane-center>
        <u-pane-up>
          {innerUp}
        </u-pane-up>
        <u-pane-body>
          {@state.innerBody and <@state.innerBody ref={'editor'} />}
        </u-pane-body>
        <u-pane-down>
          {innerDown}
        </u-pane-down>
      </u-pane-center>
      <u-pane-right style={rightStyle}>
        {@state.innerRight and <@state.innerRight.component {...@state.innerRight.props} />}
      </u-pane-right>
    </u-pane>
