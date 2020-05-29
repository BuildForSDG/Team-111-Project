import React from "react";
import { Col, Container, Row, Navbar } from "reactstrap";

class FooterPage extends React.Component {
  render() {
    return (
      <footer >
        <div className="footer-title text-center py-3 bg-beige" fixed="bottom" expand="md" >



          <div text="primary center" >
            <h5 className="title " >TeachersPlatform</h5>
            <p>
              Everybody deserves an opportunity to improve on their skills
            </p>
          </div>

          <div className="footer-copyright text-center py-3">
            <Container fluid>
              &copy; {new Date().getFullYear()} Copyright: <a href="https://www.teachersplatform.com"> TeachersPlatform.com </a>
            </Container>
          </div>

        </div>
      </footer>
    );
  }
}

export default FooterPage;