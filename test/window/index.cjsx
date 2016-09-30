React = {Component} = require 'react'
{render} = require 'react-dom'

Window = require '../../src/window'
style = require './index.css'

class Body extends Component
  render: ->
    <div>BODY</div>

class Left extends Component
  render: ->
    <div>LEFT</div>

class Right extends Component
  render: ->
    <div>RIGHT</div>

class Up extends Component
  render: ->
    <div>UP</div>

class Down extends Component
  render: ->
    <div>DOWN</div>

class TestWindow extends Component
  componentDidMount: ->
    @refs.window.setBody Body
    @refs.window.setLeft Left, {resizable: true}
    @refs.window.setUp Up, {resizable: true}
    @refs.window.setRight Right, {resizable: true}
    @refs.window.setDown Down, {resizable: true}

  onBodyClick: =>
    @refs.window.setBody Body

  onLeftClick: =>
    @refs.window.setLeft Left, {resizable: true}

  onUpClick: =>
    @refs.window.setUp Up

  onRightClick: =>
    @refs.window.setRight Right

  onDownClick: =>
    @refs.window.setDown Down

  render: ->
    <u-test-window class={style.root}>
      <u-btn onClick={@onBodyClick}>Body</u-btn>
      <u-btn onClick={@onLeftClick}>Left</u-btn>
      <u-btn onClick={@onUpClick}>Up</u-btn>
      <u-btn onClick={@onRightClick}>Right</u-btn>
      <u-btn onClick={@onDownClick}>Down</u-btn>
      <div>
        <Window ref='window' />
      </div>
    </u-test-window>

render <TestWindow />, document.getElementById 'app'
