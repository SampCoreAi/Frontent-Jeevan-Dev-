"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import api from "../../../../../utils/axiosInstance";

const SAMPLE_TYPES = ["BLOOD", "URINE", "SERUM", "PLASMA", "SWAB", "STOOL", "SPUTUM", "OTHER"];

export default function PatientLabSearchTab() {
  const [query, setQuery] = useState("");
  const [labs, setLabs] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLab, setSelectedLab] = useState(null);
  const [testsInput, setTestsInput] = useState("");
  const [sampleType, setSampleType] = useState("BLOOD");
  const [priority, setPriority] = useState("NORMAL");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const searchLabs = async (event) => {
    event.preventDefault();
    const search = query.trim();
    if (!search) {
      setError("Enter a lab name or lab code to search.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setSearched(true);
      const response = await api.get("/api/labs/search", { params: { search } });
      const results = response.data?.data;
      setLabs(Array.isArray(results) ? results : []);
    } catch (requestError) {
      setLabs([]);
      setError(requestError?.response?.data?.message || "Unable to search labs right now.");
    } finally {
      setLoading(false);
    }
  };

  const submitRequest = async (event) => {
    event.preventDefault();
    const tests = [...new Set(testsInput.split(/[\n,]+/).map((test) => test.trim()).filter(Boolean))];
    if (!tests.length || tests.length > 20 || tests.some((test) => test.length < 2 || test.length > 150)) {
      setError("Enter 1 to 20 test names, each between 2 and 150 characters.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const response = await api.post("/api/lab-requests/create", {
        labId: Number(selectedLab.id),
        tests,
        sampleType,
        priority,
        doctorNote: "Requested by patient from lab search.",
      });
      const request = response.data?.data || {};
      const requestCode = request.order_id || request.id;
      setSuccess(`Request sent to ${selectedLab.lab_name}${requestCode ? `. Request ID: ${requestCode}` : ""}.`);
      setSelectedLab(null);
      setTestsInput("");
      setSampleType("BLOOD");
      setPriority("NORMAL");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to send your lab request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ width: "100%", pt: 2 }}>
      <Typography sx={{ mb: 0.5, fontSize: "18px", fontWeight: 700, color: "#172033" }}>
        Find a laboratory
      </Typography>
      <Typography sx={{ mb: 2, fontSize: "13px", color: "#64748B" }}>
        Search by lab name or code, then request the tests you need.
      </Typography>

      <Box component="form" onSubmit={searchLabs} sx={{ display: "flex", gap: 1, mb: 2.5, maxWidth: 680 }}>
        <TextField
          fullWidth
          size="small"
          label="Lab name or lab code"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Button type="submit" variant="contained" disabled={loading} sx={{ minWidth: 104, textTransform: "none", bgcolor: "#07876A" }}>
          {loading ? <CircularProgress size={18} color="inherit" /> : "Search"}
        </Button>
      </Box>

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {success ? <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>{success}</Alert> : null}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress size={26} /></Box>
      ) : searched && labs.length === 0 && !error ? (
        <Typography sx={{ py: 4, color: "#64748B", fontSize: "14px" }}>No active labs matched this search.</Typography>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 1.5 }}>
          {labs.map((lab) => (
            <Paper key={lab.id} variant="outlined" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, p: 2, borderRadius: "8px", borderColor: "#DFE7EB" }}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ minWidth: 0 }}>
                <Box sx={{ width: 38, height: 38, flexShrink: 0, borderRadius: "8px", bgcolor: "#E8F4F0", color: "#07876A", display: "grid", placeItems: "center" }}>
                  <ScienceOutlinedIcon fontSize="small" />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#172033", overflowWrap: "anywhere" }}>{lab.lab_name}</Typography>
                  <Typography sx={{ mt: 0.3, fontSize: "11px", color: "#64748B" }}>Lab code: {lab.lab_code || "-"}</Typography>
                  <Typography sx={{ mt: 0.5, fontSize: "12px", color: "#52646B" }}>{lab.address || "Address not provided"}</Typography>
                  {lab.phone_number ? <Typography sx={{ mt: 0.25, fontSize: "12px", color: "#52646B" }}>{lab.phone_number}</Typography> : null}
                </Box>
              </Stack>
              <Button variant="outlined" onClick={() => { setError(""); setSelectedLab(lab); }} sx={{ flexShrink: 0, textTransform: "none", borderColor: "#07876A", color: "#07876A" }}>
                Request tests
              </Button>
            </Paper>
          ))}
        </Box>
      )}

      <Dialog open={Boolean(selectedLab)} onClose={() => !submitting && setSelectedLab(null)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={submitRequest}>
          <DialogTitle sx={{ fontSize: "16px", fontWeight: 700, color: "#172033" }}>Request tests from {selectedLab?.lab_name}</DialogTitle>
          <DialogContent sx={{ display: "grid", gap: 1.75, pt: "8px !important" }}>
            <TextField required multiline minRows={3} label="Tests" placeholder="Example: CBC, Blood sugar" value={testsInput} onChange={(event) => setTestsInput(event.target.value)} helperText="Separate test names with commas or new lines." />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField select fullWidth label="Sample type" value={sampleType} onChange={(event) => setSampleType(event.target.value)}>
                {SAMPLE_TYPES.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
              </TextField>
              <TextField select fullWidth label="Priority" value={priority} onChange={(event) => setPriority(event.target.value)}>
                <MenuItem value="NORMAL">Normal</MenuItem>
                <MenuItem value="URGENT">Urgent</MenuItem>
              </TextField>
            </Stack>
            {error ? <Alert severity="error">{error}</Alert> : null}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setSelectedLab(null)} disabled={submitting} sx={{ textTransform: "none" }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting} sx={{ textTransform: "none", bgcolor: "#07876A" }}>
              {submitting ? "Sending..." : "Send request"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}