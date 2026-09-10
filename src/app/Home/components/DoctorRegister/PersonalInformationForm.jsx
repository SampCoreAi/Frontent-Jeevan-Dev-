
"use client";

import * as React from "react";

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import PersonOutlinedIcon from "@mui/icons-material/PersonOutline";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import OnboardingHeader from "./OnboardingHeader";

const COLORS = {
  primary: "#1B6E4F",
  primaryHover: "#15593E",
  primaryLight: "#E8F5EE",
  border: "#E6EBE8",
  inputBorder: "#DCE5E0",
  textPrimary: "#1F2A24",
  textSecondary: "#6B7A72",
  error: "#E0483C",
  white: "#FFFFFF",
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: COLORS.white,
    minHeight: "52px",

    "& fieldset": {
      borderColor: COLORS.inputBorder,
    },

    "&:hover fieldset": {
      borderColor: COLORS.primary,
    },

    "&.Mui-focused fieldset": {
      borderColor: COLORS.primary,
      borderWidth: "1.5px",
    },
  },

  "& .MuiInputBase-input": {
    fontSize: "14px",
  },

  "& .MuiFormHelperText-root": {
    marginLeft: "4px",
    marginTop: "6px",
    fontSize: "11px",
  },
};

export default function PersonalInfoForm({
  data,
  onChange,
  onNext,
  loading,
  errors = {},
}) {
  const handleChange = (field) => (e) => {
    onChange({
      [field]: e.target.value,
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        border: `1px solid ${COLORS.border}`,
        borderRadius: {
          xs: "14px",
          sm: "18px",
        },
        backgroundColor: COLORS.white,
        fontFamily:
          "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <OnboardingHeader />

      <Divider
        sx={{
          my: {
            xs: 2.5,
            sm: 3,
          },
          borderColor: COLORS.border,
        }}
      />

      <Grid
        container
        spacing={{
          xs: 2,
          sm: 2.5,
          md: 3,
        }}
      >
        {/* FULL NAME */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            sx={{
              fontWeight: 600,
              color: COLORS.textPrimary,
              mb: 0.8,
              fontSize: "14px",
            }}
          >
            Full Name{" "}
            <Box
              component="span"
              sx={{ color: COLORS.error }}
            >
              *
            </Box>
          </Typography>

          <TextField
            fullWidth
            placeholder="Enter your full name"
            value={data.fullName || ""}
            onChange={handleChange("fullName")}
            error={Boolean(errors.fullName)}
            helperText={
              errors.fullName ||
              "As per your medical registration"
            }
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: errors.fullName
                        ? COLORS.error
                        : COLORS.textSecondary,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* GENDER */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography
            sx={{
              fontWeight: 600,
              color: COLORS.textPrimary,
              mb: 0.8,
              fontSize: "14px",
            }}
          >
            Gender{" "}
            <Box
              component="span"
              sx={{ color: COLORS.error }}
            >
              *
            </Box>
          </Typography>

          <FormControl
            fullWidth
            error={Boolean(errors.gender)}
            sx={inputSx}
          >
            <Select
              displayEmpty
              value={data.gender || ""}
              onChange={handleChange("gender")}
              startAdornment={
                <InputAdornment position="start">
                  <Person2OutlinedIcon
                    fontSize="small"
                    sx={{
                      color: errors.gender
                        ? COLORS.error
                        : COLORS.textSecondary,
                    }}
                  />
                </InputAdornment>
              }
              renderValue={(selected) =>
                selected ? (
                  selected
                    .replaceAll("_", " ")
                    .replace(/\b\w/g, (c) =>
                      c.toUpperCase()
                    )
                ) : (
                  <Box
                    sx={{
                      color: COLORS.textSecondary,
                      fontSize: "14px",
                    }}
                  >
                    Select gender
                  </Box>
                )
              }
            >
              <MenuItem value="male">
                Male
              </MenuItem>

              <MenuItem value="female">
                Female
              </MenuItem>

              <MenuItem value="other">
                Other
              </MenuItem>
            </Select>

            {errors.gender && (
              <FormHelperText>
                {errors.gender}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* AGE */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography
            sx={{
              fontWeight: 600,
              color: COLORS.textPrimary,
              mb: 0.8,
              fontSize: "14px",
            }}
          >
            Age{" "}
            <Box
              component="span"
              sx={{ color: COLORS.error }}
            >
              *
            </Box>
          </Typography>

          <TextField
            fullWidth
            type="number"
            placeholder="Enter your age"
            value={data.age || ""}
            onChange={(e) => {
              const value = e.target.value;

              if (
                value === "" ||
                (/^\d+$/.test(value) &&
                  value.length <= 3)
              ) {
                onChange({
                  age: value,
                });
              }
            }}
            error={Boolean(errors.age)}
            helperText={errors.age || " "}
            sx={inputSx}
            inputProps={{
              min: 18,
              max: 100,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: errors.age
                        ? COLORS.error
                        : COLORS.textSecondary,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* EMAIL */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            sx={{
              fontWeight: 600,
              color: COLORS.textPrimary,
              mb: 0.8,
              fontSize: "14px",
            }}
          >
            Email Address{" "}
            <Box
              component="span"
              sx={{ color: COLORS.error }}
            >
              *
            </Box>
          </Typography>

          <TextField
            fullWidth
            type="email"
            placeholder="Enter your email address"
            value={data.email || ""}
            onChange={handleChange("email")}
            error={Boolean(errors.email)}
            helperText={
              errors.email ||
              "We'll use this email for important account updates"
            }
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon
                    fontSize="small"
                    sx={{
                      color: errors.email
                        ? COLORS.error
                        : COLORS.textSecondary,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* MOBILE */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            sx={{
              fontWeight: 600,
              color: COLORS.textPrimary,
              mb: 0.8,
              fontSize: "14px",
            }}
          >
            Mobile Number{" "}
            <Box
              component="span"
              sx={{ color: COLORS.error }}
            >
              *
            </Box>
          </Typography>

          <TextField
            fullWidth
            type="tel"
            placeholder="Enter mobile number"
            value={data.mobile || ""}
            onChange={(e) => {
              const value =
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10);

              onChange({
                mobile: value,
              });
            }}
            error={Boolean(errors.mobile)}
            helperText={
              errors.mobile ||
              "Enter your 10-digit mobile number"
            }
            sx={inputSx}
            inputProps={{
              maxLength: 10,
              inputMode: "numeric",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                  >
                    <PhoneOutlinedIcon
                      fontSize="small"
                      sx={{
                        color: errors.mobile
                          ? COLORS.error
                          : COLORS.textSecondary,
                      }}
                    />

                    <Typography
                      sx={{
                        color: COLORS.textPrimary,
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      +91
                    </Typography>
                  </Stack>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* NEXT BUTTON */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mt: {
            xs: 3,
            sm: 4,
          },
          pt: {
            xs: 2,
            sm: 2.5,
          },
          borderTop: `1px solid ${COLORS.border}`,
        }}
      >
        <Button
          variant="contained"
          onClick={onNext}
          disabled={loading}
          endIcon={
            loading ? (
              <CircularProgress
                size={18}
                color="inherit"
              />
            ) : (
              <ArrowForwardIcon />
            )
          }
          sx={{
            minWidth: {
              xs: "120px",
              sm: "145px",
            },

            height: {
              xs: "44px",
              sm: "48px",
            },

            px: 3,
            borderRadius: "10px",
            backgroundColor: COLORS.primary,
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 600,
            boxShadow: "none",

            "&:hover": {
              backgroundColor:
                COLORS.primaryHover,
              boxShadow:
                "0 4px 12px rgba(27, 110, 79, 0.18)",
            },

            "&.Mui-disabled": {
              backgroundColor: "#A8BDB3",
              color: "#FFFFFF",
            },
          }}
        >
          {loading ? "Saving..." : "Next"}
        </Button>
      </Box>
    </Paper>
  );
}
