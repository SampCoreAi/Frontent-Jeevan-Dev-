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
import EmergencyOutlinedIcon from "@mui/icons-material/EmergencyOutlined";
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  MedicalServicesOutlined as MedicalServicesOutlinedIcon,
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
          backgroundColor: "#ffffff",

          minHeight: 68,

          position: "fixed",
          top: 0,

          left: {
            xs: 0,
            sm: sidebarOpen ? `${drawerWidth}px` : 0,
          },

          width: {
            xs: "100%",
            sm: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)`,
          },

          zIndex: 1201,

          alignItems: "center",

          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },

          borderBottom: "1px solid #e6ecea",

          boxShadow:
            "0 2px 10px rgba(15, 23, 42, 0.04)",
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0, sm: 1.3 },
            position: { xs: "absolute", sm: "static" },
            left: { xs: "50%", sm: "auto" },
            transform: { xs: "translateX(-50%)", sm: "none" },
          }}
        >
          {/* Doctor Icon */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px",
              backgroundColor: "#ecf9f5",
              border: "1px solid #d5eee7",
              color: "#0a9f7d",
              flexShrink: 0,
            }}
          >
            <MedicalServicesOutlinedIcon sx={{ fontSize: 21 }} />
          </Box>

          {/* Title + Description */}
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "18px", sm: "19px" },
                fontWeight: 700,
                lineHeight: 1.2,
                color: "#155f51",
                letterSpacing: "-0.3px",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                display: { xs: "none", sm: "block" },
                mt: "2px",
                fontSize: "11px",
                fontWeight: 400,
                lineHeight: 1.2,
                color: "#84928e",
                whiteSpace: "nowrap",
              }}
            >
              {title === "Doctor"
                ? "Find doctors & book appointments"
                : "Manage your healthcare dashboard"}
            </Typography>
          </Box>
        </Box>

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
            gap: 1,
            marginLeft: "auto",
          }}
        >
          {/* ================= EMERGENCY ================= */}
          <Tooltip title="Emergency Assistance">
            <Button
              id="emergency-btn"
              variant="contained"
              onClick={handleEmergencyClick}
              startIcon={
                <EmergencyOutlinedIcon
                  sx={{
                    fontSize: "18px !important",
                  }}
                />
              }
              sx={{
                height: 40,
                px: 1.8,

                borderRadius: "8px",

                backgroundColor: "#ef233c",
                color: "#ffffff",

                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",

                boxShadow: "0 3px 8px rgba(239,35,60,0.16)",

                "& .MuiButton-startIcon": {
                  marginRight: "6px",
                  marginLeft: 0,
                },

                "&:hover": {
                  backgroundColor: "#d91e36",
                  boxShadow: "0 5px 12px rgba(239,35,60,0.20)",
                },
              }}
            >
              Emergency
            </Button>
          </Tooltip>

          {/* Divider */}

          <Box
            sx={{
              width: "1px",
              height: 28,
              backgroundColor: "#e3e9e7",
              mx: 0.5,
            }}
          />

          {/* ================= NOTIFICATION ================= */}

            {/* Tumhara existing notification component */}
            <NotificationPopover />

          

          <Box
            sx={{
              width: "1px",
              height: 28,
              backgroundColor: "#e3e9e7",
              mx: 0.5,
            }}
          />
          {/* ================= CALENDAR / NAVBAR ITEMS ================= */}

          {roleNavbar.map((item, index) => (
            <Tooltip key={index} title={item.label}>
              <Button
                onClick={(event) => {
                  // SAME OLD LOGIC
                  if (item.label === "Calendar") {
                    setAnchorEl(event.currentTarget);
                  } else {
                    item.onClick?.();
                  }
                }}
                sx={{
                  minWidth: "auto",
                  height: 40,

                  px: 1.4,

                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
 backgroundColor: "#f0faf7",
                    borderColor: "#d5eee7",

                  borderRadius: "8px",
                  border: "1px solid transparent",

                  color: "#586762",

                  textTransform: "none",

                  transition: "all 0.2s ease",

                  "&:hover": {
                    backgroundColor: "#f0faf7",
                    borderColor: "#d5eee7",
                    color: "#0a9f7d",
                  },
                }}
              >
                <Badge
                  badgeContent={item.badge}
                  color="error"
                >
                  <item.icon sx={{ fontSize: 20 }} />
                </Badge>

                {/* Calendar name */}
                <Typography
                  component="span"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "inherit",
                  }}
                >
                  {item.label}
                </Typography>
              </Button>
            </Tooltip>
          ))}
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
          <NotificationPopover />

          {/* Calendar */}
          {roleNavbar.map((item, index) => (
            <Button
              key={index}
              fullWidth
              onClick={(event) => {
                if (item.label === "Calendar") {
                  setAnchorEl(event.currentTarget);
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
                minHeight: 52,
                justifyContent: "flex-start",
                px: 1.5,
                mb: 1.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                color: "background.primary",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {item.label}
            </Button>
          ))}

          {/* Emergency */}
          <Button
            id="emergency-btn-mobile"
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleEmergencyClick}
            sx={{
              minHeight: 52,
              justifyContent: "flex-start",
              px: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            🚨 &nbsp; Emergency
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
