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
  IconButton,
} from "@mui/material";

import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SlideshowOutlinedIcon from "@mui/icons-material/SlideshowOutlined";

const THEME_COLOR = "#0f4f3f";
const THEME_COLOR_DARK = "#0c3f33";

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
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
        },
      }}
    >
      {/* ================= TITLE ================= */}

      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: isMobile ? "1.1rem" : "1.25rem",
          p: isMobile ? 2 : 3,
          color: THEME_COLOR,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {uploadSuccess ? (
            <CheckCircleOutlineIcon sx={{ color: THEME_COLOR }} />
          ) : (
            <CloudUploadOutlinedIcon sx={{ color: THEME_COLOR }} />
          )}
          {uploading
            ? "Uploading File"
            : uploadSuccess
            ? "Upload Complete"
            : "Upload Files"}
        </Box>

        {!uploading && (
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{ color: THEME_COLOR }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
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
              border: `2px dashed ${THEME_COLOR}`,
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
                color: THEME_COLOR,
              }}
            />

            <Typography
              fontWeight={600}
              fontSize={isMobile ? 15 : 18}
              color={THEME_COLOR}
            >
              Uploading...
            </Typography>

            <Typography fontSize={isMobile ? 11 : 13} color="black">
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

                mb: 2,
              }}
            >
              <CheckCircleOutlineIcon
                sx={{ fontSize: 40, color: "#2e7d32" }}
              />
            </Box>

            <Alert
              icon={false}
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
              color="black"
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
                border: `2px dashed ${THEME_COLOR}`,
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

              <CloudUploadOutlinedIcon
                sx={{
                  fontSize: isMobile ? 40 : 56,
                  color: THEME_COLOR,
                  mb: 1,
                }}
              />

              {/* Heading */}

              <Typography
                fontWeight={600}
                fontSize={isMobile ? 14 : 18}
                color={THEME_COLOR}
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
                  mb: 1.5,
                }}
                textAlign="center"
              >
                Files will be uploaded to:{" "}
                <strong>{currentFolderName || "Document"}</strong>
                <br />
                Max size: 20MB
              </Typography>

              {/* Supported format icons */}

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  mb: 2,
                  color: THEME_COLOR,
                  opacity: 0.75,
                }}
              >
                <PictureAsPdfOutlinedIcon fontSize={isMobile ? "small" : "medium"} />
                <DescriptionOutlinedIcon fontSize={isMobile ? "small" : "medium"} />
                <ImageOutlinedIcon fontSize={isMobile ? "small" : "medium"} />
                <SlideshowOutlinedIcon fontSize={isMobile ? "small" : "medium"} />
              </Box>

              {/* Browse Button */}

              <Button
                component="label"
                variant="contained"
                size={isMobile ? "small" : "medium"}
                startIcon={<InsertDriveFileOutlinedIcon />}
                sx={{
                  bgcolor: THEME_COLOR,

                  "&:hover": {
                    bgcolor: THEME_COLOR_DARK,
                  },

                  fontSize: isMobile ? "0.75rem" : "0.875rem",

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
                  fontSize: isMobile ? "0.75rem" : "0.875rem",

                  color: THEME_COLOR,
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