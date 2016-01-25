describe('Lobby page', function() {
    it('should have a title', function() {

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

        expect(browser.getCurrentUrl()).toBe('http://localhost:7777/#/lobby');
    });

    it("Should be at least one player in the lobby when joining", function() {

        // there may be more than one from previous tests
        element.all(by.repeater('playerBlue in players')).count().then(function(count) {
            expect(count).not.toBeLessThan(1);
        });

        browser.waitForAngular();

    });

    it("User's name should be shown in the lobby list", function() {

        // there may be more than one from previous tests
        element.all(by.repeater('playerBlue in players')).last().getText().then(function(text){
            expect(text).toEqual("Dave");
        });

        browser.waitForAngular();

    });

});