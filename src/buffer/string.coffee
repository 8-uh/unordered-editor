module.exports =
  textToRows: (text) ->
    texts = text.split('\n').map (i) -> i.concat '\n'
    # if texts.length is 1
      # texts[0] = texts[0][0...-1] if not text.endsWith '\n'
    if text.endsWith '\n'
      texts = texts[0...-1]
    else if texts.length > 0
      texts[texts.length - 1] = texts[texts.length - 1][0...-1]
    texts
