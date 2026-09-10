"use client";

import { Dialog, DialogContent, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function PdfViewerModal({
  openPdfViewer,
  setOpenPdfViewer,
  selectedFile,
}) {


  if (!openPdfViewer || !selectedFile) return null;
   const fileUrl = selectedFile?.url || selectedFile?.blobUrl;



  return (
    <Dialog
      open={openPdfViewer}
      onClose={() => setOpenPdfViewer(false)}
      fullWidth
      maxWidth="lg"
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <IconButton onClick={() => setOpenPdfViewer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ height: "80vh", p: 0 }}>
        <iframe
          src={fileUrl}
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </DialogContent>
    </Dialog>
  );
}