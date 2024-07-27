import { Outlet } from "react-router-dom";
import DashboardNavigation from "../DashboardNavigation/DashboardNavigation";

function DashBoardLayout() {
  return (
    <div>
      <DashboardNavigation />
      <Outlet />
    </div>
  );
}

export default DashBoardLayout;
