import AgendaDayModel from './AgendaDayModel';

/**
  @property {int} this.selectedDayId the index of the selected day
  @property {int} this.selectedTalkHash the index
 */
export default class Agenda {


  constructor(agenda) {

    // listeners for change events
    this.listeners = {

      // triggered when the selected day changes
      daySelect: [],

      // triggered when selected talk changes
      talkSelect: []

    };

    // all talks indexed by dayId/talkId
    this.talksByHash = {};

    // the agenda table data, indexed by agendaDay.id
    this.daysById = {};
    agenda.days.forEach((day) => {
      const dayModel = new AgendaDayModel(day);
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

  // Select a day from the agenda
  // dayId the identifier of this day. May include a hash
  selectDay(dayId) {
    const day = this.daysById[dayId] || this.daysById[Object.keys(this.daysById)[0] + '']
    this.selectedDayId = day.id;
    trigger('daySelect', this.models[dayId]);
  }

  selectTalk(hash) {
    const talk = this.talksByHash[hash];
    if (talk) {

      if (this.selectedTalkHash) {
        this.unselectTalk();
      }

    }

  }

  // trigger a given event
  trigger(eventName, data) {
    this.listeners[eventName].forEach(listener => listener(data));
  }

  // listen to the provided event
  on(eventName, listener) {
    this.listeners[eventName].push(listener);
  }

}