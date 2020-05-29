import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, Row } from 'reactstrap';
import Cookies from 'universal-cookie';

class Login extends Component {
    constructor(props) {
        super();

        this.state = {
            Email: '',
            // Username: '',
            Password: ''
        }

        this.Email = this.Email.bind(this);
        this.Password = this.Password.bind(this);
        this.login = this.login.bind(this);
    }

    Email(event) {
        this.setState({ Email: event.target.value })
    }

    Password(event) {
        this.setState({ Password: event.target.value })
    }

    login(event) {

        fetch('https://whispering-forest-37838.herokuapp.com/login', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.Email,
                password: this.state.Password
            })
        }).then((Response) => {
            Response.json().then(data => {
                if (Response.status !== 201) {
                    console.log(data)
                    return
                }
                const cookies = new Cookies();
                cookies.set('auth_token', data.auth_token, { path: '/' });
                this.props.history.push("/Dashboard");
            });
        }
        )
    }

    render() {

        return (
            <div className="app flex-row align-items-center">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="9" lg="7" xl="6">

                            <CardGroup>
                                <Card className="p-2">
                                    <CardBody>
                                        <Form>

                                            <InputGroup className="mb-3">

                                                <Input type="text" onChange={this.Email} placeholder=" Email" />
                                            </InputGroup>
                                            <InputGroup className="mb-4">

                                                <Input type="password" onChange={this.Password} placeholder="Password" />
                                            </InputGroup>
                                            <Button onClick={this.login} color="primary" block>Login</Button>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </CardGroup>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Login;  