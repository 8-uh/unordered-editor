module.exports =
  class TextBuffer
    constructor: ->
      @defaultCharWidth = 0
      @defaultCharHeight = 0
      @doubleCharWidth = 0
      @doubleCharHeight = 0

    setup: (@defaultCharWidth, @defaultCharHeight, @doubleCharWidth, @doubleCharHeight) ->
