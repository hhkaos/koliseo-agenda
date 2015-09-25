import { AgendaView } from './AgendaView'

window.Koliseo = window.Koliseo || {};
Koliseo.agenda = {};

/**

  Renders an agenda.

*/
Koliseo.agenda.render = function({
  c4pUrl,  // {String} URL to retrieve the C4P
  agendaUrl,  // {String} URL to retrieve the list of talks
  element  // {String} The element to use to render the agenda
}) {

  // todo: add error handling
  // todo: add proper argument assertions

  const fetchOptions = {
    credentials: 'include',
    mode: 'cors'
  };

  Promise.all([
    fetch(c4pUrl, fetchOptions),
    fetch(agendaUrl, fetchOptions)
  ]).then(([ c4pResponse, agendaResponse ]) => {
    return Promise.all([
      c4pResponse.json(), agendaResponse.json()
    ])
  }).then(([ c4p, agenda ]) => {
    new AgendaView({
      c4p: c4p,
      agenda: agenda,
      element: element
    }).render();
  }).catch(e => {
    console.log(e);
  });
}
export default Koliseo.agenda;
