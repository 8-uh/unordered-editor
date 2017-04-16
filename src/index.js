import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Editor from './editor'
import EditorBuffer from './buffer'
import TextTransformer from './utils/text-transformer'

export default class UnorderedEditor extends Component {
  static propTypes = {
    content: PropTypes.string
  }

  constructor (props) {
    super(props)
    this._buffer = new EditorBuffer()
    this._buffer.initBuffer(this.props.content || '')
    this._inputEnabled = true
    this._plugins = []
    this._inputChangeListeners = []
    this._inputKeyDownListeners = []
    this._inputKeyUpListeners = []
    this._editorMouseDownListeners = []
    this._editorMouseUpListeners = []
    this._hiddenInputStyle = {}
    this._inputPositionCheckpoint = {
      startCol: -1,
      endCol: -1
    }
    this.state = {
      hiddenInputValue: '',
      updateTime: 0
    }
  }

  _clearInputPositionCheckpoint = () => {
    this._inputPositionCheckpoint = {
      startCol: -1,
      endCol: -1
    }
  }

  _setInputPositionCheckpoint = (startCol, endCol) => {
    this._inputPositionCheckpoint = {startCol, endCol}
  }

  _isSetInputPositionCheckpoint = () => {
    return this._inputPositionCheckpoint.startCol !== -1 &&
      this._inputPositionCheckpoint.endCol !== -1
  }

  componentWillReceiveProps = (props) => {
    this._buffer.initBuffer(props.content || '')
    this._clearInputPositionCheckpoint()
    this._buffer.setCursorPosition(0, 0)
  }

  componentDidMount = () => {

  }

  getBuffer = () => this._buffer

  setInputEnabled = (enabled) => {
    this._inputEnabled = enabled
  }

  isInputEnabled = () => this._inputEnabled

  setInputValue = (text) => this.setState({hiddenInputValue: text})

  setInputStyle = (style) => {
    this._hiddenInputStyle = style
  }

  resetInput = () => this._clearInputPositionCheckpoint()

  addInputChangeListener = (listener) => {
    this._inputChangeListeners = this._inputChangeListeners.concat(listener)
  }

  addInputKeyDownListener = (listener) => {
    this._inputKeyDownListeners = this._inputKeyDownListeners.concat(listener)
  }

  addInputKeyUpListener = (listener) => {
    this._inputKeyUpListeners = this._inputKeyUpListeners.concat(listener)
  }

  addEditorMouseDownListener = (listener) => {
    this._editorMouseDownListeners = this._editorMouseDownListeners.concat(listener)
  }

  addEditorMouseUpListener = (listener) => {
    this._editorMouseUpListeners = this._editorMouseUpListeners.concat(listener)
  }

  setEditorOptions = (options) => {
    this._buffer.setOptions(options)
    this._buffer.setOptions({
      updateEditor: () => this.setState({updateTime: new Date().getTime()})
    })
  }

  onEditorMouseDown = (e, editorRect) => {
    this._clearInputPositionCheckpoint()
    this.setState({hiddenInputValue: ''})
    const x = e.clientX - editorRect.left
    const y = e.clientY - editorRect.top
    this._buffer.setCursorCoords(x, y)
    this._editorMouseDownListeners.map((callback) => callback())
  }

  onHiddenInputChange = (value) => {
    this.setState({hiddenInputValue: value})
    this._inputChangeListeners.map(callback => callback(value))
    if (!this._inputEnabled) {
      return
    }
    if (!this._isSetInputPositionCheckpoint()) {
      const cursor = this._buffer.getCursor()
      const lineLength = this._buffer.getRows()[cursor.cursorRow].length
      this._setInputPositionCheckpoint(cursor.cursorCol, lineLength - cursor.cursorCol)
    }
    this._buffer.setRangeTextInLineInvertedEndCol(value, this._inputPositionCheckpoint.startCol, -this._inputPositionCheckpoint.endCol)
  }

  onHiddenInputKeyDown = e => {
    this._inputKeyDownListeners.map(callback => callback(e))
    if (!this._inputEnabled) return
    if (e.keyCode === 13) { // enter
      this._clearInputPositionCheckpoint()
      this.setState({hiddenInputValue: ''})
      this._buffer.insertText('\n')
    } else if (e.keyCode === 8) { // backspace
      this._clearInputPositionCheckpoint()
      this.setState({hiddenInputValue: ''})
      this._buffer.deletePreviousChar()
    } else if (e.keyCode === 9) { // tab
      e.preventDefault()
      this._clearInputPositionCheckpoint()
      this.setState({hiddenInputValue: ''})
      this._buffer.insertText('  ')
    } else if (e.keyCode === 37) { /// left
      e.preventDefault()
      this._clearInputPositionCheckpoint()
      this.setState({hiddenInputValue: ''})
      this._buffer.moveCursorLeft()
    } else if (e.keyCode === 38) { // up
      e.preventDefault()
      this._clearInputPositionCheckpoint()
      this.setState({hiddenInputValue: ''})
      this._buffer.moveCursorUp()
    } else if (e.keyCode === 39) { // right
      e.preventDefault()
      this._clearInputPositionCheckpoint()
      this.setState({hiddenInputValue: ''})
      this._buffer.moveCursorRight()
    } else if (e.keyCode === 40) { // down
      e.preventDefault()
      this._clearInputPositionCheckpoint()
      this.setState({hiddenInputValue: ''})
      this._buffer.moveCursorDown()
    }
  }

  render () {
    const bufferRows = TextTransformer.transform(this._buffer.getRows())
    const {cursorX, cursorY, cursorRow, cursorCol, cursorWidth} = this._buffer.getCursor()
    const {hiddenInputValue} = this.state
    const editorProps = {
      bufferRows,
      cursorRow,
      cursorCol,
      cursorX,
      cursorY,
      cursorWidth,
      cursorHeight: 21,
      hiddenInputValue,
      setEditorOptions: this.setEditorOptions,
      onEditorMouseDown: this.onEditorMouseDown,
      onHiddenInputChange: this.onHiddenInputChange,
      onHiddenInputKeyDown: this.onHiddenInputKeyDown,
      hiddenInputStyle: this._hiddenInputStyle
    }
    return React.createElement(Editor, editorProps)
  }
}
