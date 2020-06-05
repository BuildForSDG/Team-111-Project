import React from 'react';
import {  Nav } from 'reactstrap';



class Dashboard extends React.Component {
    render() {
       
        return (
            <div>
                <Nav className="navbar navbar-dark fixed-top bg-primary flex-md-nowrap p-0 shadow">
                    <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">TeachersPlatform</a>
                    <h3 className="text-white">Dashboard</h3>
                </Nav>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-2 bg-dark text-white d-none d-md-block sidebar">
                            <div className="left-sidebar">
                                <ul className="nav flex-column sidebar-nav">
                                    <li className="nav-item">
                                        <a className="nav-link active text-white" href="#">
                                            Courses
    </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link text-white" href="#">
                                            Students
    </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link text-white" href="#">
                                            Mentors
    </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link text-white" href="#">
                                            Certificate
    </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link text-white" href="#">
                                            Reports
    </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="container-part">

                    <div className="right-part">
                        <h3>Manage the platform</h3>
                        <div id="box1">
                            <p>Courses</p>
                            <p>20</p>
                        </div>
                        <div id="box2">
                            <p>Students</p>
                            <p>1000</p>
                        </div>
                        <div id="box3">
                            <p>Mentors</p>
                        </div>
                        <div id="box4">
                            <p>Certificate</p>
                        </div>
                    </div>

                </div>

                
                






            </div>


        )
    }
}


export default Dashboard;



