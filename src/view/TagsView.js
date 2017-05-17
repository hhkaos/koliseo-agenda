import { h, render, Component } from 'preact';
import { dasherize } from '../util';

/**
 * Render a list of tags
 * { JSON of {categoryName, [ tag ] } } A JSON object where the category is the key and the value is a list of tags 
 * tags
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
          return tags[category].map(tag => {
            const className = 'tag ' + prefix + ' ' + prefix + '--' + dasherize(tag); 
            return <span key={className} className={className}>{tag}</span>
          })
        })
      }
    </div>
  )

}