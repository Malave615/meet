import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';

const feature = loadFeature('./src/features/specifyNumberOfEvents.feature');

defineFeature(feature, test => {

    test('When user hasn’t specified a number, 32 event is shown by default', ({ given, when, then }) => {
        given('the user hasn’t specified a number', () => {
        });

        when('the user opens the app', () => {
            render(<App />);
        });

        then(/^the user should see (\d+) events$/, async (arg0) => {
            const EventListItems = await screen.findAllByRole('listitem');
            expect(EventListItems.length).toBe(Number(arg0));
        });
    });

    test('User can change the number of events displayed', ({ given, when, then }) => {
        given('the main page is open', () => {
            render(<App />);
        });

        when('the user changes the number of events displayed', async () => {
            const numberInput = screen.getByLabelText(/number of events/i);
            userEvent.clear(numberInput);
            userEvent.type(numberInput, '5');
            userEvent.click(numberInput);
        });

        then('the user should see the specified number of events', async () => {
            await waitFor(async () => {
              const EventListItems = await screen.findAllByRole('listitem');
              expect(EventListItems.length).toBe(5);
            });
        });
    });
});