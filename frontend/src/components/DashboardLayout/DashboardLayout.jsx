import { Outlet } from "react-router-dom";
import DashboardNavigation from "../DashboardNavigation/DashboardNavigation";
import SideBar from "../SideBar/SideBar";
import "./DashboardLayout.css";

function DashBoardLayout() {
  return (
    <div className="dashboard-layout-container">
      <DashboardNavigation />
      <div className="outlet-container">
        <SideBar />
        <Outlet />
      </div>
    </div>
  );
}

export default DashBoardLayout;
