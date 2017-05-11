A client library to embed a Koliseo event agenda in any website. You can visit [the demo](http://icoloma.github.io/koliseo-agenda) to see how it looks like.

[![Snapshot of the agenda](http://icoloma.github.io/koliseo-agenda/agenda-screenshot.png)](http://icoloma.github.io/koliseo-agenda)

Koliseo is a ticketing platform for events with an interface to manage the event agenda: call for proposals, vote talks, create tracks and slots, and move talks between slots. This widget displays the final agenda as a table.

The library includes one small polyfill dependency. It has been tested (to the best of our knowledge) in Chrome, Firefox, IE 10+, Edge and Safari.

## Usage

The simplest thing to make it work:

```html
<div class="ka"></div>
<script src="koliseo-agenda.js"></script>
<script>
  Koliseo.agenda.render({
    // the element where the agenda will be rendered
    element: document.querySelector('.ka'),

    // the public URL to your Call for Proposals
    c4pUrl: 'https://www.koliseo.com/<your c4p URL>',

    // (optional) Your Client Application ID, as configured in your user profile under "Apps"
    // If missing, the user will not be able to submit feedback or likes to their talks
    oauthClientId: '<Your Koliseo OAuth client ID>'
  });
</script>
```

This component requires browser support for `Promises` and the `Fetch API`, currently included in [Chrome, Firefox, Edge and Opera](http://caniuse.com/#feat=fetch). For other browsers, some polyfills might be needed:

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
        element: document.querySelector('.ka'),
        oauthClientId: '<Your Koliseo OAuth token ID>'
      });
    }
  }

  (typeof fetch === 'undefined') && loadJS('koliseo-polyfill.js', onLoad);
  loadJS('koliseo-agenda.js', onLoad);
```

## Deep linking

To link to a talk, just select the talk in the table and copy the resulting link. If no talk is present in the URL, the first day will be selected.

## Attendees authentication

To enable feedback from attendees you need to specify a Client Application id. It can be created in the `Applications` section of your Koliseo user profile. 

## Develop

You are welcome to hack around. To get started, run the following:

```
npm install

# run tests (choose one of these)
npm test
npm run coverage
npm run stats

# launch test page (launch both commands at the same time)
npm run watch:js
npm run watch:css

# build a release
npm run build

# publish into gh-pages
bin/publish-gh-pages
```

## License

This library is released under the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0).
