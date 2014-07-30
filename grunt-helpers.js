'use strict';

module.exports = function(grunt) {

    function removePath(element) {
        return element.split('/').pop();
    }

    function removeBlacklistedDirectories(element) {
        if (element.indexOf('foo') !== -1) {
            return false;
        }
        return true;
    }

    return {
        services: grunt.file.expand('dev/locale/*').map(removePath).filter(removeBlacklistedDirectories),

        serviceExists: function(service) {
            if (this.services.indexOf(service) !== -1) {
                return true;
            }
            return false;
        },

        isBlacklistedTask: function(task) {
            var tasks = ['pkg', 'dir', 'noop', 'config'];
            if (tasks.indexOf(task) !== -1) {
                return true;
            }
            return false;
        }
    };
};
