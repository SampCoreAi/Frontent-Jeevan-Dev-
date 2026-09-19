"use client";

import { useEffect, useMemo, useState } from "react";
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
  Grid,
  Paper,
  Pagination,
  Snackbar,
  Stack,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Refresh, ToggleOff, ToggleOn } from "@mui/icons-material";
import { API_BASE_URL } from "../../../../../config/api";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  phoneNumber: "",
  labName: "",
  labCode: "",
  registrationNumber: "",
  address: "",
};

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

export default function LabsPage() {
  const columns = ["LAB", "OWNER", "CONTACT", "STATUS", "DOCTORS", "REQUESTS", "ACTION"];
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusLabId, setStatusLabId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [tableSearch, setTableSearch] = useState("");
  const [tableStatus, setTableStatus] = useState("");
  const [tableDate, setTableDate] = useState("");
  const [tablePage, setTablePage] = useState(1);
  const pageSize = 10;

  const requestConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchLabs = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_BASE_URL}/admin/labs`, {
        ...requestConfig(),
        params: {
          search: tableSearch || undefined,
          status: tableStatus || undefined,
          date: tableDate || undefined,
        },
      });
      setLabs(response.data?.data || []);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to load labs."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, [tableDate, tableSearch, tableStatus]);

  const stats = useMemo(
    () => ({
      total: labs.length,
      active: labs.filter((lab) => lab.status === "ACTIVE").length,
      doctors: labs.reduce((sum, lab) => sum + Number(lab.doctor_count || 0), 0),
      requests: labs.reduce((sum, lab) => sum + Number(lab.request_count || 0), 0),
    }),
    [labs]
  );

  const filteredLabs = useMemo(() => {
    const query = tableSearch.trim().toLowerCase();
    return labs.filter((lab) => {
      const matchesSearch = !query || [
        lab.lab_name,
        lab.lab_code,
        lab.admin_name,
        lab.email,
        lab.phone_number,
      ].some((value) => String(value || "").toLowerCase().includes(query));
      const matchesStatus = !tableStatus || lab.status === tableStatus;
      const matchesDate = !tableDate || String(lab.created_at || "").startsWith(tableDate);
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [labs, tableDate, tableSearch, tableStatus]);

  const visibleLabs = filteredLabs.slice((tablePage - 1) * pageSize, tablePage * pageSize);

  useEffect(() => {
    setTablePage(1);
  }, [tableDate, tableSearch, tableStatus]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const payload = { ...form };
      if (!payload.labCode.trim()) delete payload.labCode;
      const response = await axios.post(`${API_BASE_URL}/admin/labs`, payload, requestConfig());
      if (response.data?.success === false) throw new Error(response.data.message);
      setDialogOpen(false);
      setForm(initialForm);
      setNotice("Lab created successfully.");
      await fetchLabs();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to create lab."));
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (lab) => {
    const nextStatus = lab.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      setStatusLabId(lab.id);
      setError("");
      await axios.patch(
        `${API_BASE_URL}/admin/labs/${lab.id}/status`,
        { status: nextStatus },
        requestConfig()
      );
      setLabs((currentLabs) =>
        currentLabs.map((item) =>
          item.id === lab.id ? { ...item, status: nextStatus } : item
        )
      );
      setNotice(`Lab ${nextStatus === "ACTIVE" ? "activated" : "deactivated"}.`);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to update lab status."));
    } finally {
      setStatusLabId(null);
    }
  };

  const updateField = (event) => {
    setForm((currentForm) => ({ ...currentForm, [event.target.name]: event.target.value }));
  };

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 4 }, mt: { xs: 7, md: 8 }, bgcolor: "#f8fafc", minHeight: "100vh", overflowX: "hidden" }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} gap={2} mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ color: "#123d36", fontSize: { xs: "1.75rem", sm: "2.125rem" } }}>Labs</Typography>
          <Typography sx={{ color: "#64748b" }}>Manage diagnostic labs and their access.</Typography>
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} gap={1} sx={{ width: { xs: "100%", sm: "auto" } }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={fetchLabs} disabled={loading}>Refresh</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>Add Lab</Button>
        </Stack>
      </Stack>

      <Grid container spacing={2} mb={3}>
        {[
          ["Total Labs", stats.total, "#1e6658"],
          ["Active Labs", stats.active, "#15803d"],
          ["Connected Doctors", stats.doctors, "#2563eb"],
          ["Test Requests", stats.requests, "#b45309"],
        ].map(([label, value, color]) => (
          <Grid item xs={12} sm={6} md={3} key={label}>
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, border: "1px solid #e2e8f0", borderRadius: 2, minHeight: 112 }}>
              <Typography variant="body2" sx={{ color: "#64748b" }}>{label}</Typography>
              <Typography variant="h4" fontWeight={700} sx={{ color, mt: 0.5 }}>{value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          sx={{ p: 2, borderBottom: "1px solid #e2e8f0", bgcolor: "#fff" }}
        >
          <TextField
            size="small"
            label="Search labs"
            value={tableSearch}
            onChange={(event) => setTableSearch(event.target.value)}
            sx={{ minWidth: { md: 260 } }}
          />
          <TextField
            select
            size="small"
            label="Status"
            value={tableStatus}
            onChange={(event) => setTableStatus(event.target.value)}
            sx={{ minWidth: { md: 160 } }}
          >
            <MenuItem value="">All statuses</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="INACTIVE">Inactive</MenuItem>
          </TextField>
          <TextField
            size="small"
            type="date"
            label="Created date"
            value={tableDate}
            onChange={(event) => setTableDate(event.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: { md: 170 } }}
          />
          <Button
            variant="text"
            onClick={() => {
              setTableSearch("");
              setTableStatus("");
              setTableDate("");
            }}
          >
            Clear filters
          </Button>
        </Stack>
        <TableContainer sx={{ maxHeight: "calc(100vh - 430px)", overflowX: "auto" }}>
          <Table
            stickyHeader
            sx={{
              minWidth: 900,
              "& .MuiTableCell-root": {
                color: "#1f2937",
              },
              "& .MuiTypography-root": {
                color: "#1f2937",
              },
              "& .MuiTypography-colorTextSecondary": {
                color: "#64748b",
              },
            }}
          >
          <TableHead><TableRow>
            {columns.map((heading) => <TableCell key={heading} sx={{ fontWeight: 700, color: "#334155", backgroundColor: "#f1f5f9", whiteSpace: "nowrap" }}>{heading}</TableCell>)}
          </TableRow></TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                <CircularProgress size={35} sx={{ color: "#1e6658" }} />
                <Typography sx={{ mt: 1.5, color: "#64748b" }}>Loading labs...</Typography>
              </TableCell></TableRow>
            ) : null}
            {!loading && !filteredLabs.length ? (
              <TableRow><TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                <Typography sx={{ color: "#64748b" }}>{labs.length ? "No labs match the selected filters." : "No labs found."}</Typography>
              </TableCell></TableRow>
            ) : null}
            {!loading && visibleLabs.map((lab) => (
              <TableRow key={lab.id} hover sx={{ "&:hover": { backgroundColor: "#f8fafc" } }}>
                <TableCell><Typography fontWeight={600} sx={{ color: "#1f2937" }}>{lab.lab_name || "-"}</Typography><Typography variant="caption" display="block" sx={{ color: "#64748b" }}>{lab.lab_code || "-"}</Typography></TableCell>
                <TableCell>{lab.admin_name || "-"}<Typography variant="caption" display="block" sx={{ color: "#64748b" }}>{lab.email || "-"}</Typography></TableCell>
                <TableCell>{lab.phone_number || "-"}<Typography variant="caption" display="block" sx={{ color: "#64748b" }}>{lab.address || ""}</Typography></TableCell>
                <TableCell><Chip size="small" label={lab.status || "UNKNOWN"} color={lab.status === "ACTIVE" ? "success" : "default"} /></TableCell>
                <TableCell>{lab.doctor_count || 0}</TableCell>
                <TableCell>{lab.request_count || 0}</TableCell>
                <TableCell><Button size="small" color={lab.status === "ACTIVE" ? "warning" : "success"} startIcon={statusLabId === lab.id ? <CircularProgress size={16} /> : lab.status === "ACTIVE" ? <ToggleOff /> : <ToggleOn />} onClick={() => handleStatusChange(lab)} disabled={statusLabId === lab.id}>{lab.status === "ACTIVE" ? "Deactivate" : "Activate"}</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
        <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} justifyContent="space-between" gap={1}>
            <Typography sx={{ color: "#64748b" }} fontSize={14}>Showing {visibleLabs.length} of {filteredLabs.length} filtered results ({labs.length} total)</Typography>
            <Pagination count={Math.max(1, Math.ceil(filteredLabs.length / pageSize))} page={tablePage} onChange={(_, value) => setTablePage(value)} size="small" color="primary" />
          </Stack>
        </Box>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => !saving && setDialogOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>Create Lab</DialogTitle>
          <DialogContent sx={{ display: "grid", gap: 2, pt: "8px !important" }}>
            {[
              ["fullName", "Lab owner name", true], ["email", "Owner email", true], ["password", "Login password", true],
              ["phoneNumber", "Phone number", false], ["labName", "Lab name", true], ["labCode", "Lab code (optional)", false],
              ["registrationNumber", "Registration number", false], ["address", "Address", false],
            ].map(([name, label, required]) => <TextField key={name} name={name} label={label} value={form[name]} onChange={updateField} required={required} type={name === "password" ? "password" : "text"} fullWidth />)}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}><Button onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button><Button type="submit" variant="contained" disabled={saving}>{saving ? "Creating..." : "Create Lab"}</Button></DialogActions>
        </Box>
      </Dialog>

      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError("")}><Alert severity="error" onClose={() => setError("")}>{error}</Alert></Snackbar>
      <Snackbar open={Boolean(notice)} autoHideDuration={3000} onClose={() => setNotice("")}><Alert severity="success" onClose={() => setNotice("")}>{notice}</Alert></Snackbar>
    </Box>
  );
}