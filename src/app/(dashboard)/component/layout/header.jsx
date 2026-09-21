"use client";
import React, { useEffect, useRef, useState } from "react";
import { socket } from "../../../../socket/socket";
import {
  Alert,
  Badge,
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Popover,
  Snackbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  MedicalServicesOutlined as MedicalServicesOutlinedIcon,
} from "@mui/icons-material";
import EmergencyOutlinedIcon from "@mui/icons-material/EmergencyOutlined";
import { useRouter } from "next/navigation";
import NotificationPopover from "../../users/components/Header/NotificationPopover";
import Calender from "../../doctor/components/Header/Calender";
import { navbarItems } from "./navbarItems";

const Navbar = ({
  title = "Dashboard",
  onMenuClick,
  sidebarOpen = true,
  drawerWidth = 240,
  onSearch,
}) => {
  const [storedUser, setStoredUser] = useState(null);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const alertAudioRef = useRef(null);
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:601px) and (max-width:900px)");

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        setStoredUser(JSON.parse(userData));
      } catch {
        setStoredUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const unlockAudio = () => {
      if (alertAudioRef.current) {
        alertAudioRef.current
          .play()
          .then(() => {
            alertAudioRef.current.pause();
            alertAudioRef.current.currentTime = 0;
          })
          .catch(() => {});
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
    if (typeof window === "undefined") return;

    const userData = localStorage.getItem("user");

    if (!userData) return;

    let user;

    try {
      user = JSON.parse(userData);
    } catch {
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("register_user", user.id);

    const onEmergency = () => {
      const btn = document.getElementById("emergency-btn");

      if (btn) {
        let blink = true;

        const interval = setInterval(() => {
          btn.style.backgroundColor = blink ? "yellow" : "red";
          blink = !blink;
        }, 500);

        setTimeout(() => {
          clearInterval(interval);
          btn.style.backgroundColor = "red";
        }, 5000);
      }

      setEmergencyOpen(true);

      if (alertAudioRef.current) {
        alertAudioRef.current.loop = true;
        alertAudioRef.current.currentTime = 0;

        alertAudioRef.current.play().catch((error) => {
          console.log("Autoplay blocked:", error);
        });
      }
    };

    socket.off("emergency_alert");
    socket.on("receiveEmergency", onEmergency);

    return () => {
      socket.off("receiveEmergency", onEmergency);
    };
  }, []);

  const roleNavbar = navbarItems[storedUser?.role_id] || [];

  const handleCloseEmergency = () => {
    setEmergencyOpen(false);

    if (alertAudioRef.current) {
      alertAudioRef.current.pause();
      alertAudioRef.current.currentTime = 0;
      alertAudioRef.current.loop = false;
    }
  };

  const handleEmergencyClick = () => {
    let user = storedUser;

    if (!user && typeof window !== "undefined") {
      const userData = localStorage.getItem("user");

      if (userData) {
        try {
          user = JSON.parse(userData);
        } catch {
          return;
        }
      }
    }

    if (!user) return;

    if (Number(user.role_id) === 1) return;

    socket.emit("sendEmergency", {
      message: "EMERGENCY ALERT!",
    });
  };

  return (
    <>
      <Grid
        container
        sx={{
          backgroundColor: "background.paper",
          minHeight: { xs: 56, sm: 68 },
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
            xs: "16px",
            sm: 3,
            md: 4,
          },
          borderBottom: "1px solid",
          borderColor: "divider",
          boxShadow: {
            xs: "0 1px 4px rgba(15, 23, 42, 0.04)",
            sm: "0 2px 10px rgba(15, 23, 42, 0.04)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: "12px", sm: "10px" },
          }}
        >
          {(isMobile || isTablet) && (
            <IconButton
              onClick={onMenuClick}
              disableRipple
              sx={{
                width: 36,
                height: 36,
                p: 0,
                color: "primary.main",
                borderRadius: "8px",
                "&:hover": {
                  bgcolor: "secondary.light",
                },
              }}
            >
              <MenuIcon sx={{ fontSize: 24 }} />
            </IconButton>
          )}

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px",
              bgcolor: "#edf7f2",
              color: "black",
              flexShrink: 0,
            }}
          >
            <MedicalServicesOutlinedIcon sx={{ fontSize: 21 }} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: "16px", sm: "19px" },
                fontWeight: 700,
                lineHeight: 1.2,
                color: "black",
                letterSpacing: { xs: "-0.2px", sm: "-0.3px" },
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
                color: "text.secondary",
                whiteSpace: "nowrap",
              }}
            >
              {title === "Doctor"
                ? "Find doctors & book appointments"
                : "Manage your healthcare dashboard"}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        ></Box>

        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            gap: 1,
            marginLeft: "auto",
          }}
        >
          {[2, 3].includes(Number(storedUser?.role_id)) && (
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
          )}

          <Box
            sx={{
              width: "1px",
              height: 28,
              backgroundColor: "#e3e9e7",
              mx: 0.5,
            }}
          />

          <NotificationPopover />

          <Box
            sx={{
              width: "1px",
              height: 28,
              backgroundColor: "#e3e9e7",
              mx: 0.5,
            }}
          />

          {roleNavbar.map((item, index) => (
            <Tooltip key={item?.label || index} title={item.label}>
              <Button
                onClick={(event) => {
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
                <Badge badgeContent={item.badge} color="error">
                  <item.icon sx={{ fontSize: 20 }} />
                </Badge>

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

      <audio ref={alertAudioRef} src="/sound/alert.mp3" preload="auto" />

      <Dialog
        open={emergencyOpen}
        onClose={handleCloseEmergency}
        fullScreen
        PaperProps={{
          sx: {
            backgroundColor: "rgba(0,0,0,0.5)",
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
              An emergency has been triggered. Please take action immediately.
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
        onClose={() =>
          setSnack((prev) => ({
            ...prev,
            open: false,
          }))
        }
      >
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;
