"use client";

import { useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

const RULES = {
  Logo: {
    types: ["image/png", "image/webp"],
    accept: "image/png,image/webp",
    size: 500 * 1024,
    width: 500,
    height: 500,
    details: "PNG or WebP • 500 × 500 px • Max 500 KB",
  },
  Signature: {
    types: ["image/png"],
    accept: "image/png",
    size: 200 * 1024,
    width: 600,
    height: 200,
    details: "Transparent PNG • 600 × 200 px • Max 200 KB",
  },
};

function readImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({ image, url });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image could not be opened."));
    };

    image.src = url;
  });
}

async function validateImage(file, title) {
  const rule = RULES[title];

  if (!rule.types.includes(file.type)) {
    return title === "Logo"
      ? "Please select a PNG or WebP image."
      : "Please select a PNG image.";
  }

  if (file.size > rule.size) {
    return `File size must be under ${title === "Logo" ? "500 KB" : "200 KB"}.`;
  }

  try {
    const { image, url } = await readImage(file);
    const dimensionsMatch =
      image.width === rule.width && image.height === rule.height;

    if (!dimensionsMatch) {
      URL.revokeObjectURL(url);
      return `Image dimensions must be ${rule.width} × ${rule.height} px.`;
    }

    if (title === "Signature") {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(image, 0, 0);

      const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
      const corners = [
        3,
        (canvas.width - 1) * 4 + 3,
        ((canvas.height - 1) * canvas.width) * 4 + 3,
        (canvas.width * canvas.height - 1) * 4 + 3,
      ];

      const hasTransparentBackground = corners.every(
        (index) => data[index] === 0,
      );

      URL.revokeObjectURL(url);

      if (!hasTransparentBackground) {
        return "Signature must have a transparent background.";
      }
    } else {
      URL.revokeObjectURL(url);
    }
  } catch {
    return "Could not verify this image. Please choose another file.";
  }

  return "";
}

function BrandingItem({
  title,
  imageUrl,
  isEditing,
  uploading,
  onUpload,
}) {
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const loading = busy || uploading;
  const rule = RULES[title];

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || loading) return;

    setError("");
    const validationError = await validateImage(file, title);

    if (validationError) {
      setError(validationError);
      return;
    }

    setBusy(true);

    try {
      await onUpload(file);
      setOpen(false);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed #CBD5E1",
          borderRadius: 1.5,
          bgcolor: "#fff",
          overflow: "hidden",
        }}
      >
        {imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt={`Doctor ${title.toLowerCase()}`}
            sx={{ width: "100%", height: "100%", objectFit: "contain", p: 1.5 }}
          />
        ) : (
          <Typography sx={{ fontSize: 12, color: "#64748B" }}>
            No {title.toLowerCase()} uploaded
          </Typography>
        )}
      </Box>

      {isEditing && (
        <>
          <Button
            variant="outlined"
            disabled={loading}
            onClick={() => {
              setError("");
              setOpen(true);
            }}
            sx={{
              mt: 1.25,
              minHeight: 34,
              color: "#07876A",
              borderColor: "#07876A",
              borderRadius: 1.5,
              textTransform: "none",
            }}
          >
            {loading ? "Uploading..." : `${imageUrl ? "Change" : "Upload"} ${title}`}
          </Button>

          <Dialog
            open={open}
            onClose={() => !loading && setOpen(false)}
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle sx={{ fontSize: 17, fontWeight: 700 }}>
              {title === "Logo" ? "Clinic Logo" : "Doctor Signature"}
            </DialogTitle>

            <DialogContent>
              <Box
                sx={{
                  minHeight: 220,
                  p: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  border: "1px dashed #CBD5E1",
                  borderRadius: 2,
                  bgcolor: "#fff",
                }}
              >
                <CloudUploadOutlinedIcon
                  sx={{ fontSize: 48, color: "#64748B", mb: 1 }}
                />

                <Typography sx={{ fontWeight: 700 }}>
                  {title === "Logo" ? "Upload clinic logo" : "Upload your signature"}
                </Typography>

                <Typography sx={{ mt: 0.5, fontSize: 13, color: "#64748B" }}>
                  {rule.details}
                </Typography>

                <Typography sx={{ fontSize: 13, color: "#64748B" }}>
                  {title === "Logo"
                    ? "Transparent background preferred"
                    : "Use a clear signature on transparent background"}
                </Typography>

                <input
                  ref={inputRef}
                  type="file"
                  accept={rule.accept}
                  hidden
                  onChange={handleFileChange}
                />

                <Button
                  variant="outlined"
                  disabled={loading}
                  onClick={() => inputRef.current?.click()}
                  startIcon={
                    loading ? (
                      <CircularProgress size={16} />
                    ) : (
                      <CloudUploadOutlinedIcon />
                    )
                  }
                  sx={{
                    mt: 1.5,
                    color: "#07876A",
                    borderColor: "#07876A",
                    borderRadius: 1.5,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {loading ? "Uploading..." : "Choose Image"}
                </Button>
              </Box>

              {error && (
                <Typography
                  role="alert"
                  sx={{ mt: 1.25, fontSize: 12, color: "error.main" }}
                >
                  {error}
                </Typography>
              )}
            </DialogContent>
          </Dialog>
        </>
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