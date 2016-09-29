React = {PropTypes, Component, createElement} = require 'react'
Editor = require './editor-wrapper'
Header = require './header'
Footer = require './footer'
LeftSider = require './left-sider'
RightSider = require './right-sider'

FooterCursorPosition = require './utils/footer-cursor-position'
style = require './index.css'

module.exports = class UnorderedEditor extends Component
  constructor: (props) ->
    super props
    @_leftSiderComponent = null
    @_headerComponent = null
    @_rightSiderComponent = null
    @_footerComponent = null

  componentDidMount: ->
    {leftSider, header, rightSider, footer} = @refs
    @_leftSiderComponent = leftSider
    @_headerComponent = header
    @_rightSiderComponent = rightSider
    @_footerComponent = footer

    @_footerComponent.registerLeftItem createElement FooterCursorPosition, {editor: this}

  getFooterComponent: -> @_footerComponent

  getCurrentEditor: -> @refs.editor

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
          <Editor ref='editor' />
        </u-content>
        <u-right-sider>
          <RightSider ref='rightSider' />
        </u-right-sider>
      </u-body>
      <u-footer>
        <Footer ref='footer' />
      </u-footer>
    </u-editor>
