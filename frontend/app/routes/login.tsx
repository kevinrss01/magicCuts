import { Button } from "@heroui/button";
import { AuthAPI } from "~/utils/services/api/AuthApi";
import { useEffect } from "react";
import { useAuthStore } from "~/stores/authStore";
import { toastMsg } from "~/utils/toasts";
import { useNavigate } from "@remix-run/react";

const login = () => {
  const { setAuthenticated, setAccessToken, setUserData } = useAuthStore();
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const response = await AuthAPI.getAuth();
      window.location.href = response.url;
    } catch (error) {
      toastMsg.error("Erreur lors de la connexion");
      console.error(error);
    }
  };

  const handleAccessToken = async (accessToken: string) => {
    try {
      const response = await AuthAPI.callback(accessToken);
      console.log("response", response);
      localStorage.setItem("accessToken", response.accessToken);
      setAuthenticated(true);
      setAccessToken(response.accessToken);
      setUserData(response.userInfo);
      navigate("/app");
    } catch (error) {
      toastMsg.error("Erreur lors de la connexion");
      console.error(error);
    }
  };

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");

      if (accessToken) {
        handleAccessToken(accessToken);
      }
    }
  }, []);

  return (
    <div>
      <Button onPress={handleLogin}>Login</Button>
    </div>
  );
};

export default login;
