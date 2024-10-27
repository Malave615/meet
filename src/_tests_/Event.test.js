// src/_tests_/Event.test.js

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Event from '../components/Event';
import mockData from '../mock-data';

describe('<Event /> component', () => {
    let EventComponent;
    const event = mockData[0];

    test('render event component', () => {
        EventComponent = render(<Event event={event} />);
        expect(EventComponent).toBeTruthy();
    });

    test('renders event title correctly', () => {
        EventComponent = render(<Event event={event} />);
        const eventTitle = screen.getByText(event.summary);
        expect(eventTitle).toBeInTheDocument();
    });

    test('renders event start time correctly', () => {
        EventComponent = render(<Event event={event} />);
        const eventTime = screen.getByText(event.start.dateTime);
        expect(eventTime).toBeInTheDocument();
    });

    test('renders event location correctly', () => {
        EventComponent = render(<Event event={event} />);
        const eventLocation = screen.getByText(event.location);
        expect(eventLocation).toBeInTheDocument();
    });

    test('renders show details button', () => {
        EventComponent = render(<Event event={event} />);
        const detailButton = screen.queryByText('Show Details');
        expect(detailButton).toBeInTheDocument();
    });

    // Scenario 1: An event element is collapsed by default
    test('event element is collapsed by default', () => {
        EventComponent = render(<Event event={event} />);

        // Check that event details are not visible
        const eventDetails = screen.queryByRole('listitem');
        expect(eventDetails).not.toBeInTheDocument();

        // Check that buttons and other info are visible
        expect(screen.getByRole('heading')).toHaveTextContent(event.summary);
        expect(screen.getByText(event.start.dateTime)).toBeInTheDocument();
        expect(screen.getByText(event.start.timeZone)).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('Show Details');
    });

    // Scenario 2: User can expand an event to see its details
    test('renders event details when clicked', async () => {
        EventComponent = render(<Event event={event} />);
        const user = userEvent.setup();
        
        // Click to show details
        await user.click(screen.getByRole('button', { name: /show details/i }));

        // Verify that details are displayed
        const eventDetails = screen.getByRole('list');
        expect(eventDetails).toBeInTheDocument();

        // Normailize the description text
        const expectedDescription = event.description.replace(/\s+/g, ' ').trim();
        const receivedDescription = eventDetails.textContent.replace(/\s+/g, ' ').trim();

        expect(receivedDescription).toContain(expectedDescription);
        expect(screen.getByRole('button')).toHaveTextContent('Hide Details');
    });

    // Scenario 3: User can collapse an event to hide its details
    test('collapses event details when clicked again', async () => {
        EventComponent = render(<Event event={event} />);
        const user = userEvent.setup();
        
        // Click to show details
        await user.click(screen.getByRole('button', { name: /show details/i })); // Show Details
        let eventDetails = screen.getByRole('list');
        expect(eventDetails).toBeInTheDocument();

        // Click to hide details
        await user.click(screen.getByRole('button', { name: /hide details/i })); // Hide Details
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('Show Details');
    });
});
