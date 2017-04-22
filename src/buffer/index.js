import strings from './strings'

export default class UnorderedEditorBuffer {
  __buffer = []

  get _buffer () {
    return this.__buffer
  }

  set _buffer (buffer) {
    this.__buffer = buffer
    this._ensureBufferEndsWithEmptyString()
  }

  get buffer () {
    return this._buffer
  }

  // init buffer texts.
  initBuffer (text) {
    this._buffer = strings.textToRows(text)
  }

  // get the line of specified row index.
  getRow (rowIndex) {
    return this._buffer[rowIndex]
  }

  // get the line count of buffer.
  getRowCount () {
    return this._buffer.length
  }

  // get the line length of specified row index.
  getRowLength (rowIndex) {
    const row = this._buffer[rowIndex]
    return row ? row.length : undefined
  }

  // replace the text of the specified area.
  setText (startRow, startCol, endRow, endCol, text) {
    this._clearText(startRow, startCol, endRow, endCol)
    this._insertTextAt(startRow, startCol, text)
  }

  // insert text at the position.
  _insertTextAt (row, col, text) {
    this._ensureRowAndColExist(row, col)
    const line = this._buffer[row]
    const newLine = line.slice(0, col).concat(text).concat(line.slice(col))
    const newLines = strings.textToRows(newLine)
    this._buffer = this._buffer
      .slice(0, row)
      .concat(newLines)
      .concat(this._buffer.slice(row + 1))
  }

  // remove the text of the specified area.
  _clearText (startRow, startCol, endRow, endCol) {
    this._ensureRowAndColExist(startRow, startCol)
    this._ensureRowAndColExist(endRow, endCol)
    const textBefore = this._buffer[startRow].slice(0, startCol)
    const textAfter = this._buffer[endRow].slice(endCol)
    const combinedLine = textBefore.concat(textAfter)
    this._buffer = this.buffer
      .slice(0, startRow)
      .concat(combinedLine)
      .concat(this._buffer.slice(endRow + 1))
  }

  // ensure the row and col is exist in buffer.
  // throw error if the position is not exists.
  // 0 <= row < buffer.length.
  // 0 <= col <= line.length.
  _ensureRowAndColExist (row, col) {
    if (row < 0 || row >= this._buffer.length) {
      throw new Error(`row number ${row} is out of range ${this._buffer.length}`)
    }
    const line = this._buffer[row]
    if (col < 0 || col > line.length) {
      throw new Error(`col number ${col} is out of range ${line.length}`)
    }
  }

  // ensure last line of buffer is a empty string
  // when the second line from bottom is ends with '\n'.
  _ensureBufferEndsWithEmptyString () {
    if (this._buffer.length === 0) {
      this._buffer = ['']
    } else {
      const lastLine = this._buffer[this._buffer.length - 1]
      if (lastLine.endsWith('\n')) {
        this._buffer = this._buffer.concat('')
      } else if (this._buffer.length > 1 && lastLine === '') {
        // NOTE: if the last line is empty string and
        // the second line from bottom is not ends with '\n',
        // delete the last line.
        const secondLineFromBottom = this._buffer[this._buffer.length - 2]
        if (!secondLineFromBottom.endsWith('\n')) {
          this._buffer = this._buffer.slice(0, -1)
        }
      }
    }
  }
}
