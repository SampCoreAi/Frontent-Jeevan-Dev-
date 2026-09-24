"use client";

import { useRouter } from "next/navigation";
import {
  Grid,
  Typography,
  Button,
} from "@mui/material";

export default function AuthSidePanel({
  isSignup,
}) {
  const router = useRouter();

  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    <Grid
      sx={{
        backgroundColor: "primary.main",
        color: "primary.contrastText",

        width: {
          xs: "100%",
          md: "50%",
        },

        p: {
          xs: 4,
          md: 5,
        },

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {!isSignup ? (
        <>
          <Typography
            variant="h4"
            fontWeight={700}
            mb={2}
            sx={{
              color: "primary.contrastText",
            }}
          >
            Hello, Friend!
          </Typography>

          <Typography
            variant="body1"
            mb={3}
            sx={{
              color: "primary.contrastText",
              opacity: 0.9,
              maxWidth: 400,
            }}
          >
            Create an account to explore and connect with our services.
          </Typography>

          <Button
            variant="outlined"
            onClick={() =>
              handleNavigate(
                "/Home/pages/Register"
              )
            }
            sx={{
              color: "primary.contrastText",
              borderColor:
                "primary.contrastText",
              borderRadius: 1,
              px: 4,
              py: 1,
              fontWeight: 600,

              "&:hover": {
                borderColor:
                  "primary.contrastText",
                backgroundColor:
                  "rgba(255,255,255,0.10)",
              },
            }}
          >
            Sign Up
          </Button>
        </>
      ) : (
        <>
          <Typography
            variant="h4"
            fontWeight={700}
            mb={2}
            sx={{
              color: "primary.contrastText",
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            variant="body1"
            mb={3}
            sx={{
              color: "primary.contrastText",
              opacity: 0.9,
              maxWidth: 400,
            }}
          >
            To stay connected, please log in with your personal info.
          </Typography>

          <Button
            variant="outlined"
            onClick={() =>
              handleNavigate(
                "/Home/pages/Login"
              )
            }
            sx={{
              color: "primary.contrastText",
              borderColor:
                "primary.contrastText",
              borderRadius: 1,
              px: 4,
              py: 1,
              fontWeight: 600,

              "&:hover": {
                borderColor:
                  "primary.contrastText",
                backgroundColor:
                  "rgba(255,255,255,0.10)",
              },
            }}
          >
            Log In
          </Button>
        </>
      )}
    </Grid>
  );
}