"use client";

import React from "react";
import ProfileContent from "../../components/Profile/ProfileContent";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchDoctorProfile,
  updateDoctorProfile,
  uploadLicense,
  uploadProfileImage,
  handleFieldChange,
  handleWorkingHoursChange,
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
  selectProfileError,
  selectProfileSuccessMessage,
  selectIsEditing,
} from "../../store/profileSlice";

const Page = () => {
  const dispatch = useDispatch();

  const profileData = useSelector(selectProfileData);
  const loading = useSelector(selectProfileLoading);
  const error = useSelector(selectProfileError);
  const successMessage = useSelector(
    selectProfileSuccessMessage
  );
  const isEditing = useSelector(selectIsEditing);

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

  // Redux error message
  React.useEffect(() => {
    if (error) {
      showSnackbar(error, "error");
      dispatch(clearError());
    }
  }, [error, dispatch]);

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

  const handleWorkingHoursChangeLocal = (
    day,
    field,
    value
  ) => {
    dispatch(
      handleWorkingHoursChange({
        day,
        field,
        value,
      })
    );

    setChangedFields((prev) => ({
      ...prev,
      availability: true,
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
    profileData.accept_emergency_patients
      ? "YES"
      : "NO";
}
    // Availability / Working Hours
    if (changedFields.availability) {
      const formatDay = (day) => {
        return (
          day.charAt(0).toUpperCase() +
          day.slice(1)
        );
      };

      const availability = Object.entries(
        profileData.workingHours || {}
      )
        .filter(
          ([_, value]) =>
            value.start && value.end
        )
        .map(([day, value]) => ({
          day: formatDay(day),
          startTime: value.start,
          endTime: value.end,
        }));

      payload.availability = availability;
    }

    // Hospital Details
    if (changedFields.hospitalDetail) {
      const hospitalDetail = (
        profileData.hospitalDetail || []
      )
        .filter((hospital) =>
          hospital.hospitalName?.trim()
        )
        .map((hospital) => ({
          hospitalName:
            hospital.hospitalName?.trim() ||
            "",
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

      payload.hospitalDetail =
        hospitalDetail;
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

    await dispatch(
      uploadProfileImage(file)
    );

    dispatch(fetchDoctorProfile());
  };

  // ================= UPDATE BUTTON =================

  const handleUpdateClick = () => {
    // Start fresh every time edit mode opens
    setChangedFields({});

    dispatch(setIsEditing(true));
  };

  return (
    <ProfileContent
      loading={loading}
      profileData={profileData}
      isEditing={isEditing}
      snackbar={snackbar}
      onFieldChange={handleChange}
      onWorkingHoursChange={
        handleWorkingHoursChangeLocal
      }
      onUpdateClick={handleUpdateClick}
      onSaveClick={saveDoctorProfile}
      onCloseSnackbar={
        handleCloseSnackbar
      }
      onHospitalChange={
        handleHospitalChangeLocal
      }
      onAddHospital={
        handleAddHospitalLocal
      }
      onRemoveHospital={
        handleRemoveHospitalLocal
      }
      onLicenseUpload={
        handleLicenseUpload
      }
      onImageUpload={
        handleImageUpload
      }
    />
  );
};

export default Page;