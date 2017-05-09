import renderAgenda from './view/AgendaView';
import KoliseoAPI from './controller/KoliseoAPI';

const glob = typeof global !== 'undefined'? global : window;
glob.Koliseo = glob.Koliseo || {};
Koliseo.agenda = {
  render: function ({ c4pUrl, element, oauthClientId }) {
    KoliseoAPI.init({ c4pUrl, oauthClientId });
    renderAgenda(element).catch(e => {
      console.error(e);
    });
  }
}
