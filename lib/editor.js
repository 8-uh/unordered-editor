'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextEditor = function (_Component) {
  (0, _inherits3.default)(TextEditor, _Component);

  function TextEditor() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, TextEditor);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = TextEditor.__proto__ || (0, _getPrototypeOf2.default)(TextEditor)).call.apply(_ref, [this].concat(args))), _this), _this.onEditorMouseDown = function (e) {
      e.stopPropagation();
      _this.props.onEditorMouseDown(e, _this.refs.editorRoot.getBoundingClientRect());
    }, _this.onEditorContextMenu = function (e) {
      return e.preventDefault();
    }, _this.onEditorMouseUp = function (e) {
      e.stopPropagation();
      _this.refs.hiddenInput.focus();
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(TextEditor, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _refs = this.refs,
          dummyDefaultChar = _refs.dummyDefaultChar,
          dummyDoubleChar = _refs.dummyDoubleChar;

      var defaultCharWidth = dummyDefaultChar.getBoundingClientRect().width;
      var doubleCharWidth = dummyDoubleChar.getBoundingClientRect().width;
      var lineHeight = 21;
      this.props.setEditorOptions({ defaultCharWidth: defaultCharWidth, doubleCharWidth: doubleCharWidth, lineHeight: lineHeight });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      var cursorX = props.cursorX,
          cursorY = props.cursorY,
          cursorHeight = props.cursorHeight,
          cursorWidth = props.cursorWidth;
      var _refs$editor = this.refs.editor,
          scrollTop = _refs$editor.scrollTop,
          offsetHeight = _refs$editor.offsetHeight;

      if (cursorY > offsetHeight + scrollTop - cursorHeight * 4) {
        this.refs.editor.scrollTop += cursorHeight;
      } else if (cursorY < scrollTop + cursorHeight * 4) {
        this.refs.editor.scrollTop -= cursorHeight;
      }
      var _refs$editorWrapper = this.refs.editorWrapper,
          scrollLeft = _refs$editorWrapper.scrollLeft,
          offsetWidth = _refs$editorWrapper.offsetWidth;

      if (cursorX > scrollLeft + offsetWidth - cursorWidth * 4) {
        this.refs.editorWrapper.scrollLeft += cursorWidth;
      } else if (cursorX < scrollLeft + cursorWidth * 4) {
        this.refs.editorWrapper.scrollLeft -= cursorWidth;
      }
      if (cursorX < this.refs.editorWrapper.scrollLeft) {
        this.refs.editorWrapper.scrollLeft = 0;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          bufferRows = _props.bufferRows,
          cursorRow = _props.cursorRow,
          cursorX = _props.cursorX,
          cursorY = _props.cursorY,
          cursorWidth = _props.cursorWidth,
          cursorHeight = _props.cursorHeight,
          hiddenInputValue = _props.hiddenInputValue,
          hiddenInputStyle = _props.hiddenInputStyle,
          onHiddenInputChange = _props.onHiddenInputChange,
          onHiddenInputKeyDown = _props.onHiddenInputKeyDown;

      hiddenInputStyle = (0, _assign2.default)({
        left: cursorX,
        top: cursorY,
        width: cursorWidth,
        height: cursorHeight }, hiddenInputStyle);
      return _react2.default.createElement(
        'div',
        { className: 'unordered-editor', ref: 'editor' },
        _react2.default.createElement(
          'div',
          { className: 'line-numbers' },
          bufferRows.map(function (i, index) {
            return _react2.default.createElement(
              'div',
              { key: index },
              index + 1
            );
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'editor-wrapper', ref: 'editorWrapper',
            onMouseDown: this.onEditorMouseDown, onMouseUp: this.onEditorMouseUp,
            onContextMenu: this.onEditorContextMenu },
          _react2.default.createElement(
            'div',
            { className: 'editor-area', ref: 'editorRoot',
              onMouseUp: this.onEditorMouseUp, onMouseDown: this.onEditorMouseDown },
            _react2.default.createElement(
              'div',
              { className: 'dummy' },
              _react2.default.createElement(
                'span',
                { ref: 'dummyDefaultChar' },
                'x'
              ),
              _react2.default.createElement(
                'span',
                { ref: 'dummyDoubleChar' },
                '\u6211'
              )
            ),
            _react2.default.createElement('input', { className: 'hidden-input', ref: 'hiddenInput', style: hiddenInputStyle,
              value: hiddenInputValue,
              onChange: function onChange(e) {
                return onHiddenInputChange(e.target.value);
              },
              onKeyDown: function onKeyDown(e) {
                return onHiddenInputKeyDown(e);
              } }),
            bufferRows.map(function (i, index) {
              return _react2.default.createElement(
                'div',
                { className: 'line', 'data-active': index === cursorRow, key: index },
                i
              );
            })
          )
        )
      );
    }
  }]);
  return TextEditor;
}(_react.Component);

TextEditor.propTypes = {
  cursorX: _react.PropTypes.number.isRequired,
  cursorY: _react.PropTypes.number.isRequired,
  cursorRow: _react.PropTypes.number.isRequired,
  cursorCol: _react.PropTypes.number.isRequired,
  cursorWidth: _react.PropTypes.number.isRequired,
  cursorHeight: _react.PropTypes.number.isRequired,
  bufferRows: _react.PropTypes.array.isRequired,
  setEditorOptions: _react.PropTypes.func.isRequired,
  onEditorMouseDown: _react.PropTypes.func.isRequired,
  hiddenInputValue: _react.PropTypes.string.isRequired,
  hiddenInputStyle: _react.PropTypes.object.isRequired,
  onHiddenInputChange: _react.PropTypes.func.isRequired,
  onHiddenInputKeyDown: _react.PropTypes.func.isRequired
};
exports.default = TextEditor;