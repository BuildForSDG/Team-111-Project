import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login';
import Signup from './Signup';
import Nav from './Nav';
import FooterPage from './FooterPage';
import Dashboard from './Dashboard';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(


  <Router>

    <Route path='/dashboard' component={Dashboard} />

    <Switch>

      <Route exact path="/" render={props => (
        <>
          <Nav />
          <App {...props} />
          <FooterPage />
        </>
      )} />

      <Route path='/login' component={Login} render={props => {
        return (<>
          <Nav />
          <Login {...props} />
          <FooterPage />
        </>)
      }} />

      <Route path='/signup' component={Signup} render={props => {
        return(<>
        <Nav />
        <Signup {...props} />
        <FooterPage />
        </>)
      }} />

    </Switch>

  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
