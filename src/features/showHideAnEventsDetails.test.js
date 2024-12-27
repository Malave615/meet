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
            expect(EventListItems.length).toBe(32, 'Expected 32 events to be listed');
          });
        });

        then('the user should see a collapsed event element for each event', () => {
            const EventListDOM = screen.getByTestId('event-list');
            const EventListItems = within(EventListDOM).queryAllByRole('listitem');
            EventListItems.forEach((EventListItem, index) => {
                expect(EventListItem).not.toHaveClass('event-expanded', `Event at index ${index} is expanded`);
            });
        });
    });

    test('User can expand an event to see its details', ({ given, when, and, then }) => {
        given('the main page is open', () => {
          render(<App />);
        });

        when('the user sees the list of upcoming events',  async () => {
            const EventListDOM = screen.getByTestId('event-list');
            expect(EventListDOM).toBeInTheDocument('Expected the event list to be rendered');
            await waitFor(() => {
              const EventListItems = within(EventListDOM).queryAllByRole('listitem');
              expect(EventListItems.length).toBe(32, 'Expected 32 events to be listed');
            });
        });

        and('the user clicks on an event', () => {
            const EventListDOM = screen.getByTestId('event-list');
            const EventListItems = within(EventListDOM).queryAllByRole('listitem');
            const EventListItem = EventListItems[0];
            const detailsButton = within(EventListItem).queryByRole('button');
            expect(detailsButton).toBeInTheDocument('Expected a details button to be present for the event');
            userEvent.click(detailsButton);
        });

        then('the user should see the details of that event', async () => {
            const EventListDOM = screen.getByTestId('event-list');
            const EventListItems = within(EventListDOM).queryAllByRole('listitem');
            const EventListItem = EventListItems[0];

            await waitFor(() => {
              const detailsButton = within(EventListItem).queryByRole('button');
              expect(detailsButton).toHaveTextContent('Hide details', 'Expected the button text to change to "Hide details" after expanding');
            });

            const eventDetails = within(EventListItem).queryByTestId('details');
            expect(eventDetails).toBeInTheDocument('Expected event details to be visible after clicking the "Show details" button');
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
                expect(EventListItems.length).toBeGreaterThan(0, 'Expected at least one event in the list');
            });

            const EventListItems = within(EventListDOM).queryAllByRole('listitem');
            const EventListItem = EventListItems[0];
            const detailsButton = within(EventListItem).queryByRole('button');
            expect(detailsButton).toBeInTheDocument('Expected a details button to be present for the event');
            userEvent.click(detailsButton);

            await waitFor(() => {
                const detailsButtonAfterClick = within(EventListItem).queryByRole('button');
                expect(detailsButtonAfterClick).toHaveTextContent('Hide details', 'Expected the button to change to "Hide details" after expanding');
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
            EventListItems.forEach((EventListItem, index) => {
                expect(EventListItem).not.toHaveClass('event-expanded', `Event at index ${index} should be collapsed`);
            });      
        });
    });

    test('Multiple events can be expanded and collapsed independently', ({ given, when, and , then }) => {
        given('the main page is open', () => {
            render(<App />);
        });

        when('the user sees the list of upcoming events', async () => {
            const EventListDOM = screen.getByTestId('event-list');
            expect(EventListDOM).toBeInTheDocument();
            await waitFor(() => {
                const EventListItems = within(EventListDOM).queryAllByRole('listitem');
                expect(EventListItems.length).toBeGreaterThan(1);
            });
        });

        and('the user expands the first event', async () => {
            const EventListDOM = screen.getByTestId('event-list');
            const EventListItems = within(EventListDOM).queryAllByRole('listitem');
            const firstEvent = EventListItems[0];
            const detailsButton = within(firstEvent).queryByRole('button');
            userEvent.click(detailsButton);

            await waitFor(() => {
                expect(within(firstEvent).getByTestId('details')).toBeInTheDocument();
            });
        });

        and('the user expands the second event', async () => {
            const EventListDOM = screen.getByTestId('event-list');
            const EventListItems = within(EventListDOM).queryAllByRole('listitem');
            const secondEvent = EventListItems[1];
            const detailsButton = within(secondEvent).queryByRole('button');
            userEvent.click(detailsButton);

            await waitFor(() => {
                expect(within(secondEvent).getByTestId('details')).toBeInTheDocument();
            });
        });

        then('both events should be expanded with their details visible', () => {
            const EventListDOM = screen.getByTestId('event-list');
            const EventListItems = within(EventListDOM).queryAllByRole('listitem');
            [0, 1].forEach(index => {
            const EventListItem = EventListItems[index];
            expect(within(EventListItem).getByTestId('details')).toBeInTheDocument();
            });
        });
    });

    test('Event details load asynchronously', ({ given, when, then }) => {
        given('the main page is open with events that load details asynchronously', () => {
            render(<App />);
        });

        when('the user clicks on an event', async () => {
            const EventListDOM = screen.getByTestId('event-list');
            expect(EventListDOM).toBeInTheDocument('Expected the event list to be rendered');

            await waitFor(() => {
                const EventListItems = within(EventListDOM).queryAllByRole('listitem');
                expect(EventListItems.length).toBeGreaterThan(0, 'Expected at least one event to be in the list');
            });

            const EventListItems = within(EventListDOM).queryAllByRole('listitem');
            const detailsButton = within(EventListItems[0]).queryByRole('button');
            expect(detailsButton).toBeInTheDocument('Expected the event to have a button for showing details');
            userEvent.click(detailsButton);
        });

        then('the event details should be shown after a delay', async () => {
            const EventListDOM = screen.getByTestId('event-list');
            const EventListItems = within(EventListDOM).queryAllByRole('listitem');
            const EventListItem = EventListItems[0];
            const eventDetails = await within(EventListItem).findByTestId('details');
            expect(eventDetails).toBeInTheDocument('Expected event details to be visible after asunc loading');
        });
    });
});