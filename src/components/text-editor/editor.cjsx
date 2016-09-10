React = {PropTypes, Component} = require 'react'
style = require './editor.css'

module.exports = class TextEditor extends Component
  constructor: (props) ->
    @boundingClientTop = 0
    @boundingClientLeft = 0
    @defaultCharWidth = 0
    @defaultCharHeight = 0
    @doubleCharWidth = 0
    @doubleCharHeight = 0
    @lineHeight = 0

  @propTypes:
    cursorX: PropTypes.number.isRequired
    cursorY: PropTypes.number.isRequired
    cursorWidth: PropTypes.number.isRequired
    cursorHeight: PropTypes.number.isRequired
    hiddenInputValue: PropTypes.string.isRequired
    contentRows: PropTypes.array.isRequired
    onEditorMouseDown: PropTypes.func.isRequired
    onHiddenInputChange: PropTypes.func.isRequired
    onHiddenInputKeyDown: PropTypes.func.isRequired
    onHiddenInputKeyPress: PropTypes.func.isRequired
    onHiddenInputPaste: PropTypes.func.isRequired
    setEditorOptions: PropTypes.func.isRequired

  componentDidMount: ->
    {dummyDefaultChar, dummyDoubleChar} = @refs
    clientRect = dummyDefaultChar.getBoundingClientRect()
    [@defaultCharWidth, @defaultCharHeight] = [clientRect.width, clientRect.height]
    clientRect = dummyDoubleChar.getBoundingClientRect()
    [@doubleCharWidth, @doubleCharHeight] = [clientRect.width, clientRect.height]
    @lineHeight = 21
    @props.setEditorOptions {@defaultCharWidth, @defaultCharHeight, @doubleCharWidth, @doubleCharHeight, @lineHeight}

  onEditorMouseDown: (e) =>
    @props.onEditorMouseDown e, @refs.editorRoot.getBoundingClientRect()

  onEditorMouseUp: (e) =>
    @refs.hiddenInput.focus()

  onEditorContextMenu: (e) =>
    e.preventDefault()

  render: ->
    {contentRows, cursorX, cursorY, cursorWidth, cursorHeight, hiddenInputValue,
      onEditorMouseDown, onHiddenInputChange, onHiddenInputKeyDown,
      onHiddenInputPaste, onHiddenInputKeyPress} = @props
    hiddenInputStyle =
      left: cursorX
      top: cursorY
      width: cursorWidth
      height: cursorHeight
    <div ref='editorRoot' onContextMenu={@onEditorContextMenu} onMouseUp={@onEditorMouseUp} onMouseDown={@onEditorMouseDown} className={style.root}>
      <u-dummy>
        <span data-no-block ref='dummyDefaultChar'>x</span>
        <span data-no-block ref='dummyDoubleChar'>我</span>
      </u-dummy>
      <input className={style.hiddenInput} ref='hiddenInput' style=hiddenInputStyle
        value={hiddenInputValue}
        onPaste={onHiddenInputPaste}
        onChange={(e) -> onHiddenInputChange e.target.value}
        onKeyPress={onHiddenInputKeyPress}
        onKeyDown={onHiddenInputKeyDown} />
      {contentRows.map (i, index) ->
        <u-line key={index}>{i}</u-line>}
    </div>
