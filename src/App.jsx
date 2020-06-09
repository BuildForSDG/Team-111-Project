import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import auth from './auth';

export default () => (
  <Switch>
    <Route path='/' exact>
      <Home />
    </Route>
    <GuestRoute path='/login'>
      <Login />
    </GuestRoute>
    <GuestRoute path='/register'>
      <Register />
    </GuestRoute>
    <PrivateRoute path='/dashboard'>
      <Dashboard />
    </PrivateRoute>
  </Switch>
);

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.isAuthenticated ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}

function GuestRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !auth.isAuthenticated ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/dashboard",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}
