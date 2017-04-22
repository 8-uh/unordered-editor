'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _strings = require('./strings');

var _strings2 = _interopRequireDefault(_strings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UnorderedEditorBuffer = function () {
  function UnorderedEditorBuffer() {
    (0, _classCallCheck3.default)(this, UnorderedEditorBuffer);
    this._buffer = [];
  }

  (0, _createClass3.default)(UnorderedEditorBuffer, [{
    key: 'initBuffer',
    value: function initBuffer(text) {
      this._buffer = _strings2.default.textToRows(text);
    }
  }, {
    key: 'getRows',
    value: function getRows() {
      return this._buffer;
    }
  }, {
    key: 'getRow',
    value: function getRow(rowIndex) {
      return this._buffer[rowIndex];
    }
  }, {
    key: 'getRowCount',
    value: function getRowCount() {
      return this._buffer.length;
    }
  }, {
    key: 'getRowLength',
    value: function getRowLength(rowIndex) {
      var row = this._buffer[rowIndex];
      return row ? row.length : undefined;
    }
  }, {
    key: 'setText',
    value: function setText(startRow, startCol, endRow, endCol, text) {
      this._clearText(startRow, startCol, endRow, endCol);
      this._insertTextAt(startRow, startCol, text);
    }
  }, {
    key: '_insertTextAt',
    value: function _insertTextAt(row, col, text) {
      this._ensureRowAndColExist(row, col);
      var line = this._buffer[row];
      var newLine = line.slice(0, col).concat(text).concat(line.slice(col));
      var newLines = _strings2.default.textToRows(newLine);
      this._buffer = this._buffer.slice(0, row).concat(newLines).concat(this._buffer.slice(row + 1));
    }
  }, {
    key: '_clearText',
    value: function _clearText(startRow, startCol, endRow, endCol) {
      this._ensureRowAndColExist(startRow, startCol);
      this._ensureRowAndColExist(endRow, endCol);
      var textBefore = this._buffer[startRow].slice(0, startCol);
      var textAfter = this._buffer[endRow].slice(endCol);
      var combinedLine = textBefore.concat(textAfter);
      this._buffer = this.buffer.slice(0, startRow).concat(combinedLine).concat(this._buffer.slice(endRow + 1));
    }

    // ensure the row and col is exist in buffer.
    // throw error if the position is not exists.
    // 0 <= row < buffer.length.
    // 0 <= col <= line.length.

  }, {
    key: '_ensureRowAndColExist',
    value: function _ensureRowAndColExist(row, col) {
      if (row < 0 || row >= this._buffer.length) {
        throw new Error('row number ' + row + ' is out of range ' + this._buffer.length);
      }
      var line = this._buffer[row];
      if (col < 0 || col > line.length) {
        throw new Error('col number ' + col + ' is out of range ' + line.length);
      }
    }

    // ensure last line of buffer is a empty string
    // when the second line from bottom is ends with '\n'.

  }, {
    key: '_ensureBufferEndsWithEmptyString',
    value: function _ensureBufferEndsWithEmptyString() {
      if (this._buffer.length === 0) {
        this._buffer = [''];
      } else {
        var lastLine = this._buffer[this._buffer.length - 1];
        if (lastLine.endsWith('\n')) {
          this._buffer = this._buffer.concat('');
        }
      }
    }
  }, {
    key: '_buffer',
    get: function get() {
      return this._buffer;
    },
    set: function set(buffer) {
      this._buffer = buffer;
      this._ensureBufferEndsWithEmptyString();
    }
  }]);
  return UnorderedEditorBuffer;
}();

exports.default = UnorderedEditorBuffer;