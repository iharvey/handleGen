module.exports = function(grunt) {

    var util = require('./grunt-helpers.js')(grunt);

    grunt.registerTask('monitor', 'Alias for watch:locale', function() {

        if (arguments.length === 0) {
            grunt.log.error(this.name + " error - no locale specified.");
            return false;
        } else if (arguments.length === 1) {
            grunt.task.run([
                'watch:locale:' + this.args,
            ]);
        } else {
            grunt.log.writeln(this.name + " error - one locale at a time.");
            return false;
        }
    });


    grunt.registerTask('compile', 'Build process', function(service) {

        if (arguments.length === 0) {
            // Need a locale to be specified, abort if not
            grunt.log.error(this.name + ", no locale - aborting");
            return false;
        } else {

            // We have one or more build targets - check they all exist and abort if not
            for (var i = 0, len = this.args.length; i < len; i++) {
                if (!util.serviceExists(this.args[i])) {
                    grunt.log.error(this.args[i] + ' - Sorry, that service does not exist');
                    return false;
                }
            };

            // If we're still here, run the build for each of the targets
            for (var i = 0, len = this.args.length; i < len; i++) {
                grunt.task.run([
                    'clean:tmp',
                    'jshint:locale:' + this.args[i],
                    'compile-handlebars:locale:' + this.args[i],
                    'prettify:locale:' + this.args[i],
                    'clean:tmp'
                ]);
            };
        }
    });

};
