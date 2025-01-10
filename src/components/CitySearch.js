// src/components/CitySearch.js

import { useState, useEffect, useRef } from "react";
import './CitySearch.scss';

const CitySearch = ({ allLocations, setCurrentCity, setInfoAlert }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    setSuggestions(allLocations);
  }, [`${allLocations}`]);


  const handleInputChanged = (event) => {
    const value = event.target.value;
    const filteredLocations = allLocations ? allLocations.filter((location) => {
      return location.toUpperCase().indexOf(value.toUpperCase()) > -1;
    }) : [];
    setQuery(value);
    setSuggestions(filteredLocations);

    let infoText;
    if (filteredLocations.length === 0) {
      infoText = "We can not find the city you are looking for. Please try another city"
    } else {
      infoText = ""
    }
    setInfoAlert(infoText);
  };

  const handleItemClicked = (event) => {
    const value = event.target.textContent;
    setQuery(value);
    setShowSuggestions(false);
    setCurrentCity(value);
    setInfoAlert("")
  };

  return (
    <div data-testid="city-search" className="city-search-container">
      <h1>Meet App</h1>
      <input
        ref={inputRef}
        type="text"
        className="city"
        placeholder="Search for a city"
        value={query}
        onFocus={() => setShowSuggestions(true)}
        onChange={handleInputChanged}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul 
          className="suggestions"
          style={{ 
            top: inputRef.current ? `${inputRef.current.getBoundingClientRect().bottom}px` : "45px",
            left: inputRef.current ? `${inputRef.current.getBoundingClientRect().left}px` : "0px", // Dynamically set left based on input position
            width: inputRef.current ? `${inputRef.current.offsetWidth}px` : "100%", // Dynamically set width to match input width
        }}
        >
          {suggestions.map((suggestion) => (
            <li onClick={handleItemClicked} key={suggestion}>{suggestion}</li>
          ))}
          <li key='See all cities' onClick={handleItemClicked}>
            <b>See all cities</b>
          </li>
        </ul>
      )}
    </div>
  );
};

export default CitySearch;