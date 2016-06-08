import { AgendaView } from './AgendaView'

import { Security } from './security'

import hello from 'hellojs';

window.Koliseo = window.Koliseo || {};
Koliseo.agenda = {};

/**

  Renders an agenda.

*/
Koliseo.agenda.render = function({
  c4pUrl,  // {String} URL to retrieve the C4P
  agendaUrl,  // {String} URL to retrieve the list of talks
  element,  // {String} The element to use to render the agenda
  oauthClientId, // {String} optional. The Koliseo OAuth client ID
  baseUrl // {String} optional. URL to make the security requests
}) {

  // todo: add error handling
  // todo: add proper argument assertions

  const useCors = location.hostname !== 'www.koliseo.com' && location.hostname !== 'localhost';
  const fetchOptions = {
    credentials: 'same-origin',
    mode: 'cors',
    headers: {
      accept: 'application/json'
    }
  };

  Koliseo.auth = new Security({c4pUrl, baseUrl, oauthClientId});

  agendaUrl = agendaUrl || (c4pUrl + '/agenda');

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
