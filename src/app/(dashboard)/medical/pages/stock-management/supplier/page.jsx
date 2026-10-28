"use client";

import { useEffect, useState } from "react";
import {
  AddOutlined,
  CloseOutlined,
  LocalShippingOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

const green = "#07876A";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/pharmacy/suppliers`;

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  street: "",
  city: "",
  state: "",
  postalcode: "",
  country: "India",
};

export default function SupplierTab() {
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getToken = () =>
    localStorage.getItem("accessToken") || localStorage.getItem("token");

  const fetchSuppliers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Suppliers load nahi hue.");

      setSuppliers(
        (result.data || []).map((supplier) => ({
          ...supplier,
          name: supplier.supplier_name,
          email: supplier.gmail,
          addressText: [
            supplier.address?.street,
            supplier.address?.city,
            supplier.address?.state,
            supplier.address?.postalcode,
            supplier.address?.country,
          ]
            .filter(Boolean)
            .join(", "),
          status: supplier.status || "Active",
        }))
      );
    } catch (err) {
      setError(err.message || "Suppliers load karte waqt error aaya.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addSupplier = async () => {
    if (!form.name.trim() || !form.phone.trim()) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          supplier_name: form.name.trim(),
          gmail: form.email.trim(),
          phone: form.phone.trim(),
          address: {
            street: form.street.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            postalcode: form.postalcode.trim(),
            country: form.country.trim(),
          },
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Supplier save nahi hua.");

      setForm(emptyForm);
      setOpen(false);
      await fetchSuppliers();
    } catch (err) {
      setError(err.message || "Supplier save karte waqt error aaya.");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = (id) => {
    setSuppliers((prev) =>
      prev.map((supplier) =>
        supplier.id === id
          ? {
              ...supplier,
              status: supplier.status === "Active" ? "Inactive" : "Active",
            }
          : supplier
      )
    );
  };

  return (
    <Box sx={{ px: { xs: 2, md: 1.5 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#172B4D" }}>
            Suppliers
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13, color: "#667085" }}>
            Manage supplier contact details and status.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: green,
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            px: 2,
            "&:hover": { bgcolor: "#066D56" },
          }}
        >
          Add Supplier
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        variant="outlined"
        sx={{ borderColor: "#DDE9E5", borderRadius: 2.5, overflow: "hidden" }}
      >
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F7FBF9" }}>
                {["Supplier", "Phone", "Email", "Address", "Status"].map(
                  (label) => (
                    <TableCell
                      key={label}
                      sx={{ fontWeight: 700, color: "#475467", py: 1.5 }}
                    >
                      {label}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: 5, textAlign: "center" }}>
                    Loading suppliers...
                  </TableCell>
                </TableRow>
              ) : suppliers.length ? (
                suppliers.map((supplier) => (
                  <TableRow key={supplier.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.2}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            bgcolor: "#EAF7F2",
                            color: green,
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <LocalShippingOutlined sx={{ color: "black", fontSize: 15 }} />
                        </Box>
                        <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
                          {supplier.name}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email || "—"}</TableCell>
                    <TableCell>{supplier.addressText || "—"}</TableCell>

                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Chip
                          size="small"
                          label={supplier.status}
                          sx={{
                            bgcolor:
                              supplier.status === "Active" ? "#E8F6EF" : "#F2F4F7",
                            color:
                              supplier.status === "Active" ? "#16804A" : "#667085",
                            fontWeight: 600,
                          }}
                        />
                        <Switch
                          size="small"
                          checked={supplier.status === "Active"}
                          onChange={() => toggleStatus(supplier.id)}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: green,
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              bgcolor: green,
                            },
                          }}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: 7, textAlign: "center" }}>
                    <Typography sx={{ fontWeight: 700, color: "#344054" }}>
                      No suppliers added yet
                    </Typography>
                    <Typography sx={{ mt: 0.5, fontSize: 13, color: "#667085" }}>
                      Add a supplier to use them in purchase entries.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pr: 6, fontWeight: 700 }}>
          Add Supplier
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <CloseOutlined />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Supplier name"
              placeholder="e.g. Sharma Medical Distributors"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Phone number"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Email"
              placeholder="supplier@example.com"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              fullWidth
            />

            <TextField
              label="Street"
              placeholder="Shop number, street, area"
              value={form.street}
              onChange={(e) => updateField("street", e.target.value)}
              fullWidth
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="City"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                fullWidth
              />
              <TextField
                label="State"
                value={form.state}
                onChange={(e) => updateField("state", e.target.value)}
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Postal code"
                value={form.postalcode}
                onChange={(e) => updateField("postalcode", e.target.value)}
                fullWidth
              />
              <TextField
                label="Country"
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                fullWidth
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{ color: "#475467", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={addSupplier}
            disabled={!form.name.trim() || !form.phone.trim() || saving}
            sx={{
              bgcolor: green,
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { bgcolor: "#066D56" },
            }}
          >
            {saving ? "Saving..." : "Save Supplier"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}