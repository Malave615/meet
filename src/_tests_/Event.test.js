// src/__tests__/Event.test.js

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';
import Event from '../components/Event';

describe('<Event /> component', () => {
  let allEvents;

  test('renders event Title', async () => {
    allEvents = await getEvents();
    render(<Event event={allEvents[0]} />);
    expect(screen.getByText(allEvents[0].summary)).toBeInTheDocument();
  });

  test('renders event location', async () => {
    allEvents = await getEvents();
    render(<Event event={allEvents[0]} />);
    expect(screen.getByText(allEvents[0].location)).toBeInTheDocument();
  });

  test('renders event details button with the title (show details)', async () => {
    allEvents = await getEvents();
    render(<Event event={allEvents[0]} />);
    expect(screen.getByText(/show details/i)).toBeInTheDocument();
  });

  test("by default, event's details section should be hidden", async () => {
    allEvents = await getEvents();
    render(<Event event={allEvents[0]} />);
    expect(screen.queryByText(allEvents[0].description)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show details/i })).toBeInTheDocument();
  });

  test("shows the details section when the user clicks on the 'show details' button", async () => {
    allEvents = await getEvents();
    render(<Event event={allEvents[0]} />);
    const user = userEvent.setup();
    
    // Assert that the details section is NOT visible initially
    const detailsSection = screen.queryByTestId('details');
    expect(detailsSection).not.toBeInTheDocument();

    // Click the show details button
    await user.click(screen.getByRole('button', { name: /show details/i }));

    // Check that the description text is now visible
    const detailsText = await screen.findByTestId('details');
    expect(detailsText).toBeInTheDocument();

    // Assert that the button is now labeled 'hide details'
    expect(screen.getByRole('button', { name: /hide details/i })).toBeInTheDocument();
  });

  test("hides the details section when the user clicks on the 'hide details' button", async () => {
    allEvents = await getEvents();
    render(<Event event={allEvents[0]} />);
    const user = userEvent.setup();

    // First show the details section
    await user.click(screen.getByRole('button', { name: /show details/i }));

    // Assert that the details section is now visible
    const detailsText = await screen.findByTestId('details');
    expect(detailsText).toBeInTheDocument();

    // Click on the 'hide details' button
    await user.click(screen.getByRole('button', {name: /hide details/i}));
    
    const hideDetailsText = screen.queryByTestId('details');
    expect(hideDetailsText).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show details/i })).toBeInTheDocument();
  });
});