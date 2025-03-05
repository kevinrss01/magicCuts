import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "@remix-run/react";
import { AuthAPI } from "../../utils/services/api/AuthApi";
import { useAuthStore } from "../stores/authStore";
import AxiosCallApi from "~/utils/services/axios";
import { toastMsg } from "~/utils/toasts";
import { Spinner } from "@heroui/react";

// Define a simple context type; you can extend it if needed
interface AuthContextProps {
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Use type annotation for useState<boolean>
  const [loading, setLoading] = useState<boolean>(true);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUserData = useAuthStore((state) => state.setUserData);
  const setUserProjects = useAuthStore((state) => state.setUserProjects);
  const userData = useAuthStore((state) => state.userData);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // On page load, check for accessToken and a stored userId
    const token = localStorage.getItem("accessToken");

    if (userData?.id) {
      if (location.pathname === "/login" || location.pathname === "/") {
        navigate("/dashboard");
      }
      return;
    }

    if (token) {
      AuthAPI.signIn(token)
        .then((response) => {
          setAuthenticated(true);
          setAccessToken(response.accessToken);
          setLoading(false);
          localStorage.setItem("accessToken", response.accessToken);
          AxiosCallApi.saveToken(response.accessToken);

          setUserData(response.userData.userRelativeData);
          setUserProjects(response.userData.userDocuments);
        })
        .catch((error) => {
          console.error(error);
          toastMsg.error(
            "Erreur lors de la connexion, veuillez réessayer ou contacter l'assistance",
          );
          // If the signIn call fails, clear storage and redirect to /login.
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userId");
          setAuthenticated(false);
          setLoading(false);
          if (location.pathname !== "/login") {
            navigate("/login");
          }
        })
        .finally(() => {
          if (location.pathname === "/") {
            navigate("/dashboard");
          }
        });
    } else {
      setLoading(false);
      // If no token exists and the user is not on the login page, redirect
      if (location.pathname !== "/login") {
        navigate("/login");
      }
    }
  }, [location.pathname, navigate, setAuthenticated, setAccessToken]);

  return (
    <AuthContext.Provider value={{ loading }}>
      {loading ? (
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth doit être utilisé à l’intérieur d’un AuthProvider",
    );
  }
  return context;
}
