// const { error } = require('jquery');
const puppeteer = require('puppeteer');

describe('filter events by city', () => {
  let browser;
  let page;

  beforeAll(async () => {
    jest.setTimeout(60000);

    browser = await puppeteer.launch({
      headless: false,
      slowMo: 250, // slow down by 250ms
      timeout:0
    });

    page = await browser.newPage();
    await page.goto('http://localhost:3000/');

    // If your event element has a different selector, use it instead of .event
    await page.waitForSelector('.event');
  });

  afterAll(() => {
      browser.close();
  });

  test('When user hasn’t searched for a city, show upcoming events from all cities', async () => {
    const events = await page.$$('.event');
    expect(events.length).toBeGreaterThan(0, 'Expected events to be shown from all cities');
  });

  test('User should see a list of suggestions when they search for a city', async () => {
    await page.type('.city', 'Berlin');
    const suggestions = await page.$('.suggestions');
    expect(suggestions).toBeDefined();
    expect(suggestions).toBeTruthy();
  });

  test('User can select a city from the suggested list', async () => {
    await page.click('.suggestions li');
    const city = await page.$eval('.city', input => input.value); 
    expect(city).toBe('Berlin, Germany', 'Expected selected city to be Berlin');
  });

  test('When a city is selected, only events from that city are displayed', async () => {
    await page.type('.city', 'Berlin');
    await page.click('.suggestions li');

    await page.waitForSelector('.event');

    const events = await page.$$('.event');
    expect(events.length).toBeGreaterThan(0);
  });

  test('Correct event count is displayed after filtering by city', async () => {
    await page.type('.city', 'Berlin');
    await page.click('.suggestions li');

    await page.waitForSelector('.event');

    const events = await page.$$('.event');
    const count = events.length;

    expect(count).toBeGreaterThan(0);
  });
});

describe('show/hide an event details', () => {
    let browser;
    let page;

    beforeAll(async () => {
      browser = await puppeteer.launch({
        headless: false,
        slowMo: 250, // slow down by 250ms
        timeout:0
      });

      page = await browser.newPage();
      await page.goto('http://localhost:3000/');

      // If your event element has a different selector, use it instead of .event
      await page.waitForSelector('.event');
    });

    afterAll(() => {
        browser.close();
    });

    test('An event element is collapse by default', async () => {
      // If your event's details have a different selector, use it instead of .event .details
      const eventDetails = await page.$('.event .details');
      expect(eventDetails).toBeNull();
    });

    test('User can expand an event to see its details', async () => {
        await page.click('.event .details-btn');
        const eventDetails = await page.$('.event .details');
        expect(eventDetails).toBeDefined();
    });

    test('User can collapse an event to hide its details', async () => {
        await page.click('.event .details-btn');
        const eventDetails = await page.$('.event .details');
        expect(eventDetails).toBeDefined();
    });
});


describe('specify number of events', () => {
    let browser;
    let page;

    beforeAll(async () => {
      browser = await puppeteer.launch({
        headless: false,
        slowMo: 250, // slow down by 250ms
        timeout:0
      });

      page = await browser.newPage();
      await page.goto('http://localhost:3000/');

      // If your event element has a different selector, use it instead of .event
      await page.waitForSelector('.event');
    });

    afterAll(() => {
        browser.close();
    });

    test('When user hasn’t specified a number, 32 events are shown by default', async () => {
        const events = await page.$$('.event');
        expect(events.length).toBe(32, 'Expected 32 events to be displayed by default');
    });

    test('User can change the number of events displayed', async () => {
      jest.setTimeout(60000);

      const numberTextBox = await page.$('#number-of-events-input');
      await numberTextBox.click({ clickCount: 3 });
      await numberTextBox.press('Backspace');
      await numberTextBox.type('10');

      await page.waitForFunction(
        'document.querySelectorAll(".event").length === 10'
      );

      const events = await page.$$('.event');
      expect(events.length).toBe(10, 'Expected 10 events to be displayed after changing input');
    });

    /* test('Handles invalid number input gracefully', async () => {
      jest.setTimeout(60000);

      const numberTextBox = await page.$('#number-of-events-input');
      await numberTextBox.click({ clickCount: 3 });
      await numberTextBox.press('Backspace');
      await numberTextBox.type('abc');

      await page.waitForFunction(
        'document.querySelector(".error-message") && document.querySelector(".error-message").textContent.includes("Invalid input")',
        { timeout: 10000 }
      );

      const errorMessage = await page.$('.error-message');
      expect(errorMessage).toBeDefined();

      const errorText = await errorMessage.evaluate(el => el.textContent);
      expect(errorText).toContain('Invalid input');
    }); */
});