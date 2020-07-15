import React, {useEffect, useRef, useState} from 'react';
import {Card, CardText, CardTitle, Row, Col, Button} from 'reactstrap';
import {Link} from "react-router-dom";
import {getMyCourses} from "../../utils/dependencies";

export default () => {
    const [myCourses, setMyCourses] = useState([]);
    const rendered = useRef(false)
    useEffect(() => {
        if (myCourses.length < 1 && !rendered.current) getMyCourses().then(results => {
            setMyCourses(results)
            rendered.current = true;
        });
    }, [myCourses]);

    return (
        <>
            <Row>
                <Col sm={3}>
                    <Link to="/dashboard/courses?tab=2">
                        <Card body inverse color="primary">
                            <p>Total Courses</p>
                            <h2>{myCourses.length}</h2>
                        </Card>
                    </Link>
                </Col>
                <Col sm={3}>
                    <Card body inverse style={{backgroundColor: '#28a745', borderColor: '#28a745'}}>
                        <p>Total Time Spent</p>
                        <h2><b>Coming Soon</b></h2>
                    </Card>
                </Col>
                <Col sm={3}>
                    <Link to={'/dashboard/profile'}>
                    <Card body inverse style={{backgroundColor: '#bd2130', borderColor: '#bd2130'}}>
                        <p>Profile Completeness</p>
                        <h2>20%</h2>
                    </Card>
                    </Link>
                </Col>
                <Col sm={3}>
                    <Card body inverse style={{backgroundColor: '#d39e00', borderColor: '#d39e00'}}>
                        <p>More</p>
                        <h2><b>Coming Soon</b></h2>
                    </Card>
                </Col>
            </Row>
            <br/><br/><br/>
            <div className="d-flex align-items-center justify-content-between">
                <h4 className="px-2">My Courses</h4>
                <Link to="/dashboard/courses?tab=2">View all</Link>
            </div>
            {myCourses.length < 1 &&
            <div className="d-flex align-items-center justify-content-center flex-column">
                <p className="px-2 text-muted mt-5 mb-3">No Course Available</p>
                <Link to={'/dashboard/courses/add'}>
                    <Button className="mb-4" outline type="button" color="primary">
                        Add new course
                    </Button>
                </Link>
            </div>
            }
            <br/>
            <br/>
            <Row>
                {myCourses.map(course => (
                    <Col sm={4} key={course.type.code} className="mb-4">
                        <Card body>

                            <CardTitle>{course.type.name}</CardTitle>
                            <CardText>{course.type.description}</CardText>

                        </Card>
                    </Col>

                ))}
            </Row>
        </>
    )
}