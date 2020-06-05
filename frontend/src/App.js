import React from 'react';

import { Container, Row, Col, } from "reactstrap";
import "./App.css";

class App extends React.Component {

  render() {
    // const overlay = (
    //   <div
    //     id="sidenav-overlay"
    //     style={{ backgroundColor: "transparent" }}
    //     onClick={this.toggleCollapse("navbarCollapse")}
    //   />
    // );
    return (
      <div>
        <div className="hero-container">
          <div className="pix">
            <img src='/Dashboard.image/Dashboard 1 (1).png' className="img-fluid" alt="" />
          </div>
          <Container>
            <div className="sign">
              <a className="btn btn-primary btn-lg" href="/signup" role="button">Signup</a>
            </div>
            <Row >
              <Col className="text-center">
                <h1>Welcome!</h1>
                <h5>
                  To a free Educational Platform <br />where teachers mentors teachers.
              </h5>
              </Col>
            </Row>
          </Container>
        </div>


      </div>

    )
  }
}

export default App;
