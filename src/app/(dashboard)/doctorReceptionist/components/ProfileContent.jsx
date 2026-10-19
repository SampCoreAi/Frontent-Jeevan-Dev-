"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import apiClient from "../../doctor/services/api";
import ProfileContent from "../components/Profile/ProfileContent";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import ProfileDetails from "../components/Profile/ProfileDetails";
import ProfileAddress from "../components/Profile/ProfileAddress";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingChip, setEditingChip] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState("/img/IconDoctor.png");
  const [showAddress, setShowAddress] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Profile data state
  const [profileData, setProfileData] = React.useState({
    name: "",
    bio: "",
    language: "",
      dob: "",
    email: "",
    phone: "",
    department: "",
    education: "",
    experience: "",
    gender: "",
    age: "",
    license: "",
    profile_image: "",
    chipLabel: "",
    chipLabel1: "",
    chipLabel2: "",
    address: {
      flatNo: "",
      building: "",
      street: "",
      area: "",
      landmark: "",
      city: "",
      district: "",
      state: "",
      pinCode: "",
    },
  });
const S3_BUCKET_URL = (
  process.env.NEXT_PUBLIC_S3_BUCKET_URL || ""
).replace(/\/+$/, "");

const getS3ImageUrl = (url) => {
  if (!url) return "/img/IconDoctor.png";
  if (/^https?:\/\//i.test(url)) return url;

  return `${S3_BUCKET_URL}/${url.replace(/^\/+/, "")}`;
};
  // Fetch profile data
  const getProfile = async () => {
    try {
      const response = await apiClient.get(
        "/api/assistant/getAssistantProfile",
      );

      const result = response.data;

      if (result.success && result.data) {
        const data = result.data;

        if (data.image?.url) {
         setProfileImage(getS3ImageUrl(data.image?.url));
        } else {
          setProfileImage("/img/IconDoctor.png");
        }
       setProfileData({
  name: data.full_name || "",
  bio: data.bio || "",

  dob: data.dob
    ? String(data.dob).slice(0, 10)
    : "",

  language: Array.isArray(data.language)
    ? data.language.join(", ")
    : data.language || "",

  email: data.email || "",
  phone: data.phone_number || "",
  department: data.department || "",
  education: data.education || "",
  gender: data.gender || "",
  age: data.age ?? "",
  experience: data.experience ?? "",
  license: data.license || "",
  profile_image: data.doctor_image || "",

  chipLabel: data.department || "",
  chipLabel1: data.education || "",
  chipLabel2: data.doctor_assign || "",

  address: {
    flatNo: data.address?.flat || "",
    building: data.address?.building || "",
    street: data.address?.street || "",
    area: data.address?.area || "",
    landmark: data.address?.landmark || "",
    city: data.address?.city || "",
    district: data.address?.district || "",
    state: data.address?.state || "",
    pinCode: data.address?.pincode || "",
  },
});
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Load profile on mount
  React.useEffect(() => {
    getProfile();
  }, []);

  // Handle field changes
  const handleChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle address field changes
  const handleAddressChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  // Upload profile image
  const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(
      "/api/licenseFile/imageUpload?folder=assistant-profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const imagePath = response.data.data.path;
    setProfileImage(getS3ImageUrl(imagePath));
    setProfileData((prev) => ({
      ...prev,
      profile_image: imagePath,
    }));
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    await uploadProfileImage(file);
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setProfileImage("/img/icon.png");
  };

  // Upload license
  const uploadLicense = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiClient.post(
        "/api/licenseFile/upload?folder=document",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const fileKey = response.data.data.fileKey;
      setProfileData((prev) => ({
        ...prev,
        license: fileKey,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  // Handle license upload
  const handleLicenseUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    await uploadLicense(file);
  };

// Update profile
const handleUpdateProfile = async () => {
  try {
    setLoading(true);

    const payload = {};

    if (profileData.age !== "" && profileData.age != null) {
      payload.age = Number(profileData.age);
    }

    if (
      profileData.experience !== "" &&
      profileData.experience != null
    ) {
      payload.experience = Number(profileData.experience);
    }

    if (profileData.license) {
      payload.license = profileData.license;
    }

    if (profileData.profile_image) {
      payload.profile_image = profileData.profile_image;
    }

    if (profileData.gender) {
      payload.gender = profileData.gender;
    }

    if (profileData.department) {
      payload.department = profileData.department;
    }

    if (profileData.education) {
      payload.education = profileData.education;
    }

    // Date of Birth
    payload.dob = profileData.dob || null;

    // Language: convert comma-separated string into array
    payload.language = profileData.language
      ? profileData.language
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    if (profileData.bio) {
      payload.bio = profileData.bio;
    }

    // Address
    if (profileData.address) {
      payload.address = {
        flat: profileData.address.flatNo || "",
        building: profileData.address.building || "",
        street: profileData.address.street || "",
        area: profileData.address.area || "",
        landmark: profileData.address.landmark || "",
        city: profileData.address.city || "",
        district: profileData.address.district || "",
        state: profileData.address.state || "",
        pincode: profileData.address.pinCode || "",
      };
    }

    const response = await apiClient.patch(
      "/api/assistant/updateAssistantProfile",
      payload
    );

    const result = response.data;

    if (result.success) {
      alert("Profile Updated Successfully");

      setIsEditing(false);
      setEditingChip(false);

      await getProfile();
    } else {
      alert(result.message || "Update failed");
    }
  } catch (error) {
    console.error("Profile update error:", error);

    alert(
      error.response?.data?.message ||
      "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};

  // Handle update/cancel button click
  const handleUpdateClick = () => {
    setIsEditing(!isEditing);
    setEditingChip(false);
  };

  // Handle save button click
  const handleSaveClick = () => {
    if (!isEditing) return;
    handleUpdateProfile();
  };

  // Handle chip edit
  const handleChipEdit = () => {
    setEditingChip(true);
  };

  // Handle chip save
  const handleChipSave = () => {
    setEditingChip(false);
  };

return (
  <ProfileContent>
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row",
        },
        alignItems: "stretch",
        width: "100%",
        minWidth: 0,
        mt:4,
        gap: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: {
            xs: "100%",
            md: 280,
            lg: 320,
          },
          flexShrink: 0,
          minWidth: 0,
        }}
      >
        <ProfileSidebar
          profileImage={profileImage}
          profileData={profileData}
          isEditing={isEditing}
          editingChip={editingChip}
          onImageUpload={handleImageUpload}
          onImageRemove={handleRemoveImage}
          onChipEdit={handleChipEdit}
          onChipSave={handleChipSave}
          onFieldChange={handleChange}
        />
      </Box>

      {/* Main Profile Content */}
      <Box
        sx={{
          flex: 1,
          width: "100%",
          minWidth: 0,
          padding: {
            xs: 1,
            sm: 2,
            md: 3,
          },
          boxSizing: "border-box",
        }}
      >
        <ProfileDetails
          profileData={profileData}
          isEditing={isEditing}
          onFieldChange={handleChange}
          onLicenseUpload={handleLicenseUpload}
        />

        <ProfileAddress
          address={profileData.address}
          isEditing={isEditing}
          showAddress={showAddress}
          setShowAddress={setShowAddress}
          onAddressChange={handleAddressChange}
        />

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            flexWrap: "wrap",
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
            gap: 2,
            mt: 3,
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            onClick={handleSaveClick}
            disabled={loading || !isEditing}
            fullWidth={false}
            sx={{
              bgcolor: "#14b8a6",
              textTransform: "none",
              borderRadius: 2,
              minWidth: {
                xs: "100%",
                sm: 120,
              },
              "&:hover": {
                bgcolor: "#0d9488",
              },
            }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>

          <Button
            variant="outlined"
            onClick={handleUpdateClick}
            sx={{
              width: {
                xs: "100%",
                sm: 120,
              },
              borderColor: "#14b8a6",
              color: "#0f766e",
              backgroundColor: "#e6f5f5",
              textTransform: "none",
              borderRadius: 2,
              "&:hover": {
                borderColor: "#0d9488",
                backgroundColor: "#d5eeee",
              },
            }}
          >
            {isEditing ? "Cancel" : "Update"}
          </Button>
        </Box>
      </Box>
    </Box>
  </ProfileContent>
);

};

export default ProfilePage;
