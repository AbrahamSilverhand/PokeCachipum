
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('PokéArena: Initializing application...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("PokéArena Error: Could not find root element with ID 'root'");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('PokéArena: Root rendered successfully.');
} catch (err) {
  console.error('PokéArena: Fatal error during render:', err);
}
