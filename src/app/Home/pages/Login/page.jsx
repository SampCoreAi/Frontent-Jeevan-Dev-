"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Snackbar,
  Alert,
  Typography,
  IconButton,
} from "@mui/material";

import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AuthCard from "../../components/auth/AuthCard";
import AuthSidePanel from "../../components/auth/AuthSidePanel";
import LoginForm from "../../components/auth/LoginForm";
import ForgotPasswordDialog from "../../components/auth/ForgotPasswordDialog";

export default function LoginPage() {
  const [openForgotPassword, setOpenForgotPassword] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;

    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const notificationConfig = {
    success: {
      icon: CheckCircleOutlineRoundedIcon,
      color: "#07876A",
      background: "#F0FDF9",
      border: "#CDEFE5",
    },

    error: {
      icon: ErrorOutlineRoundedIcon,
      color: "#D92D20",
      background: "#FFF6F5",
      border: "#F8D7D4",
    },

    warning: {
      icon: WarningAmberRoundedIcon,
      color: "#DC7A00",
      background: "#FFFAEB",
      border: "#FBE6B1",
    },

    info: {
      icon: InfoOutlinedIcon,
      color: "#2563EB",
      background: "#F5F8FF",
      border: "#D9E4FF",
    },
  };

  const currentNotification =
    notificationConfig[snackbar.severity] ||
    notificationConfig.info;

  const NotificationIcon = currentNotification.icon;

  return (
   <Grid
  sx={{
    minHeight: "100vh",
    backgroundColor: "#FFFFFF",

    backgroundImage: `
      linear-gradient(
        90deg,
        rgba(7, 135, 106, 0.13) 0%,
        rgba(7, 135, 106, 0.04) 25%,
        rgba(255, 255, 255, 0.96) 45%,
        rgba(255, 255, 255, 0.96) 55%,
        rgba(7, 135, 106, 0.04) 75%,
        rgba(7, 135, 106, 0.13) 100%
      ),

      linear-gradient(
        135deg,
        rgba(7, 135, 106, 0.09) 0%,
        rgba(52, 211, 153, 0.035) 45%,
        rgba(255, 255, 255, 0.08) 100%
      ),

      linear-gradient(
        rgba(7, 135, 106, 0.10) 1px,
        transparent 1px
      ),

      linear-gradient(
        90deg,
        rgba(7, 135, 106, 0.10) 1px,
        transparent 1px
      )
    `,

    backgroundSize: `
      100% 100%,
      40px 40px,
      40px 40px,
      40px 40px
    `,

    backgroundPosition: `
      center,
      0 0,
      0 0,
      0 0
    `,

    backgroundAttachment: "fixed",
  }}
>
      <Navbar />

      <Container
        maxWidth="md"
        sx={{
          mt: 4,
          mb: 4,
        }}
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
        >
          <Grid
            sx={{
              width: "100%",
              maxWidth: 900,

              height: {
                xs: "auto",
                md: 500,
              },

              position: "relative",

              display: "flex",

              flexDirection: {
                xs: "column",
                md: "row",
              },

              borderRadius: 2,

              overflow: "hidden",

              boxShadow:
                "0 10px 35px rgba(15, 35, 30, 0.10)",
            }}
          >
            <AuthSidePanel isSignup={false} />

            <AuthCard
              icon="/img/icon.png"
              title="Welcome Back!"
              subtitle="Enter your credentials to access your account"
            >
              <LoginForm
                onForgotPassword={() =>
                  setOpenForgotPassword(true)
                }
                showMessage={showMessage}
              />
            </AuthCard>
          </Grid>
        </Grid>
      </Container>

      <Footer />

      <ForgotPasswordDialog
        open={openForgotPassword}
        onClose={() =>
          setOpenForgotPassword(false)
        }
        showMessage={showMessage}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          mt: {
            xs: 1,
            md: 1.5,
          },
        }}
      >
        <Alert
          severity={snackbar.severity}
          icon={false}
          onClose={handleCloseSnackbar}
          sx={{
            p: 0,

            minWidth: {
              xs: "calc(100vw - 32px)",
              sm: "340px",
            },

            maxWidth: {
              xs: "calc(100vw - 32px)",
              sm: "460px",
            },

            backgroundColor:
              currentNotification.background,

            color: "#172033",

            border: `1px solid ${currentNotification.border}`,

            borderRadius: "12px",

            boxShadow:
              "0 10px 35px rgba(15, 23, 42, 0.12)",

            overflow: "hidden",

            "& .MuiAlert-message": {
              width: "100%",
              padding: 0,
            },

            "& .MuiAlert-action": {
              display: "none",
            },
          }}
        >
          <Box
            sx={{
              minHeight: "58px",

              px: 1.8,

              display: "flex",
              alignItems: "center",

              gap: 1.3,
            }}
          >
            <Box
              sx={{
                width: "34px",
                height: "34px",

                flexShrink: 0,

                borderRadius: "9px",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                backgroundColor: "#FFFFFF",

                border: `1px solid ${currentNotification.border}`,
              }}
            >
              <NotificationIcon
                sx={{
                  fontSize: "20px",
                  color: currentNotification.color,
                }}
              />
            </Box>

            <Typography
              sx={{
                flex: 1,

                fontSize: "13px",

                fontWeight: 500,

                lineHeight: 1.4,

                color: "#344054",
              }}
            >
              {snackbar.message}
            </Typography>

            <IconButton
              size="small"
              onClick={handleCloseSnackbar}
              sx={{
                width: "30px",
                height: "30px",

                flexShrink: 0,

                color: "#667085",

                "&:hover": {
                  backgroundColor:
                    "rgba(15, 23, 42, 0.05)",

                  color: "#172033",
                },
              }}
            >
              <CloseRoundedIcon
                sx={{
                  fontSize: "18px",
                }}
              />
            </IconButton>
          </Box>

          <Box
            sx={{
              height: "2px",
              width: "100%",
              backgroundColor:
                currentNotification.color,
              opacity: 0.75,
            }}
          />
        </Alert>
      </Snackbar>
    </Grid>
  );
}