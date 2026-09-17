"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  Grid,
  Avatar,
  Typography,
  Button,
  Box,
  useMediaQuery,
  Divider,
  Tooltip,
} from "@mui/material";

import Link from "next/link";

import {
  Share,
  ChevronRight,
  Favorite,
} from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";
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
  /* =========================================================
     EXISTING STATES
  ========================================================= */

  const [roleId, setRoleId] = useState(0);
  const [profileImage, setProfileImage] = useState("");
  const [userName, setUserName] = useState("Dr. User");

  const [qualification, setQualification] = useState(
    "MBBL, FCPS I MD (Medicine), MCPS"
  );

  const [specialization, setSpecialization] = useState("");

  const theme = useTheme();

  const isMobile = useMediaQuery("(max-width:900px)");

  const pathname = usePathname();


  /* =========================================================
     GET USER
  ========================================================= */

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


  /* =========================================================
     PROFILE IMAGE
  ========================================================= */

  const S3_BUCKET_URL = process.env.NEXT_PUBLIC_S3_BUCKET_URL;

  const avatarSrc = profileImage
    ? `${S3_BUCKET_URL}/${profileImage}`
    : roleId === 1
    ? "/img/IconPatient.png"
    : "/img/IconDoctor.png";


  /* =========================================================
     MENU ITEMS
  ========================================================= */

  const currentMenuItems = menuItems[roleId] || [];


  /* =========================================================
     ACTIVE ROUTE
     SAME LOGIC
  ========================================================= */

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


  /* =========================================================
     NAVIGATION
  ========================================================= */

  const handleNavigation = (item) => {
    setActiveButton(item.label);

    if (isMobile) {
      onClose();
    }
  };


  /* =========================================================
     SIDEBAR CONTENT
  ========================================================= */

  const sidebarContent = (
    <Box
      sx={{
        width: "100%",
        height: "100vh",

        display: "flex",
        flexDirection: "column",

        backgroundColor: "#ffffff",

        borderRight: "1px solid #e6ecea",

        px: {
          xs: "14px",
          sm: "16px",
        },

        py: {
          xs: "14px",
          sm: "16px",
        },

        overflow: "hidden",
      }}
    >

      {/* =====================================================
          PROFILE CARD
      ====================================================== */}

      <Box
        sx={{
          p: "16px",

          backgroundColor: "#f0faf7",

          border: "1px solid #d1ebe4",

          borderRadius: "14px",

          flexShrink: 0,

          transition:
            "border-color 0.3s ease, box-shadow 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)",

          "&:hover": {
            borderColor: "#b9e2d8",

            transform: "translateY(-2px)",

            boxShadow:
              "0 8px 24px rgba(10,159,125,0.08)",

            "& .profile-avatar": {
              transform: "scale(1.06)",

              boxShadow:
                "0 5px 14px rgba(10,159,125,0.14)",
            },
          },
        }}
      >

        {/* PROFILE TOP */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >

          {/* AVATAR */}

          <Avatar
            className="profile-avatar"
            src={avatarSrc}
            alt={userName}
            sx={{
              width: 54,
              height: 54,

              flexShrink: 0,

              backgroundColor: "#ffffff",

              border: "1.5px solid #bce5da",

              color: "#0a9f7d",

              boxShadow:
                "0 2px 6px rgba(10,159,125,0.08)",

              transition:
                "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease",
            }}
          />


          {/* USER DETAILS */}

          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >

            <Typography
              sx={{
                fontSize: "16px",

                lineHeight: 1.2,

                fontWeight: 700,

                color: "#075f50",

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

                fontSize: "11px",

                lineHeight: 1.3,

                color: "#7b8b87",

                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {roleId === 1
                ? "Patient Account"
                : specialization || qualification}
            </Typography>


            {/* ACTIVE */}

            <Box
              sx={{
                mt: "5px",

                display: "flex",
                alignItems: "center",

                gap: "5px",
              }}
            >

             

              <Typography
                sx={{
                  fontSize: "10px",

                  fontWeight: 600,

                  color: "#08775f",
                }}
              >
                Active
              </Typography>

            </Box>

          </Box>

        </Box>


        {/* =================================================
            SHARE PROFILE
        ================================================== */}

        <Button
          fullWidth
          startIcon={<Share sx={{ fontSize: "17px !important" }} />}
          sx={{
            height: "40px",

            mt: "14px",

            borderRadius: "9px",

            backgroundColor: "#0a9f7d",

            color: "#ffffff",

            fontSize: "12px",

            fontWeight: 650,

            textTransform: "none",

            boxShadow: "none",

            transition:
              "background-color 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease",

            "& .MuiButton-startIcon": {
              transition:
                "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
            },

            "&:hover": {
              backgroundColor: "#07876a",

              transform: "translateY(-2px)",

              boxShadow:
                "0 7px 18px rgba(10,159,125,0.20)",

              "& .MuiButton-startIcon": {
                transform: "rotate(-12deg) scale(1.1)",
              },
            },

            "&:active": {
              transform: "translateY(0) scale(0.99)",
            },
          }}
        >
          Share Profile
        </Button>

      </Box>


      {/* =====================================================
          DIVIDER
      ====================================================== */}

      <Divider
        sx={{
          my: "18px",

          borderColor: "#edf1f0",
        }}
      />


      {/* =====================================================
          MAIN MENU
      ====================================================== */}

      <Typography
        sx={{
          ml: "10px",

          mb: "7px",

          fontSize: "9px",

          fontWeight: 700,

          letterSpacing: "1px",

          color: "#9ba8a4",
        }}
      >
        MAIN MENU
      </Typography>


      {/* =====================================================
          MENU ITEMS
      ====================================================== */}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",

          gap: "3px",

          overflowY: "auto",

          scrollbarWidth: "none",

          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >

        {currentMenuItems.map((item, index) => {
          const isActive = activeButton === item.label;

          return (
            <Tooltip
              key={index}
              title={!isOpen && !isMobile ? item.label : ""}
              placement="right"
              arrow
            >
              <Link
                href={item.route}
                style={{
                  width: "100%",
                  textDecoration: "none",
                }}
                passHref
              >

                <Button
                  onClick={() => handleNavigation(item)}
                  disableRipple
                  sx={{
                    position: "relative",

                    width: "100%",

                    height: "46px",

                    minHeight: "46px",

                    px: "11px",

                    display: "flex",

                    justifyContent: "flex-start",

                    alignItems: "center",

                    gap: "11px",

                    borderRadius: "10px",

                    color: isActive
                      ? "#08775f"
                      : "#3f4d49",

                    backgroundColor: isActive
                      ? "#eaf7f3"
                      : "transparent",

                    textTransform: "none",

                    overflow: "hidden",

                    transition:
                      "background-color 0.3s cubic-bezier(0.22,1,0.36,1), color 0.3s cubic-bezier(0.22,1,0.36,1), transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s cubic-bezier(0.22,1,0.36,1)",


                    /* LEFT ACTIVE LINE */

                    "&::before": isActive
                      ? {
                          content: '""',

                          position: "absolute",

                          left: 0,
                          top: "11px",

                          width: "3px",
                          height: "24px",

                          borderRadius:
                            "0 4px 4px 0",

                          backgroundColor:
                            "#0a9f7d",

                          transition:
                            "height 0.3s ease, top 0.3s ease",
                        }
                      : {},


                    /* ICON */

                    "& .menu-icon": {
                      width: "24px",
                      minWidth: "24px",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      color: isActive
                        ? "#0a9f7d"
                        : "#64746f",

                      transition:
                        "color 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1)",

                      "& svg": {
                        fontSize: "20px",
                      },
                    },


                    /* LABEL */

                    "& .menu-label": {
                      flex: 1,

                      textAlign: "left",

                      fontSize: "12.5px",

                      fontWeight: isActive
                        ? 700
                        : 600,

                      letterSpacing:
                        "0.15px",

                      transition:
                        "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
                    },


                    /* ARROW */

                    "& .menu-arrow": {
                      fontSize: "17px",

                      color: "#0a9f7d",

                      opacity: isActive ? 1 : 0,

                      transform: isActive
                        ? "translateX(0)"
                        : "translateX(-7px)",

                      transition:
                        "opacity 0.25s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1)",
                    },


                    /* ==========================
                       HOVER ANIMATION
                    ========================== */

                    "&:hover": {
                      backgroundColor: isActive
                        ? "#eaf7f3"
                        : "#f0faf7",

                      color: "#08775f",

                      transform:
                        "translateX(3px)",

                      boxShadow:
                        "0 4px 14px rgba(10,159,125,0.06)",


                      "& .menu-icon": {
                        color: "#0a9f7d",

                        transform:
                          "translateX(2px) scale(1.06)",
                      },


                      "& .menu-label": {
                        transform:
                          "translateX(2px)",
                      },


                      "& .menu-arrow": {
                        opacity: 1,

                        transform:
                          "translateX(0)",
                      },


                      ...(isActive && {
                        "&::before": {
                          height: "28px",
                          top: "9px",
                        },
                      }),
                    },
                  }}
                >

                  {/* ICON */}

                  <Box className="menu-icon">
                    {item.icon}
                  </Box>


                  {/* LABEL */}

                  {(isOpen || isMobile) && (
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

      <Box
        sx={{
          mt: "auto",

          pt: "15px",
          px: "10px",
          pb: "5px",

          borderTop:
            "1px solid #edf1f0",
        }}
      >

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: "9px",

            "&:hover .footer-logo": {
              transform:
                "rotate(-6deg) scale(1.08)",

              boxShadow:
                "0 5px 12px rgba(10,159,125,0.18)",
            },

            "&:hover .footer-name": {
              color: "#0a9f7d",

              transform:
                "translateX(1px)",
            },
          }}
        >

          {/* LOGO */}

          <Box
            className="footer-logo"
            sx={{
              width: 31,
              height: 31,

              display: "flex",

              alignItems: "center",
              justifyContent: "center",

              flexShrink: 0,

              borderRadius: "8px",

              backgroundColor:
                "#0a9f7d",

              color: "#ffffff",

              transition:
                "transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease",
            }}
          >
            <Favorite
              sx={{
                fontSize: 18,
              }}
            />
          </Box>


          {/* BRAND */}

          <Typography
            className="footer-name"
            sx={{
              fontSize: "11.5px",

              fontWeight: 700,

              color: "#275d53",

              transition:
                "color 0.25s ease, transform 0.25s ease",
            }}
          >
            Jeevan Dev
          </Typography>

        </Box>


        <Typography
          sx={{
            mt: "7px",

            ml: "40px",

            fontSize: "9px",

            color: "#9aa5a2",
          }}
        >
          © 2025 All rights reserved.
        </Typography>

      </Box>

    </Box>
  );


  /* =========================================================
     MOBILE DRAWER
  ========================================================= */

  return isMobile ? (
    <Drawer
      anchor="left"
      open={isMobileOpen}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",

          width: drawerWidth,

          border: "none",
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  ) : (

    /* =======================================================
       DESKTOP DRAWER
    ======================================================== */

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

          border: "none",

          borderRight:
            "1px solid #e6ecea",
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;