
// render a list of tags
export default function({ tags }) {

  const tagColors = this.context.tagColors;
  if (!tags) {
    return undefined;
  }
  return (
    <div className="ka-tags">
      {
        Object.keys(tags).map(category => {
          return tags[category].map(tag => <span key={category} className={'tag tag' + tagColors[category]}>{tag}</span>)
        })
      }
    </div>
  )

}