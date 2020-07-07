import React, { useReducer, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import auth from './auth';
import reducer from './reducer';
import AppContext from './context'

export default ({ user }) => {
  const [state, dispatch] = useReducer(reducer);

  useEffect(() => {
    if (user) dispatch({ type: 'SET_USER', payload: user });
  }, [user])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
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
    </AppContext.Provider>
  )
};

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
