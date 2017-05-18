import alt from '../alt';
import Store from 'alt-ng/Store';
import AgendaActions from '../actions/AgendaActions';
import FilterActions from '../actions/FilterActions';
import HistoryAdapter from '../controller/HistoryAdapter';
import Filter from '../model/Filter';

class AgendaStore extends Store {

  constructor() {
    super();
    this.state = {
      // the model/Agenda instance
      // agenda: undefined,

      // the currently selected day
      // selectedDay: undefined,

      // the currently selected talk
      // selectedCell: undefined,

      // the current filter
      filter: new Filter()
    }
    this.bindActions(AgendaActions);
    this.bindActions(FilterActions);
  }

  load({ callForPapers, agenda }) {
    this.setState({
      callForPapers,
      agenda,
      selectedDay: undefined,
      selectedCell: undefined,
    });
  }

  getAgenda() {
    return this.state.agenda;
  }

  like({ talkId, liked }) {
    todo();
  }

  // Select a day from the agenda
  // dayId the identifier of this day
  selectDayById(dayId) {
    const daysById = this.getAgenda().daysById;
    const selectedDay = daysById[dayId] || daysById[Object.keys(daysById)[0] + ''];
    this.setState({
      selectedDay: selectedDay,
      selectedCell: undefined
    });
  }

  // render a talk as modal window, by hash
  // returns the talk if found, otherwise undefined
  selectTalkByHash(hash) {
    const cell = this.getAgenda().cellsByHash[hash];
    this.setState({
      selectedCell: cell
    });
    document.body.classList.add('no-scroll');
  }

  // triggered by TalkDialog when closing the dialog. Unselects the talk being displayed
  unselectTalk() {
    document.body.classList.remove('no-scroll');
    this.setState({
      selectedCell: undefined
    });
    const day = this.state.selectedDay;
    HistoryAdapter.replaceState({ title: day.name, hash: day.id });
  }

  // the user selects/unselects a tag in the filter
  toggleFilterTag({ category, tag }) {
    const filter = this.state.filter;
    filter.toggleTag(category, tag);
    this.setFilter(filter);
  }

  // the user has entered a query and clicked submit
  submitFilter() {
    this.setFilter(this.state.filter);
  }

  // updates the query value, but does not triger a rerender
  onFilterQueryChange(query) {
    this.state.filter.query = query;
    this.setFilter(this.state.filter);
  }

  clearFilter() {
    this.setFilter(new Filter());
  }

  setFilter(filter) {
    const agenda = this.state.agenda;
    agenda.applyFilter(filter);
    this.setState({
      filter, //Object.assign({}, filter)
      agenda
    })

  }


};

export default alt.createStore('AgendaStore', new AgendaStore());