React = {PropTypes, Component} = require 'react'
style = require './index.css'

module.exports = class Window extends Component
  constructor: (props) ->
    super props
    @_leftResizeBarMouseDownX = 0
    @_leftWidth = 0
    @_rightResizeBarMouseDownX = 0
    @_rightWidth = 0
    @_upResizeBarMouseDownY = 0
    @_upHeight = 0
    @_downResizeBarMouseDownY = 0
    @_downHeight = 0
    @state =
      body: null
      left: null
      right: null
      up: null
      down: null
      leftWidth: 0
      rightWidth: 0
      upHeight: 0
      downHeight: 0

  componentDidMount: ->
    window.addEventListener 'mouseup', @mouseUp
    window.addEventListener 'mousemove', @mouseMove

  mouseUp: (e) =>
    console.log 'mouse up'
    @_leftWidth = 0
    @_leftResizeBarMouseDownX = 0
    @_rightWidth = 0
    @_rightResizeBarMouseDownX = 0
    @_upHeight = 0
    @_upResizeBarMouseDownY = 0
    @_downHeight = 0
    @_donwResizeBarMouseDownY = 0

  mouseMove: (e) =>
    if @_leftResizeBarMouseDownX > 0 and @_leftWidth > 0
      {clientX} = e
      leftWidth =  @_leftWidth + clientX - @_leftResizeBarMouseDownX
      @setState {leftWidth: leftWidth} if leftWidth > 0
    else if @_rightResizeBarMouseDownX > 0 and @_rightWidth > 0
      {clientX} = e
      rightWidth =  @_rightWidth + @_rightResizeBarMouseDownX - clientX
      @setState {rightWidth: rightWidth} if rightWidth > 0
    else if @_upResizeBarMouseDownY > 0 and @_upHeight > 0
      {clientY} = e
      upHeight =  @_upHeight + clientY - @_upResizeBarMouseDownY
      @setState {upHeight: upHeight} if upHeight > 0
    else if @_downResizeBarMouseDownY > 0 and @_downHeight > 0
      {clientY} = e
      downHeight =  @_downHeight + @_downResizeBarMouseDownY - clientY
      @setState {downHeight: downHeight} if downHeight > 0

  setBody: (component, options) ->
    if not component
      @setState {body: null}
    else
      @setState {body: {component, options}}

  setLeft: (component, options) ->
    if not component
      @setState {left: null}
    else
      @setState {left: {component, options}}

  setRight: (component, options) ->
    if not component
      @setState {right: null}
    else
      @setState {right: {component, options}}

  setUp: (component, options) ->
    if not component
      @setState {up: null}
    else
      @setState {up: {component, options}}

  setDown: (component, options) ->
    if not component
      @setState {down: null}
    else
      @setState {down: {component, options}}

  onLeftReizeBarMouseDown: (e) =>
    @_leftResizeBarMouseDownX = e.clientX
    @_leftWidth = @refs.left.offsetWidth

  onRightResizeBarMouseDown: (e) =>
    @_rightResizeBarMouseDownX = e.clientX
    @_rightWidth = @refs.right.offsetWidth

  onUpResizeBarMouseDown: (e) =>
    @_upResizeBarMouseDownY = e.clientY
    @_upHeight = @refs.up.offsetHeight

  onDownResizeBarMouseDown: (e) =>
    @_downResizeBarMouseDownY = e.clientY
    @_downHeight = @refs.down.offsetHeight

  render: ->
    {left, up, right, down, body} = @state
    {leftWidth, rightWidth, upHeight, downHeight} = @state
    leftStyle =
      flex: if leftWidth then '' else left and '1' or '0'
      width: leftWidth or 'auto'
    rightStyle =
      flex: if rightWidth then '' else right and '1' or '0'
      width: rightWidth or 'auto'
    upStyle =
      flex: if upHeight then '' else up and '1' or '0'
      height: upHeight or 'auto'
    downStyle =
      flex: if downHeight then '' else down and '1' or '0'
      height: downHeight or 'auto'
    bodyStyle =
      flex: body and '1' or '0'
    centerStyle =
      flex: (up or body or down) and '1' or '0'
    <u-window class={style.root}>
      <u-window-left style={leftStyle} ref='left'>
        {left?.options?.resizable and <u-resize-bar onMouseDown={@onLeftReizeBarMouseDown} />}
        {left and <left.component />}
      </u-window-left>
      <u-window-center style={centerStyle}>
        <u-window-up style={upStyle} ref='up'>
          {up?.options?.resizable and <u-resize-bar onMouseDown={@onUpResizeBarMouseDown} />}
          {up and <up.component />}
        </u-window-up>
        <u-window-body style={bodyStyle}>
          {body and <body.component />}
        </u-window-body>
        <u-window-down style={downStyle} ref='down'>
          {down?.options?.resizable and <u-resize-bar onMouseDown={@onDownResizeBarMouseDown} />}
          {down and <down.component />}
        </u-window-down>
      </u-window-center>
      <u-window-right style={rightStyle} ref='right'>
        {right?.options?.resizable and <u-resize-bar onMouseDown={@onRightResizeBarMouseDown} />}
        {right and <right.component />}
      </u-window-right>
    </u-window>
