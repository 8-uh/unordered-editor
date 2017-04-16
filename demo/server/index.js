import React from 'react'
import {renderToString} from 'react-dom/server'
import {Provider} from 'react-redux'
import {StaticRouter, matchPath} from 'react-router-dom'
import {renderRoutes} from 'react-router-config'
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
  const {path, query} = ctx.request
  try {
    ctx.body = await renderFullPage(path, query)
  } catch (e) {
    ctx.body = e.message
  }
  next && await next()
})

const HTML = ({content, store}) => (
  <html>
    <head>
      <meta charSet='UTF-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0' />
      <title>U-WEB</title>
      <link rel='stylesheet' href={isProduction ? '/style.css' : `//${config.ipv4}:${config.webpackPort}/style.css`} />
    </head>
    <body>
      <div id='root' dangerouslySetInnerHTML={{__html: content}} />
      {store && <script dangerouslySetInnerHTML={{__html: `window.__INITIAL_STATE__=${JSON.stringify(store.getState())};`}} />}
      <script src={isProduction ? '/common.js' : `//${config.ipv4}:${config.webpackPort}/common.js`} />
      <script src={isProduction ? '/vender.js' : `//${config.ipv4}:${config.webpackPort}/vender.js`} />
      <script src={isProduction ? '/app.js' : `//${config.ipv4}:${config.webpackPort}/app.js`} />
    </body>
  </html>
)

async function renderFullPage (path, query) {
  return new Promise((resolve, reject) => {
    const store = configureStore({})
    const promises = []
    const mapRoutes = (routes) => {
      routes.map(route => {
        if (route.component) {
          const match = matchPath(path, route)
          if (match) {
            if (route.component.loadData) {
              promises.push({match: match, loadData: route.component.loadData})
            }
            if (route.routes) {
              mapRoutes(route.routes)
            }
          }
        }
      })
    }
    mapRoutes(routes)
    promises.map(i => i.loadData({store}))
    store.stopSaga()
    store.rootTask.done.then(() => {
      const context = {}
      const markup = renderToString(
        <Provider store={store}>
          <StaticRouter location={path} context={context}>
            {renderRoutes(routes)}
          </StaticRouter>
        </Provider>
      )
      resolve(renderToString(<HTML content={markup} store={store} />))
    })
  })
}

server.listen(config.serverPort, () => {
  console.log(`server is listening on port ${config.serverPort}`)
})
