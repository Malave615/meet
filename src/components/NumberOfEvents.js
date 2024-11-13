// src/components/NumberOfEvents.js

import { useState } from "react";

const NumberOfEvents = ({ /* currentNOE, setCurrentNOE */ }) => {

  const [number, setNumber] = useState(32);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setNumber(value);
    // setCurrentNOE(value);
  }

  return (
    <div data-testid="number-of-events">
      <label htmlFor="number-of-events-input">Number of Events: </label>
      <input
        type="text"
        id="number-of-events-input"
        className="number-of-events-input"
        value={number}
        onChange={handleInputChanged}
      />
    </div>
  );
}

export default NumberOfEvents;