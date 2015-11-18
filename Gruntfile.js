module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-ng-constant');
    grunt.loadNpmTasks('grunt-concurrent');


    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: "./rushmore/app/bower_components/"
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'rushmore/app/views/**/*.js', 'rushmore/app/*.js', 'rushmore/app/components/**/*.js', 'rushmore/local_server/**/*.js', 'socket_server/*.js'],
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
            angular: {
                script: 'rushmore/local_server/server.js'
            },
            socket: {
                script: 'socket_server/server.js'
            }
        },
        ngconstant: {
            // Options for all targets
            options: {
                name: 'config',
                dest: 'rushmore/app/components/config.js'
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
        concurrent: {
          run: {
            tasks: ['nodemon:angular', 'nodemon:socket'],
            options: {
              logConcurrentOutput: true
            }
          }
        },
    });

    grunt.registerTask("check", ["jshint"]);
    grunt.registerTask("install", ['bower:install']);
    grunt.registerTask("run-angular", ["nodemon:angular"]);
    grunt.registerTask("run-socket", ["nodemon:socket"]);
    grunt.registerTask("default", ["check", 'install', "concurrent:run"]);
    grunt.registerTask("run-local", ["ngconstant:dev", "default"]);
    grunt.registerTask("run-prod", ["ngconstant:prod", "default"]);

};
