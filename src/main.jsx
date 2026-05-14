import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* HashRouter facilita el despliegue en GitHub Pages sin configuración adicional. */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
