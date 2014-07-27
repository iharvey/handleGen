'use strict';
// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {
    require('jit-grunt')(grunt);

    grunt.initConfig({

        watch: {
            options: {
                atBegin: true
            },
            locale: {
                files: [
                    // templates to be watched for updates
                    'dev/locale/<%= grunt.task.current.args[1] %>/**/*.hbs',
                    'dev/shared/partials/*.hbs',
                    //data sources to be watched for updates
                    'dev/locale/<%= grunt.task.current.args[1] %>/**/*.json',
                    'dev/shared/globals/**/*.json'
                ],
                tasks: [
                    'jshint:locale:<%= grunt.task.current.args[1] %>',
                    'compile:<%= grunt.task.current.args[1] %>'
                ]
            },
            js: {
                files: [
                    'dev/locale/**/*.json',
                    'dev/shared/helpers/**/*.js'
                ],
                tasks: ['newer:jshint:all']
            }
        },

        'compile-handlebars': {
            locale: {
                output: 'tmp/<%= grunt.task.current.args[0] %>/**/*.html',
                template: 'dev/locale/<%= grunt.task.current.args[0] %>/pages/**/*.hbs',
                templateData: 'dev/locale/<%= grunt.task.current.args[0] %>/json/**/*.json',

                globals: [
                    // Global files need to be explicitly added by name
                    'dev/shared/globals/globals.json',
                    'dev/shared/globals/productsdata.json',
                    // Load order is important for locale to override shared
                    'dev/locale/<%= grunt.task.current.args[0] %>/json/locale_globals.json',
                ],

                helpers: ['dev/shared/helpers/**/*.js'],
                partials: ['dev/shared/partials/**/*.hbs']
            }
        },

        jshint: {
            options: {
                debugInfo: true,
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
            },
            all: [
                'dev/shared/helpers/**/*.js',
                'dev/locale/**/*.json'
            ],
            locale: [
                'dev/locale/<%= grunt.task.current.args[0] %>/json/**/*.json'
            ]
        },

        prettify: {
            options: {
                config: '.prettifyrc'
            },
            locale: {
                expand: true,
                cwd: 'tmp/<%= grunt.task.current.args[1] %>',
                ext: '.html',
                src: ['**/*.html'],
                dest: 'build'
            },
        },

        clean: {
            build: ['build'],
            tmp: ['tmp']
        }

    });

    require('./grunt-customtasks.js')(grunt);
};
