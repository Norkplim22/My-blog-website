import { NavLink } from "react-router-dom";
import "./DashboardNavigation.css";

function DashboardNavigation() {
  return (
    <nav className="navigation">
      <h1>Personal Growth</h1>
      <ul>
        <li>
          <NavLink to="/dashboard" end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="create-blog-post">Create Blog Post</NavLink>
        </li>
        {/* <li>
          <NavLink to="/stay-motivated">Stay Motivated</NavLink>
        </li>
        <li>
          <NavLink to="/lifestyle-and-health">LifeStyle & Health</NavLink>
        </li>
        <li>
          <NavLink to="/about-us">About Us</NavLink>
        </li> */}
      </ul>
    </nav>
  );
}

export default DashboardNavigation;
