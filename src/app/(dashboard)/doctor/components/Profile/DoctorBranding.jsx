"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

function BrandingItem({ title, imageUrl, isEditing, uploading, onUpload }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [failedUrl, setFailedUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFile(null);
    setFailedUrl("");
    setError("");
  }, [imageUrl, isEditing]);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleUpload = async (event) => {
    const selected = event.target.files?.[0];
    event.target.value = "";

    if (!selected || busy || uploading) return;

    if (!IMAGE_TYPES.includes(selected.type)) {
      setError("Please select a PNG, JPG or WebP image.");
      return;
    }

    setError("");
    setFailedUrl("");
    setFile(selected);
    setBusy(true);

    try {
      await onUpload(selected);
    } catch {
      setFile(null);
      setError("Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const url = preview || imageUrl;
  const loading = busy || uploading;

  return (
    <Box
      sx={{
        minWidth: 0,
        p: 1.5,
        border: "1px solid #DDE9E5",
        borderRadius: 2,
        bgcolor: "#F8FAF9",
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>

      <Box
        sx={{
          height: 110,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed #CBD5E1",
          borderRadius: 1.5,
          bgcolor: "#fff",
          overflow: "hidden",
        }}
      >
        {url && failedUrl !== url ? (
          <Box
            component="img"
            src={url}
            alt={`Doctor ${title.toLowerCase()}`}
            onError={() => setFailedUrl(url)}
            sx={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              boxSizing: "border-box",
              p: 1.5,
            }}
          />
        ) : (
          <Typography sx={{ fontSize: 12, color: "#64748B" }}>
            {url ? "Preview unavailable" : `No ${title.toLowerCase()} uploaded`}
          </Typography>
        )}
      </Box>

      {isEditing && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept={IMAGE_TYPES.join(",")}
            hidden
            onChange={handleUpload}
          />

          <Button
            variant="outlined"
            disabled={loading}
            onClick={() => inputRef.current?.click()}
            startIcon={
              loading ? (
                <CircularProgress size={15} color="inherit" />
              ) : (
                <CloudUploadOutlinedIcon />
              )
            }
            sx={{
              mt: 1.25,
              px: 1.5,
              minHeight: 34,
              color: "#07876A",
              borderColor: "#07876A",
              borderRadius: 1.5,
              textTransform: "none",
              whiteSpace: "nowrap",
            }}
          >
            <Typography component="span" sx={{ fontSize: 12, fontWeight: 600 }}>
              {loading ? "Uploading..." : `${url ? "Change" : "Upload"} ${title}`}
            </Typography>
          </Button>
        </>
      )}

      {error && (
        <Typography role="alert" sx={{ mt: 1, fontSize: 12, color: "error.main" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default function DoctorBranding({
  logoUrl,
  signatureUrl,
  isEditing,
  logoUploading,
  signatureUploading,
  onLogoUpload,
  onSignatureUpload,
}) {
  return (
    <Box sx={{ borderTop: "1px solid #DDE9E5", mt: 3, pt: 2 }}>
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
          isEditing={isEditing}
          uploading={logoUploading}
          onUpload={onLogoUpload}
        />
        <BrandingItem
          title="Signature"
          imageUrl={signatureUrl}
          isEditing={isEditing}
          uploading={signatureUploading}
          onUpload={onSignatureUpload}
        />
      </Box>
    </Box>
  );
}