"use client";

import React from "react";
import { Box, CircularProgress } from "@mui/material";
import ProfileSnackbar from "./ProfileSnackbar";
import ProfileSidebar from "./ProfileSidebar";
import ProfileBio from "./ProfileBio";
import ProfileDetails from "./ProfileDetails";
import ProfileAddress from "./ProfileAddress";
import ProfileActions from "./ProfileActions";

const ProfileContent = ({
  loading,
  profileData,
  isEditing,
  editingChip,
  snackbar,
  onFieldChange,
  onChipClick,
  onChipSave,
  onRatingChange,
  onOnlineVisibilityChange,
  onLicenseUpload,
  onImageUpload,
  onWorkingHoursChange,
  onUpdateClick,
  onSaveClick,
  onCloseSnackbar,
  onHospitalChange,
  onAddHospital,
  onRemoveHospital,
}) => {
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress sx={{ color: "#14b8a6" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        mt: 4,
        padding: { xs: 1, sm: 2, md: 1 },
        marginTop: 7.5,
      }}
    >
      {/* Snackbar for notifications */}
      <ProfileSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={onCloseSnackbar}
      />

      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
          boxShadow: "0 4px 12px #0f7468",
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          height: "100%",
        }}
      >
        {/* Profile Sidebar */}
        <ProfileSidebar
          profileData={profileData}
          isEditing={isEditing}
          editingChip={editingChip}
          onFieldChange={onFieldChange}
          onChipClick={onChipClick}
          onChipSave={onChipSave}
          onRatingChange={onRatingChange}
          onOnlineVisibilityChange={onOnlineVisibilityChange}
          onAvatarChange={onImageUpload}
        />

        {/* Main Profile Area */}
        <Box
          sx={{
            flex: 1,
            padding: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <ProfileBio
            profileData={profileData}
            isEditing={isEditing}
            onFieldChange={onFieldChange}
          />

          <ProfileDetails
            profileData={profileData}
            isEditing={isEditing}
            onFieldChange={onFieldChange}
            onLicenseUpload={onLicenseUpload}
            onWorkingHoursChange={onWorkingHoursChange}
          />

          <ProfileAddress
            profileData={profileData}
            isEditing={isEditing}
            onHospitalChange={onHospitalChange}
            onAddHospital={onAddHospital}
            onRemoveHospital={onRemoveHospital}
          />

          <ProfileActions
            isEditing={isEditing}
            onUpdateClick={onUpdateClick}
            onSaveClick={onSaveClick}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileContent;
