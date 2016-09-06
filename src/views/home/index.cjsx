React = {PropTypes, Component} = require 'react'
style = require './index.css'

module.exports =
  class HomeView extends Component
    constructor: (props) ->
      super props
      @state =
        defaultCharWidth: 0
        defaultCharHeight: 0
        doubleCharWidth: 0
        doubleCharHeight: 0
        cursorX: 0
        cursorY: 0
        contents: [
          'abcdefg\n',
          '123123\n'
        ]

    componentDidMount: ->
      {defaultChar, doubleChar} = @refs
      @setState
        defaultCharWidth: defaultChar.getBoundingClientRect().width
        defaultCharHeight: defaultChar.getBoundingClientRect().height
        doubleCharWidth: doubleChar.getBoundingClientRect().width
        doubleCharHeight: doubleChar.getBoundingClientRect().height

    onClick: (e) =>
      @refs.hiddenInput.focus()
      {clientX, clientY} = e
      {defaultCharWidth, defaultCharHeight, contents} = @state
      cursorX = Math.floor((clientX - 20) / defaultCharWidth)
      cursorY = Math.floor((clientY - 20) / defaultCharHeight)
      cursorY = contents.length if cursorY > contents.length
      line = contents[cursorY] || ''
      cursorX = line.length - 1 if cursorX > line.length
      cursorX = 0 if cursorX < 0
      @setState {cursorX, cursorY}

    onChange: (e) =>
      char = e.target.value
      {contents, cursorX, cursorY} = @state
      line = contents[cursorY]
      line = [line[0...cursorX], char, line[cursorX..]].join('')
      contents[cursorY] = line
      @setState {contents, cursorX: cursorX + 1}

    onKeyDown: (e) =>
      switch e.keyCode
        when 8
          {contents, cursorX, cursorY} = @state
          line = contents[cursorY] || ''
          if cursorX is 0
            if cursorY > 0
              combineLine = "#{contents[cursorY - 1][...-1]}#{line}"
              contents = [contents[0...cursorY - 1]..., combineLine, contents[cursorY + 1..]...]
              cursorY = cursorY - 1
              cursorX = combineLine.length
          else
            line = [line[0...cursorX - 1], line[cursorX..]].join('')
            contents[cursorY] = line || undefined
            cursorX = cursorX - 1 if cursorX > 0
          @setState {contents, cursorX, cursorY}

    render: ->
      {contents, cursorX, cursorY, defaultCharWidth, defaultCharHeight} = @state
      hiddenInputStyle =
        width: defaultCharWidth
        left: cursorX * defaultCharWidth
        top: cursorY * defaultCharHeight
      <div className={style.root}>
        <c-line-number>
          {[1..contents.length + 1].map (i) ->
            <span key={i}>{i}</span>}
        </c-line-number>
        <c-dummy>
          <span ref='defaultChar'>x</span>
          <span ref='doubleChar'>我</span>
        </c-dummy>
        <input value='' ref='hiddenInput' onChange={@onChange} onKeyDown={@onKeyDown} style=hiddenInputStyle />
        <c-editor-content onClick={@onClick}>
          {contents.map (i, index) ->
            <div key={index}>{([(i.replace /\n/g, '`')...].map (char) -> if char is ' ' then '_' else char).join('')}</div>}
        </c-editor-content>
      </div>
