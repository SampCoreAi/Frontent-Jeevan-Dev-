"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

const sections = [
  {
    title: "Lab information",
    source: "labInformation",
    fields: [
      ["Lab name", "diagnosticLabName"],
      ["Lab type", "labType"],
      ["Owner name", "ownerFullName"],
      ["Owner age", "ownerAge"],
      ["Owner gender", "ownerGender"],
      ["Owner phone", "ownerPhone"],
      ["Owner email", "ownerEmail"],
      ["Lab contact phone", "labContactPhone"],
      ["Lab contact email", "labContactEmail"],
    ],
  },
  {
    title: "Lab address",
    source: "labAddress",
    fields: [
      ["Shop / unit number", "shopUnitNumber"],
      ["Building / complex", "buildingComplexName"],
      ["Street / road", "streetRoadName"],
      ["Area / locality", "areaLocality"],
      ["Landmark", "landmark"],
      ["City / town", "cityTown"],
      ["State", "state"],
      ["PIN code", "pinCode"],
    ],
  },
  {
    title: "License and business",
    source: "licenseBusiness",
    fields: [
      ["License number", "registrationLicenseNumber"],
      ["License expiry date", "licenseExpiryDate"],
      ["GSTIN", "gstin"],
    ],
  },
];

const showValue = (value) =>
  value !== null && value !== undefined && value !== "" ? value : "—";

const documentTitle = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase());

export default function LabRegistrationDetailsDialog({
  open,
  labId,
  onClose,
  onActionSuccess,
}) {
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busyAction, setBusyAction] = useState("");
  const [error, setError] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

useEffect(() => {
  if (!open || !labId) return;

  let cancelled = false;

  const fetchDetails = async () => {
    setLoading(true);
    setError("");
    setLab(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/api/lab-registration/getLabRegistrationById/${labId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to load lab registration."
        );
      }

      if (!cancelled) setLab(response.data.data);
    } catch (err) {
      if (!cancelled) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load lab registration."
        );
      }
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  fetchDetails();

  return () => {
    cancelled = true;
  };
}, [open, labId]);
  const handleAssign = async () => {
    if (!lab || busyAction) return;

    const information = lab.registrationData?.labInformation || {};
    const email = information.labContactEmail || information.ownerEmail;
    const phone = information.labContactPhone || information.ownerPhone;

    if (!email || !phone) {
      setError("Lab contact email or phone number is missing.");
      return;
    }

    setBusyAction("assign");
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/assistant-register`,
        {
          full_name: information.ownerFullName,
          email,
          phone_number: phone,
          registration_id: lab.id,
          role_id: 4,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to assign lab.");
      }

      await onActionSuccess?.("assigned");
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Unable to assign lab."
      );
    } finally {
      setBusyAction("");
    }
  };

  const handleReject = async () => {
    const reason = rejectReason.trim();

    if (!reason) return;
    if (!lab || busyAction) return;

    setBusyAction("reject");
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/api/lab-registration/admin/${lab.id}/reject`,
        { reason },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to reject registration."
        );
      }

      setRejectOpen(false);
      setRejectReason("");
      await onActionSuccess?.("rejected");
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to reject registration."
      );
    } finally {
      setBusyAction("");
    }
  };

  const information = lab?.registrationData?.labInformation || {};

  return (
    <>
      <Dialog
        open={open}
        onClose={busyAction ? undefined : onClose}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ pr: 7, pb: 1.5 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
            Lab registration details
          </Typography>

          {lab && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                Registration #{lab.id}
              </Typography>
              <Chip
                size="small"
                label={lab.onboardingStatus || "—"}
                color={lab.onboardingStatus === "SUBMITTED" ? "info" : "default"}
                sx={{ height: 23, fontSize: 10, fontWeight: 700 }}
              />
            </Stack>
          )}

          <IconButton
            onClick={onClose}
            disabled={Boolean(busyAction)}
            aria-label="Close"
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          {loading && (
            <Box sx={{ display: "grid", placeItems: "center", minHeight: 180 }}>
              <CircularProgress size={28} />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {lab && !loading && (
            <Stack spacing={2.5}>
              {sections.map((section) => {
                const source = lab.registrationData?.[section.source] || {};

                return (
                  <Box key={section.title}>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1.5 }}>
                      {section.title}
                    </Typography>

                    <Grid container spacing={2}>
                      {section.fields.map(([label, key]) => (
                        <Grid item xs={12} sm={6} md={4} key={key}>
                          <Typography
                            sx={{
                              fontSize: 11,
                              color: "text.secondary",
                              mb: 0.4,
                            }}
                          >
                            {label}
                          </Typography>
                          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                            {showValue(source[key])}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>

                    {section.title !== "License and business" && (
                      <Divider sx={{ mt: 2.5 }} />
                    )}
                  </Box>
                );
              })}

              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1.5 }}>
                  Documents
                </Typography>

                {Object.keys(lab.documents || {}).length === 0 ? (
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                    No documents available.
                  </Typography>
                ) : (
                  <Grid container spacing={1.5}>
                    {Object.entries(lab.documents || {}).flatMap(
                      ([key, value]) => {
                        const files = Array.isArray(value)
                          ? value
                          : value
                            ? [value]
                            : [];

                        return files.map((file, index) => (
                          <Grid item xs={12} sm={6} key={`${key}-${index}`}>
                            <Box
                              sx={{
                                p: 1.2,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                              }}
                            >
                              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                                {documentTitle(key)}
                                {files.length > 1 ? ` ${index + 1}` : ""}
                              </Typography>

                              {file?.url ? (
                                <Button
                                  component="a"
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  size="small"
                                  endIcon={<OpenInNewRoundedIcon />}
                                  sx={{ textTransform: "none", fontSize: 11 }}
                                >
                                  View
                                </Button>
                              ) : (
                                <Typography
                                  sx={{ fontSize: 11, color: "text.secondary" }}
                                >
                                  URL unavailable
                                </Typography>
                              )}
                            </Box>
                          </Grid>
                        ));
                      }
                    )}
                  </Grid>
                )}
              </Box>
            </Stack>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2, gap: 1 }}>
          <Button
            onClick={onClose}
            disabled={Boolean(busyAction)}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>

          <Button
            onClick={() => {
              setError("");
              setRejectReason("");
              setRejectOpen(true);
            }}
            disabled={!lab || loading || Boolean(busyAction)}
            variant="outlined"
            color="error"
            sx={{ textTransform: "none" }}
          >
            Reject
          </Button>

          <Button
            onClick={handleAssign}
            disabled={!lab || loading || Boolean(busyAction)}
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            {busyAction === "assign" ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Assign Lab"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={rejectOpen}
        onClose={() => {
          if (!busyAction) setRejectOpen(false);
        }}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>Reject lab registration</DialogTitle>

        <DialogContent>
          <Typography sx={{ mb: 1.5, fontSize: 13, color: "text.secondary" }}>
            Rejection ka reason likhein. Ye note registration ke saath send hoga.
          </Typography>

          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            label="Rejection reason"
            placeholder="Reason likhein..."
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
            inputProps={{ maxLength: 500 }}
            helperText={`${rejectReason.length}/500`}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setRejectOpen(false)}
            disabled={Boolean(busyAction)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleReject}
            disabled={!rejectReason.trim() || Boolean(busyAction)}
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
          >
            {busyAction === "reject" ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Send rejection"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}