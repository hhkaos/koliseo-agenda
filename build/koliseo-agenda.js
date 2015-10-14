(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**

  Bidimensional array of talks. Represents the contents of an agenda for a day.

*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashCollectionFind = require('lodash/collection/find');

var _lodashCollectionFind2 = _interopRequireDefault(_lodashCollectionFind);

// Data for a cell. Can be a talk or information about a break

var TalkTableCell = function TalkTableCell(_ref) {
  var id = _ref.id;
  var start = _ref.start;
  var end = _ref.end;
  var contents = _ref.contents;

  _classCallCheck(this, TalkTableCell);

  // vertical and horizontal span for this cell, 1 for single row / column
  this.colSpan = this.rowSpan = 1;

  // talk id
  this.id = id;

  // start time
  this.start = start;

  // end time
  this.end = end;

  // type of the cell. One of:
  // 'TALK': see the talk data inside this.contents
  // 'BREAK': a break. See the break title in contents.title
  // 'EXTEND': this talk extends another track. See contents.trackId
  // undefined if the slot is empty
  this.type = contents && contents.type || undefined;

  // contents of the cell (see type). May be undefined if the slot is empty.
  this.contents = contents;
};

var AgendaDayTableModel = (function () {
  function AgendaDayTableModel(_ref2) {
    var _this = this;

    var id = _ref2.id;
    var name = _ref2.name;
    var tracks = _ref2.tracks;

    _classCallCheck(this, AgendaDayTableModel);

    // HACK: sort the tracks alphabetically. Once sorting is supported by Koliseo, this can be removed
    tracks.sort(function (t1, t2) {
      return t1.name.localeCompare(t2.name);
    });

    this.id = id;
    this.name = name;
    this.tracks = tracks;

    // labels for rows
    // start: starting time, as string
    // end: ending time, as string
    var rowLabels = [];

    // labels for columns, corresponding to Track names
    var colLabels = this.colLabels = [];

    // calculate all row labels
    function addRowLabel(label) {
      rowLabels.indexOf(label) > -1 || rowLabels.push(label);
    }

    tracks.forEach(function (_ref3, index) {
      var slots = _ref3.slots;

      slots.forEach(function (_ref4) {
        var start = _ref4.start;
        var end = _ref4.end;

        addRowLabel(start);
        addRowLabel(end);
      });
    });
    rowLabels.sort();

    rowLabels = this.rowLabels = rowLabels.map(function (label, index) {
      return {
        start: label,
        end: index < rowLabels.length - 1 ? rowLabels[index + 1] : undefined
      };
    });

    // the last row is just the ending time of the event, and has no assigned talks.
    // It can be removed
    this.rowLabels.pop();

    // two-dimensional array of TalkTableCell
    this.data = rowLabels.map(function (_) {
      return [];
    });

    // transform data from columns into rows, including rowspans
    tracks.forEach(function (_ref5, colIndex) {
      var id = _ref5.id;
      var name = _ref5.name;
      var slots = _ref5.slots;

      colLabels.push(name);
      slots.forEach(function (slot) {
        var rowIndex = _this.getRowLabelIndex({ start: slot.start });
        var row = _this.data[rowIndex];
        var cell = row[colIndex] = new TalkTableCell(slot);
        var endRowIndex = _this.getRowLabelIndex({ end: slot.end });
        cell.rowSpan = endRowIndex - rowIndex + 1;
      });
    });

    // calculate colSpans
    this.data.forEach(function (row, rowIndex) {
      row.forEach(function (cell, colIndex) {
        if (cell && cell.type != 'EXTEND') {
          var colSpan = 1;
          var trackId = tracks[colIndex].id;
          while (colIndex + colSpan < row.length) {
            var nextCell = row[colIndex + colSpan];
            if (!nextCell || nextCell.type != 'EXTEND' || nextCell.contents.trackId != trackId) {
              break;
            }
            row[colIndex + colSpan] = undefined;
            colSpan++;
            nextCell.contents.merged = true;
          }
          cell.colSpan = colSpan;
        }
      });
    });
  }

  _createClass(AgendaDayTableModel, [{
    key: 'getRowLabelIndex',

    // return the row label index according to the passed argument
    // label.start
    // label.end
    value: function getRowLabelIndex(label) {
      return this.rowLabels.indexOf((0, _lodashCollectionFind2['default'])(this.rowLabels, label));
    }
  }, {
    key: 'getCoords',
    value: function getCoords(talkId) {
      for (var rowIndex = 0; rowIndex < this.data.length; rowIndex++) {
        var row = this.data[rowIndex];
        for (var colIndex = 0; colIndex < row.length; colIndex++) {
          if (row[colIndex] && row[colIndex].id == talkId) {
            return {
              row: rowIndex,
              col: colIndex
            };
          }
        }
      }
      return null;
    }
  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      return this.colLabels.length === 0;
    }
  }, {
    key: 'findTalk',

    // find the first talk starting at row, col and moving in rowDelta, colDelta direction
    // ignores breaks and gaps in the calendar
    value: function findTalk(_ref6, _ref7) {
      var row = _ref6.row;
      var col = _ref6.col;
      var rowDelta = _ref7.rowDelta;
      var colDelta = _ref7.colDelta;

      var newRowIndex = row + rowDelta;
      var newColIndex = col + colDelta;

      if (newColIndex > -1 && newRowIndex > -1) {

        if (colDelta) {
          var _row = this.data[newRowIndex];
          var cell = _row && _row[newColIndex];
          if (cell && cell.type == 'TALK') {
            return cell;
          } else {
            // there is nothing on this cell. Search this new column up or down
            return this.findTalk({ row: newRowIndex, col: newColIndex }, { rowDelta: 1, colDelta: 0 }) || this.findTalk({ row: newRowIndex, col: newColIndex }, { rowDelta: -1, colDelta: 0 });
          }
        }

        if (rowDelta) {
          while (newRowIndex >= 0 && newRowIndex < this.data.length) {
            var _row2 = this.data[newRowIndex];
            var cell = _row2 && _row2[newColIndex];
            if (cell && cell.type == 'TALK') {
              return cell;
            }
            newRowIndex += rowDelta;
          }
        }
      }
      return null;
    }
  }]);

  return AgendaDayTableModel;
})();

