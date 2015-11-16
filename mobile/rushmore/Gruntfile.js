module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-bower-task');


    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: "./app/bower_components/"
                }
            }
        }
    });

    grunt.registerTask("default", ['bower:install']);
};