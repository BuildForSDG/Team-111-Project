import React, { Component } from 'react';
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, Row} from 'reactstrap';
import { Link } from 'react-router-dom';

class Signup extends Component {

    constructor() {
        super();

        this.state = {
            EmployeeName: '',
            City: '',
            Email: '',
            Password: '',
            Department: ''
        }


        this.Email = this.Email.bind(this);
        this.Password = this.Password.bind(this);
        this.EmployeeName = this.EmployeeName.bind(this);
        this.Password = this.Password.bind(this);
        this.Department = this.Department.bind(this);
        this.City = this.City.bind(this);
        this.register = this.register.bind(this);
    }



    Email(event) {
        this.setState({ Email: event.target.value })
    }

    Department(event) {
        this.setState({ Department: event.target.value })
    }

    Password(event) {
        this.setState({ Password: event.target.value })
    }
    City(event) {
        this.setState({ City: event.target.value })
    }
    EmployeeName(event) {
        this.setState({ EmployeeName: event.target.value })
    }

    register(event) {

        fetch('https://whispering-forest-37838.herokuapp.com/signup', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                EmployeeName: this.state.EmployeeName,
                Password: this.state.Password,
                Email: this.state.Email,
                City: this.state.City,
                Department: this.state.Department
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

                                        <div className="col-sm-12 btn btn-primary">
                                            Sign Up
                        </div>

                                        <InputGroup className="mb-3">
                                            <Input type="text" onChange={this.EmployeeName} placeholder="Employee" />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <Input type="text" onChange={this.Email} placeholder="Email" />
                                        </InputGroup>
                                        <InputGroup className="mb-3">
                                            <Input type="password" onChange={this.Password} placeholder=" Password" />
                                        </InputGroup>
                                        <InputGroup className="mb-4">
                                            <Input type="text" onChange={this.City} placeholder="City" />
                                        </InputGroup>
                                        <InputGroup className="mb-4">
                                            <Input type="text" onChange={this.Department} placeholder="Department" />
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
