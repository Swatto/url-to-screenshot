/**
 * Module dependencies.
 */

var webpage = require('webpage');
var args = require('system').args;
var noop = function() {};

/**
 * Script arguments.
 */

var url = args[1];
var width = args[2];
var height = args[3];
var format = args[4];

/**
 * Initialize page.
 */

var page = webpage.create();
page.viewportSize = {
  width: width,
  height: height
};

/**
 * Silence phantomjs.
 */

page.onConsoleMessage =
page.onConfirm = 
page.onPrompt =
page.onError = noop;

/**
 * Open and render page.
 */

page.onInitialized = function() {
  page.evaluate(function(domContentLoadedMsg) {
    document.addEventListener('DOMContentLoaded', function() {
      window.app.on('afterDraw', function(){
        var cookie = document.querySelector(".cookies");
        cookie.parentNode.removeChild(cookie);
        window.callPhantom('DOMContentLoaded');
      });
    }, false);
  });
};

page.onCallback = function(data) {
  console.log(page.renderBase64(format));
  phantom.exit();
};

page.open(url);
