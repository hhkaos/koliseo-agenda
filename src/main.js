
const glob = typeof global !== 'undefined'? global : window;
glob.Koliseo = glob.Koliseo || {};
Koliseo.agenda = {
  render: function(options) {
    return new AgendaBootstrap(options).initAndRender().catch(e => {
      console.error(e);
    });
  }
}
export default Koliseo.agenda;
