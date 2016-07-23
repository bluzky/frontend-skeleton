var gulp = require("gulp");
var clean = require("gulp-clean");
var dir = require("node-dir");
var path = require("path");
var sass = require("gulp-sass");
var runSequence = require("run-sequence");
var fs = require("fs");


function relativeDirpath(base, filePath){
  return path.dirname(path.relative(base, filePath));
}

var walkSync = function(dir, filelist, pattern) {
  var files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file, filelist, pattern);
    }else {
      if(pattern == undefined || pattern.test(file)){
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

var data = fs.readFileSync("package.json");
var config = JSON.parse(data.toString());
config = config.gulpConfig;


/*
* Clean build directory
*/
gulp.task('clean', function(){
  return gulp.src(config.destinationDir)
      .pipe(clean({force: true}));
})

/*
* Copy css file to build directory recursively
*/
gulp.task('copy-css', function(){
  var paths = walkSync(config.sourcesPaths.css, [], /.*\.css/);
  paths.forEach(function(file, index){
    gulp.src(file)
      .pipe(gulp.dest(config.destinationPaths.css + relativeDirpath(config.sourcesPaths.css, file)));
  });
});

/*
* Copy javascript file to build directory recursively
*/
gulp.task('copy-js', function(){
  var paths = walkSync(config.sourcesPaths.js, [], /.*\.js/);
  paths.forEach(function(file, index){
    gulp.src(file)
      .pipe(gulp.dest(config.destinationPaths.js + relativeDirpath(config.sourcesPaths.js, file)));
  });
});

/*
  Copy custom mapped resource to custom directory
*/
gulp.task('copy-custom', function(){
  for(var source in config.custom){
    gulp.src(source)
        .pipe(gulp.dest(path.join(config.destinationDir, config.custom[source])));
  }
});


/*
  copy not compile resource to build directory
*/
gulp.task('copy', function(){
  runSequence('copy-css', "copy-js", "copy-custom");

  var paths = walkSync(config.sourcesPaths.vendor);
  paths.forEach(function(file, index){
    gulp.src(file)
      .pipe(gulp.dest(config.destinationPaths.vendor + relativeDirpath(config.sourcesPaths.vendor, file)));
  });

  gulp.src(config.sourcesPaths.fonts)
      .pipe(gulp.dest(config.destinationPaths.fonts));

  gulp.src(config.sourcesPaths.image)
      .pipe(gulp.dest(config.destinationPaths.image));
});

/*
Compile sass source
*/
gulp.task('scss', function(){
  var paths = walkSync(config.sourcesPaths.scss, [], /.*\.scss/);
  paths.forEach(function(file, index){
    gulp.src(file)
      .pipe(sass())
      .pipe(gulp.dest(config.destinationPaths.scss + relativeDirpath(config.sourcesPaths.scss, file)));
  });
});

gulp.task('build', function(){

});

/*
* clean buld directory
* copy resource to build directory
* compile sass file to css
*/
gulp.task('dev', function(){
  runSequence("clean", "copy", "scss");
})


/*
* watch for changes in css, js, scss directory and rebuild resource
*/
gulp.task('watch', function(){
  gulp.watch(config.sourcesPaths.css + "**/*.css", ["copy-css"]);
  gulp.watch(config.sourcesPaths.js + "**/*.js", ["copy-js"]);
  gulp.watch(config.sourcesPaths.scss + "**/*.scss", ["scss"]);
});
