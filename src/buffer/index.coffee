string = require './string'

module.exports =
  class UnorderedEditorBuffer
    constructor: () ->
      @_updateEditor = ->
      @_buffer = []
      @_cursorWidth = @_cursorX = @_cursorY = @_cursorRow = @_cursorCol = @_defaultCharWidth = @_doubleCharWidth = @_lineHeight = 0

    setOptions: (options) ->
      @_defaultCharWidth = options.defaultCharWidth if Number(options.defaultCharWidth) > 0
      @_doubleCharWidth = options.doubleCharWidth if Number(options.doubleCharWidth) > 0
      @_lineHeight = options.lineHeight if Number(options.lineHeight) > 0
      @_updateEditor = options.updateEditor if options.updateEditor

    initBuffer: (text) ->
      @_buffer = string.textToRows text
      @_ensureBufferEndsWithAEmptyString()

    updateEditor: () -> @_updateEditor()

    getRows: -> @_buffer

    getRow: (row) -> @_buffer[row]

    getRowCount: (row) -> @_buffer.length

    getRowLength: (row) -> @_buffer[row]?.length

    getCursor: ->
      cursorRow: @_cursorRow
      cursorCol: @_cursorCol
      cursorX: @_cursorX
      cursorY: @_cursorY
      cursorWidth: @_cursorWidth

    _ensureRowAndCol: (cursorRow, cursorCol) ->
      cursorRow = @_buffer.length - 1 if cursorRow >= @_buffer.length
      cursorRow = 0 if cursorRow < 0
      row = @_buffer[cursorRow]
      if row.endsWith '\n'
        cursorCol = @_buffer[cursorRow].length - 1 if cursorCol >= @_buffer[cursorRow].length
      else
        cursorCol = @_buffer[cursorRow].length - 1 if cursorCol > @_buffer[cursorRow].length
      cursorCol = 0 if cursorCol < 0
      return [cursorRow, cursorCol]

    _validateRowAndCol: (cursorRow, cursorCol) ->
      if cursorRow < 0 or cursorRow >= @_buffer.length
        throw new Error "#{cursorRow} row is out of range #{@_buffer.length}"
      row = @_buffer[cursorRow]
      if cursorCol < 0
        throw new Error "#{cursorCol} col is out of range #{@_buffer[cursorRow].length}"
      # NOTE: syntax error, `row.endsWith '\n' and` must be `row.endsWith('\n') and`
      if row.endsWith('\n') and cursorCol >= row.length
        throw new Error "#{cursorCol} col is out of range #{@_buffer[cursorRow].length}, that is endswith \n"
      else if cursorCol > row.length
        throw new Error "#{cursorCol} col is out of range #{@_buffer[cursorRow].length}"

    _validateRowAndInvertedEndColWithAnyChar: (cursorRow, endCol) ->
      if cursorRow < 0 or cursorRow >= @_buffer.length
        throw new Error "#{cursorRow} row is out of range #{@_buffer.length}"
      row = @_buffer[cursorRow]
      if endCol > 0
        throw new Error "inverted end column is must be less than or equal to 0, but it's #{endCol}"
      else if -endCol > row.length
        throw new Error "inverted end cololumn (#{endCol}) is out of range #{@_buffer[cursorRow].length}"

    _updateCursorWidth: ->
      @_cursorWidth = if @_buffer[@_cursorRow][@_cursorCol]?.charCodeAt() > 255 then @_doubleCharWidth else @_defaultCharWidth

    setCursorPosition: (cursorRow, cursorCol) ->
      @_validateRowAndCol cursorRow, cursorCol
      row = @_buffer[cursorRow]
      cursorX = 0
      for char, index in row
        if index is cursorCol
          break
        cursorX += if char.charCodeAt() > 255 then @_doubleCharWidth else @_defaultCharWidth
      @_cursorX = cursorX
      @_cursorY = @_lineHeight * cursorRow
      @_cursorRow = cursorRow
      @_cursorCol = cursorCol
      @_updateCursorWidth()
      @updateEditor()

    moveCursorLeft: ->
      if @_cursorCol > 0
        @setCursorPosition @_cursorRow, @_cursorCol - 1
      else if @_cursorRow > 0
        row = @_buffer[@_cursorRow]
        previousRowLength = @_buffer[@_cursorRow - 1].length
        @setCursorPosition @_cursorRow - 1, previousRowLength - 1

    moveCursorUp: ->
      return unless @_cursorRow > 0
      previousRowLength = @_buffer[@_cursorRow - 1].length
      if previousRowLength > @_cursorCol
        @setCursorPosition @_cursorRow - 1, @_cursorCol
      else
        @setCursorPosition @_cursorRow - 1, previousRowLength - 1

    moveCursorRight: ->
      row = @_buffer[@_cursorRow]
      if row.endsWith '\n'
        if @_cursorCol < row.length - 1
          @setCursorPosition @_cursorRow, @_cursorCol + 1
        else if @_buffer.length > @_cursorRow + 1
          @setCursorPosition @_cursorRow + 1, 0
      else
        if @_cursorCol < row.length
          @setCursorPosition @_cursorRow, @_cursorCol + 1
        else if @_buffer.length > @_cursorRow + 1
          @setCursorPosition @_cursorRow + 1, 0

    moveCursorDown: ->
      return unless @_cursorRow < @_buffer.length - 1
      nextRow = @_buffer[@_cursorRow + 1]
      if nextRow.endsWith('\n')
        if nextRow.length > @_cursorCol
          @setCursorPosition @_cursorRow + 1, @_cursorCol
        else
          @setCursorPosition @_cursorRow + 1, nextRow.length - 1
      else
        if nextRow.length >= @_cursorCol
          @setCursorPosition @_cursorRow + 1, @_cursorCol
        else
          @setCursorPosition @_cursorRow + 1, nextRow.length

    setCursorCoords: (x, y) ->
      cursorRow = Math.floor y / @_lineHeight
      [cursorRow, _] = @_ensureRowAndCol cursorRow, 0
      row = @_buffer[cursorRow]
      row = row[0...-1] if row.endsWith '\n'

      cursorWidth = cursorX = 0
      cursorCol = -1
      for char, index in row
        cursorWidth = if char.charCodeAt() > 255 then @_doubleCharWidth else @_defaultCharWidth
        if x <= cursorWidth / 2 + cursorX
          cursorCol = index
          break
        cursorX += cursorWidth
      cursorCol = row.length if cursorCol is -1
      [_, cursorCol] = @_ensureRowAndCol cursorRow, cursorCol
      @setCursorPosition cursorRow, cursorCol

    _ensureBufferEndsWithAEmptyString: ->
      if @_buffer[@_buffer.length - 1].endsWith '\n'
        @_buffer = @_buffer.concat ''

    # NOTE: remove some text of the specified area
    #   and update cursor position before deleted text.
    _clearRangeText: (startRow, startCol, endRow, endCol) ->
      @_validateRowAndCol startRow, startCol
      @_validateRowAndCol endRow, endCol
      combinedRow = @_buffer[startRow][0...startCol].concat @_buffer[endRow][endCol...] or ''
      @_buffer = [@_buffer[0...startRow]..., combinedRow, @_buffer[endRow + 1...]...]
      @setCursorPosition startRow, startCol

    # NOTE: remove some text of the specified area
    #   with the inverted end column but not inverted end row,
    #   and update cursor position before deleted text.
    _clearRangeTextInvertedEndCol: (startRow, startCol, endRow, endCol) ->
      @_validateRowAndCol startRow, startCol
      @_validateRowAndInvertedEndColWithAnyChar endRow, endCol
      combinedRow = @_buffer[startRow][0...startCol].concat if endCol isnt 0 then @_buffer[endRow][endCol...] else ''
      @_buffer = [@_buffer[0...startRow]..., combinedRow, @_buffer[endRow + 1...]...]
      @setCursorPosition startRow, startCol

    # NOTE: insert some text into specified position and update cursor position
    #   after the new text.
    _insertTextAt: (text, cursorRow, cursorCol) ->
      @_validateRowAndCol cursorRow, cursorCol
      row = @_buffer[cursorRow]
      newRowText = row[0...cursorCol].concat(text).concat row[cursorCol...]
      newRows = string.textToRows newRowText
      @_buffer = [@_buffer[0...cursorRow]..., newRows..., @_buffer[cursorRow + 1...]...]
      @_ensureBufferEndsWithAEmptyString()
      cursorRow += newRows.length - 1
      if cursorCol is row.length and text.endsWith '\n'
        cursorRow += 1
      if text.endsWith '\n'
        cursorCol = 0
      else
        cursorCol = newRows.slice(-1)[0].length - row[cursorCol...].length
      @setCursorPosition cursorRow, cursorCol

    # NOTE: replace the contents of the specified area.
    setRangeText: (text, startRow, startCol, endRow, endCol) ->
      @_clearRangeText startRow, startCol, endRow, endCol
      @_insertTextAt text, startRow, startCol

    # NOTE: replace the contents of the specified area
    #   with the inverted end column but not inverted end row.
    setRangeTextInvertedEndCol: (text, startRow, startCol, endRow, endCol) ->
      @_clearRangeTextInvertedEndCol startRow, startCol, endRow, endCol
      @_insertTextAt text, startRow, startCol

    setRangeTextInLine: (text, startCol, endCol) ->
      @setRangeText text, @_cursorRow, startCol, @_cursorRow, endCol

    setRangeTextInLineInvertedEndCol: (text, startCol, endCol) ->
      @setRangeTextInvertedEndCol text, @_cursorRow, startCol, @_cursorRow, endCol

    insertText: (text) ->
      @setRangeTextInLine text, @_cursorCol, @_cursorCol

    deletePreviousChar: ->
      if @_cursorCol > 0
        @_clearRangeText @_cursorRow, @_cursorCol - 1, @_cursorRow, @_cursorCol
      else if @_cursorRow > 0
        row = @_buffer[@_cursorRow]
        previousRowLength = @_buffer[@_cursorRow - 1].length
        @_clearRangeText @_cursorRow - 1, previousRowLength - 1, @_cursorRow, 0
