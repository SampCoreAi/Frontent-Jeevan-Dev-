"use client";

import * as React from "react";

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

/* =========================================================
   COLORS
========================================================= */

const C = {
  primary: "#07876A",
  hover: "#066F58",
  text: "#172033",
  muted: "#74807B",
  border: "#DDE9E5",
  input: "#CBD5E1",
  error: "#E5484D",
  white: "#FFFFFF",
};

/* =========================================================
   INPUT STYLE
========================================================= */

const inputSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 46,
    borderRadius: "8px",
    backgroundColor: "#fff",

    "& fieldset": {
      borderColor: C.input,
    },

    "&:hover fieldset": {
      borderColor: "#9CB7AF",
    },

    "&.Mui-focused fieldset": {
      borderColor: C.primary,
      borderWidth: "1px",
    },
  },

  "& .MuiInputBase-input": {
    fontSize: "12px",
    py: 1.2,
  },

  "& .MuiFormHelperText-root": {
    fontSize: "10px",
    mx: 0.5,
  },
};

/* =========================================================
   LABEL
========================================================= */

function Label({ children, optional = false }) {
  return (
    <Typography
      sx={{
        mb: 0.6,
        fontSize: "12px",
        fontWeight: 600,
        color: C.text,
      }}
    >
      {children}

      {optional ? (
        <Box
          component="span"
          sx={{
            color: C.muted,
            fontWeight: 400,
          }}
        >
          {" "}
          (Optional)
        </Box>
      ) : (
        <Box
          component="span"
          sx={{
            color: C.error,
          }}
        >
          {" "}
          *
        </Box>
      )}
    </Typography>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function StoreInformationForm({
  data,
  onChange,
  onNext,
  loading,
}) {
  const [errors, setErrors] = React.useState({});

  /* =======================================================
     UPDATE FIELD
  ======================================================= */

  const setField = (field, value) => {
    onChange({
      [field]: value,
    });

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validate = () => {
    const nextErrors = {};

    if (!String(data.storeName || "").trim()) {
      nextErrors.storeName =
        "Medical Store / Pharmacy Name is required";
    }

    if (!String(data.pharmacyCategory || "").trim()) {
      nextErrors.pharmacyCategory =
        "Pharmacy Category / Type is required";
    }

    if (!String(data.email || "").trim()) {
      nextErrors.email = "Store Contact Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!String(data.phone || "").trim()) {
      nextErrors.phone =
        "Primary Contact Phone Number is required";
    } else if (!/^[6-9]\d{9}$/.test(data.phone)) {
      nextErrors.phone =
        "Enter a valid 10-digit mobile number";
    }

    if (
      data.alternatePhone &&
      !/^[6-9]\d{9}$/.test(data.alternatePhone)
    ) {
      nextErrors.alternatePhone =
        "Enter a valid 10-digit mobile number";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  /* =======================================================
     NEXT
  ======================================================= */

  const handleNext = () => {
    if (!validate()) return;

    onNext();
  };

  /* =======================================================
     ICON
  ======================================================= */

  const icon = (Icon) => (
    <InputAdornment position="start">
      <Icon
        sx={{
          fontSize: 17,
          color: C.muted,
        }}
      />
    </InputAdornment>
  );

  /* =======================================================
     UI
  ======================================================= */

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            md: 2.5,
          },
          border: `1px solid ${C.border}`,
          borderRadius: "12px",
          bgcolor: C.white,
        }}
      >
        {/* ================= HEADER ================= */}

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
        >
          <StorefrontOutlinedIcon
            sx={{
              color: C.primary,
              fontSize: 22,
            }}
          />

          <Box>
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 750,
                color: C.text,
              }}
            >
              Store Information
            </Typography>

            <Typography
              sx={{
                mt: 0.1,
                fontSize: "10.5px",
                color: C.muted,
              }}
            >
              Enter the basic details of your medical store or
              pharmacy.
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 1.6 }} />

        {/* ================= FORM ================= */}

        <Grid container spacing={2}>
          {/* STORE NAME */}


