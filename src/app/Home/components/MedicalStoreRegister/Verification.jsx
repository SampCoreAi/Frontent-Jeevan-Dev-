"use client";

import * as React from "react";

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

/* =========================================================
   COLORS
========================================================= */

const C = {
  primary: "#07876A",
  hover: "#066F58",
  light: "#EAF7F3",

  text: "#172033",
  muted: "#74807B",

  border: "#DDE9E5",
  input: "#CBD5E1",

  error: "#E5484D",
  white: "#FFFFFF",
};

/* =========================================================
   COMPONENT
========================================================= */

export default function Verification({
  data = {},

  // Connect these with your API
  onSendOtp,
  onVerifyOtp,

  onBack,
  onSubmit,

  loading = false,
}) {
  const [otp, setOtp] = React.useState("");

  const [otpSent, setOtpSent] =
    React.useState(false);

  const [emailVerified, setEmailVerified] =
    React.useState(false);

  const [sendingOtp, setSendingOtp] =
    React.useState(false);

  const [verifyingOtp, setVerifyingOtp] =
    React.useState(false);

  const [declaration, setDeclaration] =
    React.useState(false);

  const [error, setError] =
    React.useState("");

  const otpRefs = React.useRef([]);

  /* =========================================================
     EMAIL
  ========================================================= */

  const email = data?.email || "";

  /* =========================================================
     SEND OTP
  ========================================================= */

  const handleSendOtp = async () => {
    if (!email) {
      setError(
        "Registered email address is not available."
      );
      return;
    }

    try {
      setError("");
      setSendingOtp(true);

      /*
       * Your parent component/API function should receive:
       *
       * {
       *   email: "example@gmail.com"
       * }
       */

      if (onSendOtp) {
        await onSendOtp({
          email,
        });
      }

      setOtpSent(true);

      // Clear old OTP when resending
      setOtp("");

      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      console.error("Send OTP error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to send verification code."
      );
    } finally {
      setSendingOtp(false);
    }
  };

  /* =========================================================
     OTP CHANGE
  ========================================================= */

  const handleOtpChange = (
    index,
    value
  ) => {
    const digit = value
      .replace(/\D/g, "")
      .slice(-1);

    const otpArray = Array.from(
      { length: 6 },
      (_, i) => otp[i] || ""
    );

    otpArray[index] = digit;

    const newOtp = otpArray.join("");

    setOtp(newOtp);

    setError("");

    /* NEXT INPUT */

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  /* =========================================================
     BACKSPACE
  ========================================================= */

  const handleOtpKeyDown = (
    index,
    event
  ) => {
    if (event.key !== "Backspace") return;

    if (!otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  /* =========================================================
     PASTE OTP
  ========================================================= */

  const handleOtpPaste = (event) => {
    event.preventDefault();

    const pastedOtp = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedOtp) return;

    setOtp(pastedOtp);

    setError("");

    const lastIndex = Math.min(
      pastedOtp.length - 1,
      5
    );

    setTimeout(() => {
      otpRefs.current[lastIndex]?.focus();
    }, 0);
  };

  /* =========================================================
     VERIFY OTP
  ========================================================= */

  const handleVerifyOtp = async () => {
    if (!otpSent) {
      setError(
        "Please send the verification code first."
      );
      return;
    }

    if (otp.length !== 6) {
      setError(
        "Please enter the complete 6-digit verification code."
      );
      return;
    }

    try {
      setError("");
      setVerifyingOtp(true);

      /*
       * Your parent component/API function should receive:
       *
       * {
       *   email: "example@gmail.com",
       *   otp: "123456"
       * }
       */

      if (onVerifyOtp) {
        await onVerifyOtp({
          email,
          otp,
        });
      }

      setEmailVerified(true);
    } catch (err) {
      console.error(
        "Verify OTP error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid or expired verification code."
      );
    } finally {
      setVerifyingOtp(false);
    }
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = () => {
    if (!emailVerified) {
      setError(
        "Please verify your email address before submitting."
      );
      return;
    }

    if (!declaration) {
      setError(
        "Please accept the declaration before submitting."
      );
      return;
    }

    setError("");

    onSubmit?.();
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <Box>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Stack
        direction="row"
        spacing={1.2}
        alignItems="center"
      >
        <Box
          sx={{
            width: 32,
            height: 32,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            flexShrink: 0,

            color: C.primary,
          }}
        >
          <GppGoodOutlinedIcon
            sx={{
              fontSize: 25,
            }}
          />
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 750,
              color: C.text,
              lineHeight: 1.3,
            }}
          >
            Verification & Declaration
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: "10.5px",
              color: C.muted,
            }}
          >
            Verify your email and confirm the
            declaration to submit your registration.
          </Typography>
        </Box>
      </Stack>

      {/* =====================================================
          EMAIL VERIFICATION
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          mt: 2,

          p: {
            xs: 1.5,
            md: 2,
          },

          border: `1px solid ${C.border}`,
          borderRadius: "10px",

          bgcolor: C.white,
        }}
      >
        {/* EMAIL HEADER */}

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            mb: 1.5,
          }}
        >
          <MarkEmailReadOutlinedIcon
            sx={{
              color: C.primary,
              fontSize: 19,
            }}
          />

          <Box>
            <Typography
              sx={{
                fontSize: "12.5px",
                fontWeight: 700,
                color: C.text,
              }}
            >
              Email Verification
            </Typography>

            <Typography
              sx={{
                fontSize: "10px",
                color: C.muted,
              }}
            >
              We&apos;ll send a 6-digit verification
              code to your registered email.
            </Typography>
          </Box>
        </Stack>

       
        {/* =================================================
            OTP - ALWAYS VISIBLE UNTIL VERIFIED
        ================================================= */}


         {/* =================================================
    OTP + SEND CODE + VERIFY — SINGLE ROW
================================================= */}

