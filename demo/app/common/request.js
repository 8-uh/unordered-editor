import 'fetch-everywhere'

export default {
  get: (url, data) => baseRequest(url, 'get', data),
  post: (url, data) => baseRequest(url, 'post', data),
  put: (url, data) => baseRequest(url, 'put', data),
  delete: (url, data) => baseRequest(url, 'delete', data)
}

async function baseRequest (url, method, data) {
  const isForm = typeof window !== 'undefined' ? data instanceof window.FormData : false
  await sleep(500)
  const options = {
    method: method.toUpperCase(),
    credentials: 'include',
    timeout: 5000,
    headers: {
      'Accept': 'application/json'
    }
  }
  if (!isForm) {
    options.headers['Content-Type'] = 'application/json'
  }

  if (options.method !== 'GET' && options.method !== 'DELETE') {
    if (data) options.body = isForm ? data : JSON.stringify(data)
  } else {
    if (data) {
      url = `${url}?${Object.keys(data).map(i => `${i}=${data[i]}`).join('&')}`
    }
  }

  return new Promise(async (resolve, reject) => {
    try {
      const fetch = typeof window !== 'undefined' ? window.fetch : global.fetch
      const res = await fetch(url, options)
      if (res.status === 401) {
        // Event.dispatch('UNAUTHORIZED')
      }
      const contentType = res.headers.get('content-type')
      if (contentType.indexOf('application/json') !== -1) {
        const json = await res.json()
        if (res.status !== 200) {
          const firstKey = (json && Object.keys(json)[0]) || ''
          json._message = (json && firstKey && json[firstKey]) || '处理错误信息失败'
        }
        resolve({
          status: res.status,
          json
        })
      } else if (contentType.indexOf('text/plain') !== -1) {
        const text = await res.text()
        resolve({
          status: res.status >= 300 ? res.status : 400,
          json: {
            _message: `不支持返回的数据 ${text}`
          }
        })
      } else {
        resolve({
          status: 400,
          json: {
            _message: '处理返回数据失败'
          }
        })
      }
    } catch (e) {
      resolve({
        status: 400,
        json: {
          _message: `处理返回数据失败 ${e.message}`
        }
      })
    } finally {
    }
  })
}

async function sleep (time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(null)
    }, time)
  })
}
