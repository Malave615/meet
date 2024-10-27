// src/_tests_/NumberOfEvents.test.js

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
  let NumberOfEventsComponent;
  const mockSetCurrentNOE = jest.fn();
  const mockSetErrorAlert = jest.fn();

  test('component contains input textbox', () => {
    NumberOfEventsComponent = render(<NumberOfEvents currentNOE={32} setCurrentNOE={() => {}} setErrorAlert={() => {}} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  test('ensures the default value of textbox is 32', () => {
    NumberOfEventsComponent = render(<NumberOfEvents currentNOE={32} setCurrentNOE={() => {}} setErrorAlert={() => {}} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('32');
  });

  test('textbox value changes when user updates input', async () => {
    NumberOfEventsComponent = render(<NumberOfEvents currentNOE={32} setCurrentNOE={mockSetCurrentNOE} setErrorAlert={mockSetErrorAlert} />);
    const input = screen.getByTestId('numberOfEventsInput');
    const user = userEvent.setup();
    await user.clear(input);
    await user.type(input, '10');
    expect(input).toHaveValue('10');
    expect(mockSetCurrentNOE).toHaveBeenCalledWith('10');
  });

  test('displays error alert for invalid input', async () => {
    NumberOfEventsComponent = render(<NumberOfEvents currentNOE={32} setCurrentNOE={mockSetCurrentNOE} setErrorAlert={mockSetErrorAlert} />);
    const input = screen.getByTestId('numberOfEventsInput');
    const user = userEvent.setup();

    await user.clear(input);
    await user.type(input, '-5');
    expect(mockSetErrorAlert).toHaveBeenCalledWith('Please enter a valid number of events');
  });

  test('displays error alert for exceeding maximum', async () => {
    NumberOfEventsComponent = render(<NumberOfEvents currentNOE={32} setCurrentNOE={mockSetCurrentNOE} setErrorAlert={mockSetErrorAlert} />);
    const input = screen.getByTestId('numberOfEventsInput');
    const user = userEvent.setup();

    await user.clear(input);
    await user.type(input, '33');
    expect(mockSetErrorAlert).toHaveBeenCalledWith('Only maximum of 32 is allowed');
  });
});