{!emailVerified && (
  <Box sx={{ mt: 1.5 }}>
    <Typography
      sx={{
        mb: 0.7,
        fontSize: "10.5px",
        fontWeight: 600,
        color: C.text,
      }}
    >
      Verification Code
    </Typography>

    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        width: "100%",
        flexWrap: {
          xs: "wrap",
          md: "nowrap",
        },
        rowGap: 1,
      }}
    >
      {/* ===============================
          6 OTP BOXES
      =============================== */}

      <Stack
        direction="row"
        spacing={0.7}
        sx={{
          flexShrink: 0,
        }}
      >
        {Array.from({ length: 6 }).map(
          (_, index) => (
            <TextField
              key={index}
              inputRef={(element) => {
                otpRefs.current[index] =
                  element;
              }}
              value={otp[index] || ""}
              disabled={!otpSent}
              onChange={(event) =>
                handleOtpChange(
                  index,
                  event.target.value
                )
              }
              onKeyDown={(event) =>
                handleOtpKeyDown(
                  index,
                  event
                )
              }
              onPaste={handleOtpPaste}
              inputProps={{
                maxLength: 1,
                inputMode: "numeric",
                pattern: "[0-9]*",
                autoComplete:
                  index === 0
                    ? "one-time-code"
                    : "off",
              }}
              sx={{
                width: {
                  xs: 38,
                  sm: 42,
                },

                "& .MuiOutlinedInput-root": {
                  width: {
                    xs: 38,
                    sm: 42,
                  },

                  height: 42,

                  borderRadius: "8px",

                  bgcolor: otpSent
                    ? "#FFFFFF"
                    : "#F8FAF9",

                  "& fieldset": {
                    borderColor: C.input,
                  },

                  "&:hover fieldset": {
                    borderColor: otpSent
                      ? "#9CB7AF"
                      : C.input,
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: C.primary,
                    borderWidth: "1.5px",
                  },
                },

                "& .MuiInputBase-input": {
                  p: 0,
                  textAlign: "center",

                  fontSize: "15px",
                  fontWeight: 700,

                  color: C.text,
                },
              }}
            />
          )
        )}
      </Stack>

      {/* ===============================
          SEND / RESEND CODE
      =============================== */}

      <Button
        variant="outlined"
        onClick={handleSendOtp}
        disabled={sendingOtp || !email}
        sx={{
          minWidth: 115,
          height: 42,

          borderColor: C.primary,
          color: C.primary,

          borderRadius: "8px",

          textTransform: "none",

          fontSize: "11px",
          fontWeight: 700,

          whiteSpace: "nowrap",

          "&:hover": {
            borderColor: C.hover,
            bgcolor: "#F8FCFA",
          },

          "&.Mui-disabled": {
            borderColor: C.border,
          },
        }}
      >
        {sendingOtp ? (
          <CircularProgress
            size={15}
            color="inherit"
          />
        ) : otpSent ? (
          "Resend Code"
        ) : (
          "Send Code"
        )}
      </Button>

      {/* ===============================
          VERIFY
      =============================== */}

      <Button
        variant="contained"
        onClick={handleVerifyOtp}
        disabled={
          !otpSent ||
          verifyingOtp ||
          otp.length !== 6
        }
        sx={{
          minWidth: 100,
          height: 42,

          bgcolor: C.primary,
          color: "#fff",

          borderRadius: "8px",

          boxShadow: "none",

          textTransform: "none",

          fontSize: "11px",
          fontWeight: 700,

          "&:hover": {
            bgcolor: C.hover,
            boxShadow: "none",
          },

          "&.Mui-disabled": {
            bgcolor: "#A9BDB6",
            color: "#fff",
          },
        }}
      >
        {verifyingOtp ? (
          <CircularProgress
            size={15}
            color="inherit"
          />
        ) : (
          "Verify"
        )}
      </Button>
    </Stack>

    {/* MESSAGE */}

    <Typography
      sx={{
        mt: 0.7,
        fontSize: "9.5px",
        color: C.muted,
      }}
    >
      {otpSent
        ? "Enter the 6-digit code sent to your registered email."
        : "Click “Send Code” to receive a verification code on your registered email."}
    </Typography>
  </Box>
)}

{/* =================================================
    VERIFIED
================================================= */}

