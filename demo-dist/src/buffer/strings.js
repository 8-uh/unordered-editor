'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  textToRows: function textToRows(text) {
    if (!text) {
      return [];
    }
    var texts = text.split('\n').map(function (i) {
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