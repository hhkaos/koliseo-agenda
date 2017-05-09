import { h, render, Component } from 'preact';
import { AgendaDayView } from './AgendaDayView';
import TalkDialog from './TalkDialog';

/**
 * Displays an entire agenda, including multiple days
 * Properties: 
 * callForPapers: {CallForPapers} The data about the call for papers ofd this agenda
 * agenda: {Agenda} the agenda to render
 * user: {User} the current user
 */
export default class AgendaView extends Component {

  constructor(props) {
    super(props);
    const { callForPapers } = props;

    this.pageTitle = document.title;
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    const dayId = e.target.getAttribute('data-day-id');
    AgendaActions.selectDay(agendaModel.daysById[dayId]);
  }



  // renders the tabs and content around our table
  render() {
    return (
      <div>
        { this.renderDayTabs() }
        <div className="kworkspace">
          <AgendaDayView day={this.state.selectedDay} />
        </div>
        <div className="ka-hint">
          <a href="http://koliseo.com" target="_blank" className="ka-logo"></a>
          <p className="ka-hint-p small">Handcrafted with ♥ in a couple of places scattered around Europe</p>
        </div>
      </div>
    )
  }

  // render the tabs to move between days
  renderDayTabs() {
    const days = this.props.agenda.getDaysArray();
    if (days.length == 1) {
      return <h2 className="kday-title">{days[0].name}</h2>;
    }

    return (
      <nav className="ka-tabs">
        { this.renderUserInfo() }
        {
          this.agenda.getDaysArray().map(({ id, name }) => {
            const className = id == (this.state.selectedDay? 'selected ' : '' ) + 'ka-tab-a'
            return (
              <div className="ka-tab-li" key={id}>
                <a className={className} data-day-id={id} href={'#' + id}>{name}</a>
              </div>
            )
          })
        }
      </nav>
    )
  }

  // render the user info and login/logout button
  // if there is no OAuth client ID, does not show anything at all
  renderUserInfo() {
    const user = this.user;
    if (user.readOnly) {
      return undefined;
    }
    return (
      <div className="ka-right" id="ka-user-info">
        {
          user.isAnonymous() ?
            <button className="ka-button">Sign in</button> :
            <button className="ka-button ka-button-secondary">Sign out</button>
        }
      </div>
    )
  }

/*
  // calculate the TR to insert a new row after. It depends on the value of rowspan
  rowForDetails($td) {
    const rowSpan = parseInt($td.getAttribute('rowSpan') || '1');
    let $tr = $td.parentElement;
    for (var i = 1; i < rowSpan; i++) {
      $tr = $tr.nextElementSibling;
    }
    return $tr;
  }
*/

};
