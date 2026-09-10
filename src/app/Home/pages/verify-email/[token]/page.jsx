"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";
import api from "../../../../../utils/axiosInstance";
export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token;

  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [message, setMessage] = useState("");


  useEffect(() => {
    if (token) {
 api.get("/api/auth/verify-email", {
  params: {
    token,
  },
})
        .then((res) => {
          setVerificationStatus("success");
          setMessage(res.data.message || "Email verified successfully!");
        })
        .catch((error) => {
          console.error("Axios error:", error);
          setVerificationStatus("error");
          setMessage(
            error.response?.data?.message ||
              "Verification failed. Please try again."
          );
        });
    } else {
      setVerificationStatus("error");
      setMessage("Invalid verification link. No token found.");
    }
  }, [token]);

  if (verificationStatus === "verifying") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#e4f9f7",
          p: 2,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            maxWidth: 470,
            textAlign: "center",
            borderRadius: 0.5,
            backgroundColor: "#ffffff",
          }}
        >
          <CircularProgress sx={{ color: "#028275", mb: 2 }} size={60} />
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{ color: "#028275", fontWeight: "700" }}
          >
            Verifying Your Email
          </Typography>
          <Typography variant="body1" sx={{ color: "#555555" }}>
            Please wait while we verify your email address...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (verificationStatus === "error") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffe4e4",
          p: 2,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            maxWidth: 470,
            textAlign: "center",
            borderRadius: 0.5,
            backgroundColor: "#ffffff",
          }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            {message}
          </Alert>
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{ color: "#d32f2f", fontWeight: "700" }}
          >
            Verification Failed
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "#555555" }}>
            There was an issue verifying your email. The link may have expired
            or is invalid.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => router.push("/")}
              startIcon={<HomeIcon />}
              sx={{
                borderColor: "#028275",
                color: "#028275",
                "&:hover": {
                  borderColor: "#026d66",
                  backgroundColor: "#e4f9f7",
                },
              }}
            >
              Go Home
            </Button>
            <Button
              variant="contained"
              onClick={() => router.push("/support")}
              sx={{
                backgroundColor: "#028275",
                "&:hover": { backgroundColor: "#026d66" },
              }}
            >
              Contact Support
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e4f9f7",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          maxWidth: 470,
          textAlign: "center",
          borderRadius: 0.5,
          backgroundColor: "#ffffff",
        }}
      >
        <CheckCircleOutlineIcon
          sx={{ fontSize: 64, mb: 2, color: "#028275" }}
        />
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: "#028275", fontWeight: "700" }}
        >
          Email Verified Successfully!
        </Typography>
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
        <Typography variant="body1" sx={{ mb: 3, color: "#555555" }}>
          Thank you for verifying your email address. Your account is now fully
          activated and you can access all features.
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => router.push("/")}
            startIcon={<HomeIcon />}
            sx={{
              borderColor: "#028275",
              color: "#028275",
              "&:hover": { borderColor: "#026d66", backgroundColor: "#e4f9f7" },
            }}
          >
            Go to Home
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push("/Home/pages/Login")}
            startIcon={<LoginIcon />}
            sx={{
              backgroundColor: "#028275",
              color: "#fff",
              fontWeight: "bold",
              textTransform: "none",
              padding: "12px 32px",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#026d66" },
            }}
          >
            LOG IN
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
