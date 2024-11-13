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

    const CitySearchDOM = screen.getByTestId('city-search');
    const CitySearchInput = within(CitySearchDOM).queryByRole('textbox');

    await user.type(CitySearchInput, "Berlin");
    const berlinSuggestionItem = within(CitySearchDOM).queryByText('Berlin, Germany');
    await user.click(berlinSuggestionItem);

    const EventListDOM = screen.getByTestId('event-list');
    const allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');

    const allEvents = await getEvents();
    const berlinEvents = allEvents.filter(
      event => event.location === 'Berlin, Germany'
    );

    expect(allRenderedEventItems.length).toBe(berlinEvents.length);

    allRenderedEventItems.forEach(event => {
      expect(event.textContent).toContain("Berlin, Germany");
    });

  });

  /* test('renders a list of events matching the number selected by the user', async () => {
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
    let allRenderedEventItems;
    await waitFor(() => {
      const EventListDOM = screen.getByTestId('event-list');
      allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');
      
      expect(allRenderedEventItems.length).toBe(5);
    });

    allRenderedEventItems.forEach(event => {
      expect(event.textContent).toContain("Berlin, Germany");
    });
  }); */
});