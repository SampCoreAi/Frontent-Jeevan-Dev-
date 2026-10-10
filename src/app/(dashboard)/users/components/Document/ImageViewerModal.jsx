"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";

export function ImageViewerModal({
  openImageViewer,
  setOpenImageViewer,
  selectedFile,
  handleDownload,
  currentFolderName,
  isMobile,
}) {
  const [visible, setVisible] = useState(false);

  const fileUrl =
    selectedFile?.url || selectedFile?.blobUrl;

  useEffect(() => {
    if (openImageViewer) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      setVisible(false);
    }
  }, [openImageViewer]);

  if (!selectedFile) return null;

  const handleClose = () => {
    setVisible(false);

    setTimeout(() => {
      setOpenImageViewer(false);
    }, 280);
  };

  return (
    <Dialog
      open={openImageViewer}
      onClose={handleClose}
      keepMounted
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(3px)",
          },
        },
      }}
      sx={{
        "& .MuiDialog-container": {
          p: {
            xs: 1,
            sm: 2,
            md: 3,
          },
        },
      }}
   PaperProps={{
  sx: {
    width: "fit-content",
    maxWidth: "calc(100vw - 32px)",

    height: "fit-content",
    maxHeight: "calc(100vh - 32px)",

    margin: 0,

    borderRadius: {
      xs: "12px",
      md: "16px",
    },

    overflow: "hidden",

    bgcolor: "#fff",

    display: "flex",
    flexDirection: "column",

    opacity: visible ? 1 : 0,

    transform: visible
      ? "scale(1) translateY(0)"
      : "scale(0.65) translateY(80px)",

    transformOrigin: "center center",

    transition:
      "transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease",

    boxShadow:
      "0 25px 80px rgba(0,0,0,0.45)",
  },
}}
    >
      {/* ================= HEADER ================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          px: {
            xs: 1.5,
            sm: 2,
          },

          py: {
            xs: 1,
            sm: 1.25,
          },

          minHeight: {
            xs: 58,
            sm: 64,
          },

          borderBottom: "1px solid",
          borderColor: "divider",

          bgcolor: "#fff",

          flexShrink: 0,

          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            minWidth: 0,
            flex: 1,
            mr: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "14px",
                sm: "17px",
              },

              fontWeight: 700,

              color: "text.primary",

              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {selectedFile.name}
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: "10px",
                sm: "12px",
              },

              color: "text.secondary",

              mt: 0.25,
            }}
          >
            {currentFolderName} • {selectedFile.size}
          </Typography>
        </Box>

        {/* ACTIONS */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            flexShrink: 0,
          }}
        >
         

          <IconButton
            onClick={handleClose}
            sx={{
              width: 38,
              height: 38,

              bgcolor: "grey.100",

              color: "grey.700",

              "&:hover": {
                bgcolor: "grey.200",
              },
            }}
          >
            <CloseIcon
              sx={{
                fontSize: 21,
              }}
            />
          </IconButton>
        </Box>
      </Box>

      {/* ================= IMAGE ================= */}

     <DialogContent
  sx={{
    p: 0,
    width: "fit-content",
    maxWidth: "100%",
    maxHeight: "calc(100vh - 100px)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    bgcolor: "#f4f5f5",

    overflow: "hidden",

    lineHeight: 0,
  }}
>
  <img
    src={fileUrl}
    alt={selectedFile.name}
    style={{
      display: "block",

      width: "auto",
      height: "auto",

      maxWidth: "calc(100vw - 32px)",
      maxHeight: "calc(100vh - 100px)",

      objectFit: "contain",

      borderRadius: "0",

      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
    }}
    onError={(e) => {
      console.error("Image failed to load:", e);
      e.currentTarget.style.display = "none";
    }}
  />
</DialogContent>
    </Dialog>
  );
}