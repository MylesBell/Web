/*
    Service that generates the specalised tutorial for a user
*/
angular.module('myApp').service('TutorialService', function () {

    return { makeTutorial: makeTutorial };

    function makeTutorial(classNum, userTeam, specialPowers) {

        var className;
        var teamPrefix = (userTeam === 'red-team') ? "viking" : "cowboy";
        var enemyTeamPrefix = (userTeam === 'red-team') ? "cowboy" : "viking";
        var enemyName = (userTeam === 'red-team') ? "COWBOY" : "VIKING";
        var classImage = "../../resources/images/tutorial/classes/" + teamPrefix + "_";
        var classText = "";
        var specialLessons = setupSpecialTutorial(specialPowers);

        // Set the classname
        if (classNum === 0) {
            className = "HUNTER";
            classImage += "hunter_sm.jpg";
            classText = "A ranged class that can do big damage from distance, but must avoid close range combat";
        } else if (classNum === 1) {
            className = "HITMAN";
            classImage += "hitman_sm.jpg";
            classText = "A stealthy class with faster speed and ways of getting past opposing players without being detected";
        } else if (classNum === 2) {
            className = "HEALER";
            classImage += "healer_sm.jpg";
            classText = "A slow, heavy class with big attack and lots of health";
        } else {
            className = "HARDHAT";
            classImage += "hardhat_sm.jpg";
            classText = " A support class who can heal, and buff stats, of themselves and their teammates";
        }

        return [{
            tutIndex: 0,
            tutType: "single",
            tutorialTitle: "You are a " + teamPrefix.toUpperCase() + "!",
            tutorialText: "Destroy the " + enemyName + "'S base to win the game",
            tutorialImage: {
                image: "../../resources/images/tutorial/backgrounds/" + enemyTeamPrefix + "_base.jpg",
                offset_x: "50%"
            },
            visible: true
        }, {
                tutIndex: 1,
                tutType: "single",
                tutorialTitle: "You Auto-Attack enemies beside you",
                tutorialText: "Defeating enemy grunts and heros will make you stronger!",
                tutorialImage: {
                    image: "../../resources/images/tutorial/backgrounds/" + teamPrefix + "_grunt_battle.jpg", offset_x: "80%"
                },
                visible: false
            }, {
                tutIndex: 2,
                tutType: "single",
                tutorialTitle: "Capture towers for your team",
                tutorialText: "Captured towers make your army bigger!",
                tutorialImage: {
                    image: "../../resources/images/tutorial/backgrounds/tower.jpg", 
                    offset_x: "80%"
                },
                visible: false
            }, {
                tutIndex: 3,
                tutType: "single",
                tutorialTitle: "Help your team on the other side",
                tutorialText: "Travel through caves to appear on the opposite screen!",
                tutorialImage: {
                    image: "/resources/images/tutorial/backgrounds/cave.jpg",
                    offset_x: "80%"
                },
                visible: false
            }, {
                tutIndex: 4,
                tutType: "single",
                tutorialTitle: "You are a " + className,
                tutorialText: classText,
                tutorialImage: {
                    image: classImage,
                    offset_x: "50%"
                },
                visible: false
            }, {
                tutIndex: 5,
                tutType: "multi",
                tutorialTitle: "Tutorial side not shown",
                miniLessons: setupSpecialTutorial(specialPowers),
                tutorialImage: {
                    image: "../../resources/images/tutorial/backgrounds/" + teamPrefix + "_battle_with_base_background.jpg",
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