// log the pageview with their URL
export const pageview = (url) => {
    let key = process.env.gakey
    window.gtag('config', key , {
      page_path: url,
    })
  }
  
  // log specific events happening.
  export const event = ({ action, params }) => {
    window.gtag('event', action, params)
  }
  