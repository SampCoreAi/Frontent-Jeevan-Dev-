"use client";

import { Box, Typography, Button } from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import UploadIcon from "@mui/icons-material/Upload";

export const EmptyState = ({
  selectedFolder,
  currentFolderName,
  createFolder,
  setOpenUpload,
  isMobile,
  isTablet,
}) => {
  return (
    <Box
      sx={{
        gridColumn: "1 / -1",
        textAlign: "center",
        mt: isMobile ? 4 : isTablet ? 6 : 10,
        color: "#555",
        px: isMobile ? 1 : 0,
        width: "100%",
      }}
    >
      <Box
        sx={{
          fontSize: isMobile ? 36 : isTablet ? 48 : 64,
          mb: isMobile ? 1 : 2,
          opacity: 0.7,
        }}
      >
        📁
      </Box>

      <Typography
        variant={isMobile ? "subtitle1" : isTablet ? "h6" : "h5"}
        fontWeight={600}
        gutterBottom
        sx={{
          fontSize: isMobile ? "1rem" : isTablet ? "1.25rem" : "1.5rem",
        }}
      >
        {selectedFolder === "root" || selectedFolder === "Document"
          ? "Welcome to Documents"
          : `${currentFolderName} is empty`}
      </Typography>

      <Typography
        sx={{
          mb: isMobile ? 2 : 3,
          maxWidth: 500,
          mx: "auto",
          fontSize: isMobile ? "0.75rem" : isTablet ? "0.875rem" : "0.875rem",
        }}
      >
        {selectedFolder === "root" || selectedFolder === "Document"
          ? "Manage and organize your files in one place. Create folders and upload documents when ready."
          : "No files or subfolders in this folder yet. Upload files or create subfolders to get started."}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: isMobile ? 1 : 2,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Button
          onClick={createFolder}
          variant="contained"
          startIcon={<CreateNewFolderIcon />}
          size={isMobile ? "small" : isTablet ? "medium" : "medium"}
          sx={{
            bgcolor: "#0f4f3f",
            "&:hover": { bgcolor: "#0c3f33" },
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          }}
        >
          {isMobile ? "New Folder" : "Create Folder"}
        </Button>
        <Button
          onClick={() => setOpenUpload(true)}
          variant="outlined"
          startIcon={<UploadIcon />}
          size={isMobile ? "small" : isTablet ? "medium" : "medium"}
          sx={{
            borderColor: "#0f4f3f",
            color: "#0f4f3f",
            "&:hover": {
              borderColor: "#0c3f33",
              bgcolor: "#f5f9f8",
            },
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          }}
        >
          {isMobile ? "Upload" : "Upload Files"}
        </Button>
      </Box>
    </Box>
  );
};