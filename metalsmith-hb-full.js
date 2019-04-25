var Handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');

module.exports = function(options) {
  var config = {
    partials: null,
    target: /\.(hbs)$/,
    instance: null
  }

  Object.assign(config, options)

  if (!config.instance)
    throw new Error('Metalsmith-handlebars requires a Handlebars instance')

  return function metalsmithHandlebarsFull(files, metalsmith, done) {
    const meta = metalsmith.metadata();
    const fileList = Object.keys(files)

    if (config.partials) {
      fileList
        .filter(p => new RegExp(config.partials).test(p))
        .forEach(p => {
          const contents = fs.readFileSync(path.join(metalsmith.source(), p), {encoding: 'utf-8'})
          const partialName = path.join(path.dirname(p), path.basename(p, path.extname(p))).match(new RegExp(config.partials + '(.*)'))[1]
          config.instance.registerPartial(partialName, contents)
        })
    }

    if (config.helpers) {
      config.instance.registerHelper(config.helpers);
    }

    fileList
      .filter(p => config.target.test(p) && !new RegExp(config.partials).test(p))
      .forEach(p => {
        const helpers = Object.assign({}, config.instance.helpers)
        const current = files[p]
        let template = config.instance.compile(current.contents.toString());
        const data = Object.assign({}, meta, {
          page: current,
          meta: meta
        });

        delete data.page.contents;

        current.contents = Buffer.from(template(data));
        files[
          path.join(
            path.dirname(p),
            path.basename(p, path.extname(p)) + '.html'
          )
        ] = current
        delete files[p];
      });
      console.log(metalsmith.metadata())
    done();
  };
}