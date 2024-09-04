import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function SideBar() {
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <NavLink to="/dashboard" end>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="create-blog-post">Create Post</NavLink>
        </li>
        <li>
          <NavLink to="password">Change password</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default SideBar;
