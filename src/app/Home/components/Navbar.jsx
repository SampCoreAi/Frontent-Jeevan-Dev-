
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
  Divider,
  useMediaQuery,
} from "@mui/material";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { keyframes } from "@mui/system";

export default function Navbar() {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);
  const [isMainFixed, setIsMainFixed] = useState(false);

  const marquee = keyframes`
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  `;

  const navLinks = [
    {
      label: "Home",
      path: "/Home/landingPage",
    },
    
    {
      label: "About",
      path: "/Home/pages/About",
    },
    {
      label: "FAQ",
      path: "/Home/pages/FAQ",
    },
    {
      label: "Contact",
      path: "/Home/pages/Contact",
    },
  ];

  const contactItems = [
    {
      icon: AccessTimeRoundedIcon,
      text: "24×7 Support",
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
      text: "Bhopal, Madhya Pradesh",
    },
  ];

  const handleNavigation = (path) => {
    setOpen(false);
    router.push(path);
  };

  const isActive = (path) => {
    if (path === "/Home/landingPage") {
      return pathname === path;
    }

    return pathname?.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsMainFixed(window.scrollY > 90);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
     
      <Box
        sx={{
          bgcolor: "#07876a",
          borderBottom: "1px solid",
          borderColor: "divider",
          px: {
            xs: 1.5,
            sm: 3,
            md: 5,
            lg: 7,
          },
          py: {
            xs: 0.7,
            sm: 0.9,
          },
          display: {
            xs: "none",
            sm: "flex",
          },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: {
              sm: 2,
              md: 3,
            },
          }}
        >
          {contactItems.slice(0, 2).map((item) => {
            const Icon = item.icon;

            return (
              <Box
                key={item.text}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.7,
                }}
              >
                <Icon
                  sx={{
                    fontSize: 16,
                    color: "white",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "white",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.text}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: {
              sm: 2,
              md: 3,
            },
          }}
        >
          {contactItems.slice(2).map((item) => {
            const Icon = item.icon;

            return (
              <Box
                key={item.text}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.7,
                }}
              >
                <Icon
                  sx={{
                    fontSize: 16, color: "white",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 500, color: "white",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.text}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {isMainFixed && (
        <Box
          sx={{
            height: {
              xs: 60,
              sm: 64,
            },
          }}
        />
      )}

      <AppBar
        position={isMainFixed ? "fixed" : "static"}
        elevation={0}
        sx={{
          top: 0,
          zIndex: theme.zIndex.appBar,
          bgcolor: "background.paper", color: "white",
          borderBottom: "1px solid",
          borderColor: "divider",
          boxShadow: isMainFixed
            ? "0 6px 24px rgba(15, 23, 42, 0.08)"
            : "none",
          transition: "box-shadow 0.25s ease",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: {
              xs: "60px !important",
              sm: "64px !important",
            },
            px: {
              xs: 1.5,
              sm: 3,
              md: 5,
              lg: 7,
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box
            onClick={() =>
              handleNavigation("/Home/landingPage")
            }
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Avatar
              src="/img/icon.png"
              alt="Jeevan Dev"
              variant="rounded"
              sx={{
                width: {
                  xs: 34,
                  sm: 38,
                },
                height: {
                  xs: 34,
                  sm: 38,
                },
                bgcolor: "transparent",
                borderRadius: 1.5,
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontSize: {
                    xs: "16px",
                    sm: "18px",
                  },
                  lineHeight: 1.1,
                  fontWeight: 800,
                  color: "primary.main",
                  letterSpacing: "-0.3px",
                }}
              >
                Jeevan Dev
              </Typography>

              <Typography
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                  mt: 0.2,
                  fontSize: "9.5px",
                  lineHeight: 1,
                  fontWeight: 500,
                  color: "text.secondary",
                  letterSpacing: "0.5px",
                }}
              >
                HEALTHCARE PLATFORM
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
              alignItems: "center",
              gap: 0.4,
              ml: "auto",
            }}
          >
            {navLinks.map((item) => {
              const active = isActive(item.path);

              return (
                <Button
                  key={item.label}
                  disableRipple
                  onClick={() =>
                    handleNavigation(item.path)
                  }
                  sx={{
                    minWidth: "auto",
                    position: "relative",
                    px: 1.5,
                    py: 1,
                    borderRadius: 1.5,
                    color: active
                      ? "primary.main"
                      : "text.secondary",
                    fontSize: "12.5px",
                    fontWeight: active ? 700 : 600,
                    textTransform: "none",
                    transition: "all 0.2s ease",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      left: "50%",
                      bottom: 4,
                      transform: "translateX(-50%)",
                      width: active ? "18px" : 0,
                      height: "2px",
                      borderRadius: "10px",
                      bgcolor: "primary.main",
                      transition: "width 0.2s ease",
                    },
                    "&:hover": {
                      bgcolor: "transparent",
                      color: "primary.main",
                      "&::after": {
                        width: "18px",
                      },
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
              alignItems: "center",
              gap: 1,
              ml: 1.5,
            }}
          >
            <Button
              variant="outlined"
              onClick={() =>
                handleNavigation("/Home/pages/Login")
              }
              sx={{
                height: 36,
                px: 2,
                borderRadius: 2,
                borderColor: "primary.main",
                color: "primary.main",
                fontSize: "12.5px",
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  borderColor: "primary.dark",
                  bgcolor: "secondary.light",
                  boxShadow: "none",
                },
              }}
            >
              Login
            </Button>

            <Button
              variant="contained"
              endIcon={
                <ArrowForwardRoundedIcon
                  sx={{
                    fontSize: "16px !important",
                  }}
                />
              }
              onClick={() =>
                handleNavigation(
                  "/Home/pages/AllDoctors"
                )
              }
              sx={{
                height: 36,
                px: 2,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                fontSize: "12.5px",
                fontWeight: 700,
                textTransform: "none",
                boxShadow:
                  "0 4px 12px rgba(7, 135, 106, 0.18)",
                "&:hover": {
                  bgcolor: "primary.dark",
                  boxShadow:
                    "0 6px 16px rgba(7, 135, 106, 0.24)",
                },
              }}
            >
              Find Doctor
            </Button>
          </Box>

          <IconButton
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            sx={{
              display: {
                xs: "flex",
                md: "none",
              },
              width: 38,
              height: 38,
              borderRadius: 2,
              bgcolor: "secondary.light",
              color: "primary.main",
              border: "1px solid",
              borderColor: "divider",
              "&:hover": {
                bgcolor: "secondary.light",
              },
            }}
          >
            <MenuRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: {
              xs: "88%",
              sm: 340,
            },
            maxWidth: 360,
            bgcolor: "background.paper",
            backgroundImage: "none",
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              minHeight: 64,
              px: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              onClick={() =>
                handleNavigation("/Home/landingPage")
              }
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
            >
              <Avatar
                src="/img/icon.png"
                alt="Jeevan Dev"
                variant="rounded"
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                }}
              />

              <Box>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 800,
                    color: "primary.main",
                    lineHeight: 1.1,
                  }}
                >
                  Jeevan Dev
                </Typography>

                <Typography
                  sx={{
                    mt: 0.3,
                    fontSize: "9px",
                    color: "text.secondary",
                    letterSpacing: "0.5px",
                  }}
                >
                  HEALTHCARE PLATFORM
                </Typography>
              </Box>
            </Box>

            <IconButton
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                color: "text.secondary",
                bgcolor: "background.default",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CloseRoundedIcon
                sx={{
                  fontSize: 20,
                }}
              />
            </IconButton>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
            }}
          >
            <Typography
              sx={{
                px: 1,
                mb: 1,
                fontSize: "10px",
                fontWeight: 700,
                color: "text.secondary",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
              }}
            >
              Navigation
            </Typography>

            <List
              disablePadding
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              {navLinks.map((item) => {
                const active = isActive(item.path);

                return (
                  <ListItemButton
                    key={item.label}
                    onClick={() =>
                      handleNavigation(item.path)
                    }
                    sx={{
                      minHeight: 44,
                      px: 1.5,
                      py: 0.8,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: active
                        ? "primary.light"
                        : "transparent",
                      bgcolor: active
                        ? "secondary.light"
                        : "transparent",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "background.default",
                        borderColor: "divider",
                        transform: "translateX(3px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 5,
                        height: 5,
                        mr: 1.5,
                        borderRadius: "50%",
                        bgcolor: active
                          ? "primary.main"
                          : "divider",
                      }}
                    />

                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: "13px",
                        fontWeight: active ? 700 : 600,
                        color: active
                          ? "primary.main"
                          : "text.primary",
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>

            <Divider
              sx={{
                my: 2,
              }}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={() =>
                  handleNavigation("/Home/pages/Login")
                }
                sx={{
                  height: 42,
                  borderRadius: 2,
                  borderColor: "primary.main",
                  color: "primary.main",
                  fontSize: "13px",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                Login
              </Button>

              <Button
                fullWidth
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() =>
                  handleNavigation(
                    "/Home/pages/AllDoctors"
                  )
                }
                sx={{
                  height: 42,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontSize: "13px",
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "primary.dark",
                    boxShadow: "none",
                  },
                }}
              >
                Find Doctor
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              p: 2,
              bgcolor: "background.default",
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              sx={{
                mb: 1.3,
                fontSize: "10px",
                fontWeight: 700,
                color: "text.secondary",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
              }}
            >
              Need Help?
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "secondary.light",
                }}
              >
                <LocalPhoneOutlinedIcon
                  sx={{
                    fontSize: 16,
                    color: "primary.main",
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: "10px",
                    color: "text.secondary",
                  }}
                >
                  24×7 Support
                </Typography>

                <Typography
                  sx={{
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  +91 8770753546
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "secondary.light",
                }}
              >
                <EmailOutlinedIcon
                  sx={{
                    fontSize: 16,
                    color: "primary.main",
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: "10px",
                    color: "text.secondary",
                  }}
                >
                  Email
                </Typography>

                <Typography
                  sx={{
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  contact@sampcoreai.com
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
