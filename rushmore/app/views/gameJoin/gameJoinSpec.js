describe('Game Join page', function () {

    it('can get the the game join page', function () {

        //navigate to the website
        browser.get('http://localhost:7777/');

        //enter a correct name and move to the game page
        var joinbox = element(by.css('#start-button'));
        var inputBox = element(by.css('#player-name-input-box'));
        var submitButton = element(by.css('#submit-button'));

        joinbox.click();
        inputBox.click();
        inputBox.sendKeys("Dave");
        submitButton.click();

        browser.waitForAngular();

        expect(browser.getCurrentUrl()).toBe('http://localhost:7777/#/join');
    });

    it("clicking input box clears the text inside", function () {
        var inputBox = element(by.css('#game-code-input-box'));
        inputBox.click();

        expect(inputBox.getAttribute('value')).toEqual('');
    });

    it('can enter a code into the input box', function () {

        var inputBox = element(by.css('#game-code-input-box'));
        inputBox.click();
        inputBox.sendKeys("thisisacode");

        expect(inputBox.getAttribute('value')).toEqual('thisisacode');
    });

    it('entering no code shows error on page', function () {

        var inputBox = element(by.css('#game-code-input-box'));
        var submitButton = element(by.css('#game-join-button'));

        inputBox.click();
        submitButton.click();

        expect(inputBox.getAttribute('value')).toEqual('Gamecodes should be 4 characters long');
    });

    it('entering code over 4 characters shows error on page', function () {

        var inputBox = element(by.css('#game-code-input-box'));
        var submitButton = element(by.css('#game-join-button'));

        inputBox.sendKeys("thisisacode");

        inputBox.click();
        submitButton.click();

        expect(inputBox.getAttribute('value')).toEqual('Gamecodes should be 4 characters long');
    });

    it('entering a valid game code moves the user to the tutorial pages', function () {

        var inputBox = element(by.css('#game-code-input-box'));
        var submitButton = element(by.css('#game-join-button'));

        inputBox.click();
        inputBox.sendKeys("fake");
        submitButton.click();

        browser.waitForAngular();

        expect(browser.getCurrentUrl()).toBe('http://localhost:7777/#/tutorial');
    });
});