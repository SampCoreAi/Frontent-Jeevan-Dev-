"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import DocumentButton from "./DocumentButton";

const DocumentDialog = ({
  open,
  onClose,
  selectedDoctor,
  getFileUrl,
  onAssignDoctor,
}) => {
  const handleAssignDoctor = () => {
    if (onAssignDoctor && selectedDoctor) {
      onAssignDoctor(selectedDoctor);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 700,
          color: "#173f38",
        }}
      >
        Doctor Documents

        <IconButton onClick={onClose}>
          <CloseOutlined />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {selectedDoctor && (
          <Stack spacing={2}>
           

            <DocumentButton
              title="Medical Registration Certificate"
              path={selectedDoctor.medical_registration_certificate}
              getFileUrl={getFileUrl}
            />

            <DocumentButton
              title="Medical Degree Certificate"
              path={selectedDoctor.medical_degree_certificate}
              getFileUrl={getFileUrl}
            />

            <DocumentButton
              title="Government ID Proof"
              path={selectedDoctor.government_id_proof}
              getFileUrl={getFileUrl}
            />

            <DocumentButton
              title="Selfie"
              path={selectedDoctor.selfie}
              getFileUrl={getFileUrl}
            />
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "#64748b",
            textTransform: "none",
          }}
        >
          Close
        </Button>

        <Button
          variant="contained"
          onClick={handleAssignDoctor}
          sx={{
            backgroundColor: "#1e6658",
            textTransform: "none",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#155347",
            },
          }}
        >
          Assign Doctor
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentDialog;