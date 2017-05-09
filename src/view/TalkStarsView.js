import { h, render, Component } from 'preact';

/**
 * Render a bar with stars
 * Can be used to show the star average or to enter rating input from the user
 * Properties:
 * feedback {Talk.feedback, required} feedback to display
 * user {User, required} current user
 */
export default class TalkFeedbackStars extends Component {

  constructor({ feedback }) {
    super();
    this.onClick = this.onClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.state = {
      width: feedback.ratingAverage
    }
  }

  renderLinks(isEditing) {
    return [1, 2, 3, 4, 5].map((star) => {
      return <a 
        data-rating={star} 
        key={star}
        className={ `ka-star ka-star-${star}` } 
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
      />
    });
  }

  onMouseLeave() {
    setState({
      width: this.props.feedback.ratingAverage
    })
  }

  onMouseOver(e) {
    let width = e.target.dataset.rating;
    setState({
      width: rating
    })
  }

  onClick(e) {
    let rating = e.target.dataset.rating;
    const feedback = new TalkFeedbackStars(this.props.feedback);
    feedback.rating = rating;
    FeedbackActions.onChange(feedback);
  }

  render() {
    const feedback = this.props.feedback;
    const width = (this.state.width * 100 / 5) + '%';
    const isEditing = feedback.user.id == this.props.user.id;
    
    return (
      <div className="ka-star-rating" onClick={isEditing? this.onClick : undefined }>
        <span className="ka-star-bar" style={{ width }}></span>
        { !isEditing? undefined : this.renderLinks() }
      </div>
    )
  }

}