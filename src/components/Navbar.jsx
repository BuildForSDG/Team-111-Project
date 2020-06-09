import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import auth from '../auth';

export default () => {

    let history = useHistory();

    const logout = () => {
        auth.signout();
        history.push('/login');
    }

    return (
        <nav className="navbar navbar-expand-lg navheader">
            <div className="collapse navbar-collapse" >
                <Link to="/" className="mr-auto text-white display-5 font-italic font-weight-bolder	text-monospace col-sm-3 color-secondary">
                    TeachersPlatform
                </Link>
                {
                    !auth.isAuthenticated ? (
                        <ul className="navbar-nav ml-auto ">
                            <li className="nav-item ml-4">
                                <Link to={'/register'} className="nav-link text-white">Register</Link>
                            </li>
                            <li className="nav-item ml-4">
                                <Link to={'/login'} className="nav-link text-white">Login</Link>
                            </li>
                        </ul>
                    ) : (
                            <ul className="navbar-nav ml-auto ">
                                <li className="nav-item ml-4">
                                    <Link to={'/dashboard'} className="nav-link text-white">Dashboard</Link>
                                </li>
                                <li className="nav-item ml-4">
                                    <a href="#" onClick={logout} className="nav-link text-white">Logout</a>
                                </li>
                            </ul>
                        )
                }
            </div>
        </nav>
    )
}
