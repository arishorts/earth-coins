import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Modal, Tab } from "react-bootstrap";
import SignUpForm from "./SignupForm";
import LoginForm from "./LoginForm";

import Auth from "../utils/auth";

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <nav className="bg-sky-950 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="text-xl font-bold">
              Home
            </Link>

            <div className="lg:items-center" id="navbar">
              <ul className="flex items-center justify-end flex-wrap">
                {/* if user is logged in show saved coins and logout */}
                {Auth.loggedIn() && (
                  <>
                    <li className="mr-6 ml-6">
                      <Link to="/saved" className="nav-link">
                        See Your Coins
                      </Link>
                    </li>
                    <li onClick={Auth.logout} className="cursor-pointer">
                      <span className="nav-link">Logout</span>
                    </li>
                  </>
                )}
                {!Auth.loggedIn() && (
                  <li
                    onClick={() => setShowModal(true)}
                    className="cursor-pointer mr-6"
                  >
                    <span className="nav-link">Login/Sign Up</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
      {/* set modal data up */}
      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"
      >
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey="login">
          <Modal.Header closeButton>
            <Modal.Title id="signup-modal">
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="signup">Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;
