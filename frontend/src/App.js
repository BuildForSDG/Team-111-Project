import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import Signup from './Signup';
import Signin from './Signin';

class App extends React.Component{
  render(){
    return(
      <Router>
      <div className="container">
      <div className="row" >
          

      </div>
        <nav className="navbar navbar-expand-lg navheader ">
          <div className="wrapper">

          </div>
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
            
        </nav> <br />
        <Switch>
          <Route  path='/login' component={Login} />
          <Route  path='/signup' component={Signup} />
          <Route  path='/signin' component={Signin} />


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
