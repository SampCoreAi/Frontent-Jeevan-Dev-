"use client";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import UserPrivacySettings from "../../../component/Setting/UserPrivacySettings";
import UserHelpSupport from "../../../component/Setting/UserHelpSupport";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useColorMode } from "../../../../styles/theme";
const menuItems = [
  {
    key: "account",
    label: "Account",
    icon: <AccountCircleOutlinedIcon />,
  },
  {
    key: "privacy",
    label: "Privacy & Security",
    icon: <SecurityOutlinedIcon />,
  },
  {
    key: "help",
    label: "Help & Support",
    icon: <HelpOutlineOutlinedIcon />,
  },
  {
    key: "device",
    label: "Device Login",
    icon: <DevicesOutlinedIcon />,
  },
  {
    key: "theme",
    label: "Theme",
    icon: <PaletteOutlinedIcon />,
  },

];

const cardSx = {
  width: "100%",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: "10px",
  boxShadow: "none",
  bgcolor: "background.paper",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    borderColor: "rgba(15,116,104,0.3)",
    boxShadow: "0 4px 16px rgba(15,23,42,0.04)",
  },
};

const titleSx = {
  fontSize: "14px",
  fontWeight: 700,
  lineHeight: 1.3,
  color: "text.primary",
};

const descriptionSx = {
  mt: 0.5,
  fontSize: "12.5px",
  lineHeight: 1.5,
  color: "text.secondary",
};

const actionButtonSx = {
  height: 34,
  px: 1.8,
  borderRadius: "7px",
  fontSize: "12.5px",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "none",
};

const fieldSx = {
  "& .MuiInputLabel-root": {
    fontSize: "12.5px",
  },
  "& .MuiOutlinedInput-root": {
    height: 40,
    fontSize: "12.5px",
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "divider",
    },
    "&:hover fieldset": {
      borderColor: "primary.main",
    },
    "&.Mui-focused fieldset": {
      borderColor: "primary.main",
      borderWidth: "1px",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "12.5px",
  },
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "#475569",
  },
};

