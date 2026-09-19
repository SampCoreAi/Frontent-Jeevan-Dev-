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

  import AccountCircleIcon from "@mui/icons-material/AccountCircle";
  import SecurityIcon from "@mui/icons-material/Security";
  import HelpIcon from "@mui/icons-material/Help";
  import DevicesIcon from "@mui/icons-material/Devices";
  import PaletteIcon from "@mui/icons-material/Palette";
  import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
  import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
  import { styled } from "@mui/material/styles";

 const OutlineFancyButton = styled(Button)(({ active }) => ({
  border: active ? "2px solid #0d826f" : "2px solid transparent",
  width: "100%",
  justifyContent: "flex-start",
  borderRadius: 2,
  marginBottom: 10,
  fontWeight: 700,
  textTransform: "uppercase",
  background: active ? "#e6f6ed" : "transparent",
  color: "#000",

  "&:hover": {
    background: "#e6f6ed",
    borderColor: "#0d826f",
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
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");
const [snackbarSeverity, setSnackbarSeverity] = useState("error");
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

  const handleClosePasswordDialog = () => {
    setOpenChangePassword(false);
    setOldPassword("");
    setNewPassword("");
  };

  const handleChangePassword = async () => {
    try {
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

      handleClosePasswordDialog();
      setOpenSuccessDialog(true);
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message || "Failed to change password",
        "error"
      );
    }
  };
  

    const renderContent = () => {
      switch (active) {
        case "account":
          return (
            <>
              <Grid container spacing={3}>
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
                        flexWrap: "wrap",
                        gap: 2,
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

                      <Dialog
                        open={openChangePassword}
                        onClose={handleClosePasswordDialog}
                        maxWidth="xs"
                        fullWidth
                        PaperProps={{
                          sx: {
                            borderRadius: 3,
                            overflow: "hidden",
                            boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
                            width: "100%",
                            maxWidth: 360,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            background: "#f5f7f7",
                            color: "#1f2937",
                            px: 2.5,
                            py: 2,
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                            <Box
                              sx={{
                                width: 34,
                                height: 34,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#ecfdf5",
                                color: "#0f7468",
                              }}
                            >
                              <LockResetOutlinedIcon sx={{ fontSize: 18 }} />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
                              Change Password
                            </Typography>
                          </Box>
                        </Box>

                        <DialogContent sx={{ px: 2.5, py: 2.5 }}>
                          <Box sx={{ display: "grid", gap: 1.8 }}>
                            <TextField
                              fullWidth
                              label="Email"
                              value={userEmail}
                              disabled
                              margin="dense"
                              size="small"
                              sx={{
                                "& .MuiInputLabel-root": { color: "#0f7468" },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#0f7468" },
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": { borderColor: "rgba(15,116,104,0.25)" },
                                  "&:hover fieldset": { borderColor: "#0f7468" },
                                  "&.Mui-focused fieldset": { borderColor: "#0f7468" },
                                },
                                "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "#000" },
                                "& .MuiInputBase-root": { height: 42 },
                              }}
                            />

                            <TextField
                              fullWidth
                              label="Old Password"
                              type="password"
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              margin="dense"
                              size="small"
                              sx={{
                                "& .MuiInputLabel-root": { color: "#0f7468" },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#0f7468" },
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": { borderColor: "rgba(15,116,104,0.25)" },
                                  "&:hover fieldset": { borderColor: "#0f7468" },
                                  "&.Mui-focused fieldset": { borderColor: "#0f7468" },
                                },
                                "& .MuiInputBase-input": { color: "#000" },
                                "& .MuiInputBase-root": { height: 42 },
                              }}
                            />

                            <TextField
                              fullWidth
                              label="New Password"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              margin="dense"
                              size="small"
                              sx={{
                                "& .MuiInputLabel-root": { color: "#0f7468" },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#0f7468" },
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": { borderColor: "rgba(15,116,104,0.25)" },
                                  "&:hover fieldset": { borderColor: "#0f7468" },
                                  "&.Mui-focused fieldset": { borderColor: "#0f7468" },
                                },
                                "& .MuiInputBase-input": { color: "#000" },
                                "& .MuiInputBase-root": { height: 42 },
                              }}
                            />
                          </Box>
                        </DialogContent>

                        <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 0, justifyContent: "flex-end", gap: 1 }}>
                          <Button
                            onClick={handleClosePasswordDialog}
                            variant="text"
                            sx={{
                              color: "#374151",
                              borderRadius: 2,
                              px: 1.5,
                              textTransform: "none",
                            }}
                          >
                            Cancel
                          </Button>

                          <Button
                            variant="contained"
                            sx={{
                              bgcolor: "#0f7468",
                              borderRadius: 2,
                              px: 2,
                              textTransform: "none",
                              boxShadow: "none",
                              "&:hover": { bgcolor: "#0d665e", boxShadow: "none" },
                            }}
                            onClick={handleChangePassword}
                          >
                            Save
                          </Button>
                        </DialogActions>
                      </Dialog>

                      <Dialog
                        open={openSuccessDialog}
                        onClose={() => setOpenSuccessDialog(false)}
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
                            Your password has been updated successfully.
                            Please login again with your new password.
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
                            sx={{ bgcolor: "#0f7468" }}
                            onClick={() => {
                              localStorage.clear();
                              window.location.href = "/Home/pages/Register";
                            }}
                          >
                            Login
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </CardContent>
                  </Card>
                </Grid>

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
                        flexWrap: "wrap",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight={600} color="error">
                          Logout
                        </Typography>

                        <Typography color="black">
                          Sign out from this device
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => setOpenLogoutDialog(true)}
                      >
                        Logout
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          );

        case "privacy":
          return (
            <>
              <Card sx={{ border: "1px solid #e2e8f0", borderRadius: 1 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: "#123d36", fontWeight: 600 }}>
                    Account security
                  </Typography>
                  <Typography sx={{ color: "#64748b", mb: 2 }}>
                    Your password is protected by the backend authentication service.
                  </Typography>
                  <Button variant="contained" onClick={() => setOpenChangePassword(true)}>
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </>
          );

        case "help":
          return (
            <>
              <Card sx={{ border: "1px solid #e2e8f0", borderRadius: 1 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: "#123d36", fontWeight: 600 }}>
                    Need assistance?
                  </Typography>
                  <Typography sx={{ color: "#64748b", mb: 2 }}>
                    Contact the Jeevan support team for account, request or report issues.
                  </Typography>
                  <Button variant="outlined" href="mailto:support@jeevan.com">
                    Email Support
                  </Button>
                </CardContent>
              </Card>
            </>
          );

        case "device":
          return (
            <>
              <Card sx={{ border: "1px solid #e2e8f0", borderRadius: 1 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: "#123d36", fontWeight: 600 }}>
                    Current session
                  </Typography>
                  <Typography sx={{ color: "#64748b", mt: 1 }}>This device</Typography>
                  <Typography sx={{ color: "#1f2937", wordBreak: "break-word", mt: 1 }}>
                    {typeof navigator !== "undefined" ? navigator.userAgent : "Current browser"}
                  </Typography>
                  <Button sx={{ mt: 2 }} variant="outlined" color="error" onClick={() => setOpenLogoutDialog(true)}>
                    Log out this device
                  </Button>
                </CardContent>
              </Card>
            </>
          );

        case "theme":
          return (
            <>
              <Card sx={{ border: "1px solid #e2e8f0", borderRadius: 1 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: "#123d36", fontWeight: 600 }}>
                    Appearance
                  </Typography>
                  <Typography sx={{ color: "#64748b", mb: 2 }}>
                    Choose the theme preference for this browser.
                  </Typography>
                  <Button variant="contained" onClick={() => {
                    localStorage.setItem("theme", "light");
                    document.documentElement.dataset.theme = "light";
                  }}>
                    Light
                  </Button>
                  <Button variant="outlined" sx={{ ml: 1 }} onClick={() => {
                    localStorage.setItem("theme", "dark");
                    document.documentElement.dataset.theme = "dark";
                  }}>
                    Dark
                  </Button>
                </CardContent>
              </Card>
            </>
          );

        case "prescription":
          return (
            <>
              <Card sx={{ border: "1px solid #e2e8f0", borderRadius: 1 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: "#123d36", fontWeight: 600 }}>
                    Prescription access
                  </Typography>
                  <Typography sx={{ color: "#64748b", mb: 2 }}>
                    Prescription management is available for doctors and patients. Lab users can manage test requests and reports here.
                  </Typography>
                  <Button variant="outlined" onClick={() => {
                    window.location.href = "/doctor/pages/prescription";
                  }}>
                    Open Prescription
                  </Button>
                </CardContent>
              </Card>
            </>
          );

        default:
          return null;
      }
    };

    return (
      <>
        {/* ✅ Custom styled logout dialog */}
        <Dialog
          open={openLogoutDialog}
          onClose={() => setOpenLogoutDialog(false)}
          aria-labelledby="logout-dialog-title"
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              p: 1,
              width: { xs: "92%", sm: "auto" },
              minWidth: { xs: 280, sm: 320 },
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
              border: "1px solid rgba(15, 23, 42, 0.08)",
            },
          }}
        >
          <DialogTitle
            id="logout-dialog-title"
            sx={{
              px: 2,
              pt: 1.5,
              pb: 1,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            Logout
          </DialogTitle>
          <DialogContent sx={{ px: 2, pb: 0.5 }}>
            <DialogContentText sx={{ textAlign: "center", color: "text.secondary", m: 0, fontSize: 14, lineHeight: 1.6 }}>
              Are you sure you want to log out?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", gap: 1, px: 2, pb: 2, pt: 0 }}>
            <Button
              onClick={() => setOpenLogoutDialog(false)}
              variant="outlined"
              sx={{
                minWidth: 96,
                borderRadius: 1.5,
                textTransform: "none",
                fontWeight: 600,
                px: 1.5,
                py: 0.75,
                fontSize: 13,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogoutConfirm}
              variant="contained"
              color="error"
              sx={{
                minWidth: 96,
                borderRadius: 1.5,
                textTransform: "none",
                fontWeight: 600,
                px: 1.5,
                py: 0.75,
                fontSize: 13,
              }}
            >
              Log Out
            </Button>
          </DialogActions>
        </Dialog>

        <Grid sx={{ flex: 1, display: "flex", flexDirection: "column", padding: 1, mt: { xs: 7.5, md: 7.5 } }}>
          <Grid
            container
            spacing={2}
            mb={2}
            sx={{
              backgroundColor: "white",
              borderRadius: 0.5,
              minHeight: { xs: "auto", md: "570px" },
              boxShadow: "0 4px 12px #0f7468",
              overflow: "hidden",
              p: 2,
              pt: { xs: 5, md: 5 },
            }}
          >
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0,
                  mb: 2,
                  borderBottom: "1px solid #dbe7e3",
                  overflowX: "auto",
                }}
              >
                {menuItems.map((button) => (
                  <Button
                    key={button.key}
                    onClick={() => setActive(button.key)}
                    startIcon={button.icon}
                    sx={{
                      whiteSpace: "nowrap",
                      color: active === button.key ? "#0f7468" : "#4b5563",
                      fontWeight: active === button.key ? 700 : 500,
                      borderRadius: 0,
                      borderBottom: active === button.key ? "3px solid #0f7468" : "3px solid transparent",
                      minWidth: { xs: "auto", sm: 160 },
                      px: 2,
                      py: 1,
                      background: "transparent",
                      "&:hover": {
                        background: "transparent",
                        color: "#0f7468",
                      },
                    }}
                  >
                    {button.label}
                  </Button>
                ))}
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  bgcolor: "#fff",
                  minHeight: 320,
                  overflowY: "auto",
                  pr: { xs: 0, md: 1 },
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
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
>
  <Alert
    onClose={() => setSnackbarOpen(false)}
    severity={snackbarSeverity}
    variant="filled"
    sx={{ width: "100%" }}
  >
    {snackbarMessage}
  </Alert>
</Snackbar>
      </>
    );
  };

  export default SettingsContent;
