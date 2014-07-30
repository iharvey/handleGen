'use strict';
// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

    require('jit-grunt')(grunt);

    grunt.initConfig({

        vars: {
            // we can set up some reusable variables for folder names
            tmp : 'tmp',
            build: 'build',
            localeC : '<%= grunt.task.current.args[0] %>',
            localeW : '<%= grunt.task.current.args[1] %>'
        },

        watch: {
        // https://github.com/gruntjs/grunt-contrib-watch
        // monitor for file changes and run the prescribed task(s)
            options: {
                atBegin: true
            },
            // Locale watcher, monitor for file updates and run the assoc task
            // would expect grunt watch:locale:xx if called directly,
            // instead use the alias monitor task, grunt monitor:xx
            locale: {
                files: [
                    // templates to be watched for updates the placeholder - vars.localeW will equal
                    // the locale argument & folder name from grunt monitor:xx or grunt watch:locale:xx
                    'dev/locale/<%= vars.localeW %>/**/*.hbs',
                    'dev/shared/partials/*.hbs',
                    // associated data sources to be watched for updates
                    'dev/locale/<%= vars.localeW %>/**/*.json',
                    'dev/shared/globals/**/*.json'
                ],
                tasks: [
                    // the task(s) to run on change - pass to the compiler
                    'compile:<%= vars.localeW %>'
                ]
            },

            // or grunt watch:js to monitor the following files for changes and run the jshint.all task
            js: {
                files: [
                    'dev/locale/**/*.json',
                    'dev/shared/helpers/**/*.js',
                    //'Gruntfile.js',
                    //'grunt-helpers.js',
                    //'grunt-customtasks.js',
                ],
                tasks: ['jshint:all']
            }
        },

        'compile-handlebars': {
        // https://github.com/patrickkettner/grunt-compile-handlebars
        // Compiles handlebar templates, outputs static HTML
            locale: {
            // Locale compiler - combine the hbs template with its assoc json file and any globals
            // would expect grunt compile-handlebars:locale:xx if called directly,
            // instead use the alias compile, ie. grunt compile:xx, or grunt compile:xx:yy:zz

                template: 'dev/locale/<%= vars.localeC %>/pages/**/*.hbs',
                templateData: 'dev/locale/<%= vars.localeC %>/json/**/*.json',
                output: 'tmp/<%= vars.localeC %>/**/*.html',

                globals: [
                    // Global files need to be explicitly added by name
                    'dev/shared/globals/globals.json',
                    'dev/shared/globals/productsdata.json',
                    // Load order is important for a locale to override a shared global
                    'dev/locale/<%= vars.localeC %>/json/locale_globals.json',
                ],
                helpers: ['dev/shared/helpers/**/*.js'],
                partials: ['dev/shared/partials/**/*.hbs']
            }
        },

        // https://github.com/gruntjs/grunt-contrib-jshint
        // for linting of all js code and json data
        jshint: {
            options: {
                debugInfo: true,
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
            },
            // triggered via grunt:watch:js, monitors and reports issues across all js and json files
            all: [
                // use the files already set in watch:js task config
                '<%= watch.js.files %>'
            ],
            // triggered via grunt:compile:xx process, lints json data sources for errors
            locale: [
                'dev/locale/<%= vars.localeW %>/**/*.json',
                'dev/shared/globals/**/*.json'
            ]
        },

        // https://github.com/jonschlinkert/grunt-prettify
        // reindents and strips whitespace from the html gen'd by the compile: task, copies from tmp to build
        prettify: {
            options: {
                config: '.prettifyrc'
            },
            locale: {
                expand: true,
                cwd: '<%= vars.tmp %>/<%= vars.localeW %>',
                ext: '.html',
                src: ['**/*.html'],
                dest: '<%= vars.build %>'
            },
        },

        // https://github.com/gruntjs/grunt-contrib-clean
        // grunt clean (or grunt clean:tmp / clean:build) - delete generated folders
        clean: {
            build: ['<%= vars.build %>'],
            tmp: ['<%= vars.tmp %>']
        }

    });

    // custom tasks containing logic are this way
    require('./grunt-customtasks.js')(grunt);
};
