'use strict';

var request = require('request'),
    mongoose = require('mongoose'),
    config = require('./config/config'),
    glob = require('glob'),
    fs = require('fs');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'app.js'
      }
    },
    less: {
      dist: {
        files: {
          'public/css/style.css': 'public/css/style.less'
        }
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      js: {
        files: [
          'app.js',
          'app/**/*.js',
          'config/*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      css: {
        files: [
          'public/css/*.less'
        ],
        tasks: ['less'],
        options: {
          livereload: reloadPort
        }
      },
      views: {
        files: [
          'app/views/*.swig',
          'app/views/**/*.swig'
        ],
        options: { livereload: reloadPort }
      }
    }
  });

  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function(err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded)
            grunt.log.ok('Delayed live reload successful.');
          else
            grunt.log.error('Unable to make a delayed live reload.');
          done(reloaded);
        });
    }, 500);
  });

  mongoose.connect(config.db);
  var db = mongoose.connection;
  db.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db);
  });

  var models = glob.sync(config.root + '/app/models/*.js');
  models.forEach(function (model) {
    require(model);
  });

  grunt.registerTask('seed-recipes', function() {
    var Recipe = mongoose.model('Recipe');

    var raw = fs.readFileSync('./config/recipeitems-latest.json').toString().split('\n');
    console.log('Done loading!');
    var counter = 0;
    raw.forEach(
        function (line) {
          var rawRecipe = JSON.parse(line);
          var recipe = new Recipe({
            name: rawRecipe.name,
            ingredients: rawRecipe.ingredients.split('\n'),
            url: rawRecipe.url,
            image: rawRecipe.image,
            duration: rawRecipe.cookTime,
            yield: rawRecipe.recipeYield,
            description: rawRecipe.description || ''
          });

          recipe.save(function(err) {
            if (err)
              console.log('Error saving recipe: ' + err);

            console.log('Completion: ' + (counter * 1.0) / raw.length);
            counter++;
          });
        }
    );
  });

  grunt.registerTask('default', [
    'less',
    'develop',
    'watch'
  ]);
};
