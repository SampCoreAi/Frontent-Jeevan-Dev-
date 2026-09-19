"use client";
import React, { useState } from "react";
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

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SecurityIcon from "@mui/icons-material/Security";
import HelpIcon from "@mui/icons-material/Help";
import DevicesIcon from "@mui/icons-material/Devices";
import PaletteIcon from "@mui/icons-material/Palette";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import { styled } from "@mui/material/styles";

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

  // ✅ New state for custom logout dialog
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleLogoutConfirm = () => {
    localStorage.clear();
    window.location.href = "/Home/pages/Login";
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
            <Card sx={{ mb: 2 }}>
              <CardContent
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                }}
              >
                <Box>
                  <Typography variant="h6">Log Out</Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#000",
                      wordBreak: "break-word",
                    }}
                  >
                    Sign out of your account on this device
                  </Typography>
                </Box>

                <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: "red",
                    }}
                    onClick={() => setOpenLogoutDialog(true)}
                  >
                    Log Out
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </>
        );

      // ... (no changes in other cases)
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
        PaperProps={{
          sx: { borderRadius: 2, p: 1.5 },
        }}
      >
        <DialogTitle id="logout-dialog-title" sx={{ fontWeight: 600, textAlign: "center" }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center", color: "#000000" }}>
            Are you sure you want to log out?
            All your session data will be cleared.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setOpenLogoutDialog(false)}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            sx={{ backgroundColor: "red" }}
          >
            Log Out
          </Button>
        </DialogActions>
      </Dialog>

      <Grid sx={{ flex: 1, display: "flex", flexDirection: "column", padding: 1, mt: { xs: 7.5, md: 7.5 },}}>
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
          {/* LEFT MENU */}
          <Grid
            size={{ xs: 12, md: 3 }}
            sx={{
              borderRight: { xs: "none", md: "2px solid #0f7468" },
              borderBottom: { xs: "2px solid #0f7468", md: "none" },
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
          <Box sx={{ display: { xs: "block", md: "none" }, px: 1, mb: 1 }}>
              <TextField
                select
                fullWidth
                size="small"
                variant="outlined"
                value={active}
                onChange={(e) => setActive(e.target.value)}
                SelectProps={{ native: true }}
              >
                {menuItems.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </TextField>
            </Box>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
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
                   active={active === button.key ? 1 : 0} 
                  sx={{ width: 250, marginRight: 3, marginLeft: 2 }}
                  onClick={() => setActive(button.key)}
                  startIcon={button.icon}
                >
                  {button.label}
                </OutlineFancyButton>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 9 }}>
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
    </>
  );
};

export default SettingsContent;
