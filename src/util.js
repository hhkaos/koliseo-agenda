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

// transform a string into a single element
export function strToEl(str) {
  var tmpEl = document.createElement('div');
  tmpEl.innerHTML = str;
  var r = tmpEl.children[0];
  while (tmpEl.firstChild) {
    tmpEl.removeChild(tmpEl.firstChild);
  }
  return r;
};

export function escapeHtml(string) {
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
}

export function escapeHtmlTag(strings, ...values) {
  values = values.map(exports.escapeHtml);
  return strings.reduce((str, val, i) => str += val + (values[i] || ''), '');
}

export function closest(el, selector) {
  if (el.closest) {
    return el.closest(selector);
  }

  var matches = el.matches || el.msMatchesSelector || el.webkitMatchesSelector;

  do {
    if (el.nodeType != 1) continue;
    if (matches.call(el, selector)) return el;
  } while (el = el.parentNode);

  return undefined;
}

