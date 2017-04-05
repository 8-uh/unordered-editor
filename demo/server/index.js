import React from 'react'
import {renderToString} from 'react-dom/server'
import {Provider} from 'react-redux'
import {match, RouterContext, createMemoryHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import serialize from 'serialize-javascript'
import Koa from 'koa'
import KoaStaticCache from 'koa-static-cache'
import KoaConvert from 'koa-convert'
import path from 'path'

import routes from '../app/routes'
import configureStore from '../app/reducers/configureStore'
import config from './config'

const isProduction = process.env.NODE_ENV === 'production'

const server = new Koa()

server.use(KoaConvert(KoaStaticCache(path.resolve(__dirname, '../public'), {
  gzip: true,
  dynamic: true
})))

server.use(async (ctx, next) => {
  const {url, query} = ctx.request
  try {
    ctx.body = await renderFullPage(url, query)
  } catch (e) {
    ctx.body = e.message
  }
  next && await next()
})

const HTML = ({content, store}) => (
  <html>
    <head>
      <meta charSet='UTF-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no' />
      <title>U-WEB</title>
      <link rel='stylesheet' href={isProduction ? '/style.css' : `//${config.ipv4}:${config.webpackPort}/style.css`} />
    </head>
    <body>
      <div id='root' dangerouslySetInnerHTML={{__html: content}} />
      <script src='//cdn.bootcss.com/react/15.4.2/react-with-addons.js' />
      <script src='//cdn.bootcss.com/react/15.4.2/react-dom.js' />
      <script src='//cdn.bootcss.com/react-router/3.0.2/ReactRouter.js' />
      <script dangerouslySetInnerHTML={{__html: `window.__INITIAL_STATE__=${serialize(store.getState())};`}} />
      <script src={isProduction ? '/bundle.js' : `//${config.ipv4}:${config.webpackPort}/bundle.js`} />
    </body>
  </html>
)

async function renderFullPage (path, query) {
  return new Promise((resolve, reject) => {
    const memoryHistory = createMemoryHistory(path)
    let store = configureStore({}, memoryHistory)
    const history = syncHistoryWithStore(memoryHistory, store)
    match({history, routes, location: path}, (error, redirectLocation, renderProps) => {
      if (error) {
        reject(error)
        return
      }
      if (renderProps) {
        renderProps.location.query = query
        fetchData(renderProps, store).then(() => {
          store = configureStore(store.getState(), memoryHistory)
          const content = renderToString(
            <Provider store={store}>
              <RouterContext {...renderProps} />
            </Provider>
          )
          resolve(renderToString(<HTML content={content} store={store} />))
        }).catch((e) => {
          reject(e)
        })
      } else {
        throw new Error('no render props')
      }
    })
  })
}

function fetchData (renderProps, store) {
  const actions = renderProps.components.filter(i => i.fetchData).map(i => i.fetchData(renderProps)(store.dispatch, store.getState))
  return Promise.all(actions)
}

server.listen(config.serverPort, () => {
  console.log(`server is listening on port ${config.serverPort}`)
})
