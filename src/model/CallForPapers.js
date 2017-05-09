
// creating this class right now because it seems likely to be necessary in the future
export default class CallForPapers {

  constructor(props) {
    const { tagCategories } = props;
    Object.assign(this, props);

    // a JSON object with all the tag categories and the corresponding color
    this.tagColors = {};
    tagCategories && Object.keys(tagCategories).forEach((tagCategoryName, index) => this.tagColors[tagCategoryName] = index);

  }

}