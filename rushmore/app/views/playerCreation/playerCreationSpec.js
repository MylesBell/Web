describe('Player Creation page', function() {
    it('should have a title', function() {

        //navigate to the website
        browser.get('/');

        browser.waitForAngular();

        expect(browser.getTitle()).toEqual('Rushmore');
    });

    it("clicking input box clears the text inside", function() {

        browser.waitForAngular();

        var inputBox = element(by.css('#player-name-input-box'));

        inputBox.click();
        browser.waitForAngular();

        expect(inputBox.getAttribute('value')).toEqual('');
    });

    it('can enter a name into the input box', function() {

        var inputBox = element(by.css('#player-name-input-box'));
        inputBox.click();
        inputBox.sendKeys("James");

        expect(inputBox.getAttribute('value')).toEqual('James');
    });

    it('entering no name shows error on page', function() {

        var inputBox = element(by.css('#player-name-input-box'));
        var submitButton = element(by.css('#submit-button'));

        inputBox.click();
        submitButton.click();

        expect(inputBox.getAttribute('value')).toEqual('Too Short');
    });

    it('entering a name over 20 characters shows error on page', function() {

        var inputBox = element(by.css('#player-name-input-box'));
        var submitButton = element(by.css('#submit-button'));

        inputBox.click();
        inputBox.sendKeys("aaaaaaaaaaaaaaaaaaaaa");
        submitButton.click();

        expect(inputBox.getAttribute('value')).toEqual('Too Long');
    });

    it('entering a valid name moves the user to the game join page', function() {

        var inputBox = element(by.css('#player-name-input-box'));
        var submitButton = element(by.css('#submit-button'));

        inputBox.click();
        inputBox.sendKeys("Dave");
        submitButton.click();

        expect(browser.getCurrentUrl()).toBe('http://localhost:7777/#/join');
    });
});