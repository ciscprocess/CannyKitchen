'use strict';

// setting global libraries
GLOBAL._ = require('underscore');

var request = require('request'),
    mongoose = require('mongoose'),
    config = require('./config/config'),
    glob = require('glob'),
    fs = require('fs'),
    q = require('Q');


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
    // connect to the database
    var connection = mongoose.connect(config.db),
        db = mongoose.connection;

    db.on('error', function () {
      throw new Error('unable to connect to database at ' + config.db);
    });

    // include all the models since the init scripts are not run in the GruntJS environment
    var models = glob.sync(config.root + '/app/models/*.js');
    models.forEach(function (model) {
      require(model);
    });

    // set this task as asynchronous and get models
    var done = this.async(),
        Recipe = connection.model('Recipe'),
        IngredientType = connection.model('IngredientType'),
        Ingredient = connection.model('Ingredient');

    // read in the established ingredient types
    var typesFile = fs.readFileSync('config/clean-ingredient-types.json').toString();

    // since each line is a JSON object, parse each line separately
    var rawTypes = _.map(typesFile.split('\n'), JSON.parse),
        typePromises = [];

    // for each raw ingredient type, create a model instance and add it to the DB
    _.each(rawTypes, function(type) {
      var deferred = q.defer();
      var newType = new IngredientType({
        normalizedName: type.normalizedName,
        aliases: []
      });

      typePromises.push(deferred.promise);

      newType.save(function(err) {
        err ? deferred.reject(err) : deferred.resolve(newType);
      });
    });

    var seedRecipes = _.noop();
    q.all(typePromises).then(function(values) {
      seedRecipes(values);
    }, function(err) {
      console.error('Failure ' + err);
    });

    seedRecipes = function(types) {
      // run the recipe generation routine for a given number of times
      var numberOfRecipes = 5000,
          recipePromises = [];
      _.times(numberOfRecipes, function() {
        // number of ingredients the recipe should have
        var count = _.random(3, 10),
            // randomly sampled ingredients
            sample = _.sample(types, count),
            promises = [];

        var recipeDeferred = q.defer();
        recipePromises.push(recipeDeferred.promise);

        // for each type sampled, generate an ingredient reference
        _.each(sample, function(type) {
          var iDeferred = q.defer();

          var ingredient = new Ingredient({
            type: type,
            nameAlias: type.normalizedName,
            amount: _.random(1, 5),
            tags: []
          });

          promises.push(iDeferred.promise);

          ingredient.save(function(err) {
            if (!err) {
              iDeferred.resolve(ingredient);
            } else {
              iDeferred.reject(err);
            }
          });
        });

        q.all(promises).then(function(ingredients) {
              var recipe = new Recipe({
                name: _.random(90000000000000).toString(),
                ingredients: ingredients,
                url: '',
                image: '',
                duration: '',
                yield: '',
                description: '',
                selectionToken: Math.random()
              });

          recipe.save(function(err) {
            if (!err) {
              recipeDeferred.resolve(recipe);
            } else {
              recipeDeferred.reject(err);
            }
          });
        });
      });

      q.all(recipePromises).then(function(recipes) {
        console.log('Success!');
        done();
      }, function(err) {
        console.error('Failure: ' + err);
        done();
      });
    };
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
          IngredientParser.parseType(ingredient).then(function(type) {
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

  grunt.registerTask('test', function() {
    var connection = mongoose.connect(config.db);
    var db = mongoose.connection;
    db.on('error', function () {
      throw new Error('unable to connect to database at ' + config.db);
    });

    var models = glob.sync(config.root + '/app/models/*.js');
    models.forEach(function (model) {
      require(model);
    });

    var done = this.async(),
        Recipe = connection.model('Recipe'),
        IngredientType = connection.model('IngredientType'),
        Ingredient = connection.model('Ingredient');

    Recipe.findOne(function(obj, obj2) {
      IngredientType.findOne({_id: obj2.ingredients[0].type}, function(err, obj3) {
        done();
      });
    })
  });

  grunt.registerTask('default', [
    'less',
    'develop',
    'watch'
  ]);
};
