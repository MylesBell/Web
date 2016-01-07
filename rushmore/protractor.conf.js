exports.config = {
    framework: 'jasmine',
    specs: [
        "app/views/playerCreation/playerCreationSpec.js",
        "app/views/game/gameSpec.js",
        "app/views/gameJoin/gameJoinSpec.js"
    ],
    jasmineNodeOpts: {
        isVerbose: true
    },
    framework: 'jasmine2',
    baseUrl: 'http://localhost:7777/',
}