{emailVerified && (
  <Stack
    direction="row"
    spacing={0.7}
    alignItems="center"
    sx={{
      mt: 1.5,
      width: "fit-content",

      px: 1.4,
      py: 0.9,

      bgcolor: C.light,
      borderRadius: "8px",
    }}
  >
    <VerifiedOutlinedIcon
      sx={{
        fontSize: 17,
        color: C.primary,
      }}
    />

    <Typography
      sx={{
        fontSize: "10.5px",
        fontWeight: 700,
        color: C.primary,
      }}
    >
      Email Verified Successfully
    </Typography>
  </Stack>
)}


        {/* VERIFIED MESSAGE */}

        {emailVerified && (
          <Stack
            direction="row"
            spacing={0.7}
            alignItems="center"
            sx={{
              mt: 1.3,
            }}
          >
            <VerifiedOutlinedIcon
              sx={{
                fontSize: 16,
                color: C.primary,
              }}
            />

            <Typography
              sx={{
                fontSize: "10.5px",
                fontWeight: 600,
                color: C.primary,
              }}
            >
              Your email address has been verified
              successfully.
            </Typography>
          </Stack>
        )}
      </Paper>

      {/* =====================================================
          DECLARATION
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          mt: 1.5,

          p: {
            xs: 1.5,
            md: 2,
          },

          border: `1px solid ${C.border}`,
          borderRadius: "10px",

          bgcolor: C.white,
        }}
      >
        <Stack
          direction="row"
          alignItems="flex-start"
          spacing={1}
        >
          <Checkbox
            checked={declaration}
            onChange={(event) => {
              setDeclaration(
                event.target.checked
              );

              setError("");
            }}
            size="small"
            sx={{
              p: 0.2,
              mt: 0.05,

              color: "#9CB7AF",

              "&.Mui-checked": {
                color: C.primary,
              },
            }}
          />

          <Box>
            <Typography
              sx={{
                fontSize: "12.5px",
                fontWeight: 700,
                color: C.text,
              }}
            >
              Declaration
            </Typography>

            <Typography
              sx={{
                mt: 0.25,

                fontSize: "10.5px",
                lineHeight: 1.6,

                color: C.muted,
              }}
            >
              I confirm that the information and
              documents provided in this registration
              are correct and valid. I understand that
              the submitted details may be reviewed
              before the medical store account is
              activated.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* =====================================================
          REVIEW TIME
      ===================================================== */}

      <Stack
        direction="row"
        spacing={1}
        alignItems="flex-start"
        sx={{
          mt: 1.5,

          p: 1.4,

          borderRadius: "9px",

          bgcolor: "#F4FAF7",

          border:
            "1px solid rgba(7,135,106,0.12)",
        }}
      >
        <AccessTimeOutlinedIcon
          sx={{
            mt: "1px",

            fontSize: 17,

            color: C.primary,

            flexShrink: 0,
          }}
        />

        <Box>
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 700,
              color: C.text,
            }}
          >
            Verification may take up to 36 hours
          </Typography>

          <Typography
            sx={{
              mt: 0.2,

              fontSize: "10px",
              lineHeight: 1.5,

              color: C.muted,
            }}
          >
            Our team will review your registration
            details and documents. You&apos;ll be
            notified once your medical store account
            is approved.
          </Typography>
        </Box>
      </Stack>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <Typography
          sx={{
            mt: 1.2,

            fontSize: "10.5px",
            fontWeight: 500,

            color: C.error,
          }}
        >
          {error}
        </Typography>
      )}

      {/* =====================================================
          ACTIONS
      ===================================================== */}

      <Divider
        sx={{
          my: 2,
          borderColor: C.border,
        }}
      />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        {/* BACK */}

        <Button
          variant="outlined"
          onClick={onBack}
          disabled={loading}
          sx={{
            height: 42,

            px: 2.5,

            borderColor: C.border,
            color: C.text,

            borderRadius: "8px",

            textTransform: "none",

            fontSize: "11.5px",
            fontWeight: 600,

            "&:hover": {
              borderColor: C.primary,
              bgcolor: "#F8FCFA",
            },
          }}
        >
          Back
        </Button>

        {/* SUBMIT */}

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            loading ||
            !emailVerified ||
            !declaration
          }
          endIcon={
            !loading && (
              <SendRoundedIcon
                sx={{
                  fontSize:
                    "16px !important",
                }}
              />
            )
          }
          sx={{
            minWidth: {
              xs: 150,
              sm: 200,
            },

            height: 42,

            px: 2.5,

            bgcolor: C.primary,

            borderRadius: "8px",

            boxShadow: "none",

            textTransform: "none",

            fontSize: "11.5px",
            fontWeight: 700,

            "&:hover": {
              bgcolor: C.hover,
              boxShadow: "none",
            },

            "&.Mui-disabled": {
              bgcolor: "#A9BDB6",
              color: "#fff",
            },
          }}
        >
          {loading ? (
            <CircularProgress
              size={15}
              color="inherit"
            />
          ) : (
            "Submit Registration"
          )}
        </Button>
      </Stack>
    </Box>
  );
}