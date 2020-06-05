import React from 'react';
import { Card, CardText, CardTitle, Row, Col } from 'reactstrap';
import { Link } from "react-router-dom";
export default () => {
    return (
        <>
            <Row>
                <Col sm={3}>
                    <Card body inverse color="primary">
                        <p>Total Courses</p>
                        <h2>25</h2>
                    </Card>
                </Col>
                <Col sm={3}>
                    <Card body inverse style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}>
                        <p>Total Time Spent</p>
                        <h2>2 hrs</h2>
                    </Card>
                </Col>
                <Col sm={3}>
                    <Card body inverse style={{ backgroundColor: '#bd2130', borderColor: '#bd2130' }}>
                        <p>Profile Completeness</p>
                        <h2>20%</h2>
                    </Card>
                </Col>
                <Col sm={3}>
                    <Card body inverse style={{ backgroundColor: '#d39e00', borderColor: '#d39e00' }}>
                        <p>Something else</p>
                        <h2>24</h2>
                    </Card>
                </Col>
            </Row>
            <br /><br /><br />
            <div className="d-flex align-items-center justify-content-between">
                <h4 className="px-2">My Courses</h4>
                <Link to="/dashboard/courses">View all</Link>
            </div>
            <br />
            <br />
            <Row>
                <Col sm={4}>
                    <Card body>
                        <CardTitle>Nouns and Pronouns</CardTitle>
                        <CardText>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, ut?</CardText>
                    </Card>
                </Col>
                <Col sm={4}>
                    <Card body>
                        <CardTitle>Respiratory System</CardTitle>
                        <CardText>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, ut?</CardText>
                    </Card>
                </Col>
                <Col sm={4}>
                    <Card body>
                        <CardTitle>Algrebra</CardTitle>
                        <CardText>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, ut?</CardText>
                    </Card>
                </Col>
            </Row>
        </>
    )
}