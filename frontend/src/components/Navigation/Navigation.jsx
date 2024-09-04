import { NavLink } from "react-router-dom";
import logo from "../../assets/image 16.png";
import "./Navigation.css";

function Navigation() {
  return (
    <nav className="navigation">
      <div className="logo">
        <img src={logo} alt="logo" />
        <h1>Personal Growth</h1>
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
  );
}

export default Navigation;
