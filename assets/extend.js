(function(hb) {
  'use strict';

  var api = {};

  api.getLangs = function getLangs(successCallback, errorCallback) {
    var req = new XMLHttpRequest();
    req.open('GET', 'https://api.github.com/repos/webketje/gs-future-extend-test/contents/extend_languages.json');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send();
    req.onload = function() {
      if (req.status === 200) {
        successCallback.call(req, JSON.parse(atob(JSON.parse(req.response).content)));
      } else
        errorCallback.call(req, JSON.parse(req.response));
    };
    req.onerror = function() {
      errorCallback.call(req, JSON.parse(req.response));
    };
  };

  api.getPlugins = function getPlugins() {
    //https://github.com/webketje/gs-future-extend-test
  }

  api.getLangs(
    function onLangsLoaded(data) {
      console.log(data)
      document.getElementsByClassName('content')[0].innerHTML = hb.templates['langs.hbs']({ langs: data })
    },
    function onLangsError(data) {
      console.log(data);
    }
  )

}(Handlebars));