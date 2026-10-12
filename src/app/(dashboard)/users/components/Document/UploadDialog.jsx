"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPT = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.ppt,.pptx";
const primary = "#07876A";

export const UploadDialog = ({
  openUpload,
  setOpenUpload,
  uploadFiles,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  isDragging,
  uploading,
  uploadProgress,
  uploadSuccess,
  currentFolderName,
}) => {
  const [error, setError] = useState("");
  const progress = Math.min(100, Math.max(0, Number(uploadProgress) || 0));

  const close = () => {
    if (uploading) return;
    setError("");
    setOpenUpload(false);
  };

  const validate = (files) => {
    const oversized = Array.from(files || []).find(
      (file) => file.size > MAX_SIZE,
    );

    setError(
      oversized ? `${oversized.name} exceeds the 5 MB file limit.` : "",
    );
    return !oversized;
  };

  return (
    <Dialog
      open={openUpload}
      onClose={close}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          m: 2,
          width: "100%",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 20px 60px rgba(23,32,51,0.12)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 2.5,
          pb: 2,
        }}
      >
       <Box
  sx={{
    width: 44,
    height: 44,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    bgcolor: "#EDF7F2",
  }}
>
  <CloudUploadOutlinedIcon
    sx={{
      fontSize: 26,
      color: "#07876A",
      visibility: "visible",
      opacity: 1,
    }}
  />
</Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
            {uploading
              ? "Uploading files"
              : uploadSuccess
                ? "Upload complete"
                : "Upload documents"}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.3 }}>
            Keep your health documents in one place.
          </Typography>
        </Box>

        <IconButton
          size="small"
          aria-label="Close upload dialog"
          disabled={uploading}
          onClick={close}
        >
          <CloseRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 2.5, pt: 0, pb: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            px: 1.2,
            py: 1,
            mb: 2,
            borderRadius: 1.5,
            bgcolor: "#F8FAF9",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <FolderOutlinedIcon sx={{ fontSize: 18, color: primary }} />
          <Typography
            noWrap
            title={currentFolderName || "Document"}
            sx={{ fontSize: 12.5, minWidth: 0 }}
          >
            {currentFolderName || "Document"}
          </Typography>
        </Box>

        {uploading ? (
          <Box sx={{ py: 3, textAlign: "center" }}>
            <CloudUploadOutlinedIcon sx={{ fontSize: 42, color: primary }} />

            <Typography sx={{ mt: 1, fontSize: 14, fontWeight: 600 }}>
              {progress === 100 ? "Finishing upload…" : "Uploading your files…"}
            </Typography>

            <Typography sx={{ my: 1.5, fontSize: 28, fontWeight: 600 }}>
              {progress}%
            </Typography>

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: "#E7EFEB",
                "& .MuiLinearProgress-bar": {
                  bgcolor: primary,
                  borderRadius: 3,
                },
              }}
            />

            <Typography sx={{ mt: 1.5, fontSize: 12, color: "text.secondary" }}>
              Please keep this window open.
            </Typography>
          </Box>
        ) : uploadSuccess ? (
          <Box sx={{ py: 2, textAlign: "center" }}>
            <CheckCircleRoundedIcon sx={{ fontSize: 54, color: primary }} />

            <Typography sx={{ mt: 1, fontSize: 16, fontWeight: 600 }}>
              Files saved successfully
            </Typography>

            <Typography sx={{ mt: 0.7, fontSize: 13, color: "text.secondary" }}>
              {uploadSuccess}
            </Typography>

            <Button
              fullWidth
              variant="contained"
              onClick={close}
              sx={{
                mt: 2.5,
                bgcolor: primary,
                textTransform: "none",
                boxShadow: "none",
                borderRadius: 1.5,
                "&:hover": { bgcolor: "#066D56", boxShadow: "none" },
              }}
            >
              Done
            </Button>
          </Box>
        ) : (
          <>
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => {
                e.preventDefault();
                handleDragLeave();
                if (validate(e.dataTransfer.files)) handleDrop(e);
              }}
              sx={{
                py: 3,
                px: 2,
                textAlign: "center",
                border: "1.5px dashed",
                borderColor: isDragging ? primary : "#CBDAD3",
                borderRadius: 2,
                bgcolor: isDragging ? "#EDF7F2" : "#FCFDFC",
                transition: "background-color 0.2s, border-color 0.2s",
              }}
            >
              <CloudUploadOutlinedIcon
                sx={{ fontSize: 38, color: primary, mb: 1 }}
              />

              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                Drop your files here
              </Typography>

              <Typography sx={{ mt: 0.5, fontSize: 12, color: "text.secondary" }}>
                PDF, Word, images and PowerPoint
              </Typography>

              <Button
                component="label"
                variant="contained"
                sx={{
                  mt: 2,
                  px: 3,
                  bgcolor: primary,
                  borderRadius: 1.5,
                  textTransform: "none",
                  fontSize: 13,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#066D56", boxShadow: "none" },
                }}
              >
                Choose files
                <input
                  hidden
                  multiple
                  type="file"
                  accept={ACCEPT}
                  onChange={(e) => {
                    if (validate(e.target.files)) {
                      uploadFiles(e);
                    } else {
                      e.target.value = "";
                    }
                  }}
                />
              </Button>

              <Typography sx={{ mt: 1.5, fontSize: 11.5, color: "text.secondary" }}>
                Maximum 5 MB per file
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 1.5, fontSize: 12 }}>
                {error}
              </Alert>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};