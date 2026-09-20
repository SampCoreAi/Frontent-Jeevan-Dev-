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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmergencyOutlinedIcon from "@mui/icons-material/EmergencyOutlined";

export default function UserAddress({
  address = {},
  emergencyContact = {},
  editable,
  handleChange,
}) {
  const theme = useTheme();

  const addressFields = [
    { label: "Street Name", key: "street" },
    { label: "City / Town / Village", key: "city" },
    { label: "State", key: "state" },
    { label: "PIN Code", key: "pincode" },
  ];

  const emergencyFields = [
    { label: "Full Name", key: "name" },
    { label: "Relation", key: "relationship" },
    { label: "Email", key: "email" },
    { label: "Phone Number", key: "phone" },
  ];

  const handleAddressChange = (key, value) => {
    handleChange("address", {
      ...address,
      [key]: value,
    });
  };

  const handleEmergencyChange = (key, value) => {
    handleChange(`emergencyContact.${key}`, value);
  };

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      minHeight: 42,
      borderRadius: "7px",
      backgroundColor: theme.palette.background.paper,
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
      color: theme.palette.text.primary,
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
  };

  return (
    <Box
      sx={{
        width: "100%",
        mt: 0,
      }}
    >
      <Accordion
        elevation={0}
        defaultExpanded
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
        {/* HEADER */}
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
            minHeight: "44px",
            px: 1.7,
            backgroundColor: theme.palette.background.default,
            borderBottom: `1px solid ${theme.palette.divider}`,

            "&.Mui-expanded": {
              minHeight: "44px",
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
          {/* ================= ADDRESS ================= */}

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
            {addressFields.map(({ label, key }) => (
              <Grid key={key} size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={label}
                  size="small"
                  variant="outlined"
                  disabled={!editable}
                  value={address?.[key] || ""}
                  onChange={(e) =>
                    handleAddressChange(key, e.target.value)
                  }
                  sx={textFieldStyle}
                />
              </Grid>
            ))}
          </Grid>

          {/* DIVIDER */}

          <Divider
            sx={{
              my: 2,
              borderColor: theme.palette.divider,
            }}
          />

          {/* ================= EMERGENCY ================= */}

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
            {emergencyFields.map(({ label, key }) => (
              <Grid key={key} size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={label}
                  size="small"
                  variant="outlined"
                  disabled={!editable}
                  value={emergencyContact?.[key] || ""}
                  onChange={(e) =>
                    handleEmergencyChange(key, e.target.value)
                  }
                  sx={textFieldStyle}
                />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}