exports.AgendaDayTableModel = AgendaDayTableModel;

},{"lodash/collection/find":9}],2:[function(require,module,exports){
/**

  Render a day table of talks as HTML

*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var AgendaDayTemplate = (function () {
  function AgendaDayTemplate(model) {
    _classCallCheck(this, AgendaDayTemplate);

    this.model = model;
    //console.log(model);
  }

  _createClass(AgendaDayTemplate, [{
    key: 'render',
    value: function render() {
      var model = this.model;
      return this.model.isEmpty() ? '<h3>Nothing to see here</h3><p>There are no entries scheduled for this day.</p>' : '\n      <table class="ka-table">\n      <thead class="ka-head"><tr>' + this.renderColLabels() + '</tr></thead>\n      <tbody>' + this.renderBody() + '</tbody>\n      </table>\n      ';
    }
  }, {
    key: 'renderColLabels',
    value: function renderColLabels() {
      var labels = [''].concat(this.model.colLabels);
      return labels.map(function (label, index) {
        var trackId = ''; //this.model.tracks[index - 1].id;
        return '<th class="ka-table-th" data-track-id="' + trackId + '">' + label + '</th>';
      }).join('');
    }
  }, {
    key: 'renderBody',
    value: function renderBody() {
      var _this = this;

      var rowLabels = this.model.rowLabels;
      return rowLabels.map(function (_ref, rowIndex) {
        var start = _ref.start;
        var end = _ref.end;

        var row = _this.model.data[rowIndex];
        // TODO render time metadata. Hell, render all scema metadata, right?
        return '\n          <tr class="ka-table-tr">\n          <td class="ka-table-th">' + start + '-' + end + '</td>\n          ' + (!row ? '' : row.map(function (cell) {
          return !cell ? '' : _this.renderCell(cell);
        }).join('')) + '\n          </tr>\n          ';
      }).join('');
    }
  }, {
    key: 'renderCell',
    value: function renderCell(_ref2) {
      var start = _ref2.start;
      var end = _ref2.end;
      var contents = _ref2.contents;
      var rowSpan = _ref2.rowSpan;
      var colSpan = _ref2.colSpan;

      var type = contents && contents.type;
      var $contents = type === 'TALK' ? this.renderTalk(contents) : type === 'BREAK' ? contents.title : type === 'EXTEND' ? 'Extended from <b>' + this.model.tracks.find(function (track) {
        return track.id == contents.trackId;
      }).name + '</b>' : 'Empty slot';

      return type === 'EXTEND' && contents.merged ? '' : ' <td class="ka-table-td ' + (type && type.toLowerCase() || '') + '" rowspan="' + rowSpan + '" colspan="' + colSpan + '"> ' + $contents + ' </td> ';
    }
  }, {
    key: 'renderTalk',
    value: function renderTalk(_ref3) {
      var _this2 = this;

      var id = _ref3.id;
      var hash = _ref3.hash;
      var title = _ref3.title;
      var description = _ref3.description;
      var authors = _ref3.authors;
      var tags = _ref3.tags;

      return '\n      <p><a href="#' + hash + '" data-id="' + id + '" data-hash="' + hash + '" class="ka-talk-title">' + title + '</a></p>\n      <p class="ka-author-brief">' + authors.map(function (a) {
        return _this2.renderAuthor(a);
      }).join(', ') + '</p>\n      ';
    }
  }, {
    key: 'renderAuthor',
    value: function renderAuthor(_ref4) {
      var id = _ref4.id;
      var uuid = _ref4.uuid;
      var name = _ref4.name;
      var avatar = _ref4.avatar;
      var description = _ref4.description;

      return '' + name;
    }
  }]);

  return AgendaDayTemplate;
})();

;

exports.AgendaDayTemplate = AgendaDayTemplate;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _AgendaDayTemplate = require('./AgendaDayTemplate');

var _AgendaDayTableModel = require('./AgendaDayTableModel');

var _util = require('./util');

var _TalkDetailsPopup = require('./TalkDetailsPopup');

/**

  Displays an entire agenda, including multiple days

*/

var AgendaView = (function () {
  function AgendaView(_ref) {
    var _this = this;

    var c4p = _ref.c4p;
    var agenda = _ref.agenda;
    var element // DOM node to render everything into
    = _ref.element;

    _classCallCheck(this, AgendaView);

    // the original JSON data
    this.c4p = c4p;
    this.days = agenda.days;
    this.pageTitle = document.title;

    // this.selectedDayId
    // this.selectedTalkHash
    // this.selectedTalkCoords

    // all talks indexed by dayId/talkId
    this.talksByHash = {};
    agenda.days.forEach(function (day) {
      day.tracks.forEach(function (track) {
        track.slots.forEach(function (slot) {
          if (slot.contents && slot.contents.type === 'TALK') {
            var hash = slot.contents.hash = day.id + '/' + slot.id;
            _this.talksByHash[hash] = slot;
          }
        });
      });
    });

    this.tagColors = {};
    c4p.tagCategories && Object.keys(c4p.tagCategories).forEach(function (tagCategoryName, index) {
      return _this.tagColors[tagCategoryName] = index;
    });

    // the agenda table data, indexed by agendaDay.id
    this.models = {};

    // the DOM element to modify
    this.element = element;
  }

  _createClass(AgendaView, [{
    key: 'render',
    value: function render() {
      var dayId = !location.hash ? '' : /#([^\/]+)(\/.+)?/.exec(location.hash)[1];
      var talkHash = dayId && location.hash.substring(1);
      var html = (this.days.length > 1 ? this.renderDayTabs() : '<h2 class="kday-title">' + this.days[0].name + '</h2>') + this.renderWorkspace() + this.renderHint();
      this.element.classList.add('ka');
      this.element.innerHTML = html;
      document.body.addEventListener('click', this.onClick.bind(this));
      document.body.addEventListener('keyup', this.onKeyPress.bind(this));

      this.selectDay(dayId);
      var talk = this.selectTalk(talkHash);
      this.scrollToTalk(talk);
    }
  }, {
    key: 'renderDayTabs',
    value: function renderDayTabs() {

      var tabLinks = this.days.map(function (_ref2) {
        var id = _ref2.id;
        var name = _ref2.name;

        return '\n        <li class="ka-tab-li">\n        <a class="ka-tab-a" data-day-id="' + id + '" href="#' + id + '">' + name + '</a>\n        </li>\n      ';
      }).join('');

      return '\n      <ul class="ka-tabs">\n      ' + tabLinks + '\n      </ul>\n    ';
    }
  }, {
    key: 'renderWorkspace',
    value: function renderWorkspace() {
      return '<div class="kworkspace"></div><div class="ka-overlay ka-hidden"></div>';
    }
  }, {
    key: 'renderHint',
    value: function renderHint() {
      return '\n      <div class="ka-hint">\n        <a href="http://koliseo.com" target="_blank" class="ka-logo"></a>\n        <p class="ka-hint-p">Using a keyboard? Try using the cursors to move between talks</p>\n        <p class="ka-hint-p small">Handcrafted with ♥ at 30,000 feet of altitude, some point between Madrid and Berlin</p>\n      </div>\n    ';
    }
  }, {
    key: 'selectDay',

    // Select a day from the agenda
    // dayId the identifier of this day. May include a hash
    value: function selectDay(dayId) {
      dayId = this.days.filter(function (day) {
        return day.id == dayId;
      }).length ? dayId : this.days[0].id + '';
      this.selectedDayId = dayId;

      var dayTableModel = this.models[dayId];
      if (!dayTableModel) {
        var selectedDay = this.days.filter(function (day) {
          return day.id == dayId;
        })[0];
        dayTableModel = this.models[dayId] = new _AgendaDayTableModel.AgendaDayTableModel(selectedDay);
      }

      // mark selected tab
      Array.prototype.forEach.call(this.element.querySelectorAll('.ka-tab-a'), function (a) {
        // .toggle(className, value) does not work in IE 10
        a.classList[a.getAttribute('data-day-id') === dayId ? 'add' : 'remove']('selected');
      });

      // render table
      this.element.querySelector('.kworkspace').innerHTML = new _AgendaDayTemplate.AgendaDayTemplate(dayTableModel).render();

      this.pushState(dayTableModel.name, dayId);
    }
  }, {
    key: 'selectTalk',

    // render a talk as modal window, by hash
    // returns the talk if found, otherwise undefined
    value: function selectTalk(hash, fadeInClass) {
      var talk = this.talksByHash[hash];
      if (talk) {

        if (this.selectedTalkHash) {
          this.unselectTalk();
        }

        var $a = document.querySelector('.ka-talk-title[data-hash="' + hash + '"]');
        var $cellContent = this.$cellContent = (0, _util.closest)($a, '.ka-table-td');
        var rect = $cellContent.getBoundingClientRect();
        var tableModel = this.getSelectedTableModel();

        this.selectedTalkHash = hash;
        this.selectedTalkCoords = tableModel.getCoords(talk.id);

        //$cellContent.classList.add('selected')
        new _TalkDetailsPopup.TalkDetailsPopup({
          talk: talk.contents,
          tagColors: this.tagColors
        }).render();
        this.pushState(talk.title, hash);
      }
      return talk;
    }
  }, {
    key: 'getSelectedTableModel',
    value: function getSelectedTableModel() {
      return this.models[this.selectedDayId];
    }
  }, {
    key: 'rowForDetails',

    // calculate the TR to insert a new row after. It depends on the value of rowspan
    value: function rowForDetails($td) {
      var rowSpan = parseInt($td.getAttribute('rowSpan') || '1');
      var $tr = $td.parentElement;
      for (var i = 1; i < rowSpan; i++) {
        $tr = $tr.nextElementSibling;
      }
      return $tr;
    }
  }, {
    key: 'pushState',

    // add the status to the location hash
    value: function pushState(title, hash) {
      if (typeof history !== 'undefined' && history.pushState) {
        history.pushState({}, title, location.pathname + location.search + '#' + hash);
      }
    }
  }, {
    key: 'unselectTalk',
    value: function unselectTalk() {
      this.selectedTalkHash = undefined;
      this.selectedTalkCoords = undefined;
      var $selected = document.querySelector('.ka-table-td.selected');
      $selected && $selected.classList.remove('selected');
      var $details = document.querySelector('.ka-talk-details-window');
      if ($details) {
        $details.parentNode.removeChild($details);
        this.pushState(this.models[this.selectedDayId].name, this.selectedDayId);
      }
      document.querySelector('.ka-overlay').classList.add('ka-hidden');
    }
  }, {
    key: 'scrollToTalk',
    value: function scrollToTalk(talk) {
      if (talk && talk.contents) {
        var $element = document.querySelector('.ka-talk-title[data-id="' + talk.contents.id + '"]');
        $element && $element.scrollIntoView(true);
      }
    }
  }, {
    key: 'onClick',
    value: function onClick(event) {
      var target = event.target;
      if (target && event.button == 0 && !event.ctrlKey && !event.metaKey) {
        var classList = target.classList;
        if (classList.contains('ka-talk-title')) {
          event.preventDefault();
          if ((0, _util.closest)(target, '.selected')) {
            this.unselectTalk();
          } else {
            var hash = target.getAttribute('href').substring(1);
            var talk = this.selectTalk(hash);
          }
        } else if (classList.contains('ka-tab-a')) {
          event.preventDefault();
          this.selectDay(target.getAttribute('data-day-id'));
        } else if (classList.contains('ka-close') || classList.contains('ka-overlay')) {
          this.unselectTalk();
        }
      }
    }
  }, {
    key: 'onClose',
    value: function onClose() {
      this.unselectTalk();
    }
  }, {
    key: 'onKeyPress',
    value: function onKeyPress(event) {
      if (this.selectedTalkHash && !event.altKey && !event.ctrlKey && !event.shiftKey) {
        var keyCode = event.keyCode;
        if (keyCode == 27) {
          this.modal.close();
        }

        var rowDelta = keyCode == 38 ? -1 : keyCode == 40 ? 1 : 0;
        var colDelta = keyCode == 37 ? -1 : keyCode == 39 ? 1 : 0;
        if (rowDelta || colDelta) {
          var fadeInClass = rowDelta == -1 ? 'up' : rowDelta == 1 ? 'down' : colDelta == -1 ? 'left' : colDelta == 1 ? 'right' : '';
          var talk = this.getSelectedTableModel().findTalk(this.selectedTalkCoords, { rowDelta: rowDelta, colDelta: colDelta });
          if (talk) {
            this.selectTalk(talk.contents.hash, fadeInClass);
            event.preventDefault();
          }
        }
      }
    }
  }]);

  return AgendaView;
})();

;

exports.AgendaView = AgendaView;
// JSON for the C4P
// contents of the agenda as JSON

},{"./AgendaDayTableModel":1,"./AgendaDayTemplate":2,"./TalkDetailsPopup":4,"./util":7}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _stringutils = require('./stringutils');

var _util = require('./util');

var TalkDetailsPopup = (function () {
  function TalkDetailsPopup(_ref) {
    var talk = _ref.talk;
    var tagColors = _ref.tagColors;

    _classCallCheck(this, TalkDetailsPopup);

    this.talk = talk;
    this.tagColors = tagColors;
  }

  _createClass(TalkDetailsPopup, [{
    key: 'render',
    value: function render() {

      var talk = this.talk;
      var html = '\n      <div class="ka-talk-details-window">\n        <a class="ka-close" title="close"></a>\n        <div class="ka-talk-details-viewport">\n          <div class="ka-talk-details-inner">\n            <div class="ka-talk-details-contents">\n              <h2 class="ka-talk-details-title">' + talk.title + '</h2>\n              <div class="ka-talk-details-description">' + (0, _stringutils.formatMarkdown)(talk.description) + '</div>\n              ' + this.renderTags(talk.tags) + '\n            </div>\n            <ul class="ka-avatars">\n              ' + talk.authors.map(this.renderAuthor).join('') + '\n            </ul>\n          </div>\n        </div>\n      </div>\n    ';
      document.body.insertAdjacentHTML('beforeend', html);
      document.querySelector('.ka-overlay').classList.remove('ka-hidden');
    }
  }, {
    key: 'renderTags',
    value: function renderTags() {
      var _this = this;

      var tags = this.talk.tags;
      if (!tags) {
        return '';
      }
      return '<div class="ka-tags">' + Object.keys(tags).map(function (category) {
        return tags[category].map(function (tag) {
          return '<span class="tag tag' + _this.tagColors[category] + '">' + tag + '</span>';
        }).join(' ');
      }).join(' ') + '</div>';
    }
  }, {
    key: 'renderAuthor',
    value: function renderAuthor(_ref2) {
      var id = _ref2.id;
      var uuid = _ref2.uuid;
      var name = _ref2.name;
      var avatar = _ref2.avatar;
      var description = _ref2.description;

      return '\n      <li class="ka-avatar-li ka-avatar-and-text">\n        <a href="https://www.koliseo.com/' + uuid + '" class="ka-avatar-container">\n          <span style="display:table-row">\n            <img class="ka-avatar-img" src="' + avatar + '">\n            <span class="ka-author-name">' + name + '</a>\n          </span>\n        </a>\n        <div class="ka-author-data">\n          <div class="ka-author-description">' + (0, _stringutils.formatMarkdown)(description) + '</div>\n        </div>\n      </li>\n    ';
    }
  }]);

  return TalkDetailsPopup;
})();

;

exports.TalkDetailsPopup = TalkDetailsPopup;

},{"./stringutils":6,"./util":7}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _AgendaView = require('./AgendaView');

