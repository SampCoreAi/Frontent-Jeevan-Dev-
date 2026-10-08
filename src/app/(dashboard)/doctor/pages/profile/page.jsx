"use client";

import React from "react";
import ProfileContent from "../../components/Profile/ProfileContent";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchDoctorProfile,
  updateDoctorProfile,
  uploadLicense,
  uploadProfileImage,
  uploadDoctorLogo,
  uploadDoctorSignature,
  setProfileData,
  handleFieldChange,
  handleClinicWorkingHoursChange,
  handleHospitalChange,
  handleAddHospital,
  handleRemoveHospital,
  setIsEditing,
  clearError,
  clearSuccessMessage,
} from "../../store/profileSlice";

import {
  selectProfileData,
  selectProfileLoading,
  selectProfileLoaded,
  selectProfileSaving,
  selectProfileError,
  selectProfileSuccessMessage,
  selectIsEditing,
  selectLogoUploading,
  selectSignatureUploading,
  selectProfileImageUploading,
} from "../../store/profileSlice";

const Page = () => {
  const dispatch = useDispatch();

  const profileData = useSelector(selectProfileData);
  const loading = useSelector(selectProfileLoading);
  const profileLoaded = useSelector(selectProfileLoaded);
  const saving = useSelector(selectProfileSaving);
  const error = useSelector(selectProfileError);
  const successMessage = useSelector(
    selectProfileSuccessMessage
  );
  const isEditing = useSelector(selectIsEditing);
  const logoUploading = useSelector(selectLogoUploading);
  const signatureUploading = useSelector(selectSignatureUploading);
  const profileImageUploading = useSelector(selectProfileImageUploading);

  // Track only fields changed by the user
  const [changedFields, setChangedFields] =
    React.useState({});

  // Snackbar
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (
    message,
    severity = "success"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // Redux success message
  React.useEffect(() => {
    if (successMessage) {
      showSnackbar(successMessage, "success");
      dispatch(clearSuccessMessage());
    }
  }, [successMessage, dispatch]);

React.useEffect(() => {
  if (!error) return;

  let userMessage = error;

  const message =
    typeof error === "string"
      ? error
      : error?.message || "";

  const match = message.match(
    /Clinic\s+([^\s]+)\s+on\s+(\w+)\s+must start at or after Clinic\s+([^\s]+)\s+ends/i
  );

  if (match) {
    const [, firstClinicId, day, secondClinicId] = match;

    const hospitals =
      profileData?.hospitalDetail || [];

    const firstHospital = hospitals.find(
      (hospital) =>
        String(hospital.clinicId) ===
        String(firstClinicId)
    );

    const secondHospital = hospitals.find(
      (hospital) =>
        String(hospital.clinicId) ===
        String(secondClinicId)
    );

    const firstHospitalName =
      firstHospital?.hospitalName ||
      "one clinic";

    const secondHospitalName =
      secondHospital?.hospitalName ||
      "another clinic";

userMessage =
  `${day} has a timing conflict. ` +
  `${firstHospitalName}'s working hours must start after ` +
  `${secondHospitalName}'s working hours end.`;

  } else {
    userMessage =
      "Profile update failed. Please check the working hours and try again.";
  }

  showSnackbar(userMessage, "error");
  dispatch(clearError());
}, [error, profileData, dispatch]);

  // Fetch doctor profile
  React.useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (!user?.id) {
      showSnackbar(
        "Session expired. Please login again.",
        "error"
      );
      return;
    }

    dispatch(fetchDoctorProfile());
  }, [dispatch]);

  // ================= FIELD CHANGE =================

  const handleChange = (field, value) => {
    dispatch(
      handleFieldChange({
        field,
        value,
      })
    );

    setChangedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  // ================= WORKING HOURS =================

  const handleClinicWorkingHoursChangeLocal = (
    clinicId,
    day,
    field,
    value
  ) => {
    dispatch(
      handleClinicWorkingHoursChange({
        clinicId,
        day,
        field,
        value,
      })
    );

setChangedFields((prev) => ({
  ...prev,
  hospitalDetail: true,
}));
  };

  const handleWorkingHoursSaved = () => {
  setChangedFields((prev) => ({
    ...prev,
    hospitalDetail: true,
  }));
};
  // ================= HOSPITAL =================

  const handleHospitalChangeLocal = (
    index,
    field,
    value
  ) => {
    dispatch(
      handleHospitalChange({
        index,
        field,
        value,
      })
    );

    setChangedFields((prev) => ({
      ...prev,
      hospitalDetail: true,
    }));
  };

  const handleAddHospitalLocal = () => {
    dispatch(handleAddHospital());

    setChangedFields((prev) => ({
      ...prev,
      hospitalDetail: true,
    }));
  };

  const handleRemoveHospitalLocal = (index) => {
    dispatch(handleRemoveHospital(index));

    setChangedFields((prev) => ({
      ...prev,
      hospitalDetail: true,
    }));
  };

  // ================= SAVE PROFILE =================

  const saveDoctorProfile = async () => {
    const payload = {};

    // Name
    if (changedFields.name) {
      payload.full_name =
        profileData.name?.trim() || "";
    }
// Username
if (changedFields.username) {
  payload.username =
    profileData.username
      ?.replace(/^@/, "")
      .trim() || "";
}

// Registration Number
if (changedFields.registration_number) {
  payload.registration_number =
    profileData.registration_number?.trim() || "";
}
    // Language
    if (changedFields.language) {
      payload.language = Array.isArray(
        profileData.language
      )
        ? profileData.language
        : [];
    }

    // Bio
    if (changedFields.bio) {
      payload.bio =
        profileData.bio?.trim() || "";
    }

    // Experience
    if (changedFields.experience) {
      payload.experience =
        profileData.experience === ""
          ? null
          : Number(profileData.experience);
    }

    // Consultation Fee
    if (changedFields.consultation_fee) {
      payload.consultationFee =
        profileData.consultation_fee === ""
          ? null
          : Number(
              profileData.consultation_fee
            );
    }

  if (changedFields.accept_emergency_patients) {
  payload.acceptEmergencyPatients =
    Boolean(profileData.accept_emergency_patients);
}
   

    // Hospital Details
  // ================= HOSPITAL DETAILS =================

if (changedFields.hospitalDetail) {
  const hospitalDetail = (
    profileData.hospitalDetail || []
  )
    .filter((hospital) =>
      hospital.hospitalName?.trim()
    )
    .map((hospital) => ({
      ...(hospital.clinicId
        ? {
            clinicId: String(
              hospital.clinicId
            ),
          }
        : {}),

      hospitalName:
        hospital.hospitalName?.trim() || "",

      flatPlotNo:
        hospital.flatNo?.trim() || "",

      buildingSociety:
        hospital.building?.trim() || "",

      streetName:
        hospital.street?.trim() || "",

      areaLocality:
        hospital.area?.trim() || "",

      landmark:
        hospital.landmark?.trim() || "",

      city:
        hospital.city?.trim() || "",

      district:
        hospital.district?.trim() || "",

      state:
        hospital.state?.trim() || "",

      pinCode:
        hospital.pinCode?.trim() || "",
    }));

  payload.hospitalDetail = hospitalDetail;

  // ================= AVAILABILITY =================

  payload.availability = (
    profileData.hospitalDetail || []
  ).flatMap((hospital) => {
    if (!hospital.clinicId) {
      return [];
    }

    return (hospital.availability || [])
      .filter(
        (item) =>
          item.startTime &&
          item.endTime
      )
      .map((item) => ({
        day: item.day,

        startTime:
          item.startTime || "",

        endTime:
          item.endTime || "",

        clinicId: String(
          hospital.clinicId
        ),

        isAvailable:
          item.isAvailable !== false,
      }));
  });
}
    if (profileData.logoKey) {
      payload.logo = profileData.logoKey;
    }

    if (profileData.signatureKey) {
      payload.doctor_signature = profileData.signatureKey;
    }



    // Nothing changed
    if (Object.keys(payload).length === 0) {
      showSnackbar(
        "No changes to save.",
        "info"
      );
      return;
    }

    const result = await dispatch(
      updateDoctorProfile(payload)
    );

    if (
      updateDoctorProfile.fulfilled.match(
        result
      )
    ) {
      setChangedFields({});

      await dispatch(
        fetchDoctorProfile()
      );
    }
  };

  // ================= LICENSE UPLOAD =================

  const handleLicenseUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    await dispatch(uploadLicense(file));

    dispatch(fetchDoctorProfile());
  };

  // ================= IMAGE UPLOAD =================

  const handleImageUpload = async (file) => {
    if (!file) return;

    const previousAvatarUrl = profileData.avatarUrl;
    const localPreviewUrl = URL.createObjectURL(file);
    dispatch(setProfileData({ avatarUrl: localPreviewUrl }));

    try {
      const uploadedUrl = await dispatch(
        uploadProfileImage(file)
      ).unwrap();

      dispatch(setProfileData({ avatarUrl: localPreviewUrl }));

      try {
        await dispatch(fetchDoctorProfile()).unwrap();
      } catch {
        dispatch(setProfileData({ avatarUrl: uploadedUrl }));
      }
    } catch {
      dispatch(setProfileData({ avatarUrl: previousAvatarUrl }));
    } finally {
      URL.revokeObjectURL(localPreviewUrl);
    }
  };

  const handleBrandingUpload = async (file, uploadThunk) => {
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      showSnackbar("Choose a PNG, JPG, JPEG, or WebP image.", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showSnackbar("Image must be 5 MB or smaller.", "error");
      return;
    }

    return await dispatch(uploadThunk(file)).unwrap();
  };

  // ================= UPDATE BUTTON =================

  const handleUpdateClick = () => {
    // Start fresh every time edit mode opens
    setChangedFields({});

    dispatch(setIsEditing(true));
  };

  return (
   <ProfileContent
  loading={loading && !profileLoaded}
  saving={saving}
  profileData={profileData}
  isEditing={isEditing}
  snackbar={snackbar}

  onFieldChange={handleChange}

  onClinicWorkingHoursChange={
    handleClinicWorkingHoursChangeLocal
  }

  onWorkingHoursSaved={
    handleWorkingHoursSaved
  }

  onUpdateClick={handleUpdateClick}
  onSaveClick={saveDoctorProfile}
  onCloseSnackbar={handleCloseSnackbar}

  onHospitalChange={
    handleHospitalChangeLocal
  }

  onAddHospital={
    handleAddHospitalLocal
  }

  onRemoveHospital={
    handleRemoveHospitalLocal
  }

  onLicenseUpload={handleLicenseUpload}
  onImageUpload={handleImageUpload}

  onLogoUpload={(file) =>
    handleBrandingUpload(
      file,
      uploadDoctorLogo
    )
  }

  onSignatureUpload={(file) =>
    handleBrandingUpload(
      file,
      uploadDoctorSignature
    )
  }

  logoUploading={logoUploading}
  signatureUploading={signatureUploading}
  profileImageUploading={
    profileImageUploading
  }
/>
  );
};

export default Page;