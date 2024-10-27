// src/components/NumberOfEvents.js

import React, { useState, useEffect } from 'react';

const NumberOfEvents = ({ currentNOE, setCurrentNOE, setErrorAlert }) => {
    const [number, setNumber] = useState(currentNOE);

    useEffect(() => {
        setNumber(currentNOE);
    }, [currentNOE]);

    const handleInputChanged = (event) => {
        const value = event.target.value;
        setNumber(value);

        if (isNaN(value) || value <= 0) {
            setErrorAlert('Please enter a valid number of events');
        } else if (value > 32) {
            setErrorAlert('Only maximum of 32 is allowed');
        } else {
            setErrorAlert('');
            setCurrentNOE(value);
        }
    };

    return (
        <div data-testid="number-of-events">
          <label>
            Number of Events:
          <input
            type="text"
            className="number"
            placeholder="Enter number of events"
            value={number}
            onChange={handleInputChanged}
            data-testid="numberOfEventsInput"
          />
          </label>
          {setErrorAlert && <span className="error-alert">{setErrorAlert}</span>}
        </div>
    );
};

export default NumberOfEvents;