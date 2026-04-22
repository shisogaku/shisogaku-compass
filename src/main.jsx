import React from 'react';
import ReactDOM from 'react-dom/client';
import CommunicationCompass from './views/app.jsx';
import ErrorBoundary from './views/ErrorBoundary.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <CommunicationCompass />
    </ErrorBoundary>
  </React.StrictMode>
);
