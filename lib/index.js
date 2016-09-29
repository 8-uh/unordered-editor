(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("UnorderedEditorBuffer"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "UnorderedEditorBuffer"], factory);
	else if(typeof exports === 'object')
		exports["unordered-editor"] = factory(require("React"), require("UnorderedEditorBuffer"));
	else
		root["unordered-editor"] = factory(root["React"], root["UnorderedEditorBuffer"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_7__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Component, Editor, EditorBuffer, PropTypes, TextTransformer, UnorderedEditor, createElement, ref,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	ref = __webpack_require__(1), PropTypes = ref.PropTypes, Component = ref.Component, createElement = ref.createElement;

	Editor = __webpack_require__(2);

	EditorBuffer = __webpack_require__(7);

	TextTransformer = __webpack_require__(8);

	module.exports = UnorderedEditor = (function(superClass) {
	  extend(UnorderedEditor, superClass);

	  UnorderedEditor.propTypes = {
	    content: PropTypes.string
	  };

	  function UnorderedEditor(props) {
	    this.onHiddenInputKeyDown = bind(this.onHiddenInputKeyDown, this);
	    this.onHiddenInputChange = bind(this.onHiddenInputChange, this);
	    this.onEditorMouseDown = bind(this.onEditorMouseDown, this);
	    this.setEditorOptions = bind(this.setEditorOptions, this);
	    UnorderedEditor.__super__.constructor.call(this, props);
	    this._buffer = new EditorBuffer();
	    this._buffer.initBuffer(this.props.content || '');
	    this._inputEnabled = true;
	    this._plugins = [];
	    this._inputChangeListeners = [];
	    this._inputKeyDownListeners = [];
	    this._inputKeyUpListeners = [];
	    this._editorMouseDownListeners = [];
	    this._editorMouseUpListeners = [];
	    this._hiddenInputStyle = {};
	    this._inputPositionCheckpoint = {
	      startCol: -1,
	      endCol: -1
	    };
	    this.state = {
	      hiddenInputValue: '',
	      updateTime: 0
	    };
	  }

	  UnorderedEditor.prototype._clearInputPositionCheckpoint = function() {
	    return this._inputPositionCheckpoint = {
	      startCol: -1,
	      endCol: -1
	    };
	  };

	  UnorderedEditor.prototype._setInputPositionCheckpoint = function(startCol, endCol) {
	    return this._inputPositionCheckpoint = {
	      startCol: startCol,
	      endCol: endCol
	    };
	  };

	  UnorderedEditor.prototype._isSetInputPositionCheckpoint = function() {
	    return this._inputPositionCheckpoint.startCol !== -1 && this._inputPositionCheckpoint.endCol !== -1;
	  };

	  UnorderedEditor.prototype.componentWillReceiveProps = function(props) {
	    this._buffer.initBuffer(props.content || '');
	    this._clearInputPositionCheckpoint();
	    return this._buffer.setCursorPosition(0, 0);
	  };

	  UnorderedEditor.prototype.componentDidMount = function() {};

	  UnorderedEditor.prototype.getBuffer = function() {
	    return this._buffer;
	  };

	  UnorderedEditor.prototype.setInputEnabled = function(enabled) {
	    return this._inputEnabled = enabled;
	  };

	  UnorderedEditor.prototype.isInputEnabled = function() {
	    return this._inputEnabled;
	  };

	  UnorderedEditor.prototype.setInputValue = function(text) {
	    return this.setState({
	      hiddenInputValue: text
	    });
	  };

	  UnorderedEditor.prototype.setInputStyle = function(style) {
	    return this._hiddenInputStyle = style;
	  };

	  UnorderedEditor.prototype.resetInput = function() {
	    return this._clearInputPositionCheckpoint();
	  };

	  UnorderedEditor.prototype.addInputChangeListener = function(listener) {
	    return this._inputChangeListeners = this._inputChangeListeners.concat(listener);
	  };

	  UnorderedEditor.prototype.addInputKeyDownListener = function(listener) {
	    return this._inputKeyDownListeners = this._inputKeyDownListeners.concat(listener);
	  };

	  UnorderedEditor.prototype.addInputKeyUpListener = function(listener) {
	    return this._inputKeyUpListeners = this._inputKeyUpListeners.concat(listener);
	  };

	  UnorderedEditor.prototype.addEditorMouseDownListener = function(listener) {
	    return this._editorMouseDownListeners = this._editorMouseDownListeners.concat(listener);
	  };

	  UnorderedEditor.prototype.addEditorMouseUpListener = function(listener) {
	    return this._editorMouseUpListeners = this._editorMouseUpListeners.concat(listener);
	  };

	  UnorderedEditor.prototype.setEditorOptions = function(options) {
	    this._buffer.setOptions(options);
	    return this._buffer.setOptions({
	      updateEditor: (function(_this) {
	        return function() {
	          return _this.setState({
	            updateTime: new Date().getTime()
	          });
	        };
	      })(this)
	    });
	  };

	  UnorderedEditor.prototype.onEditorMouseDown = function(e, editorRect) {
	    var x, y;
	    this._clearInputPositionCheckpoint();
	    this.setState({
	      hiddenInputValue: ''
	    });
	    x = e.clientX - editorRect.left;
	    y = e.clientY - editorRect.top;
	    this._buffer.setCursorCoords(x, y);
	    return this._editorMouseDownListeners.map(function(callback) {
	      return callback();
	    });
	  };

	  UnorderedEditor.prototype.onHiddenInputChange = function(value) {
	    var cursor, lineLength;
	    this.setState({
	      hiddenInputValue: value
	    });
	    this._inputChangeListeners.map(function(callback) {
	      return callback(value);
	    });
	    if (!this._inputEnabled) {
	      return;
	    }
	    if (!this._isSetInputPositionCheckpoint()) {
	      cursor = this._buffer.getCursor();
	      lineLength = this._buffer.getRows()[cursor.cursorRow].length;
	      this._setInputPositionCheckpoint(cursor.cursorCol, lineLength - cursor.cursorCol);
	    }
	    return this._buffer.setRangeTextInLineInvertedEndCol(value, this._inputPositionCheckpoint.startCol, -this._inputPositionCheckpoint.endCol);
	  };

	  UnorderedEditor.prototype.onHiddenInputKeyDown = function(e) {
	    this._inputKeyDownListeners.map(function(callback) {
	      return callback(e);
	    });
	    if (!this._inputEnabled) {
	      return;
	    }
	    if (e.keyCode === 13) {
	      this._clearInputPositionCheckpoint();
	      this.setState({
	        hiddenInputValue: ''
	      });
	      this._buffer.insertText('\n');
	    }
	    if (e.keyCode === 8) {
	      this._clearInputPositionCheckpoint();
	      this.setState({
	        hiddenInputValue: ''
	      });
	      this._buffer.deletePreviousChar();
	    }
	    if (e.keyCode === 9) {
	      e.preventDefault();
	      this._clearInputPositionCheckpoint();
	      this.setState({
	        hiddenInputValue: ''
	      });
	      this._buffer.insertText('  ');
	    }
	    if (e.keyCode === 37) {
	      e.preventDefault();
	      this._clearInputPositionCheckpoint();
	      this.setState({
	        hiddenInputValue: ''
	      });
	      this._buffer.moveCursorLeft();
	    }
	    if (e.keyCode === 38) {
	      e.preventDefault();
	      this._clearInputPositionCheckpoint();
	      this.setState({
	        hiddenInputValue: ''
	      });
	      this._buffer.moveCursorUp();
	    }
	    if (e.keyCode === 39) {
	      e.preventDefault();
	      this._clearInputPositionCheckpoint();
	      this.setState({
	        hiddenInputValue: ''
	      });
	      this._buffer.moveCursorRight();
	    }
	    if (e.keyCode === 40) {
	      e.preventDefault();
	      this._clearInputPositionCheckpoint();
	      this.setState({
	        hiddenInputValue: ''
	      });
	      return this._buffer.moveCursorDown();
	    }
	  };

	  UnorderedEditor.prototype.render = function() {
	    var bufferRows, cursorCol, cursorRow, cursorWidth, cursorX, cursorY, editorProps, hiddenInputValue, ref1;
	    bufferRows = TextTransformer.transform(this._buffer.getRows());
	    ref1 = this._buffer.getCursor(), cursorX = ref1.cursorX, cursorY = ref1.cursorY, cursorRow = ref1.cursorRow, cursorCol = ref1.cursorCol, cursorWidth = ref1.cursorWidth;
	    hiddenInputValue = this.state.hiddenInputValue;
	    editorProps = {
	      bufferRows: bufferRows,
	      cursorX: cursorX,
	      cursorY: cursorY,
	      cursorWidth: cursorWidth,
	      cursorHeight: 21,
	      hiddenInputValue: hiddenInputValue,
	      setEditorOptions: this.setEditorOptions,
	      onEditorMouseDown: this.onEditorMouseDown,
	      onHiddenInputChange: this.onHiddenInputChange,
	      onHiddenInputKeyDown: this.onHiddenInputKeyDown,
	      hiddenInputStyle: this._hiddenInputStyle
	    };
	    return createElement(Editor, editorProps);
	  };

	  return UnorderedEditor;

	})(Component);


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Component, PropTypes, React, TextEditor, ref, style,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	React = (ref = __webpack_require__(1), PropTypes = ref.PropTypes, Component = ref.Component, ref);

	style = __webpack_require__(3);

	module.exports = TextEditor = (function(superClass) {
	  extend(TextEditor, superClass);

	  function TextEditor(props) {
	    this.onEditorMouseUp = bind(this.onEditorMouseUp, this);
	    this.onEditorContextMenu = bind(this.onEditorContextMenu, this);
	    this.onEditorMouseDown = bind(this.onEditorMouseDown, this);
	    this.setScroll = bind(this.setScroll, this);
	    TextEditor.__super__.constructor.call(this, props);
	  }

	  TextEditor.propTypes = {
	    cursorX: PropTypes.number.isRequired,
	    cursorY: PropTypes.number.isRequired,
	    cursorWidth: PropTypes.number.isRequired,
	    cursorHeight: PropTypes.number.isRequired,
	    bufferRows: PropTypes.array.isRequired,
	    setEditorOptions: PropTypes.func.isRequired,
	    onEditorMouseDown: PropTypes.func.isRequired,
	    hiddenInputValue: PropTypes.string.isRequired,
	    hiddenInputStyle: PropTypes.object.isRequired,
	    onHiddenInputChange: PropTypes.func.isRequired,
	    onHiddenInputKeyDown: PropTypes.func.isRequired
	  };

	  TextEditor.prototype.componentDidMount = function() {
	    var defaultCharWidth, doubleCharWidth, dummyDefaultChar, dummyDoubleChar, lineHeight, ref1;
	    ref1 = this.refs, dummyDefaultChar = ref1.dummyDefaultChar, dummyDoubleChar = ref1.dummyDoubleChar;
	    defaultCharWidth = dummyDefaultChar.getBoundingClientRect().width;
	    doubleCharWidth = dummyDoubleChar.getBoundingClientRect().width;
	    lineHeight = 21;
	    return this.props.setEditorOptions({
	      defaultCharWidth: defaultCharWidth,
	      doubleCharWidth: doubleCharWidth,
	      lineHeight: lineHeight,
	      setScroll: this.setScroll
	    });
	  };

	  TextEditor.prototype.componentWillReceiveProps = function(props) {
	    var cursorY, offsetHeight, ref1, scrollTop;
	    cursorY = props.cursorY;
	    ref1 = this.refs.editor, scrollTop = ref1.scrollTop, offsetHeight = ref1.offsetHeight;
	    if (cursorY > offsetHeight + scrollTop - 128) {
	      return this.refs.editor.scrollTop = cursorY - offsetHeight + 128;
	    }
	  };

	  TextEditor.prototype.setScroll = function(top, left) {
	    return this.refs.editorWrapper.scrollTop = top;
	  };

	  TextEditor.prototype.onEditorMouseDown = function(e) {
	    e.stopPropagation();
	    return this.props.onEditorMouseDown(e, this.refs.editorRoot.getBoundingClientRect());
	  };

	  TextEditor.prototype.onEditorContextMenu = function(e) {
	    return e.preventDefault();
	  };

	  TextEditor.prototype.onEditorMouseUp = function(e) {
	    e.stopPropagation();
	    return this.refs.hiddenInput.focus();
	  };

	  TextEditor.prototype.render = function() {
	    var bufferRows, cursorHeight, cursorWidth, cursorX, cursorY, hiddenInputStyle, hiddenInputValue, onHiddenInputChange, onHiddenInputKeyDown, ref1;
	    ref1 = this.props, bufferRows = ref1.bufferRows, cursorX = ref1.cursorX, cursorY = ref1.cursorY, cursorWidth = ref1.cursorWidth, cursorHeight = ref1.cursorHeight, hiddenInputValue = ref1.hiddenInputValue, hiddenInputStyle = ref1.hiddenInputStyle, onHiddenInputChange = ref1.onHiddenInputChange, onHiddenInputKeyDown = ref1.onHiddenInputKeyDown;
	    hiddenInputStyle = Object.assign({
	      left: cursorX,
	      top: cursorY,
	      width: cursorWidth,
	      height: cursorHeight
	    }, hiddenInputStyle);
	    return React.createElement("u-editor", {
	      "class": style.root,
	      "ref": 'editor'
	    }, React.createElement("u-line-numbers", null, bufferRows.map(function(i, index) {
	      return React.createElement("u-line-number", {
	        "key": index
	      }, index + 1);
	    })), React.createElement("u-editor-wrapper", {
	      "ref": 'editorWrapper',
	      "onMouseDown": this.onEditorMouseDown,
	      "onMouseUp": this.onEditorMouseUp,
	      "onContextMenu": this.onEditorContextMenu
	    }, React.createElement("u-editor-area", {
	      "ref": 'editorRoot',
	      "onMouseUp": this.onEditorMouseUp,
	      "onMouseDown": this.onEditorMouseDown
	    }, React.createElement("u-dummy", null, React.createElement("span", {
	      "data-no-block": true,
	      "ref": 'dummyDefaultChar'
	    }, "x"), React.createElement("span", {
	      "data-no-block": true,
	      "ref": 'dummyDoubleChar'
	    }, "我")), React.createElement("input", {
	      "className": style.hiddenInput,
	      "ref": 'hiddenInput',
	      "style": hiddenInputStyle,
	      "value": hiddenInputValue,
	      "onChange": (function(e) {
	        return onHiddenInputChange(e.target.value);
	      }),
	      "onKeyDown": (function(e) {
	        return onHiddenInputKeyDown(e);
	      })
	    }), bufferRows.map(function(i, index) {
	      return React.createElement("u-line", {
	        "key": index
	      }, i);
	    }))));
	  };

	  return TextEditor;

	})(Component);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[path]-[name]-[local]!./../node_modules/postcss-loader/index.js!./editor.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js?modules&importLoaders=1&localIdentName=[path]-[name]-[local]!./../node_modules/postcss-loader/index.js!./editor.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, ".src--editor-root {\n  line-height: 21px;\n  cursor: default;\n  font-family: Menlo, Consolas, 'DejaVu Sans Mono', monospace;\n  position: relative;\n  height: 100%;\n  width: 100%;\n  display: block;\n  overflow-y: scroll;\n  overflow-x: hidden;\n  background-color: rgb(40, 44, 52);\n  color: rgb(171, 178, 191);\n  box-sizing: border-box;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n\n.src--editor-root * {\n  display: block;\n  box-sizing: border-box;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.src--editor-root > u-line-numbers {\n  padding-bottom: 128px;\n  border-right: 1px solid rgb(60, 64, 73);\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 50px;\n  min-height: 100%;\n}\n\n.src--editor-root > u-editor-wrapper {\n  position: absolute;\n  left: 50px;\n  top: 0;\n  right: 0;\n  min-height: 100%;\n  overflow-x: auto;\n  overflow-y: visible;\n}\n\n.src--editor-root > u-editor-wrapper > u-editor-area {\n  display: inline-block;\n  position: relative;\n  min-height: 100%;\n  min-width: 100%;\n}\n\n.src--editor-root > u-editor-wrapper > u-editor-area > u-dummy {\n  position: absolute;\n  visibility: hidden;\n}\n\n.src--editor-root > u-editor-wrapper > u-editor-area > u-dummy > span {\n  display: inline;\n}\n\n.src--editor-root > u-editor-wrapper > u-editor-area > u-line {\n  white-space: nowrap;\n}\n\n.src--editor-root > u-editor-wrapper > u-editor-area > u-line * {\n  display: inline-block;\n}\n\n.src--editor-root > u-editor-wrapper > u-editor-area > u-line u-space, .src--editor-root > u-editor-wrapper > u-editor-area > u-line u-enter {\n  color: rgb(59, 64, 72);\n}\n\n.src--editor-root > u-editor-wrapper::-webkit-scrollbar {\n  display: none;\n}\n\n.src--editor-root::-webkit-scrollbar {\n  width: 2px;\n}\n\n.src--editor-root::-webkit-scrollbar-track {\n  background: #eee;\n}\n\n.src--editor-root::-webkit-scrollbar-thumb {\n  background: red;\n}\n\n@-webkit-keyframes src--editor-focuspointer {\n  0% { border-left: 2px solid transparent; }\n  100% { border-left: 2px solid rgb(82, 139, 255); }\n}\n\n@keyframes src--editor-focuspointer {\n  0% { border-left: 2px solid transparent; }\n  100% { border-left: 2px solid rgb(82, 139, 255); }\n}\n\n.src--editor-hiddenInput {\n  width: 0;\n  line-height: 21px;\n  position: absolute;\n  outline: none;\n  border: none;\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  background-color: transparent;\n  color: transparent;\n}\n\n.src--editor-hiddenInput:focus {\n  -webkit-animation: src--editor-focuspointer .7s infinite;\n          animation: src--editor-focuspointer .7s infinite;\n}\n", ""]);

	// exports
	exports.locals = {
		"root": "src--editor-root",
		"hiddenInput": "src--editor-hiddenInput",
		"focuspointer": "src--editor-focuspointer"
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var React, TextTransformer;

	React = __webpack_require__(1);

	module.exports = TextTransformer = (function() {
	  function TextTransformer() {}

	  TextTransformer.transform = function(rows) {
	    return rows.map(function(i, index) {
	      if (i.endsWith('\n')) {
	        return React.createElement("span", {
	          "key": index
	        }, i.slice(0, -1).split(' ').map(function(i, index, arr) {
	          return [
	            React.createElement("span", {
	              "key": index * 2
	            }, i), index !== arr.length - 1 && React.createElement("u-space", {
	              "key": index * 2 + 1
	            }, "·")
	          ];
	        }), React.createElement("u-enter", null, "¬"));
	      } else {
	        return React.createElement("span", {
	          "key": index
	        }, i.split(' ').map(function(i, index, arr) {
	          return [
	            React.createElement("span", {
	              "key": index * 2
	            }, i), index !== arr.length - 1 && React.createElement("u-space", {
	              "key": index * 2 + 1
	            }, "·")
	          ];
	        }));
	      }
	    });
	  };

	  return TextTransformer;

	})();


/***/ }
/******/ ])
});
;