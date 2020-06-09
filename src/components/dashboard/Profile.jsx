import React, { useState } from 'react';
import { Row, Col, Nav, NavLink, NavItem, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';

export default () => {
    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h4 className="px-2">Account</h4>
            </div>
            <br />
            <br />
            <Row>
                <Col md="4">
                    <Nav tabs pills vertical>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '1' })}
                                onClick={() => { toggle('1'); }}
                            >Profile
                        </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '2' })}
                                onClick={() => { toggle('2'); }}
                            >Summary
                    </NavLink>
                        </NavItem>
                    </Nav>
                </Col>
                <Col md="8">
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                            <Row>
                                <ul className="list-group w-100">
                                    <li className="list-group-item list-group-item-action w-100">
                                        <div className="d-flex w-100 justify-content-between">
                                            <h5 className="mb-1">Jason Scars</h5>
                                            <small>Edit</small>
                                        </div>
                                        <p className="mb-0 text-warning">Full Name</p>
                                    </li>
                                    <li className="list-group-item list-group-item-action w-100">
                                        <div className="d-flex w-100 justify-content-between">
                                            <h5 className="mb-1">jaysins@gmail.com</h5>
                                            <small>Edit</small>
                                        </div>
                                        <p className="mb-0 text-warning">Email Address</p>
                                    </li>
                                    <li className="list-group-item list-group-item-action w-100">
                                        <div className="d-flex w-100 justify-content-between">
                                            <h5 className="mb-1">09032323434</h5>
                                            <small>Edit</small>
                                        </div>
                                        <p className="mb-0 text-warning">Phone Number</p>
                                    </li>
                                    <li className="list-group-item list-group-item-action w-100">
                                        <div className="d-flex w-100 justify-content-between">
                                            <h5 className="mb-1">Nigeria</h5>
                                            <small>Edit</small>
                                        </div>
                                        <p className="mb-0 text-warning">Country</p>
                                    </li>
                                </ul>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <ul className="list-group">
                                <li className="list-group-item d-flex justify-content-between">Total courses <span>20</span></li>
                                <li className="list-group-item d-flex justify-content-between">Total hours spent learning <span>200 hours</span></li>
                                <li className="list-group-item d-flex justify-content-between">Number of courses started <span>14</span></li>
                                <li className="list-group-item d-flex justify-content-between">Number of courses completed <span>2</span></li>
                            </ul>
                        </TabPane>
                    </TabContent>
                </Col>
            </Row>
        </>
    )
}