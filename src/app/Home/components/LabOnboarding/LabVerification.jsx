"use client";

import React, {
  useRef,
  useState,
} from "react";

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
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const C = {
  primary: "#07876A",
  hover: "#066F58",
  light: "#EAF7F3",

  text: "#172033",
  muted: "#74807B",

  border: "#DDE9E5",
  input: "#CBD5E1",

  error: "#E5484D",
};

export default function LabVerification({
  data = {},
  onSendOtp,
  onVerifyOtp,
  onBack,
  onSubmit,
  loading = false,
}) {
  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [otpSent, setOtpSent] =
    useState(false);

  const [
    emailVerified,
    setEmailVerified,
  ] = useState(false);

  const [
    sendingOtp,
    setSendingOtp,
  ] = useState(false);

  const [
    verifyingOtp,
    setVerifyingOtp,
  ] = useState(false);

  const [
    declaration,
    setDeclaration,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const otpRefs = useRef([]);

  const email = data?.email || "";

  const otpCode = otp.join("");

  /* ============================================
     SEND OTP
  ============================================ */

  const handleSendOtp = async () => {
    if (!email) {
      setError(
        "Registered email address is not available."
      );

      return;
    }

    try {
      setSendingOtp(true);
      setError("");

      await onSendOtp?.({
        email,
      });

      setOtpSent(true);

      setOtp([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to send verification code."
      );
    } finally {
      setSendingOtp(false);
    }
  };

  /* ============================================
     OTP CHANGE
  ============================================ */

  const changeOtp = (
    index,
    value
  ) => {
    const digit = value
      .replace(/\D/g, "")
      .slice(-1);

    const next = [...otp];

    next[index] = digit;

    setOtp(next);
    setError("");

    if (
      digit &&
      index < 5
    ) {
      otpRefs.current[
        index + 1
      ]?.focus();
    }
  };

  /* ============================================
     BACKSPACE
  ============================================ */

  const keyDown = (
    index,
    event
  ) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      otpRefs.current[
        index - 1
      ]?.focus();
    }
  };

  /* ============================================
     PASTE
  ============================================ */

  const pasteOtp = (event) => {
    event.preventDefault();

    const digits =
      event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);

    if (!digits) return;

    const next =
      Array(6).fill("");

    digits
      .split("")
      .forEach((digit, index) => {
        next[index] = digit;
      });

    setOtp(next);

    const index =
      Math.min(
        digits.length,
        6
      ) - 1;

    setTimeout(() => {
      otpRefs.current[
        index
      ]?.focus();
    }, 0);
  };

  /* ============================================
     VERIFY
  ============================================ */

  const verify = async () => {
    if (!otpSent) {
      setError(
        "Please send the verification code first."
      );

      return;
    }

    if (
      otpCode.length !== 6
    ) {
      setError(
        "Enter the complete 6-digit code."
      );

      return;
    }

    try {
      setVerifyingOtp(true);
      setError("");

      await onVerifyOtp?.({
        email,
        otp: otpCode,
      });

      setEmailVerified(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid or expired verification code."
      );
    } finally {
      setVerifyingOtp(false);
    }
  };

  /* ============================================
     SUBMIT
  ============================================ */

  const submit = () => {
    if (!emailVerified) {
      setError(
        "Please verify your email first."
      );

      return;
    }

    if (!declaration) {
      setError(
        "Please accept the declaration."
      );

      return;
    }

    setError("");

    onSubmit?.();
  };

  return (
    <Box>
      {/* HEADER */}

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
      >
        <GppGoodOutlinedIcon
          sx={{
            color: C.primary,
            fontSize: 24,
          }}
        />

        <Box>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 750,
              color: C.text,
            }}
          >
            Verification & Declaration
          </Typography>

          <Typography
            sx={{
              fontSize: "10.5px",
              color: C.muted,
            }}
          >
            Verify the registered email
            and submit your lab
            registration.
          </Typography>
        </Box>
      </Stack>

      {/* EMAIL VERIFICATION */}

      <Paper
        elevation={0}
        sx={{
          mt: 2,
          p: {
            xs: 1.5,
            md: 2,
          },

          border:
            `1px solid ${C.border}`,

          borderRadius: "10px",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
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
              A 6-digit verification
              code will be sent to your
              registered lab email.
            </Typography>
          </Box>
        </Stack>

        {!emailVerified ? (
          <Box sx={{ mt: 1.5 }}>
            <Typography
              sx={{
                mb: 0.7,
                fontSize: "10.5px",
                fontWeight: 650,
                color: C.text,
              }}
            >
              Verification Code
            </Typography>

            {/* ONE ROW */}

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                flexWrap: {
                  xs: "wrap",
                  md: "nowrap",
                },

                rowGap: 1,
              }}
            >
              {/* 6 BOXES */}

              <Stack
                direction="row"
                spacing={0.7}
              >
                {otp.map(
                  (digit, index) => (
                    <TextField
                      key={index}
                      inputRef={(
                        element
                      ) => {
                        otpRefs.current[
                          index
                        ] = element;
                      }}
                      value={digit}
                      disabled={!otpSent}
                      onChange={(e) =>
                        changeOtp(
                          index,
                          e.target.value
                        )
                      }
                      onKeyDown={(e) =>
                        keyDown(
                          index,
                          e
                        )
                      }
                      onPaste={pasteOtp}
                      inputProps={{
                        maxLength: 1,
                        inputMode:
                          "numeric",
                        pattern:
                          "[0-9]*",
                      }}
                      sx={{
                        width: {
                          xs: 38,
                          sm: 42,
                        },

                        "& .MuiOutlinedInput-root":
                          {
                            width: {
                              xs: 38,
                              sm: 42,
                            },

                            height: 42,

                            borderRadius:
                              "8px",

                            bgcolor:
                              otpSent
                                ? "#fff"
                                : "#F8FAF9",

                            "& fieldset":
                              {
                                borderColor:
                                  C.input,
                              },

                            "&.Mui-focused fieldset":
                              {
                                borderColor:
                                  C.primary,

                                borderWidth:
                                  "1.5px",
                              },
                          },

                        "& .MuiInputBase-input":
                          {
                            p: 0,

                            textAlign:
                              "center",

                            fontSize:
                              "15px",

                            fontWeight:
                              700,
                          },
                      }}
                    />
                  )
                )}
              </Stack>

              {/* SEND */}

              <Button
                variant="outlined"
                onClick={
                  handleSendOtp
                }
                disabled={
                  sendingOtp ||
                  !email
                }
                sx={{
                  minWidth: 115,
                  height: 42,

                  borderColor:
                    C.primary,

                  color: C.primary,

                  borderRadius:
                    "8px",

                  textTransform:
                    "none",

                  fontSize: "11px",
                  fontWeight: 700,

                  whiteSpace:
                    "nowrap",
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

              {/* VERIFY */}

              <Button
                variant="contained"
                onClick={verify}
                disabled={
                  !otpSent ||
                  verifyingOtp ||
                  otpCode.length !== 6
                }
                sx={{
                  minWidth: 100,
                  height: 42,

                  bgcolor: C.primary,

                  borderRadius:
                    "8px",

                  boxShadow: "none",

                  textTransform:
                    "none",

                  fontSize: "11px",
                  fontWeight: 700,

                  "&:hover": {
                    bgcolor: C.hover,
                    boxShadow:
                      "none",
                  },

                  "&.Mui-disabled":
                    {
                      bgcolor:
                        "#A9BDB6",

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

            <Typography
              sx={{
                mt: 0.7,
                fontSize: "9.5px",
                color: C.muted,
              }}
            >
              {otpSent
                ? "Enter the code sent to your registered email."
                : "Click “Send Code” to receive the verification code."}
            </Typography>
          </Box>
        ) : (
          <Stack
            direction="row"
            spacing={0.6}
            alignItems="center"
            sx={{
              mt: 1.5,

              width: "fit-content",

              px: 1.3,
              py: 0.8,

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
      </Paper>

      {/* DECLARATION */}

      <Paper
        elevation={0}
        sx={{
          mt: 1.5,
          p: {
            xs: 1.5,
            md: 2,
          },

          border:
            `1px solid ${C.border}`,

          borderRadius: "10px",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-start"
        >
          <Checkbox
            checked={declaration}
            onChange={(e) => {
              setDeclaration(
                e.target.checked
              );

              setError("");
            }}
            size="small"
            sx={{
              p: 0.2,

              color: "#9CB7AF",

              "&.Mui-checked": {
                color: C.primary,
              },
            }}
          />

          <Box>
            <Typography
              sx={{
                fontSize: "12px",
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
              I confirm that the
              information and documents
              submitted for this
              laboratory registration are
              correct and valid. I
              understand that they may be
              reviewed before the lab
              account is activated.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* REVIEW */}

      <Stack
        direction="row"
        spacing={1}
        sx={{
          mt: 1.5,
          p: 1.4,

          bgcolor: "#F4FAF7",

          border:
            "1px solid rgba(7,135,106,0.12)",

          borderRadius: "9px",
        }}
      >
        <AccessTimeOutlinedIcon
          sx={{
            fontSize: 17,
            color: C.primary,
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
            Verification may take up to
            36 hours
          </Typography>

          <Typography
            sx={{
              mt: 0.2,
              fontSize: "10px",
              color: C.muted,
            }}
          >
            Our team will review your lab
            information and documents.
            You&apos;ll be notified once
            the registration is approved.
          </Typography>
        </Box>
      </Stack>

      {error && (
        <Typography
          sx={{
            mt: 1,
            fontSize: "10px",
            color: C.error,
          }}
        >
          {error}
        </Typography>
      )}

      <Divider
        sx={{
          my: 2,
          borderColor: C.border,
        }}
      />

      {/* BUTTONS */}

      <Stack
        direction="row"
        justifyContent="space-between"
      >
        <Button
          variant="outlined"
          onClick={onBack}
          startIcon={
            <ArrowBackRoundedIcon />
          }
          disabled={loading}
          sx={{
            height: 42,

            borderColor: C.border,
            color: C.text,

            borderRadius: "8px",

            textTransform: "none",

            fontSize: "11px",
          }}
        >
          Back
        </Button>

        <Button
          variant="contained"
          onClick={submit}
          disabled={
            loading ||
            !emailVerified ||
            !declaration
          }
          endIcon={
            !loading && (
              <SendRoundedIcon />
            )
          }
          sx={{
            minWidth: 190,
            height: 42,

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