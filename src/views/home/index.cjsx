React = {PropTypes, Component} = require 'react'
TextEditor = require '../../components/text-editor'
style = require './index.css'

class HomeView extends Component
  render: ->
    <div className={style.root}>
      <TextEditor />
    </div>

module.exports = HomeView
