
"use client";

import { useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Grid,
  IconButton,
  Link,
  TextField,
  Typography,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://13.203.192.191:4000"
).replace(/\/+$/, "");

const formatLabel = (value) => {
  if (!value) return "";

  return String(value)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

function DetailSection({ title, data }) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return null;
  }

  const entries = Object.entries(data).filter(
    ([, value]) =>
      value !== null &&
      value !== undefined &&
      typeof value !== "object" &&
      value !== ""
  );

  if (!entries.length) return null;

  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        sx={{
          fontSize: 15,
          fontWeight: 700,
          mb: 2,
          color: "#202939",
        }}
      >
        {title}
      </Typography>

      <Grid container spacing={2}>
        {entries.map(([key, value]) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <Typography
              sx={{
                fontSize: 12,
                color: "#64748b",
                mb: 0.6,
              }}
            >
              {formatLabel(key)}
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 500,
                color: "#202939",
                overflowWrap: "anywhere",
              }}
            >
              {formatValue(value)}
            </Typography>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mt: 2.5 }} />
    </Box>
  );
}

export default function PharmacyRegistrationDetailsDialog({
  open,
  registration,
  onClose,
  onActionSuccess,
}) {
  const [busyAction, setBusyAction] = useState("");
  const [error, setError] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");

  const registrationData = registration?.registrationData || {};
  const signatory = registrationData.signatoryDetails || {};
  const pharmacist = registrationData.pharmacistDetails || {};

  const documents = registration?.documents || {};

  const sections = [
    {
      title: "Pharmacy Information",
      data: {
        licensedTradeName: registrationData.licensedTradeName,
        legalEntityName: registrationData.legalEntityName,
        entityType: registrationData.entityType,
        storeEmail:
          registration?.storeEmail || registrationData.storeEmail,
        storePhone: registrationData.storePhone,
        createdAt: registration?.createdAt,
        updatedAt: registration?.updatedAt,
      },
    },
    {
      title: "Premises Details",
      data: registrationData.premisesDetails,
    },
    {
      title: "Signatory Details",
      data: registrationData.signatoryDetails,
    },
    {
      title: "Pharmacist Details",
      data: registrationData.pharmacistDetails,
    },
    {
      title: "Drug Licence Details",
      data: registrationData.drugLicenceDetails,
    },
  ];

  const documentEntries = Object.entries(documents).filter(
    ([, value]) =>
      value !== null &&
      value !== undefined &&
      value !== ""
  );
const handleReject = async () => {
  if (!registration?.id || busyAction) return;

  try {
    setBusyAction("reject");
    setError("");

    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${API_BASE_URL}/api/pharmacy-registration/admin/${registration.id}/reject`,
      { notes: rejectNotes.trim() },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Rejection failed");
    }

    setRejectOpen(false);
    await onActionSuccess?.("rejected");
    onClose();
  } catch (err) {
    setError(
      err.response?.data?.message || err.message || "Rejection failed"
    );
  } finally {
    setBusyAction("");
  }
};
  const handleAssign = async () => {
    if (!registration || busyAction) return;

    const email =
      registration.storeEmail ||
      registrationData.storeEmail ||
      signatory.email;
    const phone =
      registrationData.storePhone ||
      signatory.phone ||
      pharmacist.phone;
    const fullName =
      signatory.fullName ||
      pharmacist.fullName ||
      registrationData.licensedTradeName;

    if (!email || !phone || !fullName) {
      setError("Pharmacy contact name, email, or phone number is missing.");
      return;
    }

    setBusyAction("assign");
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/assistant-register`,
        {
          full_name: fullName,
          email,
          phone_number: phone,
          registration_id: registration.id,
          role_id: 6,
        },
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to assign pharmacy."
        );
      }

      await onActionSuccess?.("assigned");
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to assign pharmacy."
      );
    } finally {
      setBusyAction("");
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={busyAction ? undefined : onClose}
        fullWidth
        maxWidth="lg"
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: "92vh",
            m: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            px: 3,
            py: 2.2,
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 21,
                  fontWeight: 700,
                  color: "#202939",
                }}
              >
                Pharmacy Registration Details
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "#64748b",
                  mt: 0.5,
                }}
              >
                Registration ID: {registration?.id ?? "-"}
              </Typography>
            </Box>

            <IconButton
              onClick={onClose}
              disabled={Boolean(busyAction)}
              aria-label="Close dialog"
            >
              <CloseRoundedIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2.5 }}>
          {!registration ? (
            <Alert severity="info">
              No pharmacy registration selected.
            </Alert>
          ) : (
            <>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {sections.map((section) => (
                <DetailSection
                  key={section.title}
                  title={section.title}
                  data={section.data}
                />
              ))}

              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 700,
                  mb: 2,
                  color: "#202939",
                }}
              >
                Documents
              </Typography>

              {documentEntries.length === 0 ? (
                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#64748b",
                    mb: 2,
                  }}
                >
                  No documents available.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {documentEntries.map(([name, value]) => {
                    const files = Array.isArray(value)
                      ? value
                      : [value];

                    return files.map((file, index) => {
                      const url =
                        typeof file === "string"
                          ? file
                          : file?.url;

                      return (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          key={`${name}-${index}`}
                        >
                          <Box
                            sx={{
                              p: 2,
                              border: "1px solid #e2e8f0",
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 600,
                                mb: 1,
                              }}
                            >
                              {formatLabel(name)}
                            </Typography>

                            {url ? (
                              <Link
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="hover"
                                sx={{ fontSize: 12 }}
                              >
                                View Document
                              </Link>
                            ) : (
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  color: "#64748b",
                                }}
                              >
                                Document URL unavailable
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      );
                    });
                  })}
                </Grid>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 1.5,
            borderTop: "1px solid #e2e8f0",
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={Boolean(busyAction)}
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>
         <Button
  variant="outlined"
  color="error"
  onClick={() => {
    setError("");
    setRejectNotes("");
    setRejectOpen(true);
  }}
  disabled={!registration || Boolean(busyAction)}
  sx={{ textTransform: "none" }}
>
  Reject
</Button>
          <Button
            variant="contained"
            onClick={handleAssign}
            disabled={!registration || Boolean(busyAction)}
            sx={{ textTransform: "none", minWidth: 110 }}
          >
            {busyAction === "assign" ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Assign"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontSize: 18, fontWeight: 700 }}>
          Reject Pharmacy Registration
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 1.5, fontSize: 13, color: "text.secondary" }}>
            Add notes explaining why this registration is being rejected.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={4}
            label="Notes"
            placeholder="Enter rejection notes"
            value={rejectNotes}
            onChange={(event) => setRejectNotes(event.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setRejectOpen(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={!rejectNotes.trim()}
onClick={handleReject}
            sx={{ textTransform: "none" }}
          >
            Reject Registration
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
