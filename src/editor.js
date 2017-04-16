import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class TextEditor extends Component {
  static propTypes = {
    cursorX: PropTypes.number.isRequired,
    cursorY: PropTypes.number.isRequired,
    cursorRow: PropTypes.number.isRequired,
    cursorCol: PropTypes.number.isRequired,
    cursorWidth: PropTypes.number.isRequired,
    cursorHeight: PropTypes.number.isRequired,
    bufferRows: PropTypes.array.isRequired,
    setEditorOptions: PropTypes.func.isRequired,
    onEditorMouseDown: PropTypes.func.isRequired,
    hiddenInputValue: PropTypes.string.isRequired,
    hiddenInputStyle: PropTypes.object.isRequired,
    onHiddenInputChange: PropTypes.func.isRequired,
    onHiddenInputKeyDown: PropTypes.func.isRequired
  }

  componentDidMount () {
    const {dummyDefaultChar, dummyDoubleChar} = this.refs
    const defaultCharWidth = dummyDefaultChar.getBoundingClientRect().width
    const doubleCharWidth = dummyDoubleChar.getBoundingClientRect().width
    const lineHeight = 21
    this.props.setEditorOptions({defaultCharWidth, doubleCharWidth, lineHeight})
  }

  componentWillReceiveProps (props) {
    const {cursorX, cursorY, cursorHeight, cursorWidth} = props
    const {scrollTop, offsetHeight} = this.refs.editor
    if (cursorY > offsetHeight + scrollTop - cursorHeight * 4) {
      this.refs.editor.scrollTop += cursorHeight
    } else if (cursorY < scrollTop + cursorHeight * 4) {
      this.refs.editor.scrollTop -= cursorHeight
    }
    const {scrollLeft, offsetWidth} = this.refs.editorWrapper
    if (cursorX > scrollLeft + offsetWidth - cursorWidth * 4) {
      this.refs.editorWrapper.scrollLeft += cursorWidth
    } else if (cursorX < scrollLeft + cursorWidth * 4) {
      this.refs.editorWrapper.scrollLeft -= cursorWidth
    }
    if (cursorX < this.refs.editorWrapper.scrollLeft) {
      this.refs.editorWrapper.scrollLeft = 0
    }
  }

  onEditorMouseDown = (e) => {
    e.stopPropagation()
    this.props.onEditorMouseDown(e, this.refs.editorRoot.getBoundingClientRect())
  }

  onEditorContextMenu = (e) => e.preventDefault()

  onEditorMouseUp = (e) => {
    e.stopPropagation()
    this.refs.hiddenInput.focus()
  }

  render () {
    let {bufferRows, cursorRow, cursorX, cursorY, cursorWidth, cursorHeight, hiddenInputValue,
      hiddenInputStyle, onHiddenInputChange, onHiddenInputKeyDown} = this.props
    hiddenInputStyle = Object.assign({
      left: cursorX,
      top: cursorY,
      width: cursorWidth,
      height: cursorHeight}, hiddenInputStyle)
    return (
      <div className='unordered-editor' ref='editor'>
        <div className='line-numbers'>
          {bufferRows.map((i, index) => <div key={index}>{index + 1}</div>)}
        </div>
        <div className='editor-wrapper' ref='editorWrapper'
          onMouseDown={this.onEditorMouseDown} onMouseUp={this.onEditorMouseUp}
          onContextMenu={this.onEditorContextMenu}>
          <div className='editor-area' ref='editorRoot'
            onMouseUp={this.onEditorMouseUp} onMouseDown={this.onEditorMouseDown}>
            <div className='dummy'>
              <span ref='dummyDefaultChar'>x</span>
              <span ref='dummyDoubleChar'>我</span>
            </div>
            <input className='hidden-input' ref='hiddenInput' style={hiddenInputStyle}
              value={hiddenInputValue}
              onChange={e => onHiddenInputChange(e.target.value)}
              onKeyDown={e => onHiddenInputKeyDown(e)} />
            {bufferRows.map((i, index) =>
              <div className='line' data-active={index === cursorRow} key={index}>{i}</div>)}
          </div>
        </div>
      </div>
    )
  }
}
