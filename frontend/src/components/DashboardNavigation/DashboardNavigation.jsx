import { NavLink } from "react-router-dom";
import "./DashboardNavigation.css";
import logo from "../../assets/image 16.png";

function DashboardNavigation() {
  return (
    <nav className="dashboard-navigation">
      <div className="logo">
        <img src={logo} alt="logo" />
        <h1>Personal Growth</h1>
      </div>
      <ul>
        <li>
          <NavLink to="/dashboard" end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="create-blog-post">Create Blog Post</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default DashboardNavigation;
