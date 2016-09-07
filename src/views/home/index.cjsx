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
    onHiddenInputKeyUp: PropTypes.func.isRequired

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

  onInputChange: (e) => @props.setHiddenInputValue e.target.value

  onEditorMouseDown: (e) =>
    @props.setCursorPosition e.clientX - 90, e.clientY - 40 + @refs.editorWrapper.scrollTop

  onEditorMouseUp: (e) =>
    @refs.hiddenInput.focus()

  render: ->
    {content, cursorX, cursorY, cursorWidth, cursorHeight, hiddenInputValue, onHiddenInputKeyUp, onHiddenInputKeyDown} = @props
    hiddenInputStyle = {width: cursorWidth, height: cursorHeight, left: cursorX, top: cursorY}
    <div className={style.root}>
      <c-dummy>
        <span data-no-block ref='defaultChar'>x</span>
        <span data-no-block ref='doubleChar'>我</span>
      </c-dummy>
      <c-editor-root ref='editorWrapper'>
        <c-editor-wrapper>
          <c-line-number>
            {[1..content.rows.length || 1].map (i) -> <span key={i}>{i}</span>}
          </c-line-number>
          <c-editor-content onMouseDown={@onEditorMouseDown} onMouseUp={@onEditorMouseUp}>
            <input ref='hiddenInput' className={style.hiddenInput} value={hiddenInputValue} onChange={@onInputChange} onKeyDown={onHiddenInputKeyDown} onKeyUp={onHiddenInputKeyUp} style=hiddenInputStyle />
            {content.rows.map (i, index) ->
              <c-line key={index}>{([(i.replace /\n/g, '¬')...].map (char) -> if char is ' ' then '·' else char).join('')}</c-line>}
          </c-editor-content>
        </c-editor-wrapper>
      </c-editor-root>
    </div>


  #   @testNumber = 1
  #   @imeInput = false
  #   @imeShift = false
  #   @imeStartCursorX = 0
  #   @imeEndCursorX = 0
  #   @state =
  #     defaultCharWidth: 0
  #     defaultCharHeight: 0
  #     doubleCharWidth: 0
  #     doubleCharHeight: 0
  #     cursorX: 0
  #     cursorY: 0
  #     inputValue: ''
  #     contents: [
  #     ]
  #
  # componentDidMount: ->
  #   {defaultChar, doubleChar} = @refs
  #   @setState
  #     defaultCharWidth: defaultChar.getBoundingClientRect().width
  #     defaultCharHeight: defaultChar.getBoundingClientRect().height
  #     doubleCharWidth: doubleChar.getBoundingClientRect().width
  #     doubleCharHeight: doubleChar.getBoundingClientRect().height
  #
  # onClick: (e) =>
  #   @refs.hiddenInput.focus()
  #   {clientX, clientY} = e
  #   {defaultCharWidth, doubleCharWidth, contents} = @state
  #   cursorY = Math.floor((clientY - 20) / 21)
  #   cursorY = contents.length if cursorY > contents.length
  #   line = contents[cursorY] || '\n'
  #   # cursorX = Math.floor((clientX - 20) / defaultCharWidth)
  #   clientX -= 20
  #   width = 0
  #   cursorX = -1
  #   for char, index in line
  #     charWidth = if char.charCodeAt() <= 255 then defaultCharWidth else doubleCharWidth
  #     if clientX >= width and clientX <= width + charWidth
  #       cursorX = index
  #       break
  #     width += charWidth
  #   cursorX = line.length - 1 if cursorX is -1
  #   @setState {cursorX, cursorY}
  #
  # onChange: (e) =>
  #   char = e.target.value
  #   @setState {inputValue: char}
  #
  # onKeyUp: (e) =>
  #   console.log 'up', e.keyCode
  #   switch e.keyCode
  #     when 32 # space
  #       if @imeInput
  #         if not @imeShift
  #           {inputValue, contents, cursorX, cursorY} = @state
  #           line = contents[cursorY] || '\n'
  #           line = [line[0...@imeStartCursorX], inputValue, if @imeEndCursorX > 0 then line[-@imeEndCursorX..] else ''].join('')
  #           contents[cursorY] = line
  #           @setState {contents, cursorX: @imeStartCursorX + inputValue.length, inputValue: ''}
  #           @imeInput = false
  #           @imeShift = false
  #           @imeStartCursorX = -1
  #           @imeEndCursorX = -1
  #       else
  #         {inputValue, contents, cursorX, cursorY} = @state
  #         line = contents[cursorY] || '\n'
  #         line = [line[0...cursorX], inputValue, line[cursorX..]].join('')
  #         contents[cursorY] = line
  #         @setState {contents, cursorX: cursorX + inputValue.length, inputValue: ''}
  #     when 8 # backspace
  #       if not @imeInput
  #         {inputValue, contents, cursorX, cursorY} = @state
  #         line = contents[cursorY] || '\n'
  #         if cursorX > 0
  #           line = [line[0...cursorX - 1], line[cursorX..]].join('')
  #           contents[cursorY] = line
  #           cursorX = cursorX - 1
  #         else if cursorY > 0
  #           newLine = contents[cursorY - 1].trim().concat line
  #           cursorX = contents[cursorY - 1].length - 1
  #           contents = [contents[0...cursorY - 1]..., newLine, contents[cursorY + 1..]...]
  #           cursorY = cursorY - 1
  #         @setState {contents, cursorX, cursorY, inputValue: ''}
  #       else
  #         {inputValue, contents, cursorX, cursorY} = @state
  #         line = contents[cursorY] || '\n'
  #         line = [line[0...@imeStartCursorX], inputValue, if @imeEndCursorX > 0 then line[-@imeEndCursorX..] else ''].join('')
  #         contents[cursorY] = line
  #         @setState {contents, cursorX: @imeStartCursorX + inputValue.length, inputValue}
  #         if inputValue.length is 0
  #           @imeInput = false
  #           @imeShift = false
  #           @imeStartCursorX = -1
  #           @imeEndCursorX = -1
  #     when 13 # enter
  #       if not @imeInput
  #         {contents, cursorY, cursorX} = @state
  #         line = contents[cursorY] || '\n'
  #         newLineOne = line[0...cursorX].concat '\n'
  #         newLineTwo = line[cursorX...]
  #         contents = [contents[0...cursorY]..., newLineOne, newLineTwo, contents[cursorY + 1...]...]
  #         @setState {contents, cursorX: 0, cursorY: cursorY + 1}
  #       else
  #         {inputValue, contents, cursorX, cursorY} = @state
  #         line = contents[cursorY] || '\n'
  #         line = [line[0...@imeStartCursorX], inputValue, if @imeEndCursorX > 0 then line[-@imeEndCursorX..] else ''].join('')
  #         contents[cursorY] = line
  #         @setState {contents, cursorX: @imeStartCursorX + inputValue.length, inputValue: ''}
  #         @imeInput = false
  #         @imeShift = false
  #         @imeStartCursorX = -1
  #         @imeEndCursorX = -1
  #     when 16 # shift
  #       if @imeInput
  #         @imeShift = not @imeShift
  #     else
  #       if @imeInput
  #         {inputValue, contents, cursorX, cursorY} = @state
  #         line = contents[cursorY] || '\n'
  #         line = [line[...@imeStartCursorX], inputValue, if @imeEndCursorX > 0 then line[-@imeEndCursorX..] else ''].join('')
  #         contents[cursorY] = line
  #         @setState {contents, cursorX: @imeStartCursorX + inputValue.length, inputValue}
  #       else
  #         {inputValue, contents, cursorX, cursorY} = @state
  #         line = contents[cursorY] || '\n'
  #         line = [line[0...cursorX], inputValue, line[cursorX..]].join('')
  #         contents[cursorY] = line
  #         @setState {contents, cursorX: cursorX + inputValue.length, inputValue: ''}
  #
  # onKeyDown: (e) =>
  #   console.log 'donw', e.keyCode
  #   if e.keyCode is 229
  #     if not @imeInput
  #       {contents, cursorX, cursorY} = @state
  #       @imeStartCursorX = cursorX
  #       @imeEndCursorX = (contents[cursorY] || '').length - cursorX
  #       @imeInput = true

  # render: ->
  #   {contents, cursorX, cursorY, defaultCharWidth, doubleCharWidth} = @state
  #   line = contents[cursorY] || '\n'
  #   left = 0
  #   width = 0
  #   for char, index in line
  #     width = if char.charCodeAt() <= 255 then defaultCharWidth else doubleCharWidth
  #     break if index >= cursorX
  #     left += width
  #   hiddenInputStyle =
  #     width: width
  #     left: left
  #     top: cursorY * 21
  #   <div className={style.root}>
  #     <c-line-number>
  #       {[1..contents.length + 1].map (i) ->
  #         <span key={i}>{i}</span>}
  #     </c-line-number>
  #     <c-dummy>
  #       <span ref='defaultChar'>x</span>
  #       <span ref='doubleChar'>我</span>
  #     </c-dummy>
  #     <input className={style.hiddenInput} ref='hiddenInput' value={@state.inputValue} onChange={@onChange} onKeyDown={@onKeyDown} onKeyUp={@onKeyUp} style=hiddenInputStyle />
  #     <c-editor-content onClick={@onClick}>
  #       {contents.map (i, index) ->
  #         <div key={index}>{([(i.replace /\n/g, '`')...].map (char) -> if char is ' ' then '_' else char).join('')}</div>}
  #     </c-editor-content>
  #   </div>

module.exports = connect HomeView
