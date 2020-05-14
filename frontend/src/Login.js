import React, { Component } from 'react';  
import './App.css';  
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, Row } from 'reactstrap';  

class Login extends Component {  
    constructor() {  
        super();  
  
        this.state = {  
            Email: '',  
            Username: '' 
        }  
  
        this.Username = this.Username.bind(this);  
        this.Email = this.Email.bind(this);  
        this.login = this.login.bind(this);  
    }  
  
    Email(event) {  
        this.setState({ Email: event.target.value })  
    }  
    Username(event) {  
        this.setState({ Username: event.target.value })  
    }  
    login(event) {  
         
        fetch('https://whispering-forest-37838.herokuapp.com/login', {  
            method: 'post',  
            headers: {  
                'Accept': 'application/json',  
                'Content-Type': 'application/json'  
            },  
            body: JSON.stringify({  
                Email: this.state.Email,  
                Username: this.state.Username 
            })  
        }).then((Response) => Response.json())  
            .then((result) => {  
                console.log(result);  
                if (result.Status === 'Invalid')  
                    alert('Invalid User');  
                else  
                    this.props.history.push("/Dashboard");  
            })  
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
  
                                                <Input type="username" onChange={this.Username} placeholder="Username" />  
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