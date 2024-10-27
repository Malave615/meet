// src/components/EventList.js

import Event from './Event';

const EventList = ({ events }) => {
    return (
          <ul data-testid="event-list">
            {events? (
              events.map(event => (
                <li key={event.id} role="listitem">
                  <Event title={event.summary} details={event.details} />
                </li>
              ))
            ) : null}              
          </ul>
    );
}

export default EventList;