React = {PropTypes, Component} = require 'react'
style = require './footer.css'

module.exports = class Footer extends Component
  constructor: (props) ->
    super props
    @state =
      leftItems: []
      rightItems: []

  registerLeftItem: (component) ->
    @setState {leftItems: [@state.leftItems..., component]}

  render: ->
    {leftItems, rightItems} = @state
    <u-footer class={style.root}>
      <u-left>
        {leftItems.map (i, index) ->
          <u-footer-item key={index}>{i}</u-footer-item>}
      </u-left>
      <u-right>
        {rightItems.map (i, index) ->
          <u-footer-item key={index}>{i}</u-footer-item>}
      </u-right>
    </u-footer>
