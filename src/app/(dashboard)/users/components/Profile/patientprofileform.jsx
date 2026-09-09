import React from "react";
import { Box, Stack, Divider, Typography } from "@mui/material";
import UserAddress from "../Profile/UserAddress"

const PatientProfileForm = ({ formData, editable, handleChange }) => {
  const inputStyle = {
    width: "100%",
    border: "none",
    background: "transparent",
    fontSize: "15px",
    padding: "10px 12px",
    borderRadius: "12px",
  };

  const boxStyle = {
    background: "whitesmoke",
    padding: "10px 14px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "14px",
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #e3e7ea",
  };


  const renderPersonalInfo = () => (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", mb: 3, gap: 2 }}>
      {/* LEFT COLUMN */}
      <Stack spacing={2} sx={{ flex: 1 }}>


        {/* Age */}
        <Box sx={boxStyle}>
          <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "#1c573e", minWidth: "fit-content" }}>
            Age:
          </Typography>
          <input
            type="number"
            placeholder="Enter your age"
            value={formData.age}
            onChange={(e) => handleChange("age", e.target.value)}
            disabled={!editable}
            style={inputStyle}
          />
        </Box>

        {/* Gender */}
        <Box sx={boxStyle}>
          <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "#1c573e", minWidth: "fit-content" }}>
            Gender:
          </Typography>
          <select
  value={formData.gender}
  onChange={(e) => handleChange("gender", e.target.value)}
  disabled={!editable}
  style={{
    ...inputStyle,
    width: "100%",
  }}
>
  <option value="">Select Gender</option>
  <option value="MALE">Male</option>
  <option value="FEMALE">Female</option>
  <option value="OTHER">Other</option>
</select>
        </Box>
        <Box sx={boxStyle}>
          <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "#1c573e", minWidth: "fit-content" }}>
            Language:
          </Typography>
          <input
            type="text"
            placeholder="Enter your language"
            value={formData.language}
            onChange={(e) => handleChange("language", e.target.value)}
            disabled={!editable}
            style={inputStyle}
          />
        </Box>
        <Box sx={boxStyle}>
  <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "#1c573e", minWidth: "fit-content" }}>
    Weight (kg):
  </Typography>
  <input
    type="number"
    placeholder="Enter weight in kg"
    value={formData.weight}
    onChange={(e) => handleChange("weight", e.target.value)}
    disabled={!editable}
    style={inputStyle}
  />
</Box>
      </Stack>

      <Divider orientation="vertical" flexItem sx={{ border: "2px solid #15b8a7", display: { xs: "none", md: "block" } }} />

      {/* RIGHT COLUMN */}
      <Stack spacing={2} sx={{ flex: 1 }}>
        <Box sx={boxStyle}>
  <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "#1c573e", minWidth: "fit-content" }}>
    Height (cm):
  </Typography>
  <input
    type="number"
    placeholder="Enter height in cm"
    value={formData.height}
    onChange={(e) => handleChange("height", e.target.value)}
    disabled={!editable}
    style={inputStyle}
  />
</Box>
        {["bloodGroup", "existingConditions", "allergies"].map((field) => (
        <Box key={field} sx={boxStyle}>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#1c573e",
              minWidth: "140px",
              whiteSpace: "nowrap",
            }}
          >
            {field === "bloodGroup"
              ? "Blood Group:"
              : field === "existingConditions"
                ? "Existing Conditions:"
                : "Allergies:"}
          </Typography>

          {/* BLOOD GROUP SELECT */}
          {field === "bloodGroup" ? (
            <select
              value={formData.bloodGroup}
              onChange={(e) => handleChange("bloodGroup", e.target.value)}
              disabled={!editable}
              style={{
                ...inputStyle,
                width: "100%",
                padding: "10px 12px",
                borderRadius: "12px",
                
                fontWeight: 600,
              }}
            >
              <option value="">Select Blood Group</option>
              {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                <option key={bg}>{bg}</option>
              ))}
            </select>
          ) : (
            // EXISTING CONDITIONS + ALLERGIES
            <input
              value={formData[field]}
              placeholder={
                field === "allergies"
                  ? "Enter Allergies (Optional)"
                  : "Enter Existing Conditions (Optional)"
              }
              onChange={(e) => handleChange(field, e.target.value)}
              disabled={!editable}
              style={{
                ...inputStyle,
                width: "100%",
                padding: "10px 12px",
                borderRadius: "12px",
                
                color: "#545454",
                fontWeight: 600,
              }}
            />
          )}
        </Box>
      ))}
      </Stack>
    </Box>
  );

  const renderBioSection = () => (
  <Box sx={{ mt: 3 }}>
    <Typography
      sx={{
        fontSize: { xs: "1.4rem", md: "1.2rem" },
        fontWeight: 600,
        color: "#1c573e",
        mb: 1.5,
      }}
    >
      Short Bio
    </Typography>

    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        borderRadius: "10px",
        padding: "10px",
        border: "1px solid #e0e0e0",
      }}
    >
   <textarea
  value={formData.bio}
  onChange={(e) => handleChange("bio", e.target.value)}
  disabled={!editable}
  placeholder="Describe yourself..."
  rows={2}   // 👈 reduce height
  style={{
    width: "100%",
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    resize: "none",
    fontSize: "14px",
    color: "#333",
    fontFamily: "inherit",
  }}
/>
    </Box>
  </Box>
);

  const renderMedicalInfo = () => (
  <Box sx={{ mt: 3 }}>
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