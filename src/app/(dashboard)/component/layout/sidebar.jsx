
"use client";

import React, { useEffect, useState } from "react";
import {
  Drawer,
  Avatar,
  Typography,
  Button,
  Box,
  useMediaQuery,
  Divider,
  Tooltip,
} from "@mui/material";

import Link from "next/link";
import { Share, ChevronRight } from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";
import { usePathname } from "next/navigation";

import { menuItems } from "./menuItems";

const Sidebar = ({
  isOpen,
  isMobileOpen,
  onClose,
  activeButton,
  setActiveButton,
  drawerWidth,
}) => {
  // =========================================================
  // STATES
  // =========================================================

  const [roleId, setRoleId] = useState(0);
  const [profileImage, setProfileImage] = useState("");
  const [userName, setUserName] = useState("Dr. User");
  const [qualification, setQualification] = useState("");
  const [specialization, setSpecialization] = useState("");

  // =========================================================
  // HOOKS
  // =========================================================

  const theme = useTheme();
  const pathname = usePathname();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // =========================================================
  // USER DATA
  // =========================================================

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const userData = localStorage.getItem("user");

      if (!userData) {
        setRoleId(0);
        setUserName("Not Provided");
        setQualification("Not Provided");
        setSpecialization("");
        setProfileImage("");
        return;
      }

      const user = JSON.parse(userData);

      setRoleId(Number(user?.role_id) || 0);

      setUserName(
        user?.full_name ||
          user?.name ||
          "Not Provided"
      );

      setQualification(
        user?.qualification || "Not Provided"
      );

      setSpecialization(
        user?.specialization || ""
      );

      setProfileImage(
        user?.image ||
          user?.profileImage ||
          ""
      );
    } catch (error) {
      console.error("Sidebar user parse error:", error);

      setRoleId(0);
      setUserName("Not Provided");
      setQualification("Not Provided");
      setSpecialization("");
      setProfileImage("");
    }
  }, []);

  // =========================================================
  // PROFILE IMAGE
  // =========================================================

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

  // =========================================================
  // MENU
  // =========================================================

  const currentMenuItems = menuItems?.[roleId] || [];

  const canShareProfile = Number(roleId) === 2;

  // =========================================================
  // ACTIVE MENU
  // =========================================================

  useEffect(() => {
    if (!pathname) return;

    // Doctor patient pages
    if (
      pathname.includes("/doctor/pages/prescription") ||
      pathname.includes("/doctor/pages/reportPatient")
    ) {
      setActiveButton?.("Patient");
      return;
    }

    // User appointment
    if (
      pathname.startsWith("/users/pages/Appointment")
    ) {
      setActiveButton?.("Doctor");
      return;
    }

    const currentItem = currentMenuItems.find((item) => {
      if (!item?.route) return false;

      return (
        pathname === item.route ||
        pathname.startsWith(`${item.route}/`)
      );
    });

    if (currentItem) {
      setActiveButton?.(currentItem.label);
    }
  }, [
    pathname,
    currentMenuItems,
    setActiveButton,
  ]);

  // =========================================================
  // NAVIGATION
  // =========================================================

  const handleNavigation = (item) => {
    setActiveButton?.(item.label);

    if (isMobile) {
      onClose?.();
    }
  };

  // =========================================================
  // PROFILE SUBTITLE
  // =========================================================

  const getProfileSubtitle = () => {
    if (Number(roleId) === 1) {
      return "Patient Account";
    }

    if (specialization) {
      return specialization;
    }

    if (qualification) {
      return qualification;
    }

    return "Account";
  };

  // =========================================================
  // SIDEBAR CONTENT
  // =========================================================

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
        },

        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* =====================================================
          PROFILE CARD
      ====================================================== */}

      <Box
        sx={{
          width: "100%",

          display: "flex",

          flexDirection:
            isOpen || isMobile
              ? "row"
              : "column",

          alignItems: "center",

          justifyContent:
            isOpen || isMobile
              ? "flex-start"
              : "center",

          gap:
            isOpen || isMobile
              ? "10px"
              : "6px",

          // Global theme
          bgcolor: "secondary.light",

          border: "1px solid",
          borderColor: "divider",

          borderRadius: "10px",

          p:
            isOpen || isMobile
              ? "10px"
              : "7px",

          flexShrink: 0,

          transition: "all 0.25s ease",

          "&:hover": {
            borderColor: "primary.light",

            boxShadow: `0 4px 14px ${alpha(
              theme.palette.primary.main,
              0.08
            )}`,

            "& .profile-avatar": {
              transform: "scale(1.04)",
            },
          },
        }}
      >
        {/* AVATAR */}

        <Avatar
          className="profile-avatar"
          src={avatarSrc}
          alt={userName}
          sx={{
            width:
              isOpen || isMobile
                ? 46
                : 40,

            height:
              isOpen || isMobile
                ? 46
                : 40,

            flexShrink: 0,

            bgcolor: "background.paper",

            border: "1.5px solid",
            borderColor: "primary.light",

            color: "primary.main",

            boxShadow: `0 2px 6px ${alpha(
              theme.palette.primary.main,
              0.08
            )}`,

            transition: "transform 0.25s ease",
          }}
        />

        {/* PROFILE INFO */}

        {(isOpen || isMobile) && (
          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "13.5px",
                lineHeight: 1.2,
                fontWeight: 700,
                color: "text.primary",

                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userName}
            </Typography>

            <Typography
              sx={{
                mt: "3px",

                fontSize: "10.5px",
                lineHeight: 1.3,

                color: "text.secondary",

                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {getProfileSubtitle()}
            </Typography>

            {/* ACTIVE STATUS */}

            <Box
              sx={{
                mt: "5px",

                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Box
                sx={{
                  width: "6px",
                  height: "6px",

                  borderRadius: "50%",

                  bgcolor: "success.main",
                }}
              />

              <Typography
                sx={{
                  fontSize: "9.5px",
                  fontWeight: 600,

                  color: "success.dark",
                }}
              >
                Active
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* =====================================================
          SHARE PROFILE BUTTON
      ====================================================== */}

      {canShareProfile &&
        (isOpen || isMobile) && (
          <Button
            variant="contained"
            color="primary"
            startIcon={
              <Share
                sx={{
                  fontSize: "15px !important",
                }}
              />
            }
            sx={{
              width: "100%",

              height: "36px",

              mt: "9px",

              fontSize: "11.5px",
              fontWeight: 600,

              borderRadius: "8px",

              "&:hover": {
                transform: "translateY(-1px)",
              },
            }}
          >
            Share Profile
          </Button>
        )}

      {/* =====================================================
          DIVIDER
      ====================================================== */}

      <Divider
        sx={{
          my: "13px",
        }}
      />

      {/* =====================================================
          MENU TITLE
      ====================================================== */}

      {(isOpen || isMobile) && (
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

      {/* =====================================================
          MENU ITEMS
      ====================================================== */}

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
        {currentMenuItems.map((item, index) => {
          const isActive =
            activeButton === item.label;

          const showLabel =
            isOpen || isMobile;

          return (
            <Tooltip
              key={
                item?.route ||
                `${item?.label}-${index}`
              }
              title={
                !showLabel
                  ? item.label
                  : ""
              }
              placement="right"
              arrow
            >
              <Link
                href={item?.route || "#"}
                style={{
                  width: "100%",
                  textDecoration: "none",
                }}
              >
                <Button
                  onClick={() =>
                    handleNavigation(item)
                  }
                  disableRipple
                  sx={{
                    position: "relative",

                    width: "100%",
                    minWidth: 0,

                    height: "42px",
                    minHeight: "42px",

                    px: showLabel
                      ? "11px"
                      : "8px",

                    display: "flex",

                    justifyContent:
                      showLabel
                        ? "flex-start"
                        : "center",

                    alignItems: "center",

                    gap: showLabel
                      ? "10px"
                      : 0,

                    borderRadius: "8px",

                    // =========================
                    // THEME COLORS
                    // =========================

                    color: isActive
                      ? "primary.main"
                      : "text.secondary",

                    bgcolor: isActive
                      ? "secondary.light"
                      : "transparent",

                    textTransform: "none",

                    overflow: "hidden",

                    transition:
                      "all 0.2s ease",

                    // =========================
                    // ACTIVE LEFT BORDER
                    // =========================

                    "&::before": isActive
                      ? {
                          content: '""',

                          position:
                            "absolute",

                          left: 0,
                          top: "9px",

                          width: "3px",
                          height: "24px",

                          borderRadius:
                            "0 4px 4px 0",

                          bgcolor:
                            "primary.main",
                        }
                      : {},

                    // =========================
                    // ICON
                    // =========================

                    "& .menu-icon": {
                      width: "23px",
                      minWidth: "23px",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      flexShrink: 0,

                      color: isActive
                        ? "primary.main"
                        : "text.secondary",

                      transition:
                        "all 0.2s ease",

                      "& svg": {
                        fontSize: "19px",
                      },
                    },

                    // =========================
                    // LABEL
                    // =========================

                    "& .menu-label": {
                      flex: 1,
                      minWidth: 0,

                      textAlign: "left",

                      fontSize: "12.5px",

                      fontWeight:
                        isActive
                          ? 700
                          : 600,

                      letterSpacing:
                        "0.1px",

                      whiteSpace: "nowrap",

                      overflow: "hidden",

                      textOverflow:
                        "ellipsis",
                    },

                    // =========================
                    // ARROW
                    // =========================

                    "& .menu-arrow": {
                      fontSize: "16px",

                      flexShrink: 0,

                      color: "primary.main",

                      opacity:
                        isActive
                          ? 1
                          : 0,

                      transform:
                        isActive
                          ? "translateX(0)"
                          : "translateX(-4px)",

                      transition:
                        "all 0.2s ease",
                    },

                    // =========================
                    // HOVER
                    // =========================

                    "&:hover": {
                      bgcolor:
                        "secondary.light",

                      color:
                        "primary.main",

                      transform:
                        showLabel
                          ? "translateX(2px)"
                          : "none",

                      "& .menu-icon": {
                        color:
                          "primary.main",

                        transform:
                          "scale(1.04)",
                      },

                      "& .menu-arrow": {
                        opacity: 1,

                        transform:
                          "translateX(0)",
                      },
                    },
                  }}
                >
                  {/* ICON */}

                  <Box className="menu-icon">
                    {item.icon}
                  </Box>

                  {/* LABEL */}

                  {showLabel && (
                    <>
                      <Typography
                        component="span"
                        className="menu-label"
                      >
                        {item.label}
                      </Typography>

                      <ChevronRight className="menu-arrow" />
                    </>
                  )}
                </Button>
              </Link>
            </Tooltip>
          );
        })}
      </Box>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      {(isOpen || isMobile) && (
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

  // =========================================================
  // MOBILE DRAWER
  // =========================================================

  if (isMobile) {
    return (
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

            bgcolor: "background.paper",

            border: "none",

            overflowX: "hidden",
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  // =========================================================
  // DESKTOP DRAWER
  // =========================================================

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
