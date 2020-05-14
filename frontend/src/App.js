import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import Signup from './Signup';

class App extends React.Component{
  render(){
    return(
      <Router>
      <div className="container">
      <div className="row" className="mb-2 pageheading">
          <div className="col-sm-3 btn btn-primary">
            TeachersPlatform
       </div>

      </div>
        <nav className="navbar navbar-expand-lg navheader">
          <div className="wrapper">

          </div>
          <div className="collapse navbar-collapse" >
            <ul className="navbar-nav ml-auto ">
              <li className="nav-item">
                <Link to={'/signup'} className="nav-link">Sign Up</Link>
              </li>
              <li className="nav-item">
                <Link to={'/login'} className="nav-link">Login</Link>
              </li>

            </ul>
          </div>
        </nav> <br />
        <Switch>
          <Route  path='/login' component={Login} />
          <Route  path='/signup' component={Signup} />

        </Switch>
        <Switch>
          <Route path='/dashboard' component={Dashboard} />
        </Switch>
      </div>
    </Router>
    )
  }
}

export default App;
