import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/image 16.png";
import { RxHamburgerMenu } from "react-icons/rx";
import { VscChromeClose } from "react-icons/vsc";
import "./Navigation.css";
import { useState } from "react";

function Navigation() {
  const navigate = useNavigate();
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <>
      <nav className="navigation">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo} alt="logo" />
          <h1>Grow</h1>
        </div>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/study-abroad">Study Abroad</NavLink>
          </li>
          <li>
            <NavLink to="/stay-motivated">Stay Motivated</NavLink>
          </li>
          <li>
            <NavLink to="/lifestyle-and-health">LifeStyle & Health</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
        </ul>
        {showMobileNav ? (
          <VscChromeClose size="2.4rem" className="hamburger" onClick={() => setShowMobileNav(!showMobileNav)} />
        ) : (
          <RxHamburgerMenu size="2.4rem" className="hamburger" onClick={() => setShowMobileNav(!showMobileNav)} />
        )}
      </nav>
      {/* {showMobileNav && ( */}
      <nav className={`mobile-nav ${showMobileNav ? "show" : ""}`}>
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo} alt="logo" />
          <h1>Grow</h1>
        </div>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/study-abroad">Study Abroad</NavLink>
          </li>
          <li>
            <NavLink to="/stay-motivated">Stay Motivated</NavLink>
          </li>
          <li>
            <NavLink to="/lifestyle-and-health">LifeStyle & Health</NavLink>
          </li>
          <li>
            <NavLink to="/about-us">About Us</NavLink>
          </li>
        </ul>
      </nav>
      {/* )} */}
    </>
  );
}

export default Navigation;
