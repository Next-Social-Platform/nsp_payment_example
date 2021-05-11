import fetch from 'node-fetch'

export interface FetchResult {
  error?: any
  result?: any
}

const fetchWithTimeout = (url, options, timeout = 10000) => {
  let { headerCallback = null, ignoreSSL = false, debug = false, ...rest } = options || {}

  return Promise.race([
    fetch(url, rest)
      .then((res) => {
        if (headerCallback && typeof headerCallback === 'function') {
          headerCallback(res.headers.raw())
        }
        let contentType = res.headers.get('Content-Type')
        
          if (debug) {
            return res.text().then((text) => {
              console.log('fetchWithTimeout debug text', text)
              return JSON.parse(text)
            })
          } else {
            return res.json()
          }
        
      })
      // .then((res) => res.json())
      .then((json) => {
        return { result: json }
      })
      .catch((error) => {
        return { error }
      }),
    new Promise((_, reject) => setTimeout(() => reject('Сервер хариу өгсөнгүй!'), timeout)).catch((error) => {
      return { error }
    }),
  ])
}

export default fetchWithTimeout
