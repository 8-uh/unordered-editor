// Generated by CoffeeScript 1.12.5
module.exports = {
  textToRows: function(text) {
    var texts;
    texts = text.split('\n').map(function(i) {
      return i.concat('\n');
    });
    if (text.endsWith('\n')) {
      texts = texts.slice(0, -1);
    } else if (texts.length > 0) {
      texts[texts.length - 1] = texts[texts.length - 1].slice(0, -1);
    }
    return texts;
  }
};
