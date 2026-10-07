"use client";

import { Box, Chip, Dialog, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const formatCurrency = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
}).format(Number(value || 0));

const statusColor = (status) => {
  if (["COMPLETED", "APPROVED"].includes(status)) return "success";
  if (["PROCESSING", "READY_FOR_PICKUP"].includes(status)) return "info";
  if (["REJECTED", "CANCELLED"].includes(status)) return "error";
  return "warning";
};

export default function MedicalRequestInvoiceDialog({ open, onClose, invoice }) {
  if (!invoice) return null;

  const amount = Number(invoice.amount || 0);
  const discount = amount * 0.09;
  const tax = amount * 0.18;
  const total = amount - discount + tax;
  const date = invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString("en-GB") : "-";
  const medicineItems = invoice.medicineItems?.length ? invoice.medicineItems : [{ medicine_name: invoice.medicineName, quantity: invoice.quantity, dose: invoice.note, batch_number: invoice.batchNumber, expiry_date: invoice.expiryDate, unit_price: invoice.unitPrice, gst_rate: invoice.gstRate, amount }];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2, overflow: "hidden", maxHeight: "82vh", margin: 1 } }}>
      <Box sx={{ p: 1.75, background: "#f8fafc", maxHeight: "82vh", overflowY: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
          <Box>
            <Typography sx={{ color: "#123f66", fontWeight: 800, fontSize: "1.1rem", lineHeight: 1.2 }}>Medical Invoice</Typography>
            <Typography sx={{ color: "#64748b", fontSize: "0.78rem", mt: 0.5 }}>Created: {date}</Typography>
          </Box>
          <IconButton size="small" onClick={onClose} aria-label="Close medical invoice"><CloseIcon fontSize="small" /></IconButton>
        </Box>

        <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2, background: "#fff", p: 1.5, mb: 1.5 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
            <Box>
              <Typography sx={{ color: "#123f66", fontWeight: 800, fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Patient</Typography>
              <Typography sx={{ fontWeight: 700, color: "#0f172a", mt: 0.35 }}>{invoice.patientName}</Typography>
              <Typography sx={{ color: "#475569", fontSize: "0.78rem", mt: 0.15 }}>{invoice.age} yrs • {invoice.gender}</Typography>
              <Typography sx={{ color: "#475569", fontSize: "0.78rem", mt: 0.15 }}>{invoice.medicalStore}</Typography>
            </Box>
            <Box>
              <Typography sx={{ color: "#123f66", fontWeight: 800, fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Physician</Typography>
              <Typography sx={{ fontWeight: 700, color: "#0f172a", mt: 0.35 }}>{invoice.doctorName}</Typography>
              <Typography sx={{ color: "#475569", fontSize: "0.78rem", mt: 0.15 }}>Invoice no: {invoice.invoiceNumber}</Typography>
              <Box sx={{ mt: 0.5 }}><Chip size="small" label={String(invoice.status || "PENDING").replaceAll("_", " ")} color={statusColor(invoice.status)} /></Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2, background: "#fff", overflow: "hidden" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1.4fr 0.9fr 0.9fr 0.55fr 0.9fr 0.6fr 0.9fr", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
            {['Medicine', 'Batch', 'Expiry', 'Qty', 'Unit Price', 'GST %', 'Amount'].map((label) => <Typography key={label} sx={{ p: 0.85, color: "#123f66", fontWeight: 800, fontSize: "0.68rem", textTransform: "uppercase", borderRight: label !== "Amount" ? "1px solid #e2e8f0" : "none" }}>{label}</Typography>)}
          </Box>
          {medicineItems.map((medicine, index) => <Box key={`${medicine.medicine_name || invoice.medicineName}-${index}`} sx={{ display: "grid", gridTemplateColumns: "1.4fr 0.9fr 0.9fr 0.55fr 0.9fr 0.6fr 0.9fr", borderBottom: "1px solid #e2e8f0" }}>
            {[medicine.medicine_name || invoice.medicineName, medicine.batch_number || invoice.batchNumber || "-", medicine.expiry_date || invoice.expiryDate || "-", medicine.quantity || 1, formatCurrency(medicine.unit_price || invoice.unitPrice), `${medicine.gst_rate ?? invoice.gstRate ?? 0}%`, formatCurrency(medicine.amount || (index === 0 ? amount : 0))].map((value, valueIndex) => <Typography key={`${value}-${valueIndex}`} sx={{ p: 0.85, color: "#0f172a", fontSize: "0.76rem", fontWeight: valueIndex === 6 ? 700 : 400, borderRight: valueIndex < 6 ? "1px solid #e2e8f0" : "none" }}>{value}</Typography>)}
          </Box>)}
        </Box>

        <Box sx={{ mt: 1.5, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 0.8fr" }, gap: 1.5 }}>
          <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2, background: "#fff", p: 1.25 }}>
            <Typography sx={{ color: "#123f66", fontWeight: 800, fontSize: "0.68rem", textTransform: "uppercase", mb: 0.65 }}>Notes</Typography>
            <Typography sx={{ color: "#475569", fontSize: "0.78rem" }}>{invoice.note || `Medical prescription delivered through ${invoice.medicalStore}.`}</Typography>
          </Box>
          <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2, background: "#fff", p: 1.25 }}>
            {[['Subtotal', amount], ['Discount', discount], ['Tax', tax]].map(([label, value]) => <Box key={label} sx={{ display: "flex", justifyContent: "space-between", mb: 0.6 }}><Typography sx={{ color: "#475569", fontWeight: 700, fontSize: "0.75rem" }}>{label}</Typography><Typography sx={{ color: "#0f172a", fontWeight: 700, fontSize: "0.75rem" }}>{formatCurrency(value)}</Typography></Box>)}
            <Box sx={{ borderTop: "1px solid #e2e8f0", pt: 0.75, mt: 0.75, display: "flex", justifyContent: "space-between" }}><Typography sx={{ color: "#ef4444", fontWeight: 900 }}>Total</Typography><Typography sx={{ color: "#ef4444", fontWeight: 900 }}>{formatCurrency(total)}</Typography></Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
