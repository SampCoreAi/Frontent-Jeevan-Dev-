"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Drawer,
  Grid,
  Avatar,
  Typography,
  Button,
  IconButton,
  Box,
  useMediaQuery,
  Divider,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import { Close, Share } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { useRouter, usePathname } from "next/navigation";
import { menuItems } from "./menuItems";

const OutlineFancyButton = styled(Button)(({ theme }) => ({
  border: "none",
  width: "100%",
  padding: 10,
  borderRadius: "5px",
  fontWeight: "bold",
  letterSpacing: "2px",
  textTransform: "uppercase",
  cursor: "pointer",
  color: theme.palette.text.primary,
  transition: "all 1000ms",
  fontSize: { xs: "13px", sm: "14px", md: "15px" },
  position: "relative",
  overflow: "hidden",
  justifyContent: "flex-start",
  minHeight: { xs: "50px", sm: "56px", md: "60px" },
  "&:hover": {
    transform: "scale(1.02)",
    outline: `3px solid ${theme.palette.border.third}`,
  },
  "&::before": {
    content: '""',
    position: "absolute",
    left: "-50px",
    top: 0,
    width: 0,
    height: "100%",
    backgroundColor: theme.palette.background.third,
    transform: "skewX(45deg)",
    zIndex: -1,
    transition: "width 1000ms",
  },

  "&:hover::before": {
    width: "250%",
  },
}));

const Sidebar = ({
  isOpen,
  isMobileOpen,
  onClose,
  activeButton,
  setActiveButton,
  drawerWidth,
}) => {
  const [roleId, setRoleId] = useState(0);
  const [profileImage, setProfileImage] = useState("");
  const [userName, setUserName] = useState("Dr. User");
  const [qualification, setQualification] = useState(
    "MBBL, FCPS I MD (Medicine), MCPS"
  );
  const [specialization, setSpecialization] = useState("");
  const theme = useTheme();

  const isMobile = useMediaQuery("(max-width:900px)");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");

      if (userData) {
        const user = JSON.parse(userData);

        setRoleId(user.role_id || 0);
        setUserName(user.full_name || "Not Provided");
        setQualification(user.qualification || "Not Provided");
        setSpecialization(user.specialization || "Not Provided");
        setProfileImage(user.image || "");
      } else {
        setUserName("Not Provided");
        setQualification("Not Provided");
        setSpecialization("Not Provided");
      }
    }
  }, []);
  const S3_BUCKET_URL =
    process.env.NEXT_PUBLIC_S3_BUCKET_URL;

  const avatarSrc = profileImage
    ? `${S3_BUCKET_URL}/${profileImage}`
    : roleId === 1
      ? "/img/IconPatient.png"
      : "/img/IconDoctor.png";
  const currentMenuItems = menuItems[roleId] || [];


useEffect(() => {
  // Prescription / Report Patient pages
  if (
    pathname.includes("/doctor/pages/prescription") ||
    pathname.includes("/doctor/pages/reportPatient")
  ) {
    setActiveButton("Patient");
    return;
  }

  // Appointment page should keep Doctor selected
  if (pathname.startsWith("/users/pages/Appointment")) {
    setActiveButton("Doctor");
    return;
  }

  // Normal menu routes
  const currentItem = currentMenuItems.find(
    (item) =>
      pathname === item.route ||
      pathname.startsWith(`${item.route}/`)
  );

  if (currentItem) {
    setActiveButton(currentItem.label);
  }
}, [pathname, currentMenuItems, setActiveButton]);



  const handleNavigation = (item) => {
    setActiveButton(item.label);
    if (isMobile) onClose();
  };

  const sidebarContent = (
    <Grid
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        top: { xs: "60px", md: 0 },
        alignItems: "center",
        paddingY: { xs: 2, sm: 3 },
        position: "relative",
      }}
    >
      {/* Profile */}
      <Grid
        sx={{
          width: { xs: "85%", sm: 200 },
          backgroundColor: "background.third",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 1,
          padding: { xs: 1.5, sm: 2 },
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          marginBottom: { xs: 2, sm: 3 },
          flexShrink: 0,
        }}
      >
        <Avatar
          sx={{ width: 80, height: 80, mb: 1.5 }}
          src={avatarSrc}
        />
        <Typography
          sx={{
            fontSize: 17,
            fontWeight: 700,
            marginBottom: 1,
            color: "text.third",
            textAlign: "center",
          }}
        >
          {userName}
        </Typography>


        <Button
          startIcon={<Share sx={{ width: 16, height: 16 }} />}
          sx={{
            color: "text.secondary",
            backgroundColor: "hover.primary",
            borderRadius: 1,
            px: 3,
            py: 1.5,
            fontSize: 12,
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "background.primary",
              transform: "translateY(-1px)",
            },
          }}
        >
          Share Profile
        </Button>
      </Grid>

      {/* Menu */}
      <Grid
        sx={{
          width: "100%",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 0.5, sm: 1 },
          paddingX: { xs: 2, sm: 3, md: 4 },
          paddingY: 1,
          overflowY: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {currentMenuItems.map((item, index) => (
          <Tooltip
            key={index}
            title={!isOpen && !isMobile ? item.label : ""}
            placement="right"
            arrow
          >
            <Link
              href={item.route}
              style={{ width: "100%", textDecoration: "none" }}
              passHref
            >
              <OutlineFancyButton
                onClick={() => handleNavigation(item)}
                startIcon={item.icon}
                sx={{
                  backgroundColor:
                    activeButton === item.label
                      ? "background.third"
                      : "transparent",
                  outline: activeButton === item.label ? "2px solid" : "none",
                  outlineColor:
                    activeButton === item.label
                      ? "border.third"
                      : "transparent",
                  width: "100%",
                  justifyContent: "flex-start",
                }}
              >
                {(isOpen || isMobile) && <span>{item.label}</span>}
              </OutlineFancyButton>
            </Link>
          </Tooltip>
        ))}

        <Divider sx={{ width: "80%", my: 2, borderColor: "border.light" }} />
        <Typography
          sx={{
            fontSize: 12,
            color: "text.fourth",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          © 2025 Jeevan Dev. <br /> All rights reserved.
        </Typography>
      </Grid>
    </Grid>
  );

  return isMobile ? (
    <Drawer
      anchor="left"
      open={isMobileOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
      }}
    >
      {sidebarContent}
    </Drawer>
  ) : (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          overflowX: "hidden",
          boxSizing: "border-box",
          top: 0,
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;
