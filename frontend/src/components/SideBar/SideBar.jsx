import { Navigate, NavLink } from "react-router-dom";
import "./Sidebar.css";
import { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import Login from "../../pages/Login/Login";
import toast from "react-hot-toast";

function SideBar() {
  const { setAdmin } = useContext(DataContext);

  async function handleLogout() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API}/logout`, { method: "POST", credentials: "include" });

      if (response.ok) {
        const { message } = await response.json();
        toast.success(message);
        setAdmin(null);
        <Navigate to={<Login />} />;
      } else {
        const { error } = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  }

  return (
    <nav className="sidebar">
      <ul>
        <li>
          <NavLink to="/dashboard" end>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="create-blog-post">Create Blog Post</NavLink>
        </li>
        <li>
          <NavLink to="blog-posts">Blog Posts</NavLink>
        </li>
        <li>
          <NavLink to="subscribers">Subscribers</NavLink>
        </li>
        <li>
          <NavLink to="comments">Comments</NavLink>
        </li>
        <li>
          <NavLink to="profile">Profile</NavLink>
        </li>
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default SideBar;
