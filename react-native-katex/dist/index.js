'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactNative = require('react-native');

var _RNWebView = require('react-native-webview')

var _katexStyle = require('./katex-style');

var _katexStyle2 = _interopRequireDefault(_katexStyle);

var _katexScript = require('./katex-script');

var _katexScript2 = _interopRequireDefault(_katexScript);

var _propTypes = require('prop-types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function getContent(_ref) {
  var inlineStyle = _ref.inlineStyle,
      _ref$expression = _ref.expression,
      expression = _ref$expression === undefined ? '' : _ref$expression,
      options = _objectWithoutProperties(_ref, ['inlineStyle', 'expression']);

  return '<!DOCTYPE html>\n<html>\n<head>\n<style>\n' + _katexStyle2.default + '\n' + inlineStyle + '\n</style>\n<script>\nwindow.onerror = e => document.write(e);\nwindow.onload = () => katex.render(' + JSON.stringify(expression) + ', document.body, ' + JSON.stringify(options) + ');\n' + _katexScript2.default + '\n</script>\n</head>\n<body>\n</body>\n</html>\n';
}

var defaultStyle = _reactNative.StyleSheet.create({
  root: {
    height: 40
  }
});

var defaultInlineStyle = '\nhtml, body {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n}\n.katex {\n  margin: 0;\n  display: flex;\n}\n';

var Katex = function (_Component) {
  _inherits(Katex, _Component);

  function Katex() {
    _classCallCheck(this, Katex);

    return _possibleConstructorReturn(this, (Katex.__proto__ || Object.getPrototypeOf(Katex)).apply(this, arguments));
  }

  _createClass(Katex, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          style = _props.style,
          onLoad = _props.onLoad,
          onError = _props.onError,
          options = _objectWithoutProperties(_props, ['style', 'onLoad', 'onError']);

      return _react2.default.createElement(_RNWebView.WebView, {
        style: style,
        source: { html: getContent(options) },
        onLoad: onLoad,
        onError: onError,
        renderError: onError
      });
    }
  }]);

  return Katex;
}(_react.Component);

Katex.propTypes = {
  expression: _propTypes.string.isRequired,
  displayMode: _propTypes.bool,
  throwOnError: _propTypes.bool,
  errorColor: _propTypes.string,
  inlineStyle: _propTypes.string,
  macros: _propTypes.object,
  colorIsTextColor: _propTypes.bool,
  onLoad: _propTypes.func,
  onError: _propTypes.func
};
Katex.defaultProps = {
  displayMode: false,
  throwOnError: false,
  errorColor: '#f00',
  inlineStyle: defaultInlineStyle,
  style: defaultStyle,
  macros: {},
  colorIsTextColor: false,
  onLoad: function onLoad() {},
  onError: function onError() {}
};
exports.default = Katex;