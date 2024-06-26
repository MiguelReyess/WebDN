// Generated on 2015-11-25 using generator-angular 0.14.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

   // Time how long tasks take. Can help when optimizing build times
   require('time-grunt')(grunt);

   // Automatically load required Grunt tasks
   require('jit-grunt')(grunt, {
      useminPrepare: 'grunt-usemin',
      ngtemplates: 'grunt-angular-templates',
      cdnify: 'grunt-google-cdn',
      replace: 'grunt-text-replace'
   });

   // Configurable paths for the application
   var appConfig = {
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
   };

   // Define the configuration for all the tasks
   grunt.initConfig({

      // Project settings
      yeoman: appConfig,

      // Watches files for changes and runs tasks based on the changed files
      watch: {
         bower: {
            files: ['bower.json'],
            tasks: ['wiredep']
         },
         js: {
            files: ['<%= yeoman.app %>/scripts/**/*.js'],
            tasks: ['newer:jshint:all', 'newer:jscs:all'],
            options: {
               livereload: '<%= connect.options.livereload %>'
            }
         },
         jsTest: {
            files: ['test/spec/**/*.js'],
            tasks: ['newer:jshint:test', 'newer:jscs:test', 'karma']
         },
         compass: {
            files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
            tasks: ['compass:server', 'postcss:server']
         },
         gruntfile: {
            files: ['Gruntfile.js']
         },
         livereload: {
            options: {
               livereload: '<%= connect.options.livereload %>'
            },
            files: [
               '<%= yeoman.app %>/{,*/}*.html',
               '<%= yeoman.app %>/{,*/,views/cuestionarios/}*.html',
               '.tmp/styles/{,*/}*.css',
               '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
            ]
         }
      },

      // The actual grunt server settings
      connect: {
         options: {
            port: grunt.option('port') || 9000,
            // Change this to '0.0.0.0' to access the server from outside.
            hostname: 'localhost',//'0.0.0.0',
            livereload: grunt.option('watchport') || 35729
         },
         livereload: {
            options: {
               open: true,
               middleware: function(connect) {
                  return [
                     connect.static('.tmp'),
                     connect().use(
                        '/bower_components',
                        connect.static('./bower_components')
                     ),
                     connect().use(
                        '/node_modules',
                        connect.static('./node_modules')
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
               middleware: function(connect) {
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
               base: '<%= yeoman.dist %>'
            }
         }
      },

      // Make sure there are no obvious mistakes
      jshint: {
         options: {
            jshintrc: '.jshintrc',
            reporter: require('jshint-stylish')
         },
         all: {
            src: [
               'Gruntfile.js',
               '<%= yeoman.app %>/scripts/**/*.js'
            ]
         },
         test: {
            options: {
               jshintrc: 'test/.jshintrc'
            },
            src: ['test/spec/**/*.js']
         }
      },

      // Make sure code styles are up to par
      jscs: {
         options: {
            config: '.jscsrc',
            verbose: true
         },
         all: {
            src: [
               'Gruntfile.js',
               '<%= yeoman.app %>/scripts/**/*.js'
            ]
         },
         test: {
            src: ['test/spec/**/*.js']
         }
      },

      // Empties folders to start fresh
      clean: {
         dist: {
            files: [{
               dot: true,
               src: [
                  '.tmp',
                  '<%= yeoman.dist %>/{,*/}*',
                  '!<%= yeoman.dist %>/.git{,*/}*'
               ]
            }]
         },
         server: '.tmp'
      },

      // Add vendor prefixed styles
      postcss: {
         options: {
            processors: [
               require('autoprefixer-core')({
                  browsers: ['last 1 version']
               })
            ]
         },
         server: {
            options: {
               map: true
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
            src: ['<%= yeoman.app %>/index.html'],
            ignorePath: /\.\.\//,
            exclude: /\.min\.js/
         },
         test: {
            devDependencies: true,
            src: '<%= karma.unit.configFile %>',
            ignorePath: /\.\.\//,
            fileTypes: {
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
         },
         sass: {
            src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
            ignorePath: /(\.\.\/){1,2}bower_components\//
         }
      },

      // Compiles Sass to CSS and generates necessary files if requested
      compass: {
         options: {
            sassDir: '<%= yeoman.app %>/styles',
            cssDir: '.tmp/styles',
            generatedImagesDir: '.tmp/images/generated',
            imagesDir: '<%= yeoman.app %>/images',
            javascriptsDir: '<%= yeoman.app %>/scripts',
            fontsDir: '<%= yeoman.app %>/styles/fonts',
            importPath: './bower_components',
            httpImagesPath: '/images',
            httpGeneratedImagesPath: '/images/generated',
            httpFontsPath: '/styles/fonts',
            relativeAssets: false,
            assetCacheBuster: false,
            raw: 'Sass::Script::Number.precision = 10\n'
         },
         dist: {
            options: {
               generatedImagesDir: '<%= yeoman.dist %>/images/generated'
            }
         },
         server: {
            options: {
               sourcemap: true
            }
         }
      },

      // Renames files for browser caching purposes
      filerev: {
         dist: {
            src: [
               '<%= yeoman.dist %>/scripts/**/*.js',
               '<%= yeoman.dist %>/styles/{,*/}*.css',
               '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
               '<%= yeoman.dist %>/styles/fonts/*'
            ]
         }
      },

      // Reads HTML for usemin blocks to enable smart builds that automatically
      // concat, minify and revision files. Creates configurations in memory so
      // additional tasks can operate on them
      useminPrepare: {
         html: '<%= yeoman.app %>/index.html',
         options: {
            dest: '<%= yeoman.dist %>',
            flow: {
               html: {
                  steps: {
                     js: ['concat', 'uglifyjs'],
                     css: ['cssmin']
                  },
                  post: {
                     js: [{
                        name: 'uglifyjs',
                        createConfig: function(context, block) {
                           var tieneMinificados = context.inFiles.find(function(f) {
                              return f.endsWith('.min.js');
                           });
                           if (tieneMinificados) {
                              // context.options.generated = null;
                              // console.log('-----', context);
                              // console.log('-----', block);
                              // console.log('-----', files);
                              var files = context.options.generated.files;
                              files = files.filter(function(obj) {
                                 return !obj.dest.endsWith(block.dest);
                              });
                              context.options.generated.files = files;
                           }
                        }
                     }]
                  }
               }
            }
         }
      },

      // Performs rewrites based on filerev and the useminPrepare configuration
      usemin: {
         html: ['<%= yeoman.dist %>/{,*/}*.html'],
         css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
         js: ['<%= yeoman.dist %>/scripts/**/*.js'],
         options: {
            assetsDirs: [
               '<%= yeoman.dist %>',
               '<%= yeoman.dist %>/images',
               '<%= yeoman.dist %>/styles'
            ],
            patterns: {
               js: [
                  [/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g,
                     'Replacing references to images'
                  ]
               ]
            }
         }
      },

      // The following *-min tasks will produce minified files in the dist folder
      // By default, your `index.html`'s <!-- Usemin block --> will take care of
      // minification. These next options are pre-configured if you do not wish
      // to use the Usemin blocks.
      // cssmin: {
      //   dist: {
      //     files: {
      //       '<%= yeoman.dist %>/styles/main.css': [
      //         '.tmp/styles/{,*/}*.css'
      //       ]
      //     }
      //   }
      // },
      // uglify: {
      //   dist: {
      //     files: {
      //       '<%= yeoman.dist %>/scripts/scripts.js': [
      //         '<%= yeoman.dist %>/scripts/scripts.js'
      //       ]
      //     }
      //   }
      // },
      // concat: {
      //   dist: {}
      // },

      imagemin: {
         dist: {
            files: [{
               expand: true,
               cwd: '<%= yeoman.app %>/images',
               src: '{,*/}*.{png,jpg,jpeg,gif}',
               dest: '<%= yeoman.dist %>/images'
            }]
         }
      },

      svgmin: {
         dist: {
            files: [{
               expand: true,
               cwd: '<%= yeoman.app %>/images',
               src: '{,*/}*.svg',
               dest: '<%= yeoman.dist %>/images'
            }]
         }
      },

      htmlmin: {
         dist: {
            options: {
               collapseWhitespace: true,
               conservativeCollapse: true,
               collapseBooleanAttributes: true,
               removeCommentsFromCDATA: true
            },
            files: [{
               expand: true,
               cwd: '<%= yeoman.dist %>',
               src: ['*.html'],
               dest: '<%= yeoman.dist %>'
            }]
         }
      },

      ngtemplates: {
         dist: {
            options: {
               module: 'dnwebApp',
               htmlmin: '<%= htmlmin.dist.options %>',
               usemin: 'scripts/scripts.js'
            },
            cwd: '<%= yeoman.app %>',
            src: 'views/{,*/,views/cuestionarios/}*.html',
            dest: '.tmp/templateCache.js'
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
            html: ['<%= yeoman.dist %>/*.html']
         }
      },

      // Copies remaining files to places other tasks can use
      copy: {
         dist: {
            files: [{
               expand: true,
               dot: true,
               cwd: '<%= yeoman.app %>',
               dest: '<%= yeoman.dist %>',
               src: [
                  '*.{ico,png,txt}',
                  '*.html',
                  'images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                  'styles/fonts/{,*/}*.*'
               ]
            }, {
               expand: true,
               cwd: '.tmp/images',
               dest: '<%= yeoman.dist %>/images',
               src: ['generated/*']
            }, {
               expand: true,
               cwd: '.',
               src: [
                  'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
                  'bower_components/components-font-awesome/fonts/*',
               ],
               dest: '<%= yeoman.dist %>'
            }, {
               expand: true,
               cwd: 'bower_components/kendo-ui',
               src: 'styles/Default/*',
               dest: '<%= yeoman.dist %>'
            }, {
               expand: true,
               cwd: '.tmp/concat/scripts',
               src: '*',
               dest: '<%= yeoman.dist %>/scripts'
            }]
         },
         styles: {
            expand: true,
            cwd: '<%= yeoman.app %>/styles',
            dest: '.tmp/styles/',
            src: '{,*/}*.css'
         }
      },

      // Run some tasks in parallel to speed up the build process
      concurrent: {
         server: [
            'compass:server'
         ],
         test: [
            'compass'
         ],
         dist: [
            'compass:dist',
            //'imagemin',
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

      // Cambiar servidor para despliegue
      replace: {
         dev: {
            src: '.tmp/concat/scripts/scripts.js',
            overwrite: true,
            replacements: [{
               from: /configuracionManual.DireccionActiva = configuracionManual.*/,
               to: 'configuracionManual.DireccionActiva = configuracionManual.DireccionAndev;',
            }, {
               from: /recibirNotificacionesProvider\.defaults\.servidor = .*/,
               to: 'recibirNotificacionesProvider.defaults.servidor = "http://192.6.9.2:3200/";',
            }, {
               from: /enviarNotificacionesProvider\.defaults\.servidor = .*/,
               to: 'enviarNotificacionesProvider.defaults.servidor = "http://192.6.9.2:3200/";',
            }],
         },
         stag: {
            src: '.tmp/concat/scripts/scripts.js',
            overwrite: true,
            replacements: [{
               from: /configuracionManual.DireccionActiva = configuracionManual.*/,
               to: 'configuracionManual.DireccionActiva = configuracionManual.DireccionANStagingPub;',
            }, {
               from: /recibirNotificacionesProvider\.defaults\.servidor = .*/,
               to: 'recibirNotificacionesProvider.defaults.servidor = "http://192.6.9.5:3100/";',
            }, {
               from: /enviarNotificacionesProvider\.defaults\.servidor = .*/,
               to: 'enviarNotificacionesProvider.defaults.servidor = "http://192.6.9.5:3100/";',
            }, {
               from: /configuracionManual.DireccionActiva = configuracionManual.*/,
               to: 'configuracionManual.DireccionActiva = configuracionManual.DireccionANStagingPub;',
            }, {
               from: /configuracionManual.RoccV2ApiActiva = configuracionManual.*/,
               to: 'configuracionManual.RoccV2ApiActiva = configuracionManual.DireccionRoccV2ProdAPI;',
            }],
         },
         prod: {
            src: '.tmp/concat/scripts/scripts.js',
            overwrite: true,
            replacements: [{
               from: /configuracionManual.DireccionActiva = configuracionManual.*/,
               to: 'configuracionManual.DireccionActiva = configuracionManual.DireccionANProdPub;',
            }, {
               from: /recibirNotificacionesProvider\.defaults\.servidor = .*/,
               to: 'recibirNotificacionesProvider.defaults.servidor = "http://189.209.96.236:3000/";',
            }, {
               from: /enviarNotificacionesProvider\.defaults\.servidor = .*/,
               to: 'enviarNotificacionesProvider.defaults.servidor = "http://189.209.96.236:3000/";',
            }, {
               from: /configuracionManual.RoccV2ApiActiva = configuracionManual.*/,
               to: 'configuracionManual.RoccV2ApiActiva = configuracionManual.DireccionRoccV2ProdAPI;',
            }],
         },
         
         prodaz: {
            src: '.tmp/concat/scripts/scripts.js',
            overwrite: true,
            replacements: [{
               from: /configuracionManual.DireccionActiva = configuracionManual.*/,
               to: 'configuracionManual.DireccionActiva = configuracionManual.DireccionANProdPubAz;',
            }, {
               from: /recibirNotificacionesProvider\.defaults\.servidor = .*/,
               to: 'recibirNotificacionesProvider.defaults.servidor = "http://189.209.96.236:3000/";',
            }, {
               from: /enviarNotificacionesProvider\.defaults\.servidor = .*/,
               to: 'enviarNotificacionesProvider.defaults.servidor = "http://189.209.96.236:3000/";',
            }],
         },
      },

   });


   grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
      if (target === 'dist') {
         return grunt.task.run(['build', 'connect:dist:keepalive']);
      }

      grunt.task.run([
         'clean:server',
         'wiredep',
         'concurrent:server',
         'postcss:server',
         'connect:livereload',
         'watch'
      ]);
   });

   grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function(target) {
      grunt.log.warn(
         'The `server` task has been deprecated. Use `grunt serve` to start a server.');
      grunt.task.run(['serve:' + target]);
   });

   grunt.registerTask('test', [
      'clean:server',
      'wiredep',
      'concurrent:test',
      'postcss',
      'connect:test',
      'karma'
   ]);

   grunt.registerTask('archivoMarcador', function(target) {
      grunt.file.write(appConfig.dist + '/SICDN_' + target, '');
   });

   grunt.registerTask('build', function(target) {
      var targetsValidos = ['dev', 'stag', 'prod'];
      var esTargetValido = targetsValidos.find(function(item) {
         return item === target;
      });
      if (!esTargetValido) {
         grunt.warn(['Debe elegir un target de (', targetsValidos.join(', '), ')'].join(''));
      }

      var tareas = [
         'clean:dist',
         'wiredep',
         'useminPrepare',
         'concurrent:dist',
         'postcss',
         'ngtemplates',
         'concat',
         'ngAnnotate',
         'copy:dist',
         //'cdnify',
         'cssmin',
         // 'uglify',
         'filerev',
         'usemin',
         'htmlmin',
         'archivoMarcador:' + target
      ];
      if (target) {
         // Agregar tarea para colocar servidor despues de concat
         tareas.splice(tareas.indexOf('concat') + 1, 0, 'replace:' + target);
      }

      grunt.task.run(tareas);
   });

   grunt.registerTask('default', [
      'newer:jshint',
      'newer:jscs',
      'test',
      'build'
   ]);
   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-contrib-connect');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-contrib-csslint');
   grunt.loadNpmTasks('grunt-contrib-less');
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-newer');
   grunt.loadNpmTasks('grunt-wget');
};
