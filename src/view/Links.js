import { h, render, Component } from 'preact';

/**
 * The SVG character for an external link
 */
export function ExternalFlag() {
  return (
    <svg 
      viewBox="0 0 1792 1792" 
      xmlns="http://www.w3.org/2000/svg"
      className="ka-external-flag"
    >
      <path d="M1408 928v320q0 119-84.5 203.5t-203.5 84.5h-832q-119 0-203.5-84.5t-84.5-203.5v-832q0-119 84.5-203.5t203.5-84.5h704q14 0 23 9t9 23v64q0 14-9 23t-23 9h-704q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113v-320q0-14 9-23t23-9h64q14 0 23 9t9 23zm384-864v512q0 26-19 45t-45 19-45-19l-176-176-652 652q-10 10-23 10t-23-10l-114-114q-10-10-10-23t10-23l652-652-176-176q-19-19-19-45t19-45 45-19h512q26 0 45 19t19 45z" />
    </svg>
  ) 
}

/**
 * Render the slides. If the link is undefined, does not render anything
 */
export function SlidesLink({ href, children }) {
  return href && (
    <a href={href} target="_blank" rel="noopener" className="ka-social-link" title="Click here to go to the slides">
      <svg xmlns="http://www.w3.org/2000/svg" 
      class="ka-icon" 
      viewBox="0 0 108.333 100">
        <path className="ka-icon-slides" d="M83.333 87.5q0-1.693-1.237-2.93t-2.93-1.237q-1.692 0-2.93 1.237Q75 85.807 75 87.5t1.237 2.93q1.237 1.237 2.93 1.237 1.692 0 2.93-1.237 1.236-1.237 1.236-2.93zm16.667 0q0-1.693-1.237-2.93t-2.93-1.237q-1.692 0-2.93 1.237-1.236 1.237-1.236 2.93t1.237 2.93q1.237 1.237 2.93 1.237 1.692 0 2.93-1.237Q100 89.193 100 87.5zm8.333-14.583V93.75q0 2.604-1.823 4.427-1.823 1.823-4.427 1.823H6.25q-2.604 0-4.427-1.823Q0 96.354 0 93.75V72.917q0-2.605 1.823-4.427 1.823-1.823 4.427-1.823h30.273l8.79 8.854q3.776 3.647 8.854 3.647 5.078 0 8.854-3.646l8.855-8.853h30.208q2.605 0 4.427 1.823 1.823 1.823 1.823 4.427zm-21.16-37.045q1.108 2.67-.91 4.558L57.096 69.596q-1.172 1.237-2.93 1.237-1.757 0-2.93-1.237L22.07 40.43q-2.018-1.888-.91-4.558 1.106-2.54 3.84-2.54h16.667V4.168q0-1.693 1.237-2.93T45.834 0H62.5q1.693 0 2.93 1.237t1.237 2.93v29.166h16.666q2.735 0 3.84 2.54z" />
      </svg>
      {children}
    </a>
  )
}

/**
 * Render the link to the video. If the link is undefined, does not render anything
 */
export function VideoLink({ href, title, children }) {
  return href && (
    <a href={href} target="_blank" rel="noopener" className="ka-social-link external" title="Click here to go to the slides">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="ka-icon" 
        viewBox="0 -15 140 115">
        <path className="ka-icon-video" d="M140 7.5v85q0 3.28-3.047 4.61-1.016.39-1.953.39-2.11 0-3.516-1.484L100 64.53V77.5q0 9.297-6.602 15.898Q86.798 100 77.5 100h-55q-9.297 0-15.898-6.602Q0 86.798 0 77.5v-55q0-9.297 6.602-15.898Q13.202 0 22.5 0h55q9.297 0 15.898 6.602Q100 13.202 100 22.5v12.89l31.484-31.406Q132.89 2.5 135 2.5q.938 0 1.953.39Q140 4.22 140 7.5z"  />
      </svg>
      { children }
    </a>
  )
}

// render a small view with the stars
export function StarLink({ rating, entriesCount, onClick }) {
  return (
    <a className="ka-social-link" title={`${rating} out of ${entriesCount} votes`} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 104.853 100"
        className="ka-icon with-label"
      >
        <path className="ka-icon-star" d="M104.853 38.713c0 .903-.564 1.92-1.693 3.048L80.248 63.996l5.418 31.49c.113.34.113.79.113 1.355 0 1.693-.904 3.047-2.484 3.047-.79.113-1.693-.113-2.596-.677L52.37 84.312 24.153 99.21c-1.015.564-1.805.79-2.595.79-1.58 0-2.596-1.693-2.596-3.16 0-.34 0-.79.112-1.355l5.418-31.49L1.58 41.76C.564 40.633 0 39.617 0 38.714c0-1.58 1.13-2.596 3.5-2.934L35.1 31.263l14.22-28.668C50.113.903 51.13 0 52.37 0c1.242 0 2.258.903 3.16 2.596l14.11 28.668 31.602 4.515c2.37.337 3.61 1.353 3.61 2.933z" />
      </svg>
      {rating}
    </a>
  )
}