import React from 'react';
import { Link} from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Container } from "reactstrap";
import "./App.css";

class Nav extends React.Component {
  state = {
    collapseID: ""
  };

  toggleCollapse = collapseID => () =>
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ""
    }));


  render() {
    const overlay = (
      <div
        id="sidenav-overlay"
        style={{ backgroundColor: "transparent" }}
        onClick={this.toggleCollapse("navbarCollapse")}
      />
    );

    return (
      <div className="wrapper">
        <Navbar dark expand="md" fixed="top" text="primary">
          <Container>
            <NavbarBrand>
              <div className="Logo">
              <img src='/Dashboard.image/ Tp(2).png' className="img-fluid" alt="" />
              </div>
              <div className="mr-auto text-primary display-5 font-italic font-weight-bolder	text-monospace col-sm-3 ">
                TeachersPlatform </div>
            </NavbarBrand>
            <NavbarToggler
              onClick={this.toggleCollapse("navbarCollapse")}
            />
            <Collapse
              id="navbarCollapse"
              isOpen={this.state.collapseID}
              navbar
            >
              <nav className="ml-auto">
                <div className="collapse navbar-collapse" >
                  <ul className="navbar-nav ml-auto text-primary">
                    <li className="nav-item">
                      <Link to={'/courses'} className="nav-link text-primary font-weight-bolder">Courses</Link>
                    </li>
                    <li className="nav-item">
                    <Link to={'/login'} className="nav-link text-primary font-weight-bolder">Login</Link>
                    </li>
                    <li className="nav-item">
                      <Link to={'/dashboard'} className="nav-link text-primary font-weight-bolder">Dashboard</Link>
                    </li>
                    
                  </ul>
                </div>
              </nav> <br />
            </Collapse>
          </Container>
        </Navbar>
        {this.state.collapseID && overlay}
      </div>


    )
  }
}

export default Nav;
