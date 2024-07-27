import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import Navigation from "../Navigation/Navigation";
import "./Layout.css";

function Layout() {
  return (
    <div className="layout-container">
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
