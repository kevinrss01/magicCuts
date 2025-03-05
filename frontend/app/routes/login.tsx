import { AuthAPI } from "~/utils/services/api/AuthApi";
import { useEffect } from "react";
import { useAuthStore } from "~/stores/authStore";
import { toastMsg } from "~/utils/toasts";
import { useNavigate } from "@remix-run/react";
import { Button, User } from "@heroui/react";
import { Icon } from "@iconify/react";

import { AcmeIcon } from "./AcmeIcon";

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
      localStorage.setItem("accessToken", response.accessToken);
      setAuthenticated(true);
      setAccessToken(response.accessToken);
      setUserData(response.userInfo.userRelativeData);
      navigate("/dashboard");
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
    <div className="relative flex h-screen w-full">
      {/* Brand Logo */}
      <div className="absolute left-2 top-5 lg:left-5">
        <div className="flex items-center">
          <AcmeIcon size={40} />
          <p className="font-medium">MagicCuts</p>
        </div>
      </div>

      {/* Sign Up Form */}
      <div className="flex w-full items-center justify-center bg-background lg:w-1/2">
        <div className="flex w-full max-w-sm flex-col items-center gap-4 p-4">
          <div className="w-full text-left">
            <p className="pb-2 text-xl font-medium">Welcome to MagicCuts</p>
            <p className="text-small text-default-500">
              Sign up or login to your account
            </p>
          </div>

          <div className="flex w-full flex-col gap-2">
            <Button
              startContent={<Icon icon="flat-color-icons:google" width={24} />}
              variant="bordered"
              onPress={handleLogin}
            >
              Continue with Google
            </Button>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div
        className="relative hidden w-1/2 flex-col-reverse rounded-medium p-10 shadow-small lg:flex"
        style={{
          backgroundImage:
            "url(https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/white-building.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col items-end gap-4">
          <User
            avatarProps={{
              src: "https://jivjihstaezjjxegorsd.supabase.co/storage/v1/object/public/images//image.jpg",
            }}
            classNames={{
              base: "flex flex-row-reverse",
              name: "w-full text-right text-black",
              description: "text-black/80",
            }}
            description="Founder & CEO of SpaceY"
            name="Elon Muscle"
          />
          <p className="w-full text-right text-2xl text-black/60">
            <span className="font-medium">“</span>
            <span className="font-normal italic">
              MagicCuts is the best software to create viral short videos from
              longs videos.
            </span>
            <span className="font-medium">”</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default login;
