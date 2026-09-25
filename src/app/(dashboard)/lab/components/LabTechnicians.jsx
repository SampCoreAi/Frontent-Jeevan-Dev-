"use client";

import { useState } from "react";
import { Alert, Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import { SectionTitle } from "./LabUi";

export default function LabTechnicians({ technicians = [], loading = false, onCreate }) {
  const [form, setForm] = useState({ fullName: "", email: "", phoneNumber: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      await onCreate(form);
      setForm({ fullName: "", email: "", phoneNumber: "" });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || "Unable to add technician.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ pt: 12, width: "100%" }}>
      <SectionTitle title="Assigned Lab Technicians" description="Add technicians who will receive assigned test work by email and manage it from their dashboard." />
      <Paper component="form" onSubmit={submit} elevation={0} sx={{ p: 2, mb: 2, border: "1px solid #E2E8F0", borderRadius: 2 }}>
        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
          <TextField size="small" label="Full name" value={form.fullName} required onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
          <TextField size="small" type="email" label="Email" value={form.email} required onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <TextField size="small" label="Mobile number" value={form.phoneNumber} required inputProps={{ maxLength: 10 }} onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })} />
          <Button type="submit" variant="contained" disabled={saving} sx={{ textTransform: "none" }}>{saving ? <CircularProgress size={18} color="inherit" /> : "Add technician"}</Button>
        </Stack>
      </Paper>
      <Stack spacing={1}>
        {loading ? <CircularProgress size={24} /> : technicians.map((technician) => (
          <Paper key={technician.email} elevation={0} sx={{ p: 1.5, border: "1px solid #E2E8F0", borderRadius: 2 }}>
            <Typography sx={{ fontWeight: 700 }}>{technician.full_name}</Typography>
            <Typography variant="body2" color="text.secondary">{technician.email} · {technician.phone_number}</Typography>
          </Paper>
        ))}
        {!loading && !technicians.length ? <Typography color="text.secondary">No technicians added yet.</Typography> : null}
      </Stack>
    </Box>
  );
}
