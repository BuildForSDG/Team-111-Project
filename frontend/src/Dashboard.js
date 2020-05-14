import React, { Component } from 'react'; 
import './App.css';  
import { Col, Row, Container } from 'reactstrap';
 
class Dashboard extends Component {  
    render() {  
  
        return (  
            <Container className="mt-5">
                <Row className="mb-7">
                    <Col md="20">
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