"use client";

import React, { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import Sidebar from "../(dashboard)/component/layout/sidebar";
import Header from "../(dashboard)/component/layout/header";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import ProtectedRoute from "./component/layout/ProtectedRoute/ProtectedRoute";

export default function DashboardLayout({ children }) {
  const [activeButton, setActiveButton] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [roleId, setRoleId] = useState(null);
  const isMobile = useMediaQuery("(max-width:900px)");

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const drawerWidth = isMobile ? "80%" : 220;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setRoleId(userObj.role_id);
    }
  }, []);

  useEffect(() => {
    if (!isMobile && mobileOpen) {
      setMobileOpen(false);
    }
  }, [isMobile, mobileOpen]);

 return (
  <ProtectedRoute>
    <Provider store={store}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <Sidebar
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          isOpen={sidebarOpen}
          isMobileOpen={mobileOpen}
          onClose={handleDrawerToggle}
          drawerWidth={drawerWidth}
        />

        {/* Main area */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minWidth: 0,     
            minHeight: "100vh",
          }}
        >
          <Header
            title={activeButton}
            onMenuClick={handleDrawerToggle}
            sidebarOpen={sidebarOpen}
            drawerWidth={drawerWidth}
          />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
      minWidth: 0,        // ✅ ADD — yeh sabse important hai
      width: "100%",
      overflowX: "hidden", // ✅ ADD — page-level horizontal scroll block, andar wala scroll table sambhalega
      overflowY: "auto",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Provider>
  </ProtectedRoute>
);
}
