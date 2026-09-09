"use client";

import React from "react";
import { Box, Typography , Button } from "@mui/material";
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

  // Fetch profile data
  const getProfile = async () => {
    try {
     const response = await apiClient.get(
  "/api/assistant/getAssistantProfile"
);

const result = response.data;

     if (result.success && result.data) {
  const data = result.data;


 if (data.image?.url) {
  setProfileImage(data.image.url);
} else {
  setProfileImage("/img/IconDoctor.png");
}
setProfileData({
  name: data.full_name || "",
  bio: data.bio || "",

  language: Array.isArray(data.language)
    ? data.language.join(", ")
    : data.language || "",

  email: data.email || "",
  phone: data.phone_number || "",
  department: data.department || "",
  education: data.education || "",
  gender: data.gender || "",
  age: data.age || "",
  experience: data.experience || "",
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
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle address field changes
  const handleAddressChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
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
      }
    );

    const imagePath = response.data.data.path;
    setProfileImage(`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${imagePath}`);
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
        }
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

if (profileData.age)
  payload.age = Number(profileData.age);
if (profileData.experience)
  payload.experience = Number(profileData.experience);

if (profileData.license)
  payload.license = profileData.license;

if (profileData.profile_image)
  payload.profile_image = profileData.profile_image;
if (profileData.gender)
  payload.gender = profileData.gender;

if (profileData.department)
  payload.department = profileData.department;

if (profileData.education)
  payload.education = profileData.education;

if (profileData.bio)
  payload.bio = profileData.bio;

if (profileData.language) {
  payload.language = profileData.language
    .split(",")
    .map(item => item.trim());
}
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
        getProfile(); // Reload latest data
      } else {
        alert(result.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
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
      
      <Box sx={{ flex: 1, padding: { xs: 2, sm: 3, md: 4 } }}>
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
            flexWrap: "wrap",
            gap: { xs: 1, sm: 2 },
            marginTop: 3,
          }}
        >
        
         <Button
  variant="contained"
  onClick={handleSaveClick}
  disabled={loading}
  sx={{
    bgcolor: "#14b8a6",
    textTransform: "none",
    borderRadius: 2,
  }}
>
  {loading ? "Saving..." : "Save"}
</Button>

          <Box
            sx={{
              border: "1px solid black",
              width: { xs: 100, sm: 120 },
              textAlign: "center",
              borderRadius: 1,
              py: { xs: 0.5, sm: 1 },
              px: { xs: 1, sm: 2 },
              backgroundColor: "#e6f5f5",
              cursor: "pointer",
            }}
            onClick={handleUpdateClick}
          >
            <Typography fontSize={{ xs: "0.75rem", sm: "0.875rem" }}>
              {isEditing ? "Cancel" : "Update"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ProfileContent>
  );
};

export default ProfilePage;