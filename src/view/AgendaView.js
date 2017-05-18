import { h, render, Component } from 'preact';
import TalkDialog from './TalkDialog';
import AltContainer from 'alt-ng/AltContainer';
import AgendaStore from '../stores/AgendaStore';
import UserStore from '../stores/UserStore';
import AgendaActions from '../actions/AgendaActions';
import UserActions from '../actions/UserActions';
import KoliseoAPI from '../controller/KoliseoAPI';
import { LoginLogoutButton } from './Buttons';
import AgendaDayView from './AgendaDayView';
import ContextComponent from './ContextComponent';
import LoadingView from './LoadingView';
import TagStylesView from './TagStylesView';
import HistoryAdapter from '../controller/HistoryAdapter';
import FilterView from './FilterView';

/**
 * Displays an entire agenda, including multiple days
 * 
 * { CallForPapers, required } The data about the call for papers ofd this agenda
 * callForPapers
 * 
 * {Agenda, required } the agenda to render
 * agenda
 * 
 * {AgendaDay}  the currently selected day
 * selectedDay
 * 
 * {JSON of {categoryName, [tags] }, required} the tags extracted from the Call for Papers 
 * 
 */
class AgendaView extends Component {

  constructor(props) {
    super(props);
    const { callForPapers } = props;

    this.pageTitle = document.title;
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    const { dayId, dayName } = e.target.dataset;
    AgendaActions.selectDayById(dayId);
    HistoryAdapter.pushState({ title: dayName, hash: dayId });
  }

  // render the tabs to move between days
  renderDayTabs(agenda, selectedDay) {
    const days = agenda.getDaysArray();

    return (
      <nav className="ka-tabs">
        { this.renderUserInfo() }
        {
          days.length == 1? <h2 className="kday-title">{days[0].name}</h2>:
          agenda.getDaysArray().map(({ id, name }) => {
            const className = (id == selectedDay.id? 'selected ' : '' ) + 'ka-tab-a'
            return (
              <div className="ka-tab-li" key={id}>
                <a 
                  className={className} 
                  data-day-id={id} 
                  data-day-name={name} 
                  href={'#' + id} 
                  onClick={this.onClick}>{name}</a>
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
    return (
      <LoginLogoutButton />
    )
  }

  // renders the tabs and content around our table
  render() {
    const { agenda, selectedDay, filter, tagCategories } = this.props;
    return (
      <div>
        {this.renderDayTabs(agenda, selectedDay)}
        <div className="kworkspace">
          <FilterView filter={filter} tagCategories={tagCategories} totalFilteredTalks={selectedDay.totalFilteredTalks} />
          <AgendaDayView day={selectedDay} />
        </div>
        <div className="ka-hint">
          <a href="http://koliseo.com" target="_blank" rel="noopener" className="ka-logo"></a>
          <p className="ka-hint-p small">
            This agenda is a free service from <a href="http://koliseo.com" target="_blank" rel="noopener">koliseo.com</a>. Drop us a line if this sounds like something you need for your own events.
          </p>
        </div>
      </div>
    )
  }

}

// retrieve the agenda and data for this user, then render
export default function renderAgenda({ 
  element
}) {
  render(
    <LoadingView />,
    element
  );
  return Promise.all([AgendaActions.load(), UserActions.load()])
    .then(([ { callForPapers, agenda }, currentUser ]) => {

      if (!agenda.feedbackEnabled) {
        console.log('Agenda.feedbackEnabled is false. Feedback will be disabled.');
      }

      // back button behavior
      window.addEventListener('popstate', HistoryAdapter.popState);
      HistoryAdapter.initState(agenda, !location.hash? '' : location.hash.substring(1));

      render(
        <AltContainer store={UserStore}>
          <TagStylesView tagCategories={callForPapers.tagCategories} />
          <ContextComponent feedbackEnabled={agenda.feedbackEnabled}>
            <AltContainer store={AgendaStore}>
              <AgendaView tagCategories={callForPapers.tagCategories} />
              <TalkDialog />
            </AltContainer>
          </ContextComponent>
        </AltContainer>, 
        element, element.lastChild
      );

    })
}