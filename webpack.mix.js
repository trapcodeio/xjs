const x = require('./config');
const mix = require('laravel-mix');

mix.setPublicPath(x.paths.base);

mix.js('frontend/js/app.js', 'public/js');
mix.sass('frontend/scss/app.scss', 'public/css');

mix.version();