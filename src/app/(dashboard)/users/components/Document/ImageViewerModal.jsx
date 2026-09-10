"use client";

import { Dialog, DialogContent, IconButton, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Download as DownloadIcon } from "@mui/icons-material";

export function ImageViewerModal({
  openImageViewer,
  setOpenImageViewer,
  selectedFile,
  handleDownload,
  currentFolderName,
  isMobile,
  isTablet,
}) {
  if (!openImageViewer || !selectedFile) return null;
 const fileUrl = selectedFile?.url || selectedFile?.blobUrl;
  return (
    <Dialog
      open={openImageViewer}
      onClose={() => setOpenImageViewer(false)}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "grey.50",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {selectedFile.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mt: 0.25 }}
          >
            {currentFolderName} • {selectedFile.size}
          </Typography>
        </Box>
        
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => handleDownload(selectedFile)}
            size="small"
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => setOpenImageViewer(false)}
            size="small"
            sx={{
              bgcolor: "grey.200",
              color: "grey.700",
              "&:hover": {
                bgcolor: "grey.300",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Image Content */}
      <DialogContent
        sx={{
          p: 0,
          height: isMobile ? "60vh" : "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "grey.100",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={fileUrl}
          alt={selectedFile.name}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            borderRadius: 4,
          }}
          onError={(e) => {
            console.error("Image failed to load:", e);
            e.target.style.display = "none";
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
