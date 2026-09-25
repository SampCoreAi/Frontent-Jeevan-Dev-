"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  TextField,
  Box,
  Divider,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmergencyOutlinedIcon from "@mui/icons-material/EmergencyOutlined";

export default function UserAddress({
  address = {},
  emergencyContact = {},
  editable = false,
  handleChange,
}) {
  const theme = useTheme();

  const relations = [
    "Father",
    "Mother",
    "Spouse",
    "Brother",
    "Sister",
    "Guardian",
    "Friend",
    "Other",
  ];

  const handleAddressChange = (key, value) => {
    if (!editable) return;

    let newValue = value;

    if (key === "pincode") {
      newValue = value.replace(/\D/g, "").slice(0, 6);
    }

    handleChange(`address.${key}`, newValue);
  };

  const handleEmergencyChange = (key, value) => {
    if (!editable) return;

    let newValue = value;

    if (key === "name") {
      newValue = value
        .replace(/[^A-Za-z\s]/g, "")
        .replace(/\s{2,}/g, " ")
        .slice(0, 50);
    }

    if (key === "phone") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (key === "email") {
      newValue = value.replace(/\s/g, "").slice(0, 254);
    }

    handleChange(`emergencyContact.${key}`, newValue);
  };

  const nameError = (() => {
    const name = emergencyContact?.name?.trim() || "";

    if (!name) return "";

    if (name.length < 2) {
      return "Name must be at least 2 characters";
    }

    if (name.length > 50) {
      return "Name cannot exceed 50 characters";
    }

    if (!/^[A-Za-z\s]+$/.test(name)) {
      return "Name can contain only letters and spaces";
    }

    return "";
  })();

  const emailError = (() => {
    const email = emergencyContact?.email?.trim() || "";

    if (!email) return "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Enter a valid email address";
    }

    return "";
  })();

  const phoneError = (() => {
    const phone = emergencyContact?.phone || "";

    if (!phone) return "";

    if (!/^\d{10}$/.test(phone)) {
      return "Phone number must be 10 digits";
    }

    return "";
  })();

  const pincodeError = (() => {
    const pincode = address?.pincode || "";

    if (!pincode) return "";

    if (!/^\d{6}$/.test(pincode)) {
      return "PIN code must be 6 digits";
    }

    return "";
  })();

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      minHeight: 42,
      borderRadius: "7px",
      backgroundColor: editable
        ? theme.palette.background.paper
        : theme.palette.background.default,
      fontSize: "12.5px",

      "& fieldset": {
        borderColor: theme.palette.divider,
      },

      "&:hover fieldset": {
        borderColor: editable
          ? theme.palette.primary.main
          : theme.palette.divider,
      },

      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: "1px",
      },

      "&.Mui-disabled": {
        backgroundColor: theme.palette.background.default,
      },
    },

    "& .MuiOutlinedInput-input": {
      fontSize: "12.5px",
      padding: "10px 12px",
      color: theme.palette.text.primary,
    },

    "& .MuiOutlinedInput-input.Mui-disabled": {
      WebkitTextFillColor: theme.palette.text.primary,
    },

    "& .MuiSelect-select": {
      fontSize: "12.5px",
    },

    "& .MuiSelect-select.Mui-disabled": {
      WebkitTextFillColor: theme.palette.text.primary,
    },

    "& .MuiInputLabel-root": {
      fontSize: "12.5px",
      color: theme.palette.text.secondary,
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: theme.palette.primary.main,
    },

    "& .MuiInputLabel-root.Mui-disabled": {
      color: theme.palette.text.secondary,
    },

    "& .MuiFormHelperText-root": {
      fontSize: "11px",
      mx: 0.5,
      mt: 0.4,
    },
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Accordion
        elevation={0}
        defaultExpanded
        disableGutters
        sx={{
          width: "100%",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "8px !important",
          overflow: "hidden",
          backgroundColor: theme.palette.background.paper,

          "&:before": {
            display: "none",
          },

          "&.Mui-expanded": {
            margin: 0,
          },
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon
              sx={{
                fontSize: 20,
                color: theme.palette.primary.main,
              }}
            />
          }
          sx={{
            minHeight: 44,
            px: 1.7,
            backgroundColor: theme.palette.background.default,
            borderBottom: `1px solid ${theme.palette.divider}`,

            "&.Mui-expanded": {
              minHeight: 44,
            },

            "& .MuiAccordionSummary-content": {
              my: 1,
            },

            "& .MuiAccordionSummary-content.Mui-expanded": {
              my: 1,
            },
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            Address & Emergency Contact
          </Typography>
        </AccordionSummary>

        <AccordionDetails
          sx={{
            px: {
              xs: 1.5,
              sm: 2,
            },
            py: 1.7,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              mb: 1.3,
            }}
          >
            <LocationOnOutlinedIcon
              sx={{
                fontSize: 17,
                color: theme.palette.primary.main,
              }}
            />

            <Typography
              sx={{
                fontSize: "12.5px",
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              Address
            </Typography>
          </Box>

          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Street Name"
                size="small"
                disabled={!editable}
                value={address?.street || ""}
                onChange={(e) =>
                  handleAddressChange("street", e.target.value)
                }
                slotProps={{
                  htmlInput: {
                    maxLength: 120,
                  },
                }}
                sx={textFieldStyle}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="City / Town / Village"
                size="small"
                disabled={!editable}
                value={address?.city || ""}
                onChange={(e) =>
                  handleAddressChange("city", e.target.value)
                }
                slotProps={{
                  htmlInput: {
                    maxLength: 80,
                  },
                }}
                sx={textFieldStyle}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="State"
                size="small"
                disabled={!editable}
                value={address?.state || ""}
                onChange={(e) =>
                  handleAddressChange("state", e.target.value)
                }
                slotProps={{
                  htmlInput: {
                    maxLength: 80,
                  },
                }}
                sx={textFieldStyle}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="PIN Code"
                size="small"
                disabled={!editable}
                value={address?.pincode || ""}
                onChange={(e) =>
                  handleAddressChange("pincode", e.target.value)
                }
                error={Boolean(pincodeError)}
                helperText={pincodeError}
                slotProps={{
                  htmlInput: {
                    inputMode: "numeric",
                    maxLength: 6,
                  },
                }}
                sx={textFieldStyle}
              />
            </Grid>
          </Grid>

          <Divider
            sx={{
              my: 2,
              borderColor: theme.palette.divider,
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              mb: 1.3,
            }}
          >
            <EmergencyOutlinedIcon
              sx={{
                fontSize: 17,
                color: theme.palette.primary.main,
              }}
            />

            <Typography
              sx={{
                fontSize: "12.5px",
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              Emergency Contact
            </Typography>
          </Box>

          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Full Name"
                size="small"
                disabled={!editable}
                value={emergencyContact?.name || ""}
                onChange={(e) =>
                  handleEmergencyChange("name", e.target.value)
                }
                error={Boolean(nameError)}
                helperText={nameError}
                slotProps={{
                  htmlInput: {
                    maxLength: 50,
                    autoComplete: "name",
                  },
                }}
                sx={textFieldStyle}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label="Relation"
                size="small"
                disabled={!editable}
                value={emergencyContact?.relationship || ""}
                onChange={(e) =>
                  handleEmergencyChange(
                    "relationship",
                    e.target.value
                  )
                }
                sx={textFieldStyle}
              >
                <MenuItem value="">
                  Select Relation
                </MenuItem>

                {relations.map((relation) => (
                  <MenuItem
                    key={relation}
                    value={relation}
                    sx={{
                      fontSize: "12.5px",
                    }}
                  >
                    {relation}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                size="small"
                disabled={!editable}
                value={emergencyContact?.email || ""}
                onChange={(e) =>
                  handleEmergencyChange("email", e.target.value)
                }
                error={Boolean(emailError)}
                helperText={emailError}
                slotProps={{
                  htmlInput: {
                    maxLength: 254,
                    autoComplete: "email",
                  },
                }}
                sx={textFieldStyle}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="tel"
                label="Phone Number"
                size="small"
                disabled={!editable}
                value={emergencyContact?.phone || ""}
                onChange={(e) =>
                  handleEmergencyChange("phone", e.target.value)
                }
                error={Boolean(phoneError)}
                helperText={phoneError}
                slotProps={{
                  htmlInput: {
                    inputMode: "numeric",
                    maxLength: 10,
                    autoComplete: "tel",
                  },
                }}
                sx={textFieldStyle}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}