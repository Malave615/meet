// src/components/NumberOfEvents.js

import { useState, useEffect } from "react";

const NumberOfEvents = ({ currentNOE, setCurrentNOE }) => {

  const [number, setNumber] = useState(currentNOE);

  useEffect(() => {
    setNumber(currentNOE);
  }, [currentNOE]);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setNumber(value);
    setCurrentNOE(value);
  }

  return (
    <div data-testid="number-of-events">
      <label htmlFor="number-of-events-input">Number of Events: </label>
      <input
        type="number"
        id="number-of-events-input"
        className="number-of-events-input"
        value={number}
        onChange={handleInputChanged}
      />
    </div>
  );
}

export default NumberOfEvents;
