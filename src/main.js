
const glob = typeof global !== 'undefined'? global : window;
glob.Koliseo = glob.Koliseo || {};
Koliseo.agenda = {
  render: function(options) {
    return new AgendaController(options).init();
  }
}
export default Koliseo.agenda;
