// src/components/Event.js

import { useState } from "react";
import moment from "moment";
import './Event.scss';

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Format the event date using moment
  const formattedDate = event && event.start && moment(event.start.dateTime).format('MMMM Do YYYY, h:mm:ss a');

  return (
    <li className="event">
      <h2>{event && event.summary}</h2>
      {/* Display the formatted date */}
      <p>{formattedDate || "Date not available"}</p>
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

