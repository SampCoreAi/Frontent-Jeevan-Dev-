"use client";

import { useState } from "react";
import {
  AddOutlined,
  CloseOutlined,
  LocalShippingOutlined,
} from "@mui/icons-material";
import {
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

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
};

export default function SupplierTab() {
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addSupplier = () => {
    if (!form.name.trim() || !form.phone.trim()) return;

    setSuppliers((prev) => [
      ...prev,
      {
        ...form,
        id: Date.now(),
        status: "Active",
      },
    ]);

    setForm(emptyForm);
    setOpen(false);
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
              {suppliers.length ? (
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
                          <LocalShippingOutlined sx={{color:"black" , fontSize: 15}}/>
                        </Box>
                        <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
                          {supplier.name}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email || "—"}</TableCell>
                    <TableCell>{supplier.address || "—"}</TableCell>

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
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              { bgcolor: green },
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

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
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
              label="Address"
              placeholder="Shop number, street, area, city"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              multiline
              minRows={2}
              fullWidth
            />
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
            disabled={!form.name.trim() || !form.phone.trim()}
            sx={{
              bgcolor: green,
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { bgcolor: "#066D56" },
            }}
          >
            Save Supplier
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}