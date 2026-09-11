"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

export const UploadDialog = ({
  openUpload,
  setOpenUpload,
  uploadFiles,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  isDragging,
  uploading,
  uploadSuccess,
  currentFolderName,
  isMobile,
}) => {
  const handleClose = () => {
    // Upload ke time dialog close nahi hone denge
    if (uploading) return;

    setOpenUpload(false);
  };

  return (
    <Dialog
      open={openUpload}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      {/* ================= TITLE ================= */}

      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: isMobile ? "1.1rem" : "1.25rem",
          p: isMobile ? 2 : 3,
          color: "#0f4f3f",
        }}
      >
        {uploading
          ? "Uploading File"
          : uploadSuccess
          ? "Upload Complete"
          : "Upload Files"}
      </DialogTitle>

      {/* ================= CONTENT ================= */}

      <DialogContent
        sx={{
          p: isMobile ? 2 : 3,
        }}
      >
        {/* ================= UPLOADING ================= */}

        {uploading ? (
          <Box
            sx={{
              border: "2px dashed #0f4f3f",
              borderRadius: 2,
              height: isMobile ? "200px" : "250px",
              bgcolor: "#fafafa",

              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",

              textAlign: "center",
              gap: 2,
            }}
          >
            <CircularProgress
              size={isMobile ? 40 : 50}
              thickness={4}
              sx={{
                color: "#0f4f3f",
              }}
            />

            <Typography
              fontWeight={600}
              fontSize={isMobile ? 15 : 18}
              color="#0f4f3f"
            >
              Uploading...
            </Typography>

            <Typography
              fontSize={isMobile ? 11 : 13}
              color="text.secondary"
            >
              Please wait while your file is being uploaded.
            </Typography>
          </Box>
        ) : uploadSuccess ? (
          /* ================= SUCCESS ================= */

          <Box
            sx={{
              minHeight: isMobile ? "200px" : "250px",

              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",

              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                bgcolor: "#e8f5e9",

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                fontSize: 36,
                mb: 2,
              }}
            >
              ✅
            </Box>

            <Alert
              severity="success"
              sx={{
                width: "100%",
                maxWidth: 400,
              }}
            >
              {uploadSuccess}
            </Alert>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 2,
              }}
            >
              Your file is ready to view.
            </Typography>
          </Box>
        ) : (
          /* ================= NORMAL UPLOAD UI ================= */

          <>
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              sx={{
                border: "2px dashed #0f4f3f",
                borderRadius: 2,

                p: isMobile ? 2 : 4,

                textAlign: "center",

                bgcolor: isDragging ? "#e6f2ef" : "#fafafa",

                transition: "0.2s",

                height: isMobile ? "200px" : "250px",

                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Cloud Icon */}

              <Box
                sx={{
                  fontSize: isMobile ? 32 : 48,
                  mb: 1,
                }}
              >
                ☁️
              </Box>

              {/* Heading */}

              <Typography
                fontWeight={600}
                fontSize={isMobile ? 14 : 18}
                color="#0f4f3f"
                sx={{
                  mb: 0.5,
                }}
              >
                Drag & Drop or Click to Upload
              </Typography>

              {/* Details */}

              <Typography
                fontSize={isMobile ? 11 : 13}
                color="black"
                sx={{
                  mb: 2,
                }}
                textAlign="center"
              >
                Files will be uploaded to:{" "}
                <strong>{currentFolderName || "Document"}</strong>

                <br />

                Supported formats: PDF, DOC, DOCX, JPEG, PNG, PPT

                <br />

                Max size: 20MB
              </Typography>

              {/* Browse Button */}

              <Button
                component="label"
                variant="contained"
                size={isMobile ? "small" : "medium"}
                sx={{
                  bgcolor: "#0f4f3f",

                  "&:hover": {
                    bgcolor: "#0c3f33",
                  },

                  fontSize: isMobile
                    ? "0.75rem"
                    : "0.875rem",

                  textTransform: "none",
                  px: 3,
                }}
              >
                Browse Files

                <input
                  hidden
                  multiple
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.ppt,.pptx"
                  onChange={uploadFiles}
                />
              </Button>
            </Box>

            {/* Close Button */}

            <Box
              sx={{
                textAlign: "right",
                mt: 2,
              }}
            >
              <Button
                onClick={handleClose}
                size={isMobile ? "small" : "medium"}
                sx={{
                  fontSize: isMobile
                    ? "0.75rem"
                    : "0.875rem",

                  color: "#0f4f3f",
                  textTransform: "none",
                }}
              >
                Close
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};