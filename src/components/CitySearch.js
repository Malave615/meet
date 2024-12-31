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

  // Get the input's bouding rectangle for positioning the suggestions dropdown
  const inputPosition = inputRef.current ? inputRef.current.getBoundingClientRect() : null;

  return (
    <div data-testid="city-search" className="city-search-container">
      <h1>Meet App</h1>

      <div data-testid="cities-selector" className="cities-selector">
        <input
          ref={inputRef}
          type="text"
          className="city"
          placeholder="Search for a city"
          value={query}
          onFocus={() => setShowSuggestions(true)}
          onChange={handleInputChanged}
        />

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && inputPosition && (
          <ul 
            className="suggestions"
            style={{ 
              position: 'fixed',
              top: `${inputPosition.bottom + window.scrollY}px`, // Position dropdown below input,
              left: `${inputPosition.left + window.scrollX}px`, // Align to the left of the input,
              width: `${inputPosition.width}px`, // Make the width of the dropdown the same as the input
              transform: 'translateY(5px)',
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
    </div>
  );
};

export default CitySearch;