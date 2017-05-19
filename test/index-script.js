// This is just example code. Feel free to replace with your own way to load polyfill code.

/*! loadJS: load a JS file asynchronously. [c]2014 @scottjehl, Filament Group, Inc. (Based on http://goo.gl/REQGQ by Paul Irish). Licensed MIT */
function loadJS(src, cb) {
  "use strict";
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);
  if (cb && typeof (cb) === "function") {
    script.onload = cb;
  }
  return script;
}

document.getElementById('oauthClientForm').addEventListener('submit', function onOAuthClientChange(e) {
  e.preventDefault();
  var clientId = document.getElementById('clientId').value;
  localStorage.setItem('test-client-id', clientId);
  window.location.reload();
});

function onLoad() {
  var clientId = localStorage.getItem('test-client-id');
  document.getElementById('clientId').value = clientId || '';
  if (typeof Koliseo !== 'undefined' && Koliseo.agenda && typeof fetch !== 'undefined') {
    Koliseo.agenda.render({
      // test event
      c4pUrl: 'https://www.koliseo.com/extrema/evento-de-prueba1/r4p/5675064775147520',
      
      // Codemotion 2015
      //c4pUrl: 'https://www.koliseo.com/codemotion/codemotion-madrid/r4p/5685252034920448',

      // Codemotion 2016
      //c4pUrl: 'https://www.koliseo.com/codemotion/codemotion-madrid/r4p/5753906952929280',
      
      element: document.querySelector('.ka'),
      oauthClientId: clientId
    })
  }
}

(typeof fetch === 'undefined') && loadJS('../build/polyfill.js', onLoad)
loadJS('../build/koliseo-agenda.min.js', onLoad)

