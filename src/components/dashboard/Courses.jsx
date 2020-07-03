import React, { useEffect, useState } from 'react';
import { Card, CardText, CardTitle, Row, Col, Nav, NavLink, NavItem, TabContent, TabPane, Button } from 'reactstrap';
import classnames from 'classnames';
import { getAvailableCourses, getMyCourses } from "../../utils/dependencies";
import { Link, useRouteMatch } from 'react-router-dom'

export default () => {
    let { url } = useRouteMatch();
    const [activeTab, setActiveTab] = useState('1');
    const [availableCourses, setAvailableCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);

    useEffect(() => {
        if (availableCourses.length < 1) getAvailableCourses().then(results => setAvailableCourses(results));
        if (myCourses.length < 1) getMyCourses().then(results => setMyCourses(results));
    }, [availableCourses, myCourses]);

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }
    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h4 className="px-2">Courses</h4>

                <Nav tabs pills>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '1' })}
                            onClick={() => {
                                toggle('1');
                            }}
                        >All courses
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '2' })}
                            onClick={() => {
                                toggle('2');
                            }}
                        >My courses
                        </NavLink>
                    </NavItem>
                </Nav>
            </div>
            <br />
            <br />
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                    <Row>
                        {availableCourses.map(course => (
                            <Col sm={4}>
                                <Link to={`${url}/${course._id}`}>
                                    <Card className="mb-4" key={course.type.code} body>
                                        <CardTitle>
                                            {course.type.name}
                                            <br /><small className="text-info">{course.teacher_data.name}</small>
                                        </CardTitle>
                                        <CardText>{course.type.description}</CardText>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </TabPane>
                <TabPane tabId="2">
                    <div className="d-flex justify-content-end">
                        <Link to={`${url}/add`}>
                            <Button className="mb-4" outline type="button" color="primary">
                                Add new course
                            </Button>
                        </Link>
                    </div>
                    <Row>
                        {myCourses.map(course => (
                            <Col sm={4} key={course.type.code}>
                                <Card body>
                                    <CardTitle>{course.type.name}</CardTitle>
                                    <CardText>{course.type.description}</CardText>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </TabPane>
            </TabContent>

        </>
    )
}