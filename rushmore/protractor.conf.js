exports.config = {
    framework: 'jasmine',
    specs: [
        "app/views/playerCreation/playerCreationSpec.js",
        "app/views/gameJoin/gameJoinSpec.js",
        "app/views/tutorials/tutorialSpec.js",
        "app/views/lobby/lobbySpec.js"
    ],
    jasmineNodeOpts: {
        isVerbose: true
    },
    capabilities: {
        'browserName': 'chrome',
    },
    files: [
        'app/bower_components/angular/angular.js',
        'app/app.js'
    ],
    rootElement: "[ng-app]",
    getPageTimeout: 300000,
    allScriptsTimeout: 300000,
    framework: 'jasmine2',
    baseUrl: 'http://localhost:7777/',
    onPrepare: function() {
        browser.driver.get(browser.baseUrl);
    }

}