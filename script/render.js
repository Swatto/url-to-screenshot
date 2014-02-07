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
        if(second >= 20){
          window.callPhantom({message: 'error'});
        }else{
          second++;
          window.setTimeout(getOut, 1000);
        }
      };
      if(typeof window.app === 'object' && typeof window.app.on === 'function'){
        window.app.on('afterDraw', function(){
          var cookie = document.querySelector(".cookies");
          cookie.parentNode.removeChild(cookie);
          var img = document.createElement('img');
          img.src = 'http://vp-seo-images.s3.amazonaws.com/logo.svg';
          img.onload = function(){
            window.callPhantom({message: 'ok'});
          }
          img.style.maxWidth = '250px';
          img.style.position = 'fixed';
          img.style.bottom = '10px';
          img.style.right = '10px';
          img.style.zIndex = '10000000000';
          document.body.appendChild(img);
        });
      }
      window.setTimeout(getOut, 1000);
    }, false);
  });
};

page.onCallback = function(data) {
  if(data.message=='ok'){
    console.log(page.renderBase64(format));
  }else if(data.message=='render-v2'){
    page.evaluate(function(){
      var toBeRemoved = document.querySelectorAll('.icons, .user, .menu, .cta .right, .cta .left, .cta .cta-button, .cta .views-count');
      for (var i = toBeRemoved.length - 1; i >= 0; i--) {
        toBeRemoved[i].parentNode.removeChild(toBeRemoved[i]);
      };
      document.querySelector('#app').style.height = 525;
    });
    console.log(page.renderBase64(format));
  }else{
    console.log('error');
  }
  phantom.exit();
};

page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
        });
    }
    console.error(msgStack.join('\n'));
};

page.open(url);