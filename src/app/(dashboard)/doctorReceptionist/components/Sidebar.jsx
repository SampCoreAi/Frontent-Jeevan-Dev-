"use client";
import React, { useState } from "react";
import {
  Grid,
  Button,
  Avatar,
  Typography,
  Divider,
  IconButton,
  Drawer,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  DashboardOutlined,
  AccessTimeFilledOutlined,
  BookOnlineOutlined,
  SettingsOutlined,
  PermIdentityOutlined,
  ThumbUpOffAltOutlined,
  Share,
  Close,
} from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";

const Sidebar = ({ activeButton, setActiveButton, mobileOpen, handleDrawerToggle }) => {
  const sidebarButtons = [
    { icon: <DashboardOutlined />, label: "Dashboard" },
    { icon: <AccessTimeFilledOutlined />, label: "Schedule" },
    { icon: <PersonIcon />, label: "Patient" },
    { icon: <BookOnlineOutlined />, label: "Appointment" },
    { icon: <PermIdentityOutlined />, label: "Profile" },
    { icon: <SettingsOutlined />, label: "Setting" },
    { icon: <ThumbUpOffAltOutlined />, label: "Feedback" },
  ];

  const OutlineFancyButton = styled(Button)(() => ({
    border: "none",
    width: "100%",
    padding: { xs: "16px 12px", sm: "18px 16px", md: "20px 20px" },
    padding:20,
    borderRadius: "5px",
    fontWeight: "bold",
    letterSpacing: "2px",
    textTransform: "uppercase",
    cursor: "pointer",
    color: "#000000ff",
    transition: "all 1000ms",
    fontSize: { xs: "13px", sm: "14px", md: "15px" },
    position: "relative",
    overflow: "hidden",
    justifyContent: "flex-start",
    minHeight: { xs: "50px", sm: "56px", md: "60px" },

    "&:hover": {
      color: "#000000ff",
      transform: "scale(1.02)",
      outline: "3px solid #0d826f",
    },

    "&::before": {
      content: '""',
      position: "absolute",
      left: "-50px",
      top: 0,
      width: 0,
      height: "100%",
      backgroundColor: "#e6f6ed",
      transform: "skewX(45deg)",
      zIndex: -1,
      transition: "width 1000ms",
    },

    "&:hover::before": {
      width: "250%",
    },
  }));

  const sidebarContent = (
    <Grid
      sx={{
        width: { xs: 280, sm: 260 },
        height: "100vh",
        backgroundColor: "#fbfbfb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingY: { xs: 2, sm: 3 },
        boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
      {/* Close Button for Mobile */}
      <IconButton
        onClick={handleDrawerToggle}
        sx={{
          display: { xs: "flex", md: "none" },
          position: "absolute",
          top: 16,
          right: 16,
          color: "#153933",
          backgroundColor: "rgba(255,255,255,0.8)",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,1)",
          },
        }}
      >
        <Close />
      </IconButton>

      {/* Profile Card */}
      <Grid
        sx={{
          width: { xs: "85%", sm: 200 },
          backgroundColor: "#e6f6ed",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 1,
          padding: { xs: 1.5, sm: 2 },
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          marginBottom: { xs: 2, sm: 3 },
          flexShrink: 0,
          marginTop: { xs: 2, md: 0 },
        }}
      >
        <Avatar
          sx={{
            width: { xs: 70, sm: 80, md: 90 },
            height: { xs: 70, sm: 80, md: 90 },
            border: "4px solid #14b8a6",
            marginBottom: { xs: 1, sm: 1.5 },
          }}
          src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
        />
        <Typography
          sx={{
            fontSize: { xs: 16, sm: 17, md: 18 },
            fontWeight: 700,
            color: "#153933",
            textAlign: "center",
            marginBottom: 0.5,
            lineHeight: 1.2,
          }}
        >
          Dr. Martin Doe
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 9, sm: 10 },
            textAlign: "center",
            fontWeight: 600,
            color: "#439f8e",
            marginBottom: { xs: 1.5, sm: 2 },
            lineHeight: 1.3,
          }}
        >
          MBBL, FCPS I MD (Medicine), MCPS
        </Typography>
        <Button
          startIcon={<Share sx={{ width: 16, height: 16 }} />}
          sx={{
            color: "white",
            backgroundColor: "#14b8a6",
            borderRadius: 1,
            paddingX: { xs: 2, sm: 3 },
            paddingY: { xs: 0.6, sm: 0.8 },
            fontSize: { xs: 12, sm: 14 },
            fontWeight: 600,
            minWidth: "auto",
            "&:hover": {
              backgroundColor: "#0f7468",
              transform: "translateY(-1px)",
            },
          }}
        >
          Share Profile
        </Button>
      </Grid>

      {/* Scrollable Buttons Area */}
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
        {sidebarButtons.map((button, index) => (
          <OutlineFancyButton
            key={index}
            fullWidth
            onClick={() => {
              setActiveButton(button.label);
             
              if (window.innerWidth < 900) {
                handleDrawerToggle();
              }
            }}
            startIcon={React.cloneElement(button.icon, {
              style: { 
                width: { xs: 20, sm: 21, md: 22 }, 
                height: { xs: 20, sm: 21, md: 22 } 
              },
            })}
            sx={{
              backgroundColor: activeButton === button.label ? "#e6f6ed" : "transparent",
              outline: activeButton === button.label ? "2px solid #0d826f" : "none",
            }}
          >
            <span>{button.label}</span>
          </OutlineFancyButton>
        ))}

        {/* Footer */}
        <Divider sx={{ width: "80%", marginY: { xs: 2, sm: 3 }, borderColor: "#e0e0e0" }} />
        <Typography
          sx={{
            fontSize: { xs: 11, sm: 12 },
            color: "#666",
            textAlign: "center",
            lineHeight: 1.4,
            marginBottom: { xs: 1, sm: 2 },
            paddingX: 1,
          }}
        >
          © 2025 Jeevan Dev.
          <br />
          All rights reserved.
        </Typography>
      </Grid>
    </Grid>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop Permanent Sidebar */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          position: "sticky",
          top: 0,
          height: "100vh",
          flexShrink: 0,
        }}
      >
        {sidebarContent}
      </Box>
    </>
  );
};

export default Sidebar;