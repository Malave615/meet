// src/__tests__/NumberOfEvents.test.js

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';
import App from '../App';

describe('<NumberOfEvents /> component', () => {

  test('renders number of events text input', () => {
    render(<NumberOfEvents currentNOE={32} setCurrentNOE={() => {}} errorAlert={() => {}} setErrorAlert={() =>{}} />);
    const numberTextBox = screen.queryByRole('spinbutton');
    expect(numberTextBox).toBeInTheDocument();
    expect(numberTextBox).toHaveClass('number-of-events-input');
  });
  
  test('default number is 32', async () => {
    render(<NumberOfEvents currentNOE={32} setCurrentNOE={() => {}} errorAlert={() => {}} setErrorAlert={() =>{}} />);
    const numberTextBox = screen.queryByRole('spinbutton');
    expect(numberTextBox).toHaveValue(32);
  });

  test('number of events text box value changes when the user types in it', async () => {
    render(<NumberOfEvents currentNOE={32} setCurrentNOE={() => {}} errorAlert={() => {}} setErrorAlert={() =>{}} />);
    const user = userEvent.setup();
    const numberTextBox = screen.queryByRole('spinbutton');

    await user.clear(numberTextBox);
    await user.type(numberTextBox, "123")

    // 32 (the default value already written) + 123
    expect(numberTextBox).toHaveValue(123);
  });
});

describe('<NumberOfEvents /> integration', () => {
  test('renders the number of events selected by the user', async () => {
    const user = userEvent.setup();
    render(<App />);

    // const EventListDOM = screen.getByTestId('event-list');
    const numberTextBox = screen.getByRole('spinbutton');
    expect(numberTextBox).toBeInTheDocument();

    await user.clear(numberTextBox);
    await user.type(numberTextBox, "10");

    await waitFor(() => {
      const allRenderedEventItems = screen.queryAllByRole('listitem');
      expect(allRenderedEventItems.length).toBe(10);
    });
  }); 
});