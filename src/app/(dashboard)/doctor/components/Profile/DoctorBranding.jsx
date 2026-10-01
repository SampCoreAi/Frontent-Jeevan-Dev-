"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

const ACCEPTED_IMAGE_TYPES = "image/png,image/jpeg,image/jpg,image/webp";

const BrandingItem = ({
  title,
  imageUrl,
  emptyLabel,
  isEditing,
  uploading,
  onUpload,
  imageAlt,
}) => {
  const inputRef = useRef(null);
  const localPreviewRef = useRef("");
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");
  const [failedImageUrl, setFailedImageUrl] = useState("");

  useEffect(
    () => () => {
      if (localPreviewRef.current) {
        URL.revokeObjectURL(localPreviewRef.current);
      }
    },
    []
  );

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (localPreviewRef.current) {
        URL.revokeObjectURL(localPreviewRef.current);
      }

      const previewUrl = URL.createObjectURL(file);
      localPreviewRef.current = previewUrl;
      setLocalPreviewUrl(previewUrl);
      setFailedImageUrl("");

      try {
        await onUpload(file);
      } catch {
        URL.revokeObjectURL(previewUrl);
        localPreviewRef.current = "";
        setLocalPreviewUrl("");
      }
    }
    event.target.value = "";
  };

  const previewUrl = localPreviewUrl || imageUrl;
  const showImage = previewUrl && failedImageUrl !== previewUrl;

  return (
    <Box
      sx={{
        minWidth: 0,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: "#f7f9f9",
        p: 1.5,
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: 650, mb: 1 }}>
        {title}
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: title === "Logo" ? 220 : 300,
          height: 92,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.paper",
        }}
      >
        {showImage ? (
          <Box
            component="img"
            src={previewUrl}
            alt={imageAlt}
            onError={() => setFailedImageUrl(previewUrl)}
            sx={{ width: "100%", height: "100%", objectFit: "contain", p: 1 }}
          />
        ) : (
          <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
            {previewUrl ? "Image preview unavailable" : emptyLabel}
          </Typography>
        )}
      </Box>

      {isEditing && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES}
            hidden
            onChange={handleFileChange}
          />
          <Button
            size="small"
            variant="outlined"
            startIcon={
              uploading ? (
                <CircularProgress size={16} />
              ) : (
                <CloudUploadOutlinedIcon />
              )
            }
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            sx={{ mt: 1.25, textTransform: "none" }}
          >
            {uploading
              ? "Uploading..."
              : imageUrl
                ? `Change ${title}`
                : `Upload ${title}`}
          </Button>
        </>
      )}
    </Box>
  );
};

const DoctorBranding = ({
  logoUrl,
  signatureUrl,
  isEditing,
  logoUploading,
  signatureUploading,
  onLogoUpload,
  onSignatureUpload,
}) => (
  <Box sx={{ borderTop: "1px solid", borderColor: "divider", mt: 3, pt: 2 }}>
    <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 1.5 }}>
      Doctor Branding
    </Typography>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
        gap: 1.5,
      }}
    >
      <BrandingItem
        title="Logo"
        imageUrl={logoUrl}
        imageAlt="Doctor logo"
        emptyLabel="No logo uploaded"
        isEditing={isEditing}
        uploading={logoUploading}
        onUpload={onLogoUpload}
      />
      <BrandingItem
        title="Signature"
        imageUrl={signatureUrl}
        imageAlt="Doctor signature"
        emptyLabel="No signature uploaded"
        isEditing={isEditing}
        uploading={signatureUploading}
        onUpload={onSignatureUpload}
      />
    </Box>
  </Box>
);

export default DoctorBranding;