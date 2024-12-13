// src/components/NumberOfEvents.js

import { useState, useEffect } from "react";
import { ErrorAlert } from "./Alert";

const NumberOfEvents = ({ currentNOE, setCurrentNOE, errorAlert, setErrorAlert }) => {

  const [number, setNumber] = useState(currentNOE);

  useEffect(() => {
    setNumber(currentNOE);
  }, [currentNOE]);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setNumber(value);
    setCurrentNOE(value);

    let errorText = "";
    if (value <= 0) {
      errorText = "Only positive numbers are allowed.";
    } else {
      errorText = "";
    }

    setErrorAlert(errorText);
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