{/* OWNER NAME */}
<Grid size={{ xs: 12, md: 6 }}>
  <Label>Owner Full Name</Label>

  <TextField
    fullWidth
    placeholder="e.g. Rahul Sharma"
    value={data.ownerName || ""}
    onChange={(e) => setField("ownerName", e.target.value)}
    error={Boolean(errors.ownerName)}
    helperText={errors.ownerName}
    sx={inputSx}
  />
</Grid>

{/* OWNER EMAIL */}
<Grid size={{ xs: 12, md: 6 }}>
  <Label>Owner Email Address</Label>

  <TextField
    fullWidth
    type="email"
    placeholder="e.g. rahul@gmail.com"
    value={data.ownerEmail || ""}
    onChange={(e) =>
      setField("ownerEmail", e.target.value.replace(/\s/g, ""))
    }
    error={Boolean(errors.ownerEmail)}
    helperText={errors.ownerEmail}
    sx={inputSx}
    InputProps={{
      startAdornment: icon(MailOutlineIcon),
    }}
  />
</Grid>

{/* OWNER PHONE */}
<Grid size={{ xs: 12, md: 6 }}>
  <Label>Owner Phone Number</Label>

  <TextField
    fullWidth
    placeholder="9876543210"
    value={data.ownerPhone || ""}
    onChange={(e) =>
      setField(
        "ownerPhone",
        e.target.value.replace(/\D/g, "").slice(0, 10)
      )
    }
    error={Boolean(errors.ownerPhone)}
    helperText={errors.ownerPhone}
    sx={inputSx}
    inputProps={{
      inputMode: "numeric",
      maxLength: 10,
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <PhoneOutlinedIcon
            sx={{
              fontSize: 17,
              color: C.muted,
              mr: 1,
            }}
          />

          <Typography
            sx={{
              fontSize: "12px",
              color: C.text,
            }}
          >
            +91
          </Typography>
        </InputAdornment>
      ),
    }}
  />
</Grid>

{/* OWNER AGE */}
<Grid size={{ xs: 12, md: 3 }}>
  <Label>Owner Age</Label>

  <TextField
    fullWidth
    placeholder="e.g. 35"
    value={data.ownerAge || ""}
    onChange={(e) =>
      setField(
        "ownerAge",
        e.target.value.replace(/\D/g, "").slice(0, 3)
      )
    }
    error={Boolean(errors.ownerAge)}
    helperText={errors.ownerAge}
    sx={inputSx}
    inputProps={{
      inputMode: "numeric",
      maxLength: 3,
    }}
  />
</Grid>

{/* OWNER GENDER */}
<Grid size={{ xs: 12, md: 3 }}>
  <Label>Owner Gender</Label>

  <FormControl
    fullWidth
    error={Boolean(errors.ownerGender)}
  >
    <Select
      displayEmpty
      value={data.ownerGender || ""}
      onChange={(e) =>
        setField("ownerGender", e.target.value)
      }
      sx={{
        height: 46,
        borderRadius: "8px",
        fontSize: "12px",

        "& fieldset": {
          borderColor: C.input,
        },

        "&:hover fieldset": {
          borderColor: "#9CB7AF",
        },

        "&.Mui-focused fieldset": {
          borderColor: C.primary,
          borderWidth: "1px",
        },
      }}
      renderValue={(value) =>
        value || (
          <Box sx={{ color: C.muted }}>
            Select gender...
          </Box>
        )
      }
    >
      <MenuItem value="MALE">Male</MenuItem>
      <MenuItem value="FEMALE">Female</MenuItem>
      <MenuItem value="OTHER">Other</MenuItem>
    </Select>

    {errors.ownerGender && (
      <Typography
        sx={{
          color: C.error,
          fontSize: "10px",
          mt: 0.5,
          ml: 1,
        }}
      >
        {errors.ownerGender}
      </Typography>
    )}
  </FormControl>
</Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Label>
              Medical Store / Pharmacy Name
            </Label>

            <TextField
              fullWidth
              placeholder="e.g. City Care Medical & Pharmacy"
              value={data.storeName || ""}
              onChange={(e) =>
                setField("storeName", e.target.value)
              }
              error={Boolean(errors.storeName)}
              helperText={errors.storeName}
              sx={inputSx}
              InputProps={{
                startAdornment: icon(
                  StorefrontOutlinedIcon
                ),
              }}
            />
          </Grid>

          {/* PHARMACY CATEGORY */}

          <Grid size={{ xs: 12, md: 6 }}>
            <Label>
              Pharmacy Category / Type
            </Label>

            <FormControl
              fullWidth
              error={Boolean(
                errors.pharmacyCategory
              )}
            >
              <Select
                displayEmpty
                value={data.pharmacyCategory || ""}
                onChange={(e) =>
                  setField(
                    "pharmacyCategory",
                    e.target.value
                  )
                }
                startAdornment={icon(
                  CategoryOutlinedIcon
                )}
                sx={{
                  height: 46,
                  borderRadius: "8px",
                  fontSize: "12px",

                  "& fieldset": {
                    borderColor: C.input,
                  },

                  "&:hover fieldset": {
                    borderColor: "#9CB7AF",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: C.primary,
                    borderWidth: "1px",
                  },
                }}
                renderValue={(value) =>
                  value || (
                    <Box sx={{ color: C.muted }}>
                      Select category...
                    </Box>
                  )
                }
              >
                <MenuItem value="Retail Pharmacy">
                  Retail Pharmacy
                </MenuItem>

                <MenuItem value="Hospital Pharmacy">
                  Hospital Pharmacy
                </MenuItem>

                <MenuItem value="Clinic Pharmacy">
                  Clinic Pharmacy
                </MenuItem>

                <MenuItem value="Wholesale Pharmacy">
                  Wholesale Pharmacy
                </MenuItem>
              </Select>

              {errors.pharmacyCategory && (
                <Typography
                  sx={{
                    color: C.error,
                    fontSize: "10px",
                    mt: 0.5,
                    ml: 1,
                  }}
                >
                  {errors.pharmacyCategory}
                </Typography>
              )}
            </FormControl>
          </Grid>

        
          {/* EMAIL */}

          <Grid size={{ xs: 12, md: 6 }}>
            <Label>
              Store Contact Email
            </Label>

            <TextField
              fullWidth
              type="email"
              placeholder="e.g. citycare@gmail.com"
              value={data.email || ""}
              onChange={(e) =>
                setField(
                  "email",
                  e.target.value.replace(/\s/g, "")
                )
              }
              error={Boolean(errors.email)}
              helperText={
                errors.email ||
                "Official email for store communication."
              }
              sx={inputSx}
              InputProps={{
                startAdornment: icon(
                  MailOutlineIcon
                ),
              }}
            />
          </Grid>

          {/* PRIMARY PHONE */}

          <Grid size={{ xs: 12, md: 6 }}>
            <Label>
              Store Phone Number
            </Label>

            <TextField
              fullWidth
              placeholder="9876543210"
              value={data.phone || ""}
              onChange={(e) =>
                setField(
                  "phone",
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10)
                )
              }
              error={Boolean(errors.phone)}
              helperText={errors.phone}
              sx={inputSx}
              inputProps={{
                inputMode: "numeric",
                maxLength: 10,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneOutlinedIcon
                      sx={{
                        fontSize: 17,
                        color: C.muted,
                        mr: 1,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: C.text,
                      }}
                    >
                      +91
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

     
        </Grid>
      </Paper>

      {/* ================= NEXT BUTTON ================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={loading}
          endIcon={
            loading ? (
              <CircularProgress
                size={14}
                color="inherit"
              />
            ) : (
              <ArrowForwardIcon
                sx={{
                  fontSize: "16px !important",
                }}
              />
            )
          }
          sx={{
            minWidth: 190,
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
          }}
        >
          Next: Store Address
        </Button>
      </Box>
    </Box>
  );
}