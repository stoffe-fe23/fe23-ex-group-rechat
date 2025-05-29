import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from "./datastore/store";
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App.tsx';

// Add Redux store and React router to App component
createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
)
