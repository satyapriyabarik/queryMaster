
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Sun, Moon } from "lucide-react";

const Header: React.FC = () => {
  /* =======================
     Theme state
     ======================= */
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  /* =======================
     Apply theme to body
     ======================= */
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Navbar
      expand="lg"
      className="app-navbar shadow-sm"
      sticky="top"
    >
      <Container fluid="lg">
        {/* Brand */}
        <Navbar.Brand
          as={NavLink}
          to="/home"
          className="fw-semibold app-brand"
        >
          Inventory Management
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle aria-controls="app-navbar-nav" />

        <Navbar.Collapse id="app-navbar-nav">
          {/* Left Nav */}
          <Nav className="me-auto gap-lg-2">
            <Nav.Link
              as={NavLink}
              to="/home"
              className="nav-link-custom"
            >
              Home
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/add-products"
              className="nav-link-custom"
            >
              Add Products
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/query-builder"
              className="nav-link-custom"
            >
              Query Builder
            </Nav.Link>
          </Nav>

          {/* Right Actions */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            <Button
              variant="outline-secondary"
              size="sm"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon size={16} />
              ) : (
                <Sun size={16} />
              )}
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
