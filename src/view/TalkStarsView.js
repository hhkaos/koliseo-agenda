
// render a bar with stars
// can be used to show the star average or to enter rating input from the user
export default class TalkFeedbackStars {

  constructor({ 
    // {TalkFeedback} the feedback to display
    talkFeedback, 
    // {User} the current user
    user 
  }) {
    this.feedback = feedback;
    this.user = user; 
  }

  renderLinks() {
    return [1, 2, 3, 4, 5].map((star) => {
      return `<a data-rating="${star}" title="${star} ${star > 1 ? 'stars' : 'star'}" class="ka-star ka-star-${star}"></a>`;
    }).join('');
  }

  render() {
    const feedback = this.feedback;
    const width = feedback.ratingAverage * 100 / 5;
    const isEditing = feedback.user.id == this.user.id;
    
    return `
      <div class="ka-star-rating">
        <span class="ka-star-bar" style="width: ${width}%"></span>
        ${!isEditing ? '' : this.renderLinks()}
      </div>
    `
  }

}