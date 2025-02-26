import React from "react";
import { Outlet } from "@remix-run/react";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Outlet />
    </div>
  );
};

export default Dashboard;
