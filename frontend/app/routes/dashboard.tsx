import { Outlet, useLocation } from "@remix-run/react";
import FileUploader from "../../components/dashboard/FileUploader";
import ProjectsList from "../../components/dashboard/ProjectsList";

const Dashboard = () => {
  const location = useLocation();
  const isIndexRoute = location.pathname === "/dashboard";

  return (
    <div className="dashboard-container p-6 max-w-4xl mx-auto">
      {isIndexRoute ? (
        <>
          <FileUploader />
          <ProjectsList />
        </>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default Dashboard;
