// Socket.io removed version
"use client";
import React, { useEffect, useState } from "react";
import { socket } from "../../../../socket/socket";
import { useRef } from "react";
import { useRouter } from "next/navigation";

import { Popover } from "@mui/material";
import {
  Typography,
  InputBase,
  IconButton,
  Box,
  Grid,
  Button,
  Drawer,
  Badge,
  Dialog, DialogContent,
  Tooltip,
  Snackbar,
  Alert,
  useMediaQuery,
} from "@mui/material";
import NotificationPopover from "../../users/components/Header/NotificationPopover";

import {
  Search as SearchIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";

import { navbarItems } from "./navbarItems";

import Calender from "../../doctor/components/Header/Calender"

const Navbar = ({
  title = "Dashboard",
  onMenuClick,
  sidebarOpen = true,
  drawerWidth = 240,
  onSearch,
}) => {
  const [mobileRightOpen, setMobileRightOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [storedUser, setStoredUser] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const alertAudioRef = useRef(null);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const soundIntervalRef = useRef(null);
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCalendar, setOpenCalendar] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:601px) and (max-width:900px)");

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setStoredUser(user);
      }
    }
  }, []);


  useEffect(() => {
    const unlockAudio = () => {
      if (alertAudioRef.current) {
        alertAudioRef.current.play().then(() => {
          alertAudioRef.current.pause();
          alertAudioRef.current.currentTime = 0;
        }).catch(() => { });
      }

      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
    };

    document.addEventListener("click", unlockAudio);
    document.addEventListener("touchstart", unlockAudio);

    return () => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 SOCKET CONNECTED:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.log("🔴 SOCKET CONNECTION ERROR:", error.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("🟠 SOCKET DISCONNECTED:", reason);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {

    const userData = localStorage.getItem("user");
    if (!userData) return;

    const user = JSON.parse(userData);

    if (!socket.connected) socket.connect();

    socket.emit("register_user", user.id);

    const onEmergency = (data) => {
      const btn =
        document.getElementById("emergency-btn") ||
        document.getElementById("emergency-btn-mobile");

      if (!btn) return;

      // 🔁 Blink button
      let blink = true;
      const interval = setInterval(() => {
        btn.style.backgroundColor = blink ? "yellow" : "red";
        blink = !blink;
      }, 500);

      setTimeout(() => {
        clearInterval(interval);
        btn.style.backgroundColor = "red";
      }, 5000);

      // 🪟 Open center popup
      setEmergencyOpen(true);

      // 🔊 Play sound continuously till popup is closed
      if (alertAudioRef.current) {
        alertAudioRef.current.loop = true;
        alertAudioRef.current.currentTime = 0;
        alertAudioRef.current.play().catch((e) => {
          console.log("Autoplay blocked:", e);
        });
      }
    };


    socket.off("emergency_alert");
    socket.on("receiveEmergency", onEmergency);

    return () => socket.off("receiveEmergency", onEmergency);
  }, []);

  useEffect(() => {
    if (!isMobile && mobileRightOpen) {
      setMobileRightOpen(false);
    }
  }, [isMobile, mobileRightOpen]);

  const roleNavbar = navbarItems[storedUser?.role_id] || [];

  const showMessage = (message, severity = "success") => {
    setSnack({ open: true, message, severity });
  };

  const handleCloseEmergency = () => {
    setEmergencyOpen(false);

    if (alertAudioRef.current) {
      alertAudioRef.current.pause();
      alertAudioRef.current.currentTime = 0;
      alertAudioRef.current.loop = false;
    }
  };


  const handleEmergencyClick = () => {
    const user =
      storedUser ||
      JSON.parse(localStorage.getItem("user"));

    if (!user) {
      console.log("❌ User not found");
      return;
    }


    if (Number(user.role_id) === 1) {
      console.log("❌ Role 1 cannot send");
      return;
    }


    socket.emit("sendEmergency", {
      message: "EMERGENCY ALERT!",
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <>
      <Grid
        container
        sx={{
          backgroundColor: "background.paper",
          minHeight: 60,
          position: "fixed",
          top: 0,
          left: { xs: 0, sm: sidebarOpen ? `${drawerWidth}px` : 0 },
          width: {
            xs: "100%",
            sm: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)`,
          },
          zIndex: 1201,
          alignItems: "center",
          px: { xs: 2, sm: 3, md: 4 },
          borderBottom: 1,
          borderColor: "border.light",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <Box sx={{ display: (isMobile || isTablet) ? "flex" : "none", mr: 2 }}>
          <Button
            onClick={onMenuClick}
            variant="contained"
            sx={{
              width: 40,
              height: 40,
              backgroundColor: "background.primary",
            }}
          >
            <MenuIcon sx={{ color: "background.paper" }} />
          </Button>
        </Box>

        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            position: { xs: "absolute", sm: "static" },
            left: { xs: "50%", sm: "auto" },
            transform: { xs: "translateX(-50%)", sm: "none" },
            color: "text.third",
          }}
        >
          {title}
        </Typography>

        <Box sx={{ display: isMobile ? "flex" : "none", marginLeft: "auto" }}>
          <Button
            onClick={() => setMobileRightOpen(true)}
            variant="contained"
            sx={{
              width: 40,
              height: 40,
              backgroundColor: "background.primary",
            }}
          >
            <MenuIcon sx={{ color: "background.paper" }} />
          </Button>
        </Box>

        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            gap: 2,
            marginLeft: "auto",
          }}
        >
          <Tooltip title="Emergency Assistance">
            <Button
              id="emergency-btn"
              variant="contained"
              onClick={handleEmergencyClick}
              sx={{ backgroundColor: "red" }}
            >
              Emergency
            </Button>
          </Tooltip>


          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* 🔔 Notification */}
            <NotificationPopover />

            {/* Existing Navbar Icons */}
            {roleNavbar.map((item, index) => (
              <Tooltip key={index} title={item.label}>
                <IconButton
                  onClick={(event) => {
                    if (item.label === "Calendar") {
                      setAnchorEl(event.currentTarget);
                    } 
                     else {
                      item.onClick?.();
                    }
                  }}
                >
                  <Badge
                    badgeContent={item.badge}
                    color="error"
                  >
                    <item.icon />
                  </Badge>
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Box>
      </Grid>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        sx={{
          marginTop: "45px",
          marginBottom: "10px",

        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Calender />
      </Popover>
      <Drawer
        anchor="right"
        open={mobileRightOpen}
        onClose={() => setMobileRightOpen(false)}
        PaperProps={{
          sx: {
            top: "60px",
            height: "calc(100% - 60px)",
          },
        }}
      >
        <Box sx={{ p: 2, width: "250px" }}>
          {/* 🔍 Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              height: 42,
              borderRadius: 1,
              backgroundColor: "background.third",
              borderColor: "border.third",
              border: 1,
              mb: 2,
            }}
          >
            <SearchIcon sx={{ color: "text.fourth", mr: 1 }} />
            <InputBase
              placeholder="Search..."
              fullWidth
              value={searchQuery}
              onChange={handleSearch}
            />
          </Box>

          {/* 📌 Icons with Name (Column) */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {roleNavbar.map((item, index) => (
              <Button
                key={index}
                onClick={() => {
                  if (item.label === "Schedule") {
                    router.push("/doctor/components/Header/Calender");
                  } else {
                    item.onClick?.();
                  }
                }}
                startIcon={
                  <Badge badgeContent={item.badge} color="error">
                    <item.icon />
                  </Badge>
                }
                sx={{
                  justifyContent: "flex-start",
                  color: "background.primary",
                  textTransform: "none",
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* 🚨 Emergency Button */}
          <Button
            id="emergency-btn-mobile"
            variant="contained"
            onClick={handleEmergencyClick}
            sx={{ backgroundColor: "red" }}
          >
            Emergency
          </Button>
        </Box>
      </Drawer>

      <audio ref={alertAudioRef} src="/sound/alert.mp3" preload="auto" />
     
      <Dialog
        open={emergencyOpen}
        onClose={handleCloseEmergency}
        fullScreen
        PaperProps={{
          sx: {
            backgroundColor: "rgba(0,0,0,0.5)", // dark overlay
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              p: 3,
              borderRadius: 2,
              width: { xs: "90%", sm: 400 },
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
          >
            <Typography variant="h6" fontWeight={700} color="error">
              🚨 Emergency Alert
            </Typography>

            <Typography sx={{ my: 2 }}>
              An emergency has been triggered.
              Please take action immediately.
            </Typography>

            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={handleCloseEmergency}
            >
              Close Alert
            </Button>
          </Box>
        </DialogContent>
      </Dialog>


      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;
