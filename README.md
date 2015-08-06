A client library to display an agenda retrieved from Koliseo.

## Usage

This component requires Promises and the Fetch API. For older browsers, this requires loading certain polyfills:

```
  /*! loadJS: load a JS file asynchronously. [c]2014 @scottjehl, Filament Group, Inc. (Based on http://goo.gl/REQGQ by Paul Irish). Licensed MIT */
  function loadJS( src, cb ){
    "use strict";
    var ref = window.document.getElementsByTagName( "script" )[ 0 ];
    var script = window.document.createElement( "script" );
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore( script, ref );
    if (cb && typeof(cb) === "function") {
      script.onload = cb;
    }
    return script;
  }

  function onLoad() {
    if (typeof Koliseo !== 'undefined' && Koliseo.agenda && typeof fetch !== 'undefined') {
      Koliseo.agenda.render({
        c4pUrl: 'c4p.json',
        agendaUrl: 'talks.json',
        element: document.querySelector('.koliseo-agenda')
      });
    }
  }

  (typeof fetch === 'undefined') && loadJS('../build/koliseo-polyfill.js', onLoad);
  loadJS('../build/koliseo-agenda.js', onLoad);
```

## Develop

Run the following

```
npm install

# run tests
npm test

# debug tests
npm run-script debug

# launch test page (navigate to test/index.html)
gulp serve
```
