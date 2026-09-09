"use client";

import React from "react";
import {
  Typography,
  TextField,
  Box,
  IconButton,
  Grid,
  Collapse,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

/* ---------------- COMMON FIELD STYLE ---------------- */
const fieldSx = {
  "& .MuiInputLabel-root": {
    color: "#000000",
    "&.Mui-disabled": {
      color: "#000000",
    },
  },

  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#ffffff",

    "& fieldset": {
      borderColor: "#cbd5e1",
    },

    "&.Mui-disabled fieldset": {
      borderColor: "#e2e8f0",
    },

    "& input": {
      color: "#6b7280",
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #ffffff inset !important",
      WebkitTextFillColor: "#6b7280 !important",
    },
  },
};

/* ---------------- ACCORDION CARD ---------------- */
const AccordionCard = ({ title, subtitle, children, isEditing, onRemove, showRemove }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
        mb: 2,
        overflow: "hidden",
        border: "1px solid #e2e8f0",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          justifyContent: "space-between",
          cursor: "pointer",
          transition: "background-color 0.2s",
          "&:hover": {
            backgroundColor: "#ffff",
          },
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box>
            <Typography fontWeight={600} color="#334155" fontSize="16px">
              {title || "Hospital Name"}
            </Typography>
            {subtitle && (
              <Typography fontSize="13px" color="#94a3b8">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        <Box>
          {isEditing && showRemove && (
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              sx={{ mr: 1 }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 3, pt: 1, mt: 2, borderTop: "1px solid #f1f5f9" }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

/* ---------------- ADDRESS EDIT FIELDS ---------------- */
const AddressFields = ({ data, isEditing, onFieldChange }) => (
  <Grid container spacing={2} mt={1}>
    {[
      ["flatNo", "Flat / Plot No : ", 4],
      ["building", "Building / Society : ", 8],
      ["street", "Street Name : ", 6],
      ["area", "Area / Locality : ", 6],
      ["landmark", "Landmark : ", 6],
      ["city", "City / Town / Village : ", 6],
      ["district", "District", 4],
      ["state", "State", 4],
      ["pinCode", "PIN Code", 4],
    ].map(([key, label, size]) => (
      <Grid item xs={12} sm={size} key={key}>
        <TextField
          fullWidth
          size="small"
          label={label}
          value={isEditing ? data?.[key] || "" : data?.[key] || "Not Provided"}
          disabled={!isEditing}
          onChange={(e) => onFieldChange(key, e.target.value)}
          sx={fieldSx}
        />
      </Grid>
    ))}
  </Grid>
);

/* ---------------- HELPER: Get Subtitle ---------------- */
const getAddressSummary = (data) => {
  if (!data) return "Address Details";
  const parts = [
    data.flatNo,
    data.building,
    data.street,
    data.area,
    data.landmark,
    data.city,
    data.district,
    data.state,
    data.pinCode,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Address Details";
};

/* ---------------- MAIN COMPONENT ---------------- */
const ProfileAddress = ({
  profileData,
  isEditing,
  onHospitalChange,
  onAddHospital,
  onRemoveHospital,
}) => {
  const hospitals = profileData?.hospitalDetail || [];

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        ml={1}
      >
        <Typography variant="h6" fontWeight={600} color="#153933">
          Hospital Address
        </Typography>
        {isEditing && (
          <IconButton
            onClick={onAddHospital}
            sx={{
              backgroundColor: "#e0f2f1",
              "&:hover": { backgroundColor: "#ccfbf1" },
            }}
          >
            <AddIcon sx={{ color: "#0f766e" }} />
          </IconButton>
        )}
      </Box>

      {hospitals.map((hospital, index) => (
        <AccordionCard
          key={index}
          title={hospital.hospitalName || (index === 0 ? "Primary Hospital" : `Hospital ${index + 1}`)}
          subtitle={getAddressSummary(hospital)}
          isEditing={isEditing}
          showRemove={hospitals.length > 1}
          onRemove={() => onRemoveHospital(index)}
        >
          <TextField
            fullWidth
            size="small"
            label="Hospital Name"
            value={hospital.hospitalName || ""}
            disabled={!isEditing}
            onChange={(e) => onHospitalChange(index, "hospitalName", e.target.value)}
            sx={{ ...fieldSx, mb: 2 }}
          />

          <AddressFields
            data={hospital}
            isEditing={isEditing}
            onFieldChange={(field, value) => onHospitalChange(index, field, value)}
          />
        </AccordionCard>
      ))}

      {hospitals.length === 0 && (
        <Typography color="textSecondary" sx={{ ml: 1 }}>
          No hospital addresses added.
        </Typography>
      )}
    </Box>
  );
};

export default ProfileAddress;
