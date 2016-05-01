describe('Lobby page', function () {

    var gameStateUpdateCallback;

    // Mocked out User service
    var UserServiceMock = function () {
        var UserServiceMockModule = angular.module('UserServiceModule', []);

        UserServiceMockModule.service('UserService', ['$q', function ($q) {
            this.getUsername = function () {
                return "James Hayes";
            };

            this.getUserTeam = function () {
                return "blue-team";
            };

            this.getGameState = function () {
                return 0;
            };

            this.getHeroClass = function () {
                return 1;
            };

            // Allways allow attempt to register with server
            this.registerUserWithServer = function (name) {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            };

            this.attemptToJoinGame = function (gamecode) {
                var deferred = $q.defer();
                deferred.resolve({
                    state: 0
                });
                return deferred.promise;
            };

            // Give them some empty bollocks
            this.getSpecialPowers = function () {
                return [{
                    id: 0
                }, {
                        id: 1
                    }, {
                        id: 2
                    }];
            };

            // Just return a shitting color
            this.getTeamColor = function () {
                return {
                    blue: {
                        dark: "#ffffff"
                    }
                };
            };
        }]);
    };

    // Mock the info service
    // No User was registered with the server so must mock the player list 
    var GameInfoServiceMock = function () {
        var GameInfoServiceMockModule = angular.module('GameInfoServiceModule', []);

        GameInfoServiceMockModule.service('GameInfoService', function () {
            this.getPlayerList = function () {
                return [{
                    username: "Dave",
                    team: 1,
                    lane: "Left"
                }];
            };
            
            this.getGameState = function(){
                return 0;
            };
        });
    };

    // Add mocked modules and capture console.log output in browser
    beforeEach(function () {
        browser.addMockModule('UserServiceModule', UserServiceMock);
        browser.addMockModule('GameInfoServiceModule', GameInfoServiceMock);
        // browser.addMockModule('$rootScope', RootScopeMock);

        browser.manage().logs().get('browser').then(function (browserLogs) {
            // browserLogs is an array of objects with level and message fields
            browserLogs.forEach(function (log) {
                if (log.level.value > 900) { // it's an error log
                    console.log('Browser console error!');
                    console.log(log.message);
                }
            });
        });
    });

    it('can get to the lobby', function () {

        //navigate to the website
        browser.get('http://localhost:7777/');

        var joinbox = element(by.css('#submit-button'));
        //enter a correct name and move to the game page
        var inputBox = element(by.css('#player-name-input-box'));
        var submitButton = element(by.css('#submit-button'));
        
        joinbox.click();
        inputBox.click();
        inputBox.sendKeys("Dave");
        submitButton.click();

        // enter the game code
        inputBox = element(by.css('#game-code-input-box'));
        submitButton = element(by.css('#game-join-button'));

        inputBox.click();
        inputBox.sendKeys("FAKE");
        submitButton.click();

        expect(browser.getCurrentUrl()).toBe('http://localhost:7777/#/tutorial');

        // Go past the tutorial using skip
        element(by.id('tutorial-prev-button')).click();

        expect(browser.getCurrentUrl()).toBe('http://localhost:7777/#/lobby');
    });

    it("Should be at least one player in the lobby when joining", function () {

        // there may be more than one from previous tests
        element.all(by.repeater('player in bluePlayers')).count().then(function (count) {
            expect(count).not.toBeLessThan(1);
        });

        browser.waitForAngular();
    });

    it("User's name should be shown in the lobby list", function () {

        // there may be more than one from previous tests
        element.all(by.repeater('player in bluePlayers')).last().getText().then(function (text) {
            expect(text).toEqual("Dave -- (Left Lane) -- HARDHAT");
        });

        browser.waitForAngular();
    });

    it("Start button should be enabled if game state is already running (1)", function () {

        expect(element(by.id('lobby-footer')).getAttribute('class')).toMatch('disabled');

        browser.waitForAngular();

        browser.executeAsyncScript(function () {
            var callback = arguments[arguments.length - 1];
            console.error("HELLO I'M HERE");
            console.error(angular.element(document.getElementById('lobby-container')).scope());
            var sc = angular.element(document.getElementById('lobby-container')).scope();
            sc.$emit('gameStateUpdate', {
                state: 1
            });

            callback();

            return "hello me";
        }).then(function () {

            // Wait for things to happen, idk ()
            browser.sleep(5000);

            expect(element(by.id('lobby-footer')).getAttribute('class')).toMatch('enabled');
        });
    });

    it("Start button should move user to the game page when clicked", function () {

        element(by.id('lobby-footer')).click();
        expect(browser.getCurrentUrl()).toBe('http://localhost:7777/#/game');
        browser.waitForAngular();
    });

});