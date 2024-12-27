// src/__tests__/App.test.js

import { render, within, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getEvents, extractLocations } from '../api';
import App from '../App';

// Mock the getEvents and extractLocations functions
jest.mock('../api', () => ({
  getEvents: jest.fn(),
  extractLocations: jest.fn()
}));

// Define mock data
const mockEvents = [
  { id: '1', start: { dateTime: "2024-12-25T18:00:00" }, location: 'Berlin', name: 'Event 1' },
  { id: '2', start: { dateTime: "2024-12-26T10:00:00" }, location: 'Berlin', name: 'Event 2' },
  { id: '3', start: { dateTime: "2024-12-27T14:00:00" }, location: 'London', name: 'Event 3' },
  { id: '4', start: { dateTime: "2024-12-28T16:00:00" }, location: 'London', name: 'Event 4' },
  { id: '5', start: { dateTime: "2024-12-29T18:00:00" }, location: 'Berlin', name: 'Event 5' },
  { id: '6', start: { dateTime: "2024-12-30T10:00:00" }, location: 'Berlin', name: 'Event 6' }
];

const mockLocations = ['Berlin, Germany', 'London, UK'];

beforeEach(() => {
  // Mocking getEvents to return mock events
  getEvents.mockResolvedValue(mockEvents);

  // Mocking extractLocations to return mock locations
  extractLocations.mockReturnValue(mockLocations);
});

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

    const berlinEvents = mockEvents.filter(event => event.location === 'Berlin, Germany');

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
    const CitySearchDOM = screen.getByTestId('city-search');
    const CitySearchInput = within(CitySearchDOM).queryByRole('textbox');
    await user.type(CitySearchInput, "Berlin");

    const berlinSuggestionItem = within(CitySearchDOM).queryByText('Berlin, Germany');
    await user.click(berlinSuggestionItem);

    // Then, set the number of events to 5
    const numberTextBox = within(screen.getByTestId('number-of-events')).getByRole('spinbutton');
    await user.clear(numberTextBox);
    await user.type(numberTextBox, '5');

    // Wait for the list of events to update
    await waitFor(() => {
      const EventListDOM = screen.getByTestId('event-list');
      const allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');
      const berlinEvents = mockEvents.filter(event => event.location === 'Berlin, Germany');
      
      expect(allRenderedEventItems.length).toBe(berlinEvents.length);
    });

    // Ensure that all rendered events contain the location "Berlin, Germany"
    const EventListDOM = screen.getByTestId('event-list');
    const allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');
    allRenderedEventItems.forEach(event => {
      expect(event.textContent).toContain("Berlin, Germany");
    });
  });
});

// Test for Offline behavior
/* describe('<App /> offline behavior without global navigator', () => {

  test('handles offline behavior when fetching events', async () => {
    const mockEvents = [
      { id: 1, name: 'Event 1', location: 'Berlin, Germany', date: '2024-12-25T18:00:00' },
      { id: 2, name: 'Event 2', location: 'Berlin, Germany', date: '2024-12-26T10:00:00' },
      { id: 3, name: 'Event 3', location: 'London', date: '2024-12-27T14:00:00' },
      { id: 4, name: 'Event 4', location: 'London', date: '2024-12-28T16:00:00' },
      { id: 5, name: 'Event 5', location: 'Berlin, Germany', date: '2024-12-29T18:00:00' },
      { id: 6, name: 'Event 6', location: 'Berlin, Germany', date: '2024-12-30T10:00:00' }
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

    // Step 2: Set the city to "Berlin, Germany" and the number of events to 2
    const citySearchInput = screen.getByPlaceholderText(/search for a city/i);
    userEvent.type(citySearchInput, 'Berlin, Germany');

    const numberOfEventsInput = screen.getByRole('spinbutton', { name: /number of events/i });
    userEvent.clear(numberOfEventsInput);
    userEvent.type(numberOfEventsInput, '2');

    // Step 3: Wait for the events to be rendered
    const EventListDOM = screen.getByTestId('event-list');
    // Ensure events are displayed correctly
    const eventItems = within(EventListDOM).queryAllByRole('listitem');

    await waitFor(() => {
      expect(eventItems.length).toBe(2);
    });

    // Step 4: Check that the events contain the expected location (Berlin, Germany)
    eventItems.forEach(event => {
      expect(event.textContent).toContain("Berlin, Germany");
    });
  });
}); */