import React, { useState } from 'react';
import { Alert, Button, Card, CardBody, Col, Container, Form, Input, InputGroup, Row } from 'reactstrap';
import { doPost } from "../utils/apiRequestHandler";
import useForm from '../hooks/useForm';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar'
import { useHistory } from "react-router-dom";
import auth from '../auth';
import Footer from '../components/Footer';


export default () => {
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ color: '', message: '' });
    const [fields, handleChange] = useForm({
        username: '',
        password: '',
    });
    let history = useHistory();

    // if (localStorage.getItem("token")){
    //     history.push("dashboard")
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert({ color: '', message: '' });
        setLoading(true);
        const res = await doPost('login', { ...fields });
        setLoading(false);
        if (!`${res.reqStatus}`.match(/^20.$/)) return setAlert({ color: 'danger', message: res.message });
        const token = res.results.auth_token;
        auth.authenticate(token);
        history.push('dashboard');
    }

    return (
        <>
            <Container>
                <Navbar />
                <Row className="justify-content-center">
                    <Col md="9" lg="7" xl="6">
                        <Alert
                            isOpen={!!alert.message}
                            toggle={() => setAlert({ color: '', message: '' })}
                            color={alert.color || 'warning'}
                        >
                            {alert.message}
                        </Alert>
                        <Card>
                            <CardBody>
                                <div className="card-title font-weight-bold mb-5">
                                    Login to your account!
                            </div>
                                <Form onSubmit={handleSubmit}>
                                    <InputGroup className="mb-2">
                                        <Input value={fields.username} name="username" type="text"
                                            onChange={handleChange} placeholder="Username" required
                                            disabled={loading} />
                                    </InputGroup>
                                    <InputGroup className="mb-2">
                                        <Input value={fields.password} name="password" type="password"
                                            onChange={handleChange} placeholder="Password" required
                                            disabled={loading} />
                                    </InputGroup>
                                    <Button type="submit" color="primary" size="lg" className="mt-5" disabled={loading}>
                                        Login
                                </Button>

                                    <p className='pt-3'>
                                        Don't have an account? <Link to='/register'>Register here</Link>
                                    </p>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
}