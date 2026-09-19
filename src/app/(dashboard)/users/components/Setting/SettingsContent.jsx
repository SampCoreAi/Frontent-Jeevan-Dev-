"use client";
import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Divider,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SecurityIcon from "@mui/icons-material/Security";
import HelpIcon from "@mui/icons-material/Help";
import DevicesIcon from "@mui/icons-material/Devices";
import PaletteIcon from "@mui/icons-material/Palette";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const OutlineFancyButton = styled(Button)(({ active }) => ({
  border: active ? "2px solid #0d826f" : "none",
  width: 250,
  borderRadius: "6px",
  marginBottom: "12px",
  fontWeight: "bold",
  letterSpacing: "1px",
  textTransform: "uppercase",
  cursor: "pointer",
  color: active ? "#000000" : "#000",
  backgroundColor: active ? "#e6f6ed" : "transparent",
  transition: "all 300ms",
  fontSize: "14px",
  position: "relative",
  overflow: "hidden",
  justifyContent: "flex-start",

  "&:hover": {
    transform: "scale(1.02)",
    border: "2px solid #0d826f",
    backgroundColor: "#e6f6ed",
  },
}));

const menuItems = [
  { key: "account", label: "Account", icon: <AccountCircleIcon sx={{ width: 22, height: 22 }} /> },
  { key: "privacy", label: "Privacy & Security", icon: <SecurityIcon sx={{ width: 22, height: 22 }} /> },
  { key: "help", label: "Help & Support", icon: <HelpIcon sx={{ width: 22, height: 22 }} /> },
  { key: "device", label: "Device Login", icon: <DevicesIcon sx={{ width: 22, height: 22 }} /> },
  { key: "theme", label: "Theme", icon: <PaletteIcon sx={{ width: 22, height: 22 }} /> },
  { key: "prescription", label: "Prescription", icon: <LocalPharmacyIcon sx={{ width: 22, height: 22 }} /> },
];

