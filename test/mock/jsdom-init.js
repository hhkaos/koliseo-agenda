import jsdom from 'jsdom';

export const URL = 'https://example.com/foo';

export function initDOM() {
  const doc = jsdom.jsdom('<html><body></body></html>', {
    // history in jsdoc requires a valid URL
    url: URL
  });
  global.document = doc;
  global.window = doc.defaultView;
  global.location = window.location;
}

