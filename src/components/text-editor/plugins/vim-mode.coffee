module.exports =
  class VimMode
    constructor: (@buffer) ->
      @buffer.addHiddenInputKeyDownListener @handleKeyDown
      @buffer.addHiddenInputKeyPressListener @handleKeyPress

    handleKeyDown: (e) =>
      switch e.keyCode
        when 27
          if not @buffer.virtualMode
            @buffer.virtualMode = true
            @buffer.inputStartColumn = -1
            {cursorRow, cursorColumn} = @buffer.state
            cursorColumn -= 1 if cursorColumn > 0
            @buffer.setState {hiddenInputValue: ''}
            @buffer.updateCursorPosition cursorRow, cursorColumn

      if @buffer.virtualMode and e.keyCode isnt 229
        e.preventDefault() if e.key isnt 'r'
        switch e.key
          when 'i'
            @insert()
          when 'a'
            @afterInsert()
          when 'h'
            @moveLeft()
          when 'j'
            @moveDown()
          when 'k'
            @moveUp()
          when 'l'
            @moveRight()
          when '0'
            @moveToLineStart()
          when '$'
            @moveToLineEnd()
          when '^'
            @moveToLineStartLetter()
          when 'W'
            @moveToNextWord()
          when 'w'
            @moveToNextWord()
          when 'B'
            @moveToPreviousWord()
          when 'b'
            @moveToPreviousWord()
          when 'E'
            @moveToCurrentWordEnd()
          when 'e'
            @moveToCurrentWordEnd()

    handleKeyPress: (e) =>

    insert: ->
      @buffer.virtualMode = false
      @buffer.updateCursorPosition()

    afterInsert: ->
      {contentRows, cursorColumn, cursorRow} = @buffer.state
      line = contentRows[cursorRow] || ''
      if line isnt '' and line isnt '\n'
        cursorColumn += 1
      @buffer.virtualMode = false
      @buffer.updateCursorPosition cursorRow, cursorColumn

    moveLeft: ->
      {cursorRow, cursorColumn} = @buffer.state
      if cursorColumn > 0
        cursorColumn -= 1
        @buffer.updateCursorPosition cursorRow, cursorColumn

    moveUp: ->
      {contentRows, cursorRow, cursorColumn} = @buffer.state
      if cursorRow > 0
        cursorRow -= 1
        cursorColumn = Math.min(contentRows[cursorRow].length - 2, cursorColumn)
        cursorColumn = 0 if cursorColumn < 0
        @buffer.updateCursorPosition cursorRow, cursorColumn

    moveRight: ->
      {contentRows, cursorRow, cursorColumn} = @buffer.state
      if contentRows[cursorRow]?.endsWith '\n'
        if contentRows[cursorRow]?.length > cursorColumn + 2
          cursorColumn += 1
      else if contentRows[cursorRow]?.length > cursorColumn + 1
        cursorColumn += 1
      @buffer.updateCursorPosition cursorRow, cursorColumn

    moveDown: ->
      {contentRows, cursorRow, cursorColumn} = @buffer.state
      if cursorRow < contentRows.length - 1
        cursorRow += 1
        line = contentRows[cursorRow]
        if line.endsWith '\n'
          cursorColumn = Math.min(line.length - 2, cursorColumn)
        else
          cursorColumn = Math.min(line.length - 1, cursorColumn)
        cursorColumn = 0 if cursorColumn < 0
        @buffer.updateCursorPosition cursorRow, cursorColumn

    moveToLineStart: ->
      {cursorRow, cursorColumn} = @buffer.state
      if cursorColumn isnt 0
        cursorColumn = 0
        @buffer.updateCursorPosition cursorRow, cursorColumn

    moveToLineEnd: ->
      {contentRows, cursorRow, cursorColumn} = @buffer.state
      line = contentRows[cursorRow]
      if line.endsWith '\n'
        cursorColumn = Math.max(line.length - 2, cursorColumn)
      else
        cursorColumn = Math.max(line.length - 1, cursorColumn)
      cursorColumn = 0 if cursorColumn < 0
      @buffer.updateCursorPosition cursorRow, cursorColumn

    moveToLineStartLetter: ->
      {contentRows, cursorRow, cursorColumn} = @buffer.state
      spaceLength = contentRows[cursorRow]?.search /\S/
      if cursorColumn isnt spaceLength
        cursorColumn = spaceLength > 0 and spaceLength or 0
        @buffer.updateCursorPosition cursorRow, cursorColumn

    moveToNextWord: ->
      {contentRows, cursorRow, cursorColumn} = @buffer.state
      line = contentRows[cursorRow][cursorColumn...]
      if line.match /\S*\s+\S+/
        columnSpan = line.match(/\S*\s+/)[0].length
        cursorColumn += columnSpan
      else if cursorRow < contentRows.length - 1
        cursorRow += 1
        spaceLength = contentRows[cursorRow]?.search /\S/
        if cursorColumn isnt spaceLength
          cursorColumn = spaceLength >= 0 and spaceLength or 0
      @buffer.updateCursorPosition cursorRow, cursorColumn

    moveToPreviousWord: ->
      {contentRows, cursorRow, cursorColumn} = @buffer.state
      if cursorColumn > 0
        line = contentRows[cursorRow][..cursorColumn]
        columnSpan = line.match(/\S+\s*\S*$/)[0].length
        if columnSpan isnt 1
          cursorColumn -= columnSpan - 1
        else if cursorRow > 0
          cursorRow -= 1
          previousLine = contentRows[cursorRow]
          if not previousLine.match /\S+\s*$/
            cursorColumn = 0
          else
            cursorColumn = previousLine.length - previousLine.match(/\S+\s*$/)[0].length
            cursorColumn = 0 if cursorColumn < 0
      else if cursorRow > 0
        cursorRow -= 1
        previousLine = contentRows[cursorRow]
        if not previousLine.match /\S+\s*$/
          cursorColumn = 0
        else
          cursorColumn = previousLine.length - previousLine.match(/\S+\s*$/)[0].length
          cursorColumn = 0 if cursorColumn < 0
      @buffer.updateCursorPosition cursorRow, cursorColumn

    moveToCurrentWordEnd: ->
      {contentRows, cursorRow, cursorColumn} = @buffer.state
      line = contentRows[cursorRow][cursorColumn + 1...]
      if line.match /\s*\S+/
        columnSpan = line.match(/\s*\S+/)[0].length
        cursorColumn += columnSpan
      else if cursorRow < contentRows.length - 1
        cursorRow += 1
        cursorColumn = 0
        line = contentRows[cursorRow]
        if line.match /\s*\S+/
          cursorColumn = line.match(/\s*\S+/)[0].length - 1
      @buffer.updateCursorPosition cursorRow, cursorColumn
