# gulp-i18n-messageformat

[![NPM](https://nodei.co/npm/gulp-i18n-messageformat.png?compact=true)](https://nodei.co/npm/gulp-i18n-messageformat/)

[![Build Status](https://travis-ci.org/ciclo-pe/gulp-i18n-messageformat.svg?branch=master)](https://travis-ci.org/ciclo-pe/gulp-i18n-messageformat)
[![Dependency Status](https://david-dm.org/ciclo-pe/gulp-i18n-messageformat.svg?style=flat)](https://david-dm.org/ciclo-pe/gulp-i18n-messageformat)
[![devDependency Status](https://david-dm.org/ciclo-pe/gulp-i18n-messageformat/dev-status.png)](https://david-dm.org/ciclo-pe/gulp-i18n-messageformat#info=devDependencies)

Compile `json` files using [`messageformat.js`](https://github.com/SlexAxton/messageformat.js).

## Install

```
npm install --save-dev gulp-i18n-messageformat
```

## Example

1. Create `json` files with translations
2. Build with `gulp`
3. Load appropriate script in browser

### 1. Create `json` files with translations

Example file structure:

```
.
├── gulpfile.js
├── i18n
│   ├── en
│   │   ├── inicio.json
│   │   └── menu.json
│   └── es
│       ├── inicio.json
│       └── menu.json
├── package.json
└── www
    ├── i18n
    │   ├── en.js
    │   └── es.js
    └── index.html
```

Example `i18n/en/menu.json` file:

```json
{
  "ubicación": "Location",
  "instalaciones": "The House",
  "actividades": "Ammenities",
  "galería": "Gallery",
  "contacto": "Contact"
}
```

### 2. Build with `gulp`

In your `gulpfile.js`:

```js
'use strict';

const Gulp = require('gulp');
const I18n = require('gulp-i18n');

Gulp.task('i18n', () => {

  Gulp.src('i18n/**/*.json')
    .pipe(I18n())
    .pipe(Gulp.dest('www/i18n/'));
});
```

Run task with `gulp`:

```
$ gulp i18n
```

### 3. Load appropriate script in browser

```html
<html>
  <body>
    <script>
    var locale = localStorage.getItem('locale') || 'es';

    $('<script>')
      .attr('src', '/i18n/' + locale + '.js')
      .appendTo('body');

    // You can now use the global `i18n` object.
    console.log(window.i18n.menu['ubicación']());
    // This would show "Ubicación" or "Location" depending on
    // selected `locale`.
    </script>
  </body>
</html>
```

### 4. Options

Regular Expressions can be used for custom paths.

```
.
├── gulpfile.js
├── module1
│   └── i18n
│       ├── en.json
│       └── es.json
├── module2
│   └── i18n
│       ├── en.json
│       └── es.json
├── package.json
└── www
    ├── i18n
    │   ├── en.js
    │   └── es.js
    └── index.html
```

```js
'use strict';

const Gulp = require('gulp');
const I18n = require('gulp-i18n');

Gulp.task('i18n', () => {

  Gulp.src('*/i18n/*.json')
    .pipe(I18n({
      locale: '^.*\/(.*)\.json$',
      namespace: '^(.*)\/i18n\/.*\.json$'
    }))
    .pipe(Gulp.dest('www/i18n/'));
});
```

```
console.log(window.i18n.module1['ubicación']());
```
