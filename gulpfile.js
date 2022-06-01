let gulp = require("gulp");
let ts = require("gulp-typescript");
let tsProject = ts.createProject("tsconfig.json");
let minify = require("gulp-minify");
let rimraf = require("rimraf");
let uglify = require('gulp-uglify');
var exec = require('child_process').exec;

let paths = {
    jsOutput: ['./src/*', './src/**/*.js'],
    keys: ['./src/server/config/keys/**'],
    views: ['./src/server/views/**'],
    static: ['./src/server/static/**'],
}

gulp.task('removeBuild', function(done) {
    try {
        rimraf("./build/*", function() {
            console.log("Last build files removed.");
            done();
        });
    } catch (e) {
        console.log(e);
        done();
    }
});

gulp.task('create-bundle', function (cb) {
    exec('webpack', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  })

gulp.task("copy-keys", function() {
    return gulp.src(paths.keys)
        .pipe(gulp.dest("build/server/config/keys"));
});

gulp.task("copy-views", function() {
    return gulp.src(paths.views)
        .pipe(gulp.dest("build/server/views"));
});

gulp.task("copy-static", function() {
    return gulp.src(paths.static)
        .pipe(gulp.dest("build/server/static"));
});


gulp.task("tsc", function() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("tmp"));
});

gulp.task('compress', function() {
    return gulp.src(['tmp/*.js', 'tmp/**/*.js'])
        .pipe(minify({
            ext: {
                src: '.js.old',
                min: '.js'
            }
        }))
        .pipe(uglify())
        .pipe(gulp.dest('build'));
});

gulp.task('remove-tmp', function(callback) {
    try {
        rimraf("./tmp/*", function() { console.log("Temporary files removed.") });
        rimraf("./build/*.old", function() { console.log("Temporary files removed.") });
        rimraf("./build/**/*.old", function() {
            console.log("Temporary files removed.");
            callback();
        });
    } catch (e) {
        console.log(e);
        callback();
    }
});

gulp.task('default', gulp.series('removeBuild', gulp.parallel('tsc', 'copy-keys', 'copy-views', 'copy-static'), 'compress', 'remove-tmp', 'create-bundle'));