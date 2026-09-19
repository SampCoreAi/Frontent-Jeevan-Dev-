"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Avatar,
  Slide,
  Fade,
  Grow,
  useMediaQuery,
} from "@mui/material";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { keyframes } from "@mui/system";

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [loaded] = useState(true);
  const [isMainFixed, setIsMainFixed] = useState(false);

  const router = useRouter();
  const buttonRef = useRef(null);
  const mainRef = useRef(null);

  // =========================
  // ANIMATIONS
  // =========================

  const slideDown = keyframes`
    from {
      opacity: 0;
      transform: translateY(-20px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  const pulse = keyframes`
    0%, 100% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.05);
    }
  `;

  // =========================
  // NAVIGATION
  // =========================

  const navigateTo = (path) => {
    router.push(path);
  };

  const handleNavigation = (page) => {
    switch (page) {
      case "Home":
        navigateTo("/Home/landingPage");
        break;

      case "Doctors":
        navigateTo("/Home/pages/AllDoctors");
        break;

      case "About":
        navigateTo("/Home/pages/About");
        break;

      case "FAQ":
        navigateTo("/Home/pages/FAQ");
        break;

      case "Contact":
        navigateTo("/Home/pages/Contact");
        break;

      case "Login":
        navigateTo("/Home/pages/Login");
        break;

      default:
        navigateTo("/");
    }
  };

  const navLinks = [
    "Home",
    "Doctors",
    "About",
    "FAQ",
    "Contact",
    "Login",
  ];

  // =========================
  // DRAWER
  // =========================

  const toggleDrawer = (event, reason) => {
    if (
      reason === "backdropClick" ||
      reason === "escapeKeyDown"
    ) {
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }

    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const drawer = document.querySelector(".MuiDrawer-root");

    if (drawer && !open) {
      drawer.setAttribute("inert", "true");
    } else if (drawer) {
      drawer.removeAttribute("inert");
    }
  }, [open]);

  // =========================
  // STICKY NAVBAR
  // =========================

  useEffect(() => {
    const handleScroll = () => {
      setIsMainFixed(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* =========================================
          TOP ANNOUNCEMENT BAR
      ========================================= */}

      <Slide direction="down" in={loaded} timeout={600}>
        <Box
          sx={{
            backgroundColor: "secondary.light",
            color: "text.primary",

            overflow: "hidden",

            px: {
              xs: 1,
              sm: 4,
            },

            py: {
              xs: 0.4,
              sm: 0.5,
            },

            borderBottom: "1px solid",
            borderColor: "divider",

            display: "flex",
            alignItems: "center",

            position: "relative",

            fontWeight: 500,

            fontSize: {
              xs: "0.75rem",
              sm: "0.9rem",
            },

            letterSpacing: "0.3px",

            animation: `${slideDown} 0.6s ease-out`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              minWidth: "100%",

              animation: "scroll 15s linear infinite",

              "&:hover": {
                animationPlayState: "paused",
              },
            }}
          >
            {/* FIRST TEXT */}

            <Box
              component="span"
              sx={{
                flexShrink: 0,

                display: "inline-block",

                pr: {
                  xs: 4,
                  sm: 10,
                },

                wordSpacing: "10px",
              }}
            >
              Free surgery facility available under Ayushman Bharat
              Scheme and Pandit Deendayal Upadhyay Scheme.

              <span
                style={{
                  margin: "0 40px",
                  color: theme.palette.primary.main,
                }}
              >
                •
              </span>

              All TPA cards accepted.

              <span
                style={{
                  margin: "0 40px",
                  color: theme.palette.primary.main,
                }}
              >
                •
              </span>

              📞 7571905633
            </Box>

            {/* DUPLICATE FOR INFINITE SCROLL */}

            <Box
              component="span"
              sx={{
                flexShrink: 0,

                display: "inline-block",

                pr: {
                  xs: 4,
                  sm: 10,
                },

                wordSpacing: "10px",
              }}
            >
              Free surgery facility available under Ayushman Bharat
              Scheme and Pandit Deendayal Upadhyay Scheme.

              <span
                style={{
                  margin: "0 40px",
                  color: theme.palette.primary.main,
                }}
              >
                •
              </span>

              All TPA cards accepted.

              <span
                style={{
                  margin: "0 40px",
                  color: theme.palette.primary.main,
                }}
              >
                •
              </span>

              📞 7571905633
            </Box>
          </Box>

          <style>
            {`
              @keyframes scroll {
                0% {
                  transform: translateX(0);
                }

                100% {
                  transform: translateX(-50%);
                }
              }
            `}
          </style>
        </Box>
      </Slide>

      {/* =========================================
          CONTACT INFORMATION BAR
      ========================================= */}

      <Fade
        in={loaded}
        timeout={800}
        style={{
          transitionDelay: "200ms",
        }}
      >
        <Box
          sx={{
            backgroundColor: "background.paper",

            px: {
              xs: 1,
              sm: 4,
              md: 10,
              lg: 5,
            },

            py: {
              xs: 0.8,
              sm: 1.5,
            },

            display: "flex",

            flexDirection: "row",

            alignItems: "center",

            justifyContent: {
              xs: "flex-start",
              sm: "space-between",
            },

            gap: {
              xs: 2,
              sm: 1.5,
            },

            overflowX: "auto",

            flexWrap: {
              xs: "nowrap",
              sm: "wrap",
            },

            scrollbarWidth: "none",

            "&::-webkit-scrollbar": {
              display: "none",
            },

            borderBottom: "1px solid",
            borderColor: "divider",

            animation: `${slideDown} 0.8s ease-out 0.2s both`,
          }}
        >
          {[
            {
              icon: LocalPhoneOutlinedIcon,
              text: "24x7 Support",
            },

            {
              icon: LocalPhoneOutlinedIcon,
              text: "+91 8770753546",
            },

            {
              icon: EmailOutlinedIcon,
              text: "support@mail.com",
            },

            {
              icon: LocationOnOutlinedIcon,
              text: "123, Your Street",
            },
          ].map((item, index) => (
            <Grow
              key={index}
              in={loaded}
              timeout={500}
              style={{
                transitionDelay: `${300 + index * 100}ms`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",

                  gap: 0.7,

                  flexShrink: 0,

                  transition: "all 0.3s ease",

                  "&:hover": {
                    transform: "translateY(-2px)",
                  },

                  "&:hover .contact-icon": {
                    color: "primary.dark",
                    transform: "scale(1.1)",
                  },

                  "&:hover .contact-text": {
                    color: "primary.main",
                  },
                }}
              >
                <item.icon
                  className="contact-icon"
                  sx={{
                    color: "primary.main",

                    fontSize: {
                      xs: 16,
                      sm: 20,
                    },

                    transition: "all 0.3s ease",
                  }}
                />

                <Typography
                  className="contact-text"
                  sx={{
                    color: "text.secondary",

                    fontSize: {
                      xs: "0.75rem",
                      sm: "0.9rem",
                      md: "1rem",
                    },

                    whiteSpace: "nowrap",

                    transition: "color 0.3s ease",
                  }}
                >
                  {item.text}
                </Typography>
              </Box>
            </Grow>
          ))}
        </Box>
      </Fade>

      {/* =========================================
          MAIN NAVBAR
      ========================================= */}

      <Slide
        direction="down"
        in={loaded}
        timeout={600}
        style={{
          transitionDelay: "400ms",
        }}
      >
        <AppBar
          ref={mainRef}
          sx={{
            position: isMainFixed ? "fixed" : "static",

            top: 0,

            backgroundColor: "primary.main",

            color: "primary.contrastText",

            zIndex: 1300,

            px: {
              xs: 1,
              sm: 4,
              md: 10,
              lg: 1,
            },

            transition:
              "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",

            boxShadow: isMainFixed
              ? "0 4px 20px rgba(7, 135, 106, 0.20)"
              : "none",

            animation: isMainFixed
              ? `${slideDown} 0.4s ease-out`
              : "none",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",

              justifyContent: "space-between",

              flexWrap: "wrap",

              minHeight: {
                xs: "56px",
                sm: "64px",
              },

              px: {
                xs: 0,
                sm: 2,
              },
            }}
          >
            {/* =========================
                LOGO
            ========================= */}

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: 1,

                transition: "transform 0.3s ease",

                cursor: "pointer",

                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
              onClick={() =>
                handleNavigation("Home")
              }
            >
              <Avatar
                src="/img/icon.png"
                alt="Logo"
                sx={{
                  width: {
                    xs: 32,
                    sm: 40,
                  },

                  height: {
                    xs: 32,
                    sm: 40,
                  },

                  backgroundColor: "background.paper",

                  transition: "all 0.3s ease",

                  animation: `${pulse} 2s ease-in-out infinite`,

                  "&:hover": {
                    transform:
                      "rotate(5deg) scale(1.1)",

                    boxShadow:
                      "0 4px 12px rgba(0,0,0,0.15)",
                  },
                }}
              />

              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  fontSize: {
                    xs: "0.9rem",
                    sm: "1.25rem",
                  },

                  color: "primary.contrastText",

                  transition: "all 0.3s ease",

                  "&:hover": {
                    opacity: 0.9,
                  },
                }}
              >
                Jeenvan Dev
              </Typography>
            </Box>

            {/* =========================
                DESKTOP MENU
            ========================= */}

            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },

                gap: 1,

                alignItems: "center",

                flexWrap: "wrap",
              }}
            >
              {navLinks.map((link, index) => (
                <Grow
                  key={link}
                  in={loaded}
                  timeout={400}
                  style={{
                    transitionDelay: `${
                      500 + index * 100
                    }ms`,
                  }}
                >
                  <Button
                    color="inherit"
                    sx={{
                      fontSize: {
                        xs: "0.75rem",
                        sm: "0.875rem",
                      },

                      color:
                        "primary.contrastText",

                      position: "relative",

                      overflow: "hidden",

                      px: 1.5,

                      transition: "all 0.3s ease",

                      "&::after": {
                        content: '""',

                        position: "absolute",

                        bottom: 3,

                        left: "50%",

                        width: 0,

                        height: "2px",

                        borderRadius: "10px",

                        backgroundColor:
                          "primary.contrastText",

                        transition:
                          "all 0.3s ease",

                        transform:
                          "translateX(-50%)",
                      },

                      "&:hover": {
                        transform:
                          "translateY(-2px)",

                        backgroundColor:
                          "rgba(255,255,255,0.08)",

                        "&::after": {
                          width: "70%",
                        },
                      },
                    }}
                    onClick={() =>
                      handleNavigation(link)
                    }
                  >
                    {link}
                  </Button>
                </Grow>
              ))}
            </Box>

            {/* =========================
                MOBILE MENU ICON
            ========================= */}

            <IconButton
              ref={buttonRef}
              edge="end"
              onClick={toggleDrawer}
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },

                color: "primary.contrastText",

                transition: "all 0.3s ease",

                transform: open
                  ? "rotate(90deg)"
                  : "rotate(0deg)",

                "&:hover": {
                  backgroundColor:
                    "rgba(255,255,255,0.10)",

                  transform: open
                    ? "rotate(90deg) scale(1.1)"
                    : "scale(1.1)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Slide>

      {/* =========================================
          MOBILE DRAWER
      ========================================= */}

      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true,
          disableRestoreFocus: true,
          disableAutoFocus: true,
        }}
        PaperProps={{
          sx: {
            top: 0,

            height: "100%",

            width: isMobile
              ? "80%"
              : 300,

            maxWidth: 300,

            backgroundColor:
              "background.paper",

            transition:
              "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          },
        }}
        SlideProps={{
          timeout: 400,

          easing: {
            enter:
              "cubic-bezier(0.4, 0, 0.2, 1)",

            exit:
              "cubic-bezier(0.4, 0, 0.2, 1)",
          },
        }}
      >
        <Box
          sx={{
            p: 0,

            height: "100%",

            display: "flex",

            flexDirection: "column",
          }}
        >
          {/* =========================
              DRAWER HEADER
          ========================= */}

          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              justifyContent:
                "space-between",

              p: 2,

              borderBottom: "1px solid",

              borderColor: "divider",

              backgroundColor:
                "secondary.light",
            }}
          >
            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: 1.5,
              }}
            >
              <Avatar
                src="/img/icon.png"
                sx={{
                  width: 36,
                  height: 36,
                }}
              />

              <Typography
                fontWeight="bold"
                color="text.primary"
                fontSize="1rem"
              >
                Jeenvan Dev
              </Typography>
            </Box>
          </Box>

          {/* =========================
              DRAWER NAVIGATION
          ========================= */}

          <List
            sx={{
              p: 2,
              flex: 1,
            }}
          >
            {navLinks.map(
              (text, index) => (
                <Slide
                  key={text}
                  direction="right"
                  in={open}
                  timeout={400}
                  style={{
                    transitionDelay: `${
                      index * 75
                    }ms`,
                  }}
                >
                  <ListItemButton
                    sx={{
                      borderRadius: 2,

                      mb: 1,

                      py: 1.5,

                      backgroundColor:
                        "background.default",

                      border:
                        "1px solid transparent",

                      transition:
                        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

                      "&:hover": {
                        transform:
                          "translateX(6px)",

                        backgroundColor:
                          "secondary.light",

                        borderColor:
                          "primary.light",

                        "& .MuiListItemText-primary":
                          {
                            color:
                              "primary.main",
                          },
                      },
                    }}
                    onClick={() => {
                      toggleDrawer();

                      handleNavigation(text);
                    }}
                  >
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{
                        fontSize: "1rem",

                        fontWeight: 500,

                        color:
                          "text.primary",

                        transition:
                          "color 0.2s ease",
                      }}
                    />
                  </ListItemButton>
                </Slide>
              )
            )}
          </List>

          {/* =========================
              DRAWER CONTACT FOOTER
          ========================= */}

          <Box
            sx={{
              p: 2,

              borderTop: "1px solid",

              borderColor: "divider",

              backgroundColor:
                "background.default",
            }}
          >
            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: 1,

                mb: 1.5,
              }}
            >
              <LocalPhoneOutlinedIcon
                sx={{
                  fontSize: 18,
                  color: "primary.main",
                }}
              />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                7571905633
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: 1,
              }}
            >
              <EmailOutlinedIcon
                sx={{
                  fontSize: 18,
                  color: "primary.main",
                }}
              />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                contact@sampcoreai.com
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}