import React from "react";

const DashboardSettings = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Not Available Yet</h2>
          <p className="text-gray-600">
            The settings page is currently under development. Please check back
            later for updates.
          </p>
        </div>
        <p className="text-sm text-gray-500">
          We're working hard to bring you more features. Thank you for your
          patience!
        </p>
      </div>
    </div>
  );
};

export default DashboardSettings;
