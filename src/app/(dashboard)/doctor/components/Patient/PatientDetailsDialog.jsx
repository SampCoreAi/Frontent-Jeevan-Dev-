"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PatientDetailsCard from "./PatientDetailsCard";

export default function PatientDetailsDialog({
  open,
  patient,
  onClose,
}) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          m: { xs: 1, sm: 2 },
          maxHeight: "90vh",
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        size="small"
        aria-label="Close"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 10,
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.secondary,
          "&:hover": {
            bgcolor: "#EDF7F2",
            color: theme.palette.primary.main,
          },
        }}
      >
        <CloseIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <DialogContent
        sx={{
          p: { xs: 1.5, sm: 2 },
        }}
      >
        <PatientDetailsCard patient={patient} />
      </DialogContent>
    </Dialog>
  );
}