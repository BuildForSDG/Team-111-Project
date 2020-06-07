import React from 'react';
import { Container } from 'reactstrap';
import {
    Switch,
    Route,
    Link,
    useRouteMatch
} from "react-router-dom";
import Home from '../components/dashboard/Home';
import Courses from '../components/dashboard/Courses';
import Profile from '../components/dashboard/Profile';

export default () => {
    let { path, url } = useRouteMatch();

    return (
        <div className="dashboard">
            <div className="top" />
            <Container>
                <nav className="navbar navbar-expand-lg navheader">
                    <div className="collapse navbar-collapse" >
                        <div className="mr-auto text-white font-italic font-weight-bolder">
                            TeachersPlatform
                            </div>
                        <ul className="navbar-nav ml-auto ">
                            <li className="nav-item ml-4">
                                <Link to={`${url}`} className="nav-link text-white">Home</Link>
                            </li>
                            <li className="nav-item ml-4">
                                <Link to={`${url}/courses`} className="nav-link text-white">Courses</Link>
                            </li>
                            <li className="nav-item ml-4">
                                <Link to={`${url}/profile`} className="nav-link text-white">Account</Link>
                            </li>
                            <li className="nav-item ml-4">
                                <Link to={`/`} className="nav-link text-white">Logout</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
                <main className="content">
                    <Switch>
                        <Route path={`${path}/`} exact><Home /></Route>
                        <Route path={`${path}/courses`} exact><Courses /></Route>
                        <Route path={`${path}/profile`} exact><Profile /></Route>
                    </Switch>
                </main>
            </Container>
        </div >
    );
}