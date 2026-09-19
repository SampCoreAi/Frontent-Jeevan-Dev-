
"use client";

import React, { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  Paper,
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

import axios from "axios";

import OnboardingHeader from "./OnboardingHeader";

const COLORS = {
  primary: "#1B6E4F",
  primaryHover: "#155A40",
  primaryLight: "#E8F5EE",
  border: "#E6EBE8",
  textPrimary: "#1F2A24",
  textSecondary: "#6B7A72",
};

const EMPTY_OTP = ["", "", "", "", "", ""];

export default function Verification({
  data,
  registrationId,
  onBack,
  onSubmit,
}) {
  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("sm")
  );

  // ==========================================
  // EMAIL
  // ==========================================

  const email = data?.email || "";

  // API se 1 aaye to already verified
  const apiEmailVerified =
    Number(data?.email_verified) === 1;

  // ==========================================
  // STATES
  // ==========================================

  const [agree, setAgree] = useState(false);

  const [otp, setOtp] = useState(EMPTY_OTP);

  const [otpSent, setOtpSent] = useState(false);

  const [otpVerified, setOtpVerified] = useState(
    apiEmailVerified
  );

  const [sendingOtp, setSendingOtp] = useState(false);

  const [verifyingOtp, setVerifyingOtp] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [completed, setCompleted] =
    useState(false);

  const otpRefs = useRef([]);

  // ==========================================
  // API EMAIL STATUS CHANGE
  // ==========================================

  useEffect(() => {
    const isVerified =
      Number(data?.email_verified) === 1;

    if (isVerified) {
      setOtpVerified(true);
      setOtpSent(false);
      setOtp(EMPTY_OTP);
    }
  }, [data?.email_verified]);

  // ==========================================
  // FINAL EMAIL VERIFIED STATUS
  // ==========================================

  const emailIsVerified =
    apiEmailVerified || otpVerified;

  // ==========================================
  // OTP VALUE
  // ==========================================

  const otpValue = otp.join("");

  // ==========================================
  // SEND OTP
  // ==========================================

  const handleSendOtp = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      // Already verified email par API hit nahi hogi
      if (emailIsVerified) {
        return;
      }

      if (!email) {
        setErrorMessage(
          "Email address not found."
        );
        return;
      }

      if (!registrationId) {
        setErrorMessage(
          "Registration ID not found."
        );
        return;
      }

      setSendingOtp(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/doctor-registration/send-email-otp`,
        {
          email,
        }
      );

  

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "OTP send failed."
        );
      }

      setOtpSent(true);

      setOtp(EMPTY_OTP);

     
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    } catch (error) {
      console.error(
        "SEND OTP ERROR:",
        error.response?.data ||
          error.message
      );

      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to send OTP."
      );
    } finally {
      setSendingOtp(false);
    }
  };

  // ==========================================
  // RESEND OTP
  // ==========================================

  const handleResendOtp = async () => {
    if (emailIsVerified) {
      return;
    }

    setOtp(EMPTY_OTP);

    await handleSendOtp();
  };

  // ==========================================
  // OTP CHANGE
  // ==========================================

  const handleOtpChange = (
    index,
    value
  ) => {
    const numericValue = value
      .replace(/\D/g, "")
      .slice(0, 1);

    const newOtp = [...otp];

    newOtp[index] = numericValue;

    setOtp(newOtp);

    setErrorMessage("");

    if (
      numericValue &&
      index < otp.length - 1
    ) {
      otpRefs.current[
        index + 1
      ]?.focus();
    }
  };

  // ==========================================
  // OTP BACKSPACE
  // ==========================================

  const handleOtpKeyDown = (
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

  // ==========================================
  // OTP PASTE
  // ==========================================

  const handleOtpPaste = (event) => {
    event.preventDefault();

    const pastedData =
      event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);

    if (!pastedData) return;

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
      .forEach((digit, index) => {
        newOtp[index] = digit;
      });

    setOtp(newOtp);

    const focusIndex = Math.min(
      pastedData.length,
      5
    );

    setTimeout(() => {
      otpRefs.current[
        focusIndex
      ]?.focus();
    }, 50);
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerifyOtp = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      if (emailIsVerified) {
        return;
      }

      if (!email) {
        setErrorMessage(
          "Email address not found."
        );
        return;
      }

      if (otpValue.length !== 6) {
        setErrorMessage(
          "Please enter complete 6-digit OTP."
        );
        return;
      }

      setVerifyingOtp(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/doctor-registration/verify-email-otp`,
        {
          email,
          otp: otpValue,
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Invalid OTP."
        );
      }

      setOtpVerified(true);

      setOtpSent(false);

      setOtp(EMPTY_OTP);

      setSuccessMessage(
        "Email verified successfully."
      );
    } catch (error) {
      console.error(
        "VERIFY OTP ERROR:",
        error.response?.data ||
          error.message
      );

      setOtpVerified(false);

      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setVerifyingOtp(false);
    }
  };

  // ==========================================
  // FINAL SUBMIT
  // ==========================================

  const handleFinalSubmit = () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!emailIsVerified) {
      setErrorMessage(
        "Please verify your email first."
      );
      return;
    }

    if (!agree) {
      setErrorMessage(
        "Please agree to the declaration."
      );
      return;
    }

    setCompleted(true);

   

    // Agar parent me submit API chalani ho:
    // onSubmit?.();
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 1.5,
          sm: 2.5,
          md: 4,
        },

        border: "1px solid",
        borderColor: COLORS.border,

        borderRadius: {
          xs: 2,
          md: 3,
        },

        width: "100%",
      }}
    >
      <OnboardingHeader />

      {/* ====================================== */}
      {/* EMAIL VERIFICATION */}
      {/* ====================================== */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },

          borderRadius: 0,

          bgcolor:
            COLORS.primaryLight,

          border: `1px solid ${COLORS.border}`,

          mb: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={{
            xs: 2,
            md: 4,
          }}
          alignItems={{
            xs: "stretch",
            md: "center",
          }}
        >
          {/* LEFT */}

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Typography
              fontWeight={700}
              color={
                COLORS.textPrimary
              }
              sx={{
                fontSize: {
                  xs: 18,
                  sm: 20,
                },
              }}
            >
              Email Verification
            </Typography>

            <Typography
              variant="body2"
              color={
                COLORS.textSecondary
              }
              sx={{
                mt: 0.7,
              }}
            >
              Verify your email address
              before submitting your doctor
              registration.
            </Typography>

            <Typography
              variant="body1"
              fontWeight={700}
              sx={{
                mt: 1.5,
                wordBreak:
                  "break-word",
              }}
            >
              {email ||
                "Email not available"}
            </Typography>

            {/* VERIFIED */}

            {emailIsVerified ? (
              <Box
                sx={{
                  mt: 1.5,
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 0.7,
                }}
              >
                <VerifiedOutlinedIcon
                  sx={{
                    color:
                      COLORS.primary,
                    fontSize: 21,
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{
                    color:
                      COLORS.primary,
                    fontWeight: 700,
                  }}
                >
                  Email verified
                  successfully
                </Typography>
              </Box>
            ) : (
              <Button
                variant="contained"
                startIcon={
                  <MarkEmailReadOutlinedIcon />
                }
                onClick={
                  otpSent
                    ? handleResendOtp
                    : handleSendOtp
                }
                disabled={
                  sendingOtp ||
                  !email ||
                  !registrationId
                }
                sx={{
                  mt: 1.5,

                  bgcolor:
                    COLORS.primary,

                  textTransform:
                    "none",

                  borderRadius: 2,

                  px: 4,

                  minWidth: 195,

                  fontWeight: 700,

                  "&:hover": {
                    bgcolor:
                      COLORS.primaryHover,
                  },

                  "&.Mui-disabled": {
                    bgcolor:
                      "#A0B8AD",
                    color: "#FFFFFF",
                  },
                }}
              >
                {sendingOtp
                  ? "Sending OTP..."
                  : otpSent
                  ? "Resend OTP"
                  : "Send OTP"}
              </Button>
            )}
          </Box>

          {/* ================================== */}
          {/* OTP BOX */}
          {/* ================================== */}

          {otpSent &&
            !emailIsVerified && (
              <Box
                sx={{
                  flex: 1,

                  minWidth: 0,

                  bgcolor:
                    "rgba(255,255,255,0.45)",

                  p: {
                    xs: 2,
                    sm: 2.5,
                    md: 3,
                  },

                  borderRadius: 0,

                  border:
                    "1px solid rgba(255,255,255,0.6)",

                  boxShadow:
                    "0 10px 30px rgba(31,42,36,0.08)",
                }}
              >
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  alignItems={{
                    xs: "flex-start",
                    sm: "center",
                  }}
                  spacing={{
                    xs: 0.5,
                    sm: 2,
                  }}
                  sx={{
                    mb: 2.5,
                  }}
                >
                  <Typography
                    fontWeight={700}
                    color={
                      COLORS.textPrimary
                    }
                    sx={{
                      fontSize: {
                        xs: 18,
                        sm: 20,
                      },

                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    Verify Email
                  </Typography>

                  <Typography
                    variant="body1"
                    color={
                      COLORS.textPrimary
                    }
                  >
                    (We have sent a
                    6-digit OTP)
                  </Typography>
                </Stack>

                {/* OTP INPUTS */}

                <Stack
                  direction="row"
                  spacing={{
                    xs: 0.7,
                    sm: 1.2,
                    md: 1.5,
                  }}
                  justifyContent="flex-start"
                >
                  {otp.map(
                    (
                      digit,
                      index
                    ) => (
                      <TextField
                        key={index}
                        inputRef={(
                          element
                        ) => {
                          otpRefs.current[
                            index
                          ] =
                            element;
                        }}
                        value={digit}
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
                          index === 0
                            ? handleOtpPaste
                            : undefined
                        }
                        variant="outlined"
                        inputProps={{
                          maxLength: 1,

                          inputMode:
                            "numeric",

                          style: {
                            textAlign:
                              "center",

                            fontSize: 22,

                            fontWeight:
                              700,

                            padding: 0,
                          },
                        }}
                        sx={{
                          width: {
                            xs: 38,
                            sm: 52,
                            md: 62,
                          },

                          "& .MuiOutlinedInput-root":
                            {
                              height:
                                {
                                  xs: 44,
                                  sm: 52,
                                  md: 62,
                                },

                              borderRadius:
                                0,

                              bgcolor:
                                "#FFFFFF",

                              "& fieldset":
                                {
                                  borderColor:
                                    "#E6EBE8",
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
                                    2,
                                },
                            },
                        }}
                      />
                    )
                  )}
                </Stack>

                <Button
                  variant="contained"
                  onClick={
                    handleVerifyOtp
                  }
                  disabled={
                    verifyingOtp ||
                    otpValue.length !==
                      6
                  }
                  sx={{
                    mt: 2,

                    bgcolor:
                      COLORS.primary,

                    textTransform:
                      "none",

                    borderRadius: 2,

                    px: 3,

                    fontWeight: 700,

                    "&:hover": {
                      bgcolor:
                        COLORS.primaryHover,
                    },

                    "&.Mui-disabled":
                      {
                        bgcolor:
                          "#A0B8AD",

                        color:
                          "#FFFFFF",
                      },
                  }}
                >
                  {verifyingOtp
                    ? "Verifying..."
                    : "Verify OTP"}
                </Button>
              </Box>
            )}
        </Stack>

        {/* MESSAGES */}

        {errorMessage && (
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: "#D32F2F",
              fontWeight: 600,
            }}
          >
            {errorMessage}
          </Typography>
        )}

        {successMessage && (
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: COLORS.primary,
              fontWeight: 600,
            }}
          >
            {successMessage}
          </Typography>
        )}
      </Paper>

      {/* ====================================== */}
      {/* DECLARATION */}
      {/* ====================================== */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 1.5,
            sm: 2,
            md: 2.5,
          },

          borderRadius: 2,

          bgcolor: "#FFF9EC",

          border:
            "1px solid #F5E3B3",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={{
            xs: 1.5,
            sm: 2,
          }}
          alignItems="flex-start"
        >
          <Box
            sx={{
              width: {
                xs: 32,
                sm: 38,
              },

              height: {
                xs: 32,
                sm: 38,
              },

              borderRadius: "50%",

              bgcolor: "#FFF1C7",

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              color: "#E6A700",

              flexShrink: 0,
            }}
          >
            <EmojiObjectsOutlinedIcon />
          </Box>

          <Box
            flex={1}
            width="100%"
          >
            <Typography
              fontWeight={700}
              color={
                COLORS.textPrimary
              }
              variant="h6"
            >
              Declaration
            </Typography>

            <Typography
              variant="body2"
              color={
                COLORS.textSecondary
              }
              sx={{
                mt: 0.5,
              }}
            >
              I hereby declare that all
              the information provided
              above is true, accurate and
              complete to the best of my
              knowledge.
            </Typography>

            <Typography
              variant="body2"
              color={
                COLORS.textSecondary
              }
              sx={{
                mt: 0.5,
              }}
            >
              I understand that any
              false information may lead
              to rejection of my
              application or termination
              of my account.
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              sx={{
                mt: 1.5,
              }}
            >
              <Checkbox
                checked={agree}
                onChange={(e) => {
                  setAgree(
                    e.target.checked
                  );

                  setErrorMessage(
                    ""
                  );
                }}
                sx={{
                  color:
                    COLORS.primary,

                  "&.Mui-checked":
                    {
                      color:
                        COLORS.primary,
                    },
                }}
              />

              <Typography
                variant="body2"
                fontWeight={600}
              >
                I agree to the above
                declaration
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* ====================================== */}
      {/* BOTTOM ACTIONS */}
      {/* ====================================== */}

      <Box
        sx={{
          mt: {
            xs: 2,
            sm: 3,
            md: 4,
          },

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

          gap: {
            xs: 1.5,
            sm: 2,
          },
        }}
      >
        <Button
          variant="outlined"
          startIcon={
            <ArrowBackIcon />
          }
          fullWidth={isMobile}
          onClick={onBack}
          disabled={completed}
          sx={{
            px: {
              xs: 2,
              sm: 3,
              md: 4,
            },

            py: {
              xs: 1,
              sm: 1.2,
            },

            borderRadius: 2,

            textTransform:
              "none",

            borderColor:
              COLORS.primary,

            color:
              COLORS.primary,

            "&:hover": {
              borderColor:
                COLORS.primaryHover,

              backgroundColor:
                "transparent",
            },
          }}
        >
          Back
        </Button>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
        >
          <LockOutlinedIcon
            sx={{
              fontSize: 16,

              color:
                COLORS.textSecondary,
            }}
          />

          <Typography
            variant="caption"
            color={
              COLORS.textSecondary
            }
          >
            {isMobile
              ? "Secure & Encrypted"
              : "Your information is secure and encrypted"}
          </Typography>
        </Stack>

        <Button
          disabled={
            !agree ||
            !emailIsVerified ||
            completed
          }
          variant="contained"
          endIcon={
            <SendOutlinedIcon />
          }
          fullWidth={isMobile}
          onClick={
            handleFinalSubmit
          }
          sx={{
            px: {
              xs: 3,
              sm: 4,
              md: 5,
            },

            py: {
              xs: 1,
              sm: 1.3,
            },

            borderRadius: 2,

            textTransform:
              "none",

            bgcolor:
              COLORS.primary,

            "&:hover": {
              bgcolor:
                COLORS.primaryHover,
            },

            "&.Mui-disabled": {
              bgcolor:
                "#A0B8AD",

              color: "#FFFFFF",
            },
          }}
        >
          {completed
            ? "Completed"
            : "Submit for Verification"}
        </Button>
      </Box>

      {/* ====================================== */}
      {/* SUCCESS DIALOG */}
      {/* ====================================== */}

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
            maxWidth: 520,
            borderRadius: 3,
            mx: 2,
            overflow: "hidden",
          },
        }}
      >
        <DialogContent
          sx={{
            p: {
              xs: 3,
              sm: 4,
            },

            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,

              borderRadius:
                "50%",

              bgcolor:
                COLORS.primaryLight,

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              mx: "auto",

              mb: 2,
            }}
          >
            <VerifiedOutlinedIcon
              sx={{
                color:
                  COLORS.primary,

                fontSize: 34,
              }}
            />
          </Box>

          <Typography
            variant="h5"
            fontWeight={700}
            color={
              COLORS.textPrimary
            }
          >
            What happens next?
          </Typography>

          <Typography
            variant="body1"
            color={
              COLORS.textSecondary
            }
            sx={{
              mt: 1.5,
              lineHeight: 1.7,
            }}
          >
            Once you submit, our
            verification team will
            review your details and
            documents. We will contact
            you within 24 hours. You
            will receive an email/SMS
            once your account is
            verified.
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              window.location.href =
                "/";
            }}
            sx={{
              mt: 3,

              py: 1.3,

              bgcolor:
                COLORS.primary,

              textTransform:
                "none",

              borderRadius: 2,

              fontWeight: 700,

              "&:hover": {
                bgcolor:
                  COLORS.primaryHover,
              },
            }}
          >
            Home Page
          </Button>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}