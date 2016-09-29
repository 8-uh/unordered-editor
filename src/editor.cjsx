React = {PropTypes, Component} = require 'react'
style = require './editor.css'

module.exports = class TextEditor extends Component
  constructor: (props) ->
    super props

  @propTypes:
    cursorX: PropTypes.number.isRequired
    cursorY: PropTypes.number.isRequired
    cursorWidth: PropTypes.number.isRequired
    cursorHeight: PropTypes.number.isRequired
    bufferRows: PropTypes.array.isRequired
    setEditorOptions: PropTypes.func.isRequired
    onEditorMouseDown: PropTypes.func.isRequired
    hiddenInputValue: PropTypes.string.isRequired
    hiddenInputStyle: PropTypes.object.isRequired
    onHiddenInputChange: PropTypes.func.isRequired
    onHiddenInputKeyDown: PropTypes.func.isRequired

  componentDidMount: ->
    {dummyDefaultChar, dummyDoubleChar} = @refs
    defaultCharWidth = dummyDefaultChar.getBoundingClientRect().width
    doubleCharWidth = dummyDoubleChar.getBoundingClientRect().width
    lineHeight = 21
    @props.setEditorOptions {defaultCharWidth, doubleCharWidth, lineHeight}

  onEditorMouseDown: (e) =>
    e.stopPropagation()
    @props.onEditorMouseDown e, @refs.editorRoot.getBoundingClientRect()

  onEditorContextMenu: (e) =>
    e.preventDefault()

  onEditorMouseUp: (e) =>
    e.stopPropagation()
    @refs.hiddenInput.focus()

  render: ->
    {bufferRows, cursorX, cursorY, cursorWidth, cursorHeight, hiddenInputValue,
      hiddenInputStyle, onHiddenInputChange, onHiddenInputKeyDown} = @props
    hiddenInputStyle = Object.assign {
      left: cursorX
      top: cursorY
      width: cursorWidth
      height: cursorHeight}, hiddenInputStyle
    <u-editor class={style.root}>
      <u-line-numbers>
        {bufferRows.map (i, index) ->
          <u-line-number key={index}>{index + 1}</u-line-number>}
      </u-line-numbers>
      <u-editor-wrapper onMouseDown={@onEditorMouseDown} onMouseUp={@onEditorMouseUp} onContextMenu={@onEditorContextMenu}>
        <u-editor-area ref='editorRoot' onMouseUp={@onEditorMouseUp} onMouseDown={@onEditorMouseDown}>
          <u-dummy>
            <span data-no-block ref='dummyDefaultChar'>x</span>
            <span data-no-block ref='dummyDoubleChar'>我</span>
          </u-dummy>
          <input className={style.hiddenInput} ref='hiddenInput' style=hiddenInputStyle
            value={hiddenInputValue}
            onChange={(e) -> onHiddenInputChange e.target.value}
            onKeyDown={(e) -> onHiddenInputKeyDown e} />
          {bufferRows.map (i, index) ->
            <u-line key={index}>{i}</u-line>}
        </u-editor-area>
      </u-editor-wrapper>
    </u-editor>
