import React, { Component } from 'react';
import './App.css';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, Row } from 'reactstrap';
import Cookies from 'universal-cookie';

class Signin extends Component {
    constructor(props) {
        super();

        this.state = {
            Email: '',
            // Username: '',
            Password: ''
        }

        this.Email = this.Email.bind(this);
        this.Password = this.Password.bind(this);
        this.signin = this.signin.bind(this);
    }

    Email(event) {
        this.setState({ Email: event.target.value })
    }

    Password(event) {
        this.setState({ Password: event.target.value })
    }

    signin = (event) => {

        fetch('/signin', {
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
    };

    render() {

        return (
            <div className="main" >
                
                
            <div className="row row-cols-1 row-cols-md-2">
                <div className="mentor">
            
                <div className="col mb-4">
            <div className="card text-white bg-success mb-8 max-width: 18rem;">
  <div className="card-header text-center font-weight-bold display-5">SIGN IN AS A MENTOR</div>
  <div className="card-body">
    <Form>
    <InputGroup className="mb-3">

<Input type="text" onChange={this.Email} placeholder=" Email"/>
</InputGroup>
    <InputGroup className="mb-4">

<Input type="password" onChange={this.Password} placeholder="Password"/>
</InputGroup>
<Button onClick={this.signin} bg="Success" block>Sign in</Button>
    </Form>
    </div>
    </div>
   
  </div>
  </div>
 
  
  <div className="student">
  
  <div className="col mb-4">
            <div className="card text-white bg-danger mb-8 max-width: 18rem;">
  <div className="card-header text-center font-weight-bold"  block>SIGN IN AS A STUDENT</div>
  
  <div className="card-body">
    <Form>
    <InputGroup className="mb-3">

<Input type="text" onChange={this.Email} placeholder=" Email"/>
</InputGroup>
    <InputGroup className="mb-4">

<Input type="password" onChange={this.Password} placeholder="Password"/>
</InputGroup>
<Button onClick={this.signin} bg="Success" block>Sign in</Button>
    </Form>
    </div>
    </div>
  </div>
  </div>
  </div>
  </div>
  
  
        );
    }
}

export default Signin;  