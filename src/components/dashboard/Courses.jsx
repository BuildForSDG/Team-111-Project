import React, { useState } from 'react';
import { Card, CardText, CardTitle, Row, Col, Nav, NavLink, NavItem, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';

export default () => {
    const [activeTab, setActiveTab] = useState('1');

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
                            onClick={() => { toggle('1'); }}
                        >All courses
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '2' })}
                            onClick={() => { toggle('2'); }}
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
                        <Col sm={4}>
                            <Card className="mb-4" body>
                                <CardTitle>
                                    Nouns and Pronouns
                                    <br /><small className="text-info">Dr Aminou</small>
                                </CardTitle>
                                <CardText>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, ut?</CardText>
                            </Card>
                        </Col>
                        <Col sm={4}>
                            <Card className="mb-4" body>
                                <CardTitle>
                                    Respiratory System
                                    <br /><small className="text-info">Dr Aminou</small>
                                </CardTitle>
                                <CardText>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, ut?</CardText>
                            </Card>
                        </Col>
                        <Col sm={4}>
                            <Card className="mb-4" body>
                                <CardTitle>
                                    Algrebra
                                    <br /><small className="text-info">Dr Aminou</small>
                                </CardTitle>
                                <CardText>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, ut?</CardText>
                            </Card>
                        </Col>
                        <Col sm={4}>
                            <Card className="mb-4" body>
                                <CardTitle>
                                    Algrebra
                                    <br /><small className="text-info">Dr Aminou</small>
                                </CardTitle>
                                <CardText>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, ut?</CardText>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="2">
                    <Row>
                        <Col sm={4}>
                            <Card body>
                                <CardTitle>Nouns and Pronouns</CardTitle>
                                <CardText>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, ut?</CardText>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>

        </>
    )
}