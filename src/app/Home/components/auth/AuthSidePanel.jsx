"use client";

import { useRouter } from "next/navigation";
import { Grid, Typography, Button } from "@mui/material";


export default function AuthSidePanel({ isSignup, onToggle }) {
    const router = useRouter();
  return (
    <Grid
      sx={{
        backgroundColor: "background.primary",
        color: "text.secondary",
        width: { xs: "100%", md: "50%" },
        p: { xs: 4, md: 5 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {!isSignup ? (
        <>
          <Typography variant="h4" fontWeight={700} mb={2} color="text.secondary">
            Hello, Friend!
          </Typography>
          <Typography variant="body1" mb={3} color="text.secondary">
            Create an account to explore and connect with our services.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
    onToggle();
    router.push("/Home/pages/Register");
  }}
            sx={{
              color: "text.secondary",
              borderColor: "border.secondary",
              borderRadius: 0.5,
              px: 4,
              py: 1,
              fontWeight: 600,
            }}
          >
            Sign Up
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h4" fontWeight={700} mb={2} color="text.secondary">
            Welcome Back
          </Typography>
          <Typography variant="body1" mb={3} color="text.secondary">
            To stay connected, please log in with your personal info.
          </Typography>
         <Button
  variant="outlined"
  onClick={() => {
    onToggle();
    router.push("/Home/pages/Login");
  }}
  sx={{
    color: "text.secondary",
    borderColor: "border.secondary",
    borderRadius: 0.5,
    px: 4,
    py: 1,
    fontWeight: 600,
  }}
>
  Log In
</Button>
        </>
      )}
    </Grid>
  );
}