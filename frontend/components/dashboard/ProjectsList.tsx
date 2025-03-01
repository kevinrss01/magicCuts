"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, Spinner } from "@heroui/react";
import { useNavigate } from "@remix-run/react";
import { ProjectDocument } from "../../utils/types/supabase";
import { useAuthStore } from "../../app/stores/authStore";

export const ProjectsList: React.FC = () => {
  const userProjects = useAuthStore((state) => state.userProjects);
  const navigate = useNavigate();

  const projects = userProjects || [];

  // Render project status icon based on state
  const renderStatusIcon = (state: "pending" | "completed" | "failed") => {
    switch (state) {
      case "pending":
        return <Spinner size="sm" color="warning" />;
      case "completed":
        return (
          <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "failed":
        return (
          <div className="w-5 h-5 rounded-full bg-danger flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full mt-8">
      <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
      {projects.length === 0 ? (
        <Card className="w-full">
          <CardBody className="py-8 text-center text-gray-500">
            No projects found. Upload a video to get started.
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="w-full cursor-pointer hover:shadow-md transition-shadow"
              isPressable
              onPress={() => navigate(`/dashboard/${project.id}`)}
            >
              <CardBody className="flex flex-row items-center justify-between p-4">
                <div className="flex flex-col">
                  <h3 className="font-medium">
                    {project.name || "Untitled Project"}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 capitalize">
                    {project.state}
                  </span>
                  {renderStatusIcon(project.state)}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
