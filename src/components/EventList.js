// src/components/EventList.js

import Event from "./Event";

const EventList = ({ events }) => {
  return (
    <ul data-testid="event-list" role="list" aria-label="event list">
      {Array.isArray(events) && events.length > 0 ? (
        events.map(event => (
          <Event key={event.id} event={event} />
        ))
      ) : (
        <p>No events available</p>
      )}
    </ul>
  );
};

export default EventList;