import { h, render, Component } from 'preact';
import PropTypes from 'prop-types';

/**
 * Render a bar with stars
 * Can be used to show the star average or to enter rating input from the user
 * 
 * {number, required} the rating to display (0-5)
 * rating
 * 
 * {boolean} true if this component is editable
 * editable
 * 
 */
export default class StarsView extends Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.state = {
      width: props.rating
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
      width: this.props.rating
    })
  }

  onMouseOver(e) {
    let width = e.target.dataset.rating;
    this.setState({
      width: rating
    })
  }

  onClick(e) {
    let rating = e.target.dataset.rating;
    FeedbackActions.onChange({attribute: 'rating', value: rating });
  }

  render() {
    const { editable } = this.props;
    const { currentUser } = this.context;

    const width = (this.state.width * 100 / 5) + '%';
    
    return (
      <div className="ka-star-rating" onClick={editable? this.onClick : undefined }>
        <span className="ka-star-bar" style={{ width }}></span>
        { !editable? undefined : this.renderLinks() }
      </div>
    )
  }

}

