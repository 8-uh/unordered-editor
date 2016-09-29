React = {PropTypes, Component} = require 'react'

module.exports = class FooterCursorPosition extends Component
  @propTypes:
    editor: PropTypes.object.isRequired

  constructor: (props) ->
    super props
    @state =
      row: 1
      col: 1

  componentDidMount: ->
    @props.editor.getCurrentEditor().addUpdateListener () =>
      {cursorRow, cursorCol} = @props.editor.getCurrentEditor().getBuffer().getCursor()
      @setState
        row: cursorRow + 1
        col: cursorCol + 1

  render: ->
    {row, col} = @state
    <u-position>
      {row}:{col}
    </u-position>
