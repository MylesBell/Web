module.exports = function (grunt) {

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
            angular_loc: {
                script: 'rushmore/local_server/server.js',
                options: {
                    env: {
                        PORT: '7777'
                    },
                }
            },
            angular_prod: {
                script: 'rushmore/local_server/server.js',
                options: {
                    env: {
                        PORT: '3000' // we port forward all 80 traffic to 3000
                    },
                }
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
                tasks: ['run-angular-local', 'run-socket-prod'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
    });

    grunt.registerTask("check", ["jshint"]);
    grunt.registerTask("install", ['bower:install']);
    grunt.registerTask("run-socket", ["nodemon:socket"]);
    grunt.registerTask("default", ["check", 'install']);
    grunt.registerTask("run-angular-local", ["default", "ngconstant:dev", "nodemon:angular_loc"]);
    grunt.registerTask("run-angular-prod", ["default", "ngconstant:prod", "nodemon:angular_prod"]);
    grunt.registerTask("run-socket-prod", ["default", "nodemon:socket"]);
    
    grunt.registerTask("run-concurrent-local", ["concurrent:run"]);

};
