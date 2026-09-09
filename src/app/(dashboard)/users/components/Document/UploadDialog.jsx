"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";

export const UploadDialog = ({
  openUpload,
  setOpenUpload,
  isMobile,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  isDragging,
  uploadFiles,
  currentFolderName,
}) => {
  return (
    <Dialog
      open={openUpload}
      onClose={() => setOpenUpload(false)}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: isMobile ? "1.1rem" : "1.25rem",
          p: isMobile ? 2 : 3,
        }}
      >
        Upload Files
      </DialogTitle>
      <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
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
          <Box
            sx={{
              fontSize: isMobile ? 32 : 48,
              mb: 1,
              color: "#0f4f3f",
            }}
          >
            ☁️
          </Box>
          <Typography
            fontWeight={600}
            fontSize={isMobile ? 14 : 18}
            color="#0f4f3f"
            sx={{ mb: 0.5 }}
          >
            Drag & Drop or Click to Upload
          </Typography>
          <Typography
            fontSize={isMobile ? 11 : 13}
            color="black"
            sx={{ mb: 2 }}
            textAlign="center"
          >
            Files will be uploaded to: <strong>{currentFolderName}</strong>
            <br />
            Supported formats: PDF, DOC, DOCX, JPEG, PNG, PPT
            <br />
            Max size: 20MB
          </Typography>
          <Button
            component="label"
            variant="contained"
            size={isMobile ? "small" : "medium"}
            sx={{
              bgcolor: "#0f4f3f",
              "&:hover": { bgcolor: "#0c3f33" },
              fontSize: isMobile ? "0.75rem" : "0.875rem",
            }}
          >
            Browse Files
            <input hidden multiple type="file" onChange={uploadFiles} />
          </Button>
        </Box>
        <Box sx={{ textAlign: "right", mt: 2 }}>
          <Button
            onClick={() => setOpenUpload(false)}
            size={isMobile ? "small" : "medium"}
            sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};