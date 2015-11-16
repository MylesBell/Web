module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-ng-constant');


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
        },
        nodemon: {
            dev: {
                script: 'local_server/server.js'
            }
        },
        ngconstant: {
            // Options for all targets
            options: {
                name: 'config',
                dest: 'app/components/config.js'
            },
            // Environment targets
            dev: {
                constants: {
                    ENV: {
                        name: 'development',
                        socketIOEndpoint: 'http://localhost:1337'
                    }
                }
            },
            prod: {
                constants: {
                    ENV: {
                        name: 'production',
                        socketIOEndpoint: 'http://icantmiss.com:1337'
                    }
                }
            }
        },
    });

    grunt.registerTask("check", ["jshint"]);
    grunt.registerTask("install", ['bower:install']);
    grunt.registerTask("server", ["nodemon:dev"]);
    grunt.registerTask("default", ["check", 'install', "server"]);
    grunt.registerTask("run-local", ["ngconstant:dev", "default"]);
    grunt.registerTask("run-prod", ["ngconstant:prod", "default"]);

};