"use client";

import React from "react";
import {
  Box,
  Stack,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";

import UserAddress from "../Profile/UserAddress";

const PatientProfileForm = ({ formData, editable, handleChange }) => {
  const theme = useTheme();

  const inputStyle = {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "12.5px",
    padding: "6px 4px",
    color: theme.palette.text.primary,
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const boxStyle = {
    backgroundColor: theme.palette.background.default,
    px: 1.5,
    py: 0.7,
    minHeight: 43,
    borderRadius: 1.5,
    display: "flex",
    alignItems: "center",
    gap: 1,
    width: "100%",
    boxSizing: "border-box",
    border: `1px solid ${theme.palette.divider}`,
    transition: "all 0.2s ease",

    "&:hover": {
      borderColor: editable
        ? theme.palette.primary.main
        : theme.palette.divider,
    },

    "&:focus-within": {
      borderColor: theme.palette.primary.main,
      boxShadow: editable
        ? `0 0 0 2px ${theme.palette.primary.main}12`
        : "none",
    },
  };

  const labelStyle = {
    fontSize: "12.5px",
    fontWeight: 600,
    color: theme.palette.text.primary,
    minWidth: { xs: "110px", sm: "125px" },
    whiteSpace: "nowrap",
  };

  const renderPersonalInfo = () => (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 1.2, md: 2.5 },
          width: "100%",
        }}
      >
        {/* LEFT COLUMN */}
        <Stack spacing={1.2} sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={boxStyle}>
            <Typography sx={labelStyle}>Blood Group</Typography>

            <select
              value={formData.bloodGroup}
              onChange={(e) => handleChange("bloodGroup", e.target.value)}
              disabled={!editable}
              style={{
                ...inputStyle,
                cursor: editable ? "pointer" : "default",
              }}
            >
              <option value="">Select Blood Group</option>

              {[
                "A+",
                "A-",
                "B+",
                "B-",
                "O+",
                "O-",
                "AB+",
                "AB-",
              ].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </Box> 
           {/* Allergies */}
          <Box sx={boxStyle}>
            <Typography sx={labelStyle}>Allergies</Typography>

            <input
              type="text"
              value={formData.allergies}
              placeholder="Optional"
              onChange={(e) => handleChange("allergies", e.target.value)}
              disabled={!editable}
              style={inputStyle}
            />
          </Box>
        </Stack>

        {/* CENTER DIVIDER */}
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            display: { xs: "none", md: "block" },
            borderColor: theme.palette.divider,
          }}
        />

        {/* RIGHT COLUMN */}
        <Stack spacing={1.2} sx={{ flex: 1, minWidth: 0 }}>
          {/* Height */}
          

          {/* Blood Group */}
          

          {/* Existing Conditions */}
          <Box sx={boxStyle}>
            <Typography sx={labelStyle}>
              Existing Conditions
            </Typography>

            <input
              type="text"
              value={formData.existingConditions}
              placeholder="Optional"
              onChange={(e) =>
                handleChange("existingConditions", e.target.value)
              }
              disabled={!editable}
              style={inputStyle}
            />
          </Box>

         
        </Stack>
      </Box>
    </Box>
  );

  const renderBioSection = () => (
    <Box sx={{ mt: 2.5 }}>
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 700,
          color: theme.palette.text.primary,
          mb: 1,
        }}
      >
        Short Bio
      </Typography>

      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          borderRadius: 1.5,
          px: 1.5,
          py: 1,
          border: `1px solid ${theme.palette.divider}`,
          transition: "0.2s ease",

          "&:focus-within": {
            borderColor: theme.palette.primary.main,
            boxShadow: editable
              ? `0 0 0 2px ${theme.palette.primary.main}12`
              : "none",
          },
        }}
      >
        <textarea
          value={formData.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          disabled={!editable}
          placeholder="Write a short bio..."
          rows={2}
          style={{
            width: "100%",
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            fontSize: "12.5px",
            lineHeight: 1.6,
            color: theme.palette.text.primary,
            fontFamily: "inherit",
          }}
        />
      </Box>
    </Box>
  );

  const renderMedicalInfo = () => (
    <Box sx={{ mt: 2.5 }}>
      <UserAddress
        address={formData.address}
        emergencyContact={formData.emergencyContact}
        editable={editable}
        handleChange={handleChange}
      />
    </Box>
  );

  return (
    <>
      {renderPersonalInfo()}
      {renderBioSection()}
      {renderMedicalInfo()}
    </>
  );
};

export default PatientProfileForm;