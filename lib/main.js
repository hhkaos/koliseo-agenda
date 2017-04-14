import AgendaView from './AgendaView'

import KoliseoAPI from './KoliseoAPI'

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
}) {

  const fetchOptions = {
    credentials: 'same-origin',
    mode: 'cors',
    headers: {
      accept: 'application/json'
    }
  };

  agendaUrl = agendaUrl || (c4pUrl + '/agenda');

  Promise.all([
    fetch(c4pUrl, fetchOptions),
    fetch(agendaUrl, fetchOptions),
    KoliseoAPI.init({ c4pUrl, oauthClientId })
  ]).then(([ c4pResponse, agendaResponse ]) => {
    return Promise.all([
      c4pResponse.json(), agendaResponse.json()
    ])
  }).then(([ c4p, agenda ]) => {
    Koliseo.agenda.model = agenda;
    function renderView() {
      new AgendaView({
        c4p: c4p,
        agenda: agenda,
        userLikes: userLikes,
        element: element
      }).render();
    }
    renderView();
    KoliseoAPI.onLogout(renderView());
  }).catch(e => {
    console.log(e);
  });
}
export default Koliseo.agenda;
