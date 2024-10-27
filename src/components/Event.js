// src/components/Event.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Event = ({ event }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!event) {
        return null;
    }

    const { summary, start, location, description } = event;
    const dateTime = start.dateTime;
    const timeZone = start.timeZone;

    const toggleDetails = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <h2 data-testid="heading" style={{ cursor: 'pointer' }}>
                {summary}
            </h2>
            <p>{dateTime}</p>
            <p>{timeZone}</p>
            <p>{location}</p>
            <button onClick={toggleDetails}>
                {isOpen ? 'Hide Details' : 'Show Details'}
            </button>
            {isOpen && (
                <ul data-testid="list" className="event-details">
                    <li>
                        {description.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                    </li>
                </ul>
            )}
        </div>
    );
};

Event.propTypes = {
    event: PropTypes.shape({
        summary: PropTypes.string.isRequired,
        start: PropTypes.shape({
          dateTime: PropTypes.string.isRequired,
          timeZone: PropTypes.string.isRequired,
        }).isRequired,
        location: PropTypes.string.isRequired,        
        description: PropTypes.string.isRequired,
    }).isRequired,
};

export default Event;