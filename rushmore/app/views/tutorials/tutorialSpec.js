describe('Tutorial page', function() {
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
        expect(element(by.binding('prevText')).getText()).toBe("");
    });

    it("Next text should be next", function() {
        expect(element(by.binding('nextText')).getText()).toBe("NEXT");
    });

    it("Should be 9 tutorial lessons overall", function() {
        element.all(by.repeater('lesson in tutorial.lessons')).then(function(result) {
            expect(result.length).toBe(9);
        });
    });

    it("Should be 3 tutorial pages", function() {
        element.all(by.repeater('tutorial in tutorials')).then(function(result) {
            expect(result.length).toBe(3);
        });
    });

    it("Only 1st tutorial page is shown at the start", function() {
        expect(element(by.id("tutorial-0")).isDisplayed()).toBe(true);
        expect(element(by.id("tutorial-1")).isDisplayed()).toBe(false);
        expect(element(by.id("tutorial-2")).isDisplayed()).toBe(false);
    });

    it("Can move to the 2nd tutorial page and view only the 2nd tutorial", function() {
        element(by.id('tutorial-next-button')).click();

        expect(element(by.id("tutorial-0")).isDisplayed()).toBe(false);
        expect(element(by.id("tutorial-1")).isDisplayed()).toBe(true);
        expect(element(by.id("tutorial-2")).isDisplayed()).toBe(false);
    });

    it("Prev button should work and show text", function() {
        expect(element(by.binding('prevText')).getText()).toBe("PREV");

        element(by.id('tutorial-prev-button')).click();

        expect(element(by.id("tutorial-0")).isDisplayed()).toBe(true);
        expect(element(by.id("tutorial-1")).isDisplayed()).toBe(false);
        expect(element(by.id("tutorial-2")).isDisplayed()).toBe(false);
    });

    it("Prev button should hide again", function() {
        expect(element(by.binding('prevText')).getText()).toBe("");
    });

    it("Can advance to the last tutorial and see the lobby button", function() {

        element(by.id('tutorial-next-button')).click();
        element(by.id('tutorial-next-button')).click();

        expect(element(by.binding('nextText')).getText()).toBe("LOBBY");
        expect(element(by.id("tutorial-0")).isDisplayed()).toBe(false);
        expect(element(by.id("tutorial-1")).isDisplayed()).toBe(false);
        expect(element(by.id("tutorial-2")).isDisplayed()).toBe(true);
    });

    it("Can go to the lobby page", function() {
        element(by.id('tutorial-next-button')).click();

        expect(browser.getCurrentUrl()).toBe('http://localhost:7777/#/lobby');
    });

    it("going back from the lobby screen goes to the first tutorial again", function() {
        browser.navigate().back();

        expect(browser.getCurrentUrl()).toBe('http://localhost:7777/#/tutorial');
        expect(element(by.id("tutorial-0")).isDisplayed()).toBe(true);
        expect(element(by.id("tutorial-1")).isDisplayed()).toBe(false);
        expect(element(by.id("tutorial-2")).isDisplayed()).toBe(false);
    });

    // it("User's name should be shown in the lobby list", function() {

    //     // there may be more than one from previous tests
    //     element.all(by.repeater('playerBlue in players')).last().getText().then(function(text){
    //         expect(text).toEqual("Dave");
    //     });

    //     browser.waitForAngular();

    // });

});