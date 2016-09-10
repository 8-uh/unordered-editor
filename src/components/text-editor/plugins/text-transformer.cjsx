React = require 'react'

module.exports =
  class TextTransformer
    @transform: (row) ->
      if row.endsWith '\n'
        <span>{row[...-1].replace /\s/g, '·'}<u-enter>¬</u-enter></span>
      else
        <span>{row.replace /\s/g, '·'}</span>
