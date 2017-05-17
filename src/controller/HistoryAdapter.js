import AgendaActions from '../actions/AgendaActions';

function isTalkHash(hash) {
  return hash.includes('/');
}

export default {

  // add the state to the location hash
  // title: {String} Title of the web page
  // hash: hash of the web page
  pushState({ title, hash }) {
    history.pushState({}, title, location.pathname + location.search + '#' + hash);
  },

  replaceState({ title, hash }) {
    history.replaceState({}, title, location.pathname + location.search + '#' + hash);
  },

  popState() {
    const hash = location.hash.substring(1);
    if (hash) {
      if (isTalkHash(hash)) {
        AgendaActions.selectTalkByHash(hash);
      } else {
        AgendaActions.selectDayById(hash);
      }
    }
  },

  initState(agenda, hash) {
    const isTalk = isTalkHash(hash);
    const dayId = isTalk ? /#([^\/]+)\/(.+)?/.exec(hash)[1] : hash;

    const agendaDay = agenda.daysById[dayId] || agenda.getDaysArray()[0]
    AgendaActions.selectDayById(agendaDay.id);
    
    if (isTalk) {
      AgendaActions.selectTalkByHash(hash);
    }
      //HistoryAdapter.pushState({ title: agendaDay.name, hash: agendaDay.id });

  }


}