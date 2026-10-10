"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  ReceiptLongOutlined,
  DownloadOutlined,
  PrintOutlined,
  ContactSupportOutlined,
  VerifiedOutlined,
  PersonOutline,
  CalendarMonthOutlined,
  LocalOfferOutlined,
  SecurityOutlined,
} from "@mui/icons-material";

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function MedicalInvoicePanel({ invoices = [] }) {
  const latestInvoice = Array.isArray(invoices) && invoices.length ? invoices[0] : null;
  const invoiceItems = Array.isArray(latestInvoice?.items) ? latestInvoice.items : [];
  const subtotal = invoiceItems.reduce((sum, item) => {
    const quantity = Number(item.quantity || 0);
    const unitPrice = Number(item.unit_price || 0);
    const gstRate = Number(item.gst_rate || 0);
    const lineTotal = quantity * unitPrice + (quantity * unitPrice * gstRate) / 100;
    return sum + lineTotal;
  }, 0);

  const patientName = latestInvoice?.patient_name || "Walk-in Patient";
  const doctorName = latestInvoice?.doctor_name || "Manual entry";
  const invoiceNumber = latestInvoice?.id || "INV-000000";
  const invoiceSource = latestInvoice?.source || "Walk-in / App / Doctor";
  const paymentMode = latestInvoice?.payment_mode || "Cash / UPI / Card";
  const invoiceDate = formatDateTime(latestInvoice?.created_at || new Date().toISOString());

  if (!latestInvoice) {
    return (
      <Box sx={{ width: "100%", display: "grid", placeItems: "center", minHeight: 260 }}>
        <Card sx={{ width: "100%", maxWidth: 620, borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)" }}>
          <CardContent sx={{ p: 3, textAlign: "center" }}>
            <ReceiptLongOutlined sx={{ fontSize: 42, color: "#005F5B", mb: 1 }} />
            <Typography sx={{ fontSize: "1.25rem", fontWeight: 800, color: "#0B1C30" }}>No invoice generated yet</Typography>
            <Typography sx={{ mt: 1, color: "#475569" }}>
              Complete a medicine request to generate an invoice here. Walk-in and app requests can also be captured and saved into the same invoice history.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", display: "grid", gap: 2.5 }}>
      <Card sx={{ borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)" }}>
        <CardContent sx={{ p: 2.25 }}>
          <Stack direction={{ xs: "column", xl: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "flex-start", xl: "center" }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ width: 40, height: 40, borderRadius: 2, display: "grid", placeItems: "center", bgcolor: "#EAF1FF", color: "#005F5B" }}>
                <ReceiptLongOutlined sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#0B1C30", lineHeight: 1.2 }}>
                    {invoiceNumber}
                  </Typography>
                  <Chip label="PAID" size="small" sx={{ bgcolor: "#E6F7F0", color: "#0E7051", fontWeight: 700, borderRadius: "999px", px: 0.75 }} />
                  <Chip label={paymentMode} size="small" sx={{ bgcolor: "#D7E8FF", color: "#4D5F7B", fontWeight: 700, borderRadius: "999px", px: 0.75 }} />
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 0.75, color: "#4D5F7B", fontSize: "0.72rem", flexWrap: "wrap" }}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <CalendarMonthOutlined sx={{ fontSize: 15 }} />
                    <Typography sx={{ fontSize: "0.72rem", color: "#4D5F7B" }}>Dispensed: {invoiceDate}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <VerifiedOutlined sx={{ fontSize: 15 }} />
                    <Typography sx={{ fontSize: "0.72rem", color: "#005F5B", fontWeight: 700 }}>GST Compliant Tax Invoice</Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button size="small" variant="outlined" startIcon={<PrintOutlined />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, minHeight: 36 }}>
                Print Manifest
              </Button>
              <Button size="small" variant="outlined" startIcon={<DownloadOutlined />} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, minHeight: 36 }}>
                Download PDF
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: 2 }}>
        <Card sx={{ borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)" }}>
          <CardContent sx={{ p: 2 }}>
            <Typography sx={{ fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "#4D5F7B" }}>
              Dispensing Entity
            </Typography>
            <Typography sx={{ mt: 1, fontWeight: 800, color: "#0B1C30" }}>MedCare Pharmacy &amp; Healthcare</Typography>
            <Typography sx={{ mt: 0.5, fontSize: "0.78rem", color: "#4D5F7B" }}>Central Medical Complex, Ring Road, Sector 4</Typography>
            <Typography sx={{ fontSize: "0.78rem", color: "#4D5F7B" }}>New Delhi, DL 110029 • Ph: +91 11 4099 2200</Typography>
            <Box sx={{ mt: 1.5, p: 1.25, borderRadius: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography sx={{ fontSize: "0.68rem", color: "#64748B", fontWeight: 700 }}>Source</Typography>
                <Typography sx={{ fontSize: "0.72rem", color: "#0B1C30", fontWeight: 700 }}>{invoiceSource}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mt: 0.75 }}>
                <Typography sx={{ fontSize: "0.68rem", color: "#64748B", fontWeight: 700 }}>Payment</Typography>
                <Typography sx={{ fontSize: "0.72rem", color: "#0B1C30", fontWeight: 700 }}>{paymentMode}</Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)" }}>
          <CardContent sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
              <Typography sx={{ fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "#4D5F7B" }}>
                Billed To
              </Typography>
              <Chip label={invoiceSource} size="small" sx={{ bgcolor: "#EAF1FF", color: "#4D5F7B", fontWeight: 700, borderRadius: 1.5 }} />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <PersonOutline sx={{ fontSize: 18, color: "#005F5B" }} />
              <Typography sx={{ fontWeight: 800, color: "#0B1C30" }}>{patientName}</Typography>
            </Stack>
            <Typography sx={{ mt: 0.5, fontSize: "0.78rem", color: "#4D5F7B" }}>{latestInvoice.patient_phone || "Phone not provided"}</Typography>
            <Box sx={{ mt: 1.5, p: 1.25, borderRadius: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
              <Typography sx={{ fontSize: "0.68rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Customer Type</Typography>
              <Typography sx={{ mt: 0.5, fontSize: "0.78rem", color: "#0B1C30", fontWeight: 700 }}>{invoiceSource}</Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)" }}>
          <CardContent sx={{ p: 2 }}>
            <Typography sx={{ fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "#4D5F7B" }}>
              Prescription / Doctor
            </Typography>
            <Typography sx={{ mt: 1, fontWeight: 800, color: "#0B1C30" }}>{doctorName}</Typography>
            <Typography sx={{ mt: 0.5, fontSize: "0.78rem", color: "#4D5F7B" }}>Manual doctor detail if entered in the saved invoice.</Typography>
            <Box sx={{ mt: 1.5, p: 1.25, borderRadius: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
              <Typography sx={{ fontSize: "0.68rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Invoice Status</Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                <VerifiedOutlined sx={{ fontSize: 16, color: "#005F5B" }} />
                <Typography sx={{ fontSize: "0.78rem", color: "#005F5B", fontWeight: 700 }}>Generated &amp; Saved</Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)", overflow: "hidden" }}>
        <Box sx={{ px: 2, py: 1.5, bgcolor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography sx={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "#4D5F7B" }}>
                Itemized Drug Ledger ({invoiceItems.length} Items)
              </Typography>
              <Chip label="Formulary Validated" size="small" sx={{ bgcolor: "#EAF1FF", color: "#005F5B", fontWeight: 700, borderRadius: "999px" }} />
            </Stack>
            <Typography sx={{ fontSize: "0.68rem", color: "#4D5F7B", fontWeight: 600 }}>
              Source: {invoiceSource}
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F1F5F9" }}>
                <TableCell sx={{ py: 1.2, fontSize: "0.62rem", fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>#</TableCell>
                <TableCell sx={{ py: 1.2, minWidth: 250, fontSize: "0.62rem", fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Medicine Name</TableCell>
                <TableCell sx={{ py: 1.2, fontSize: "0.62rem", fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Batch No</TableCell>
                <TableCell sx={{ py: 1.2, fontSize: "0.62rem", fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Exp Date</TableCell>
                <TableCell align="right" sx={{ py: 1.2, fontSize: "0.62rem", fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Qty</TableCell>
                <TableCell align="right" sx={{ py: 1.2, fontSize: "0.62rem", fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Unit Price</TableCell>
                <TableCell align="center" sx={{ py: 1.2, fontSize: "0.62rem", fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>GST %</TableCell>
                <TableCell align="right" sx={{ py: 1.2, fontSize: "0.62rem", fontWeight: 800, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceItems.map((item, index) => {
                const quantity = Number(item.quantity || 0);
                const unitPrice = Number(item.unit_price || 0);
                const gstRate = Number(item.gst_rate || 0);
                const lineTotal = quantity * unitPrice + (quantity * unitPrice * gstRate) / 100;

                return (
                  <TableRow key={`${item.medicine_name || item.name || "medicine"}-${index}`} hover sx={{ bgcolor: index % 2 === 1 ? "#F8FAFC" : "transparent" }}>
                    <TableCell sx={{ py: 1.5, fontSize: "0.7rem", color: "#64748B", fontWeight: 700 }}>{String(index + 1).padStart(2, "0")}</TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography sx={{ fontWeight: 700, color: "#0B1C30", fontSize: "0.84rem" }}>{item.medicine_name || item.name || "Medicine"}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.74rem", color: "#0B1C30" }}>{item.batch_number || item.batch || "-"}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, fontSize: "0.74rem", color: "#4D5F7B" }}>{item.expiry_date ? new Date(item.expiry_date).toLocaleDateString("en-IN", { month: "2-digit", year: "2-digit" }) : "-"}</TableCell>
                    <TableCell align="right" sx={{ py: 1.5, fontSize: "0.74rem", color: "#0B1C30", fontWeight: 600 }}>{quantity}</TableCell>
                    <TableCell align="right" sx={{ py: 1.5, fontSize: "0.74rem", color: "#0B1C30", fontWeight: 700 }}>{formatCurrency(unitPrice)}</TableCell>
                    <TableCell align="center" sx={{ py: 1.5 }}>
                      <Box sx={{ display: "inline-flex", px: 1, py: 0.5, borderRadius: 1, bgcolor: "#F1F5F9", color: "#4D5F7B", fontWeight: 700, fontSize: "0.68rem" }}>{gstRate}%</Box>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1.5, fontSize: "0.8rem", color: "#0B1C30", fontWeight: 800 }}>{formatCurrency(lineTotal)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>

        <Box sx={{ px: 2, py: 1.4, bgcolor: "#F8FAFC", borderTop: "1px solid #E2E8F0", display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <VerifiedOutlined sx={{ fontSize: 16, color: "#005F5B" }} />
            <Typography sx={{ fontSize: "0.72rem", color: "#475569", fontWeight: 600 }}>
              Schedule H &amp; H1 medications dispensed against verified signed prescription only.
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: "0.72rem", color: "#475569", fontWeight: 700 }}>
            Total Quantity: <Box component="span" sx={{ color: "#0B1C30" }}>{invoiceItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0)} Units</Box>
          </Typography>
        </Box>
      </Card>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "7fr 5fr" }, gap: 2 }}>
        <Box sx={{ display: "grid", gap: 2 }}>
          <Card sx={{ borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)" }}>
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box sx={{ width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: "#EAF1FF", color: "#005F5B" }}>
                    <ReceiptLongOutlined sx={{ fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#4D5F7B", fontWeight: 700 }}>
                      Dispensed &amp; Audited By
                    </Typography>
                    <Typography sx={{ fontWeight: 800, color: "#0B1C30" }}>R. Pharmacist Rahul Roy</Typography>
                    <Typography sx={{ fontSize: "0.7rem", color: "#4D5F7B" }}>Pharmacy License Reg #PR-99213 / Delhi Council</Typography>
                  </Box>
                </Stack>
                <Chip label="DIGITALLY VERIFIED" size="small" sx={{ bgcolor: "#EAF1FF", color: "#005F5B", fontWeight: 700, borderRadius: 1.5 }} />
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Card sx={{ borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)" }}>
          <CardContent sx={{ p: 2.25 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: "#0B1C30" }}>Payment Breakdown</Typography>
              <Typography sx={{ fontSize: "0.68rem", color: "#005F5B", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>INR (₹)</Typography>
            </Stack>

            <Stack spacing={1.2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ fontSize: "0.78rem", color: "#0B1C30" }}>
                <Typography sx={{ fontWeight: 500 }}>Subtotal (Gross Amount)</Typography>
                <Typography sx={{ fontWeight: 700 }}>{formatCurrency(subtotal)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ fontSize: "0.78rem", color: "#005F5B" }}>
                <Typography sx={{ fontWeight: 700 }}>Total Discount Applied</Typography>
                <Typography sx={{ fontWeight: 800 }}>{formatCurrency(0)}</Typography>
              </Stack>
            </Stack>

            <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Typography sx={{ fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#005F5B", fontWeight: 800 }}>
                  Net Payable / Total Paid
                </Typography>
                <Chip label="Paid in Full" size="small" sx={{ bgcolor: "#E6F7F0", color: "#0E7051", fontWeight: 700, borderRadius: "999px" }} />
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mt: 1.25 }}>
                <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: "#005F5B", lineHeight: 1 }}>
                  {formatCurrency(subtotal)}
                </Typography>
              </Stack>
            </Box>

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2, px: 0.5 }}>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <SecurityOutlined sx={{ fontSize: 16, color: "#005F5B" }} />
                <Typography sx={{ fontSize: "0.66rem", color: "#4D5F7B", fontWeight: 700 }}>Instant Settlement Completed</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)" }}>
        <CardContent sx={{ p: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={1.5}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box sx={{ width: 34, height: 34, borderRadius: 2, display: "grid", placeItems: "center", bgcolor: "#EAF1FF", color: "#005F5B" }}>
                <ContactSupportOutlined sx={{ fontSize: 18 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, color: "#0B1C30" }}>Pharmacy Care Support &amp; Refill Requests</Typography>
                <Typography sx={{ fontSize: "0.74rem", color: "#475569" }}>Questions about your medications or need assistance with adherence? Reach our 24/7 clinical helpline.</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button variant="outlined" size="small" sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>
                1800-409-2200
              </Button>
              <Button variant="outlined" size="small" sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>
                Dosage FAQs
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
