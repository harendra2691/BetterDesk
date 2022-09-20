const {src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss')
const cssnano = require('cssnano');
const prefix = require('autoprefixer');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const imagewebp = require('gulp-webp');
const browserSync = require('browser-sync').create();


// Create functions

//scss
function compilescss(){
    return src('./src/sass/**/*.scss')
        .pipe(sass())
        .pipe(postcss([ prefix('last 2 versions'), cssnano() ]))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

// js
// function jsmin(){
//     return src('src/js/*.js')
//         .pipe(terser())
//         .pipe(dest('dist/js'))
// }

// images
function optimizeimg(){
    return src('src/images/*.{jpg,png}')
        .pipe(imagemin([
            imagemin.mozjpeg({ quality:80, progressive: true}),
            imagemin.optipng({ optiminzationLevel: 2}),
        ]))
        .pipe(dest('dist/images'))
}

// webp images
function webpImage() {
    return src('dist/images/*.{jpg,png}')
        .pipe(imagewebp())
        .pipe(dest('dist/images'))
}
// fonts
function font(){
    return src('src/fonts/**/*')
    .pipe(dest('dist/fonts'))
}

// create watchtask
function watchTask(){
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    watch('src/sass/**/*.scss', compilescss);
    // watch('src/js/*.js', jsmin);
    watch('src/images/*.{jpg,png}', optimizeimg);
    watch('dist/images/*.{jpg,png}', webpImage)
    watch('./*.html').on('change', browserSync.reload);
}

// default gulp
exports.default = series(
    font,
    compilescss,
    // jsmin,
    optimizeimg,
    webpImage,
    watchTask
);