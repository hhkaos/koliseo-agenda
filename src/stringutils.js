import marked from 'marked';

var formatMarkdown = function(s) {
  return marked(s || '');
}

export {
  formatMarkdown
}
