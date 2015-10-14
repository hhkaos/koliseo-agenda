A client library to embed a Koliseo event agenda in any website. You can visit [the demo](http://icoloma.github.io/koliseo-agenda) to see how it looks like.

Koliseo is a ticketing platform for events with an interface to manage the event agenda: Call for Proposals, vote proposals, create days, tracks and slots, and move talks between slots. This widget displays the final agenda as a table, including deep linking and other awesome features.

The library has one small polyfill dependency (the Fetch API) and is 9K gzipped. It has been tested (to the best of our knowledge) in Chrome, Firefox, IE 10+, Edge and Safari.

## Usage

The simplest thing to make it work:

```html
<div class="ka"></div>
<script src="koliseo-agenda.js"></script>
<script>
  Koliseo.agenda.render({
    c4pUrl: '<your c4p URL>',
    element: document.querySelector('.ka')
  });
</script>
```

This component requires browser support for `Promises` and the `Fetch API`. In practice, that means [Chrome, Firefox and Opera](http://caniuse.com/#feat=fetch). For other browsers, this requires loading certain polyfills:

```JavaScript
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
        c4pUrl: '<your C4P URL>',
        element: document.querySelector('.ka')
      });
    }
  }

  (typeof fetch === 'undefined') && loadJS('koliseo-polyfill.js', onLoad);
  loadJS('koliseo-agenda.js', onLoad);
```

## Deep linking

To link to a talk, just select the talk in the table and copy the resulting link. If the talk moves around the link will adapt, as long as it belongs to the same day.

If no talk is present in the URL, the first day will be selected.

## Develop

You are welcome to hack around. To get started, run the following:

```
npm install

# launch test page
gulp serve

# run tests
npm test

# debug tests
npm run-script debug

# publish into gh-pages
bin/publish-gh-pages
```

## License

This library is released under the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0).
