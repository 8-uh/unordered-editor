React = {Component} = require 'react'
{render} = require 'react-dom'

SplitWindow = require '../../src/window/split-window'
style = require './split-window.css'

class Body extends Component
  render: ->
    <div>BODY</div>

class Sider extends Component
  render: ->
    <div>Sider</div>

class TestWindow extends Component
  componentDidMount: ->
    @refs.window.setBody Body
    # @refs.window.setSider Sider, {resizable: true}

  onBodyClick: =>
    # @refs.window.setBody Body

  onSiderClick: =>
    @refs.window.setSider SplitWindow, {resizable: true, props: {direction: 'vertical'}}

  render: ->
    <u-test-window class={style.root}>
      <u-btn onClick={@onBodyClick}>Body</u-btn>
      <u-btn onClick={@onSiderClick}>Sider</u-btn>
      <div>
        <SplitWindow ref='window' />
      </div>
    </u-test-window>

render <TestWindow />, document.getElementById 'app'
