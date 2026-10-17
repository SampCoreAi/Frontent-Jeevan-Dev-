"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import api from "../../../../../utils/axiosInstance";

const primary = "#07876A";
const darkText = "#172033";

const pageSx = {
  backgroundColor: "#FFFFFF",
  backgroundImage: `
    linear-gradient(
      90deg,
      rgba(7, 135, 106, 0.13) 0%,
      rgba(7, 135, 106, 0.05) 25%,
      rgba(255, 255, 255, 0.35) 45%,
      rgba(255, 255, 255, 0.35) 55%,
      rgba(7, 135, 106, 0.05) 75%,
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
  backgroundSize: "100% 100%, 40px 40px, 40px 40px, 40px 40px",
  backgroundPosition: "center, 0 0, 0 0, 0 0",
  pt: { xs: 6, md: 2 },
  px: 2,
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  minHeight: { xs: "100vh", md: "90vh" },
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const cardSx = {
  width: "100%",
  maxWidth: 760,
  p: { xs: 3, sm: 5, md: 6 },
  textAlign: "center",
  borderRadius: 3,
  border: "1px solid rgba(7, 135, 106, 0.16)",
  backgroundColor: "#FFFFFF",
  boxShadow: "0 12px 36px rgba(23, 32, 51, 0.10)",
};

const buttonSx = {
  minHeight: 48,
  borderRadius: 2,
  px: 3,
  textTransform: "none",
  fontWeight: 700,
};

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token;

  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      api
        .get("/api/auth/verify-email", {
          params: { token },
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
              "Verification failed. Please try again.",
          );
        });
    } else {
      setVerificationStatus("error");
      setMessage("Invalid verification link. No token found.");
    }
  }, [token]);

  if (verificationStatus === "verifying") {
    return (
      <Box sx={pageSx}>
        <Paper sx={cardSx}>
          <CircularProgress size={56} sx={{ color: primary, mb: 2 }} />
          <Typography
            component="h1"
            variant="h5"
            sx={{ color: darkText, fontWeight: 700, mb: 1 }}
          >
            Verifying Your Email
          </Typography>
          <Typography sx={{ color: "#64748B" }}>
            Please wait while we verify your email address...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (verificationStatus === "error") {
    return (
      <Box sx={pageSx}>
        <Paper sx={cardSx}>
          <Typography
            component="h1"
            variant="h4"
            sx={{ color: "#C62828", fontWeight: 700, mb: 2 }}
          >
            Verification Failed
          </Typography>

          <Alert severity="error" sx={{ mb: 2, textAlign: "left" }}>
            {message}
          </Alert>

          <Typography sx={{ color: "#64748B", mb: 4 }}>
            The verification link may have expired or is invalid.
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
              startIcon={<HomeIcon />}
              onClick={() => router.push("/")}
              sx={{
                ...buttonSx,
                color: primary,
                borderColor: primary,
              }}
            >
              Go to Home
            </Button>

            <Button
              variant="contained"
              onClick={() => router.push("/support")}
              sx={{
                ...buttonSx,
                color: "#fff",
                backgroundColor: primary,
                "&:hover": { backgroundColor: "#066F58" },
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
    <Box sx={pageSx}>
      <Paper sx={cardSx}>
        <Typography
          sx={{
            textAlign: "left",
            color: primary,
            fontWeight: 800,
            fontSize: 20,
            mb: { xs: 4, sm: 3 },
          }}
        >
          Jeevan <Box component="span" sx={{ color: darkText }}>Dev</Box>
        </Typography>

        <CheckCircleOutlineIcon
          sx={{ fontSize: 76, color: primary, mb: 1 }}
        />

        <Typography
          sx={{
            color: primary,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 3,
            mb: 1,
          }}
        >
          ACCOUNT VERIFIED
        </Typography>

        <Typography
          component="h1"
          sx={{
            color: darkText,
            fontSize: { xs: 27, sm: 36 },
            lineHeight: 1.2,
            fontWeight: 800,
            mb: 1.5,
          }}
        >
          Email Verified Successfully!
        </Typography>

        <Typography
          sx={{
            color: "#526174",
            fontSize: { xs: 15, sm: 17 },
            mb: 3,
          }}
        >
          Your email is verified. Your account is ready to use.
        </Typography>

        <Box
          sx={{
            maxWidth: 500,
            mx: "auto",
            mb: 4,
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            textAlign: "left",
            borderRadius: 2,
            backgroundColor: "rgba(7, 135, 106, 0.07)",
          }}
        >
          <EmailOutlinedIcon sx={{ color: primary, fontSize: 28 }} />
          <Box>
            <Typography
              sx={{
                color: primary,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1.5,
              }}
            >
              VERIFICATION STATUS
            </Typography>
            <Typography sx={{ color: darkText, fontWeight: 600 }}>
              {message || "Email verified successfully!"}
            </Typography>
          </Box>
        </Box>

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
            startIcon={<HomeIcon />}
            onClick={() => router.push("/")}
            sx={{
              ...buttonSx,
              color: primary,
              borderColor: primary,
              "&:hover": {
                borderColor: primary,
                backgroundColor: "rgba(7, 135, 106, 0.05)",
              },
            }}
          >
            Go to Home
          </Button>

          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            onClick={() => router.push("/Home/pages/Login")}
            sx={{
              ...buttonSx,
              minWidth: 170,
              color: "#fff",
              backgroundColor: primary,
              "&:hover": { backgroundColor: "#066F58" },
            }}
          >
            LOG IN
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}