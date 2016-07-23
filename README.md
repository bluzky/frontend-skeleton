# Front-end Skeleton

## 1. setup
- Install `node` and `npm`
- Install `bower`  
`npm install bower -g`
- Install `gulp`   
`npm install gulp -g`

Then run following commands
```
$ cd client
$ npm install
$ bower install
```

## 2. Build source
- Run `gulp dev` to build assets. By default, build directory is `assets/`
You can config source and destination and other paths in `client/package.json` file

- For `scss`, `css`, `js` and `vendor`, resource will be copy recursively, and keep the directory structure same as in source directory


## 3. Watch source for changes
- Run `gulp watch`


## 4. All configurations
- configuration is stored in file `client/package.json`
```javascript
{
  ...,
  "gulpConfig": {
    "sourceDir": "source/",
    "destinationDir": "../assets/", // build/output directory
    "sourcesPaths": {
      "css": "source/css/",
      "js": "source/js/",
      "scss": "source/scss/",
      "vendor": "source/vendor/",
      "fonts": "source/fonts/*",
      "image": "source/img/"
    },
    "destinationPaths": {
      "css": "../assets/css/",
      "js": "../assets/js/",
      "scss": "../assets/css/",
      "vendor": "../assets/vendor/",
      "fonts": "../assets/fonts/",
      "image": "../assets/img/"
    },
    "custom": {
      "bower_components/jquery/dist/jquery.min.js": "lib/js/",
      "bower_components/bootstrap/dist/js/bootstrap.min.js": "lib/js/",
      "bower_components/bootstrap/dist/css/bootstrap.min.css": "lib/css/",
      "bower_components/bootstrap/dist/fonts/*": "lib/fonts/"
    }
  }
}
```

- `custom` is custom mapping source file and destination build directory.  
`"sourceFile" : "outputDir"`   
`outputDir` is relative path in `destinationDir`   
**Example:**  
`lib/js/' turn into '../assets/lib/js/`
