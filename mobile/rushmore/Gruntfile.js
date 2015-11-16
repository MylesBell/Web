module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: "./app/bower_components/"
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'app/views/**/*.js', 'app/*.js', 'app/components/**/*.js', 'local_server/**/*.js'],
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true,
                    angular: true,
                    console: true
                }
            }
        }
    });

    grunt.registerTask("check", ["jshint"]);
    grunt.registerTask("install", ['bower:install']);
    grunt.registerTask("default", ["check", 'install']);
};