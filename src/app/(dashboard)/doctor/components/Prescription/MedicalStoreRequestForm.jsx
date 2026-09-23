"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import LocalPharmacyOutlined from "@mui/icons-material/LocalPharmacyOutlined";
import api from "../../../../../utils/axiosInstance";
import { appointmentService } from "../../services/api";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const toPrescriptionMedicines = (source = []) =>
  source
    .filter((medicine) => String(medicine?.medicine_name || medicine?.name || "").trim())
    .map((medicine) => ({
      medicine_name: String(medicine.medicine_name || medicine.name).trim(),
      dose: medicine.dose || "",
      unit: medicine.unit || "",
      frequency: medicine.frequency || medicine.freq || "",
      duration: medicine.duration || "",
      instructions: medicine.instructions || medicine.instr || "",
    }));

export default function MedicalStoreRequestForm({
  patientId,
  appointmentId,
  canSend = false,
  hasSavedPrescription = false,
  isTodayAppointment = false,
}) {
  const [open, setOpen] = useState(false);
  const [approvedMedicalStores, setApprovedMedicalStores] = useState([]);
  const [medicalStoreDraft, setMedicalStoreDraft] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!open || approvedMedicalStores.length) return;

    const loadApprovedMedicalStores = async () => {
      try {
        const response = await api.get("/api/medical-stores/doctor/connections");
        const connections = response?.data?.data || [];
        setApprovedMedicalStores(
          connections
            .filter((connection) => String(connection?.status || "").toUpperCase() === "APPROVED")
            .map((connection) => ({
              id: connection.medical_store_id || connection.store_id || connection.id,
              name: connection.store_name || connection.medical_store_name || "Medical Store",
              city: connection.city || connection.address || "",
              phone: connection.phone || connection.phone_number || "",
            }))
            .filter((store) => store.id)
        );
      } catch (requestError) {
        setError(getErrorMessage(requestError, "Unable to load medical stores."));
      }
    };

    loadApprovedMedicalStores();
  }, [open, approvedMedicalStores.length]);

  const toggleMedicalStoreSelection = (storeId) => {
    setMedicalStoreDraft((current) => (current === storeId ? null : storeId));
  };

  const handleClose = () => {
    if (sending) return;
    setOpen(false);
    setMedicalStoreDraft(null);
    setError("");
  };

  const handleSaveMedicalStoreSelection = async () => {
    if (!patientId) {
      setError("Patient account could not be identified for this appointment.");
      return;
    }
    if (!appointmentId) {
      setError("Appointment not found.");
      return;
    }
    if (!medicalStoreDraft) {
      setError("Select a medical store.");
      return;
    }

    try {
      setSending(true);
      const prescriptionResponse = await appointmentService.getPrescriptionByAppointmentId(appointmentId);
      const prescriptionData = prescriptionResponse?.data?.data || prescriptionResponse?.data || prescriptionResponse;
      const prescriptionMedicines = toPrescriptionMedicines(
        prescriptionData?.prescription?.medicines
        || prescriptionData?.data?.prescription?.medicines
        || []
      );

      if (!prescriptionMedicines.length) {
        setError("Pehle prescription save karein. Unsaved medicines medical store ko nahi jayengi.");
        return;
      }

      const response = await api.post("/api/medical-requests/create", {
        patientId,
        storeId: medicalStoreDraft,
        appointmentId,
        medicines: prescriptionMedicines,
        note: prescriptionMedicines
          .map((medicine) => [medicine.dose, medicine.frequency, medicine.instructions].filter(Boolean).join(" · "))
          .filter(Boolean)
          .join(" | ") || null,
      });

      setNotice(response?.data?.message || "Medical request sent successfully.");
      setOpen(false);
      setMedicalStoreDraft(null);
      setError("");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to send medical request."));
    } finally {
      setSending(false);
    }
  };

  const disabledReason = !isTodayAppointment
  ? "Medicines can be forwarded to the medical store only on the appointment date."
  : !hasSavedPrescription
    ? "Please save the prescription before sending medicines to the medical store."
    : "";

  return (
    <>
      <Tooltip title={disabledReason} disableHoverListener={!disabledReason}>
        <span>
          <Button
            variant="outlined"
            startIcon={<LocalPharmacyOutlined />}
            disabled={!canSend}
            onClick={() => {
              setError("");
              setOpen(true);
            }}
            sx={{ textTransform: "none", borderRadius: 1.5, minHeight: 32, px: 1.25, fontSize: "12px" }}
          >
            Medical Store
          </Button>
        </span>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontSize: "14px", fontWeight: 700, px: 2, py: 1.5 }}>
          Select medical store
        </DialogTitle>
        <DialogContent dividers sx={{ px: 2, py: 1.5 }}>
          <Box sx={{ display: "grid", gap: 1.1 }}>
            {error ? <Alert severity="error" onClose={() => setError("")}>{error}</Alert> : null}
            <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>
              Sirf aaj ki saved prescription ki medicines jayengi. Pad update karke save karo, tabhi medical request update hogi.
            </Typography>
            {approvedMedicalStores.map((store) => (
              <Box
                key={store.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  border: "1px solid #e2e8f0",
                  borderRadius: 1.25,
                  p: 1,
                  background: medicalStoreDraft === store.id ? "#f0fdf4" : "#fff",
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: "12.5px", fontWeight: 700, color: "#0f172a" }}>{store.name}</Typography>
                  <Typography sx={{ fontSize: "10.5px", color: "#64748b" }}>
                    {store.city} • {store.phone}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant={medicalStoreDraft === store.id ? "contained" : "outlined"}
                  color={medicalStoreDraft === store.id ? "success" : "primary"}
                  onClick={() => toggleMedicalStoreSelection(store.id)}
                  sx={{ textTransform: "none", minWidth: 74, fontSize: "11.5px", px: 1 }}
                >
                  {medicalStoreDraft === store.id ? "Selected" : "Select"}
                </Button>
              </Box>
            ))}
            {!approvedMedicalStores.length ? (
              <Typography variant="body2" color="text.secondary">
                No approved medical store connection found.
              </Typography>
            ) : null}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1.5 }}>
          <Button onClick={handleClose} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveMedicalStoreSelection} disabled={sending} sx={{ textTransform: "none" }}>
            {sending ? "Sending..." : "Send"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={4000}
        onClose={() => setNotice("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setNotice("")}>
          {notice}
        </Alert>
      </Snackbar>
    </>
  );
}
