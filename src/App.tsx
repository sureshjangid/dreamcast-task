import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import UserTable from './components/UserTable';

const App: React.FC = () => (
  <Provider store={store}>
    <div className="container mt-5">
      <h1>User Management</h1>
      <UserTable />
    </div>
  </Provider>
);

export default App;
