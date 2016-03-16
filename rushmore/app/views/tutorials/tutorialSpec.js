/*jshint loopfunc: true */

describe('Tutorial page', function() {

    var tutorialName = "tutorial-";
    var numTutorials = 4;

    it('can get to the tutorial page', function() {

        //navigate to the website
        browser.get('http://localhost:7777/');

        //enter a correct name and move to the game page
        var inputBox = element(by.css('#player-name-input-box'));
        var submitButton = element(by.css('#submit-button'));

        inputBox.click();
        inputBox.sendKeys("Dave");
        submitButton.click();

        // move to the lobby page
        inputBox = element(by.css('#game-code-input-box'));
        submitButton = element(by.css('#game-join-button'));

        inputBox.click();
        inputBox.sendKeys("FAKE");
        submitButton.click();

        expect(browser.getCurrentUrl()).toBe('http://localhost:7777/#/tutorial');
    });

    it("Prev text should be blank", function() {
        expect(element(by.binding('prevText')).getText()).toBe("SKIP");
    });

    it("Next text should be next", function() {
        expect(element(by.binding('nextText')).getText()).toBe("NEXT");
    });

    it("Should be " + numTutorials  + " tutorial pages", function() {
        element.all(by.repeater('tutorial in tutorials')).then(function(result) {
            expect(result.length).toBe(4);
        });
    });

    it("Only 1st tutorial page is shown at the start", function() {
        expect(element(by.id(tutorialName + "0")).isDisplayed()).toBe(true);
        expect(element(by.id(tutorialName + "1")).isDisplayed()).toBe(false);
        expect(element(by.id(tutorialName + "2")).isDisplayed()).toBe(false);
    });

    it("Next button moves to the 2nd tutorial page and view only the 2nd tutorial", function() {
        element(by.id('tutorial-next-button')).click();

        var EC = protractor.ExpectedConditions;

        // Tut 1 should be dispayed
        var tut1Displayed = function() {
            return element(by.id(tutorialName + "1")).isDisplayed().then(function(displayed) {
                return displayed;
            });
        };

        // Tut 0 should be hidden
        var tut0Hidden = function() {
            return element(by.id(tutorialName + "0")).isDisplayed().then(function(displayed) {
                return !displayed;
            });
        };

        var condition = EC.and(tut1Displayed, tut0Hidden);

        // Wait for the animations to complete
        browser.wait(condition, 10000);

        var expectedDisplayedStates = [false, true, false, false, false];

        // Check the expected values
        for (var i = 0; i < numTutorials; i++) {
            expect(element(by.id(tutorialName + i)).isDisplayed()).toBe(expectedDisplayedStates[i]);
        }
    });

    it("Prev button should show last tutorial correctly", function() {

        expect(element(by.binding('prevText')).getText()).toBe("PREV");

        element(by.id('tutorial-prev-button')).click();

        var EC = protractor.ExpectedConditions;

        // Tut 1 should be dispayed
        var tut1Hidden = function() {
            return element(by.id(tutorialName + "1")).isDisplayed().then(function(displayed) {
                return !displayed;
            });
        };

        // Tut 0 should be hidden
        var tut0Displayed = function() {
            return element(by.id(tutorialName + "0")).isDisplayed().then(function(displayed) {
                return displayed;
            });
        };

        var condition = EC.and(tut0Displayed, tut1Hidden);

        // Wait for the animations to complete
        browser.wait(condition, 10000);

        var expectedDisplayedStates = [true, false, false, false, false];

        // Check the expected values
        for (var i = 0; i < numTutorials; i++) {
            expect(element(by.id(tutorialName + i)).isDisplayed()).toBe(expectedDisplayedStates[i]);
        }
    });

    it("Prev button should go to skip again", function() {
        expect(element(by.binding('prevText')).getText()).toBe("SKIP");
    });

    it("Can advance to the last tutorial and see the lobby button", function() {

        // Here be promises magic

        for (var i = 0; i < numTutorials - 1; i++) {

            element(by.id('tutorial-next-button')).click();

            // console.log("from:" + i + " to: " + (i + 1));

            var EC = protractor.ExpectedConditions;

            // Next tutorial should be dispayed
            var tutNextDisplayed = (function() {

                // cature the current value of i in a closure so that when the promise fufills i is set to the value
                // it was when the test was set, not the last value i ever was
                var capturedI = i;

                return function() {
                    return element(by.id(tutorialName + (capturedI + 1))).isDisplayed().then(function(displayed) {
                        return displayed;
                    });
                };

            })();

            // Previous tutorial should be hidden
            var tutPrevHidden = (function() {

                var capturedI = i;

                return function() {

                    return element(by.id(tutorialName + capturedI)).isDisplayed().then(function(displayed) {
                        return !displayed;
                    });
                };

            })();

            var condition = EC.and(tutNextDisplayed, tutPrevHidden);

            // Wait for the animations to complete
            browser.wait(condition, 10000);

            // Check the expected values
            for (var j = 0; j < numTutorials; j++) {
                var expectedValue = (j === (i + 1)) ? true : false;
                // console.log("page: " + j + " current active page: " + (i + 1) + " displayed: " + expectedValue);
                expect(element(by.id(tutorialName + j)).isDisplayed()).toBe(expectedValue);
            }
        }

    });

    it("Can go to the lobby page", function() {
        expect(element(by.binding('nextText')).getText()).toBe("TO LOBBY");

        element(by.id('tutorial-next-button')).click();

        expect(browser.getCurrentUrl()).toBe('http://localhost:7777/#/lobby');
    });

    it("going back from the lobby screen goes to the first tutorial again", function() {
        browser.navigate().back();

        expect(browser.getCurrentUrl()).toBe('http://localhost:7777/#/tutorial');
        var expectedDisplayedStates = [true, false, false, false, false];

        // Check the expected values
        for (var i = 0; i < numTutorials; i++) {
            expect(element(by.id(tutorialName + i)).isDisplayed()).toBe(expectedDisplayedStates[i]);
        }
    });

});