React = {PropTypes, Component} = require 'react'
{connect} = require '../../common/text-buffer'
style = require './index.css'

class HomeView extends Component
  @propTypes:
    cursorX: PropTypes.number.isRequired
    cursorY: PropTypes.number.isRequired
    cursorWidth: PropTypes.number.isRequired
    cursorHeight: PropTypes.number.isRequired
    content: PropTypes.object.isRequired
    hiddenInputValue: PropTypes.string.isRequired
    setCharSize: PropTypes.func.isRequired
    setCursorPosition: PropTypes.func.isRequired
    setHiddenInputValue: PropTypes.func.isRequired
    onHiddenInputKeyDown: PropTypes.func.isRequired
    onHiddenInputKeyPress: PropTypes.func.isRequired
    onHiddenInputKeyUp: PropTypes.func.isRequired
    hiddenInputFocus: PropTypes.bool.isRequired
    onHiddenInputFocus: PropTypes.func.isRequired
    onHiddenInputBlur: PropTypes.func.isRequired

  constructor: (props) ->
    super props

  componentDidMount: ->
    {defaultChar, doubleChar} = @refs
    defaultCharRect = defaultChar.getBoundingClientRect()
    doubleCharRect = doubleChar.getBoundingClientRect()
    @props.setCharSize
      defaultCharWidth: defaultCharRect.width
      defaultCharHeight: defaultCharRect.height
      doubleCharWidth: doubleCharRect.width
      doubleCharHeight: doubleCharRect.height
      lineHeight: 21

  onInputChange: (e) =>
    @props.setHiddenInputValue e.target.value

  onEditorMouseDown: (e) =>
    @props.setCursorPosition e.clientX - 90 + @refs.editorContent.scrollLeft, e.clientY - 40 + @refs.editorRoot.scrollTop

  onEditorMouseUp: (e) =>
    @refs.hiddenInput.focus()

  onPaste: (e) =>
    e.preventDefault()
    console.log e.clipboardData.getData('text/plain')

  render: ->
    {content, cursorX, cursorY, cursorWidth, cursorHeight, hiddenInputValue,
      onHiddenInputKeyDown, onHiddenInputKeyPress, onHiddenInputKeyUp, hiddenInputFocus,
      onHiddenInputFocus, onHiddenInputBlur} = @props
    hiddenInputStyle = Object.assign {width: cursorWidth, height: cursorHeight, left: cursorX, top: cursorY}
    <div className={style.root}>
      <c-dummy>
        <span data-no-block ref='defaultChar'>x</span>
        <span data-no-block ref='doubleChar'>我</span>
      </c-dummy>
      <c-editor-root ref='editorRoot'>
        <c-editor-wrapper>
          <c-line-number>
            {[1..content.rows.length || 1].map (i) -> <span key={i}>{i}</span>}
          </c-line-number>
          <c-editor-content onMouseDown={@onEditorMouseDown} onMouseUp={@onEditorMouseUp} ref='editorContent'>
            <input ref='hiddenInput' data-is-focus={hiddenInputFocus}
              onPaste={@onPaste}
              className={style.hiddenInput} value={hiddenInputValue}
              onChange={@onInputChange} onKeyDown={onHiddenInputKeyDown}
              onKeyUp={onHiddenInputKeyUp} onKeyPress={onHiddenInputKeyPress}
              onFocus={onHiddenInputFocus} onBlur={onHiddenInputBlur} style=hiddenInputStyle />
            {content.rows.map (i, index) ->
              <c-line key={index}>
              {if i.endsWith '\n' then <span>{i[...-1].replace /\s/g, '·'}<c-enter>¬</c-enter></span> else <span>{i.replace /\s/g, '·'}</span>}
              </c-line>}
          </c-editor-content>
        </c-editor-wrapper>
      </c-editor-root>
    </div>

module.exports = connect HomeView
