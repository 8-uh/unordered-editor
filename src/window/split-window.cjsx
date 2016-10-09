React = {PropTypes, Component} = require 'react'
style = require './split-window.css'

module.exports = class SplitWindow extends Component
  @propTypes:
    direction: PropTypes.oneOf(['horizontal', 'vertical'])

  constructor: (props) ->
    super props
    @_siderWidth = 0
    @_resizeBarMouseDownPosition = null
    @state =
      direction: props.direction or 'horizontal'
      body: null
      sider: null
      siderWidth: 0

  componentDidMount: ->
    window.addEventListener 'mouseup', @mouseUp
    window.addEventListener 'mousemove', @mouseMove

  setBody: (component, options) ->
    if not component
      @setState {body: null}
    else
      @setState {body: {component, options}}

  setSider: (component, options) ->
    if not component
      @setState {sider: null}
    else
      @setState {sider: {component, options}}

  mouseUp: (e) =>
    @_siderWidth = 0
    @_resizeBarMouseDownPosition = null

  mouseMove: (e) =>
    if @_siderWidth and @_resizeBarMouseDownPosition
      {clientX} = e
      siderWidth = @_siderWidth + @_resizeBarMouseDownPosition.clientX - clientX
      @setState {siderWidth} if siderWidth > 0

  onResizeBarMouseDown: (e) =>
    @_siderWidth = @refs.sider.offsetWidth
    {clientX, clientY} = e
    @_resizeBarMouseDownPosition = {clientX, clientY}

  render: ->
    {direction, siderWidth, body, sider} = @state
    siderStyle =
      flex: if siderWidth then '' else '1'
      width: siderWidth or 'auto'

    <u-split-window data-direction={direction} class={style.root}>
      <u-window-body>
        {body and <body.component />}
      </u-window-body>
      <u-resize-bar onMouseDown={@onResizeBarMouseDown} />
      <u-window-sider ref='sider' style={siderStyle}>
        {sider and <sider.component {...sider.options?.props} />}
      </u-window-sider>
    </u-split-window>
