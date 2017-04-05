'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _editor = require('./editor');

var _editor2 = _interopRequireDefault(_editor);

var _textTransformer = require('./utils/text-transformer');

var _textTransformer2 = _interopRequireDefault(_textTransformer);

var _unorderedEditorBuffer = require('unordered-editor-buffer');

var _unorderedEditorBuffer2 = _interopRequireDefault(_unorderedEditorBuffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UnorderedEditor = function (_Component) {
  (0, _inherits3.default)(UnorderedEditor, _Component);

  function UnorderedEditor(props) {
    (0, _classCallCheck3.default)(this, UnorderedEditor);

    var _this = (0, _possibleConstructorReturn3.default)(this, (UnorderedEditor.__proto__ || (0, _getPrototypeOf2.default)(UnorderedEditor)).call(this, props));

    _initialiseProps.call(_this);

    _this._buffer = new _unorderedEditorBuffer2.default();
    _this._buffer.initBuffer(_this.props.content || '');
    _this._inputEnabled = true;
    _this._plugins = [];
    _this._inputChangeListeners = [];
    _this._inputKeyDownListeners = [];
    _this._inputKeyUpListeners = [];
    _this._editorMouseDownListeners = [];
    _this._editorMouseUpListeners = [];
    _this._hiddenInputStyle = {};
    _this._inputPositionCheckpoint = {
      startCol: -1,
      endCol: -1
    };
    _this.state = {
      hiddenInputValue: '',
      updateTime: 0
    };
    return _this;
  }

  (0, _createClass3.default)(UnorderedEditor, [{
    key: 'render',
    value: function render() {
      var bufferRows = _textTransformer2.default.transform(this._buffer.getRows());

      var _buffer$getCursor = this._buffer.getCursor(),
          cursorX = _buffer$getCursor.cursorX,
          cursorY = _buffer$getCursor.cursorY,
          cursorRow = _buffer$getCursor.cursorRow,
          cursorCol = _buffer$getCursor.cursorCol,
          cursorWidth = _buffer$getCursor.cursorWidth;

      var hiddenInputValue = this.state.hiddenInputValue;

      var editorProps = {
        bufferRows: bufferRows, cursorRow: cursorRow, cursorCol: cursorCol, cursorX: cursorX, cursorY: cursorY, cursorWidth: cursorWidth, cursorHeight: 21,
        hiddenInputValue: hiddenInputValue, setEditorOptions: this.setEditorOptions, onEditorMouseDown: this.onEditorMouseDown,
        onHiddenInputChange: this.onHiddenInputChange, onHiddenInputKeyDown: this.onHiddenInputKeyDown,
        hiddenInputStyle: this._hiddenInputStyle
      };
      return _react2.default.createElement(_editor2.default, editorProps);
    }
  }]);
  return UnorderedEditor;
}(_react.Component);

UnorderedEditor.propTypes = {
  content: _react.PropTypes.string
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this._clearInputPositionCheckpoint = function () {
    _this2._inputPositionCheckpoint = {
      startCol: -1,
      endCol: -1
    };
  };

  this._setInputPositionCheckpoint = function (startCol, endCol) {
    _this2._inputPositionCheckpoint = { startCol: startCol, endCol: endCol };
  };

  this._isSetInputPositionCheckpoint = function () {
    return _this2._inputPositionCheckpoint.startCol !== -1 && _this2._inputPositionCheckpoint.endCol !== -1;
  };

  this.componentWillReceiveProps = function (props) {
    _this2._buffer.initBuffer(props.content || '');
    _this2._clearInputPositionCheckpoint();
    _this2._buffer.setCursorPosition(0, 0);
  };

  this.componentDidMount = function () {};

  this.getBuffer = function () {
    return _this2._buffer;
  };

  this.setInputEnabled = function (enabled) {
    _this2._inputEnabled = enabled;
  };

  this.isInputEnabled = function () {
    return _this2._inputEnabled;
  };

  this.setInputValue = function (text) {
    return _this2.setState({ hiddenInputValue: text });
  };

  this.setInputStyle = function (style) {
    return _this2._hiddenInputStyle = style;
  };

  this.resetInput = function () {
    return _this2._clearInputPositionCheckpoint();
  };

  this.addInputChangeListener = function (listener) {
    return _this2._inputChangeListeners = _this2._inputChangeListeners.concat(listener);
  };

  this.addInputKeyDownListener = function (listener) {
    return _this2._inputKeyDownListeners = _this2._inputKeyDownListeners.concat(listener);
  };

  this.addInputKeyUpListener = function (listener) {
    return _this2._inputKeyUpListeners = _this2._inputKeyUpListeners.concat(listener);
  };

  this.addEditorMouseDownListener = function (listener) {
    return _this2._editorMouseDownListeners = _this2._editorMouseDownListeners.concat(listener);
  };

  this.addEditorMouseUpListener = function (listener) {
    return _this2._editorMouseUpListeners = _this2._editorMouseUpListeners.concat(listener);
  };

  this.setEditorOptions = function (options) {
    _this2._buffer.setOptions(options);
    _this2._buffer.setOptions({
      updateEditor: function updateEditor() {
        return _this2.setState({ updateTime: new Date().getTime() });
      }
    });
  };

  this.onEditorMouseDown = function (e, editorRect) {
    _this2._clearInputPositionCheckpoint();
    _this2.setState({ hiddenInputValue: '' });
    var x = e.clientX - editorRect.left;
    var y = e.clientY - editorRect.top;
    _this2._buffer.setCursorCoords(x, y);
    _this2._editorMouseDownListeners.map(function (callback) {
      return callback();
    });
  };

  this.onHiddenInputChange = function (value) {
    _this2.setState({ hiddenInputValue: value });
    _this2._inputChangeListeners.map(function (callback) {
      return callback(value);
    });
    if (!_this2._inputEnabled) {
      return;
    }
    if (!_this2._isSetInputPositionCheckpoint()) {
      var cursor = _this2._buffer.getCursor();
      var lineLength = _this2._buffer.getRows()[cursor.cursorRow].length;
      _this2._setInputPositionCheckpoint(cursor.cursorCol, lineLength - cursor.cursorCol);
    }
    _this2._buffer.setRangeTextInLineInvertedEndCol(value, _this2._inputPositionCheckpoint.startCol, -_this2._inputPositionCheckpoint.endCol);
  };

  this.onHiddenInputKeyDown = function (e) {
    _this2._inputKeyDownListeners.map(function (callback) {
      return callback(e);
    });
    if (!_this2._inputEnabled) return;
    if (e.keyCode === 13) {
      // enter
      _this2._clearInputPositionCheckpoint();
      _this2.setState({ hiddenInputValue: '' });
      _this2._buffer.insertText('\n');
    } else if (e.keyCode === 8) {
      // backspace
      _this2._clearInputPositionCheckpoint();
      _this2.setState({ hiddenInputValue: '' });
      _this2._buffer.deletePreviousChar();
    } else if (e.keyCode === 9) {
      // tab
      e.preventDefault();
      _this2._clearInputPositionCheckpoint();
      _this2.setState({ hiddenInputValue: '' });
      _this2._buffer.insertText('  ');
    } else if (e.keyCode === 37) {
      /// left
      e.preventDefault();
      _this2._clearInputPositionCheckpoint();
      _this2.setState({ hiddenInputValue: '' });
      _this2._buffer.moveCursorLeft();
    } else if (e.keyCode === 38) {
      // up
      e.preventDefault();
      _this2._clearInputPositionCheckpoint();
      _this2.setState({ hiddenInputValue: '' });
      _this2._buffer.moveCursorUp();
    } else if (e.keyCode === 39) {
      // right
      e.preventDefault();
      _this2._clearInputPositionCheckpoint();
      _this2.setState({ hiddenInputValue: '' });
      _this2._buffer.moveCursorRight();
    } else if (e.keyCode === 40) {
      // down
      e.preventDefault();
      _this2._clearInputPositionCheckpoint();
      _this2.setState({ hiddenInputValue: '' });
      _this2._buffer.moveCursorDown();
    }
  };
};

exports.default = UnorderedEditor;