const mix = require('laravel-mix');
mix.setPublicPath('public');

mix.js('frontend/js/app.js', 'js');
mix.sass('frontend/scss/app.scss', 'css');

mix.version();