"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const tailwind = require("tailwindcss");
const cssnano = require("cssnano");
const concat = require("gulp-concat");
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
var sass = require("gulp-sass")(require("sass"));
// const validator = require("gulp-html");
const template = require("gulp-template-html");
var htmlbeautify = require("gulp-html-beautify");
const livereload = require("gulp-livereload");
// const notify = require("gulp-notify");
var reload = browsersync.reload;

// == Browser-sync task
gulp.task("browser-sync", function (done) {
  browsersync.init({
    server: "./public",
    // startPath: "./", // After it browser running [File path set]
    //    browser: 'chrome',
    host: "0.0.0.0",
    port: 5000,
    open: true,
    // tunnel: true,
  });
  gulp.watch(["./src/**/*"]).on("change", reload); // [File path set]
  done();
});
// == Browser-sync task

// HTML task
// .pipe(validator()) [lint-html]
gulp.task("html", () => {
  return gulp
    .src("./src/pages/**/*.html")
    .pipe(template("./src/template.html"))
    .pipe(htmlbeautify({ indentSize: 2, indentWithTabs: false }))
    .pipe(gulp.dest("public/"))
    .pipe(browsersync.stream())
    .pipe(livereload());
});

// CSS task
gulp.task("css", () => {
  return gulp
    .src("./src/assets/scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(postcss([tailwind("./tailwind.config.js"), autoprefixer, cssnano]))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("public/css"))
    .pipe(browsersync.stream())
    .pipe(livereload());
});

// Webfonts task [If you need to download and load it]
// gulp.task("webfonts", () => {
//   return gulp
//     .src(
//       "./src/assets/scss/vendor/fontawesome/webfonts/*.{ttf,woff,woff2,eot,svg}"
//     )
//     .pipe(gulp.dest("public/css/webfonts"));
// });

// Transpile, concatenate and minify scripts
gulp.task("js", () => {
  return (
    gulp
      .src(["./src/assets/js/general.js"])
      .pipe(plumber())

      // folder only, filename is specified in webpack config
      .pipe(concat("app.js"))
      .pipe(gulp.dest("public/js"))
      .pipe(browsersync.stream())
      .pipe(livereload())
  );
});

gulp.task(
  "default",
  gulp.series("html", "css", "js", "browser-sync", () => {
    // for tailwindcss, its needed to watch html for css too.
    // coz, tailwind will export only used classes in htmls
    gulp.watch(["src/**/*.html"], gulp.series(["html", "css"]));
    gulp.watch(["src/assets/scss/**/*.scss"], gulp.series("css"));
    gulp.watch(["src/assets/js/**/*.js"], gulp.series("js"));
    // gulp.watch(
    //   ["src/assets/scss/vendor/fontawesome/webfonts/*"],
    //   gulp.series("webfonts")
    // );
    livereload.listen();
  })
);