window.Koliseo = window.Koliseo || {};
Koliseo.agenda = {};

/**

  Renders an agenda.

*/
Koliseo.agenda.render = function (_ref) {
  var c4pUrl = _ref.c4pUrl;
  var agendaUrl = _ref.agendaUrl;
  var element // {String} The element to use to render the agenda
  = _ref.element;

  // todo: add error handling
  // todo: add proper argument assertions

  var useCors = location.hostname !== 'www.koliseo.com' && location.hostname !== 'localhost';
  var fetchOptions = {
    credentials: 'same-origin',
    mode: 'cors',
    headers: {
      accept: 'application/json'
    }
  };
  agendaUrl = agendaUrl || c4pUrl + '/agenda';

  Promise.all([fetch(c4pUrl, fetchOptions), fetch(agendaUrl, fetchOptions)]).then(function (_ref2) {
    var _ref22 = _slicedToArray(_ref2, 2);

    var c4pResponse = _ref22[0];
    var agendaResponse = _ref22[1];

    return Promise.all([c4pResponse.json(), agendaResponse.json()]);
  }).then(function (_ref3) {
    var _ref32 = _slicedToArray(_ref3, 2);

    var c4p = _ref32[0];
    var agenda = _ref32[1];

    new _AgendaView.AgendaView({
      c4p: c4p,
      agenda: agenda,
      element: element
    }).render();
  })['catch'](function (e) {
    console.log(e);
  });
};
exports['default'] = Koliseo.agenda;
module.exports = exports['default'];
// {String} URL to retrieve the C4P
// {String} URL to retrieve the list of talks

},{"./AgendaView":3}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#x27;'
},
    escapeRegEx = new RegExp('[' + Object.keys(entityMap).join('') + ']', 'g');

