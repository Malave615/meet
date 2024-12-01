import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, within, waitFor, screen } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, test => {

    test('An event element is collapsed by default', ({ given, when, then }) => {
        given('the main page is open', () => {
          render(<App />);
        });

        when('the user sees the list of upcoming events', async () => {
          const EventListDOM = screen.getByTestId('event-list');

          await waitFor(() => {
            const EventListItems = within(EventListDOM).queryAllByRole('listitem');
            expect(EventListItems.length).toBe(32);
          });
        });

        then('the user should see a collapsed event element for each event', () => {
            const EventListDOM = screen.getByTestId('event-list');
            const EventListItems = within(EventListDOM).queryAllByRole('listitem');
            EventListItems.forEach((EventListItem) => {
                expect(EventListItem).not.toHaveClass('event-expanded');
            });
        });
    });

    test('User can expand an event to see its details', ({ given, when, and, then }) => {
        given('the main page is open', () => {
          render(<App />);
        });

        when('the user sees the list of upcoming events',  async () => {
            const EventListDOM = screen.getByTestId('event-list');
            expect(EventListDOM).toBeInTheDocument();
            await waitFor(() => {
              const EventListItems = within(EventListDOM).queryAllByRole('listitem');
              expect(EventListItems.length).toBe(32);
            });
        });

        and('the user clicks on an event', () => {
            const EventListDOM = screen.getByTestId('event-list');
            const EventListItems = within(EventListDOM).queryAllByRole('listitem');
            const EventListItem = EventListItems[0];
            const detailsButton = within(EventListItem).queryByRole('button');
            expect(detailsButton).toBeInTheDocument();
            userEvent.click(detailsButton);
        });

        then('the user should see the details of that event', async () => {
            const EventListDOM = screen.getByTestId('event-list');
            const EventListItems = within(EventListDOM).queryAllByRole('listitem');
            const EventListItem = EventListItems[0];

            await waitFor(() => {
              const detailsButton = within(EventListItem).queryByRole('button');
              expect(detailsButton).toHaveTextContent('Hide details');
            });

            const eventDetails = within(EventListItem).queryByTestId('details');
            expect(eventDetails).toBeInTheDocument();
        });
    });

    test('User can collapse an event to hide its details', ({ given, when, and, then }) => {
        given('the main page is open', () => {
            render(<App />);
        });

        when('the user sees the details of an event', async () => {
            const EventListDOM = screen.getByTestId('event-list');

            await waitFor(() => {
                const EventListItems = within(EventListDOM).queryAllByRole('listitem');
                expect(EventListItems.length).toBeGreaterThan(0);
            });

            const EventListItems = within(EventListDOM).queryAllByRole('listitem');
            const EventListItem = EventListItems[0];
            const detailsButton = within(EventListItem).queryByRole('button');
            expect(detailsButton).toBeInTheDocument();
            userEvent.click(detailsButton);

            await waitFor(() => {
                const detailsButtonAfterClick = within(EventListItem).queryByRole('button');
                expect(detailsButtonAfterClick).toHaveTextContent('Hide details');
            });
        });

        and('the user clicks on the event again', () => {
            const EventListDOM = screen.getByTestId('event-list');
            const EventListItems = within(EventListDOM).queryAllByRole('listitem');
            const EventListItem = EventListItems[0];
            const detailsButton = within(EventListItem).queryByRole('button');
            userEvent.click(detailsButton);
        });

        then('the user should see the collapsed event element for that event', () => {
            const EventListDOM = screen.getByTestId('event-list');
            const EventListItems = within(EventListDOM).queryAllByRole('listitem');
            EventListItems.forEach((EventListItem) => {
                expect(EventListItem).not.toHaveClass('event-expanded');
            });      
        });
    });
});