const SettingsContent = () => {
  const [active, setActive] = useState("account");
  const [userId, setUserId] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
    const { mode, setColorMode } = useColorMode();

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleLogoutConfirm = () => {
    setLogoutLoading(true);

    setTimeout(() => {
      localStorage.clear();
      window.location.href = "/Home/pages/Login";
    }, 300);
  };

  const showSnackbar = (message, severity = "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      const user = JSON.parse(userData);

      setUserId(user.id || user.userId || "");
      setUserEmail(user.email || "");
    }
  }, []);

  const handleClosePasswordDialog = () => {
    setOpenChangePassword(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showSnackbar("Please fill all password fields", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showSnackbar("New password and confirm password do not match", "error");
      return;
    }

    try {
      setPasswordLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      handleClosePasswordDialog();
      setOpenSuccessDialog(true);
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message || "Failed to change password",
        "error",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const changePasswordDialog = (
    <Dialog
      open={openChangePassword}
      onClose={handleClosePasswordDialog}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          width: { xs: "calc(100% - 32px)", sm: 390 },
          maxWidth: 390,
          m: 0,
          borderRadius: "12px",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 16px 40px rgba(15,23,42,0.12)",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.3,
          bgcolor: "#F8FAFC",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            flexShrink: 0,
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(15,116,104,0.08)",
            color: "primary.main",
          }}
        >
          <LockResetOutlinedIcon sx={{ fontSize: 19 }} />
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            Change Password
          </Typography>

          <Typography
            sx={{
              mt: 0.2,
              fontSize: "11.5px",
              color: "text.secondary",
            }}
          >
            Update your account password securely
          </Typography>
        </Box>
      </Box>

      <DialogContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.7,
          }}
        >
          <TextField
            fullWidth
            label="Old Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            size="small"
            sx={fieldSx}
          />

          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            size="small"
            sx={fieldSx}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            size="small"
            error={confirmPassword !== "" && newPassword !== confirmPassword}
            helperText={
              confirmPassword !== "" && newPassword !== confirmPassword
                ? "Passwords do not match"
                : ""
            }
            sx={fieldSx}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 2.5,
          pb: 2.5,
          pt: 0,
          gap: 1,
        }}
      >
        <Button
          onClick={handleClosePasswordDialog}
          variant="outlined"
          disabled={passwordLoading}
          sx={{
            ...actionButtonSx,
            color: "text.secondary",
            borderColor: "divider",
            "&:hover": {
              borderColor: "text.secondary",
              bgcolor: "#F8FAFC",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleChangePassword}
          disabled={passwordLoading}
          startIcon={
            passwordLoading ? (
              <CircularProgress size={15} color="inherit" />
            ) : null
          }
          sx={{
            ...actionButtonSx,
            minWidth: 125,
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          {passwordLoading ? "Saving..." : "Save Password"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderContent = () => {
    switch (active) {
      case "account":
        return (
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12 }}>
              <Card sx={cardSx}>
                <CardContent
                  sx={{
                    p: { xs: 2, sm: 2.2 },
                    "&:last-child": {
                      pb: { xs: 2, sm: 2.2 },
                    },
                    display: "flex",
                    alignItems: {
                      xs: "flex-start",
                      sm: "center",
                    },
                    justifyContent: "space-between",
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "9px",
                        bgcolor: "rgba(15,116,104,0.08)",
                        color: "primary.main",
                      }}
                    >
                      <LockResetOutlinedIcon sx={{ fontSize: 20 }} />
                    </Box>

                    <Box>
                      <Typography sx={titleSx}>Change Password</Typography>

                      <Typography sx={descriptionSx}>
                        Update your account password
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => setOpenChangePassword(true)}
                    sx={{
                      ...actionButtonSx,
                      width: {
                        xs: "100%",
                        sm: "auto",
                      },
                      minWidth: 90,
                      "&:hover": {
                        boxShadow: "none",
                      },
                    }}
                  >
                    Change
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Card
                sx={{
                  ...cardSx,
                  borderColor: "#FECACA",
                  bgcolor: "#FFFBFB",
                  "&:hover": {
                    borderColor: "#FCA5A5",
                    boxShadow: "0 4px 16px rgba(239,68,68,0.04)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: { xs: 2, sm: 2.2 },
                    "&:last-child": {
                      pb: { xs: 2, sm: 2.2 },
                    },
                    display: "flex",
                    alignItems: {
                      xs: "flex-start",
                      sm: "center",
                    },
                    justifyContent: "space-between",
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "9px",
                        bgcolor: "#FEF2F2",
                        color: "error.main",
                      }}
                    >
                      <LogoutOutlinedIcon sx={{ fontSize: 20 }} />
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          ...titleSx,
                          color: "error.main",
                        }}
                      >
                        Logout
                      </Typography>

                      <Typography sx={descriptionSx}>
                        Sign out from this device
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setOpenLogoutDialog(true)}
                    sx={{
                      ...actionButtonSx,
                      width: {
                        xs: "100%",
                        sm: "auto",
                      },
                      minWidth: 90,
                    }}
                  >
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {changePasswordDialog}

            <Dialog
              open={openSuccessDialog}
              onClose={() => setOpenSuccessDialog(false)}
              maxWidth="xs"
              fullWidth
              PaperProps={{
                sx: {
                  width: {
                    xs: "calc(100% - 32px)",
                    sm: 390,
                  },
                  m: 0,
                  borderRadius: "12px",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0 16px 40px rgba(15,23,42,0.12)",
                },
              }}
            >
              <DialogTitle
                sx={{
                  pt: 2.5,
                  pb: 1,
                  textAlign: "center",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "primary.main",
                }}
              >
                Password Changed Successfully
              </DialogTitle>

              <DialogContent sx={{ pb: 1 }}>
                <DialogContentText
                  sx={{
                    textAlign: "center",
                    fontSize: "12.5px",
                    lineHeight: 1.6,
                    color: "text.secondary",
                  }}
                >
                  Your password has been updated successfully. Please login
                  again with your new password.
                </DialogContentText>
              </DialogContent>

              <DialogActions
                sx={{
                  justifyContent: "center",
                  px: 2.5,
                  pb: 2.5,
                  gap: 1,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setOpenSuccessDialog(false)}
                  sx={{
                    ...actionButtonSx,
                    minWidth: 90,
                  }}
                >
                  Close
                </Button>

                <Button
                  variant="contained"
                  disabled={loginLoading}
                  onClick={() => {
                    setLoginLoading(true);

                    setTimeout(() => {
                      localStorage.clear();
                      window.location.href = "/Home/pages/Login";
                    }, 300);
                  }}
                  startIcon={
                    loginLoading ? (
                      <CircularProgress size={15} color="inherit" />
                    ) : null
                  }
                  sx={{
                    ...actionButtonSx,
                    minWidth: 90,
                  }}
                >
                  {loginLoading ? "Loading..." : "Login"}
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        );
     case "privacy":
  return (
    <UserPrivacySettings
      onViewPrivacyPolicy={() => {
      }}
    />
  );
    case "help":
  return (
    <UserHelpSupport
      onReportIssue={() => {
        // Report Issue page/dialog open karo
      }}
      onPrivacyHelp={() => {
        // Privacy help page/dialog open karo
      }}
    />
  );
      case "device":
        return (
          <Card sx={cardSx}>
            <CardContent
              sx={{
                p: { xs: 2, sm: 2.2 },
                "&:last-child": {
                  pb: { xs: 2, sm: 2.2 },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "9px",
                    bgcolor: "rgba(15,116,104,0.08)",
                    color: "primary.main",
                  }}
                >
                  <DevicesOutlinedIcon sx={{ fontSize: 20 }} />
                </Box>

                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <Typography sx={titleSx}>Current Session</Typography>

                  <Typography sx={descriptionSx}>This device</Typography>

                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.3,
                      borderRadius: "8px",
                      bgcolor: "#F8FAFC",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "11.5px",
                        lineHeight: 1.5,
                        color: "text.secondary",
                        wordBreak: "break-word",
                      }}
                    >
                      {typeof navigator !== "undefined"
                        ? navigator.userAgent
                        : "Current browser"}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setOpenLogoutDialog(true)}
                    sx={{
                      ...actionButtonSx,
                      mt: 1.5,
                    }}
                  >
                    Log out this device
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        );

      case "theme":
        return (
          <Card sx={cardSx}>
            <CardContent
              sx={{
                p: { xs: 2, sm: 2.2 },
                "&:last-child": {
                  pb: { xs: 2, sm: 2.2 },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "9px",
                    bgcolor: "rgba(15,116,104,0.08)",
                    color: "primary.main",
                  }}
                >
                  <PaletteOutlinedIcon sx={{ fontSize: 20 }} />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography sx={titleSx}>Appearance</Typography>

                  <Typography sx={descriptionSx}>
                    Choose the theme preference for this browser.
                  </Typography>

                  <Box
                    sx={{
                      mt: 1.7,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Button
  variant={mode === "light" ? "contained" : "outlined"}
  onClick={() => setColorMode("light")}
  sx={actionButtonSx}
>
  Light
</Button>

<Button
  variant={mode === "dark" ? "contained" : "outlined"}
  onClick={() => setColorMode("dark")}
  sx={actionButtonSx}
>
  Dark
</Button>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        );

    
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        aria-labelledby="logout-dialog-title"
   
        fullWidth
        PaperProps={{
          sx: {
            width: {
              xs: "calc(100% - 32px)",
              sm: 360,
            },
            m: 0,
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 16px 40px rgba(15,23,42,0.12)",
          },
        }}
      >
        <DialogTitle
          id="logout-dialog-title"
          sx={{
            pt: 2.5,
            pb: 0.8,
            textAlign: "center",
            fontSize: "15px",
            fontWeight: 700,
            color: "text.primary",
          }}
        >
          Logout
        </DialogTitle>

        <DialogContent sx={{ pb: 0.5 }}>
          <DialogContentText
            sx={{
              m: 0,
              textAlign: "center",
              fontSize: "12.5px",
              lineHeight: 1.6,
              color: "text.secondary",
            }}
          >
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 1,
            px: 2.5,
            pb: 2.5,
          }}
        >
          <Button
            onClick={() => setOpenLogoutDialog(false)}
            variant="outlined"
            sx={{
              ...actionButtonSx,
              minWidth: 90,
              color: "text.secondary",
              borderColor: "divider",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            color="error"
            disabled={logoutLoading}
            startIcon={
              logoutLoading ? (
                <CircularProgress size={15} color="inherit" />
              ) : null
            }
            sx={{
              ...actionButtonSx,
              minWidth: 100,
            }}
          >
            {logoutLoading ? "Logging out..." : "Log Out"}
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          width: "100%",
          pb: 3,

          backgroundColor: "white",
          height: "100vh",
          pt: "65px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            minHeight: { xs: "auto", md: 520 },
            bgcolor: "background.paper",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: { xs: 1, sm: 1.5 },
              borderBottom: "1px solid",
              borderColor: "divider",
              overflowX: "auto",
              pt:2,
              overflowY: "hidden",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "max-content",
                minWidth: { sm: "100%" },
              }}
            >
              {menuItems.map((button) => (
                <Button
                  key={button.key}
                  onClick={() => setActive(button.key)}
                  startIcon={React.cloneElement(button.icon, {
                    sx: {
                      fontSize: "18px !important",
                    },
                  })}
                  sx={{
                    position: "relative",
                    minWidth: "auto",
                    height: 48,
                    px: { xs: 1.4, sm: 1.8 },
                    borderRadius: 0,
                    whiteSpace: "nowrap",
                    textTransform: "none",
                    fontSize: "12.5px",
                    fontWeight: active === button.key ? 700 : 500,
                    color:
                      active === button.key ? "primary.main" : "text.secondary",
                    bgcolor: "transparent",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      left: 12,
                      right: 12,
                      bottom: 0,
                      height: 2,
                      borderRadius: "4px 4px 0 0",
                      bgcolor:
                        active === button.key ? "primary.main" : "transparent",
                    },
                    "&:hover": {
                      bgcolor: "rgba(15,116,104,0.04)",
                      color: "primary.main",
                    },
                  }}
                >
                  {button.label}
                </Button>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              p: { xs: 1.5, sm: 2, md: 2.5 },
              height: 620,
              overflowY: "auto",
            }}
          >
            {renderContent()}
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            width: "100%",
            fontSize: "12.5px",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SettingsContent;
