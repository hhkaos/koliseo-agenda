

// return the GET parameter from a URL 
// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
export function getUrlParameter(url, name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(url);
  return !results ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export function assert(assertion, message) {
  if (!assertion) {
    throw new Error(message);
  }
}

/*
var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

function transitionClassFunc({removeClass = false}={}) {
  return function(el, className = 'active') {
    if (removeClass) {
      if (!el.classList.contains(className)) return Promise.resolve();
    }
    else {
      if (el.classList.contains(className)) return Promise.resolve();
    }

    return new Promise(resolve => {
      var listener = event => {
        if (event.target != el) return;
        el.removeEventListener('webkitTransitionEnd', listener);
        el.removeEventListener('transitionend', listener);
        resolve();
      };

      el.addEventListener('webkitTransitionEnd', listener);
      el.addEventListener('transitionend', listener);
      requestAnimationFrame(_ => {
        el.classList[removeClass ? 'remove' : 'add'](className);
      });
    });
  }
};

export const transitionTo = transitionClassFunc();

export const transitionFrom = transitionClassFunc({removeClass: true});

export function escapeHtml(string) {
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
}

export function escapeHtmlTag(strings, ...values) {
  values = values.map(exports.escapeHtml);
  return strings.reduce((str, val, i) => str += val + (values[i] || ''), '');
}
*/

export function formatDate(date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}
