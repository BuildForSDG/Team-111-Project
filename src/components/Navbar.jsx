import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
    return (
        <nav className="navbar navbar-expand-lg navheader">
            <div className="collapse navbar-collapse" >
                <div className="mr-auto text-white display-5 font-italic font-weight-bolder	text-monospace col-sm-3 color-secondary">
                    TeachersPlatform
            </div>
                <ul className="navbar-nav ml-auto ">
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
    )
}
