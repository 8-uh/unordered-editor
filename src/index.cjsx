React = {PropTypes, Component, createElement} = require 'react'
Editor = require './editor'
Pane = require './pane'
Header = require './header'
Footer = require './footer'
LeftSider = require './left-sider'
RightSider = require './right-sider'

FooterCursorPosition = require './plugin/footer-cursor-position'
Markdown = require './plugin/markdown'
style = require './index.css'

module.exports = class UnorderedEditor extends Component
  constructor: (props) ->
    super props
    @_leftSiderComponent = null
    @_headerComponent = null
    @_rightSiderComponent = null
    @_footerComponent = null
    @_paneComponent = null

  componentDidMount: ->
    {leftSider, header, rightSider, footer, pane} = @refs
    @_leftSiderComponent = leftSider
    @_headerComponent = header
    @_rightSiderComponent = rightSider
    @_footerComponent = footer
    @_paneComponent = pane

    @_paneComponent.setBody Editor

    @_footerComponent.registerLeftItems [createElement(FooterCursorPosition, {editor: this}), createElement(Markdown, {editor: this})]

  getFooterComponent: -> @_footerComponent

  getPaneComponent: -> @_paneComponent

  getCurrentEditor: -> @_paneComponent.getCurrentEditor()

  render: ->
    <u-editor class={style.root}>
      <u-header>
        <Header ref='header' />
      </u-header>
      <u-body>
        <u-left-sider>
          <LeftSider ref='leftSider' />
        </u-left-sider>
        <u-content>
          <Pane ref='pane' />
        </u-content>
        <u-right-sider>
          <RightSider ref='rightSider' />
        </u-right-sider>
      </u-body>
      <u-footer>
        <Footer ref='footer' />
      </u-footer>
    </u-editor>
