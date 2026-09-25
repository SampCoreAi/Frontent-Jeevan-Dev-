"use client";

import { useEffect, useState } from "react";
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
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ScienceOutlined from "@mui/icons-material/ScienceOutlined";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import api from "../../../../../utils/axiosInstance";

const getRows = (response) => response?.data?.data || [];
const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Unable to send lab request.";

const SAMPLE_TYPES = ["BLOOD", "URINE", "SERUM", "PLASMA", "SWAB", "STOOL", "SPUTUM", "OTHER"];

const normalizeLab = (lab = {}) => ({
  id: lab.id || lab.lab_id || lab.labId,
  name: lab.lab_name || lab.name || "Unnamed lab",
  code: lab.lab_code || lab.code || "",
});

export default function LabTestRequestForm({ patientId, appointmentId, storageKey, resetKey, onSummaryChange }) {
  const [open, setOpen] = useState(false);
  const [labs, setLabs] = useState([]);
  const [testInput, setTestInput] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [draftAssignments, setDraftAssignments] = useState([]);
  const [sent, setSent] = useState(false);
  const [priority, setPriority] = useState("NORMAL");
  const [sampleType, setSampleType] = useState("BLOOD");
  const [loadingLabs, setLoadingLabs] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    setStorageReady(false);

    if (typeof window === "undefined" || !storageKey) {
      setStorageReady(true);
      return;
    }

    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || "null");
      const savedAssignments = Array.isArray(saved?.assignments)
        ? saved.assignments
        : (Array.isArray(saved?.tests) && saved?.labId
          ? saved.tests.map((test) => ({ test, labId: String(saved.labId) }))
          : []);
      setAssignments(savedAssignments);
      setDraftAssignments(savedAssignments);
      setSent(Boolean(saved?.sent));
      setSampleType(saved?.sampleType || "BLOOD");
    } catch {
      setAssignments([]);
      setDraftAssignments([]);
      setSent(false);
    } finally {
      setStorageReady(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageReady || !storageKey || typeof window === "undefined") return;

    if (assignments.length) {
      window.localStorage.setItem(storageKey, JSON.stringify({ assignments, sent, sampleType }));
    } else {
      window.localStorage.removeItem(storageKey);
    }
  }, [assignments, sampleType, sent, storageKey, storageReady]);

  useEffect(() => {
    if (!resetKey) return;

    setAssignments([]);
    setDraftAssignments([]);
    setSent(false);
    setSampleType("BLOOD");
    setTestInput("");
    setOpen(false);
    if (storageKey && typeof window !== "undefined") window.localStorage.removeItem(storageKey);
  }, [resetKey, storageKey]);

  useEffect(() => {
    if (!open || labs.length) return;

    const loadConnectedLabs = async () => {
      try {
        setLoadingLabs(true);
        const response = await api.get("/api/labs/doctor/connections");
        const approvedLabs = getRows(response)
          .filter((connection) => String(connection.status || connection.connection_status || "").toUpperCase() === "APPROVED")
          .map(normalizeLab)
          .filter((lab) => lab.id);
        setLabs(approvedLabs);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoadingLabs(false);
      }
    };

    loadConnectedLabs();
  }, [open, labs.length]);

  const addTests = () => {
    const newTests = testInput
      .split(",")
      .map((test) => test.trim())
      .filter(Boolean)
      .filter((test) => !draftAssignments.some((item) => item.test === test));

    if (newTests.length) {
      setSent(false);
      setDraftAssignments((current) => [
        ...current,
        ...newTests.map((test) => ({ test, labId: "" })),
      ]);
    }
    setTestInput("");
  };

  const handleTestKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTests();
    }
  };

  const handleDone = () => {
    const pendingTests = testInput
      .split(",")
      .map((test) => test.trim())
      .filter(Boolean)
      .filter((test) => !draftAssignments.some((item) => item.test === test));
    const finalAssignments = [
      ...draftAssignments,
      ...pendingTests.map((test) => ({ test, labId: "" })),
    ];

    if (pendingTests.length) {
      setDraftAssignments(finalAssignments);
    }
    setTestInput("");
    if (!finalAssignments.length) {
      setError("Please add at least one lab test.");
      return;
    }
    if (finalAssignments.some((assignment) => !String(assignment.labId || "").trim())) {
      setError("Select a lab for every test before completing.");
      return;
    }
    setSent(false);
    setAssignments(finalAssignments);
    setOpen(false);
  };

  const handleSend = async () => {
    const pendingTests = testInput
        .split(",")
        .map((test) => test.trim())
        .filter(Boolean)
        .filter((test) => !assignments.some((item) => item.test === test));
    const finalAssignments = [
      ...assignments,
      ...pendingTests.map((test) => ({ test, labId: "" })),
    ];

    if (!patientId || Number.isNaN(Number(patientId))) {
      setError("Patient details are not available for this appointment.");
      return;
    }
    if (!finalAssignments.length || finalAssignments.some((item) => !String(item.labId || "").trim())) {
      setError("Select a lab for every test before sending.");
      return;
    }

    try {
      setSending(true);
      const outcomes = await Promise.allSettled(
        finalAssignments.map(async (assignment) => {
          try {
            await api.post("/api/lab-requests/create", {
              labId: Number(assignment.labId),
              patientId: Number(patientId),
              appointment_id: appointmentId ? Number(appointmentId) : undefined,
              tests: [assignment.test],
              doctorNote: "Lab test requested from prescription pad.",
              priority,
              sampleType,
            });
            return { test: assignment.test, created: true };
          } catch (requestError) {
            if (requestError?.response?.status === 409) {
              return { test: assignment.test, created: false, skipped: true };
            }
            throw requestError;
          }
        })
      );

      const created = outcomes.filter((item) => item.status === "fulfilled" && item.value.created).length;
      const skipped = outcomes.filter((item) => item.status === "fulfilled" && item.value.skipped).length;

      if (created > 0) {
        setNotice(
          skipped > 0
            ? `New requests sent. ${skipped} already existed and were skipped.`
            : "Lab test request sent successfully."
        );
      } else if (skipped > 0) {
        setNotice(`${skipped} test request(s) already existed and were skipped.`);
      }

      setSent(true);
      setTestInput("");
      setOpen(false);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    onSummaryChange?.({
      labName: [...new Set(assignments.map((assignment) => labs.find((lab) => String(lab.id) === String(assignment.labId))?.name).filter(Boolean))].join(", "),
      tests: assignments.map((assignment) => assignment.test),
    });
  }, [assignments, labs, onSummaryChange]);

  const canSendToLab =
    Boolean(patientId) &&
    !Number.isNaN(Number(patientId)) &&
    assignments.length > 0 &&
    assignments.every((assignment) => String(assignment.labId || "").trim()) &&
    !open &&
    !sent;

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Button
          variant="outlined"
          startIcon={<ScienceOutlined />}
          onClick={() => {
            setSent(false);
            setDraftAssignments(assignments);
            setOpen(true);
          }}
          sx={{ textTransform: "none", borderRadius: 1.5, minHeight: 32, px: 1.25, fontSize: "12px" }}
        >
          Lab Test
        </Button>
        {canSendToLab ? (
          <Button size="small" variant="contained" onClick={handleSend} disabled={sending} sx={{ textTransform: "none", minHeight: 32, px: 1.25, fontSize: "12px" }}>
            {sending ? "Sending..." : "Send to Lab"}
          </Button>
        ) : null}
      </Stack>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="lab-test-dialog-title"
      >
        <DialogTitle id="lab-test-dialog-title" sx={{ py: 1.5, fontSize: "17px" }}>Prepare lab test request</DialogTitle>
        <DialogContent dividers sx={{ py: 1.5 }}>
          {loadingLabs ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Stack spacing={1.25}>
              {!labs.length && !loadingLabs ? <Typography variant="body2" color="text.secondary">No approved lab connection found.</Typography> : null}
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.75, width: "100%" }}>
                <TextField
                  size="small"
                  label="Lab test name"
                  placeholder="CBC, Blood Sugar"
                  value={testInput}
                  onChange={(event) => setTestInput(event.target.value)}
                  onKeyDown={handleTestKeyDown}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    "& .MuiInputBase-input": { fontSize: "12px", py: 1 },
                    "& .MuiInputLabel-root": { fontSize: "12px" },
                  }}
                />
                <IconButton
                  size="small"
                  color="primary"
                  aria-label="Add test"
                  onClick={addTests}
                  disabled={!testInput.trim()}
                  sx={{ mt: 0.5 }}
                >
                  <AddCircleOutline sx={{ fontSize: 19 }} />
                </IconButton>
                <FormControl size="small" sx={{ width: { xs: 100, sm: 120 }, flexShrink: 0 }}>
                  <InputLabel sx={{ fontSize: "12px" }}>Priority</InputLabel>
                  <Select
                    value={priority}
                    label="Priority"
                    onChange={(event) => setPriority(event.target.value)}
                    sx={{ fontSize: "12px", minHeight: 38 }}
                  >
                    <MenuItem value="NORMAL" sx={{ fontSize: "12px" }}>Normal</MenuItem>
                    <MenuItem value="URGENT" sx={{ fontSize: "12px" }}>Urgent</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ width: { xs: 110, sm: 130 }, flexShrink: 0 }}>
                  <InputLabel sx={{ fontSize: "12px" }}>Sample</InputLabel>
                  <Select
                    value={sampleType}
                    label="Sample"
                    onChange={(event) => setSampleType(event.target.value)}
                    sx={{ fontSize: "12px", minHeight: 38 }}
                  >
                    {SAMPLE_TYPES.map((type) => (
                      <MenuItem key={type} value={type} sx={{ fontSize: "12px" }}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Stack spacing={0.75}>
                {assignments.length > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    Select a lab for each test:
                  </Typography>
                )}
                {draftAssignments.map((assignment) => (
                  <Box key={assignment.test} sx={{ display: "grid", gap: 1.25 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={assignment.test}
                        onDelete={sent ? undefined : () => setDraftAssignments((current) => current.filter((item) => item.test !== assignment.test))}
                        sx={{ flexShrink: 0 }}
                      />
                      <FormControl size="small" fullWidth>
                        <InputLabel>{`Lab for ${assignment.test}`}</InputLabel>
                        <Select
                          value={assignment.labId}
                          label={`Lab for ${assignment.test}`}
                          disabled={sent}
                          onChange={(event) => {
                            setDraftAssignments((current) => current.map((item) => (
                              item.test === assignment.test ? { ...item, labId: event.target.value } : item
                            )));
                          }}
                        >
                          {labs.map((lab) => <MenuItem key={lab.id} value={String(lab.id)}>{lab.name}{lab.code ? ` (${lab.code})` : ""}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDraftAssignments(assignments); setTestInput(""); setOpen(false); }} sx={{ textTransform: "none", minHeight: 32, px: 1.25, fontSize: "12px" }}>Cancel</Button>
          <Button variant="contained" onClick={handleDone} disabled={loadingLabs} sx={{ textTransform: "none", minHeight: 32, px: 1.25, fontSize: "12px" }}>Done</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(error)} autoHideDuration={5000} onClose={() => setError("")}>
        <Alert severity="error" onClose={() => setError("")}>{error}</Alert>
      </Snackbar>
      <Snackbar open={Boolean(notice)} autoHideDuration={3500} onClose={() => setNotice("")}>
        <Alert severity="success" onClose={() => setNotice("")}>{notice}</Alert>
      </Snackbar>
    </>
  );
}
