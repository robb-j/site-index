const Koa = require('koa')
const Router = require('koa-router')
const Yaml = require('yaml').default
const pug = require('pug')
const fs = require('fs')
const { promisify } = require('util')
const { join } = require('path')

const readFile = promisify(fs.readFile)
const resolve = path => join(__dirname, path)

const render = pug.compileFile(resolve('index.pug'))
const favicon = fs.readFileSync(resolve('favicon.png'))

/** Loads the sites.yml */
async function getSitesSpec () {
  const data = await readFile(resolve('sites.yml'))
  return Yaml.parse(data.toString('utf8'))
}

/** Validates a sites spec */
function validateSites (sitesSpec) {
  try {
    // Ensure it is an object
    if (typeof sitesSpec !== 'object') throw new Error('Not an object')

    // Ensure there is a sites array
    const { sites } = sitesSpec
    if (!Array.isArray(sites)) throw new Error('sites is not an Array')
    if (sites.length === 0) throw new Error('no sites defined')

    // Ensure each site has a link, name & info string
    sites.forEach((site, i) => {
      const id = `sites[${i}]`
      if (typeof site !== 'object') throw new Error(`${id} is not an object`)

      const { link, name, info } = site
      if (typeof link !== 'string') throw new Error(`${id}.link isn't a string`)
      if (typeof name !== 'string') throw new Error(`${id}.name isn't a string`)
      if (typeof info !== 'string') throw new Error(`${id}.info isn't a string`)
    })
  } catch (error) {
    throw new Error(`sites.yml ${error.message}`)
  }
}

// Setup an app with a catch all route to serve the rendered index file
const app = new Koa()
const router = new Router()

// Add a route to generate an index.html from the sites.yml
router.get('/', async ctx => {
  try {
    const sites = await getSitesSpec()
    validateSites(sites)
    ctx.body = await render(sites)
  } catch (error) {
    console.error(error)
    ctx.body = 'Something went wrong'
  }
})

// Add a route for the favicon
router.get('/favicon.png', async ctx => {
  ctx.set('Content-Type', 'image/png')
  ctx.body = favicon
})

// Add the router to koa & start it on port 3000
app.use(router.routes())
  .use(router.allowedMethods())
  .listen(3000)
console.log('Listening on :3000')
