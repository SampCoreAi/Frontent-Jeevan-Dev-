
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Divider,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

import PatientProfileSidebar from "../../components/Profile/patientprofilesidebar";
import PatientProfileForm from "../../components/Profile/patientprofileform";
import { useUserProfile } from "../../../../../store/userProfileHooks";
import { API_BASE_URL, API_ENDPOINTS } from "../../../../../config/api";

export default function PatientProfilePage() {
  const [editable, setEditable] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [errorToast, setErrorToast] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirtyFields, setDirtyFields] = useState({});

  const { userProfile, loading, getUserProfile } = useUserProfile();

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
    },
    emergencyContact: {
      name: "",
      relationship: "",
      email: "",
      phone: "",
    },
    weight: "",
    height: "",
  });

  useEffect(() => {
    getUserProfile();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

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
    setDirtyFields((prev) => ({
      ...prev,
      [field]: true,
    }));

    if (field.startsWith("address.")) {
      const key = field.split(".")[1];

      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));

      return;
    }

    if (field.startsWith("emergencyContact.")) {
      const key = field.split(".")[1];

      setFormData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [key]: value,
        },
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const stringToArray = (value) => {
    if (!value) return [];

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const preparePayload = () => {
    const payload = {};

    if (dirtyFields.username) {
      payload.username = formData.username.trim();
    }

    if (dirtyFields.age) {
      payload.age = Number(formData.age);
    }

    if (dirtyFields.gender) {
      payload.gender = formData.gender
        ? formData.gender.trim().toUpperCase()
        : "";
    }

    if (dirtyFields.language) {
      payload.language = stringToArray(formData.language);
    }

    if (dirtyFields.bloodGroup) {
      payload.blood_group = formData.bloodGroup;
    }

    if (dirtyFields.weight) {
      payload.weight = Number(formData.weight);
    }

    if (dirtyFields.height) {
      payload.height = Number(formData.height);
    }

    if (dirtyFields.existingConditions) {
      payload.existing_conditions = stringToArray(
        formData.existingConditions
      );
    }

    if (dirtyFields.allergies) {
      payload.allergies = stringToArray(
        formData.allergies
      );
    }

    if (dirtyFields.bio) {
      payload.bio = formData.bio.trim();
    }

    const addressChanged =
      dirtyFields["address.street"] ||
      dirtyFields["address.city"] ||
      dirtyFields["address.state"] ||
      dirtyFields["address.pincode"];

    if (addressChanged) {
      payload.address = {
        street:
          formData.address?.street?.trim() || "",
        city:
          formData.address?.city?.trim() || "",
        state:
          formData.address?.state?.trim() || "",
        pincode:
          formData.address?.pincode?.trim() || "",
      };
    }

    const emergencyChanged =
      dirtyFields["emergencyContact.name"] ||
      dirtyFields["emergencyContact.relationship"] ||
      dirtyFields["emergencyContact.email"] ||
      dirtyFields["emergencyContact.phone"];

    if (emergencyChanged) {
      payload.emergency_contact = {
        name:
          formData.emergencyContact?.name?.trim() || "",
        relation:
          formData.emergencyContact?.relationship?.trim() || "",
        email:
          formData.emergencyContact?.email?.trim() || "",
        phone_number:
          formData.emergencyContact?.phone?.trim() || "",
      };
    }

    return payload;
  };

  const handleSave = async () => {
    try {
      const payload = preparePayload();

      console.log(
        "PROFILE UPDATE PAYLOAD:",
        payload
      );

      if (Object.keys(payload).length === 0) {
        setEditable(false);
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      setSaving(true);

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
        throw new Error(
          data?.message ||
            "Failed to update profile."
        );
      }

      setDirtyFields({});
      setEditable(false);
      setOpenToast(true);

      await getUserProfile();
    } catch (err) {
      console.error("Save Error:", err);

      setErrorToast(
        err?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleProfileAction = () => {
    if (saving) return;

    if (editable) {
      handleSave();
    } else {
      setDirtyFields({});
      setEditable(true);
    }
  };

  useEffect(() => {
    if (userProfile && !loading) {
      setFormData({
        name: userProfile.full_name || "",
        username: userProfile.username || "",
        age: userProfile.age ?? "",

        gender: userProfile.gender
          ? userProfile.gender.toUpperCase()
          : "",

        email: userProfile.email || "",
        phone: userProfile.phone_number || "",
        bio: userProfile.bio || "",
        bloodGroup: userProfile.blood_group || "",
        weight: userProfile.weight ?? "",
        height: userProfile.height ?? "",

        address: {
          street:
            userProfile.address?.street || "",
          city:
            userProfile.address?.city || "",
          state:
            userProfile.address?.state || "",
          pincode:
            userProfile.address?.pincode || "",
        },

        emergencyContact: {
          name:
            userProfile.emergency_contact?.name || "",

          relationship:
            userProfile.emergency_contact?.relation ||
            userProfile.emergency_contact?.relationship ||
            "",

          email:
            userProfile.emergency_contact?.email || "",

          phone:
            userProfile.emergency_contact?.phone_number ||
            userProfile.emergency_contact?.phone ||
            "",
        },

        existingConditions: Array.isArray(
          userProfile.existing_conditions
        )
          ? userProfile.existing_conditions.join(", ")
          : "",

        allergies: Array.isArray(
          userProfile.allergies
        )
          ? userProfile.allergies.join(", ")
          : "",

        language: Array.isArray(
          userProfile.language
        )
          ? userProfile.language.join(", ")
          : "",
      });

      setDirtyFields({});
    }
  }, [userProfile, loading]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row",
        },
        mt: 8,
        width: "100%",
      }}
    >
      <PatientProfileSidebar
        userProfile={userProfile}
        formData={formData}
        editable={editable}
        handleChange={handleChange}
      />

      <Divider
        orientation="vertical"
        flexItem
      />

      <Box
        sx={{
          flex: 1,
          px: 3,
          py: 2,
          backgroundColor: "background.paper",
        }}
      >
        <PatientProfileForm
          formData={formData}
          editable={editable}
          handleChange={handleChange}
        />

        <Divider sx={{ my: 1 }} />

        <Button
          onClick={handleProfileAction}
          disabled={saving}
          sx={{
            backgroundColor: "#07876a",
            color: "white",
            minWidth: 110,

            "&:hover": {
              backgroundColor: "#06765d",
            },

            "&.Mui-disabled": {
              backgroundColor: "#07876a",
              color: "white",
              opacity: 0.7,
            },
          }}
        >
          {saving ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CircularProgress
                size={15}
                sx={{ color: "white" }}
              />
              Saving...
            </Box>
          ) : editable ? (
            "Save Profile"
          ) : (
            "Edit Profile"
          )}
        </Button>

        <Snackbar
          open={openToast}
          autoHideDuration={2000}
          onClose={() => setOpenToast(false)}
        >
          <Alert
            severity="success"
            onClose={() => setOpenToast(false)}
          >
            Profile Saved Successfully!
          </Alert>
        </Snackbar>

        <Snackbar
          open={Boolean(errorToast)}
          autoHideDuration={3500}
          onClose={() => setErrorToast("")}
        >
          <Alert
            severity="error"
            onClose={() => setErrorToast("")}
          >
            {errorToast}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
