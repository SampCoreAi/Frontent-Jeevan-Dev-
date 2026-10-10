"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AddOutlined,
  DeleteOutline,
  PersonOutline,
  ReceiptLongOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";

const createEmptyItem = () => ({
  medicine_name: "",
  quantity: 1,
  unit_price: 0,
  gst_rate: 5,
  batch_number: "",
  expiry_date: "",
});

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function MedicalWalkInBilling({ onSaveInvoice }) {
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [source, setSource] = useState("Walk-in");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [items, setItems] = useState([createEmptyItem()]);
  const [notice, setNotice] = useState("");

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const quantity = Number(item.quantity || 0);
      const unitPrice = Number(item.unit_price || 0);
      const gstRate = Number(item.gst_rate || 0);
      const amount = quantity * unitPrice;
      return sum + amount + (amount * gstRate) / 100;
    }, 0);

    const itemCount = items.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );

    return { subtotal, itemCount };
  }, [items]);

  const addLineItem = () => setItems((current) => [...current, createEmptyItem()]);

  const removeLineItem = (index) => {
    setItems((current) => {
      if (current.length === 1) {
        return [createEmptyItem()];
      }

      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const updateLineItem = (index, field, value) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const resetForm = () => {
    setPatientName("");
    setPatientPhone("");
    setDoctorName("");
    setSource("Walk-in");
    setPaymentMode("Cash");
    setItems([createEmptyItem()]);
    setNotice("");
  };

  const handleSave = () => {
    const validItems = items.filter(
      (item) =>
        String(item.medicine_name || "").trim() &&
        Number(item.quantity || 0) > 0
    );

    if (!String(patientName || "").trim()) {
      setNotice("Patient name is required.");
      return;
    }

    if (!validItems.length) {
      setNotice("Add at least one medicine item before saving the invoice.");
      return;
    }

    const invoiceEntry = {
      id: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      created_at: new Date().toISOString(),
      patient_name: patientName.trim(),
      patient_phone: patientPhone.trim(),
      doctor_name: doctorName.trim() || "Manual entry",
      source: source || "Walk-in",
      total_amount: totals.subtotal,
      payment_mode: paymentMode,
      notes: `Manual ${source.toLowerCase()} invoice generated from billing desk`,
      items: validItems.map((item) => ({
        medicine_name: item.medicine_name.trim(),
        quantity: Number(item.quantity || 0),
        unit_price: Number(item.unit_price || 0),
        gst_rate: Number(item.gst_rate || 0),
        batch_number: item.batch_number || "",
        expiry_date: item.expiry_date || "",
      })),
    };

    if (typeof onSaveInvoice === "function") {
      onSaveInvoice(invoiceEntry);
    }

    setNotice("Walk-in invoice saved to history.");
    resetForm();
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid #E2E8F0",
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
        mb: 2.5,
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, md: 2.25 } }}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2} sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                bgcolor: "#EAF1FF",
                color: "#005F5B",
              }}
            >
              <ReceiptLongOutlined sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: "#0B1C30" }}>
                Walk-in Billing
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: "#64748B" }}>
                Create a new invoice for direct counter sales and same-day pharmacy billing.
              </Typography>
            </Box>
          </Stack>

          <Chip
            label="Invoice + History"
            sx={{
              bgcolor: "#E6F7F0",
              color: "#0E7051",
              fontWeight: 700,
              borderRadius: "999px",
            }}
          />
        </Stack>

        {notice ? (
          <Alert severity={notice.includes("required") || notice.includes("Add") ? "warning" : "success"} sx={{ mb: 2 }}>
            {notice}
          </Alert>
        ) : null}

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Patient Name"
            value={patientName}
            onChange={(event) => setPatientName(event.target.value)}
            size="small"
            fullWidth
            InputProps={{ startAdornment: <PersonOutline sx={{ mr: 1, color: "#64748B", fontSize: 18 }} /> }}
          />
          <TextField
            label="Phone"
            value={patientPhone}
            onChange={(event) => setPatientPhone(event.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Doctor / Reference"
            value={doctorName}
            onChange={(event) => setDoctorName(event.target.value)}
            size="small"
            fullWidth
          />
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Order Source"
            value={source}
            size="small"
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#F8FAFC",
              },
            }}
          />

          <TextField
            label="Payment Mode"
            value={paymentMode}
            onChange={(event) => setPaymentMode(event.target.value)}
            size="small"
            select
            fullWidth
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="Insurance">Insurance</MenuItem>
          </TextField>
        </Stack>

        <Box sx={{ mb: 1.5 }}>
          <Typography sx={{ fontSize: "0.78rem", fontWeight: 800, color: "#0B1C30", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Medicine &amp; Billing Details
          </Typography>
        </Box>

        <Stack spacing={1.25} sx={{ mb: 1.5 }}>
          {items.map((item, index) => (
            <Box
              key={`walk-in-item-${index}`}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "2.1fr 1fr 1.1fr 1.1fr 1fr 0.8fr",
                },
                gap: 1,
                alignItems: "center",
                p: 0,
                borderBottom: "1px solid #E2E8F0",
                pb: 1,
              }}
            >
              <TextField
                label="Medicine Name"
                value={item.medicine_name}
                onChange={(event) => updateLineItem(index, "medicine_name", event.target.value)}
                size="small"
              />

              <TextField
                label="Batch"
                value={item.batch_number}
                onChange={(event) => updateLineItem(index, "batch_number", event.target.value)}
                size="small"
              />

              <TextField
                label="Expiry"
                type="date"
                value={item.expiry_date}
                onChange={(event) => updateLineItem(index, "expiry_date", event.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Qty"
                type="number"
                value={item.quantity}
                onChange={(event) => updateLineItem(index, "quantity", Number(event.target.value || 0))}
                size="small"
              />

              <TextField
                label="Price"
                type="number"
                value={item.unit_price}
                onChange={(event) => updateLineItem(index, "unit_price", Number(event.target.value || 0))}
                size="small"
              />

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1 }}>
                <TextField
                  label="GST %"
                  type="number"
                  value={item.gst_rate}
                  onChange={(event) => updateLineItem(index, "gst_rate", Number(event.target.value || 0))}
                  size="small"
                  sx={{ width: 88 }}
                />

                <IconButton
                  color="error"
                  onClick={() => removeLineItem(index)}
                  aria-label="remove item"
                >
                  <DeleteOutline />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Stack>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1.5 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AddOutlined />}
            onClick={addLineItem}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
          >
            Add Item
          </Button>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2}>
          <Box>
            <Typography sx={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
              Billing Summary
            </Typography>
            <Typography sx={{ mt: 0.5, color: "#0B1C30", fontWeight: 700 }}>
              {totals.itemCount} units selected
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            <Typography sx={{ fontSize: "0.78rem", color: "#4D5F7B", fontWeight: 700 }}>
              Total Amount
            </Typography>
            <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: "#0B1C30" }}>
              {formatCurrency(totals.subtotal)}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            size="medium"
            onClick={resetForm}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            size="medium"
            startIcon={<ShoppingCartOutlined />}
            onClick={handleSave}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
          >
            Save Invoice
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
