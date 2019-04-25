var Metalsmith = require("metalsmith");
var handlebars = require('handlebars');
var minifyHTML = require("metalsmith-html-minifier");
var sitemap = require("metalsmith-sitemap");
var uglify = require("metalsmith-uglify");
var ignore = require("metalsmith-ignore");
var hbs = require('./metalsmith-hb-full')
var data = require('metalsmith-data');

var openGraph = {
  site_name: 'GetSimple CMS',
  title: 'GetSimple CMS',
  image: 'http://get-simple.info/GSSW/gssw_assets/images/getsimple-banner.png',
  type: 'product',
  description: 'GetSimple has everything you client needs, and nothing a CMS doesn\'t'
}

var site = Metalsmith(__dirname);

site
  .source("./src")
  .destination("./dist")
  .clean(true)
  .metadata({
    author: "Chris Cagle",
    sitename: "GetSimple CMS",
    siteurl: "https://webketje.com",
    description: "GetSimple is an open source Simple CMS that utilizes the speed and convenience of flat file XML, a best-in-class UI and the easiest learning curve of any lite Content Management System out there. It requires no database and has a powerful plugin system that allows for unlimited expansion.",
    keywords: "simple management, getsimple, content management system, cms, simple, no database,flat file,xml",
    generatorname: "Metalsmith",
    generatorurl: "http://metalsmith.io/",
    robots: 'index, follow',
    og: openGraph,
    nav: [
      {id: 'home', title: 'home', url: '/'},
      {id: 'about', title: 'about', url: '/about'},
      {id: 'docs', title: 'docs', url: 'https://get-simple.info/wiki/'},
      {id: 'forum', title: 'community forum', url: 'https://get-simple.info/forums/'},
      {id: 'extend', title: 'add-ons', url: '/add-ons'},
      {id: 'download', title: 'download', url: '/download'},
      {id: 'contribute', title: 'contribute', url: '/contribute'}
    ]
  })
  .use(data({
    content: 'src/data/site.json'
  }))
  .use(hbs({
    partials: 'layouts/',
    instance: handlebars,
    helpers: {
      eq: (a, b) => a === b,
      not: (a, b) => a !== b
    }
  }))
  .use(uglify())
  //.use(markdown())
  /*.use(
    layouts({
      directory: "src/layouts",
      default: "default.hbs"
    })
  )
  .use(hbtmd(handlebars, {
     // pattern: '**\/*.md'
  }))
  .use(
    permalinks({
      relative: false,
      linksets: [
        {
          match: { collection: "pages" },
          pattern: ":page/:title"
        }
      ]
    })
  )
  .use(minifyHTML())*/
  .use(ignore(["layouts/**/*", "data/**/*"]))
  .use(
    sitemap({
      hostname: "http://localhost",
      pattern: ["**/*.html"],
      omitIndex: true,
      changefreq: "monthly"
    })
  )
  .build(function(err) {
    if (err) throw err;
  });