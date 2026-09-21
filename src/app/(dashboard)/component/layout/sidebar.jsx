"use client";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  Popover,
  Typography,
  useMediaQuery,
} from "@mui/material";
import EmergencyOutlinedIcon from "@mui/icons-material/EmergencyOutlined";
import { useTheme } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import { socket } from "../../../../socket/socket";
import { menuItems } from "./menuItems";
import { navbarItems } from "./navbarItems";
import SidebarMenuItem from "../layout/Sidebar/SidebarMenuItem";
import SidebarProfile from "../layout/Sidebar/SidebarProfile";
import NotificationPopover from "../../users/components/Header/NotificationPopover";
import Calender from "../../doctor/components/Header/Calender";

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
  const [qualification, setQualification] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [storedUser, setStoredUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const theme = useTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const userData = localStorage.getItem("user");

      if (!userData) {
        setRoleId(0);
        setStoredUser(null);
        setUserName("Not Provided");
        setQualification("Not Provided");
        setSpecialization("");
        setProfileImage("");
        return;
      }

      const user = JSON.parse(userData);

      setStoredUser(user);
      setRoleId(Number(user?.role_id) || 0);
      setUserName(
        user?.full_name ||
          user?.name ||
          "Not Provided"
      );
      setQualification(
        user?.qualification ||
          "Not Provided"
      );
      setSpecialization(user?.specialization || "");
      setProfileImage(
        user?.image ||
          user?.profileImage ||
          ""
      );
    } catch (error) {
      console.error(
        "Sidebar user parse error:",
        error
      );

      setRoleId(0);
      setStoredUser(null);
      setUserName("Not Provided");
      setQualification("Not Provided");
      setSpecialization("");
      setProfileImage("");
    }
  }, []);

  const S3_BUCKET_URL =
    process.env.NEXT_PUBLIC_S3_BUCKET_URL || "";

  const getAvatarUrl = () => {
    if (!profileImage) {
      return Number(roleId) === 1
        ? "/img/IconPatient.png"
        : "/img/IconDoctor.png";
    }

    if (
      profileImage.startsWith("http://") ||
      profileImage.startsWith("https://")
    ) {
      return profileImage;
    }

    const baseUrl = S3_BUCKET_URL.replace(/\/$/, "");
    const imagePath = profileImage.replace(/^\//, "");

    if (!baseUrl) {
      return `/${imagePath}`;
    }

    return `${baseUrl}/${imagePath}`;
  };

  const avatarSrc = getAvatarUrl();
  const currentMenuItems =
    menuItems?.[roleId] || [];
  const roleNavbar =
    navbarItems?.[storedUser?.role_id] || [];

  useEffect(() => {
    if (!pathname) return;

    if (
      pathname.includes(
        "/doctor/pages/prescription"
      ) ||
      pathname.includes(
        "/doctor/pages/reportPatient"
      )
    ) {
      setActiveButton?.("Patient");
      return;
    }

    if (
      pathname.startsWith(
        "/users/pages/Appointment"
      )
    ) {
      setActiveButton?.("Doctor");
      return;
    }

    const currentItem = currentMenuItems.find(
      (item) => {
        if (!item?.route) return false;

        return (
          pathname === item.route ||
          pathname.startsWith(
            `${item.route}/`
          )
        );
      }
    );

    if (currentItem) {
      setActiveButton?.(currentItem.label);
    }
  }, [
    pathname,
    currentMenuItems,
    setActiveButton,
  ]);

  const handleNavigation = (item) => {
    setActiveButton?.(item.label);

    if (isMobile) {
      onClose?.();
    }
  };

  const handleMobileAction = (event, item) => {
    if (item.label === "Calendar") {
      setAnchorEl(event.currentTarget);
      return;
    }

    item.onClick?.();
  };

  const handleEmergencyClick = () => {
    let user = storedUser;

    if (
      !user &&
      typeof window !== "undefined"
    ) {
      const userData =
        localStorage.getItem("user");

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

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("sendEmergency", {
      message: "EMERGENCY ALERT!",
    });
  };

  const showContent = isOpen || isMobile;

  const sidebarContent = (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
        px: {
          xs: "12px",
          sm: isOpen ? "14px" : "9px",
        },
        py: {
          xs: "14px",
          sm: "14px",
        },mt: { xs: 8, md: 0 },
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <SidebarProfile
        isOpen={isOpen}
        isMobile={isMobile}
        roleId={roleId}
        userName={userName}
        qualification={qualification}
        specialization={specialization}
        avatarSrc={avatarSrc}
      />

      <Divider sx={{ my: "13px" }} />

      {showContent && (
        <Typography
          sx={{
            ml: "10px",
            mb: "7px",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "1px",
            color: "text.disabled",
          }}
        >
          MENU
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "3px",
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {currentMenuItems.map(
          (item, index) => (
            <SidebarMenuItem
              key={
                item?.route ||
                `${item?.label}-${index}`
              }
              item={item}
              isActive={
                activeButton === item.label
              }
              showLabel={showContent}
              onNavigate={handleNavigation}
            />
          )
        )}

        {isMobile && (
          <>
            <Divider sx={{ my: "10px" }} />

            <Typography
              sx={{
                ml: "10px",
                mb: "5px",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "1px",
                color: "text.disabled",
              }}
            >
              QUICK ACTIONS
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "3px",
              }}
            >
              <NotificationPopover sidebar />

              {roleNavbar.map(
                (item, index) => (
                  <Button
                    key={
                      item?.label || index
                    }
                    disableRipple
                    onClick={(event) =>
                      handleMobileAction(
                        event,
                        item
                      )
                    }
                    sx={{
                      width: "100%",
                      minWidth: 0,
                      minHeight: "42px",
                      px: "11px",
                      display: "flex",
                      justifyContent:
                        "flex-start",
                      alignItems: "center",
                      gap: "10px",
                      borderRadius: "8px",
                      color:
                        "text.secondary",
                      textTransform: "none",
                      transition:
                        "all 0.2s ease",
                      "&:hover": {
                        bgcolor:
                          "secondary.light",
                        color:
                          "primary.main",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: "23px",
                        minWidth: "23px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "center",
                        flexShrink: 0,
                      }}
                    >
                      <Badge
                        badgeContent={
                          item.badge
                        }
                        color="error"
                        max={99}
                        invisible={
                          !item.badge
                        }
                      >
                        <item.icon
                          sx={{
                            fontSize:
                              "19px",
                          }}
                        />
                      </Badge>
                    </Box>

                    <Typography
                      component="span"
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        fontSize:
                          "12.5px",
                        fontWeight: 600,
                        color: "inherit",
                        textAlign: "left",
                        whiteSpace:
                          "nowrap",
                        overflow: "hidden",
                        textOverflow:
                          "ellipsis",
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Button>
                )
              )}

          {[2, 3].includes(Number(roleId)) && (
                <Button
                  disableRipple
                  onClick={
                    handleEmergencyClick
                  }
                  sx={{
                    width: "100%",
                    minWidth: 0,
                    minHeight: "42px",
                    px: "11px",
                    display: "flex",
                    justifyContent:
                      "flex-start",
                    alignItems: "center",
                    gap: "10px",
                    borderRadius: "8px",
                    color: "error.main",
                    textTransform: "none",
                    transition:
                      "all 0.2s ease",
                    "&:hover": {
                      bgcolor:
                        "rgba(211, 47, 47, 0.06)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: "23px",
                      minWidth: "23px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "center",
                      flexShrink: 0,
                    }}
                  >
                    <EmergencyOutlinedIcon
                      sx={{
                        fontSize: "19px",
                      }}
                    />
                  </Box>

                  <Typography
                    component="span"
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: "inherit",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Emergency
                  </Typography>
                </Button>
              )}
            </Box>
          </>
        )}
      </Box>

      {showContent && (
        <Box
          sx={{
            mt: "auto",
            pt: "11px",
            px: "8px",
            pb: "3px",
            borderTop: "1px solid",
            borderColor: "divider",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            Jeevan Dev
          </Typography>

          <Typography
            sx={{
              mt: "3px",
              fontSize: "9px",
              color: "text.disabled",
            }}
          >
            © 2026 All rights reserved.
          </Typography>
        </Box>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <Drawer
          anchor="left"
          open={Boolean(isMobileOpen)}
          onClose={onClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor:
                "background.paper",
              border: "none",
              overflowX: "hidden",
            },
          }}
        >
          {sidebarContent}
        </Drawer>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() =>
            setAnchorEl(null)
          }
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          PaperProps={{
            sx: {
              maxWidth: "92vw",
              maxHeight: "80vh",
            },
          }}
        >
          <Calender />
        </Popover>
      </>
    );
  }

  return (
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
          bgcolor: "background.paper",
          border: "none",
          borderRight: "1px solid",
          borderColor: "divider",
          transition: "width 0.3s ease",
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;