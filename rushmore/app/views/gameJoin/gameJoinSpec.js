describe('Game Join page', function() {
    it('can get the the game join page', function() {

        //navigate to the website
        browser.get('http://localhost:7777/');

        //enter a correct name and move to the game page
        var inputBox = element(by.css('#player-name-input-box'));
        var submitButton = element(by.css('#submit-button'));

        inputBox.click();
        inputBox.sendKeys("Dave");
        submitButton.click();

        browser.waitForAngular();

        expect(browser.getCurrentUrl()).toBe('http://localhost:7777/#/join');
    });

    it("clicking input box clears the text inside", function() {
        var inputBox = element(by.css('#game-code-input-box'));
        inputBox.click();

        expect(inputBox.getAttribute('value')).toEqual('');
    });

    // it('can enter a name into the input box', function() {

    //     var inputBox = element(by.css('#player-name-input-box'));
    //     inputBox.click();
    //     inputBox.sendKeys("James");

    //     expect(inputBox.getAttribute('value')).toEqual('James');
    // });

    // it('entering no name shows error on page', function() {

    //     var inputBox = element(by.css('#player-name-input-box'));
    //     var submitButton = element(by.css('#submit-button'));

    //     inputBox.click();
    //     submitButton.click();

    //     expect(inputBox.getAttribute('value')).toEqual('Name must be a least one character long');
    // });

    // it('entering a name over 20 characters shows error on page', function() {

    //     var inputBox = element(by.css('#player-name-input-box'));
    //     var submitButton = element(by.css('#submit-button'));

    //     inputBox.click();
    //     inputBox.sendKeys("aaaaaaaaaaaaaaaaaaaaa");
    //     submitButton.click();

    //     expect(inputBox.getAttribute('value')).toEqual('Name must be less than 20 characters');
    // });

    // it('entering a valid name moves the user to the game join page', function() {

    //     var inputBox = element(by.css('#player-name-input-box'));
    //     var submitButton = element(by.css('#submit-button'));

    //     inputBox.click();
    //     inputBox.sendKeys("Dave");
    //     submitButton.click();

    //     expect(browser.getCurrentUrl()).toBe('http://localhost:7777/#/join');
    // });
});