import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import logo from '../images/logo.svg';
import logo_name from '../images/logo_name.png';

let HomePage = (props) => (
  <Container>
    <Row>
      <h1>Website Demo App</h1>
    </Row>
    <Row>
      <Col>
        <img alt="" src={logo} className="app-logo" />
      </Col>
      <Col>
        <img alt="" src={logo_name} className="name-logo" />
      </Col>
    </Row>
    <Row>
      <Col>
        <p>
          This small <a href="https://reactjs.org/">React {React.version}</a>{" "}
          app that is an inprogress version of a portfolio website.
        </p>
      </Col>
    </Row>
    <Row>
      <Col>
        Click <Link to={`/protected`}>here</Link> to navigate to a protected
        section of the app.
      </Col>
    </Row>
  </Container>
);

export default HomePage