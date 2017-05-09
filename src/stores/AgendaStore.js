import alt from '../alt';
import Store from 'alt-ng/Store';
import AgendaActions from '../actions/AgendaActions';

class AgendaStore extends Store {

  constructor() {
    super();
    this.state = {
      // the model/Agenda instance
      // agenda: undefined,

      // the currently selected day
      // selectedDay: undefined,

      // the currently selected talk
      // selectedTalk: undefined,

      // a list of tags and associated color
      // tagColors: undefined
    }
    this.bindActions(AgendaActions);

  }

  load({ callForPapers, agenda }) {
    this.setState({
      callForPapers,
      agenda,
      selectedDay: undefined,
      selectedTalk: undefined,
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
    this.setState({
      selectedDay: daysById[dayId] || daysById[Object.keys(daysById)[0] + ''],
      selectedTalk: undefined
    });
  }

  // render a talk as modal window, by hash
  // returns the talk if found, otherwise undefined
  selectTalkByHash(hash) {
    const talk = this.getAgenda().talksByHash[hash];
    this.setState({
      selectedTalk: talk
    });
    talk && this.pushState(talk.title, hash);
  }

  unselectTalk() {
    this.setState({
      selectedTalk: undefined
    });
    const selectedDay = this.state.selectedDay;
    selectedDay && this.pushState(selectedDay.name, selectedDay.id);
  }

  // add the state to the location hash
  pushState(title, hash) {
    if (typeof history !== 'undefined' && history.pushState) {
      history.pushState({}, title, location.pathname + location.search + '#' + hash);
    }
  }

};

export default alt.createStore('AgendaStore', new AgendaStore());