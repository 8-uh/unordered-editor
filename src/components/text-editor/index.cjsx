{Component, createElement} = require 'react'
Editor = require './editor'
TextTransformer = require './plugins/text-transformer'
VimMode = require './plugins/vim-mode'

module.exports =
  class UnorderedEditor extends Component
    constructor: (props) ->
      super props
      @virtualMode = false
      @onHiddenInputKeyDownListeners = []
      @onHiddenInputKeyPressListeners = []
      @defaultCharWidth = 0
      @defaultCharHeight = 0
      @doubleCharWidth = 0
      @doubleCharHeight = 0
      @lineHeight = 0
      @insertCursorWidth = 3
      @inputStartColumn = -1
      @inputEndColumn = -1
      @state =
        cursorX: 0
        cursorY: 0
        cursorWidth: 0
        cursorHeight: 0
        cursorRow: 0
        cursorColumn: 0
        hiddenInputValue: ''
        contentRows: []
      new VimMode(@)

    addHiddenInputKeyDownListener: (callback) =>
      @onHiddenInputKeyDownListeners.push callback

    addHiddenInputKeyPressListener: (callback) =>
      @onHiddenInputKeyPressListeners.push callback

    setEditorOptions: (options) =>
      {@defaultCharWidth, @defaultCharHeight, @doubleCharWidth,
        @doubleCharHeight, @lineHeight} = options

    onHiddenInputChange: (value) =>
      @insertText(value) if not @virtualMode

    onHiddenInputPaste: (e) =>
      e.preventDefault()
      if not @virtualMode
        data = e.clipboardData.getData('text/plain').split('\n')
        @pasteText data

    onHiddenInputKeyDown: (e) =>
      if not @virtualMode
        if e.keyCode is 13 # enter
          @insertEnter()
        if e.keyCode is 8 # backspace
          @insertBackspace()
      callback(e) for callback in @onHiddenInputKeyDownListeners

    onHiddenInputKeyPress: (e) =>
      callback(e) for callback in @onHiddenInputKeyPressListeners

    onEditorMouseDown: (e, editorRect) =>
      x = e.clientX - editorRect.left
      y = e.clientY - editorRect.top
      @inputStartColumn = @inputEndColumn = -1
      {contentRows, cursorWidth, cursorColumn} = @state
      cursorRow = Math.floor(y / @lineHeight)
      cursorRow = contentRows.length - 1 if cursorRow > contentRows.length - 1
      cursorRow = 0 if cursorRow < 0
      line = contentRows[cursorRow] || ''
      line = line.concat '\n' if not line.endsWith '\n'
      cursorX = 0
      cursorColumn = -1
      for char, index in line
        charWidth = if char.charCodeAt() <= 255 then @defaultCharWidth else @doubleCharWidth
        if x >= cursorX and x < cursorX + charWidth
          cursorColumn = index
          break
        cursorX += charWidth
      cursorX = cursorX - (line.slice(-1).charCodeAt() <= 255 && @defaultCharWidth || @doubleCharWidth) if cursorColumn is -1
      cursorColumn = line.length > 0 && line.length - 1 || 0 if cursorColumn is -1
      if  @virtualMode and cursorColumn > 0
        cursorColumn -= 1
        cursorX -= @defaultCharWidth

      cursorY = cursorRow * @lineHeight
      @setState {
        cursorRow, cursorColumn
        cursorWidth: @virtualMode and @defaultCharWidth or @insertCursorWidth
        cursorHeight: @lineHeight
        cursorX, cursorY, hiddenInputValue: ''
      }

    updateCursorPosition: (cursorRow, cursorColumn) =>
      cursorRow ?= @state.cursorRow
      cursorColumn ?= @state.cursorColumn
      {contentRows} = @state
      line = contentRows[cursorRow] || ''
      cursorX = 0
      for char, index in line
        charWidth = if char.charCodeAt() <= 255 then @defaultCharWidth else @doubleCharWidth
        break if index >= cursorColumn
        cursorX += charWidth
      cursorY = cursorRow * @lineHeight
      # test
      if cursorColumn < 0 or cursorColumn > line.length
        throw new Error "cursorColumn is #{cursorColumn}, is less 0 or greater line length #{line.length}"
      console.log @virtualMode
      @setState {
        cursorRow, cursorColumn, cursorX, cursorY,
        cursorWidth: @virtualMode and @defaultCharWidth or @insertCursorWidth
      }

    pasteText: (texts) =>
      {contentRows, cursorRow, cursorColumn} = @state
      line = contentRows[cursorRow] || ''
      if texts[0] is ''
        texts = texts[1..]
        newLine = line[...cursorColumn] + '\n'
        newLineNext = line[cursorColumn..]
        contentRows = [contentRows[...cursorRow]..., newLine, newLineNext, contentRows[cursorRow + 1..]...]
        cursorRow += 1
        cursorColumn = 0
        if texts.slice(-1)[0] is ''
          contentRows = [contentRows[...cursorRow]..., texts[0...-1].map((i) -> i.concat '\n')..., '\n', contentRows[cursorRow..]...]
          cursorRow += texts.length
        else
          contentRows = [contentRows[...cursorRow]..., texts[0...-1].map((i) -> i.concat '\n')..., texts[texts.length - 1].concat contentRows[cursorRow], contentRows[cursorRow + 1..]...]
          cursorRow += texts.length - 1
      else
        if texts.length is 1
          newLine = line[...cursorColumn].concat(texts[0]).concat line[cursorColumn..]
          contentRows[cursorRow] = newLine
          cursorColumn += texts[0].length
        else if texts.slice(-1)[0] is ''
          newLine = line[...cursorColumn].concat(texts[0]).concat '\n'
          newLineNext = line[cursorColumn..]
          contentRows = [contentRows[...cursorRow]..., newLine, texts[1...-1].map((i) -> i.concat '\n')..., newLineNext, contentRows[cursorRow + 1..]...]
          cursorColumn = 0
          cursorRow += texts.length - 1
        else
          newLine = line[...cursorColumn].concat(texts[0]).concat '\n'
          newLineNext = line[cursorColumn..]
          contentRows = [contentRows[...cursorRow]..., newLine, texts[1...-1].map((i) -> i.concat '\n')..., texts[texts.length - 1].concat newLineNext, contentRows[cursorRow + 1..]...]
          cursorColumn = texts[texts.length - 1].length
          cursorRow += texts.length - 1
      @setState {contentRows, hiddenInputValue: ''}, () ->
        @updateCursorPosition cursorRow, cursorColumn

    insertText: (text) =>
      {contentRows, cursorRow, cursorColumn} = @state
      line = contentRows[cursorRow] || ''
      if @inputStartColumn is -1
        @inputStartColumn = cursorColumn
        @inputEndColumn = line.length - cursorColumn
      line = [line[...@inputStartColumn], text, if @inputEndColumn > 0 then line[-@inputEndColumn..] else ''].join('')
      cursorColumn = @inputStartColumn + text.length
      contentRows[cursorRow] = line
      @setState {contentRows, hiddenInputValue: text}
      @updateCursorPosition cursorRow, cursorColumn

    insertBackspace: () =>
      {contentRows, cursorRow, cursorColumn, hiddenInputValue} = @state
      line = contentRows[cursorRow] || ''
      if cursorColumn is 0
        if cursorRow isnt 0
          previousLine = contentRows[cursorRow - 1]
          cursorColumn = previousLine.length - 1
          combinedLine = previousLine.trimRight().concat line
          contentRows = [contentRows[...cursorRow - 1]..., combinedLine, contentRows[cursorRow + 1..]...]
          cursorRow -= 1
      else
        line = [line[...cursorColumn - 1], line[cursorColumn..]].join ''
        contentRows[cursorRow] = line
        cursorColumn -= 1
      @setState {contentRows}
      @updateCursorPosition cursorRow, cursorColumn

    insertEnter: () =>
      @inputStartColumn = -1
      {contentRows, cursorRow, cursorColumn} = @state
      line = contentRows[cursorRow] || ''
      newLine = line[...cursorColumn] + '\n'
      newLineNext = line[cursorColumn..]
      contentRows = [contentRows[...cursorRow]..., newLine, newLineNext, contentRows[cursorRow + 1..]...]
      cursorRow += 1
      cursorColumn = 0
      @setState {contentRows, hiddenInputValue: ''}
      @updateCursorPosition cursorRow, cursorColumn

    render: ->
      {contentRows, cursorX, cursorY, cursorWidth, cursorHeight, hiddenInputValue} = @state
      contentRows = contentRows.map (i, index) ->
        TextTransformer.transform i
      editorProps = {contentRows, cursorX, cursorY, cursorWidth, cursorHeight,
        hiddenInputValue, @onEditorMouseDown, @setEditorOptions,
        @onHiddenInputChange, @onHiddenInputKeyDown, @onHiddenInputPaste,
        @onHiddenInputKeyPress}
      createElement Editor, editorProps
