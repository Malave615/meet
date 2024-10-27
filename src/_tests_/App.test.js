// src/_tests_/App.test.js

import { render, screen } from '@testing-library/react';
import App from '../App';

describe('<App /> component', () => {

  test('renders list of events', () => {
    render(<App />);
    expect(screen.getByTestId('event-list')).toBeInTheDocument();
  });

  test('renders CitySearch', () => {
    render(<App />);
    expect(screen.getByTestId('city-search')).toBeInTheDocument();
  });

  test('renders NumberOfEvents', () => {
    render(<App />);
    expect(screen.getByTestId('number-of-events')).toBeInTheDocument();
  });
});
