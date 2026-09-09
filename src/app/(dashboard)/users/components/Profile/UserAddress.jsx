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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function UserAddress({
  address = {},
  emergencyContact = {},
  editable,
  handleChange,
}) {
  const addressFields = [
    { label: "Street Name", key: "street" },
    { label: "City / Town / Village", key: "city" },
    { label: "State", key: "state" },
    { label: "PIN Code", key: "pincode" },
  ];
const emergencyFields = [
  { label: "Full Name", key: "name" },
  { label: "Relation", key: "relationship" }, // ✅ correct
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

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 3 }}>
      <Accordion
       
        elevation={0}
        sx={{
          boxShadow: "none",
          borderRadius: 1,
          border: "1px solid #e0e0e0",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ backgroundColor: "#f5f5f5" }}
        >
          <Typography
            sx={{
              fontSize: { xs: "1.4rem", md: "1.2rem" },
              fontWeight: 600,
              color: "#1c573e",
            }}
          >
            Address & Emergency Contact
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          {/* ADDRESS SECTION */}
          <Typography sx={{ fontWeight: 600, mb: 1 }}>
            Address
          </Typography>

          <Grid container spacing={2}>
            {addressFields.map(({ label, key }) => (
              <Grid key={key} size={{ xs: 12, sm: 6 }} sx={{ mt: 1 }}>
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
                sx={{
  backgroundColor: "#fff",
  borderRadius: "6px",

  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#ccc" },
    "&:hover fieldset": { borderColor: "#1e6658" },
    "&.Mui-focused fieldset": { borderColor: "#1e6658" },
  },

  // ✅ Input text color
  "& .MuiOutlinedInput-input": {
    color: "#000", // black
  },

  // ✅ Disabled text color
  "& .MuiOutlinedInput-input.Mui-disabled": {
    WebkitTextFillColor: "#000",
    color: "#000",
  },

  // ✅ Label color FIX (IMPORTANT)
  "& .MuiInputLabel-root": {
    color: "#000",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#1e6658",
  },

  "& .MuiInputLabel-root.Mui-disabled": {
    color: "#000",
  },
}}
                />
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* EMERGENCY CONTACT SECTION */}
          <Typography sx={{ fontWeight: 600, mb: 1 }}>
            Emergency Contact
          </Typography>

          <Grid container spacing={2}>
            {emergencyFields.map(({ label, key }) => (
              <Grid key={key} size={{ xs: 12, sm: 6 }} sx={{ mt: 1 }}>
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
                 sx={{
  backgroundColor: "#fff",
  borderRadius: "6px",

  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#ccc" },
    "&:hover fieldset": { borderColor: "#1e6658" },
    "&.Mui-focused fieldset": { borderColor: "#1e6658" },
  },

  // ✅ Input text color
  "& .MuiOutlinedInput-input": {
    color: "#000", // black
  },

  // ✅ Disabled text color
  "& .MuiOutlinedInput-input.Mui-disabled": {
    WebkitTextFillColor: "#000",
    color: "#000",
  },

  // ✅ Label color FIX (IMPORTANT)
  "& .MuiInputLabel-root": {
    color: "#000",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#1e6658",
  },

  "& .MuiInputLabel-root.Mui-disabled": {
    color: "#000",
  },
}}
                />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}