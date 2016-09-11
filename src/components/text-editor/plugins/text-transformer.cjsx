React = require 'react'

module.exports =
  class TextTransformer
    @transform: (rows) ->
      rows.map (i, index) ->
        if i.endsWith '\n'
          <span key={index}>{i[...-1].replace /\s/g, '·'}<u-enter>¬</u-enter></span>
        else
          <span key={index}>{i.replace /\s/g, '·'}</span>
