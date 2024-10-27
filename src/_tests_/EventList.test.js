// src/__tests__/EventList.test.js

import { render, screen } from '@testing-library/react';
import EventList from '../components/EventList';
import { getEvents } from '../api';

describe('<EventList /> component', () => {
  let EventListComponent;

  test('has an element with "list" role', () => {
    EventListComponent = render(<EventList />);
    expect(screen.getByRole("list")).toBeInTheDocument();
 });

 test('renders correct number of events', async () => {
   EventListComponent = render(<EventList />);
   const allEvents = await getEvents();
   EventListComponent.rerender(<EventList events={allEvents} />);
   expect(screen.getAllByRole("listitem")).toHaveLength(allEvents.length);
  });
});