/**
  Process all links and replace them by HTML links
*/
function formatLinks(s) {

  // regex extracted from
  // http://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript
  // http://stackoverflow.com/questions/700163/detecting-a-naughty-or-nice-url-or-link-in-a-text-string

  // our format: "http://foo.bar (texto opcional del enlace)"
  return !s ? '' : s.replace(escapeRegEx, function (match) {
    // copiado de underscore.escape, porque no queremos escapar la barra '/' sino sólo el resto
    return entityMap[match];
  }).replace(/(((https?:\/\/[^\s\/]+)|([^\s]+\.(aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel)))((\/|\?)[^\s]+)?)(\s+(\([^\)]+\)))?/g, function (a, path) {
    var label = arguments[9];
    var href = path.match(/https?:\/\//) ? path : 'http://' + path;
    var content = label && label.substring(1, label.length - 1) || path;
    return '<a rel="nofollow" href="' + href + '" target="_blank">' + content + '</a>';
  });
}

function formatLightweightMarkdown(s) {
  return !s ? '' : formatLinks(s).replace(/(^|\s)\*([^\s][^*]*)\*/g, ' <b>$2</b>').replace(/(^|\s)\/([^\s][^\/]*)\//g, ' <i>$2</i>').replace(/(^|\s)`([^\s][^`]*)`/g, ' <code>$2</code>');
}

function formatMarkdown(s) {
  return formatLightweightMarkdown(s)
  // <li>
  .replace(/^\* (.*)$/gm, '<li>$1</li>')
  // <ul>
  .replace(/((<li>.*<\/li>\n)+)/gm, '<ul>$1</ul>')
  // headers
  .replace(/^######(.*)$/gm, '<h6>$1</h6>').replace(/^#####(.*)$/gm, '<h5>$1</h5>').replace(/^####(.*)$/gm, '<h4>$1</h4>').replace(/^###(.*)$/gm, '<h3>$1</h3>').replace(/^##(.*)$/gm, '<h2>$1</h2>').replace(/^#(.*)$/gm, '<h1>$1</h1>')
  // remove empty lines
  .replace(/^\s*[\n\r]/gm, '')
  // <p>
  .replace(/^([^<].*)$/gm, '<p>$1</p>');
}

exports.formatMarkdown = formatMarkdown;
exports.formatLightweightMarkdown = formatLightweightMarkdown;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};

function transitionClassFunc() {
  var _ref = arguments[0] === undefined ? {} : arguments[0];

  var _ref$removeClass = _ref.removeClass;
  var removeClass = _ref$removeClass === undefined ? false : _ref$removeClass;

  return function (el) {
    var className = arguments[1] === undefined ? "active" : arguments[1];

    if (removeClass) {
      if (!el.classList.contains(className)) return Promise.resolve();
    } else {
      if (el.classList.contains(className)) return Promise.resolve();
    }

    return new Promise(function (resolve) {
      var listener = function listener(event) {
        if (event.target != el) return;
        el.removeEventListener("webkitTransitionEnd", listener);
        el.removeEventListener("transitionend", listener);
        resolve();
      };

      el.addEventListener("webkitTransitionEnd", listener);
      el.addEventListener("transitionend", listener);
      requestAnimationFrame(function (_) {
        el.classList[removeClass ? "remove" : "add"](className);
      });
    });
  };
};

exports["default"] = {

  transitionTo: transitionClassFunc(),

  transitionFrom: transitionClassFunc({ removeClass: true }),

  // transform a string into a single element
  strToEl: (function () {
    var tmpEl = document.createElement("div");
    return function (str) {
      var r;
      tmpEl.innerHTML = str;
      r = tmpEl.children[0];
      while (tmpEl.firstChild) {
        tmpEl.removeChild(tmpEl.firstChild);
      }
      return r;
    };
  })(),

  escapeHtml: function escapeHTML(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  },

  escapeHtmlTag: function escapeHtmlTag(strings) {
    for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      values[_key - 1] = arguments[_key];
    }

    values = values.map(exports.escapeHtml);
    return strings.reduce(function (str, val, i) {
      return str += val + (values[i] || "");
    }, "");
  },

  closest: function closest(el, selector) {
    if (el.closest) {
      return el.closest(selector);
    }

    var matches = el.matches || el.msMatchesSelector || el.webkitMatchesSelector;

    do {
      if (el.nodeType != 1) continue;
      if (matches.call(el, selector)) return el;
    } while (el = el.parentNode);

    return undefined;
  },

  debug: function debug() {
    console.log.apply(console, arguments);
  }

};
module.exports = exports["default"];

},{}],8:[function(require,module,exports){
/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
}

module.exports = last;

},{}],9:[function(require,module,exports){
var baseEach = require('../internal/baseEach'),
    createFind = require('../internal/createFind');

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is bound to `thisArg` and
 * invoked with three arguments: (value, index|key, collection).
 *
 * If a property name is provided for `predicate` the created `_.property`
 * style callback returns the property value of the given element.
 *
 * If a value is also provided for `thisArg` the created `_.matchesProperty`
 * style callback returns `true` for elements that have a matching property
 * value, else `false`.
 *
 * If an object is provided for `predicate` the created `_.matches` style
 * callback returns `true` for elements that have the properties of the given
 * object, else `false`.
 *
 * @static
 * @memberOf _
 * @alias detect
 * @category Collection
 * @param {Array|Object|string} collection The collection to search.
 * @param {Function|Object|string} [predicate=_.identity] The function invoked
 *  per iteration.
 * @param {*} [thisArg] The `this` binding of `predicate`.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.result(_.find(users, function(chr) {
 *   return chr.age < 40;
 * }), 'user');
 * // => 'barney'
 *
 * // using the `_.matches` callback shorthand
 * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
 * // => 'pebbles'
 *
 * // using the `_.matchesProperty` callback shorthand
 * _.result(_.find(users, 'active', false), 'user');
 * // => 'fred'
 *
 * // using the `_.property` callback shorthand
 * _.result(_.find(users, 'active'), 'user');
 * // => 'barney'
 */
var find = createFind(baseEach);

module.exports = find;

},{"../internal/baseEach":12,"../internal/createFind":30}],10:[function(require,module,exports){
/**
 * A specialized version of `_.some` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],11:[function(require,module,exports){
var baseMatches = require('./baseMatches'),
    baseMatchesProperty = require('./baseMatchesProperty'),
    bindCallback = require('./bindCallback'),
    identity = require('../utility/identity'),
    property = require('../utility/property');

/**
 * The base implementation of `_.callback` which supports specifying the
 * number of arguments to provide to `func`.
 *
 * @private
 * @param {*} [func=_.identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function baseCallback(func, thisArg, argCount) {
  var type = typeof func;
  if (type == 'function') {
    return thisArg === undefined
      ? func
      : bindCallback(func, thisArg, argCount);
  }
  if (func == null) {
    return identity;
  }
  if (type == 'object') {
    return baseMatches(func);
  }
  return thisArg === undefined
    ? property(func)
    : baseMatchesProperty(func, thisArg);
}

module.exports = baseCallback;

},{"../utility/identity":55,"../utility/property":56,"./baseMatches":21,"./baseMatchesProperty":22,"./bindCallback":27}],12:[function(require,module,exports){
var baseForOwn = require('./baseForOwn'),
    createBaseEach = require('./createBaseEach');

/**
 * The base implementation of `_.forEach` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object|string} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./baseForOwn":16,"./createBaseEach":28}],13:[function(require,module,exports){
/**
 * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
 * without support for callback shorthands and `this` binding, which iterates
 * over `collection` using the provided `eachFunc`.
 *
 * @private
 * @param {Array|Object|string} collection The collection to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @param {boolean} [retKey] Specify returning the key of the found element
 *  instead of the element itself.
 * @returns {*} Returns the found element or its key, else `undefined`.
 */
function baseFind(collection, predicate, eachFunc, retKey) {
  var result;
  eachFunc(collection, function(value, key, collection) {
    if (predicate(value, key, collection)) {
      result = retKey ? key : value;
      return false;
    }
  });
  return result;
}

module.exports = baseFind;

},{}],14:[function(require,module,exports){
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for callback shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromRight) {
  var length = array.length,
      index = fromRight ? length : -1;

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;

},{}],15:[function(require,module,exports){
var createBaseFor = require('./createBaseFor');

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iteratee functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./createBaseFor":29}],16:[function(require,module,exports){
var baseFor = require('./baseFor'),
    keys = require('../object/keys');

/**
 * The base implementation of `_.forOwn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"../object/keys":52,"./baseFor":15}],17:[function(require,module,exports){
var toObject = require('./toObject');

/**
 * The base implementation of `get` without support for string paths
 * and default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path of the property to get.
 * @param {string} [pathKey] The key representation of path.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path, pathKey) {
  if (object == null) {
    return;
  }
  if (pathKey !== undefined && pathKey in toObject(object)) {
    path = [pathKey];
  }
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[path[index++]];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./toObject":44}],18:[function(require,module,exports){
var baseIsEqualDeep = require('./baseIsEqualDeep'),
    isObject = require('../lang/isObject'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` without support for `this` binding
 * `customizer` functions.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
}

module.exports = baseIsEqual;

},{"../lang/isObject":50,"./baseIsEqualDeep":19,"./isObjectLike":41}],19:[function(require,module,exports){
var equalArrays = require('./equalArrays'),
    equalByTag = require('./equalByTag'),
    equalObjects = require('./equalObjects'),
    isArray = require('../lang/isArray'),
    isTypedArray = require('../lang/isTypedArray');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = objToString.call(object);
    if (objTag == argsTag) {
      objTag = objectTag;
    } else if (objTag != objectTag) {
      objIsArr = isTypedArray(object);
    }
  }
  if (!othIsArr) {
    othTag = objToString.call(other);
    if (othTag == argsTag) {
      othTag = objectTag;
    } else if (othTag != objectTag) {
      othIsArr = isTypedArray(other);
    }
  }
  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && !(objIsArr || objIsObj)) {
    return equalByTag(object, other, objTag);
  }
  if (!isLoose) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
    }
  }
  if (!isSameTag) {
    return false;
  }
  // Assume cyclic values are equal.
  // For more information on detecting circular references see https://es5.github.io/#JO.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == object) {
      return stackB[length] == other;
    }
  }
  // Add `object` and `other` to the stack of traversed objects.
  stackA.push(object);
  stackB.push(other);

  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

  stackA.pop();
  stackB.pop();

  return result;
}

module.exports = baseIsEqualDeep;

},{"../lang/isArray":47,"../lang/isTypedArray":51,"./equalArrays":31,"./equalByTag":32,"./equalObjects":33}],20:[function(require,module,exports){
var baseIsEqual = require('./baseIsEqual'),
    toObject = require('./toObject');

/**
 * The base implementation of `_.isMatch` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Array} matchData The propery names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = toObject(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var result = customizer ? customizer(objValue, srcValue, key) : undefined;
      if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;

},{"./baseIsEqual":18,"./toObject":44}],21:[function(require,module,exports){
var baseIsMatch = require('./baseIsMatch'),
    getMatchData = require('./getMatchData'),
    toObject = require('./toObject');

/**
 * The base implementation of `_.matches` which does not clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    var key = matchData[0][0],
        value = matchData[0][1];

    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === value && (value !== undefined || (key in toObject(object)));
    };
  }
  return function(object) {
    return baseIsMatch(object, matchData);
  };
}

module.exports = baseMatches;

},{"./baseIsMatch":20,"./getMatchData":35,"./toObject":44}],22:[function(require,module,exports){
var baseGet = require('./baseGet'),
    baseIsEqual = require('./baseIsEqual'),
    baseSlice = require('./baseSlice'),
    isArray = require('../lang/isArray'),
    isKey = require('./isKey'),
    isStrictComparable = require('./isStrictComparable'),
    last = require('../array/last'),
    toObject = require('./toObject'),
    toPath = require('./toPath');

/**
 * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to compare.
 * @returns {Function} Returns the new function.
 */
function baseMatchesProperty(path, srcValue) {
  var isArr = isArray(path),
      isCommon = isKey(path) && isStrictComparable(srcValue),
      pathKey = (path + '');

  path = toPath(path);
  return function(object) {
    if (object == null) {
      return false;
    }
    var key = pathKey;
    object = toObject(object);
    if ((isArr || !isCommon) && !(key in object)) {
      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
      if (object == null) {
        return false;
      }
      key = last(path);
      object = toObject(object);
    }
    return object[key] === srcValue
      ? (srcValue !== undefined || (key in object))
      : baseIsEqual(srcValue, object[key], undefined, true);
  };
}

module.exports = baseMatchesProperty;

},{"../array/last":8,"../lang/isArray":47,"./baseGet":17,"./baseIsEqual":18,"./baseSlice":25,"./isKey":39,"./isStrictComparable":42,"./toObject":44,"./toPath":45}],23:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],24:[function(require,module,exports){
var baseGet = require('./baseGet'),
    toPath = require('./toPath');

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new function.
 */
function basePropertyDeep(path) {
  var pathKey = (path + '');
  path = toPath(path);
  return function(object) {
    return baseGet(object, path, pathKey);
  };
}

module.exports = basePropertyDeep;

},{"./baseGet":17,"./toPath":45}],25:[function(require,module,exports){
/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  start = start == null ? 0 : (+start || 0);
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = (end === undefined || end > length) ? length : (+end || 0);
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],26:[function(require,module,exports){
/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}],27:[function(require,module,exports){
var identity = require('../utility/identity');

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (thisArg === undefined) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

module.exports = bindCallback;

},{"../utility/identity":55}],28:[function(require,module,exports){
var getLength = require('./getLength'),
    isLength = require('./isLength'),
    toObject = require('./toObject');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    var length = collection ? getLength(collection) : 0;
    if (!isLength(length)) {
      return eachFunc(collection, iteratee);
    }
    var index = fromRight ? length : -1,
        iterable = toObject(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./getLength":34,"./isLength":40,"./toObject":44}],29:[function(require,module,exports){
var toObject = require('./toObject');

/**
 * Creates a base function for `_.forIn` or `_.forInRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var iterable = toObject(object),
        props = keysFunc(object),
        length = props.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      var key = props[index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{"./toObject":44}],30:[function(require,module,exports){
var baseCallback = require('./baseCallback'),
    baseFind = require('./baseFind'),
    baseFindIndex = require('./baseFindIndex'),
    isArray = require('../lang/isArray');

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new find function.
 */
function createFind(eachFunc, fromRight) {
  return function(collection, predicate, thisArg) {
    predicate = baseCallback(predicate, thisArg, 3);
    if (isArray(collection)) {
      var index = baseFindIndex(collection, predicate, fromRight);
      return index > -1 ? collection[index] : undefined;
    }
    return baseFind(collection, predicate, eachFunc);
  };
}

module.exports = createFind;

},{"../lang/isArray":47,"./baseCallback":11,"./baseFind":13,"./baseFindIndex":14}],31:[function(require,module,exports){
var arraySome = require('./arraySome');

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing arrays.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var index = -1,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
    return false;
  }
  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index],
        result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

    if (result !== undefined) {
      if (result) {
        continue;
      }
      return false;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (isLoose) {
      if (!arraySome(other, function(othValue) {
            return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
          })) {
        return false;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
      return false;
    }
  }
  return true;
}

module.exports = equalArrays;

},{"./arraySome":10}],32:[function(require,module,exports){
/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    stringTag = '[object String]';

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag) {
  switch (tag) {
    case boolTag:
    case dateTag:
      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
      return +object == +other;

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case numberTag:
      // Treat `NaN` vs. `NaN` as equal.
      return (object != +object)
        ? other != +other
        : object == +other;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings primitives and string
      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
      return object == (other + '');
  }
  return false;
}

module.exports = equalByTag;

},{}],33:[function(require,module,exports){
var keys = require('../object/keys');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isLoose) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  var skipCtor = isLoose;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key],
        result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;

    // Recursively compare objects (susceptible to call stack limits).
    if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
      return false;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (!skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      return false;
    }
  }
  return true;
}

