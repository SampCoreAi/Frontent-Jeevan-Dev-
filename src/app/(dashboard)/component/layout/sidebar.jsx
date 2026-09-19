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

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

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
      console.error(
        "Sidebar user parse error:",
        error
      );

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

    const baseUrl = S3_BUCKET_URL.replace(
      /\/$/,
      ""
    );

    const imagePath = profileImage.replace(
      /^\//,
      ""
    );

    if (!baseUrl) {
      return `/${imagePath}`;
    }

    return `${baseUrl}/${imagePath}`;
  };

  const avatarSrc = getAvatarUrl();

  // =========================================================
  // MENU
  // =========================================================

  const currentMenuItems =
    menuItems?.[roleId] || [];

  /*
    Rajiv Lab integration ke incoming code me
    role 1-5 ke liye Lab styling condition thi.
    Isko preserve kiya hai.
  */
  const isLab =
    Number(roleId) >= 1 &&
    Number(roleId) <= 5;

  const canShareProfile =
    Number(roleId) === 2;

  // =========================================================
  // ACTIVE MENU
  // =========================================================

  useEffect(() => {
    if (!pathname) return;

    // Doctor patient pages
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

    // User appointment
    if (
      pathname.startsWith(
        "/users/pages/Appointment"
      )
    ) {
      setActiveButton?.("Doctor");
      return;
    }

    const currentItem =
      currentMenuItems.find((item) => {
        if (!item?.route) return false;

        return (
          pathname === item.route ||
          pathname.startsWith(
            `${item.route}/`
          )
        );
      });

    if (currentItem) {
      setActiveButton?.(
        currentItem.label
      );
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
  // PROFILE SUB TITLE
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

        bgcolor: isLab
          ? "#f4f9fc"
          : "background.paper",

        borderRight: "1px solid",
        borderColor: "divider",

        px: {
          xs: "12px",
          sm: isOpen
            ? "14px"
            : "9px",
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

          bgcolor: isLab
            ? "#eaf5fb"
            : "background.third",

          border: "1px solid",

          borderColor: isLab
            ? "#cfe3ef"
            : "divider",

          borderRadius: isLab
            ? "6px"
            : "12px",

          p:
            isOpen || isMobile
              ? "11px"
              : "7px",

          flexShrink: 0,

          transition:
            "all 0.3s cubic-bezier(0.22,1,0.36,1)",

          "&:hover": {
            transform:
              "translateY(-2px)",

            borderColor: isLab
              ? "#b6d8e9"
              : "primary.light",

            boxShadow: `0 6px 18px ${alpha(
              theme.palette.primary.main,
              0.1
            )}`,

            "& .profile-avatar": {
              transform:
                "scale(1.05)",
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
                ? 48
                : 42,

            height:
              isOpen || isMobile
                ? 48
                : 42,

            flexShrink: 0,

            bgcolor: "background.paper",

            border: "1.5px solid",

            borderColor: isLab
              ? "#9fcade"
              : "primary.light",

            color: "primary.main",

            boxShadow: `0 2px 6px ${alpha(
              theme.palette.primary.main,
              0.1
            )}`,

            transition:
              "transform 0.3s ease",
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
                fontSize: "14px",

                lineHeight: 1.2,

                fontWeight: 700,

                color: isLab
                  ? "#123f66"
                  : "text.primary",

                whiteSpace: "nowrap",

                overflow: "hidden",

                textOverflow:
                  "ellipsis",
              }}
            >
              {userName}
            </Typography>

            <Typography
              sx={{
                mt: "3px",

                fontSize: "10.5px",

                lineHeight: 1.3,

                color: isLab
                  ? "#54748d"
                  : "text.secondary",

                whiteSpace: "nowrap",

                overflow: "hidden",

                textOverflow:
                  "ellipsis",
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

                  bgcolor:
                    "success.main",
                }}
              />

              <Typography
                sx={{
                  fontSize: "9.5px",

                  fontWeight: 600,

                  color:
                    "success.dark",
                }}
              >
                Active
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* =====================================================
          SHARE PROFILE
      ====================================================== */}

      {canShareProfile &&
        (isOpen || isMobile) && (
          <Button
            startIcon={
              <Share
                sx={{
                  fontSize:
                    "16px !important",
                }}
              />
            }
            sx={{
              width: "100%",

              height: "38px",

              mt: "10px",

              borderRadius: "9px",

              bgcolor:
                "primary.main",

              color:
                "primary.contrastText",

              fontSize: "11.5px",

              fontWeight: 650,

              textTransform: "none",

              boxShadow: "none",

              transition:
                "all 0.25s ease",

              "&:hover": {
                bgcolor:
                  "primary.dark",

                transform:
                  "translateY(-1px)",

                boxShadow: `0 5px 15px ${alpha(
                  theme.palette
                    .primary.main,
                  0.2
                )}`,
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
          my: "14px",
          borderColor: "divider",
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
        {currentMenuItems.map(
          (item, index) => {
            const isActive =
              activeButton ===
              item.label;

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
                  href={
                    item?.route || "#"
                  }
                  style={{
                    width: "100%",

                    textDecoration:
                      "none",
                  }}
                >
                  <Button
                    onClick={() =>
                      handleNavigation(
                        item
                      )
                    }
                    disableRipple
                    sx={{
                      position:
                        "relative",

                      width: "100%",

                      minWidth: 0,

                      height: "44px",

                      minHeight:
                        "44px",

                      px: showLabel
                        ? "11px"
                        : "8px",

                      display: "flex",

                      justifyContent:
                        showLabel
                          ? "flex-start"
                          : "center",

                      alignItems:
                        "center",

                      gap: showLabel
                        ? "10px"
                        : 0,

                      borderRadius:
                        isLab
                          ? "6px"
                          : "10px",

                      color: isActive
                        ? isLab
                          ? "#0b5c8e"
                          : "primary.main"
                        : isLab
                        ? "#54748d"
                        : "text.secondary",

                      bgcolor: isActive
                        ? isLab
                          ? "#dceff8"
                          : "secondary.light"
                        : "transparent",

                      textTransform:
                        "none",

                      overflow:
                        "hidden",

                      transition:
                        "all 0.25s ease",

                      // ACTIVE LEFT LINE

                      "&::before":
                        isActive
                          ? {
                              content:
                                '""',

                              position:
                                "absolute",

                              left: 0,

                              top: "10px",

                              width:
                                "3px",

                              height:
                                "24px",

                              borderRadius:
                                "0 4px 4px 0",

                              bgcolor:
                                isLab
                                  ? "#0b5c8e"
                                  : "primary.main",
                            }
                          : {},

                      // ICON

                      "& .menu-icon":
                        {
                          width:
                            "24px",

                          minWidth:
                            "24px",

                          display:
                            "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",

                          flexShrink: 0,

                          color:
                            isActive
                              ? isLab
                                ? "#0b5c8e"
                                : "primary.main"
                              : isLab
                              ? "#54748d"
                              : "text.secondary",

                          transition:
                            "all 0.25s ease",

                          "& svg":
                            {
                              fontSize:
                                "20px",
                            },
                        },

                      // LABEL

                      "& .menu-label":
                        {
                          flex: 1,

                          minWidth: 0,

                          textAlign:
                            "left",

                          fontSize:
                            "12.5px",

                          fontWeight:
                            isActive
                              ? 700
                              : 600,

                          letterSpacing:
                            "0.15px",

                          whiteSpace:
                            "nowrap",

                          overflow:
                            "hidden",

                          textOverflow:
                            "ellipsis",
                        },

                      // ARROW

                      "& .menu-arrow":
                        {
                          fontSize:
                            "17px",

                          flexShrink: 0,

                          color: isLab
                            ? "#0b5c8e"
                            : "primary.main",

                          opacity:
                            isActive
                              ? 1
                              : 0,

                          transform:
                            isActive
                              ? "translateX(0)"
                              : "translateX(-5px)",

                          transition:
                            "all 0.25s ease",
                        },

                      // HOVER

                      "&:hover": {
                        bgcolor: isLab
                          ? "#e5f2f8"
                          : "secondary.light",

                        color: isLab
                          ? "#0b5c8e"
                          : "primary.main",

                        transform:
                          showLabel
                            ? "translateX(2px)"
                            : "none",

                        "& .menu-icon":
                          {
                            color:
                              isLab
                                ? "#0b5c8e"
                                : "primary.main",

                            transform:
                              "scale(1.05)",
                          },

                        "& .menu-arrow":
                          {
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
          }
        )}
      </Box>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      {(isOpen || isMobile) && (
        <Box
          sx={{
            mt: "auto",

            pt: "12px",

            px: "8px",

            pb: "3px",

            borderTop:
              "1px solid",

            borderColor:
              "divider",

            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: "11px",

              fontWeight: 700,

              color:
                "text.primary",
            }}
          >
            Jeevan Dev
          </Typography>

          <Typography
            sx={{
              mt: "4px",

              fontSize: "9px",

              color:
                "text.disabled",
            }}
          >
            © 2025 All rights reserved.
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
        open={Boolean(
          isMobileOpen
        )}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper":
            {
              boxSizing:
                "border-box",

              width:
                drawerWidth,

              bgcolor:
                "background.paper",

              border: "none",

              overflowX:
                "hidden",
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

          bgcolor:
            "background.paper",

          border: "none",

          borderRight:
            "1px solid",

          borderColor: "divider",

          transition:
            "width 0.3s ease",
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;