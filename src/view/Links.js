import { h, render, Component } from 'preact';

/**
 * Render the slides. If the link is undefined, does not render anything
 */
export function SlidesLink({ href, title }) {
  return href && (
    <a href={href} target="_blank" className="ka-social-link" title={"Slides of " + title}>
      <span className="ka-icon ka-icon-slides" />
      Slides
    </a>
  )
}

/**
 * Render the link to the video. If the link is undefined, does not render anything
 */
export function VideoLink({ href, title }) {
  return href && (
    <a href={href} target="_blank" className="ka-social-link" title={ "Video of " + title }>
      <span className="ka-icon ka-icon-video"/>
      Video
    </a>
  )
}

