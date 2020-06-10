import React from 'react';
import { Container, Row, Col, } from 'reactstrap';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default () => {
    return (
        <>
            <Container className="welcome">
                <Navbar />
                <Row className="justify-content-center">
                    <Col sm="12" md="6">
                        <div className="hgroup">
                            <h1 className="title">Welcome!</h1>
                            <p className="subtitle">
                                To a free Educational Platform <br />where teachers mentors teachers.
                        </p>
                            <Link className="cta" to="/register">Get started</Link>
                        </div>
                    </Col>
                    <Col sm="12" md="6">
                        <div className="image">
                            <img src='/images/hero.png' className="img-fluid" alt="Hero" />
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    )
}