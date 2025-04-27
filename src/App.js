import React from 'react';
import Dashboard from './components/Dashboard';
import { Provider } from 'react-redux';
import { store } from './store/index';
import './styles.css';

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <Dashboard />
      </div>
    </Provider>
  );
}

export default App;