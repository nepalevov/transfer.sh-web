'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);
    // show elapsed time at the end
    require('time-grunt')(grunt);

    // configurable paths
    var yeomanConfig = {
        app: 'src',
        dist: 'dist/'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        googlefonts: {
            build: {
                options: {
                    fontPath: 'dist/fonts/',
                    httpPath: '../fonts/',
                    cssFile: 'dist/fonts/fonts.css',
                    fonts: [
                        {
                            family: 'Source Sans Pro',
                            styles: [200, 300],
                            subsets: ['latin', 'greek', 'cyrillic']
                        },
                        {
                            family: 'Droid Sans Mono',
                            styles: [400],
                            subsets: ['latin', 'greek', 'cyrillic']
                        },
                    ]
                }
            }
        },
        watch: {
            less: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.less'],
                tasks: ['less']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            scripts: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
                tasks: ['concat']
            },
            includes: {
                files: ['<%= yeoman.app %>/*.html', '<%= yeoman.app %>/snippets/*'],
                tasks: ['includes:server', 'snippets:server']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: ['includes:server', 'snippets:server']
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>',
                        '<%= yeoman.dist %>',
                        '.'
                    ]
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= yeoman.dist %>'
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },


        less: {
            dist: {
                files: {
                    '<%= yeoman.app %>/styles/main.css': ['<%= yeoman.app %>/styles/main.less']
                },
                options: {
                    sourceMap: true,
                    sourceMapFilename: '<%= yeoman.app %>/styles/main.css.map',
                    sourceMapBasepath: '<%= yeoman.app %>/',
                    sourceMapRootpath: '/'
                }
            }
        },

        includes: {
            build: {
                cwd: '<%= yeoman.app %>',
                src: ['*.html', 'includes/*.html'],
                dest: '<%= yeoman.dist %>',
                options: {
                    flatten: true,
                    banner: ''
                }
            },
            server: {
                cwd: '<%= yeoman.app %>',
                src: ['*.html', 'includes/*.html'],
                dest: '.tmp',
                options: {
                    flatten: true,
                    banner: ''
                }
            }
        },
        concat: {
            generated: {
                files: [
                    {
                        dest: '.tmp/scripts/main.js',
                        src: [
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/urijs/src/URI.min.js',
                            'node_modules/bootstrap/js/transition.js',
                            'node_modules/bootstrap/js/collapse.js',
                            '<%= yeoman.app %>/scripts/typewriter-bundle.js',
                            '<%= yeoman.app %>/scripts/base.js'
                        ]
                    },
                    {
                        dest: '.tmp/scripts/vendor/modernizr.js',
                        src: ['<%= yeoman.app %>/scripts/vendor/modernizr.js']
                    },
                    {
                        dest: '.tmp/scripts/vendor/video.js',
                        src: ['node_modules/video.js/dist/video.js']
                    }
                ]
            }
        },
        uglify: {
            generated: {
                options: {
                    mangle: {},
                    compress: {}
                },
                files: [
                    {
                        dest: '<%= yeoman.dist %>/scripts/main.js',
                        src: ['.tmp/scripts/main.js']
                    },
                    {
                        dest: '<%= yeoman.dist %>/scripts/vendor/modernizr.js',
                        src: ['.tmp/scripts/vendor/modernizr.js']
                    },
                    {
                        dest: '<%= yeoman.dist %>/scripts/vendor/video.js',
                        src: ['.tmp/scripts/vendor/video.js']
                    }
                ]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%= yeoman.app %>/styles/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        'fonts/{,*/}*.*',
                        '.htaccess',
                        'index.txt',
                        '404.txt',
                        'images/{,*/}*.{webp,gif,svg}'
                    ]
                }]
            }
        },
        concurrent: {
            dist: [
                'less',
                'htmlmin'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-google-fonts');

    grunt.registerTask('snippets', 'Insert escaped plain-text code snippets.', function (target) {
        var renderSnippets = require('./lib/snippets');
        var path = require('path');
        var output = target === 'server' ? '.tmp' : yeomanConfig.dist;

        grunt.file.expand({ cwd: output }, '*.html').forEach(function (name) {
            var file = path.join(output, name);
            grunt.file.write(file, renderSnippets(grunt.file.read(file), function (snippet) {
                return grunt.file.read(path.join(yeomanConfig.app, 'snippets', snippet));
            }));
        });
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'googlefonts',
            'less',
            'concat',
            'includes:server',
            'snippets:server',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function () {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('test', [
        'clean:server',
        'less',
        'connect:test'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'googlefonts',
        'concurrent',
        'cssmin',
        'concat',
        'includes:build',
        'snippets:build',
        'uglify',
        'copy'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
