export default {
  textToRows: text => {
    if (!text) {
      return []
    }
    let texts = text.split('\n').map(i => i.concat('\n'))
    if (text.endsWith('\n')) {
      texts = texts.slice(0, -1)
    } else if (texts.length > 0) {
      texts[texts.length - 1] = texts[texts.length - 1].slice(0, -1)
    }
    return texts
  }
}
