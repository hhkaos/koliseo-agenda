import { h, render, Component } from 'preact';
import { dasherize } from '../util';
import FilterActions from '../actions/FilterActions';
import throttle from 'lodash.throttle';

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
    this.state = {
      focused: false
    }
    // do not filter with each key pulsation
    this.onInputChange = throttle(this.onInputChange.bind(this), 200);

    // wait for other things to happen (like if a talk or tag has been clicked)
    this.onInputBlur = throttle(this.onInputBlur.bind(this), 200, {leading: false});

    // normal event handlers
    ['onClick', 'onSubmit', 'onClear', 'onInputFocus'].forEach(method => this[method] = this[method].bind(this));
  }

  onClear() {
    FilterActions.clearFilter();
  }

  onClick({ target }) {
    if (target.classList.contains('tag')) {
      const { category, tag } = target.dataset;
      FilterActions.toggleFilterTag({ category, tag }); 
    }
  }

  onInputChange(e) {
    FilterActions.onFilterQueryChange(e.target.value);
  }

  onInputFocus() {
    this.setState({
      focused: true
    })
  }

  onInputBlur() {
    this.setState({
      focused: false
    })
  }

  onSubmit(e) {
    e.preventDefault();
    FilterActions.submitFilter();
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
    const { focused } = this.state;
    const { filter, tagCategories } = this.props;
    const { query, tags } = filter;
    const isEmpty = filter.isEmpty();
    return (
      <form className="ka-filter-form" onSubmit={this.onSubmit}>
        <div className="ka-filter-query-container">
          <input 
            type="text" 
            className="ka-filter-input" 
            value={query} 
            placeholder="Click here to filter"
            onInput={this.onInputChange}
            onFocus={this.onInputFocus}
            onBlur={this.onInputBlur}
          />
          <button type="submit" className="ka-button primary">
            <svg width="1792" height="1792" className="ka-icon" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1216 832q0-185-131.5-316.5t-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5 316.5-131.5 131.5-316.5zm512 832q0 52-38 90t-90 38q-54 0-90-38l-343-342q-179 124-399 124-143 0-273.5-55.5t-225-150-150-225-55.5-273.5 55.5-273.5 150-225 225-150 273.5-55.5 273.5 55.5 225 150 150 225 55.5 273.5q0 220-124 399l343 343q37 37 37 90z" /></svg>
            Search
          </button>
          {
            !isEmpty &&
            <button className="ka-button" onClick={this.onClear}>
              <svg width="1792" height="1792" className="ka-icon" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z" /></svg>
              Clear Filter
            </button>
          }
        </div>
        <div className={"ka-filter-tag-container" + (isEmpty && !focused? ' ka-collapsed' : '') }>
          { this.renderTagFieldSets(tagCategories, tags) }
        </div>
      </form>
    )
  }

}
