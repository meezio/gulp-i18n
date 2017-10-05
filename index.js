'use strict';


const Through = require('through2');
const MessageFormat = require('messageformat');
const Gutil = require('gulp-util');
const Yaml = require('js-yaml');
const Marked = require('marked');


module.exports = function (options) {

  options = options || {};
  options.locale = options.locale || /^([^\/]*).*$/;
  options.namespace = options.namespace || /^.*\/(.*)\.[^.]*$/;

  const locales = {};

  const parse = function (file, encoding, next) {

    const ext = file.relative.split('.').pop();
    const locale = file.relative.match(options.locale);
    const namespace = file.relative.match(options.namespace);
    const message = {
      locale: locale ? locale[1] : locale,
      namespace: namespace ? namespace[1] : namespace,
      data: null
    };

    try {
      if (ext === 'yml') {
        message.data = Yaml.safeLoad(file.contents.toString());
      }
      else {
        message.data = JSON.parse(file.contents.toString());
      }

      Object.keys(message.data || {}).forEach((key) => {

        // Convert Markdown to HTML if string contains new line char.
        if (message.data[key] && message.data[key].indexOf('\n') >= 0) {
          message.data[key] = Marked(message.data[key].trim(), {
            breaks: true
          });
        }
      });
    }
    catch (err) {
      console.error(err);
    }

    locales[message.locale] = locales[message.locale] || {};
    locales[message.locale][message.namespace] = message.data;

    next();
  };

  const flush = function (cb) {

    Object.keys(locales).forEach((locale) => {

      const mf = new MessageFormat(locale);
      const data = locales[locale];
      const compiled = 'window.i18n = (function () { ' + mf.compile(data) + ' })();';

      this.push(new Gutil.File({
        path: locale + '.js',
        contents: new Buffer(compiled)
      }));
    });

    cb();
  };

  return Through.obj(parse, flush);
};
