"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Divider,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

import PatientProfileSidebar from "../../components/Profile/patientprofilesidebar";
import PatientProfileForm from "../../components/Profile/patientprofileform";
import { useUserProfile } from "../../../../../store/userProfileHooks";
import { useAppDispatch } from "../../../../../store/hooks";
import { API_BASE_URL, API_ENDPOINTS } from "../../../../../config/api";

export default function PatientProfilePage() {
  const [editable, setEditable] = useState(false);
  const [openToast, setOpenToast] = useState(false);

  const dispatch = useAppDispatch();
  const { userProfile, loading, getUserProfile } = useUserProfile();

  useEffect(() => {
    getUserProfile();
  }, []);


  const [formData, setFormData] = useState({
    name: "",
    age: "",
    username: "",
    gender: "",
    email: "",
    phone: "",
    bio: "",
    bloodGroup: "",
    existingConditions: "",
    allergies: "",
    language: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    }, emergencyContact: {
      name: "",
      relationship: "",
      email: "",
      phone: "",
    },
    weight: "",   
    height: "",   
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      setFormData((prev) => ({
        ...prev,
        name: storedUser.name || "",        
        email: storedUser.email || "",
        phone: storedUser.mobile || "",
        username: "",                        
      }));
    }
  }, []);

  const handleChange = (field, value) => {
    if (!editable) return;

    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const preparePayload = () => {
    return {
      username: formData.username || null,

      age: formData.age ? Number(formData.age) : null,
gender: formData.gender
  ? formData.gender.trim().toUpperCase()
  : null,
      language: formData.language
        ? formData.language.split(",").map((l) => l.trim()).filter(Boolean)
        : [],

      address: {
        street: formData.address?.street || null,
        city: formData.address?.city || null,
        state: formData.address?.state || null,
        pincode: formData.address?.pincode || null,
      },

      emergency_contact: {
        name: formData.emergencyContact?.name || null,
        relationship: formData.emergencyContact?.relationship || null,
        email: formData.emergencyContact?.email || null,
        phone: formData.emergencyContact?.phone || null,
      },
      blood_group: formData.bloodGroup || null,
      weight: formData.weight ? Number(formData.weight) : null,
      height: formData.height ? Number(formData.height) : null,
      existing_conditions: formData.existingConditions
        ? formData.existingConditions.split(",").map((c) => c.trim()).filter(Boolean)
        : [],
      allergies: formData.allergies
        ? formData.allergies.split(",").map((a) => a.trim()).filter(Boolean)
        : [],
      bio: formData.bio || null,
    };
  };
const handleSave = async () => {
  try {
    const payload = preparePayload();

    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.UPDATE_PROFILE}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed");
    }

    setEditable(false);
    setOpenToast(true);

    getUserProfile();
  } catch (err) {
    console.error("Save Error:", err);
  }
};

 const handleProfileAction = () => {
  if (editable) {
    handleSave();
  } else {
    setEditable(true);
  }
};

  // ✅ Populate form from API
  useEffect(() => {
    if (userProfile && !loading) {
      setFormData({
        name: userProfile.full_name || "",
        username: userProfile.username || "",
        age: userProfile.age || "",
     gender: userProfile.gender
  ? userProfile.gender.toUpperCase()
  : "",
        email: userProfile.email || "",
        phone: userProfile.phone_number || "",
        bio: userProfile.bio || "",
        bloodGroup: userProfile.blood_group || "",
        weight: userProfile.weight || "",
        height: userProfile.height || "",
        address: userProfile.address || {   // ← YEH MISSING THA
          street: "",
          city: "",
          state: "",
          pincode: "",
        },
        emergencyContact: userProfile.emergency_contact || {
          name: "",
          relationship: "",
          email: "",
          phone: "",
        },
        existingConditions: Array.isArray(userProfile.existing_conditions)
          ? userProfile.existing_conditions.join(", ")
          : "",
        allergies: Array.isArray(userProfile.allergies)
          ? userProfile.allergies.join(", ")
          : "",
        language: Array.isArray(userProfile.language)
          ? userProfile.language.join(", ")
          : "",
      });
    }
  }, [userProfile, loading]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        mt: 8,

        width: "100%",
      }}
    >
      <PatientProfileSidebar
        userProfile={userProfile}
        formData={formData}
        editable={editable}         
        handleChange={handleChange}       />

      <Divider orientation="vertical" flexItem />

      <Box sx={{ flex: 1, px: 3, py: 2, backgroundColor: "white" }}>
       

        <PatientProfileForm
          formData={formData}
          editable={editable}
          handleChange={handleChange}
        />

        <Divider sx={{ my: 1 }} />

        <Button
          onClick={handleProfileAction}
          sx={{
            backgroundColor: "#07876a",
            color: "white",
          }}
        >
         {editable ? "Save Profile" : "Edit Profile"}
        </Button>

        <Snackbar
          open={openToast}
          autoHideDuration={2000}
          onClose={() => setOpenToast(false)}
        >
          <Alert severity="success">Profile Saved Successfully!</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}