import React from 'react';
import { Link } from 'react-router-dom';
import BootstrapNav from 'react-bootstrap/Navbar';
import { Nav } from 'react-bootstrap';
import './navbar.scss';

function NavBar() {
  return (
    <BootstrapNav expand="sm" bg="light">
      <BootstrapNav.Brand>Aron Winkler</BootstrapNav.Brand>
      <BootstrapNav.Toggle aria-controls="navbar-nav" />
      <BootstrapNav.Collapse id="navbar-nav">
        <Nav className="ml-auto mynav-nav">
          <BootstrapNav.Text>
            <Link to="/">Dashboard</Link>
          </BootstrapNav.Text>
          <BootstrapNav.Text>
            <Link to="/posts">Post</Link>
          </BootstrapNav.Text>
          <BootstrapNav.Text>
            <Link to="/applications">Candidature</Link>
          </BootstrapNav.Text>
          <BootstrapNav.Text>
            <a href="#">GitHub</a>
          </BootstrapNav.Text>
          <BootstrapNav.Text>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                localStorage.removeItem('authToken');
                window.location.reload();
              }}
            >
              Logout
            </a>
          </BootstrapNav.Text>
        </Nav>
      </BootstrapNav.Collapse>
    </BootstrapNav>
  );
}

export default NavBar;
