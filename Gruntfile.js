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

    var typePromises = [];

    var namesFile = fs.readFileSync('config/juicein.json').toString();

    // first, seed the sample ingredient types
    var names = _.map(namesFile.split('\n'), JSON.parse),
        types = [];

    _(names).each(function(name) {
      var deferred = q.defer();
      var type = new IngredientType({
        normalizedName: name.normalizedName,
        aliases: []
      });

      typePromises.push(deferred.promise);

      type.save(function() {
        types.push(type);
        deferred.resolve();
      });
    });

    q.all(typePromises).then(function() {
      var list = _.range(100),
          recipePromises = [],
          ingredientPromises = [];
      _(list).each(function() {
        var ingredients = [],
            count = _.random(3, 35),
            sample = _.sample(types, count);
        _(sample).each(function(it) {
          var iDeferred = q.defer();

          var ingredient = new Ingredient({
            type: it,
            amount: _.random(1, 5),
            tags: []
          });

          ingredientPromises.push(iDeferred.promise);

          ingredient.save(function(err) {
            if (!err) {
              ingredients.push(ingredient);
              iDeferred.resolve();
            }
          });
        });

        q.all(ingredientPromises).then(function() {
          var recipeDeferred = q.defer(),
              recipe = new Recipe({
                name: _.random(900000).toString(),
                ingredients: ingredients,
                url: '',
                image: '',
                duration: '',
                yield: '',
                description: '',
                selectionToken: Math.random()
              });

          recipePromises.push(recipeDeferred.promise);

          recipe.save(function(err) {
            if (err) {
              recipeDeferred.resolve();
            }
          });
        });

      });
    });
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