module.exports = equalObjects;

},{"../object/keys":52}],34:[function(require,module,exports){
var baseProperty = require('./baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./baseProperty":23}],35:[function(require,module,exports){
var isStrictComparable = require('./isStrictComparable'),
    pairs = require('../object/pairs');

/**
 * Gets the propery names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = pairs(object),
      length = result.length;

  while (length--) {
    result[length][2] = isStrictComparable(result[length][1]);
  }
  return result;
}

module.exports = getMatchData;

},{"../object/pairs":54,"./isStrictComparable":42}],36:[function(require,module,exports){
var isNative = require('../lang/isNative');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

module.exports = getNative;

},{"../lang/isNative":49}],37:[function(require,module,exports){
var getLength = require('./getLength'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

module.exports = isArrayLike;

},{"./getLength":34,"./isLength":40}],38:[function(require,module,exports){
/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

},{}],39:[function(require,module,exports){
var isArray = require('../lang/isArray'),
    toObject = require('./toObject');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  var type = typeof value;
  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
    return true;
  }
  if (isArray(value)) {
    return false;
  }
  var result = !reIsDeepProp.test(value);
  return result || (object != null && value in toObject(object));
}

module.exports = isKey;

},{"../lang/isArray":47,"./toObject":44}],40:[function(require,module,exports){
/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],41:[function(require,module,exports){
/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],42:[function(require,module,exports){
var isObject = require('../lang/isObject');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;

},{"../lang/isObject":50}],43:[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('./isIndex'),
    isLength = require('./isLength'),
    keysIn = require('../object/keysIn');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = !!length && isLength(length) &&
    (isArray(object) || isArguments(object));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = shimKeys;

},{"../lang/isArguments":46,"../lang/isArray":47,"../object/keysIn":53,"./isIndex":38,"./isLength":40}],44:[function(require,module,exports){
var isObject = require('../lang/isObject');

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

module.exports = toObject;

},{"../lang/isObject":50}],45:[function(require,module,exports){
var baseToString = require('./baseToString'),
    isArray = require('../lang/isArray');

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `value` to property path array if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Array} Returns the property path array.
 */
function toPath(value) {
  if (isArray(value)) {
    return value;
  }
  var result = [];
  baseToString(value).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
}

module.exports = toPath;

},{"../lang/isArray":47,"./baseToString":26}],46:[function(require,module,exports){
var isArrayLike = require('../internal/isArrayLike'),
    isObjectLike = require('../internal/isObjectLike');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && isArrayLike(value) &&
    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
}

module.exports = isArguments;

},{"../internal/isArrayLike":37,"../internal/isObjectLike":41}],47:[function(require,module,exports){
var getNative = require('../internal/getNative'),
    isLength = require('../internal/isLength'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var arrayTag = '[object Array]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

module.exports = isArray;

},{"../internal/getNative":36,"../internal/isLength":40,"../internal/isObjectLike":41}],48:[function(require,module,exports){
var isObject = require('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

module.exports = isFunction;

},{"./isObject":50}],49:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isObjectLike = require('../internal/isObjectLike');

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isNative;

},{"../internal/isObjectLike":41,"./isFunction":48}],50:[function(require,module,exports){
/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],51:[function(require,module,exports){
var isLength = require('../internal/isLength'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dateTag] = typedArrayTags[errorTag] =
typedArrayTags[funcTag] = typedArrayTags[mapTag] =
typedArrayTags[numberTag] = typedArrayTags[objectTag] =
typedArrayTags[regexpTag] = typedArrayTags[setTag] =
typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
}

module.exports = isTypedArray;

},{"../internal/isLength":40,"../internal/isObjectLike":41}],52:[function(require,module,exports){
var getNative = require('../internal/getNative'),
    isArrayLike = require('../internal/isArrayLike'),
    isObject = require('../lang/isObject'),
    shimKeys = require('../internal/shimKeys');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = getNative(Object, 'keys');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  var Ctor = object == null ? undefined : object.constructor;
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && isArrayLike(object))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

module.exports = keys;

},{"../internal/getNative":36,"../internal/isArrayLike":37,"../internal/shimKeys":43,"../lang/isObject":50}],53:[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('../internal/isIndex'),
    isLength = require('../internal/isLength'),
    isObject = require('../lang/isObject');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || isArguments(object)) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"../internal/isIndex":38,"../internal/isLength":40,"../lang/isArguments":46,"../lang/isArray":47,"../lang/isObject":50}],54:[function(require,module,exports){
var keys = require('./keys'),
    toObject = require('../internal/toObject');

/**
 * Creates a two dimensional array of the key-value pairs for `object`,
 * e.g. `[[key1, value1], [key2, value2]]`.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the new array of key-value pairs.
 * @example
 *
 * _.pairs({ 'barney': 36, 'fred': 40 });
 * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
 */
function pairs(object) {
  object = toObject(object);

  var index = -1,
      props = keys(object),
      length = props.length,
      result = Array(length);

  while (++index < length) {
    var key = props[index];
    result[index] = [key, object[key]];
  }
  return result;
}

module.exports = pairs;

},{"../internal/toObject":44,"./keys":52}],55:[function(require,module,exports){
/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],56:[function(require,module,exports){
var baseProperty = require('../internal/baseProperty'),
    basePropertyDeep = require('../internal/basePropertyDeep'),
    isKey = require('../internal/isKey');

/**
 * Creates a function that returns the property value at `path` on a
 * given object.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': { 'c': 2 } } },
 *   { 'a': { 'b': { 'c': 1 } } }
 * ];
 *
 * _.map(objects, _.property('a.b.c'));
 * // => [2, 1]
 *
 * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
}

module.exports = property;

},{"../internal/baseProperty":23,"../internal/basePropertyDeep":24,"../internal/isKey":39}]},{},[5])


//# sourceMappingURL=koliseo-agenda.js.map