import { h, render, Component } from 'preact';

/**
 * Render the slides. If the link is undefined, does not render anything
 */
export function SlidesLink({ href, title }) {
  return href && <a href={href} target="_blank" className="icon-slideshare" title="Slides"><span className="sr-only">Slides of {title}</span></a>
}

/**
 * Render the link to the video. If the link is undefined, does not render anything
 */
export function VideoLink({ href, title }) {
  return href && <a href={href} target="_blank" className="icon-youtube-play" title="Video"><span className="sr-only">Video of {title}</span></a>
}

