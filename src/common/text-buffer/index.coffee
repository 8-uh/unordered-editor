{Component, createElement} = require 'react'

module.exports =
  connect: (Editor) ->
    class TextBuffer extends Component
      constructor: (props) ->
        super props
        @virtualMode = true
        @defaultCharWidth = 0
        @defaultCharHeight = 0
        @doubleCharWidth = 0
        @doubleCharHeight = 0
        @lineHeight = 0
        @inputStartColumn = -1
        @inputEndColumn = -1
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
          hiddenInputFocus: false

      setCharSize: ({@defaultCharWidth, @defaultCharHeight, @doubleCharWidth, @doubleCharHeight, @lineHeight}) =>
        @setState({cursorHeight: @lineHeight})

      setHiddenInputValue: (value) =>
        if @virtualMode
          @controlVim(value)
        else
          @insertText(value)

      controlVim: (value) ->
        switch value
          when 'i'
            @disableVirtualMode()
          when 'h'
            @virtualModeMoveLeft()
          when 'j'
            @virtualModeMoveDown()
          when 'k'
            @virtualModeMoveUp()
          when 'l'
            @virtualModeMoveRight()
          when '0'
            @virtualModeMoveToStart()
          when '$'
            @virtualModeMoveToEnd()
          when '^'
            @virtualModeMoveToStartWithoutSpace()
          when 'W'
            @virtualModeW()
          when 'w'
            @virtualModeW()
          when 'B'
            @virtualModeB()
          when 'b'
            @virtualModeB()
          when 'E'
            @virtualModeE()
          when 'e'
            @virtualModeE()
          when 'a'
            @virtualModea()

      onHiddenInputFocus: () =>
        @setState {hiddenInputFocus: not @virtualMode}

      onHiddenInputBlur: () =>
        @setState {hiddenInputFocus: false}

      onHiddenInputKeyDown: (e) =>
        if not @virtualMode
          if e.keyCode is 13 # enter
            @insertEnter()
          if e.keyCode is 8 # backspace
            @insertBackspace()
          if e.keyCode is 27 # escape
            @enableVirtualMode()

      onHiddenInputKeyPress: (e) =>

      onHiddenInputKeyUp: (e) =>

      disableVirtualMode: ->
        @virtualMode = false
        @setState {hiddenInputFocus: true}

      virtualModea: ->
        {content: {rows}, cursorColumn, cursorRow} = @state
        line = rows[cursorRow] || ''
        if line.length > 0 and line.slice(-1) isnt '\n'
          cursorColumn += 1
        console.log cursorColumn
        @virtualMode = false
        @setState {cursorColumn, hiddenInputFocus: true}
        @updateCursorPosition cursorRow, cursorColumn

      enableVirtualMode: ->
        @virtualMode = true
        @inputStartColumn = -1
        @inputEndColumn = -1
        {content: {rows}, cursorColumn, cursorRow} = @state
        line = rows[cursorRow] || ''
        if line.length > 0 and line.slice(-1) isnt '\n'
          cursorColumn -= 1
        console.log cursorColumn
        @setState {cursorColumn, hiddenInputValue: '', hiddenInputFocus: false}
        @updateCursorPosition cursorRow, cursorColumn

      virtualModeMoveLeft: ->
        {cursorRow, cursorColumn} = @state
        if cursorColumn > 0
          cursorColumn -= 1
          @setState {cursorColumn}
          @updateCursorPosition cursorRow, cursorColumn

      virtualModeMoveUp: ->
        {content: {rows}, cursorRow, cursorColumn} = @state
        if cursorRow > 0
          cursorRow -= 1
          previousLineLength = rows[cursorRow]?.length || 0
          if previousLineLength <= cursorColumn
            cursorColumn = previousLineLength - 1
          @setState {cursorRow, cursorColumn}
          @updateCursorPosition cursorRow, cursorColumn

      virtualModeMoveRight: ->
        {content: {rows}, cursorRow, cursorColumn} = @state
        if rows[cursorRow]?.length > cursorColumn + 1
          cursorColumn += 1
          @setState {cursorColumn}
          @updateCursorPosition cursorRow, cursorColumn

      virtualModeMoveDown: ->
        {content: {rows}, cursorRow, cursorColumn} = @state
        if cursorRow < rows.length - 1
          cursorRow += 1
          nextLineLength = rows[cursorRow]?.length || 0
          if nextLineLength <= cursorColumn
            cursorColumn = nextLineLength - 1
          @setState {cursorRow, cursorColumn}
          @updateCursorPosition cursorRow, cursorColumn

      virtualModeMoveToStart: ->
        {cursorRow, cursorColumn} = @state
        if cursorColumn isnt 0
          cursorColumn = 0
          @setState {cursorColumn}
          @updateCursorPosition cursorRow, cursorColumn

      virtualModeMoveToEnd: ->
        {content: {rows}, cursorRow, cursorColumn} = @state
        lineLength = rows[cursorRow]?.length || 0
        if cursorColumn isnt lineLength - 1
          cursorColumn = lineLength > 0 and lineLength - 1 or 0
          @setState {cursorColumn}
          @updateCursorPosition cursorRow, cursorColumn

      virtualModeMoveToStartWithoutSpace: ->
        {content: {rows}, cursorRow, cursorColumn} = @state
        spaceLength = rows[cursorRow]?.search /\S/
        if cursorColumn isnt spaceLength
          cursorColumn = spaceLength >= 0 and spaceLength or 0
          @setState {cursorColumn}
          @updateCursorPosition cursorRow, cursorColumn

      virtualModeW: ->
        {content: {rows}, cursorRow, cursorColumn} = @state
        line = rows[cursorRow][cursorColumn...]
        if line.match /\S*\s+\S+/
          columnSpan = line.match(/\S*\s+/)[0].length
          cursorColumn += columnSpan
        else if cursorRow < rows.length - 1
          cursorRow += 1
          spaceLength = rows[cursorRow]?.search /\S/
          if cursorColumn isnt spaceLength
            cursorColumn = spaceLength >= 0 and spaceLength or 0
        @setState {cursorRow, cursorColumn}
        @updateCursorPosition cursorRow, cursorColumn

      virtualModeB: ->
        {content: {rows}, cursorRow, cursorColumn} = @state
        if cursorColumn > 0
          line = rows[cursorRow][..cursorColumn]
          columnSpan = line.match(/\S+\s*\S*$/)[0].length
          if columnSpan isnt 1
            cursorColumn -= columnSpan - 1
          else if cursorRow > 0
            cursorRow -= 1
            previousLine = rows[cursorRow]
            cursorColumn = previousLine.length - previousLine.match(/\S+\s*$/)[0].length
            cursorColumn = 0 if cursorColumn < 0
        else if cursorRow > 0
          cursorRow -= 1
          previousLine = rows[cursorRow]
          cursorColumn = previousLine.length - previousLine.match(/\S+\s*$/)[0].length
          cursorColumn = 0 if cursorColumn < 0
        @setState {cursorRow, cursorColumn}
        @updateCursorPosition cursorRow, cursorColumn

      virtualModeE: ->
        {content: {rows}, cursorRow, cursorColumn} = @state
        line = rows[cursorRow][cursorColumn + 1...]
        if line.match /\s*\S+/
          columnSpan = line.match(/\s*\S+/)[0].length
          cursorColumn += columnSpan
        else if cursorRow < rows.length - 1
          cursorRow += 1
          cursorColumn = 0
          line = rows[cursorRow]
          if line.match /\s*\S+/
            cursorColumn = line.match(/\s*\S+/)[0].length - 1
        @setState {cursorRow, cursorColumn}
        @updateCursorPosition cursorRow, cursorColumn

      setCursorPosition: (x, y) =>
        @inputStartColumn = -1
        @inputEndColumn = -1
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
        @setState {cursorRow, cursorColumn, cursorWidth, cursorX, cursorY, hiddenInputValue: ''}

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
        # test
        if cursorColumn < 0 or cursorColumn > line.length
          throw new Error "cursorColumn is #{cursorColumn}, is less 0 or greater line length #{line.length}"
        @setState {cursorRow, cursorColumn, cursorWidth, cursorX, cursorY}

      insertBackspace: () ->
        {content: {rows}, cursorRow, cursorColumn, hiddenInputValue} = @state
        line = rows[cursorRow] || ''
        if cursorColumn is 0
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
        {content: {rows}, cursorRow, cursorColumn} = @state
        line = rows[cursorRow] || ''
        newLine = line[...cursorColumn] + '\n'
        newLineNext = line[cursorColumn..]
        rows = [rows[...cursorRow]..., newLine, newLineNext, rows[cursorRow + 1..]...]
        cursorRow += 1
        cursorColumn = 0
        @setState {content: {rows}, hiddenInputValue: ''}
        @updateCursorPosition cursorRow, cursorColumn

      insertText: (text) ->
        {content: {rows}, cursorRow, cursorColumn} = @state
        line = rows[cursorRow] || ''
        if @inputStartColumn is -1
          @inputStartColumn = cursorColumn
          @inputEndColumn = line.length - cursorColumn
        line = [line[...@inputStartColumn], text, if @inputEndColumn > 0 then line[-@inputEndColumn..] else ''].join('')
        cursorColumn = @inputStartColumn + text.length
        rows[cursorRow] = line
        @setState {content: {rows}, hiddenInputValue: text}
        @updateCursorPosition cursorRow, cursorColumn

      render: ->
        {content, cursorX, cursorY, cursorWidth, cursorHeight, hiddenInputValue, hiddenInputFocus} = @state
        finalProps = {content, cursorX, cursorY, cursorWidth, cursorHeight, hiddenInputValue, hiddenInputFocus,
          @setCharSize, @setCursorPosition, @setHiddenInputValue,
          @onHiddenInputKeyDown, @onHiddenInputKeyPress, @onHiddenInputKeyUp,
          @onHiddenInputFocus, @onHiddenInputBlur}
        createElement Editor, finalProps

    TextBuffer
