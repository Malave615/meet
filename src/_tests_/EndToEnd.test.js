const puppeteer = require('puppeteer');

describe('filter events by city', () => {
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

  test('When user hasn’t searched for a city, show upcoming events from all cities', async () => {
    const events = await page.$$('.event');
    expect(events).toBeDefined();
  });

  test('User should see a list of suggestions when they search for a city', async () => {
    await page.type('.city', 'Berlin');
    const suggestions = await page.$('.suggestions');
    expect(suggestions).toBeDefined();
  });

  test('User can select a city from the suggested list', async () => {
    await page.click('.suggestions li');
    const city = await page.$eval('.city', input => input.value); 
    expect(city).toBe('Berlin, Germany');
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
        expect(eventDetails).toBeNull();
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
        expect(events.length).toBe(32);
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
      expect(events.length).toBe(10);
    });
});