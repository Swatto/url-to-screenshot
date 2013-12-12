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
      document.body.style.backgroundColor = '#ffffff';
      var second = 0;
      var getOut = function(){
        if(second >= 1){
          window.callPhantom('error');
        }else{
          second++;
        }
      };
      window.setTimeout(getOut(), 1000);
      window.app.on('afterDraw', function(){
        var cookie = document.querySelector(".cookies");
        cookie.parentNode.removeChild(cookie);
        var img = document.createElement('img');
        img.src = 'http://vp-seo-images.s3.amazonaws.com/logo.svg';
        img.onload = function(){
          window.callPhantom('ok');
        }
        img.style.maxWidth = '250px';
        img.style.position = 'fixed';
        img.style.bottom = '10px';
        img.style.right = '10px';
        img.style.zIndex = '10000000000';
        document.body.appendChild(img);
      });
    }, false);
  });
};

page.onCallback = function(data) {
  if(data=='ok'){
    console.log(page.renderBase64(format));
  }else{
    console.log(false);
  }
  phantom.exit();
};

page.open(url);
