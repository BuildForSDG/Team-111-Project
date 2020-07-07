import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import { doGet } from './utils/apiRequestHandler'
import auth from './auth';

import * as serviceWorker from './serviceWorker';

const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const res = await doGet('/profile');
    if (res.reqStatus !== 200) {
      auth.signout();
      return null
    };
    auth.authenticate(token);
    return res.results;
  }
  catch (e) {
    localStorage.clear();
    return null;
  }
}

checkAuth().then((user) => {
  ReactDOM.render(
    <BrowserRouter>
      <App user={user} />
    </BrowserRouter>,
    document.getElementById('root')
  );
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
