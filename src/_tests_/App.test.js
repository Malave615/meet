// src/__tests__/App.test.js

import { render, within, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';
import App from '../App';

describe('<App /> component', () => {

  test('renders list of events', () => {
    render(<App />);
    expect(screen.getByTestId('event-list')).toBeInTheDocument();
  });

  test('render CitySearch', () => {
    render(<App />);
    expect(screen.getByTestId('city-search')).toBeInTheDocument();
  });

  test('render NumberOfEvents', () => {
    render(<App />);
    expect(screen.getByTestId('number-of-events')).toBeInTheDocument();
  });
});

describe('<App /> integration', () => {

  test('renders a list of events matching the city selected by the user', async () => {
    const user = userEvent.setup();
    render(<App />);

    const CitySearchDOM2 = screen.getByTestId('city-search');
    const CitySearchInput2 = within(CitySearchDOM2).queryByRole('textbox');
    await user.type(CitySearchInput2, "Berlin");

    const berlinSuggestionItem = within(CitySearchDOM2).queryByText('Berlin, Germany');
    await user.click(berlinSuggestionItem);

    const EventListDOM = screen.getByTestId('event-list');
    const allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');

    const allEvents = await getEvents();
    const berlinEvents = allEvents.filter(
      event => event.location === 'Berlin, Germany'
    );

    await waitFor(() => {
      expect(allRenderedEventItems.length).toBe(berlinEvents.length);
    });

    allRenderedEventItems.forEach(event => {
      expect(event.textContent).toContain("Berlin, Germany");
    });

  });

  test('renders a list of events matching the number selected by the user', async () => {
    const user = userEvent.setup();
    render(<App />);

    // First set the number of events to 5
    const numberTextBox = within(screen.getByTestId('number-of-events')).getByRole('spinbutton');
    await user.clear(numberTextBox);
    await user.type(numberTextBox, "5");

    // Wait for the list of events to update
    await waitFor(() => {
      const EventListDOM = screen.getByTestId('event-list');
      const allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');

      // Check if the number of events rendered is 5
      expect(allRenderedEventItems.length).toBe(5);
    });
  });

  test('renders a list of events matching both the city and the number selected by the user', async () => {
    const user = userEvent.setup();
    render(<App />);

    // First, simulate selecting the city "Berlin"
    const SecondCitySearchDOM = screen.getByTestId('city-search');
    const CitySearchInput = within(SecondCitySearchDOM).queryByRole('textbox');
    await user.type(CitySearchInput, "Berlin");

    const berlinSuggestionItem = within(SecondCitySearchDOM).queryByText('Berlin, Germany');
    await user.click(berlinSuggestionItem);

    // Then, set the number of events to 5
    const numberTextBox = within(screen.getByTestId('number-of-events')).getByRole('spinbutton');
    await user.clear(numberTextBox);
    await user.type(numberTextBox, '5');

    // Wait for the list of events to update
    let allRenderedEventItems;
    await waitFor(() => {
      const EventListDOM = screen.getByTestId('event-list');
      allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');
      
      expect(allRenderedEventItems.length).toBe(5);
    });

    allRenderedEventItems.forEach(event => {
      expect(event.textContent).toContain("Berlin, Germany");
    });
  });
});

// Test for Offline behavior
describe('<App /> offline behavior without global navigator', () => {

  test('handles offline behavior when fetching events', async () => {
    const mockEvents = [
      { id: 1, name: 'Event 1', location: 'Berlin, Germany' },
      { id: 2, name: 'Event 2', location: 'Berlin, Germany' }
    ];

    // Clear existing localStorage and store mockEvents
    localStorage.clear();
    localStorage.setItem('events', JSON.stringify(mockEvents));

    // Simulate network failure by removing the fetch logic for the event request
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    );

    // Step 1: Render the App component
    render(<App />);

    // Step 2: Find all city-search elements (if there are multiple)
    const citySearchElements = screen.getAllByTestId('city-search');

    // If there are multiple, select the first one
    const CitySearchDOM = citySearchElements[0];
    const CitySearchInput = within(CitySearchDOM).queryByRole('textbox');

    // Simulate user typing in the input
    const user = userEvent.setup();
    await user.type(CitySearchInput, "Berlin");

    // Simulate selecting Berlin from the suggestions
    const berlinSuggestionItem = within(CitySearchDOM).queryByText('Berlin, Germany');
    await user.click(berlinSuggestionItem);


    // Step 3: Simulate fetching events (which should fail) and check localStorage
    await waitFor(() => {
      const EventListDOM = screen.getByTestId('event-list');
      const eventItems = within(EventListDOM).queryAllByRole('listitem');

      // Test if the correct number of events are rendered
      expect(eventItems.length).toBe(mockEvents.length);
    });

    // Step 4: Check that the events contain the expected location (Berlin, Germany)
    await waitFor(() => {
      const EventListDOM = screen.getByTestId('event-list');
      const eventItems = within(EventListDOM).queryAllByRole('listitem');

      eventItems.forEach(event => {
        expect(event.textContent).toContain("Berlin, Germany");
      });
    });
  });
});