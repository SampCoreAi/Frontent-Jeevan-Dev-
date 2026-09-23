"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, TextField, Typography } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

export default function MedicalRequestDetailsDialog({ open, request, loading = false, onClose, onComplete }) {
  const [invoiceLines, setInvoiceLines] = useState([]);
  const [note, setNote] = useState("");
  const [validation, setValidation] = useState("");

  useEffect(() => {
    if (!request) return;
    const items = (() => {
      if (Array.isArray(request.medicine_items)) return request.medicine_items;
      try {
        const parsed = JSON.parse(request.medicine_items || "[]");
        if (Array.isArray(parsed) && parsed.length) return parsed;
      } catch { }
      return [{ medicine_name: request.medicine_name, quantity: request.quantity || 1, dose: request.dose || request.note || "" }];
    })();
    setInvoiceLines(items.map((item) => ({
      ...item,
      batch_number: item.batch_number || request.batch_number || "",
      expiry_date: item.expiry_date || request.expiry_date || "",
      quantity: item.quantity || 1,
      unit_price: item.unit_price ?? request.unit_price ?? "",
      gst_rate: item.gst_rate ?? request.gst_rate ?? "",
    })));
    setNote(request.note || "");
    setValidation("");
  }, [request]);

  if (!request) return null;

  const status = String(request.status || "PENDING").toUpperCase();
  const isCompleted = status === "COMPLETED";
  const invoiceNumber = request.invoice_number || `INV-${new Date(request.created_at || Date.now()).getFullYear()}-${String(request.id).padStart(6, "0")}`;
  const invoiceDate = new Date(request.created_at || Date.now()).toLocaleDateString("en-IN");
  const calculatedAmount = invoiceLines.reduce((total, line) => {
    const lineTotal = Number(line.quantity || 0) * Number(line.unit_price || 0);
    return total + lineTotal + (lineTotal * Number(line.gst_rate || 0) / 100);
  }, 0);

  const updateLine = (index, field, value) => {
    setInvoiceLines((lines) => lines.map((line, lineIndex) => lineIndex === index ? { ...line, [field]: value } : line));
  };

  const handleComplete = () => {
    if (invoiceLines.some((line) => !String(line.batch_number).trim() || !line.expiry_date || !String(line.unit_price).trim() || !String(line.gst_rate).trim())) {
      setValidation("Har medicine ke batch, expiry, unit price aur GST details fill karein.");
      return;
    }
    if (invoiceLines.some((line) => Number(line.quantity) <= 0 || Number(line.unit_price) < 0 || Number(line.gst_rate) < 0)) {
      setValidation("Quantity, unit price aur GST valid value honi chahiye.");
      return;
    }
    onComplete(request.id, "COMPLETED", note.trim() || null, {
      totalAmount: calculatedAmount,
      invoiceItems: invoiceLines,
      batchNumber: invoiceLines[0].batch_number,
      expiryDate: invoiceLines[0].expiry_date,
      unitPrice: Number(invoiceLines[0].unit_price),
      gstRate: Number(invoiceLines[0].gst_rate),
      amount: calculatedAmount,
    });
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #dbe4ef" }}>
          <Typography sx={{ color: "#173761", fontWeight: 800, fontSize: { xs: "1.35rem", sm: "1.8rem" } }}>Invoice {invoiceNumber}</Typography>
          <Chip size="small" label={status.replaceAll("_", " ")} color={isCompleted ? "success" : status === "REJECTED" ? "error" : "warning"} />
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: { xs: 1.5, sm: 2.5 } }}>
        <Stack spacing={1.5}>
          {validation ? <Alert severity="error" onClose={() => setValidation("")}>{validation}</Alert> : null}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, p: 2, background: "#f5f8fc", border: "1px solid #e0e8f2", borderRadius: 1 }}>
            <Box><Typography sx={{ color: "#173761", fontWeight: 800, mb: 0.6 }}>Medical Store</Typography><Typography fontWeight={700}>{request.store_name || "Medical Store"}</Typography><Typography variant="body2" color="text.secondary">{request.store_address || request.address || "Registered store"}</Typography></Box>
            <Box><Typography sx={{ color: "#173761", fontWeight: 800, mb: 0.6 }}>Invoice Details</Typography><Typography variant="body2">Invoice No: <b>{invoiceNumber}</b></Typography><Typography variant="body2">Invoice Date: <b>{invoiceDate}</b></Typography></Box>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
            <Box><Typography variant="caption" color="text.secondary">Patient</Typography><Typography fontWeight={700}>{request.patient_name || "-"}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary">Doctor</Typography><Typography fontWeight={700}>{request.doctor_name || "-"}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary">Invoice number</Typography><Typography fontWeight={700}>{request.invoice_number || "Auto-generated on completion"}</Typography></Box>
          </Box>
          <Chip size="small" label={status.replaceAll("_", " ")} color={isCompleted ? "success" : status === "REJECTED" ? "error" : "warning"} sx={{ alignSelf: "flex-start" }} />
          <Box sx={{ border: "1px solid #cbd8e7", borderRadius: 1, overflow: "hidden" }}>
            <Box sx={{ px: 2, py: 1.1, background: "#f1f5fa" }}>
              <Typography sx={{ color: "#173761", fontWeight: 800 }}>Doctor Prescription</Typography>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "0.35fr 2fr 1fr", px: 1.5, py: 1, background: "#173761", color: "#fff", fontSize: "0.72rem", fontWeight: 800 }}>
              <span>#</span><span>Medicine</span><span>Requested Qty</span>
            </Box>
            {invoiceLines.map((medicine, index) => (
              <Box key={`prescription-${medicine.medicine_name}-${index}`} sx={{ display: "grid", gridTemplateColumns: "0.35fr 2fr 1fr", px: 1.5, py: 1, fontSize: "0.82rem", borderTop: "1px solid #e0e8f2" }}>
                <span>{index + 1}</span><Typography sx={{ fontSize: "0.82rem", fontWeight: 650 }}>{medicine.medicine_name || "-"}</Typography><Typography sx={{ fontSize: "0.82rem", fontWeight: 700 }}>{medicine.quantity || 1}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ border: "1px solid #cbd8e7", borderRadius: 1, overflow: "hidden" }}>
            <Box sx={{ px: 2, py: 1.25, background: "#f1f5fa" }}><Typography sx={{ color: "#173761", fontWeight: 800 }}>Medicine Details</Typography></Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "0.3fr 1.5fr 1fr 1fr 0.55fr 0.9fr 0.6fr 1fr", px: 1.5, py: 1, background: "#173761", color: "#fff", fontSize: "0.68rem", fontWeight: 800 }}><span>#</span><span>Medicine</span><span>Batch No</span><span>Expiry</span><span>Qty</span><span>Unit Price</span><span>GST %</span><span>Amount</span></Box>
            {invoiceLines.map((medicine, index) => {
              const lineTotal = Number(medicine.quantity || 0) * Number(medicine.unit_price || 0) * (1 + Number(medicine.gst_rate || 0) / 100);
              return <Box key={`${medicine.medicine_name}-${index}`} sx={{ display: "grid", gridTemplateColumns: "0.3fr 1.5fr 1fr 1fr 0.55fr 0.9fr 0.6fr 1fr", px: 1.5, py: 1.25, gap: 0.5, fontSize: "0.8rem", alignItems: "center", borderTop: index ? "1px solid #e0e8f2" : "none" }}>
                <span>{index + 1}</span><span>{medicine.medicine_name || "-"}</span>
                <TextField size="small" value={medicine.batch_number} onChange={(event) => updateLine(index, "batch_number", event.target.value)} disabled={isCompleted || loading} />
                <TextField size="small" type="date" value={medicine.expiry_date} onChange={(event) => updateLine(index, "expiry_date", event.target.value)} disabled={isCompleted || loading} InputLabelProps={{ shrink: true }} />
                <TextField size="small" type="number" value={medicine.quantity} onChange={(event) => updateLine(index, "quantity", event.target.value)} disabled={isCompleted || loading} inputProps={{ min: 1 }} />
                <TextField size="small" type="number" value={medicine.unit_price} onChange={(event) => updateLine(index, "unit_price", event.target.value)} disabled={isCompleted || loading} inputProps={{ min: 0 }} />
                <TextField size="small" type="number" value={medicine.gst_rate} onChange={(event) => updateLine(index, "gst_rate", event.target.value)} disabled={isCompleted || loading} inputProps={{ min: 0 }} />
                <Typography fontWeight={700}>₹{lineTotal.toFixed(2)}</Typography>
              </Box>
            })}
          </Box>
          <TextField label="Grand total (₹)" value={calculatedAmount.toFixed(2)} disabled fullWidth />
          <TextField label="Delivery note" value={note} onChange={(event) => setNote(event.target.value)} disabled={isCompleted || loading} multiline minRows={3} fullWidth />
          <Box sx={{ ml: "auto", width: { xs: "100%", sm: 280 }, p: 2, background: "#f5f8fc", border: "1px solid #dbe4ef", borderRadius: 1 }}><Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography fontWeight={700}>Grand Total</Typography><Typography fontWeight={800} color="#173761">₹{calculatedAmount.toFixed(2)}</Typography></Box></Box>
          <Divider />
          <Box sx={{ pt: 1, minHeight: 72, display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}><Box sx={{ width: 190, textAlign: "center" }}><Box sx={{ borderTop: "1px solid #334155", mb: 0.7 }} /><Typography variant="body2" fontWeight={700}>Authorized Signature</Typography></Box></Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading} startIcon={<ArrowBackOutlinedIcon />}>Back</Button>
        {!isCompleted ? <Button variant="contained" onClick={handleComplete} disabled={loading}>{loading ? "Completing..." : "Complete and deliver"}</Button> : null}
      </DialogActions>
    </Dialog>
  );
}
