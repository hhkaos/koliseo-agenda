import AgendaDay from './AgendaDay';

/**
  @property {int} this.selectedDayId the index of the selected day
  @property {int} this.selectedTalkHash the index
 */
export default class Agenda {


  constructor(agenda) {

    // all talks indexed by "dayId/talkId"
    this.talksByHash = {};

    // the agenda table data, indexed by agendaDay.id
    this.daysById = {};
    agenda.days.forEach((day) => {
      const dayModel = new AgendaDay(day);
      // this.days.push(dayModel);
      this.daysById[day.id] = dayModel;
      day.tracks.forEach((track) => {
        track.slots.forEach((slot) => {
          if (slot.contents && slot.contents.type === 'TALK') {
            const hash = slot.contents.hash = day.id + '/' + slot.id;
            this.talksByHash[hash] = slot;
          }
        })
      })
    })

  }

  // return the list of days 
  getDaysArray() {
    return Object.keys(this.daysById).map(k => this.daysById[k]);
  }

}