"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

const SAMPLE_TYPES = ["BLOOD", "URINE", "SERUM", "PLASMA", "SWAB", "STOOL", "SPUTUM", "OTHER"];

export default function LabAddTestDialog({ onCreateRequest, successMessage }) {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successDetails, setSuccessDetails] = useState(null);
  const [createMode, setCreateMode] = useState("WALK_IN");
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorPhone, setDoctorPhone] = useState("");
  const [testsInput, setTestsInput] = useState("");
  const [sampleType, setSampleType] = useState("BLOOD");
  const [priority, setPriority] = useState("NORMAL");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setPatientName("");
    setPatientEmail("");
    setPatientPhone("");
    setDoctorName("");
    setDoctorPhone("");
    setTestsInput("");
    setSampleType("BLOOD");
    setPriority("NORMAL");
    setCreateMode("WALK_IN");
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    const tests = [...new Set(testsInput.split(/[\n,]+/).map((test) => test.trim()).filter(Boolean))];

    if (patientName.trim().length < 3) {
      setError("Enter the patient's full name.");
      return;
    }
    if (patientEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientEmail.trim())) {
      setError("Enter a valid patient email address.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(patientPhone.trim())) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (doctorPhone.trim() && !/^[6-9]\d{9}$/.test(doctorPhone.trim())) {
      setError("Enter a valid 10-digit referring doctor mobile number.");
      return;
    }
    if (!tests.length || tests.length > 20 || tests.some((test) => test.length < 2 || test.length > 150)) {
      setError("Enter 1 to 20 test names, each between 2 and 150 characters.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const result = await onCreateRequest?.({
        fullName: patientName.trim(),
        email: patientEmail.trim().toLowerCase(),
        phoneNumber: patientPhone.trim(),
        referringDoctorName: doctorName.trim(),
        referringDoctorPhone: doctorPhone.trim(),
        tests,
        sampleType,
        priority,
        requestType: createMode,
      });
      if (!result?.success) {
        setError(result?.message || "Unable to create test request. Check the details and try again.");
        return;
      }
      setOpen(false);
      setSuccessDetails({
        patientId: result.patientId || result.request?.patient_id || "-",
        requestId: result.orderId || result.request?.order_id || result.requestId || result.request?.id || "-",
      });
      setSuccessOpen(true);
      resetForm();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || "Unable to create test request.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => {
          setError("");
          setOpen(true);
        }}
        sx={{
          minHeight: 40,
          width: { xs: "100%", sm: "auto" },
          px: 2,
          borderRadius: "8px",
          bgcolor: "#0B5C8E",
          textTransform: "none",
          boxShadow: "none",
          "&:hover": { bgcolor: "#094F79", boxShadow: "none" },
        }}
      >
        Add Test
      </Button>

      <Dialog
        open={open}
        onClose={() => !saving && setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <Box component="form" onSubmit={submit}>
          <DialogTitle sx={{ pb: 1, fontSize: "16px", fontWeight: 700, color: "#123F66" }}>
            Add lab test request
          </DialogTitle>
          <DialogContent sx={{ display: "grid", gap: 2, pt: "8px !important" }}>
            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={createMode}
              onChange={(_, value) => value && setCreateMode(value)}
              aria-label="Request type"
              sx={{
                "& .MuiToggleButton-root": { py: 1, fontWeight: 600, textTransform: "none" },
                "& .Mui-selected": { color: "#0B5C8E !important", bgcolor: "#EFF6FF !important" },
              }}
            >
              <ToggleButton value="WALK_IN">Walk-in</ToggleButton>
              <ToggleButton value="INDEPENDENT">Independent</ToggleButton>
            </ToggleButtonGroup>

            <Typography sx={{ mt: -1.25, fontSize: "11.5px", color: "#64748B" }}>
              {createMode === "WALK_IN"
                ? "Create a request for a patient visiting the lab."
                : "Create a request without linking it to a doctor prescription."}
            </Typography>

            {error ? <Alert severity="error" sx={{ fontSize: "12px" }}>{error}</Alert> : null}

            <TextField required size="small" label="Patient full name" value={patientName} onChange={(event) => setPatientName(event.target.value)} />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField fullWidth size="small" type="email" label="Patient email (optional)" value={patientEmail} onChange={(event) => setPatientEmail(event.target.value)} />
              <TextField required fullWidth size="small" label="Mobile number" value={patientPhone} onChange={(event) => setPatientPhone(event.target.value.replace(/\D/g, "").slice(0, 10))} inputProps={{ inputMode: "numeric", maxLength: 10 }} />
            </Stack>
            <Typography sx={{ mt: -1.25, fontSize: "11px", color: "#64748B" }}>
              A unique patient ID will be generated automatically when saved.
            </Typography>

            <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Referring doctor (optional)</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField fullWidth size="small" label="Doctor name" value={doctorName} onChange={(event) => setDoctorName(event.target.value)} />
              <TextField fullWidth size="small" label="Doctor mobile" value={doctorPhone} onChange={(event) => setDoctorPhone(event.target.value.replace(/\D/g, "").slice(0, 10))} inputProps={{ inputMode: "numeric", maxLength: 10 }} />
            </Stack>

            <TextField required multiline minRows={2} size="small" label="Tests" placeholder="Example: CBC, Blood sugar" value={testsInput} onChange={(event) => setTestsInput(event.target.value)} helperText="Separate test names with commas or new lines." />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField select fullWidth size="small" label="Sample type" value={sampleType} onChange={(event) => setSampleType(event.target.value)}>
                {SAMPLE_TYPES.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
              </TextField>
              <TextField select fullWidth size="small" label="Priority" value={priority} onChange={(event) => setPriority(event.target.value)}>
                <MenuItem value="NORMAL">Normal</MenuItem>
                <MenuItem value="URGENT">Urgent</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpen(false)} disabled={saving} sx={{ textTransform: "none" }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving} sx={{ textTransform: "none", bgcolor: "#0B5C8E" }}>
              {saving ? "Creating..." : "Create request"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 1.5, fontSize: "16px", fontWeight: 700, color: "#123F66" }}>
          Request created
          <IconButton aria-label="Close confirmation" onClick={() => setSuccessOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 1.5, pt: "8px !important" }}>
          <Alert severity="success" sx={{ fontSize: "12px" }}>
            {successMessage || "The patient test request was created successfully."}
          </Alert>
          <Typography sx={{ fontSize: "13px", color: "#334155" }}>
            Patient ID: <Box component="strong">{successDetails?.patientId || "-"}</Box>
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "#334155" }}>
            Request ID: <Box component="strong">{successDetails?.requestId || "-"}</Box>
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}