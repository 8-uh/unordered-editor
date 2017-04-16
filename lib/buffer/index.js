// Generated by CoffeeScript 1.12.5
var UnorderedEditorBuffer, string,
  slice = [].slice;

string = require('./string');

module.exports = UnorderedEditorBuffer = (function() {
  function UnorderedEditorBuffer() {
    this._updateEditor = function() {};
    this._buffer = [];
    this._cursorWidth = this._cursorX = this._cursorY = this._cursorRow = this._cursorCol = this._defaultCharWidth = this._doubleCharWidth = this._lineHeight = 0;
  }

  UnorderedEditorBuffer.prototype.setOptions = function(options) {
    if (Number(options.defaultCharWidth) > 0) {
      this._defaultCharWidth = options.defaultCharWidth;
    }
    if (Number(options.doubleCharWidth) > 0) {
      this._doubleCharWidth = options.doubleCharWidth;
    }
    if (Number(options.lineHeight) > 0) {
      this._lineHeight = options.lineHeight;
    }
    if (options.updateEditor) {
      return this._updateEditor = options.updateEditor;
    }
  };

  UnorderedEditorBuffer.prototype.initBuffer = function(text) {
    this._buffer = string.textToRows(text);
    return this._ensureBufferEndsWithAEmptyString();
  };

  UnorderedEditorBuffer.prototype.updateEditor = function() {
    return this._updateEditor();
  };

  UnorderedEditorBuffer.prototype.getRows = function() {
    return this._buffer;
  };

  UnorderedEditorBuffer.prototype.getRow = function(row) {
    return this._buffer[row];
  };

  UnorderedEditorBuffer.prototype.getRowCount = function(row) {
    return this._buffer.length;
  };

  UnorderedEditorBuffer.prototype.getRowLength = function(row) {
    var ref;
    return (ref = this._buffer[row]) != null ? ref.length : void 0;
  };

  UnorderedEditorBuffer.prototype.getCursor = function() {
    return {
      cursorRow: this._cursorRow,
      cursorCol: this._cursorCol,
      cursorX: this._cursorX,
      cursorY: this._cursorY,
      cursorWidth: this._cursorWidth
    };
  };

  UnorderedEditorBuffer.prototype._ensureRowAndCol = function(cursorRow, cursorCol) {
    var row;
    if (cursorRow >= this._buffer.length) {
      cursorRow = this._buffer.length - 1;
    }
    if (cursorRow < 0) {
      cursorRow = 0;
    }
    row = this._buffer[cursorRow];
    if (row.endsWith('\n')) {
      if (cursorCol >= this._buffer[cursorRow].length) {
        cursorCol = this._buffer[cursorRow].length - 1;
      }
    } else {
      if (cursorCol > this._buffer[cursorRow].length) {
        cursorCol = this._buffer[cursorRow].length - 1;
      }
    }
    if (cursorCol < 0) {
      cursorCol = 0;
    }
    return [cursorRow, cursorCol];
  };

  UnorderedEditorBuffer.prototype._validateRowAndCol = function(cursorRow, cursorCol) {
    var row;
    if (cursorRow < 0 || cursorRow >= this._buffer.length) {
      throw new Error(cursorRow + " row is out of range " + this._buffer.length);
    }
    row = this._buffer[cursorRow];
    if (cursorCol < 0) {
      throw new Error(cursorCol + " col is out of range " + this._buffer[cursorRow].length);
    }
    if (row.endsWith('\n') && cursorCol >= row.length) {
      throw new Error(cursorCol + " col is out of range " + this._buffer[cursorRow].length + ", that is endswith \n");
    } else if (cursorCol > row.length) {
      throw new Error(cursorCol + " col is out of range " + this._buffer[cursorRow].length);
    }
  };

  UnorderedEditorBuffer.prototype._validateRowAndInvertedEndColWithAnyChar = function(cursorRow, endCol) {
    var row;
    if (cursorRow < 0 || cursorRow >= this._buffer.length) {
      throw new Error(cursorRow + " row is out of range " + this._buffer.length);
    }
    row = this._buffer[cursorRow];
    if (endCol > 0) {
      throw new Error("inverted end column is must be less than or equal to 0, but it's " + endCol);
    } else if (-endCol > row.length) {
      throw new Error("inverted end cololumn (" + endCol + ") is out of range " + this._buffer[cursorRow].length);
    }
  };

  UnorderedEditorBuffer.prototype._updateCursorWidth = function() {
    var ref;
    return this._cursorWidth = ((ref = this._buffer[this._cursorRow][this._cursorCol]) != null ? ref.charCodeAt() : void 0) > 255 ? this._doubleCharWidth : this._defaultCharWidth;
  };

  UnorderedEditorBuffer.prototype.setCursorPosition = function(cursorRow, cursorCol) {
    var char, cursorX, i, index, len, row;
    this._validateRowAndCol(cursorRow, cursorCol);
    row = this._buffer[cursorRow];
    cursorX = 0;
    for (index = i = 0, len = row.length; i < len; index = ++i) {
      char = row[index];
      if (index === cursorCol) {
        break;
      }
      cursorX += char.charCodeAt() > 255 ? this._doubleCharWidth : this._defaultCharWidth;
    }
    this._cursorX = cursorX;
    this._cursorY = this._lineHeight * cursorRow;
    this._cursorRow = cursorRow;
    this._cursorCol = cursorCol;
    this._updateCursorWidth();
    return this.updateEditor();
  };

  UnorderedEditorBuffer.prototype.moveCursorLeft = function() {
    var previousRowLength, row;
    if (this._cursorCol > 0) {
      return this.setCursorPosition(this._cursorRow, this._cursorCol - 1);
    } else if (this._cursorRow > 0) {
      row = this._buffer[this._cursorRow];
      previousRowLength = this._buffer[this._cursorRow - 1].length;
      return this.setCursorPosition(this._cursorRow - 1, previousRowLength - 1);
    }
  };

  UnorderedEditorBuffer.prototype.moveCursorUp = function() {
    var previousRowLength;
    if (!(this._cursorRow > 0)) {
      return;
    }
    previousRowLength = this._buffer[this._cursorRow - 1].length;
    if (previousRowLength > this._cursorCol) {
      return this.setCursorPosition(this._cursorRow - 1, this._cursorCol);
    } else {
      return this.setCursorPosition(this._cursorRow - 1, previousRowLength - 1);
    }
  };

  UnorderedEditorBuffer.prototype.moveCursorRight = function() {
    var row;
    row = this._buffer[this._cursorRow];
    if (row.endsWith('\n')) {
      if (this._cursorCol < row.length - 1) {
        return this.setCursorPosition(this._cursorRow, this._cursorCol + 1);
      } else if (this._buffer.length > this._cursorRow + 1) {
        return this.setCursorPosition(this._cursorRow + 1, 0);
      }
    } else {
      if (this._cursorCol < row.length) {
        return this.setCursorPosition(this._cursorRow, this._cursorCol + 1);
      } else if (this._buffer.length > this._cursorRow + 1) {
        return this.setCursorPosition(this._cursorRow + 1, 0);
      }
    }
  };

  UnorderedEditorBuffer.prototype.moveCursorDown = function() {
    var nextRow;
    if (!(this._cursorRow < this._buffer.length - 1)) {
      return;
    }
    nextRow = this._buffer[this._cursorRow + 1];
    if (nextRow.endsWith('\n')) {
      if (nextRow.length > this._cursorCol) {
        return this.setCursorPosition(this._cursorRow + 1, this._cursorCol);
      } else {
        return this.setCursorPosition(this._cursorRow + 1, nextRow.length - 1);
      }
    } else {
      if (nextRow.length >= this._cursorCol) {
        return this.setCursorPosition(this._cursorRow + 1, this._cursorCol);
      } else {
        return this.setCursorPosition(this._cursorRow + 1, nextRow.length);
      }
    }
  };

  UnorderedEditorBuffer.prototype.setCursorCoords = function(x, y) {
    var _, char, cursorCol, cursorRow, cursorWidth, cursorX, i, index, len, ref, ref1, row;
    cursorRow = Math.floor(y / this._lineHeight);
    ref = this._ensureRowAndCol(cursorRow, 0), cursorRow = ref[0], _ = ref[1];
    row = this._buffer[cursorRow];
    if (row.endsWith('\n')) {
      row = row.slice(0, -1);
    }
    cursorWidth = cursorX = 0;
    cursorCol = -1;
    for (index = i = 0, len = row.length; i < len; index = ++i) {
      char = row[index];
      cursorWidth = char.charCodeAt() > 255 ? this._doubleCharWidth : this._defaultCharWidth;
      if (x <= cursorWidth / 2 + cursorX) {
        cursorCol = index;
        break;
      }
      cursorX += cursorWidth;
    }
    if (cursorCol === -1) {
      cursorCol = row.length;
    }
    ref1 = this._ensureRowAndCol(cursorRow, cursorCol), _ = ref1[0], cursorCol = ref1[1];
    return this.setCursorPosition(cursorRow, cursorCol);
  };

  UnorderedEditorBuffer.prototype._ensureBufferEndsWithAEmptyString = function() {
    if (this._buffer[this._buffer.length - 1].endsWith('\n')) {
      return this._buffer = this._buffer.concat('');
    }
  };

  UnorderedEditorBuffer.prototype._clearRangeText = function(startRow, startCol, endRow, endCol) {
    var combinedRow;
    this._validateRowAndCol(startRow, startCol);
    this._validateRowAndCol(endRow, endCol);
    combinedRow = this._buffer[startRow].slice(0, startCol).concat(this._buffer[endRow].slice(endCol) || '');
    this._buffer = slice.call(this._buffer.slice(0, startRow)).concat([combinedRow], slice.call(this._buffer.slice(endRow + 1)));
    return this.setCursorPosition(startRow, startCol);
  };

  UnorderedEditorBuffer.prototype._clearRangeTextInvertedEndCol = function(startRow, startCol, endRow, endCol) {
    var combinedRow;
    this._validateRowAndCol(startRow, startCol);
    this._validateRowAndInvertedEndColWithAnyChar(endRow, endCol);
    combinedRow = this._buffer[startRow].slice(0, startCol).concat(endCol !== 0 ? this._buffer[endRow].slice(endCol) : '');
    this._buffer = slice.call(this._buffer.slice(0, startRow)).concat([combinedRow], slice.call(this._buffer.slice(endRow + 1)));
    return this.setCursorPosition(startRow, startCol);
  };

  UnorderedEditorBuffer.prototype._insertTextAt = function(text, cursorRow, cursorCol) {
    var newRowText, newRows, row;
    this._validateRowAndCol(cursorRow, cursorCol);
    row = this._buffer[cursorRow];
    newRowText = row.slice(0, cursorCol).concat(text).concat(row.slice(cursorCol));
    newRows = string.textToRows(newRowText);
    this._buffer = slice.call(this._buffer.slice(0, cursorRow)).concat(slice.call(newRows), slice.call(this._buffer.slice(cursorRow + 1)));
    this._ensureBufferEndsWithAEmptyString();
    cursorRow += newRows.length - 1;
    if (cursorCol === row.length && text.endsWith('\n')) {
      cursorRow += 1;
    }
    if (text.endsWith('\n')) {
      cursorCol = 0;
    } else {
      cursorCol = newRows.slice(-1)[0].length - row.slice(cursorCol).length;
    }
    return this.setCursorPosition(cursorRow, cursorCol);
  };

  UnorderedEditorBuffer.prototype.setRangeText = function(text, startRow, startCol, endRow, endCol) {
    this._clearRangeText(startRow, startCol, endRow, endCol);
    return this._insertTextAt(text, startRow, startCol);
  };

  UnorderedEditorBuffer.prototype.setRangeTextInvertedEndCol = function(text, startRow, startCol, endRow, endCol) {
    this._clearRangeTextInvertedEndCol(startRow, startCol, endRow, endCol);
    return this._insertTextAt(text, startRow, startCol);
  };

  UnorderedEditorBuffer.prototype.setRangeTextInLine = function(text, startCol, endCol) {
    return this.setRangeText(text, this._cursorRow, startCol, this._cursorRow, endCol);
  };

  UnorderedEditorBuffer.prototype.setRangeTextInLineInvertedEndCol = function(text, startCol, endCol) {
    return this.setRangeTextInvertedEndCol(text, this._cursorRow, startCol, this._cursorRow, endCol);
  };

  UnorderedEditorBuffer.prototype.insertText = function(text) {
    return this.setRangeTextInLine(text, this._cursorCol, this._cursorCol);
  };

  UnorderedEditorBuffer.prototype.deletePreviousChar = function() {
    var previousRowLength, row;
    if (this._cursorCol > 0) {
      return this._clearRangeText(this._cursorRow, this._cursorCol - 1, this._cursorRow, this._cursorCol);
    } else if (this._cursorRow > 0) {
      row = this._buffer[this._cursorRow];
      previousRowLength = this._buffer[this._cursorRow - 1].length;
      return this._clearRangeText(this._cursorRow - 1, previousRowLength - 1, this._cursorRow, 0);
    }
  };

  return UnorderedEditorBuffer;

})();