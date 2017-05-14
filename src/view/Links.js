import { h, render, Component } from 'preact';

/**
 * Render the slides. If the link is undefined, does not render anything
 */
export function SlidesLink({ href, title }) {
  return href && (
    <a href={href} target="_blank" rel="noopener" className="ka-social-link" title={"Slides of " + title}>
      <svg xmlns="http://www.w3.org/2000/svg" 
      class="ka-icon" 
      viewBox="0 0 108.333 100">
        <path className="ka-icon-slides" d="M83.333 87.5q0-1.693-1.237-2.93t-2.93-1.237q-1.692 0-2.93 1.237Q75 85.807 75 87.5t1.237 2.93q1.237 1.237 2.93 1.237 1.692 0 2.93-1.237 1.236-1.237 1.236-2.93zm16.667 0q0-1.693-1.237-2.93t-2.93-1.237q-1.692 0-2.93 1.237-1.236 1.237-1.236 2.93t1.237 2.93q1.237 1.237 2.93 1.237 1.692 0 2.93-1.237Q100 89.193 100 87.5zm8.333-14.583V93.75q0 2.604-1.823 4.427-1.823 1.823-4.427 1.823H6.25q-2.604 0-4.427-1.823Q0 96.354 0 93.75V72.917q0-2.605 1.823-4.427 1.823-1.823 4.427-1.823h30.273l8.79 8.854q3.776 3.647 8.854 3.647 5.078 0 8.854-3.646l8.855-8.853h30.208q2.605 0 4.427 1.823 1.823 1.823 1.823 4.427zm-21.16-37.045q1.108 2.67-.91 4.558L57.096 69.596q-1.172 1.237-2.93 1.237-1.757 0-2.93-1.237L22.07 40.43q-2.018-1.888-.91-4.558 1.106-2.54 3.84-2.54h16.667V4.168q0-1.693 1.237-2.93T45.834 0H62.5q1.693 0 2.93 1.237t1.237 2.93v29.166h16.666q2.735 0 3.84 2.54z" />
      </svg>
    </a>
  )
}

/**
 * Render the link to the video. If the link is undefined, does not render anything
 */
export function VideoLink({ href, title }) {
  return href && (
    <a href={href} target="_blank" rel="noopener" className="ka-social-link" title={ "Video of " + title }>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="ka-icon" 
        viewBox="0 -15 140 115">
        <path className="ka-icon-video" d="M140 7.5v85q0 3.28-3.047 4.61-1.016.39-1.953.39-2.11 0-3.516-1.484L100 64.53V77.5q0 9.297-6.602 15.898Q86.798 100 77.5 100h-55q-9.297 0-15.898-6.602Q0 86.798 0 77.5v-55q0-9.297 6.602-15.898Q13.202 0 22.5 0h55q9.297 0 15.898 6.602Q100 13.202 100 22.5v12.89l31.484-31.406Q132.89 2.5 135 2.5q.938 0 1.953.39Q140 4.22 140 7.5z"  />
      </svg>
    </a>
  )
}

