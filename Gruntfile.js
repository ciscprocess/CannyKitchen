'use strict';

// setting global libraries
GLOBAL._ = require('underscore');

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
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
        },
        src: ['test/**/*.js']
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



  grunt.registerTask('seed-recipes', function() {
    var connection = mongoose.connect(config.db);
    var db = mongoose.connection;
    db.on('error', function () {
      throw new Error('unable to connect to database at ' + config.db);
    });

    var models = glob.sync(config.root + '/app/models/*.js');
    models.forEach(function (model) {
      require(model);
    });

    var done = this.async();
    var Recipe = connection.model('Recipe');

    var raw = fs.readFileSync('./config/recipeitems-latest.json').toString().split('\n');


    var counter = 0;
    function iter() {
      if (counter >= raw.length) {
        done(true);
        return;
      }

      var rawRecipe = JSON.parse(raw[counter]);

      var recipe = new Recipe({
        name: rawRecipe.name,
        ingredients: rawRecipe.ingredients.split('\n'),
        url: rawRecipe.url,
        image: rawRecipe.image,
        duration: rawRecipe.cookTime,
        yield: rawRecipe.recipeYield,
        description: rawRecipe.description || '',
        selectionToken: Math.random()
      });

      recipe.save(function(err) {
        if (err) {
          console.log('Error saving recipe: ' + err);
        }

        console.log('Completion: ' + (((counter * 1.0) / raw.length) * 100) + '%');
        counter++;
        iter();
      });
    }

    iter();
  });

  grunt.registerTask('extract-ingredients', function() {
    var raw = fs.readFileSync('./config/recipeitems-latest.json').toString().split('\n');
    var file = '';
    for (var i = 0; i < raw.length; i++) {
      var json = JSON.parse(raw[i]);
      var ingredients = json.ingredients.split('\n');
      file += ingredients.join(' . ') + '\n';
    }

    fs.writeFileSync('./config/extraction.txt', file);
  });

  grunt.registerTask('extract-types', function() {
    var connection = mongoose.connect(config.db);
    var db = mongoose.connection;
    db.on('error', function () {
      throw new Error('unable to connect to database at ' + config.db);
    });

    var models = glob.sync(config.root + '/app/models/*.js');
    models.forEach(function (model) {
      require(model);
    });

    var done = this.async();
    var Recipe = connection.model('Recipe'),
        IngredientType = connection.model('IngredientType');
    var IngredientParser = require('./app/procedures/generation/ingredient-parser');
    Recipe.find().limit(200).exec(function(err, recipes) {
      for (var i = 0; i < recipes.length; i++) {
        _.each(recipes[i].ingredients, function(ingredient) {
          IngredientParser.parseDescriptor(ingredient).then(function(type) {
            if (type) {
              type.save(function(err) {
                console.error(err);
              });
            } else {
              console.log('no type');
            }
          });
        });
      }

    });
  });

  grunt.registerTask('default', [
    'less',
    'develop',
    'watch'
  ]);
};
