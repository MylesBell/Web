describe('Player Creation page', function() {
    it('should have a title', function() {

        //navigate to the website
        browser.get('/');

        browser.waitForAngular();

        expect(browser.getTitle()).toEqual('Rushmore');
        
        expect(browser.getCurrentUrl()).toBe('http://localhost:7777/#/');
    });
    
    it('Start on splash screen and can move to player join page', function(){
        var joinbox = element(by.css('#start-button'));
        expect(browser.getCurrentUrl()).toBe('http://localhost:7777/#/');
        joinbox.click();
        expect(browser.getCurrentUrl()).toBe('http://localhost:7777/#/');
    });

    it("clicking input box clears the text inside", function() {

        browser.waitForAngular();
        
        var inputBox = element(by.css('#player-name-input-box'));

        inputBox.click();
        browser.waitForAngular();

        expect(inputBox.getAttribute('value')).toEqual('');
    });

    it('entering no name means the button is disabled', function() {

        var inputBox = element(by.css('#player-name-input-box'));
        var submitButton = element(by.css('#submit-button'));

        inputBox.click();

        expect(submitButton.getAttribute('disabled')).toEqual('true');
    });

    it('entering a name over 20 characters means the button is disabled', function() {

        var inputBox = element(by.css('#player-name-input-box'));
        var submitButton = element(by.css('#submit-button'));

        inputBox.click();
        inputBox.sendKeys("aaaaaaaaaaaaaaaaaaaaa");

        expect(submitButton.getAttribute('disabled')).toEqual('true');
    });
    
    it('can enter a name into the input box', function() {

        var inputBox = element(by.css('#player-name-input-box'));
        inputBox.click();
        inputBox.sendKeys("James");

        expect(inputBox.getAttribute('value')).toEqual('James');
    });

    it('entering a valid name moves the user to the class select page', function() {

        var inputBox = element(by.css('#player-name-input-box'));
        var submitButton = element(by.css('#submit-button'));
        var selectClassButton = element(by.css('#select-class-button'));

        inputBox.click();
        inputBox.sendKeys("Dave");
        submitButton.click();
        selectClassButton.click();

        expect(browser.getCurrentUrl()).toBe('http://localhost:7777/#/join');
    });
});