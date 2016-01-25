exports.config = {
    framework: 'jasmine',
    specs: [
        // "app/views/playerCreation/playerCreationSpec.js",
        // "app/views/game/gameSpec.js",
        // "app/views/gameJoin/gameJoinSpec.js",
        "app/views/lobby/lobbySpec.js"
    ],
    jasmineNodeOpts: {
        isVerbose: true
    },
    capabilities: {
        'browserName': 'chrome',        
    },
    rootElement: "[ng-app]",    
    getPageTimeout: 300000,
    allScriptsTimeout: 300000,
    framework: 'jasmine2',
    baseUrl: 'http://localhost:7777/',
}