const SettingsContent = () => {
  const [active, setActive] = useState("account");
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loginRedirectLoading, setLoginRedirectLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // ✅ New state for custom logout dialog
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleLogoutConfirm = () => {
    localStorage.clear();
    window.location.href = "/Home/pages/Login";
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



      setUserEmail(user.email);
    }
  }, []);

  const handleChangePassword = async () => {
    try {
      setChangePasswordLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOpenChangePassword(false);
      setOpenSuccessDialog(true);

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message || "Failed to change password",
        "error"
      );
    } finally {
      setChangePasswordLoading(false);
    }
  };


   const renderContent = () => {
    switch (active) {
      case "account":
        return (
          <>
            <Typography
              variant="h5"
              sx={{
                backgroundColor: "#e6f6ed",
                px: 2,
                py: 1,
                borderRadius: 1,
                fontWeight: 600,
              }}
              gutterBottom
            >
              Account Settings
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              {/* Change Password */}
              <Grid size={{ xs: 12 }}>
                <Card
                  sx={{
                    borderRadius: 1,
                    transition: "0.3s",
                    border: "1px solid #ffebee",
                    "&:hover": {
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Change Password
                      </Typography>

                      <Typography color="black">
                        Update your account password
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#0f7468",
                        borderRadius: 2,
                      }}
                      onClick={() => setOpenChangePassword(true)}
                    >
                      Change
                    </Button>

                    {/* CHANGE PASSWORD DIALOG */}
                    <Dialog
                      open={openChangePassword}
                      onClose={() => setOpenChangePassword(false)}
                      maxWidth="sm"
                      fullWidth
                    >
                      <DialogTitle>
                        Change Password
                      </DialogTitle>

                      <DialogContent>
                        <TextField
                          fullWidth
                          label="Email"
                          value={userEmail}
                          disabled
                          margin="normal"
                          sx={{
                            "& .MuiInputLabel-root": {
                              color: "#0f7468",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#0f7468",
                            },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#0f7468",
                              },
                              "&:hover fieldset": {
                                borderColor: "#0f7468",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#0f7468",
                              },
                            },
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "#000",
                            },
                          }}
                        />

                        <TextField
                          fullWidth
                          label="Old Password"
                          type="password"
                          value={oldPassword}
                          onChange={(e) =>
                            setOldPassword(e.target.value)
                          }
                          margin="normal"
                          sx={{
                            "& .MuiInputLabel-root": {
                              color: "#0f7468",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#0f7468",
                            },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#0f7468",
                              },
                              "&:hover fieldset": {
                                borderColor: "#0f7468",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#0f7468",
                              },
                            },
                            "& .MuiInputBase-input": {
                              color: "#000",
                            },
                          }}
                        />

                        <TextField
                          fullWidth
                          label="New Password"
                          type={
                            showNewPassword
                              ? "text"
                              : "password"
                          }
                          value={newPassword}
                          onChange={(e) =>
                            setNewPassword(e.target.value)
                          }
                          margin="normal"
                          error={
                            confirmPassword !== "" &&
                            newPassword !== confirmPassword
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() =>
                                    setShowNewPassword(
                                      !showNewPassword
                                    )
                                  }
                                  edge="end"
                                >
                                  {showNewPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiInputLabel-root": {
                              color: "#0f7468",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#0f7468",
                            },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#0f7468",
                              },
                              "&:hover fieldset": {
                                borderColor: "#0f7468",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#0f7468",
                              },
                            },
                          }}
                        />

                        <TextField
                          fullWidth
                          label="Confirm Password"
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          value={confirmPassword}
                          onChange={(e) =>
                            setConfirmPassword(e.target.value)
                          }
                          margin="normal"
                          error={
                            confirmPassword !== "" &&
                            newPassword !== confirmPassword
                          }
                          helperText={
                            confirmPassword !== "" &&
                            newPassword !== confirmPassword
                              ? "Passwords do not match"
                              : ""
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() =>
                                    setShowConfirmPassword(
                                      !showConfirmPassword
                                    )
                                  }
                                  edge="end"
                                >
                                  {showConfirmPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiInputLabel-root": {
                              color: "#0f7468",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#0f7468",
                            },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#0f7468",
                              },
                              "&:hover fieldset": {
                                borderColor: "#0f7468",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#0f7468",
                              },
                            },
                          }}
                        />
                      </DialogContent>

                      <DialogActions>
                        <Button
                          onClick={() =>
                            setOpenChangePassword(false)
                          }
                          sx={{ color: "black" }}
                        >
                          Cancel
                        </Button>

                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "#0f7468",
                            minWidth: "160px",
                          }}
                          onClick={handleChangePassword}
                          disabled={
                            changePasswordLoading ||
                            !oldPassword ||
                            !newPassword ||
                            !confirmPassword ||
                            newPassword !== confirmPassword
                          }
                        >
                          {changePasswordLoading ? (
                            <>
                              <CircularProgress
                                size={18}
                                sx={{
                                  mr: 1,
                                  color: "white",
                                }}
                              />
                              Changing...
                            </>
                          ) : (
                            "Change Password"
                          )}
                        </Button>
                      </DialogActions>
                    </Dialog>

                    {/* SUCCESS DIALOG */}
                    <Dialog
                      open={openSuccessDialog}
                      onClose={() =>
                        setOpenSuccessDialog(false)
                      }
                      maxWidth="xs"
                      fullWidth
                    >
                      <DialogTitle
                        sx={{
                          textAlign: "center",
                          color: "#0f7468",
                          fontWeight: 700,
                        }}
                      >
                        Password Changed Successfully
                      </DialogTitle>

                      <DialogContent>
                        <DialogContentText
                          sx={{
                            textAlign: "center",
                            color: "#000",
                          }}
                        >
                          Your password has been updated
                          successfully. Please login again with
                          your new password.
                        </DialogContentText>
                      </DialogContent>

                      <DialogActions
                        sx={{
                          justifyContent: "center",
                          pb: 3,
                          gap: 2,
                        }}
                      >
                        <Button
                          variant="outlined"
                          sx={{
                            borderColor: "#0f7468",
                            color: "#0f7468",
                          }}
                          onClick={() => {
                            setOpenSuccessDialog(false);
                          }}
                        >
                          Close
                        </Button>

                        <Button
                          variant="contained"
                          disabled={loginRedirectLoading}
                          sx={{
                            bgcolor: "#0f7468",
                            minWidth: "110px",
                          }}
                          onClick={() => {
                            setLoginRedirectLoading(true);

                            localStorage.clear();

                            window.location.href =
                              "/Home/pages/Login";
                          }}
                        >
                          {loginRedirectLoading ? (
                            <>
                              <CircularProgress
                                size={17}
                                sx={{
                                  color: "white",
                                  mr: 1,
                                }}
                              />
                              Loading...
                            </>
                          ) : (
                            "Login"
                          )}
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </CardContent>
                </Card>
              </Grid>

              {/* Logout */}
              <Grid size={{ xs: 12 }}>
                <Card
                  sx={{
                    borderRadius: 1,
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                    },
                    border: "1px solid #ffebee",
                    bgcolor: "#fff5f5",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        color="error"
                      >
                        Logout
                      </Typography>

                      <Typography color="black">
                        Sign out from this device
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      color="error"
                      onClick={() =>
                        setOpenLogoutDialog(true)
                      }
                    >
                      Logout
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* LOGOUT DIALOG */}
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        aria-labelledby="logout-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1.5,
          },
        }}
      >
        <DialogTitle
          id="logout-dialog-title"
          sx={{
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Confirm Logout
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            sx={{
              textAlign: "center",
              color: "#000000",
            }}
          >
            Are you sure you want to log out?
            All your session data will be cleared.
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            pb: 2,
          }}
        >
          <Button
            onClick={() =>
              setOpenLogoutDialog(false)
            }
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>

          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            sx={{
              backgroundColor: "red",
            }}
          >
            Log Out
          </Button>
        </DialogActions>
      </Dialog>

      <Grid
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: 1,
          mt: {
            xs: 7.5,
            md: 7.5,
          },
        }}
      >
        <Grid
          container
          spacing={2}
          mb={2}
          sx={{
            backgroundColor: "white",
            borderRadius: 0.5,
            minHeight: {
              xs: "auto",
              md: "570px",
            },
            boxShadow: "0 4px 12px #0f7468",
            overflow: "hidden",
            p: 2,
            pt: {
              xs: 5,
              md: 5,
            },
          }}
        >
          {/* LEFT MENU */}
          <Grid
            size={{
              xs: 12,
              md: 3,
            }}
            sx={{
              borderRight: {
                xs: "none",
                md: "2px solid #0f7468",
              },
              borderBottom: {
                xs: "2px solid #0f7468",
                md: "none",
              },
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {/* MOBILE SELECT */}
            <Box
              sx={{
                display: {
                  xs: "block",
                  md: "none",
                },
                px: 1,
                mb: 1,
              }}
            >
              <TextField
                select
                fullWidth
                size="small"
                variant="outlined"
                value={active}
                onChange={(e) =>
                  setActive(e.target.value)
                }
                SelectProps={{
                  native: true,
                }}
              >
                {menuItems.map((item) => (
                  <option
                    key={item.key}
                    value={item.key}
                  >
                    {item.label}
                  </option>
                ))}
              </TextField>
            </Box>

            {/* DESKTOP MENU */}
            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },
                flexDirection: "column",
                gap: 1,
                alignItems: "flex-start",
                px: 1,
              }}
            >
              {menuItems.map((button, index) => (
                <OutlineFancyButton
                  key={index}
                  fullWidth
                  active={
                    active === button.key ? 1 : 0
                  }
                  sx={{
                    width: 250,
                    marginRight: 3,
                    marginLeft: 2,
                  }}
                  onClick={() =>
                    setActive(button.key)
                  }
                  startIcon={button.icon}
                >
                  {button.label}
                </OutlineFancyButton>
              ))}
            </Box>
          </Grid>

          {/* RIGHT CONTENT */}
          <Grid
            size={{
              xs: 12,
              md: 9,
            }}
          >
            <Box
              sx={{
                bgcolor: "#fff",
                height: "100%",
                overflowY: "auto",
                pr: 2,
              }}
            >
              {renderContent()}
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbarOpen(false)
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() =>
            setSnackbarOpen(false)
          }
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            width: "100%",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SettingsContent;
