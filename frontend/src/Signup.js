import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, Row} from 'reactstrap';
import { Link } from 'react-router-dom';

class Signup extends Component {

    constructor() {
        super();

        this.state = {
            Name: '',
            Country: '',
            Email: '',
            Password: '',
            Username: ''
            
        }


        this.Email = this.Email.bind(this);
        this.Password = this.Password.bind(this);
        this.Name = this.Name.bind(this);
        this.Country = this.Country.bind(this);
        this.Username = this.Username.bind(this);
        this.register = this.register.bind(this);
    }



    Email(event) {
        this.setState({ Email: event.target.value })
    }

    Password(event) {
        this.setState({ Password: event.target.value })
    }
    Country(event) {
        this.setState({ Country: event.target.value })
    }
    Name(event) {
        this.setState({ Name: event.target.value })
    }
    Username(event) {
        this.setState({ Username: event.target.value })
    }

    register(event) {

        fetch('https://whispering-forest-37838.herokuapp.com/signup ', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Name: this.state.Name,
                Password: this.state.Password,
                Email: this.state.Email,
                Country: this.state.Country,
                Username: this.state.Username
            })
        }).then((Response) => Response.json())
            .then((Result) => {
                console.log(Result)
                if (Result.Status === 'Success')
                    this.props.history.push("/Dashboard");
                else
                    alert('Sorrrrrry !!!!')
            }).catch(error => {
                console.log(error.message)
            })
    }

    render() {

        return (
            <div className="app flex-row align-items-center">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="9" lg="7" xl="6">
                            <Card className="mx-4">
                                <CardBody className="p-4">
                                    <Form>

                                        

                                        <InputGroup className="mb-3">
                                            <Input type="text" onChange={this.Name} placeholder="Name" />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <Input type="text" onChange={this.Email} placeholder="Email" />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <Input type="password" onChange={this.Password} placeholder="Password" />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <Input type="text" onChange={this.Country} placeholder="Country" />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <Input type="text" onChange={this.Username} placeholder="Username" />
                                        </InputGroup>
                                        <Button onClick={this.register} color="primary" block>Create an Account</Button>
                                        <p className='pt-3'>
                                            Already have an account? <Link to='/'>Login</Link>
                                        </p>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Signup; 
