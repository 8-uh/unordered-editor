{Component, createElement} = require 'react'
Editor = require './editor'
EditorBuffer = require 'unordered-editor-buffer'
TextTransformer = require './plugins/text-transformer'

module.exports =
  class UnorderedEditor extends Component
    constructor: (props) ->
      super props
      @buffer = new EditorBuffer()
      @buffer.initBuffer ''
      @inputValuePosition =
        startCol: -1
        endCol: -1
      @state =
        hiddenInputValue: ''
        updateTime: 0

    setEditorOptions: (options) =>
      @buffer.setOptions options
      @buffer.setOptions
        updateEditor: () =>
          @setState {updateTime: new Date().getTime()}

    onEditorMouseDown: (e, editorRect) =>
      @inputValuePosition.startCol = -1
      @setState {hiddenInputValue: ''}
      x = e.clientX - editorRect.left
      y = e.clientY - editorRect.top
      @buffer.setCursor x, y

    onHiddenInputChange: (value) =>
      @setState {hiddenInputValue: value}
      if @inputValuePosition.startCol is -1
        cursor = @buffer.getCursor()
        lineLength = @buffer.getBuffer()[cursor.cursorRow].length
        @inputValuePosition =
          startCol: cursor.cursorCol
          endCol: lineLength - cursor.cursorCol
      @buffer.setRangeTextInLine value, @inputValuePosition.startCol, -@inputValuePosition.endCol

    onHiddenInputKeyDown: (e) =>
      if e.keyCode is 13 # enter
        @inputValuePosition.startCol = -1
        @setState {hiddenInputValue: ''}
        @buffer.insertText '\n'
      if e.keyCode is 8 # backspace
        @buffer.deleteChar()

    render: ->
      bufferRows = TextTransformer.transform @buffer.getBuffer()
      {cursorX, cursorY, cursorRow, cursorCol, cursorWidth} = @buffer.getCursor()
      {hiddenInputValue} = @state
      editorProps = {
        bufferRows, cursorX, cursorY, cursorWidth, cursorHeight: 21,
        hiddenInputValue, @setEditorOptions, @onEditorMouseDown,
        @onHiddenInputChange, @onHiddenInputKeyDown
      }
      createElement Editor, editorProps
