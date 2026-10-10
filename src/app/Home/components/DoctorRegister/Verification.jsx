"use client";

import React, { useEffect, useRef, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendOutlinedIcon from "@mui/icons-material/Send";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";

import axios from "axios";

import OnboardingHeader from "./OnboardingHeader";

/* =========================================================
   COLORS
========================================================= */

const COLORS = {
  primary: "#1B6E4F",
  primaryHover: "#155A40",
  primaryLight: "#E8F5EE",

  border: "#E6EBE8",

  textPrimary: "#1F2A24",
  textSecondary: "#6B7A72",

  white: "#FFFFFF",
  surface: "#F8FAF9",

  warning: "#D99700",
  warningLight: "#FFF9EC",
};

const EMPTY_OTP = ["", "", "", "", "", ""];

/*
  3 minutes
*/
const RESEND_TIME = 180;

/* =========================================================
   COMPONENT
========================================================= */
export default function Verification({
  data,
  registrationId,
  onBack,
  onSubmit,
  onEmailVerified,
}) {
  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("sm")
  );

  /* =====================================================
     API DATA
  ===================================================== */

  const email = String(data?.email || "")
    .trim()
    .toLowerCase();

  const apiEmailVerified =
    Number(data?.email_verified) === 1;

  const isAlreadySubmitted =
    String(data?.onboarding_status || "")
      .trim()
      .toUpperCase() === "SUBMITTED";

  /* =====================================================
     STATES
     IMPORTANT: states pehle declare honge
  ===================================================== */

  const [agree, setAgree] = useState(false);

  const [otp, setOtp] = useState(EMPTY_OTP);

  const [otpSent, setOtpSent] = useState(false);

  const [otpVerified, setOtpVerified] = useState(
    apiEmailVerified
  );

  const [sendingOtp, setSendingOtp] = useState(false);

  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [completed, setCompleted] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const otpRefs = useRef([]);

  /* =====================================================
     DERIVED VALUES
     IMPORTANT: otpVerified declare hone KE BAAD
  ===================================================== */

  const emailIsVerified =
    apiEmailVerified || otpVerified;

  const otpValue = otp.join("");

  /* =====================================================
     SYNC API VERIFIED STATUS
  ===================================================== */

  useEffect(() => {
    const verified =
      Number(data?.email_verified) === 1;

    if (verified) {
     setOtpVerified(true);

if (typeof onEmailVerified === "function") {
  onEmailVerified();
}

setOtpSent(false);
setOtp(EMPTY_OTP);
setResendTimer(0);

showSnackbar(
  "Email verified successfully.",
  "success"
);
    }
  }, [data?.email_verified]);

  /* =====================================================
     SUBMITTED STATUS
  ===================================================== */

  useEffect(() => {
    if (isAlreadySubmitted) {
      setOtpSent(false);
      setOtp(EMPTY_OTP);
      setResendTimer(0);
      setAgree(false);
    }
  }, [isAlreadySubmitted]);

  // ...baaki code same

  /* =======================================================
     RESEND COUNTDOWN
  ======================================================= */

  useEffect(() => {
    if (
      !otpSent ||
      emailIsVerified ||
      resendTimer <= 0
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setResendTimer((previous) => {
        if (previous <= 1) {
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    otpSent,
    emailIsVerified,
    resendTimer,
  ]);

  /* =======================================================
     FORMAT TIMER
  ======================================================= */

  const formatTimer = (seconds) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  /* =======================================================
     SNACKBAR
  ======================================================= */

  const showSnackbar = (
    message,
    severity = "success"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = (
    _,
    reason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar((previous) => ({
      ...previous,
      open: false,
    }));
  };

  /* =======================================================
     EMAIL VALIDATION
  ======================================================= */

  const validateEmail = (value) => {
    const currentEmail = String(
      value || ""
    )
      .trim()
      .toLowerCase();

    if (!currentEmail) {
      return "Email address is required.";
    }

    if (currentEmail.includes(" ")) {
      return "Email cannot contain spaces.";
    }

    if (currentEmail.length > 100) {
      return "Email address is too long.";
    }

    const gmailRegex =
      /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@gmail\.com$/i;

    if (!gmailRegex.test(currentEmail)) {
      return "Please enter a valid Gmail address.";
    }

    return "";
  };

  /* =======================================================
     OTP VALIDATION
  ======================================================= */

  const validateOtp = () => {
    if (!otpValue) {
      return "Please enter the OTP.";
    }

    if (!/^\d{6}$/.test(otpValue)) {
      return "Please enter the complete 6-digit OTP.";
    }

    return "";
  };

  /* =======================================================
     SEND OTP
  ======================================================= */

  const handleSendOtp = async () => {
    /*
      Submitted registration par OTP dobara
      kabhi send nahi karenge.
    */
    if (isAlreadySubmitted) {
      showSnackbar(
        "Registration has already been submitted.",
        "info"
      );

      return;
    }

    if (
      sendingOtp ||
      verifyingOtp ||
      emailIsVerified
    ) {
      return;
    }

    const emailError =
      validateEmail(email);

    if (emailError) {
      showSnackbar(
        emailError,
        "error"
      );

      return;
    }

    if (!registrationId) {
      showSnackbar(
        "Registration ID not found. Please complete the previous steps.",
        "error"
      );

      return;
    }

    try {
      setSendingOtp(true);

      const response =
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/doctor-registration/send-email-otp`,
          {
            email,
          }
        );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to send OTP."
        );
      }

      setOtpSent(true);

      setOtp(EMPTY_OTP);

      /*
        Start 3 minute timer.
      */
      setResendTimer(
        RESEND_TIME
      );

      showSnackbar(
        "OTP sent successfully. Please check your email.",
        "success"
      );

      window.setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    } catch (error) {
      console.error(
        "SEND OTP ERROR:",
        error?.response?.data ||
          error?.message
      );

      showSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to send OTP. Please try again.",
        "error"
      );
    } finally {
      setSendingOtp(false);
    }
  };

  /* =======================================================
     RESEND OTP
  ======================================================= */

  const handleResendOtp = async () => {
    if (isAlreadySubmitted) {
      return;
    }

    if (
      resendTimer > 0 ||
      sendingOtp ||
      verifyingOtp ||
      emailIsVerified
    ) {
      return;
    }

    await handleSendOtp();
  };

  /* =======================================================
     OTP CHANGE
  ======================================================= */

  const handleOtpChange = (
    index,
    value
  ) => {
    const numericValue = String(
      value || ""
    )
      .replace(/\D/g, "")
      .slice(-1);

    const newOtp = [...otp];

    newOtp[index] =
      numericValue;

    setOtp(newOtp);

    if (
      numericValue &&
      index <
        otp.length - 1
    ) {
      otpRefs.current[
        index + 1
      ]?.focus();
    }
  };

  /* =======================================================
     OTP KEYBOARD
  ======================================================= */

  const handleOtpKeyDown = (
    index,
    event
  ) => {
    if (
      event.key ===
        "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      otpRefs.current[
        index - 1
      ]?.focus();

      return;
    }

    if (
      event.key ===
        "ArrowLeft" &&
      index > 0
    ) {
      event.preventDefault();

      otpRefs.current[
        index - 1
      ]?.focus();
    }

    if (
      event.key ===
        "ArrowRight" &&
      index <
        otp.length - 1
    ) {
      event.preventDefault();

      otpRefs.current[
        index + 1
      ]?.focus();
    }
  };

  /* =======================================================
     OTP PASTE
  ======================================================= */

  const handleOtpPaste = (
    event
  ) => {
    event.preventDefault();

    const pastedData =
      event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);

    if (!pastedData) {
      showSnackbar(
        "Please paste a valid numeric OTP.",
        "error"
      );

      return;
    }

    const newOtp = [
      "",
      "",
      "",
      "",
      "",
      "",
    ];

    pastedData
      .split("")
      .forEach(
        (
          digit,
          index
        ) => {
          newOtp[index] =
            digit;
        }
      );

    setOtp(newOtp);

    const focusIndex =
      pastedData.length >= 6
        ? 5
        : pastedData.length;

    window.setTimeout(() => {
      otpRefs.current[
        focusIndex
      ]?.focus();
    }, 50);
  };

  /* =======================================================
     VERIFY OTP
  ======================================================= */

  const handleVerifyOtp =
    async () => {
      if (
        isAlreadySubmitted
      ) {
        return;
      }

      if (
        verifyingOtp ||
        sendingOtp ||
        emailIsVerified
      ) {
        return;
      }

      const emailError =
        validateEmail(email);

      if (emailError) {
        showSnackbar(
          emailError,
          "error"
        );

        return;
      }

      if (!registrationId) {
        showSnackbar(
          "Registration ID not found.",
          "error"
        );

        return;
      }

      if (!otpSent) {
        showSnackbar(
          "Please request an OTP first.",
          "error"
        );

        return;
      }

      const otpError =
        validateOtp();

      if (otpError) {
        showSnackbar(
          otpError,
          "error"
        );

        return;
      }

      try {
        setVerifyingOtp(true);

        const response =
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/doctor-registration/verify-email-otp`,
            {
              email,
              otp: otpValue,
            }
          );

        if (
          !response.data
            ?.success
        ) {
          throw new Error(
            response.data
              ?.message ||
              "Invalid OTP."
          );
        }
setOtpVerified(true);

// Parent component ko bhi update karo
if (typeof onEmailVerified === "function") {
  onEmailVerified();
}

setOtpSent(false);

        setOtp(EMPTY_OTP);

        setResendTimer(0);

        showSnackbar(
          "Email verified successfully.",
          "success"
        );
      } catch (error) {
        console.error(
          "VERIFY OTP ERROR:",
          error?.response
            ?.data ||
            error?.message
        );

        setOtpVerified(false);

        showSnackbar(
          error?.response
            ?.data?.message ||
            error?.message ||
            "Invalid or expired OTP.",
          "error"
        );
      } finally {
        setVerifyingOtp(
          false
        );
      }
    };

  /* =======================================================
     FINAL SUBMIT
  ======================================================= */

  const handleFinalSubmit =
    async () => {
      /*
        Already submitted = no duplicate submission.
      */
      if (
        isAlreadySubmitted
      ) {
        showSnackbar(
          "Registration has already been submitted.",
          "info"
        );

        return;
      }

      if (
        submitting ||
        completed
      ) {
        return;
      }

      const emailError =
        validateEmail(email);

      if (emailError) {
        showSnackbar(
          emailError,
          "error"
        );

        return;
      }

      if (
        !emailIsVerified
      ) {
        showSnackbar(
          "Please verify your email before submitting.",
          "error"
        );

        return;
      }

      if (!agree) {
        showSnackbar(
          "Please agree to the declaration.",
          "error"
        );

        return;
      }

      try {
        setSubmitting(true);

        /*
          Parent final submission.
        */
        if (
          typeof onSubmit ===
          "function"
        ) {
          await onSubmit();
        }

        setCompleted(true);
      } catch (error) {
        console.error(
          "FINAL SUBMIT ERROR:",
          error?.response
            ?.data ||
            error?.message
        );

        showSnackbar(
          error?.response
            ?.data?.message ||
            error?.message ||
            "Unable to submit registration. Please try again.",
          "error"
        );
      } finally {
        setSubmitting(false);
      }
    };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          minHeight: "100%",

          p: {
            xs: 1.5,
            sm: 2,
            md: 2.5,
          },

          border: `1px solid ${COLORS.border}`,

          borderRadius: {
            xs: "12px",
            md: "16px",
          },

          bgcolor:
            COLORS.white,
        }}
      >
        {/* ===============================================
            HEADER
        =============================================== */}

        <OnboardingHeader />

        {/* ===============================================
            EMAIL VERIFICATION
        =============================================== */}

        <Paper
          elevation={0}
          sx={{
            mt: 1.5,

            p: {
              xs: 1.5,
              sm: 2,
            },

            border: `1px solid ${
              emailIsVerified
                ? "#CFE7DA"
                : COLORS.border
            }`,

            borderRadius:
              "12px",

            bgcolor:
              emailIsVerified
                ? "#FBFEFC"
                : COLORS.surface,
          }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1.5}
            alignItems={{
              xs: "stretch",
              sm: "center",
            }}
            justifyContent="space-between"
          >
            {/* LEFT */}

            <Stack
              direction="row"
              spacing={1.2}
              alignItems="center"
              sx={{
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,

                  borderRadius:
                    "9px",

                  bgcolor:
                    COLORS.primaryLight,

                  color:
                    COLORS.primary,

                  flexShrink: 0,

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",
                }}
              >
                {emailIsVerified ? (
                  <VerifiedOutlinedIcon
                    sx={{
                      fontSize:
                        20,
                    }}
                  />
                ) : (
                  <EmailOutlinedIcon
                    sx={{
                      fontSize:
                        20,
                    }}
                  />
                )}
              </Box>

              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{
                    fontSize:
                      "13px",

                    fontWeight:
                      700,

                    color:
                      COLORS.textPrimary,
                  }}
                >
                  Email Verification
                </Typography>

                <Typography
                  sx={{
                    mt: 0.25,

                    fontSize:
                      "10.5px",

                    color:
                      COLORS.textSecondary,

                    wordBreak:
                      "break-word",
                  }}
                >
                  {email ||
                    "Email not available"}
                </Typography>
              </Box>
            </Stack>

            {/* RIGHT */}

            {emailIsVerified ? (
              <Stack
                direction="row"
                spacing={0.6}
                alignItems="center"
                sx={{
                  alignSelf: {
                    xs: "flex-start",
                    sm: "center",
                  },

                  px: 1.2,
                  py: 0.65,

                  borderRadius:
                    "8px",

                  bgcolor:
                    COLORS.primaryLight,
                }}
              >
                <CheckCircleRoundedIcon
                  sx={{
                    fontSize:
                      16,

                    color:
                      COLORS.primary,
                  }}
                />

                <Typography
                  sx={{
                    fontSize:
                      "10.5px",

                    fontWeight:
                      700,

                    color:
                      COLORS.primary,
                  }}
                >
                  Email Verified
                </Typography>
              </Stack>
            ) : !otpSent &&
              !isAlreadySubmitted ? (
              <Button
                variant="contained"
                onClick={
                  handleSendOtp
                }
                disabled={
                  sendingOtp ||
                  verifyingOtp
                }
                startIcon={
                  sendingOtp ? (
                    <CircularProgress
                      size={14}
                      color="inherit"
                    />
                  ) : (
                    <MarkEmailReadOutlinedIcon />
                  )
                }
                sx={{
                  height: 38,

                  px: 2,

                  borderRadius:
                    "8px",

                  bgcolor:
                    COLORS.primary,

                  color:
                    COLORS.white,

                  textTransform:
                    "none",

                  fontSize:
                    "11px",

                  fontWeight:
                    700,

                  boxShadow:
                    "none",

                  "&:hover": {
                    bgcolor:
                      COLORS.primaryHover,

                    boxShadow:
                      "none",
                  },

                  "&.Mui-disabled":
                    {
                      bgcolor:
                        "#A8BDB3",

                      color:
                        COLORS.white,
                    },
                }}
              >
                {sendingOtp
                  ? "Sending..."
                  : "Send OTP"}
              </Button>
            ) : null}
          </Stack>

          {/* =============================================
              OTP SECTION
          ============================================= */}

          {otpSent &&
            !emailIsVerified &&
            !isAlreadySubmitted && (
              <Box
                sx={{
                  mt: 1.7,

                  pt: 1.7,

                  borderTop: `1px solid ${COLORS.border}`,
                }}
              >
                <Typography
                  sx={{
                    fontSize:
                      "12px",

                    fontWeight:
                      700,

                    color:
                      COLORS.textPrimary,
                  }}
                >
                  Enter verification code
                </Typography>

                <Typography
                  sx={{
                    mt: 0.25,

                    fontSize:
                      "10.5px",

                    color:
                      COLORS.textSecondary,
                  }}
                >
                  Enter the 6-digit OTP sent to your email.
                </Typography>

                {/* OTP BOXES */}

                <Stack
                  direction="row"
                  spacing={{
                    xs: 0.55,
                    sm: 0.8,
                  }}
                  sx={{
                    mt: 1.3,

                    width:
                      "100%",

                    maxWidth:
                      "350px",
                  }}
                >
                  {otp.map(
                    (
                      digit,
                      index
                    ) => (
                      <TextField
                        key={
                          index
                        }
                        inputRef={(
                          element
                        ) => {
                          otpRefs.current[
                            index
                          ] =
                            element;
                        }}
                        value={
                          digit
                        }
                        disabled={
                          verifyingOtp ||
                          sendingOtp
                        }
                        onChange={(
                          event
                        ) =>
                          handleOtpChange(
                            index,
                            event
                              .target
                              .value
                          )
                        }
                        onKeyDown={(
                          event
                        ) =>
                          handleOtpKeyDown(
                            index,
                            event
                          )
                        }
                        onPaste={
                          index ===
                          0
                            ? handleOtpPaste
                            : undefined
                        }
                        autoComplete="one-time-code"
                        inputProps={{
                          maxLength:
                            1,

                          inputMode:
                            "numeric",

                          pattern:
                            "[0-9]*",

                          "aria-label": `OTP digit ${
                            index +
                            1
                          }`,

                          style:
                            {
                              textAlign:
                                "center",

                              fontSize:
                                isMobile
                                  ? 17
                                  : 19,

                              fontWeight:
                                700,

                              padding:
                                0,
                            },
                        }}
                        sx={{
                          flex: 1,

                          minWidth:
                            0,

                          maxWidth:
                            "50px",

                          "& .MuiOutlinedInput-root":
                            {
                              height:
                                {
                                  xs: 42,
                                  sm: 47,
                                },

                              borderRadius:
                                "8px",

                              bgcolor:
                                COLORS.white,

                              "& fieldset":
                                {
                                  borderColor:
                                    COLORS.border,
                                },

                              "&:hover fieldset":
                                {
                                  borderColor:
                                    COLORS.primary,
                                },

                              "&.Mui-focused fieldset":
                                {
                                  borderColor:
                                    COLORS.primary,

                                  borderWidth:
                                    "1.5px",
                                },
                            },
                        }}
                      />
                    )
                  )}
                </Stack>

                {/* VERIFY + RESEND */}

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={1}
                  alignItems={{
                    xs: "flex-start",
                    sm: "center",
                  }}
                  sx={{
                    mt: 1.4,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={
                      handleVerifyOtp
                    }
                    disabled={
                      verifyingOtp ||
                      sendingOtp ||
                      otpValue.length !==
                        6
                    }
                    startIcon={
                      verifyingOtp ? (
                        <CircularProgress
                          size={
                            14
                          }
                          color="inherit"
                        />
                      ) : (
                        <VerifiedOutlinedIcon />
                      )
                    }
                    sx={{
                      height:
                        38,

                      px: 2,

                      borderRadius:
                        "8px",

                      bgcolor:
                        COLORS.primary,

                      textTransform:
                        "none",

                      fontSize:
                        "11px",

                      fontWeight:
                        700,

                      boxShadow:
                        "none",

                      "&:hover":
                        {
                          bgcolor:
                            COLORS.primaryHover,

                          boxShadow:
                            "none",
                        },

                      "&.Mui-disabled":
                        {
                          bgcolor:
                            "#A8BDB3",

                          color:
                            COLORS.white,
                        },
                    }}
                  >
                    {verifyingOtp
                      ? "Verifying..."
                      : "Verify OTP"}
                  </Button>

                  {/* RESEND */}

                  <Stack
                    direction="row"
                    spacing={0.35}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Typography
                      sx={{
                        fontSize:
                          "10.5px",

                        color:
                          COLORS.textSecondary,
                      }}
                    >
                      Didn't receive it?
                    </Typography>

                    <Button
                      variant="text"
                      onClick={
                        handleResendOtp
                      }
                      disabled={
                        resendTimer >
                          0 ||
                        sendingOtp ||
                        verifyingOtp
                      }
                      startIcon={
                        sendingOtp ? (
                          <CircularProgress
                            size={
                              12
                            }
                            color="inherit"
                          />
                        ) : resendTimer ===
                          0 ? (
                          <RefreshRoundedIcon
                            sx={{
                              fontSize:
                                "14px !important",
                            }}
                          />
                        ) : null
                      }
                      sx={{
                        minWidth:
                          "auto",

                        minHeight:
                          "30px",

                        px: 0.5,

                        textTransform:
                          "none",

                        fontSize:
                          "10.5px",

                        fontWeight:
                          700,

                        color:
                          COLORS.primary,

                        "&.Mui-disabled":
                          {
                            color:
                              "#8A9891",
                          },
                      }}
                    >
                      {sendingOtp
                        ? "Sending..."
                        : resendTimer >
                          0
                        ? `Resend OTP (${formatTimer(
                            resendTimer
                          )})`
                        : "Resend OTP"}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            )}
        </Paper>

        {/* =================================================
            ALREADY SUBMITTED

            API:
            onboarding_status === SUBMITTED
        ================================================= */}

        {isAlreadySubmitted ? (
          <Paper
            elevation={0}
            sx={{
              mt: 1.5,

              p: {
                xs: 1.5,
                sm: 2,
              },

              border:
                "1px solid #CFE7DA",

              borderRadius:
                "12px",

              bgcolor:
                "#F7FCF9",
            }}
          >
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.3}
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
            >
              {/* ICON */}

              <Box
                sx={{
                  width: 42,
                  height: 42,

                  flexShrink: 0,

                  borderRadius:
                    "10px",

                  bgcolor:
                    COLORS.primaryLight,

                  color:
                    COLORS.primary,

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",
                }}
              >
                <CheckCircleRoundedIcon
                  sx={{
                    fontSize:
                      23,
                  }}
                />
              </Box>

              {/* CONTENT */}

              <Box
                sx={{
                  flex: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize:
                      "13px",

                    fontWeight:
                      700,

                    color:
                      COLORS.textPrimary,
                  }}
                >
                  Registration already submitted
                </Typography>

                <Typography
                  sx={{
                    mt: 0.3,

                    fontSize:
                      "10.5px",

                    lineHeight:
                      1.55,

                    color:
                      COLORS.textSecondary,
                  }}
                >
                  Your doctor registration has already been submitted successfully. Our verification team will review your details and documents.
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  sx={{
                    mt: 0.8,
                  }}
                >
                  <ScheduleRoundedIcon
                    sx={{
                      fontSize:
                        14,

                      color:
                        COLORS.primary,
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize:
                        "10px",

                      fontWeight:
                        600,

                      color:
                        COLORS.primary,
                    }}
                  >
                    Verification pending
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        ) : (
          /* ===============================================
             DECLARATION

             Only show BEFORE final submission.
          =============================================== */

          <Paper
            elevation={0}
            sx={{
              mt: 1.5,

              p: {
                xs: 1.4,
                sm: 1.7,
              },

              border: `1px solid ${
                agree
                  ? "#D8E8DF"
                  : "#F0E3BD"
              }`,

              borderRadius:
                "12px",

              bgcolor: agree
                ? "#FBFEFC"
                : COLORS.warningLight,
            }}
          >
            <Stack
              direction="row"
              spacing={1.1}
              alignItems="flex-start"
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,

                  borderRadius:
                    "9px",

                  flexShrink: 0,

                  bgcolor: agree
                    ? COLORS.primaryLight
                    : "#FFF1C7",

                  color: agree
                    ? COLORS.primary
                    : COLORS.warning,

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",
                }}
              >
                {agree ? (
                  <CheckCircleRoundedIcon
                    sx={{
                      fontSize:
                        20,
                    }}
                  />
                ) : (
                  <EmojiObjectsOutlinedIcon
                    sx={{
                      fontSize:
                        20,
                    }}
                  />
                )}
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{
                    fontSize:
                      "13px",

                    fontWeight:
                      700,

                    color:
                      COLORS.textPrimary,
                  }}
                >
                  Declaration
                </Typography>

                <Typography
                  sx={{
                    mt: 0.3,

                    fontSize:
                      "10.5px",

                    lineHeight:
                      1.55,

                    color:
                      COLORS.textSecondary,
                  }}
                >
                  I declare that the information and documents provided are true, accurate and complete. I understand that false information may result in rejection of my application or account termination.
                </Typography>

                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    mt: 0.5,
                    ml: -1,
                  }}
                >
                <Checkbox
  size="small"
  checked={agree}
  disabled={submitting || completed}
  onChange={(e) => setAgree(e.target.checked)}
  inputProps={{ "aria-label": "Agree to declaration" }}
  icon={
    <Box sx={{
      width: 18,
      height: 18,
      border: `2px solid ${COLORS.primary}`,
      borderRadius: "3px",
    }} />
  }
  checkedIcon={
    <Box sx={{
      width: 18,
      height: 18,
      bgcolor: COLORS.primary,
      border: `2px solid ${COLORS.primary}`,
      borderRadius: "3px",
      color: "#fff",
      display: "grid",
      placeItems: "center",
      fontSize: 14,
      lineHeight: 1,
    }}>
      ✓
    </Box>
  }
  sx={{
    p: 0.75,
    flexShrink: 0,
    "&.Mui-disabled": { opacity: 0.5 },
  }}
