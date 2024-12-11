// src/components/Event.js

import { useState } from "react";
import './Event.scss';

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <li className="event">
      <h2>{event && event.summary}</h2>
      <p>{event && event.start.dateTime}</p>
      <p>{event && event.location}</p>
      
      <button className="details-btn" onClick={() => setShowDetails(!showDetails)}>
        { showDetails ? "Hide details" : "Show details"}
      </button>
      {
        showDetails ? <p className="details" data-testid="details">{event && event.description}</p> : null
      }
    </li>
  );
}

export default Event;

