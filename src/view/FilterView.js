import { h, render, Component } from 'preact';
import { dasherize } from '../util';
import FilterActions from '../actions/FilterActions';

function TagsFieldsetView({categoryName, tags, selectedTags, onClick}) {

  const prefix = 'tag-' + dasherize(categoryName);
  return (
    <fieldset className="ka-filter-fieldset" onClick={onClick}>
      <legend>{categoryName}</legend>
      {
        tags.map(tag => {
          const tagClassName = prefix + '--' + dasherize(tag);
          const classList = [
            'tag', prefix, tagClassName
          ];
          (selectedTags.indexOf(tag) != -1) && classList.push('selected');
          return (
            <span 
              key={tagClassName} 
              className={classList.join(' ')}
              data-category={categoryName}
              data-tag={tag}
            >
              {tag}
            </span>
          )
        })
      }
    </fieldset>

  )

}

/**
 * Displays a filter 
 * 
 * {Filter, required} the filter in use
 * filter
 * 
 * {JSON of categoryName, [tags]} the list of tags that can be used
 */
export default class FilterView extends Component {

  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick({ target }) {
    if (target.classList.contains('tag')) {
      const { category, tag } = target.dataset;
      FilterActions.toggleFilterTag({ category, tag }); 
    }
  }
  
  // categoryName: {String} the name of this category
  renderTagFieldSets(tagCategories, selectedTagCategories) {
    return Object.keys(tagCategories).map((categoryName) => {
      return (
        <TagsFieldsetView 
          key={categoryName}
          categoryName={categoryName}
          tags={tagCategories[categoryName].tags}
          selectedTags={selectedTagCategories[categoryName] || []}
          onClick={this.onClick}
        />
      )
    })
  }

  render() {
    const { filter, tagCategories } = this.props;
    const { query, tags } = filter;
    return (
      <form className="ka-filter-form">
        <div className="ka-filter-query-container">
          <input type="text" className="ka-filter-input" value={query} placeholder="Click here to search" />
          <button type="submit" className="ka-button primary">Search</button>
        </div>
        { this.renderTagFieldSets(tagCategories, tags) }
      </form>
    )
  }

}
