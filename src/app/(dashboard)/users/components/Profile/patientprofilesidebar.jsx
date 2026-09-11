import React from "react";
import {
  Box,
  Stack,
  Avatar,
  Switch,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../../../../../store/slices/userProfileSlice";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../../../../config/api";
const PatientProfileSidebar = ({ userProfile, formData, editable, handleChange }) => {
  const dispatch = useDispatch();
  const localUser = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); }
    catch { return {}; }
  })();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleCameraClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const [previewImage, setPreviewImage] = React.useState(null);
const handleUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const localPreview = URL.createObjectURL(file);
  setPreviewImage(localPreview);

  const uploadFormData = new FormData();
  uploadFormData.append("file", file);

  const token = localStorage.getItem("token");

  try {
    const res = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.UPLOAD_IMAGE}?folder=user-profile`,
      uploadFormData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("UPLOAD RESPONSE:", res.data);

  } catch (err) {
    console.error("Upload Error:", err);
    setPreviewImage(null);
  }
};
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleRemovePhoto = () => {
    setPreviewImage(null);
    handleChange("doctor_image", "");
  };
  const displayName = localUser?.name || formData?.name || "Patient";
  const displayUsername = formData?.username
    ? "@" + formData.username
    : "@" + (displayName.toLowerCase().replace(/\s+/g, ""));
  const displayEmail =
    formData?.email ||
    userProfile?.email ||
    localUser?.email ||
    "";

  const displayPhone =
    formData?.phone ||
    userProfile?.phone_number ||
    localUser?.phone_number ||
    "";

const S3_URL = process.env.NEXT_PUBLIC_S3_BUCKET_URL;

const displayImage =
  previewImage ||
  (userProfile?.image?.url
    ? userProfile.image.url.startsWith("http")
      ? userProfile.image.url
      : `${S3_URL}/${userProfile.image.url}`
    : null) ||
  (userProfile?.doctor_image
    ? `${S3_URL}/${userProfile.doctor_image}`
    : null);

  const avatarInitial = displayName
    ? displayName.charAt(0).toUpperCase()
    : "P";

  const boxStyle = {
    backgroundColor: "#f5f5f5",
    padding: "10px 14px",
    borderRadius: "12px",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const infoRow = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f5f5f5",
    padding: "8px 12px",
    borderRadius: "8px",
    width: "100%",
    justifyContent: "center",
  };

  const generateUsername = () => {
    const uid = userProfile?.user_id || localUser?.id || "";
    const name = userProfile?.full_name || localUser?.full_name;
    const email = userProfile?.email || localUser?.email;
    if (name) {
      return "@" + name.toLowerCase().replace(/\s+/g, "") + (uid ? uid : "");
    } else if (email) {
      return "@" + email.split("@")[0];
    }
    return "@user";
  };

  return (
    <Stack
      alignItems="center"
      sx={{
        width: { xs: "100%", md: "25%" },
        backgroundColor: "#fbfdfc",
        p: 3,
        borderRadius: "12px",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Avatar
          src={displayImage || undefined}
          sx={{
            width: { xs: 130, md: 190 },
            height: { xs: 130, md: 230 },
            borderRadius: 3,
            border: "4px solid #15b8a7",
            fontSize: { xs: "3rem", md: "4rem" },
            backgroundColor: "#15b8a7",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          {!displayImage && avatarInitial}
        </Avatar>
        <input
          type="file"
          id="upload-photo-input"
          hidden
          accept="image/*"
          onChange={handleUpload}
        />
        {/* ✅ Camera Icon (only in edit mode) */}
        {editable && (
          <IconButton
            onClick={handleCameraClick}
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            <CameraAltIcon sx={{ color: "#15b8a7" }} />
          </IconButton>
        )}
      </Box>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            document.getElementById("upload-photo-input").click();
          }}
        >
          Upload New Photo
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            handleRemovePhoto();
          }}
        >
          Remove Photo
        </MenuItem>
      </Menu>

      {/* Name */}
      <Typography
        sx={{
          fontSize: { xs: 18, md: 22 },
          fontWeight: 700,
          color: "#153933",
          mt: 2,
          textAlign: "center",
        }}
      >
        {displayName}
      </Typography>

      {/* Username */}
      {editable ? (
        <Box sx={{ ...infoRow, my: 1, justifyContent: "flex-start" }}>
          <Typography sx={{ fontSize: 14, color: "#7e8180", fontWeight: 500 }}>@</Typography>
          <input
            type="text"
            value={formData.username || ""}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="Choose a username"
            style={{
              border: "none",
              background: "transparent",
              fontSize: "14px",
              color: "black",
              fontWeight: 500,
              outline: "none",
              width: "100%",
            }}
          />
        </Box>
      ) : (
        <Typography sx={{ fontSize: 14, color: "#15b8a7", my: 2, fontWeight: 500 }}>
          {displayUsername}
        </Typography>
      )}
      {/* Email */}
      {displayEmail && (
        <Box sx={infoRow}>
          <EmailIcon sx={{ color: "#1e6658", fontSize: 18 }} />
          <Typography sx={{ fontSize: 13, color: "#7e8180" }}>
            {displayEmail}
          </Typography>
        </Box>
      )}

      {/* Phone */}
      {displayPhone && (
        <Box sx={{ ...infoRow, mt: 1 }}>
          <PhoneIcon sx={{ color: "#1e6658", fontSize: 18 }} />
          <Typography sx={{ fontSize: 13, color: "#7e8180" }}>
            {displayPhone}
          </Typography>
        </Box>
      )}

      {/* Notification */}
      {/* <Box sx={{ ...boxStyle, mt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <NotificationsIcon sx={{ color: "#1e6658" }} />
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#1c573e" }}>
            Notification
          </Typography>
        </Box>
        <Switch disabled color="success" />
      </Box> */}


    </Stack>
  );
};

export default PatientProfileSidebar;