import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import Logout from './Logout';

const Navbar1 = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>
          <Link to={"/inicio"}>
          ReserFlex
          </Link>
          </Navbar.Brand>
        <Nav className="me-auto">
          <Link to="/ultima-reserva" className="nav-link">Última Reserva</Link>
        </Nav>
        <Logout />
      </Container>
    </Navbar>
  );
}

export default Navbar1;
