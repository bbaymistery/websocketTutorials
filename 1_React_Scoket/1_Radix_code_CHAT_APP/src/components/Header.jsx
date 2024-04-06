import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem } from "reactstrap";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false); // Using useState for state management
    const toggle = () => setIsOpen(!isOpen); // Toggling the state
    const location = useLocation(); // Using useLocation to access the current
    return (
        <div>
            <Navbar color="light" light expand="md">
                <NavbarBrand tag={Link} to="/" style={{ color: location.pathname === '/' ? "red" : "black" }}>
                    PublicChat
                </NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml" navbar>
                        <NavItem>
                            <Link to="/roomChat" style={{ color: location.pathname === '/roomChat' ? "red" : "black" }}>
                                RoomChat
                            </Link>
                        </NavItem>
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        <NavItem>
                            <Link to="/liveVisitors" style={{ color: location.pathname === '/liveVisitors' ? "red" : "black" }}>
                                LiveVisitors
                            </Link>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
};

export default Header;
