import AgendaDay from './AgendaDay';

export default class Agenda {


  constructor(agenda) {

    this.feedbackEnabled =- agenda.feedbackEnabled;

    // all talks indexed by "dayId/talkId"
    this.cellsByHash = {};

    // the agenda table data, indexed by agendaDay.id
    this.daysById = {};
    agenda.days.forEach((day) => {
      this.daysById[day.id] = new AgendaDay(day, this.cellsByHash);
    })

  }

  // return the list of days 
  getDaysArray() {
    return Object.keys(this.daysById).map(k => this.daysById[k]);
  }

}