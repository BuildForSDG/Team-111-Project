import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

export default () => (
  <div className="container">
    <nav className="navbar navbar-expand-lg navheader">
      <div className="collapse navbar-collapse" >
        <div className="mr-auto text-white display-5 font-italic font-weight-bolder	text-monospace col-sm-3 color-secondary">
          TeachersPlatform
          </div>
        <ul className="navbar-nav ml-auto ">
          <li className="nav-item">
            <Link to={'/login'} className="nav-link text-white">Courses</Link>
          </li>
          <li className="nav-item ml-4">
            <Link to={'/dashboard'} className="nav-link text-white">Dashboard</Link>
          </li>
          <li className="nav-item ml-4">
            <Link to={'/register'} className="nav-link text-white">Register</Link>
          </li>
          <li className="nav-item ml-4">
            <Link to={'/login'} className="nav-link text-white">Login</Link>
          </li>
        </ul>
      </div>
    </nav>
    <Switch>
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
      <Route path='/dashboard' component={Dashboard} />
    </Switch>
  </div>
);