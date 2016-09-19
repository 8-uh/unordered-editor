React = require 'react'

module.exports =
  class TextTransformer
    @transform: (rows) ->
      rows.map (i, index) ->
        if i.endsWith '\n'
          <span key={index}>{i[...-1].split(' ').map((i, index, arr) ->
            [<span key={index * 2}>{i}</span>,index isnt arr.length - 1 and <u-space key={index * 2 + 1}>·</u-space>])}<u-enter>¬</u-enter></span>
        else
          <span key={index}>{i.split(' ').map((i, index, arr) ->
            [<span key={index * 2}>{i}</span>,index isnt arr.length - 1 and <u-space key={index * 2 + 1}>·</u-space>])}</span>
