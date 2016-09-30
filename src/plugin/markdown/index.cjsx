React = {PropTypes, Component, createElement} = require 'react'
marked = require 'marked'
style = require './index.css'

module.exports = class Markdown extends Component
  @propTypes:
    editor: PropTypes.object.isRequired

  constructor: (props) ->
    super props
    @_updateListener = null
    @state =
      active: false

  componentDidMount: ->
    @props.editor.getCurrentEditor()?.addUpdateListener () =>
      rows = @props.editor.getCurrentEditor().getBuffer().getRows()
      text = rows.join ''
      @_updateListener? text

  setUpdateListener: (listener) ->
    @_updateListener = listener
    if listener
      rows = @props.editor.getCurrentEditor().getBuffer().getRows()
      text = rows.join ''
      @_updateListener? text

  onToggle: =>
    if @state.active
      @setState {active: false}
      @props.editor.getPaneComponent().setRight null
    else
      @setState {active: true}
      @props.editor.getPaneComponent().setRight MarkdownPreviewer, {host: this}

  render: ->
    <u-markdown data-active={@state.active} onClick={@onToggle} class={style.root}>M</u-markdown>

class MarkdownPreviewer extends Component
  constructor: (props) ->
    super props
    @state =
      text: ''

  componentDidMount: ->
    @props.host.setUpdateListener @updateText

  componentWillUnmount: ->
    @props.host.setUpdateListener null

  updateText: (text) =>
    @setState {text}

  render: ->
    <u-markdown-previewer>
      <u-previewer-content dangerouslySetInnerHTML={{__html: marked(@state.text)}} />
    </u-markdown-previewer>
