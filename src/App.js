// src/App.js

import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { useEffect, useState } from 'react';
import { extractLocations, getEvents } from './api';
import { InfoAlert, ErrorAlert, WarningAlert } from './components/Alert';
import CityEventsChart from './components/CityEventsChart';
import EventGenresChart from './components/EventGenresChart';

import './App.css';

const App = () => {
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const color = useState([]);
  const [infoAlert, setInfoAlert] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
  const [warningAlert, setWarningAlert] = useState("");

  useEffect(() => {
    if ( navigator.onLine) {
      fetchData();
      // User is online, clear any warning messages
      setWarningAlert("");
    } else {
      // User is offline, set a warning message
      setWarningAlert("You are currently offline. Some features may not be available.");
      const storedEvents = JSON.parse(localStorage.getItem('events'));
      setEvents(storedEvents);
    }
  }, [currentCity, currentNOE]);

  const fetchData = async () => {
    if (navigator.onLine) {
      try {
        const allEvents = await getEvents();
        const filteredEvents = currentCity === "See all cities" ? allEvents : allEvents.filter(event => event.location === currentCity);
        setEvents(filteredEvents.slice(0, currentNOE));
        setAllLocations(extractLocations(allEvents));

        // Save to localStorage
        localStorage.setItem("events", JSON.stringify(allEvents));
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorAlert("An error occurred while fetching data. Please try again later.");
      }
    } else {
      // Offline: Retrieve data from localStorage
      const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
      if (storedEvents.length > 0) {
        const filteredEvents = currentCity === "See all cities" ? storedEvents : storedEvents.filter(event => event.location === currentCity);
        setEvents(filteredEvents.slice(0, currentNOE));
        setAllLocations(extractLocations(storedEvents));
      } else {
        setErrorAlert("No events available in localStorage.");
      }
    }
  };

  return (
    <div className="App">
      <div className="alerts-container">
        {infoAlert.length ? <InfoAlert text={infoAlert}/> : null}
        {warningAlert.length ? <WarningAlert text={warningAlert} /> : null}
        {errorAlert.length ? <ErrorAlert text={errorAlert} /> : null}
      </div>
      <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} setInfoAlert={setInfoAlert} />
      <NumberOfEvents currentNOE={currentNOE} setCurrentNOE={setCurrentNOE} errorAlert={errorAlert} setErrorAlert={setErrorAlert} />
      <div className="charts-container">
        <CityEventsChart allLocations={allLocations} events={events} color={color} />
        <EventGenresChart events={events} />
      </div>
      <EventList events={events} />
    </div>
  );
}

export default App;