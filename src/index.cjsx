{PropTypes, Component, createElement} = require 'react'
Editor = require './editor'
EditorBuffer = require 'unordered-editor-buffer'
TextTransformer = require './utils/text-transformer'

# VIM = require('unordered-editor-vim')

module.exports =
  class UnorderedEditor extends Component
    @propTypes:
      content: PropTypes.string

    constructor: (props) ->
      super props
      @_buffer = new EditorBuffer()
      @_buffer.initBuffer @props.content or ''
      @_inputEnabled = true
      @_plugins = []
      @_inputChangeListeners = []
      @_inputKeyDownListeners = []
      @_inputKeyUpListeners = []
      @_editorMouseDownListeners = []
      @_editorMouseUpListeners = []
      @_hiddenInputStyle = {}
      @_inputValuePosition =
        startCol: -1
        endCol: -1
      @state =
        hiddenInputValue: ''
        updateTime: 0

    componentWillReceiveProps: (props) ->
      @_buffer.initBuffer props.content or ''
      @_inputValuePosition.startCol = -1
      @_buffer.setCursorPosition 0, 0

    componentDidMount: ->
      # @_plugins = @_plugins.concat new VIM @

    getBuffer: -> @_buffer

    setInputEnabled: (enabled) ->
      @_inputEnabled = enabled

    isInputEnabled: -> @_inputEnabled

    setInputValue: (text) ->
      @setState {hiddenInputValue: text}

    setInputStyle: (style) ->
      @_hiddenInputStyle = style

    resetInput: ->
      @_inputValuePosition.startCol = -1

    addInputChangeListener: (listener) ->
      @_inputChangeListeners = @_inputChangeListeners.concat listener

    addInputKeyDownListener: (listener) ->
      @_inputKeyDownListeners = @_inputKeyDownListeners.concat listener

    addInputKeyUpListener: (listener) ->
      @_inputKeyUpListeners = @_inputKeyUpListeners.concat listener

    addEditorMouseDownListener: (listener) ->
      @_editorMouseDownListeners = @_editorMouseDownListeners.concat listener

    addEditorMouseUpListener: (listener) ->
      @_editorMouseUpListeners = @_editorMouseUpListeners.concat listener

    setEditorOptions: (options) =>
      @_buffer.setOptions options
      @_buffer.setOptions
        updateEditor: () =>
          @setState {updateTime: new Date().getTime()}

    onEditorMouseDown: (e, editorRect) =>
      @_inputValuePosition.startCol = -1
      @setState {hiddenInputValue: ''}
      x = e.clientX - editorRect.left
      y = e.clientY - editorRect.top
      @_buffer.setCursorCoords x, y
      @_editorMouseDownListeners.map (callback) -> callback()

    onHiddenInputChange: (value) =>
      @setState {hiddenInputValue: value}
      @_inputChangeListeners.map (callback) -> callback value
      return unless @_inputEnabled
      if @_inputValuePosition.startCol is -1
        cursor = @_buffer.getCursor()
        lineLength = @_buffer.getRows()[cursor.cursorRow].length
        @_inputValuePosition =
          startCol: cursor.cursorCol
          endCol: lineLength - cursor.cursorCol
      @_buffer.setRangeTextInLineInvertedEndCol value, @_inputValuePosition.startCol, -@_inputValuePosition.endCol

    onHiddenInputKeyDown: (e) =>
      @_inputKeyDownListeners.map (callback) -> callback e
      return unless @_inputEnabled
      if e.keyCode is 13 # enter
        @_inputValuePosition.startCol = -1
        @setState {hiddenInputValue: ''}
        @_buffer.insertText '\n'
      if e.keyCode is 8 # backspace
        @_buffer.deletePreviousChar()

    render: ->
      bufferRows = TextTransformer.transform @_buffer.getRows()
      {cursorX, cursorY, cursorRow, cursorCol, cursorWidth} = @_buffer.getCursor()
      {hiddenInputValue} = @state
      editorProps = {
        bufferRows, cursorX, cursorY, cursorWidth, cursorHeight: 21,
        hiddenInputValue, @setEditorOptions, @onEditorMouseDown,
        @onHiddenInputChange, @onHiddenInputKeyDown, hiddenInputStyle: @_hiddenInputStyle
      }
      createElement Editor, editorProps
