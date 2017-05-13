import renderAgenda from './view/AgendaView';
import KoliseoAPI from './controller/KoliseoAPI';
import { h, render, Component } from 'preact';

const glob = typeof global !== 'undefined'? global : window;
glob.Koliseo = glob.Koliseo || {};
Koliseo.agenda = {
  render: function ({ 
    // element where we will render the agenda
    element, 
    ...options 
  }) {
    KoliseoAPI.init(options);
    renderAgenda({ element, ...options }).catch(e => {
      console.error(e, e.stack);
      render(
        <div className="ka-messages">
          <div className="ka-message alert">
            {e.message}
          </div>
        </div>, 
        element
      );
    });
  }
}
