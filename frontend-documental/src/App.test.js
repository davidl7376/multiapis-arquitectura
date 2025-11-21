import { render, screen } from '@testing-library/react';
import App from './App';

test('renders arqui title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Arqui/i);
  expect(titleElement).toBeInTheDocument();
});