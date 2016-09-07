{Component, createElement} = require 'react'

module.exports =
  connect: (Editor) ->
    class TextBuffer extends Component
      constructor: (props) ->
        super props
        @defaultCharWidth = 0
        @defaultCharHeight = 0
        @doubleCharWidth = 0
        @doubleCharHeight = 0
        @lineHeight = 0
        @imeInputing = false
        @imeInputShift = false
        @imeInputStartColumn = -1
        @imeInputEndColumn = -1
        @state =
          content:
            rows: []
          cursorRow: 0
          cursorColumn: 0
          cursorX: 0
          cursorY: 0
          cursorWidth: 0
          cursorHeight: 0
          hiddenInputValue: ''

      setCharSize: ({@defaultCharWidth, @defaultCharHeight, @doubleCharWidth, @doubleCharHeight, @lineHeight}) =>
        @setState({cursorHeight: @lineHeight})

      setHiddenInputValue: (hiddenInputValue) => @setState {hiddenInputValue}

      onHiddenInputKeyDown: (e) =>
        console.log 'key down', e.keyCode
        if e.keyCode >= 186 and e.keyCode <= 191 or e.keyCode >= 219 and e.keyCode <= 222 or e.keyCode >= 48 and e.keyCode <= 57 or e.keyCode >= 65 and e.keyCode <= 90
          {hiddenInputValue} = @state
          @insertText hiddenInputValue
          @setState {hiddenInputValue: ''}
        if e.keyCode is 13 # enter
          @insertEnter()
        if e.keyCode is 8 # backspace
          @insertBackspace()
        if e.keyCode is 32 # space
          {hiddenInputValue} = @state
          @insertText hiddenInputValue
          @setState {hiddenInputValue: ''}
        if e.keyCode is 229 # ime input
          if not @imeInputing
            {content: {rows}, cursorRow, cursorColumn} = @state
            @imeInputStartColumn = cursorColumn
            @imeInputEndColumn = (rows[cursorRow] || '').length - cursorColumn
            @imeInputing = true

      onHiddenInputKeyUp: (e) =>
        console.log 'key up', e.keyCode
        if e.keyCode >= 186 and e.keyCode <= 191 or e.keyCode >= 219 and e.keyCode <= 222 or e.keyCode >= 48 and e.keyCode <= 57 or e.keyCode >= 65 and e.keyCode <= 90
          {hiddenInputValue} = @state
          @insertText hiddenInputValue
          if not @imeInputing
            @setState {hiddenInputValue: ''}
        if e.keyCode is 8 # backspace
          if @imeInputing
            @insertBackspace()
        if e.keyCode is 13 # enter
          if @imeInputing
            @insertEnter()
            @setState {hiddenInputValue: ''}
        if e.keyCode is 32 # space
          if @imeInputing
            {hiddenInputValue} = @state
            @insertText hiddenInputValue
            if not @imeInputShift
              @setState {hiddenInputValue: ''}
              @imeInputing = false
              @imeInputStartColumn = -1
              @imeInputEndColumn = -1
        if e.keyCode is 16 # shift
          if @imeInputing
            @imeInputShift = not @imeInputShift

      setCursorPosition: (x, y) =>
        {defaultCharWidth, doubleCharWidth, lineHeight} = this
        {content: {rows}} = @state
        cursorRow = Math.floor(y / lineHeight)
        cursorRow = rows.length - 1 if cursorRow > rows.length - 1
        cursorRow = 0 if cursorRow < 0
        line = rows[cursorRow] || ''
        if line.slice(-1) isnt '\n'
          line = line.concat '\n'
        cursorWidth = 0
        cursorColumn = -1
        cursorX = 0
        for char, index in line
          charWidth = if char.charCodeAt() <= 255 then defaultCharWidth else doubleCharWidth
          if x >= cursorX and x < cursorX + charWidth
            cursorColumn = index
            cursorWidth = charWidth
            break
          cursorX += charWidth
        if cursorWidth is 0 and line
          charCode = line.slice(-1).charCodeAt()
          if charCode
            cursorWidth = charCode <= 255 and defaultCharWidth or doubleCharWidth
            cursorX -= cursorWidth
        cursorColumn = line.length > 0 && line.length - 1 || 0 if cursorColumn is -1
        cursorY = cursorRow * lineHeight
        @setState {cursorRow, cursorColumn, cursorWidth, cursorX, cursorY}

      # just allow invoked after insert text, insert enter and backspace by text-buffer self
      updateCursorPosition: (cursorRow, cursorColumn) ->
        {defaultCharWidth, doubleCharWidth, lineHeight} = this
        {content: {rows}} = @state
        line = rows[cursorRow] || ''
        cursorWidth = 0
        cursorX = 0
        for char, index in line
          cursorWidth = if char.charCodeAt() <= 255 then defaultCharWidth else doubleCharWidth
          break if index >= cursorColumn
          cursorX += cursorWidth
        cursorY = cursorRow * lineHeight
        cursorWidth = defaultCharWidth if cursorWidth is 0
        @setState {cursorRow, cursorColumn, cursorWidth, cursorX, cursorY}

      insertBackspace: () ->
        {content: {rows}, cursorRow, cursorColumn, hiddenInputValue} = @state
        line = rows[cursorRow] || ''
        if @imeInputing
          line = [line[...@imeInputStartColumn], hiddenInputValue, if @imeInputEndColumn > 0 then line[-@imeInputEndColumn..] else ''].join('')
          rows[cursorRow] = line
          cursorColumn = @imeInputStartColumn + hiddenInputValue.length
          if hiddenInputValue.length is 0
            @imeInputing = false
            # @imeShift = false
            @imeInputStartColumn = -1
            @imeInputEndColumn = -1
        else if cursorColumn is 0
          if cursorRow isnt 0
            previousLine = rows[cursorRow - 1]
            cursorColumn = previousLine.length - 1
            combinedLine = previousLine.trim().concat line
            rows = [rows[...cursorRow - 1]..., combinedLine, rows[cursorRow + 1..]...]
            cursorRow -= 1
        else
          line = [line[...cursorColumn - 1], line[cursorColumn..]].join ''
          rows[cursorRow] = line
          cursorColumn -= 1
        @setState {content: {rows}}
        @updateCursorPosition cursorRow, cursorColumn

      insertEnter: () ->
        {content: {rows}, cursorRow, cursorColumn, hiddenInputValue} = @state
        line = rows[cursorRow] || ''
        if @imeInputing
          line = rows[cursorRow] || '\n'
          line = [line[...@imeInputStartColumn], hiddenInputValue, if @imeInputEndColumn > 0 then line[-@imeInputEndColumn..] else ''].join('')
          rows[cursorRow] = line
          cursorColumn: @imeInputStartColumn + hiddenInputValue.length
          @imeInputing = false
          # @imeShift = false
          @imeInputStartColumn = -1
          @imeInputEndColumn = -1
        else
          newLine = line[...cursorColumn] + '\n'
          newLineNext = line[cursorColumn..]
          rows = [rows[...cursorRow]..., newLine, newLineNext, rows[cursorRow + 2..]...]
          cursorRow += 1
          cursorColumn = 0
        @setState {content: {rows}}
        @updateCursorPosition cursorRow, cursorColumn

      insertText: (text) ->
        {content: {rows}, cursorRow, cursorColumn} = @state
        line = rows[cursorRow] || ''
        if @imeInputing
          line = [line[...@imeInputStartColumn], text, if @imeInputEndColumn > 0 then line[-@imeInputEndColumn..] else ''].join('')
          cursorColumn = @imeInputStartColumn + text.length
        else
          line = [line[...cursorColumn], text, line[cursorColumn..]].join('')
          cursorColumn += text.length
        rows[cursorRow] = line
        @setState {content: {rows}}
        @updateCursorPosition cursorRow, cursorColumn

      render: ->
        {content, cursorX, cursorY, cursorWidth, cursorHeight, hiddenInputValue} = @state
        finalProps = {content, cursorX, cursorY, cursorWidth, cursorHeight, hiddenInputValue,
          @setCharSize, @setCursorPosition, @setHiddenInputValue, @onHiddenInputKeyDown, @onHiddenInputKeyUp}
        createElement Editor, finalProps

    TextBuffer
