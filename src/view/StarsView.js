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

// render a small view with the stars
export function SmallView({ rating, entriesCount, onClick }) {
  return (
    <a className="ka-social-link" title={`${rating} out of ${entriesCount} votes`} onClick={onClick}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 104.853 100" 
        className="ka-icon with-label"
        >
        <path className="ka-icon-star" d="M104.853 38.713c0 .903-.564 1.92-1.693 3.048L80.248 63.996l5.418 31.49c.113.34.113.79.113 1.355 0 1.693-.904 3.047-2.484 3.047-.79.113-1.693-.113-2.596-.677L52.37 84.312 24.153 99.21c-1.015.564-1.805.79-2.595.79-1.58 0-2.596-1.693-2.596-3.16 0-.34 0-.79.112-1.355l5.418-31.49L1.58 41.76C.564 40.633 0 39.617 0 38.714c0-1.58 1.13-2.596 3.5-2.934L35.1 31.263l14.22-28.668C50.113.903 51.13 0 52.37 0c1.242 0 2.258.903 3.16 2.596l14.11 28.668 31.602 4.515c2.37.337 3.61 1.353 3.61 2.933z" />
      </svg>
      { rating }
    </a>
  )
}