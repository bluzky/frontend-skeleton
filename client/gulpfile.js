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

var desPath = function(pathKey){
  return path.join(config.destinationDir, config.destinationPaths[pathKey]);
}

var srcPath = function(pathKey){
  return path.join(config.sourceDir, config.sourcesPaths[pathKey]);
}


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
  var paths = walkSync(srcPath('css'), [], /.*\.css/);
  paths.forEach(function(file, index){
    gulp.src(file)
      .pipe(gulp.dest(desPath('css') + relativeDirpath(srcPath('css'), file)));
  });
});

/*
* Copy javascript file to build directory recursively
*/
gulp.task('copy-js', function(){
  var paths = walkSync(srcPath('js'), [], /.*\.js/);
  paths.forEach(function(file, index){
    gulp.src(file)
      .pipe(gulp.dest(desPath('js') + relativeDirpath(srcPath('js'), file)));
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

  var paths = walkSync(srcPath('vendor'));
  paths.forEach(function(file, index){
    gulp.src(file)
      .pipe(gulp.dest(desPath('vendor') + relativeDirpath(srcPath('vendor'), file)));
  });

  gulp.src(srcPath('fonts'))
      .pipe(gulp.dest(desPath('fonts')));

  gulp.src(srcPath('image'))
      .pipe(gulp.dest(desPath('image')));
});

/*
Compile sass source
*/
gulp.task('scss', function(){
  var paths = walkSync(srcPath('scss'), [], /.*\.scss/);
  paths.forEach(function(file, index){
    gulp.src(file)
      .pipe(sass())
      .pipe(gulp.dest(desPath('scss') + relativeDirpath(srcPath('scss'), file)));
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
  gulp.watch(srcPath('css') + "**/*.css", ["copy-css"]);
  gulp.watch(srcPath('js') + "**/*.js", ["copy-js"]);
  gulp.watch(srcPath('scss') + "**/*.scss", ["scss"]);
});
