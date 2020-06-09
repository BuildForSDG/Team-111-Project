import React from 'react';
import { Container, Row, Col, } from 'reactstrap';
import Navbar from '../components/Navbar';

export default () => {
    return (
        <Container>
            <Navbar />
            <Row className="justify-content-center">
            </Row>
        </Container>
    )
}