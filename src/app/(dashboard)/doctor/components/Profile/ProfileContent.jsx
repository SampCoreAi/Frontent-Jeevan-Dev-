"use client";

import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";

import ProfileSnackbar from "./ProfileSnackbar";
import ProfileSidebar from "./ProfileSidebar";
import ProfileBio from "./ProfileBio";
import ProfileDetails from "./ProfileDetails";
import ProfileAddress from "./ProfileAddress";
import ProfileActions from "./ProfileActions";
import DoctorBranding from "./DoctorBranding";
import WorkingHoursModal from "./WorkingHoursModal";

const ProfileContent = ({
  loading,
  saving,
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
  onLogoUpload,
  onSignatureUpload,
  logoUploading,
  signatureUploading,
  profileImageUploading,
  onClinicWorkingHoursChange,
  onUpdateClick,
  onSaveClick,
  onCloseSnackbar,
  onHospitalChange,
  onAddHospital,
  onRemoveHospital,
}) => {
  // ==========================================
  // SELECTED HOSPITAL FOR WORKING HOURS
  // ==========================================

  const [workingHoursOpen, setWorkingHoursOpen] =
    useState(false);

  const [selectedHospital, setSelectedHospital] =
    useState(null);

  const handleOpenWorkingHours = (hospital) => {
    console.log(
      "Selected hospital:",
      hospital
    );

    console.log(
      "Selected clinicId:",
      hospital?.clinicId
    );

    setSelectedHospital(hospital);
    setWorkingHoursOpen(true);
  };

  // ==========================================

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress
          sx={{ color: "#14b8a6" }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        marginTop: 8,
      }}
    >
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
          flexDirection: {
            xs: "column",
            lg: "row",
          },
          height: "100%",
        }}
      >
        <ProfileSidebar
          profileData={profileData}
          isEditing={isEditing}
          editingChip={editingChip}
          onFieldChange={onFieldChange}
          onChipClick={onChipClick}
          onChipSave={onChipSave}
          onRatingChange={onRatingChange}
          onOnlineVisibilityChange={
            onOnlineVisibilityChange
          }
          onAvatarChange={onImageUpload}
          avatarUploading={
            profileImageUploading
          }
        />

        <Box
          sx={{
            flex: 1,
            padding: {
              xs: 2,
              sm: 3,
              md: 4,
            },
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
          />

          <ProfileAddress
            profileData={profileData}
            isEditing={isEditing}
            onHospitalChange={
              onHospitalChange
            }
            onAddHospital={
              onAddHospital
            }
            onRemoveHospital={
              onRemoveHospital
            }
            onWorkingHours={
              handleOpenWorkingHours
            }
          />

          <DoctorBranding
            logoUrl={
              profileData?.logoPreviewUrl ||
              profileData?.logoUrl
            }
            signatureUrl={
              profileData?.signaturePreviewUrl ||
              profileData?.signatureUrl
            }
            isEditing={isEditing}
            logoUploading={logoUploading}
            signatureUploading={
              signatureUploading
            }
            onLogoUpload={onLogoUpload}
            onSignatureUpload={
              onSignatureUpload
            }
          />

          <ProfileActions
            isEditing={isEditing}
            saving={saving}
            onUpdateClick={onUpdateClick}
            onSaveClick={onSaveClick}
          />
        </Box>
      </Box>
     <WorkingHoursModal
  open={workingHoursOpen}
  onClose={() => {
    setWorkingHoursOpen(false);
    setSelectedHospital(null);
  }}
  workingHours={selectedHospital?.workingHours || {}}
  onWorkingHoursChange={(day, field, value) => {
    if (!selectedHospital?.clinicId) {
      console.error("Clinic ID missing");
      return;
    }

    onClinicWorkingHoursChange?.(
      selectedHospital.clinicId,
      day,
      field,
      value
    );
  }}
/>
    </Box>
  );
};

export default ProfileContent;
