// src/__tests__/CitySearch.test.js

import { render, within, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';
import App from '../App';
import { extractLocations, getEvents } from '../api';

describe('<CitySearch /> component', () => {
  let CitySearchComponent;

  test('renders text input', () => {
    CitySearchComponent = render(<CitySearch allLocations={[]} setCurrentCity={() => { }} setInfoAlert={() => { }} />);
    const cityTextBox = screen.queryByRole('textbox');
    expect(cityTextBox).toBeInTheDocument();
    expect(cityTextBox).toHaveClass('city');
  });

  test('suggestions list is hidden by default', () => {
    CitySearchComponent = render(<CitySearch allLocations={[]} setCurrentCity={() => { }} setInfoAlert={() => { }} />);
    const suggestionList = screen.queryByRole('list');
    expect(suggestionList).not.toBeInTheDocument();
  });

  test('renders a list of suggestions when city text box gains focus', async () => {
    CitySearchComponent = render(<CitySearch allLocations={[]} setCurrentCity={() => { }} setInfoAlert={() => { }} />);
    const user = userEvent.setup();
    const cityTextBox = screen.queryByRole('textbox');
    await user.click(cityTextBox);

    const suggestionList = screen.queryByRole('list');
    expect(suggestionList).toBeInTheDocument();
    expect(suggestionList).toHaveClass('suggestions');
  });

  test('updates list of suggestions correctly when user types in city textbox', async () => {
    CitySearchComponent = render(<CitySearch allLocations={[]} setCurrentCity={() => { }} setInfoAlert={() => { }} />);
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    CitySearchComponent.rerender(<CitySearch allLocations={allLocations} setCurrentCity={() => { }} setInfoAlert={() => { }} />);

    // user types "Berlin" in city textbox
    const cityTextBox = screen.queryByRole('textbox');
    await user.type(cityTextBox, "Berlin");

    // filter allLocations to locations matching "Berlin"
    const suggestions = allLocations ? allLocations.filter((location) => {
      return location.toUpperCase().indexOf(cityTextBox.value.toUpperCase()) > -1;
    }) : [];

    // get all <li> elements inside the suggestion list
    const suggestionListItems = screen.queryAllByRole('listitem');
    expect(suggestionListItems).toHaveLength(suggestions.length + 1);
    for (let i = 0; i < suggestions.length; i += 1) {
      expect(suggestionListItems[i].textContent).toBe(suggestions[i]);
    }
  });

  test('renders the suggestion text in the textbox upon clicking on the suggestion', async () => {
    CitySearchComponent = render(<CitySearch allLocations={[]} setCurrentCity={() => { }} setInfoAlert={() => { }} />);
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    CitySearchComponent.rerender(<CitySearch
      allLocations={allLocations}
      setCurrentCity={() => { }}
      setInfoAlert={() => { }}
    />);

    const cityTextBox = screen.queryByRole('textbox');
    await user.type(cityTextBox, "Berlin");

    // the suggestion's textContent look like this: "Berlin, Germany"
    const BerlinGermanySuggestion = screen.queryAllByRole('listitem')[0];

    await user.click(BerlinGermanySuggestion);

    expect(cityTextBox).toHaveValue(BerlinGermanySuggestion.textContent);
  });
});

describe('<CitySearch /> integration', () => {
  test('renders suggestions list when the app is rendered and updates accordingly', async () => {
    const user = userEvent.setup();
    render(<App />);

    const CitySearchDOM = screen.getByTestId('city-search');
    const cityTextBox = within(CitySearchDOM).queryByRole('textbox');
    await user.click(cityTextBox);

    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);

    // Wait for the suggestions list to be rendered
    await waitFor(() => {
      const suggestionListItems = within(CitySearchDOM).queryAllByRole('listitem');
      expect(suggestionListItems.length).toBe(allLocations.length + 1);
    });

    // Simulate typing a city that doesn't exist
    await user.type(cityTextBox, "Random City");

    // Wait for the suggestions list to be updated
    await waitFor(() => {
      const suggestionListItems = within(CitySearchDOM).queryAllByRole('listitem');
      expect(suggestionListItems.length).toBe(1);
    });

    const suggestionListItems = within(CitySearchDOM).queryAllByRole('listitem');
    expect(suggestionListItems[0].textContent).toBe('See all cities');

    await user.clear(cityTextBox);
    await user.type(cityTextBox, "Berlin");

    await waitFor(() => {
      const suggestionListItems = within(CitySearchDOM).queryAllByRole('listitem');
      expect(suggestionListItems.length).toBeGreaterThan(1);
    });
  });
});