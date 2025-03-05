import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { useLocation } from "@remix-run/react";
import { useNavigate } from "@remix-run/react";

import { AcmeIcon } from "../../app/routes/AcmeIcon";
import { useAuthStore } from "~/stores/authStore";

export default function NavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = useAuthStore((state) => state.userData);
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    useAuthStore.setState({
      userData: null,
      isAuthenticated: false,
      accessToken: null,
    });
    navigate("/login");
  };

  return (
    <>
      <Navbar
        classNames={{
          base: "lg:bg-transparent lg:backdrop-filter-none sticky top-0 z-50",
          item: "data-[active=true]:text-primary",
          wrapper: "px-4 sm:px-6",
        }}
        height="60px"
      >
        <NavbarBrand>
          <NavbarMenuToggle className="mr-2 h-6 sm:hidden" />
          <AcmeIcon />
          <p className="font-bold text-inherit">MagicCuts</p>
        </NavbarBrand>
        <NavbarContent
          className="ml-4 hidden h-12 w-full max-w-fit gap-4 rounded-full bg-content2 px-4 dark:bg-content1 sm:flex"
          justify="start"
        >
          <NavbarItem isActive={pathname === "/dashboard"}>
            <Link className="flex gap-2 text-inherit" href="/dashboard">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem isActive={pathname === "/dashboard/pricing"}>
            <Link
              aria-current="page"
              className="flex gap-2 text-inherit"
              href="/pricing"
            >
              Pricing
            </Link>
          </NavbarItem>
          <NavbarItem isActive={pathname === "/dashboard/settings"}>
            <Link
              className="flex gap-2 text-inherit"
              href="/dashboard/settings"
            >
              Settings
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent
          className="ml-auto flex h-12 max-w-fit items-center gap-0 rounded-full p-0 lg:bg-content2 lg:px-1 lg:dark:bg-content1"
          justify="end"
        >
          <NavbarItem className="px-2">
            <Dropdown placement="bottom-end">
              <DropdownTrigger className="flex items-center justify-center">
                <button className="h-10 w-10 outline-none transition-transform">
                  <Avatar size="md" src={userData?.avatar} />
                </button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{userData?.email}</p>
                </DropdownItem>
                <DropdownItem key="tokens" className="h-8 gap-2">
                  <div className="flex items-center justify-between w-full">
                    <p className="font-semibold">Available Tokens</p>
                    <p className="font-bold">{userData?.tokens || 0}</p>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  onPress={() => {
                    navigate("/dashboard/settings");
                  }}
                >
                  My Settings
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onPress={handleLogout}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>

        {/* Mobile Menu */}
        <NavbarMenu>
          <NavbarMenuItem>
            <Link className="w-full" color="foreground" href="#">
              Dashboard
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link className="w-full" color="foreground" href="#">
              Settings
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
      {children}
    </>
  );
}
