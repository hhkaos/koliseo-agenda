import alt from '../alt';
import Store from 'alt-ng/Store';
import AgendaActions from '../actions/AgendaActions';
import HistoryAdapter from '../controller/HistoryAdapter';

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
    }
    this.bindActions(AgendaActions);

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

  unselectTalk() {
    document.body.classList.remove('no-scroll');
    this.setState({
      selectedCell: undefined
    });
    const day = this.state.selectedDay;
    HistoryAdapter.replaceState({ title: day.name, hash: day.id });
  }

};

export default alt.createStore('AgendaStore', new AgendaStore());