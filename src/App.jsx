import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Signin from './pages/Signin';

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
          <li className="nav-item">
            <Link to={'/signup'} className="nav-link text-white">Sign Up</Link>
          </li>
          <li className="nav-item">
            <Link to={'/login'} className="nav-link text-white">Login</Link>
          </li>
          <li className="nav-item">
            <Link to={'/login'} className="nav-link text-white">Signin</Link>
          </li>
        </ul>
      </div>
    </nav>
    <Switch>
      <Route path='/login' component={Login} />
      <Route path='/signup' component={Signup} />
      <Route path='/signin' component={Signin} />
      <Route path='/dashboard' component={Dashboard} />
    </Switch>
  </div>
);