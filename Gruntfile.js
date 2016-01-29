module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-ng-constant');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-protractor-runner');    
    grunt.loadNpmTasks('grunt-selenium-webdriver');
    grunt.loadNpmTasks('grunt-contrib-watch');

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
        express: {
            angular_loc: {
                options: {
                    script: 'rushmore/local_server/server.js',
                    port: '7777'
                }
            },
            angular_prod: {                
                options: {
                    script: 'rushmore/local_server/server.js',
                    port: '3000' // we port forward all 80 traffic to 3000                
                }
            },
            socket: {
                options: {
                    script: 'socket_server/server.js',
                    args: ['LOGGINGLEVEL=FULL']
                }
            },
            socket_test: {
                options: {
                    script: 'socket_server/server.js',
                    args: ['LOGGINGLEVEL=SILENT', 'TESTING=TRUE']
                }
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
            dev_phone: {
                constants: {
                    ENV: {
                        name: 'development',
                        socketIOEndpoint: 'http://192.168.0.9:1337'
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
        protractor: {
            options: {
                configFile: 'rushmore/protractor.conf.js',
                args: {
                    "verbose": "true"
                }
            },
            e2e: {
                options: {
                    // Stops Grunt process if a test fails
                    keepAlive: false
                }
            }
        },
        watch: {
            angular: {
                files: ['rushmore/local_server/*.js'],
                tasks: ['express:angular_loc'],
                options: {
                    spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
                }
            },
            socket: {
               files: ['socket_server/*.js'],
                tasks: ['express:socket'],
                options: {
                    spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
                } 
            },
            socket_test: {
               files: ['socket_server/*.js'],
                tasks: ['express:socket_test'],
                options: {
                    spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
                } 
            }
        },
        selenium_start: {
            options: {
                port: 4444,
                args: {
                }
            }
        },
    });

    grunt.registerTask("check", ["jshint"]);
    grunt.registerTask("install", ['bower:install']);
    grunt.registerTask('e2e-test', ["check", 'ngconstant:dev', "express:angular_loc", "express:socket_test", 'selenium_start', 'protractor:e2e']);
    grunt.registerTask("run-socket", ["express:socket"]);
    grunt.registerTask("default", ["check", 'install']);
    grunt.registerTask("run-angular-local-phone", ["default", "ngconstant:dev_phone", "express:angular_loc", "watch:angular"]);
    grunt.registerTask("run-angular-local", ["default", "ngconstant:dev", "express:angular_loc", "watch:angular"]);
    grunt.registerTask("run-angular-prod", ["default", "ngconstant:prod", "express:angular_prod", "watch:angular"]);
    grunt.registerTask("run-socket-prod", ["default", "express:socket", "watch:socket"]);
    grunt.registerTask("run-socket-test", ["default", "express:socket_test", "watch:socket_test"]);
    grunt.registerTask("run-socket-local", ["default", "express:socket", "watch:socket"]);

    grunt.registerTask("run-concurrent-local", ["concurrent:run"]);

};
