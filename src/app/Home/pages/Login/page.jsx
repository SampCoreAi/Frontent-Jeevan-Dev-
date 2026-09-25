"use client";

import { useState } from "react";
import { Box, Container, Grid, Snackbar, Alert } from "@mui/material";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AuthCard from "../../components/auth/AuthCard";
import AuthSidePanel from "../../components/auth/AuthSidePanel";
import LoginForm from "../../components/auth/LoginForm";
import ForgotPasswordDialog from "../../components/auth/ForgotPasswordDialog";



import { useRouter } from "next/navigation";
export default function LoginPage() {
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Grid sx={{ backgroundColor: "background.third", minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Grid container justifyContent="center" alignItems="center">
        <Grid
  sx={{
    width: "100%",
    maxWidth: 900,
    height: {
      xs: "auto",
      md: 550,
    },
    position: "relative",
    display: "flex",
    flexDirection: {
      xs: "column",
      md: "row",
    },
    borderRadius: 2,
    overflow: "hidden",
    boxShadow: "0 10px 35px rgba(15, 35, 30, 0.10)",
  }}
>
  <AuthSidePanel isSignup={false} />

  <AuthCard
    icon="/img/icon.png"
    title="Welcome Back!"
    subtitle="Enter your credentials to access your account"
  >
    <LoginForm
      onForgotPassword={() => setOpenForgotPassword(true)}
      showMessage={showMessage}
    />
  </AuthCard>
</Grid>
        </Grid>
      </Container>

      <Footer />

      <ForgotPasswordDialog
        open={openForgotPassword}
        onClose={() => setOpenForgotPassword(false)}
        showMessage={showMessage}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}