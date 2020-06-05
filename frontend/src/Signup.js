import React, { Component } from 'react';
import { Button, Card, CardBody, Col,  Form, Input, InputGroup } from 'reactstrap';

class Signup extends Component {

    constructor() {
        super();

        this.state = {
            Name: '',
            Country: '',
            Email: '',
            Password: '',
            Username: '',
            Phone: ''

        }


        this.Email = this.Email.bind(this);
        this.Password = this.Password.bind(this);
        this.Name = this.Name.bind(this);
        this.Country = this.Country.bind(this);
        this.Phone = this.Phone.bind(this);
        this.Username = this.Username.bind(this);
        this.register = this.register.bind(this);
    }

    Email(event) {
        this.setState({ Email: event.target.value })
    }

    Username(event) {
        this.setState({ Username: event.target.value })
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
    Phone(event) {
        this.setState({ Phone: event.target.value })
    }

    register(event) {
        console.log(event)
        fetch('https://whispering-forest-37838.herokuapp.com/signup ', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.Name,
                password: this.state.Password,
                email: this.state.Email,
                username: this.state.Username,
                country_code: "NG",  /// for now tillupdate
                phone: this.state.Phone
            })
        }).then((Response) => Response.json())
            .then((Result) => {
                console.log(Result)
                if (Result && Result.username)
                    this.props.history.push("/Login");
                else
                    alert('Sorrrrrry !!!!')
            }).catch(error => {
                console.log(error.message)
            })
    }

    render() {

        return (
           
                    <div className="app d-flex flex-row justify-content-center content-container pb-5 mt-5">
                    
                            <Col md="9" lg="7" xl="6">
                                <Card className="mx-4">
                                    <CardBody className="p-4">
                                        <div className="col-sm-12 btn btn-primary">
                                            Sign Up
                        </div>
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
                                            <InputGroup className="mb-3">
                                                <Input type="text" onChange={this.Phone} placeholder="Phone" />
                                            </InputGroup>
                                            <Button onClick={this.register} color="primary" block>Create an Account</Button>
                                            
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>

                    </div>
               
            
        );
    }
}

export default Signup; 
