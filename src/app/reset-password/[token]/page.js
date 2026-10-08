  "use client";

  import { useParams, useRouter } from "next/navigation";
  import { useState } from "react";

  import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    CircularProgress,
    InputAdornment,
    IconButton,
    Snackbar,
    Alert,
    Avatar,
  } from "@mui/material";

  import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
  import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
  import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
  import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
  import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
  import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

  import axios from "axios";

  export default function ResetPassword() {
    const { token } = useParams();
    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
const [linkError, setLinkError] = useState("");
    const [errors, setErrors] = useState({
      password: "",
      confirmPassword: "",
    });

    const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "success",
    });

    // =========================================================
    // SNACKBAR
    // =========================================================

    const showMessage = (message, severity = "success") => {
      setSnackbar({
        open: true,
        message,
        severity,
      });
    };

    const handleCloseSnackbar = () => {
      setSnackbar((prev) => ({
        ...prev,
        open: false,
      }));
    };

    // =========================================================
    // PASSWORD RULES
    // =========================================================

    const passwordRules = [
      {
        label: "At least 8 characters",
        valid: password.length >= 8,
      },
      {
        label: "One uppercase letter",
        valid: /[A-Z]/.test(password),
      },
      {
        label: "One lowercase letter",
        valid: /[a-z]/.test(password),
      },
      {
        label: "One number",
        valid: /[0-9]/.test(password),
      },
      {
        label: "One special character",
        valid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      },
    ];

    // =========================================================
    // VALIDATION
    // =========================================================

    const validatePassword = (value) => {
      if (!value) {
        return "New password is required";
      }

      if (value.length < 8) {
        return "Password must be at least 8 characters";
      }

      if (!/[A-Z]/.test(value)) {
        return "Password must contain an uppercase letter";
      }

      if (!/[a-z]/.test(value)) {
        return "Password must contain a lowercase letter";
      }

      if (!/[0-9]/.test(value)) {
        return "Password must contain a number";
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        return "Password must contain a special character";
      }

      return "";
    };

    const validateForm = () => {
      const newErrors = {
        password: "",
        confirmPassword: "",
      };

      newErrors.password = validatePassword(password);

      if (!confirmPassword) {
        newErrors.confirmPassword = "Confirm password is required";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      setErrors(newErrors);

      return !newErrors.password && !newErrors.confirmPassword;
    };

    // =========================================================
    // PASSWORD CHANGE
    // =========================================================

    const handlePasswordChange = (event) => {
      const value = event.target.value;

      setPassword(value);

      if (errors.password) {
        setErrors((prev) => ({
          ...prev,
          password: "",
        }));
      }

      if (confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword:
            value === confirmPassword ? "" : "Passwords do not match",
        }));
      }
    };

    const handleConfirmPasswordChange = (event) => {
      const value = event.target.value;

      setConfirmPassword(value);

      if (!value) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "",
        }));
        return;
      }

      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value === password ? "" : "Passwords do not match",
      }));
    };

    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async () => {
      if (loading) return;

      const isValid = validateForm();

      if (!isValid) {
        return;
      }

      if (!token) {
        showMessage(
          "Invalid or missing password reset link.",
          "error"
        );
        return;
      }

      if (!API_URL) {
        showMessage("API URL is not configured.", "error");
        return;
      }

      try {
        setLoading(true);

        const response = await axios.post(
          `${API_URL}/api/auth/reset-password`,
          {
            token,
            password,
          }
        );

        showMessage(
          response?.data?.message ||
            "Password reset successfully. Redirecting to login...",
          "success"
        );

        setTimeout(() => {
          router.replace("/Home/pages/Login");
        }, 1500);
      } catch (error) {
        console.error("Reset password error:", error);

        if (!error.response) {
          showMessage(
            "Network error. Please check your internet connection.",
            "error"
          );
          return;
        }
const message = error.response?.data?.message || "";

if (/token/i.test(message) && /used|invalid|expired/i.test(message)) {
  setLinkError(message);
  setPassword("");
  setConfirmPassword("");
  return;
}
        const status = error.response?.status;

        if (status === 400) {
          showMessage(
            error.response?.data?.message ||
              "Invalid password reset request.",
            "error"
          );
          return;
        }

        if (status === 401) {
          showMessage(
            error.response?.data?.message ||
              "This reset link is invalid or has expired.",
            "error"
          );
          return;
        }

        if (status === 404) {
          showMessage(
            error.response?.data?.message ||
              "Password reset request was not found.",
            "error"
          );
          return;
        }

        if (status >= 500) {
          showMessage(
            "Server error. Please try again later.",
            "error"
          );
          return;
        }

        showMessage(
          error.response?.data?.message ||
            "Failed to reset password.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    // =========================================================
    // INPUT STYLE
    // =========================================================

    const inputSx = {
      "& .MuiOutlinedInput-root": {
        height: 48,
        borderRadius: "10px",
        backgroundColor: "#FFFFFF",
        fontSize: "13px",

        "& fieldset": {
          borderColor: "#DCE6E2",
        },

        "&:hover fieldset": {
          borderColor: "#9ABDB2",
        },

        "&.Mui-focused": {
          boxShadow: "0 0 0 3px rgba(7,135,106,0.06)",
        },

        "&.Mui-focused fieldset": {
          borderColor: "#07876A",
          borderWidth: "1.5px",
        },

        "&.Mui-error fieldset": {
          borderColor: "#D14343",
        },
      },

      "& .MuiInputBase-input": {
        fontSize: "13px",

        "&::placeholder": {
          color: "#8B9893",
          opacity: 1,
        },
      },

      "& .MuiFormHelperText-root": {
        mx: 0.2,
        mt: 0.6,
        fontSize: "11px",
      },
    };
if (linkError) {
  return (
    <Box sx={{ maxWidth: 440, mx: "auto", mt: 10, p: 3, textAlign: "center" }}>
      <Typography variant="h5">Reset link unavailable</Typography>

      <Alert severity="warning" sx={{ my: 3 }}>
        {linkError}
      </Alert>

      <Button
        variant="contained"
        onClick={() => router.replace("/Home/pages/Login")}
      >
        Go to Login
      </Button>

      <Typography sx={{ mt: 2, fontSize: 13 }}>
        Naya link lene ke liye Login page par Forgot Password click karein.
      </Typography>
    </Box>
  );
}
    return (
      <>
        <Box
          sx={{
            minHeight: "100vh",
            width: "100%",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            px: {
              xs: 2,
              sm: 3,
            },

            py: 4,

            position: "relative",
            overflow: "hidden",

          
      backgroundImage: `
        linear-gradient(
          90deg,
          rgba(7, 135, 106, 0.13) 0%,
          rgba(7, 135, 106, 0.04) 25%,
          rgba(255, 255, 255, 0.96) 45%,
          rgba(255, 255, 255, 0.96) 55%,
          rgba(7, 135, 106, 0.04) 75%,
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

      backgroundSize: `
        100% 100%,
        40px 40px,
        40px 40px,
        40px 40px
      `,

      backgroundPosition: `
        center,
        0 0,
        0 0,
        0 0
      `,

      backgroundAttachment: "fixed",
          }}
        >
          {/* BACKGROUND GLOW */}

          <Box
            sx={{
              position: "absolute",

              width: {
                xs: 300,
                md: 500,
              },

              height: {
                xs: 300,
                md: 500,
              },

              borderRadius: "50%",

              background:
                "rgba(7, 135, 106, 0.055)",

              filter: "blur(100px)",

              pointerEvents: "none",
            }}
          />

          {/* =================================================
              MAIN CARD
          ================================================= */}

          <Paper
            elevation={0}
            sx={{
              position: "relative",
              zIndex: 1,

              width: "100%",
              maxWidth: 760,

              p: {
                xs: 2.5,
                sm: 3,
                md: 3.5,
              },

              borderRadius: "20px",

              backgroundColor:
                "rgba(255,255,255,0.97)",

              border:
                "1px solid rgba(7,135,106,0.13)",

              boxShadow:
                "0 24px 70px rgba(23,32,51,0.10)",

              backdropFilter: "blur(12px)",
            }}
          >
            {/* =================================================
                JEEVAN DEV BRAND
            ================================================= */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 1.7,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Avatar
                  src="/img/icon.png"
                  alt="Jeevan Dev"
                  variant="rounded"
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "10px",
                    bgcolor: "#FFFFFF",
                  }}
                />

                <Box>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      lineHeight: 1.1,
                      fontWeight: 700,
                      color: "#172033",
                    }}
                  >
                    Jeevan Dev
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.25,
                      fontSize: "9.5px",
                      lineHeight: 1,
                      color: "#82908A",
                      letterSpacing: "0.04em",
                    }}
                  >
                    HEALTHCARE
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* =================================================
                HEADING
            ================================================= */}

            <Typography
              sx={{
                textAlign: "center",

                color: "#172033",

                fontSize: {
                  xs: "23px",
                  sm: "27px",
                },

                lineHeight: 1.15,
                fontWeight: 700,
                letterSpacing: "-0.6px",
              }}
            >
              Create new password
            </Typography>

            <Typography
              sx={{
                mt: 0.7,
                mb: 3,

                textAlign: "center",

                color: "#738079",

                fontSize: "12.5px",
                lineHeight: 1.55,
              }}
            >
              Choose a secure password for your Jeevan Dev account.
            </Typography>

            {/* =================================================
                TWO COLUMN CONTENT
            ================================================= */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1.25fr 0.85fr",
                },

                gap: {
                  xs: 2.5,
                  md: 3,
                },

                alignItems: "stretch",
              }}
            >
              {/* =================================================
                  LEFT - PASSWORD FIELDS
              ================================================= */}

              <Box>
                {/* NEW PASSWORD */}

                <Typography
                  sx={{
                    mb: 0.7,
                    color: "#34413B",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  New Password
                </Typography>

                <TextField
                  fullWidth
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter new password"
                  value={password}
                  onChange={handlePasswordChange}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  autoComplete="new-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon
                          sx={{
                            fontSize: 18,
                            color: "#07876A",
                          }}
                        />
                      </InputAdornment>
                    ),

                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          size="small"
                          edge="end"
                          onClick={() =>
                            setShowPassword(
                              (prev) => !prev
                            )
                          }
                        >
                          {showPassword ? (
                            <VisibilityOffOutlinedIcon
                              sx={{
                                fontSize: 19,
                                color: "#697771",
                              }}
                            />
                          ) : (
                            <VisibilityOutlinedIcon
                              sx={{
                                fontSize: 19,
                                color: "#697771",
                              }}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    ...inputSx,

                    mb: errors.password
                      ? 1.5
                      : 2.2,
                  }}
                />

                {/* CONFIRM PASSWORD */}

                <Typography
                  sx={{
                    mb: 0.7,
                    color: "#34413B",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  Confirm Password
                </Typography>

                <TextField
                  fullWidth
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={
                    handleConfirmPasswordChange
                  }
                  error={Boolean(
                    errors.confirmPassword
                  )}
                  helperText={
                    errors.confirmPassword
                  }
                  autoComplete="new-password"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon
                          sx={{
                            fontSize: 18,
                            color: "#07876A",
                          }}
                        />
                      </InputAdornment>
                    ),

                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          size="small"
                          edge="end"
                          onClick={() =>
                            setShowConfirmPassword(
                              (prev) => !prev
                            )
                          }
                        >
                          {showConfirmPassword ? (
                            <VisibilityOffOutlinedIcon
                              sx={{
                                fontSize: 19,
                                color: "#697771",
                              }}
                            />
                          ) : (
                            <VisibilityOutlinedIcon
                              sx={{
                                fontSize: 19,
                                color: "#697771",
                              }}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Box>

              {/* =================================================
                  RIGHT - PASSWORD RULES
              ================================================= */}

              <Box
                sx={{
                  p: {
                    xs: 1.8,
                    md: 2,
                  },

                  borderRadius: "13px",

                  backgroundColor:
                    "rgba(7,135,106,0.045)",

                  border:
                    "1px solid rgba(7,135,106,0.12)",

                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    mb: 1.4,

                    color: "#34413B",

                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  Password must contain
                </Typography>

                {passwordRules.map(
                  (rule, index) => {
                    const RuleIcon = rule.valid
                      ? CheckCircleRoundedIcon
                      : RadioButtonUncheckedRoundedIcon;

                    return (
                      <Box
                        key={rule.label}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.9,

                          mb:
                            index ===
                            passwordRules.length - 1
                              ? 0
                              : 1.05,
                        }}
                      >
                        <RuleIcon
                          sx={{
                            fontSize: 16,

                            color: rule.valid
                              ? "#07876A"
                              : "#A5B1AC",

                            transition:
                              "all 0.2s ease",
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: "11.5px",

                            color: rule.valid
                              ? "#07876A"
                              : "#6F7D77",

                            fontWeight: rule.valid
                              ? 600
                              : 400,

                            transition:
                              "all 0.2s ease",
                          }}
                        >
                          {rule.label}
                        </Typography>
                      </Box>
                    );
                  }
                )}
              </Box>
            </Box>

            {/* =================================================
                RESET BUTTON
            ================================================= */}

            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                mt: 3,

                minHeight: 46,

                borderRadius: "10px",

                backgroundColor: "#07876A",

                color: "#FFFFFF",

                fontSize: "13px",
                fontWeight: 650,

                textTransform: "none",

                boxShadow:
                  "0 7px 20px rgba(7,135,106,0.20)",

                transition: "all 0.2s ease",

                "&:hover": {
                  backgroundColor: "#066F58",

                  boxShadow:
                    "0 9px 24px rgba(7,135,106,0.25)",
                },

                "&:active": {
                  transform: "scale(0.995)",
                },

                "&.Mui-disabled": {
                  backgroundColor: "#07876A",
                  color: "#FFFFFF",
                  opacity: 0.7,
                },
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <CircularProgress
                    size={17}
                    thickness={5}
                    sx={{
                      color: "inherit",
                    }}
                  />

                  <Typography
                    component="span"
                    sx={{
                      color: "inherit",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    Resetting password...
                  </Typography>
                </Box>
              ) : (
                "Reset Password"
              )}
            </Button>

            {/* =================================================
                BACK LOGIN
            ================================================= */}

            <Button
              fullWidth
              type="button"
              variant="text"
              disabled={loading}
              startIcon={
                <ArrowBackRoundedIcon
                  sx={{
                    fontSize: "16px !important",
                  }}
                />
              }
              onClick={() =>
                router.push("/Home/pages/Login")
              }
              sx={{
                mt: 1,

                color: "#6F7D77",

                fontSize: "12px",
                fontWeight: 500,

                textTransform: "none",

                "&:hover": {
                  color: "#07876A",
                  backgroundColor: "transparent",
                },
              }}
            >
              Back to login
            </Button>
          </Paper>
        </Box>

        {/* =====================================================
            SNACKBAR
        ===================================================== */}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={handleCloseSnackbar}
            variant="filled"
            sx={{
              width: "100%",
              minWidth: {
                xs: "auto",
                sm: 330,
              },
              borderRadius: "10px",
              fontSize: "12.5px",
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </>
    );
  }