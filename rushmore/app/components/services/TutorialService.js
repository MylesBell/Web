/*
    Service that generates the specalised tutorial for a user
*/
angular.module('myApp').service('TutorialService', function () {

    return { makeTutorial: makeTutorial };

    function makeTutorial(classNum, userTeam, specialPowers) {

        var className;
        var teamPrefix = (userTeam === 'red-team') ? "viking" : "cowboy";
        var enemyName = (userTeam === 'red-team') ? "COWBOY" : "VIKING";
        var classImage = "../../resources/images/tutorial/classes/" + teamPrefix + "_";
        var specialLessons = setupSpecialTutorial(specialPowers);

        // Set the classname
        if (classNum === 0) {
            className = "HUNTER";
            classImage += "hunter_sm.png";
        } else if (classNum === 1) {
            className = "HITMAN";
            classImage += "hitman_sm.png";

        } else if (classNum === 2) {
            className = "HEALER";
            classImage += "healer_sm.png";
        } else {
            className = "HARDHAT";
            classImage += "hardhat_sm.png";
        }

        return [{
            tutIndex: 0,
            tutType: "single",
            tutorialTitle: "Vikings and Cowboys are locked in endless war",
            tutorialText: "Destroy the " + enemyName + "'S base to win the game",
            tutorialImage: {
                image: "../../resources/images/tutorial/base_cowboy_blur.png",
                offset_x: "50%"
            },
            visible: true
        }, {
                tutIndex: 1,
                tutType: "single",
                tutorialTitle: "You Auto-Attack enemies beside you",
                tutorialText: "Defeating enemy grunts and heros will make you stronger",
                tutorialImage: {
                    image: "../../resources/images/tutorial/grunts_blue_base_behind_blur.png",
                    offset_x: "80%"
                },
                visible: false
            }, {
                tutIndex: 2,
                tutType: "single",
                tutorialTitle: "You are a " + className,
                tutorialText: "Use your unique special powers influence the battle",
                tutorialImage: {
                    image: classImage,
                    offset_x: "50%"
                },
                visible: false
            }, {
                tutIndex: 3,
                tutType: "multi",
                tutorialTitle: "Tutorial side not shown",
                miniLessons: setupSpecialTutorial(specialPowers),
                tutorialImage: {
                    image: "../../resources/images/tutorial/grunts_blue_base_behind_blur.png",
                    offset_x: "80%"
                },
                visible: false
            }];

    }

    function setupSpecialTutorial(specials) {
        var specialTutorial = [];

        for (var i = 0; i < specials.length; i++) {
            var spec = specials[i];
            var lesson = {};
            lesson.text = spec.name;
            lesson.image = "../resources/" + spec.image;
            lesson.description = spec.description;
            specialTutorial.push(lesson);
        }

        return specialTutorial;
    }

});