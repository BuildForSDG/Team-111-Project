import React from 'react';
import { Container } from 'reactstrap';
import {
    Switch,
    Route,
    Link,
    useRouteMatch, useHistory
} from "react-router-dom";
import Home from '../components/dashboard/Home';
import Courses from '../components/dashboard/Courses';
import Profile from '../components/dashboard/Profile';
import auth from '../auth';
import CourseDetails from '../components/dashboard/CourseDetails';
import AddCourse from '../components/dashboard/AddCourse';

export default () => {
    let { path, url } = useRouteMatch();
    let history = useHistory();

    const logout = () => {
        auth.signout();
        history.push('/');
    }

    if (!auth.isAuthenticated) {
        history.push("login")
    }

    return (
        <div className="dashboard">
            <div className="top" />
            <Container>
                <nav className="navbar navbar-expand-lg navheader">
                    <div className="collapse navbar-collapse" >
                        <Link to="/" className="p-0 mr-auto text-white display-5 font-italic font-weight-bolder	text-monospace col-sm-3 color-secondary">
                            <img className="logo" src="/images/logo.svg" alt="" />
                        </Link>
                        <ul className="navbar-nav ml-auto ">
                            <li className="nav-item ml-4">
                                <Link to={`${url}`} className="nav-link text-white">Overview</Link>
                            </li>
                            <li className="nav-item ml-4">
                                <Link to={`${url}/courses`} className="nav-link text-white">Courses</Link>
                            </li>
                            <li className="nav-item ml-4">
                                <Link to={`${url}/profile`} className="nav-link text-white">Account</Link>
                            </li>
                            <li className="nav-item ml-4">
                                <a href="#" onClick={logout} className="nav-link text-white">Logout</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <main className="content">
                    <Switch>
                        <Route path={`${path}/`} exact><Home /></Route>
                        <Route path={`${path}/courses`} exact><Courses /></Route>
                        <Route path={`${path}/courses/add`} exact><AddCourse /></Route>
                        <Route path={`${path}/courses/:id`} exact><CourseDetails /></Route>
                        <Route path={`${path}/profile`} exact><Profile /></Route>
                    </Switch>
                </main>
            </Container>
        </div >
    );
}