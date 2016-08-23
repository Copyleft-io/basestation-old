'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    deploy: 'deploy',
    dist: 'dist',
    version: require('./package.json').version
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    basestation: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= basestation.app %>/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= basestation.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= basestation.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= basestation.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 4000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 4002
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/app/styles',
                connect.static('./app/styles')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= basestation.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= basestation.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= basestation.dist %>/{,*/}*',
            '!<%= basestation.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true,
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= basestation.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath:  /\.\.\//,
        fileTypes:{
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
              detect: {
                js: /'(.*\.js)'/gi
              },
              replace: {
                js: '\'{{filePath}}\','
              }
            }
          }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= basestation.dist %>/scripts/{,*/}*.js',
          '<%= basestation.dist %>/styles/{,*/}*.css',
          '<%= basestation.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= basestation.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= basestation.app %>/index.html',
      options: {
        dest: '<%= basestation.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= basestation.dist %>/{,*/}*.html'],
      css: ['<%= basestation.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= basestation.dist %>',
          '<%= basestation.dist %>/images',
          '<%= basestation.dist %>/styles'
        ]
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= basestation.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= basestation.dist %>/scripts/scripts.js': [
    //         '<%= basestation.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    image: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= basestation.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= basestation.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= basestation.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= basestation.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= basestation.dist %>',
          src: ['*.html', '{,*/}*.html'],
          dest: '<%= basestation.dist %>'
        }]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= basestation.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      // artifact: {
      //   files: [{
      //     expand: true,
      //     dot: true,
      //     cwd: '<%= basestation.dist %>',
      //     dest: '<%= basestation.deploy %>',
      //     src: ['basestation.<%= basestation.version %>.tar']
      //   }]
      // },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= basestation.app %>',
          dest: '<%= basestation.dist %>',
          src: [
            '{,*/}*.html',
            '**/{,*/}*.html',
            '*.{ico,png,txt}',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= basestation.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= basestation.dist %>'
        },{
          expand: true,
          cwd: 'bower_components/fontawesome',
          src: 'fonts/*',
          dest: '<%= basestation.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= basestation.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },
    // Rename generated artifact and move to deploy directory
    rename: {
        main: {
          files: [
            {src: ['basestation.<%= basestation.version %>.tar'], dest: 'deploy/basestation.<%= basestation.version %>.tar'},
          ]
        }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'image',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },

    // Execute Firebase Deploy
    exec: {
      deploy_basestation: {
        cmd: 'firebase deploy --firebase "basestation" --token ${FIREBASE_TOKEN}'
      },
      deploy_basestation_edo: {
        cmd: 'firebase deploy --firebase "edo-basestation" --token ${EDO_FIREBASE_TOKEN}'
      }
    },

    // String Replace to set FIREBASE_URL constant during deploy
    'string-replace': {
      edo: {
          files: [{
            expand: true,
              cwd: 'dist/scripts/',
              src: '**/scripts.*.js',
              dest: 'dist/scripts/'
            }],
            options: {
              replacements: [{
                pattern: 'constant("FIREBASE_URL","https://basestation.firebaseio.com/")',
                replacement: 'constant("FIREBASE_URL","https://edo-basestation-app.firebaseio.com/")'
            }]
          }
        }
      },
      compress: {
        main: {
          options: {
            archive: 'basestation.<%= basestation.version %>.tar',
            pretty: true
          },
          expand: true,
          cwd: 'dist/',
          src: ['**/*'],
          dest: '/'
        }
      }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'wiredep',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  // THIS IS THE CORE BUILD TASK
  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);


  // THIS IS THE CORE TASK TO GENERATE AN ARTIFACT
  grunt.registerTask('artifact', [
    'build',
    'compress',
    'rename'
  ]);

  // THIS DEPLOY TASK IS USED BY TRAVIS-CI
  // RUNS THE BUILD
  // EXECUTES A FIREBASE DEPLOY TO basestation and then basestation-edo
  grunt.registerTask('travis_build_and_deploy', [
    'build',
    'exec:deploy_basestation',
    'string-replace:edo',
    'exec:deploy_basestation_edo'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
