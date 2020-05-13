import React, { Component } from 'react'; 
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'; 
import './App.css';  
import Login from './Login';
import Signup from './Signup';



  class Dashboard extends Component {  
    render() {  
  
        return (  
            
            <Router>
            <div className="container">
            <div class="row" className="mb-2 pageheading">  
                <div class="col-sm-12 btn btn-info">  
                    Dashboard   
             </div>  
            </div>
              <nav className="navbar navbar-expand-lg navheader">
                <div className="wraper">
                  <nav className="navbar navbar-inverse">
      
                    <div className="row">
                      <div className="col-md-12">
      
                        <h1 className="navbar-brand text-white display-4 font-italic font-weight-bolder	text-monospace" > OfficeBlog </h1>
      
                      </div>
                    </div>
      
                  </nav>
                </div>
                <div className="collapse navbar-collapse" >
                  <ul className="navbar-nav ml-auto ">
                    <li className="nav-item">
                      <Link to={'/signup'} className="nav-link text-white">Sign Up</Link>
                    </li>
                    <li className="nav-item">
                      <Link to={'/login'} className="nav-link text-white">Login</Link>
                    </li>
                    
                  </ul>
                </div>
              </nav> <br />
              <Switch>
                <Route  exact path='/login' component={Login} />
                <Route  path='/signup' component={Signup} />
                
              </Switch>
              <Switch>
                <Route path='/Dashboard' component={Dashboard} />
              </Switch>
            </div>
          </Router>
        );  
    }  
}  
  
export default Dashboard; 