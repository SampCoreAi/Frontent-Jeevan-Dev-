"use client";

import { useState } from "react";
import {
  Grid,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
import Footer from "../../components/Footer";
import AuthCard from "../../components/auth/AuthCard";
import AuthSidePanel from "../../components/auth/AuthSidePanel";
import RegisterForm from "../../components/auth/RegisterForm";

export default function RegisterPage() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const router = useRouter();

  const showMessage = (
    message,
    severity = "success"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleRegisterSuccess = (message) => {
    showMessage(
      message ||
        "Registration successful. Please check your email.",
      "success"
    );

    setTimeout(() => {
      router.push("/Home/pages/Login");
    }, 2000);
  };

  return (
    <Grid
      sx={{
        backgroundColor: "background.third",
        minHeight: "100vh",
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
              maxWidth: 850,

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

              borderRadius: 0.5,
              overflow: "hidden",

              boxShadow:
                "0 8px 20px rgba(0,0,0,0.15)",
            }}
          >
           <AuthSidePanel isSignup={true} />
            <AuthCard icon="/img/icon.png">
              <RegisterForm
                showMessage={showMessage}
                onSuccess={
                  handleRegisterSuccess
                }
              />
            </AuthCard>
          </Grid>
        </Grid>
      </Container>

      <Footer />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}