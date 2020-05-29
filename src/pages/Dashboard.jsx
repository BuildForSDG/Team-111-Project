import React, { Component } from 'react';
// import './App.css';  
import { Col, Row, Container } from 'reactstrap';



class Dashboard extends Component {
    render() {

        return (
            <Container className="nav">
                <Row >
                    <Col>
                        <div>
                            <img src='/Dashboard.image/Dashboard 1 (1).png' className="img-fluid" alt="" />
                        </div>
                    </Col>
                </Row>
            </Container>

        );
    }
}

export default Dashboard; 