/>

                  <Typography
                    sx={{
                      fontSize:
                        "10.8px",

                      fontWeight:
                        600,

                      color:
                        COLORS.textPrimary,
                    }}
                  >
                    I agree to the above declaration
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        )}

        {/* =================================================
            BOTTOM ACTIONS
        ================================================= */}

        <Box
          sx={{
            mt: 1.5,

            pt: 1.5,

            borderTop: `1px solid ${COLORS.border}`,

            display: "flex",

            flexDirection: {
              xs: "column",
              sm: "row",
            },

            alignItems: {
              xs: "stretch",
              sm: "center",
            },

            justifyContent:
              "space-between",

            gap: 1.2,
          }}
        >
          {/* BACK */}

          <Button
            variant="outlined"
            startIcon={
              <ArrowBackIcon />
            }
            fullWidth={
              isMobile
            }
            onClick={onBack}
            disabled={
              completed ||
              submitting ||
              sendingOtp ||
              verifyingOtp
            }
            sx={{
              height: 40,

              px: 2.5,

              borderRadius:
                "8px",

              textTransform:
                "none",

              borderColor:
                COLORS.border,

              color:
                COLORS.textPrimary,

              fontSize:
                "11px",

              fontWeight:
                600,

              "&:hover": {
                borderColor:
                  COLORS.primary,

                bgcolor:
                  COLORS.primaryLight,
              },
            }}
          >
            Back
          </Button>

          {/* SECURITY */}

          <Stack
            direction="row"
            spacing={0.55}
            alignItems="center"
            justifyContent="center"
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
            }}
          >
            <LockOutlinedIcon
              sx={{
                fontSize: 14,

                color:
                  COLORS.textSecondary,
              }}
            />

            <Typography
              sx={{
                fontSize:
                  "9.5px",

                color:
                  COLORS.textSecondary,
              }}
            >
              Your information is secure and encrypted
            </Typography>
          </Stack>

          {/* =============================================
              SUBMIT BUTTON

              Hide completely after SUBMITTED.
          ============================================= */}

          {!isAlreadySubmitted ? (
            <Button
              variant="contained"
              fullWidth={
                isMobile
              }
              onClick={
                handleFinalSubmit
              }
              disabled={
                !agree ||
                !emailIsVerified ||
                completed ||
                submitting ||
                sendingOtp ||
                verifyingOtp
              }
              endIcon={
                submitting ? (
                  <CircularProgress
                    size={14}
                    color="inherit"
                  />
                ) : (
                  <SendOutlinedIcon
                    sx={{
                      fontSize:
                        "16px !important",
                    }}
                  />
                )
              }
              sx={{
                minWidth: {
                  sm: "200px",
                },

                height: 40,

                px: 2.7,

                borderRadius:
                  "8px",

                textTransform:
                  "none",

                bgcolor:
                  COLORS.primary,

                color:
                  COLORS.white,

                fontSize:
                  "11px",

                fontWeight:
                  700,

                boxShadow:
                  "none",

                "&:hover": {
                  bgcolor:
                    COLORS.primaryHover,

                  boxShadow:
                    "0 4px 12px rgba(27,110,79,0.15)",
                },

                "&.Mui-disabled":
                  {
                    bgcolor:
                      "#A8BDB3",

                    color:
                      COLORS.white,
                  },
              }}
            >
              {submitting
                ? "Submitting..."
                : "Submit for Verification"}
            </Button>
          ) : (
            /*
              After refresh + SUBMITTED
              show status instead of Submit.
            */
            <Stack
              direction="row"
              spacing={0.6}
              alignItems="center"
              justifyContent={{
                xs: "center",
                sm: "flex-end",
              }}
              sx={{
                minHeight:
                  "40px",

                px: 1.5,

                borderRadius:
                  "8px",

                bgcolor:
                  COLORS.primaryLight,
              }}
            >
              <CheckCircleRoundedIcon
                sx={{
                  fontSize: 16,

                  color:
                    COLORS.primary,
                }}
              />

              <Typography
                sx={{
                  fontSize:
                    "10.5px",

                  fontWeight:
                    700,

                  color:
                    COLORS.primary,
                }}
              >
                Submitted
              </Typography>
            </Stack>
          )}
        </Box>
      </Paper>

      {/* =================================================
          SUCCESS DIALOG

          Only immediately after fresh submission.
          Refresh par automatically open nahi hoga.
      ================================================= */}

      <Dialog
        open={completed}
        disableEscapeKeyDown
        onClose={(
          event,
          reason
        ) => {
          if (
            reason ===
              "backdropClick" ||
            reason ===
              "escapeKeyDown"
          ) {
            return;
          }
        }}
        PaperProps={{
          sx: {
            width: "100%",

            maxWidth: 430,

            mx: 2,

            borderRadius:
              "16px",

            overflow:
              "hidden",

            boxShadow:
              "0 20px 60px rgba(31,42,36,0.16)",
          },
        }}
      >
        <DialogContent
          sx={{
            p: {
              xs: 2.5,
              sm: 3.5,
            },

            textAlign:
              "center",
          }}
        >
          <Box
            sx={{
              width: 58,
              height: 58,

              borderRadius:
                "50%",

              bgcolor:
                COLORS.primaryLight,

              color:
                COLORS.primary,

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              mx: "auto",

              mb: 1.5,
            }}
          >
            <VerifiedOutlinedIcon
              sx={{
                fontSize: 30,
              }}
            />
          </Box>

          <Typography
            sx={{
              fontSize:
                "19px",

              fontWeight:
                700,

              color:
                COLORS.textPrimary,
            }}
          >
            Registration Submitted
          </Typography>

          <Typography
            sx={{
              mt: 0.8,

              fontSize:
                "11.5px",

              lineHeight:
                1.65,

              color:
                COLORS.textSecondary,
            }}
          >
            Your details and documents have been submitted for verification. Our team will review your application and notify you once verification is complete.
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              window.location.href =
                "/";
            }}
            sx={{
              mt: 2.5,

              height: 42,

              borderRadius:
                "9px",

              bgcolor:
                COLORS.primary,

              textTransform:
                "none",

              fontSize:
                "12px",

              fontWeight:
                700,

              boxShadow:
                "none",

              "&:hover": {
                bgcolor:
                  COLORS.primaryHover,

                boxShadow:
                  "none",
              },
            }}
          >
            Go to Home
          </Button>
        </DialogContent>
      </Dialog>

      {/* =================================================
          SNACKBAR

          All success/error messages only here.
      ================================================= */}

      <Snackbar
        open={
          snackbar.open
        }
        autoHideDuration={
          4000
        }
        onClose={
          handleCloseSnackbar
        }
        anchorOrigin={{
          vertical: "top",
          horizontal:
            "center",
        }}
      >
        <Alert
          onClose={
            handleCloseSnackbar
          }
          severity={
            snackbar.severity
          }
          variant="filled"
          sx={{
            width: "100%",

            minWidth: {
              xs: "280px",
              sm: "360px",
            },

            borderRadius:
              "9px",

            fontSize:
              "11.5px",

            fontWeight:
              600,
          }}
        >
          {
            snackbar.message
          }
        </Alert>
      </Snackbar>
    </>
  );
}