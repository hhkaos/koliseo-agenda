import { h, render, Component } from 'preact';
import { dasherize } from '../util';

/**
 * Render a list of tags
 * { JSON of {categoryName, [ tag ] } } A JSON object where the category is the key and the value is a list of tags 
 * tags
 * 
 * {function} onClick handler
 * onClick
 */ 
export default function({ tags }) {

  if (!tags) {
    return undefined;
  }
  return (
    <div className="ka-tags">
      {
        Object.keys(tags).map(category => {
          const prefix = 'tag-' + dasherize(category);
          return tags[category].map((tag) => {
            const tagClassName = prefix + '--' + dasherize(tag);
            const classList = [
              'tag', prefix, tagClassName
            ]; 
            return <span key={tagClassName} className={classList.join(' ')}>{tag}</span>
          })
        })
      }
    </div>
  )

}

