import { NavLink } from "react-router-dom";
import "./Navigation.css";

function Navigation() {
  return (
    <nav className="navigation">
      <h1>Personal Growth</h1>
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
