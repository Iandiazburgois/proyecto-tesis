import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './estilos.css';
import App from './App.jsx';

// BrowserRouter envuelve toda la aplicación para que funcionen las rutas (clase 29)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);