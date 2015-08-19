const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;'
}, escapeRegEx = new RegExp('[' + Object.keys(entityMap).join('') + ']', 'g')

/**
  Process all links and replace them by HTML links
*/
function formatLinks(s) {

  // regex extracted from
  // http://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript
  // http://stackoverflow.com/questions/700163/detecting-a-naughty-or-nice-url-or-link-in-a-text-string

  // our format: "http://foo.bar (texto opcional del enlace)"
  return !s? '' : s.replace(escapeRegEx, function(match) {
    // copiado de underscore.escape, porque no queremos escapar la barra '/' sino sólo el resto
    return entityMap[match];
  }).replace(/(((https?:\/\/[^\s\/]+)|([^\s]+\.(aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel)))((\/|\?)[^\s]+)?)(\s+(\([^\)]+\)))?/g, function(a, path) {
    var label = arguments[9];
    var href = path.match(/https?:\/\//)? path : 'http://' + path;
    var content = label && label.substring(1, label.length - 1) || path;
    return `<a rel="nofollow" href="${href}" target="_blank">${content}</a>`;
  })
}

function formatLightweightMarkdown(s) {
  return !s? '' :
    formatLinks(s)
      .replace(/(^|\s)\*([^\s][^*]*)\*/g, ' <b>$2</b>')
      .replace(/(^|\s)\/([^\s][^\/]*)\//g, ' <i>$2</i>')
      .replace(/(^|\s)`([^\s][^`]*)`/g, ' <code>$2</code>')

}

function formatMarkdown(s) {
  return formatLightweightMarkdown(s)
    // <li>
    .replace(/^\* (.*)$/gm, '<li>$1</li>')
    // <ul>
    .replace(/((<li>.*<\/li>\n)+)/gm, '<ul>$1</ul>')
    // headers
    .replace(/^######(.*)$/gm, '<h6>$1</h6>')
    .replace(/^#####(.*)$/gm, '<h5>$1</h5>')
    .replace(/^####(.*)$/gm, '<h4>$1</h4>')
    .replace(/^###(.*)$/gm, '<h3>$1</h3>')
    .replace(/^##(.*)$/gm, '<h2>$1</h2>')
    .replace(/^#(.*)$/gm, '<h1>$1</h1>')
    // remove empty lines
    .replace(/^\s*[\n\r]/gm, '')
    // <p>
    .replace(/^([^<].*)$/gm, '<p>$1</p>')
}

export {
  formatMarkdown, formatLightweightMarkdown
}
