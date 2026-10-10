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
  onWorkingHoursSaved,
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
    setSelectedHospital(hospital);
    setWorkingHoursOpen(true);
  };

  const getWorkingHours = (hospital) => {
    const result = {};

    (hospital?.availability || []).forEach((item) => {
      const key = String(
        item.day || ""
      ).toLowerCase();

      result[key] = {
        start: item.startTime || "",
        end: item.endTime || "",
      };
    });

    return result;
  };

  // ==========================================
  // LOADING
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

  // ==========================================
  // GET UPDATED SELECTED HOSPITAL
  // ==========================================

  const currentSelectedHospital =
    profileData?.hospitalDetail?.find(
      (hospital) =>
        String(hospital.clinicId) ===
        String(selectedHospital?.clinicId)
    ) || selectedHospital;

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

      {/* ==========================================
          WORKING HOURS MODAL
          ========================================== */}

      <WorkingHoursModal
        open={workingHoursOpen}
        onClose={() => {
          setWorkingHoursOpen(false);
          setSelectedHospital(null);
        }}
        workingHours={getWorkingHours(
          currentSelectedHospital
        )}

        /*
         * IMPORTANT:
         * Edit Profile clicked => editable
         * Edit Profile not clicked => read only
         */
        readOnly={!isEditing}

        onWorkingHoursChange={(
          day,
          field,
          value
        ) => {
          if (
            !currentSelectedHospital?.clinicId
          ) {
            console.error(
              "Clinic ID missing"
            );
            return;
          }

          onClinicWorkingHoursChange?.(
            currentSelectedHospital.clinicId,
            day,
            field,
            value
          );
        }}

        onSaved={() => {
          onWorkingHoursSaved?.();
        }}
      />
    </Box>
  );
};

export default ProfileContent;
