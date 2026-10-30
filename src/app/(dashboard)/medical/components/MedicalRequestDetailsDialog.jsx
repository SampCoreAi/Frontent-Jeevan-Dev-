"use client";

import { useCallback, useEffect, useState } from "react";

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
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import MedicineBillingTable from "./MedicineBillingTable";

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function MedicalRequestDetailsDialog({
  open,
  request,
  loading = false,
  onClose,
  onComplete,
}) {
  const [prescriptionLines, setPrescriptionLines] = useState([]);
  const [invoiceLines, setInvoiceLines] = useState([]);
  const [note, setNote] = useState("");
  const [validation, setValidation] = useState("");

  /* =========================================================
     NORMALIZE REQUEST
  ========================================================= */

  useEffect(() => {
    if (!request) return;

    const items = (() => {
      if (Array.isArray(request.medicine_items)) {
        return request.medicine_items;
      }

      try {
        const parsed = JSON.parse(request.medicine_items || "[]");

        if (Array.isArray(parsed) && parsed.length) {
          return parsed;
        }
      } catch {}

      return [
        {
          medicine_name: request.medicine_name,
          quantity: request.quantity || 1,
          dose: request.dose || request.note || "",
        },
      ];
    })();

    const normalizedPrescription = items.map((item) => ({
      ...item,
      medicine_name:
        item.medicine_name || item.name || request.medicine_name || "-",
      quantity: Number(item.quantity || 1),
      dose: item.dose || item.note || "",
    }));

    const normalizedInvoice = normalizedPrescription.map((item, index) => ({
      ...item,
      _rowId: item.id || `${request.id}-${index}`,
      batch_number: item.batch_number || request.batch_number || "",
      expiry_date: item.expiry_date || request.expiry_date || "",
      quantity: Number(item.quantity || 1),
      unit_price: item.unit_price ?? request.unit_price ?? "",
      gst_rate: item.gst_rate ?? request.gst_rate ?? "",
    }));

    setPrescriptionLines(normalizedPrescription);
    setInvoiceLines(normalizedInvoice);
    setNote(request.note || "");
    setValidation("");
  }, [request]);

  const updateLine = useCallback((index, field, value) => {
    setInvoiceLines((previous) =>
      previous.map((line, lineIndex) =>
        lineIndex === index ? { ...line, [field]: value } : line
      )
    );
  }, []);

  const handleRemoveLine = useCallback((index) => {
    setInvoiceLines((previous) =>
      previous.filter((_, lineIndex) => lineIndex !== index)
    );
  }, []);

  if (!request) {
    return null;
  }

  /* =========================================================
     STATUS
  ========================================================= */

  const status = String(request.status || "PENDING").toUpperCase();
  const isCompleted = status === "COMPLETED";

  /* =========================================================
     INVOICE NUMBER
  ========================================================= */

  const createdAt = new Date(request.created_at || Date.now());
  const invoiceDatePart = Number.isNaN(createdAt.getTime())
    ? new Date().toISOString().slice(0, 10).replaceAll("-", "")
    : `${createdAt.getFullYear()}${String(createdAt.getMonth() + 1).padStart(
        2,
        "0"
      )}${String(createdAt.getDate()).padStart(2, "0")}`;
  const invoiceNumber =
    request.invoice_number ||
    `MED-${invoiceDatePart}-${String(request.id).padStart(6, "0")}`;

  /* =========================================================
     DATE
  ========================================================= */

  const invoiceDate = new Date(
    request.created_at || Date.now()
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  /* =========================================================
     CALCULATE TOTAL
  ========================================================= */

  const calculatedAmount = invoiceLines.reduce((total, line) => {
    const quantity = Number(line.quantity || 0);
    const price = Number(line.unit_price || 0);
    const gst = Number(line.gst_rate || 0);

    const subtotal = quantity * price;
    const gstAmount = (subtotal * gst) / 100;

    return total + subtotal + gstAmount;
  }, 0);

  const subtotalAmount = invoiceLines.reduce((total, line) => {
    return total + Number(line.quantity || 0) * Number(line.unit_price || 0);
  }, 0);

  const gstAmount = calculatedAmount - subtotalAmount;
  const totalQuantity = invoiceLines.reduce(
    (total, line) => total + Number(line.quantity || 0),
    0
  );
  const averageGstRate =
    subtotalAmount > 0 ? (gstAmount / subtotalAmount) * 100 : 0;
  const amountValue = Number(
    request.amount ?? request.total_amount ?? calculatedAmount
  );
  const invoiceTotal = Number.isFinite(amountValue)
    ? amountValue
    : calculatedAmount;

  /* =========================================================
     COMPLETE
  ========================================================= */

  const handleComplete = () => {
    if (!invoiceLines.length) {
      setValidation("Invoice me kam se kam ek medicine hona chahiye.");
      return;
    }

    const hasEmptyFields = invoiceLines.some(
      (line) =>
        !String(line.batch_number || "").trim() ||
        !line.expiry_date ||
        !String(line.unit_price ?? "").trim() ||
        !String(line.gst_rate ?? "").trim()
    );

    if (hasEmptyFields) {
      setValidation(
        "Har medicine ke batch, expiry, unit price aur GST details fill karein."
      );
      return;
    }

    const hasInvalidValues = invoiceLines.some(
      (line) =>
        Number(line.quantity) <= 0 ||
        Number(line.unit_price) < 0 ||
        Number(line.gst_rate) < 0
    );

    if (hasInvalidValues) {
      setValidation(
        "Quantity, unit price aur GST valid value honi chahiye."
      );
      return;
    }

    setValidation("");

    onComplete(request.id, "COMPLETED", note.trim() || null, {
      totalAmount: calculatedAmount,
      invoiceItems: invoiceLines,
      batchNumber: invoiceLines[0]?.batch_number,
      expiryDate: invoiceLines[0]?.expiry_date,
      unitPrice: Number(invoiceLines[0]?.unit_price || 0),
      gstRate: Number(invoiceLines[0]?.gst_rate || 0),
      amount: calculatedAmount,
    });
  };

  /* =========================================================
     STATUS STYLE
  ========================================================= */

  const statusStyle =
    status === "COMPLETED"
      ? { color: "#07876A", bgcolor: "#ECFDF5", border: "1px solid #A7F3D0" }
      : status === "REJECTED"
      ? { color: "#DC2626", bgcolor: "#FEF2F2", border: "1px solid #FECACA" }
      : { color: "#B45309", bgcolor: "#FFFBEB", border: "1px solid #FDE68A" };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          width: "min(900px, calc(100% - 32px))",
          maxWidth: "900px",
          maxHeight: "92vh",
          m: { xs: 1, sm: 2 },
          borderRadius: "10px",
          boxShadow: "0 20px 60px rgba(15,23,42,.14)",
          overflow: "hidden",
        },
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <DialogTitle sx={{ p: 0, bgcolor: "#FFFFFF" }}>
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            borderBottom: "1px solid #D6E6E0",
          }}
        >
          <Box
            sx={{
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 54,
                height: 54,
                flexShrink: 0,
                borderRadius: "13px",
                bgcolor: "#ECFDF5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AddRoundedIcon sx={{ color: "#07876A", fontSize: 30, fontWeight: 700 }} />
            </Box>

            <Box>
              <Typography
                sx={{
                  color: "#172033",
                  fontSize: { xs: "17px", sm: "21px" },
                  fontWeight: 600,
                }}
              >
                {request.store_name || request.pharmacy_name || "Medical Store"}
              </Typography>
              <Box sx={{ width: 14, mt: 0.6, borderBottom: "2px solid #07876A" }} />
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ color: "#172033", fontSize: { xs: 13, sm: 17 }, fontWeight: 700, whiteSpace: "nowrap" }}>
                {invoiceNumber}
              </Typography>
              <Typography sx={{ color: "#64748B", fontSize: 12 }}>
                {invoiceDate}
              </Typography>
              <Chip
                label={status.replaceAll("_", " ")}
                size="small"
                sx={{
                  ...statusStyle,
                  mt: 0.5,
                  height: 21,
                  borderRadius: "5px",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              />
            </Box>
            <IconButton
              size="small"
              onClick={onClose}
              disabled={loading}
              sx={{
                width: 32,
                height: 32,
                border: "1px solid #E2E8F0",
                borderRadius: "7px",
                color: "#64748B",
              }}
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <DialogContent
        sx={{
          p: { xs: 2, sm: 3 },
          bgcolor: "#FFFFFF",
        }}
      >
        <Stack spacing={2.5}>
          {/* VALIDATION */}

          {validation && (
            <Alert
              severity="error"
              onClose={() => setValidation("")}
              sx={{
                fontSize: "12px",
                borderRadius: "7px",
                border: "1px solid #FECACA",
                bgcolor: "#FEF2F2",
              }}
            >
              {validation}
            </Alert>
          )}

          {/* =================================================
              REQUEST INFORMATION
          ================================================= */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              borderTop: "1px solid #D6E6E0",
              borderBottom: "1px solid #D6E6E0",
            }}
          >
            <InvoiceInfo
              label="PATIENT"
              value={request.patient_name || request.patientName || request.patient || "-"}
              detail={`Patient ID: ${request.patient_id || request.patientId || "—"}`}
            />
            <InvoiceInfo
              label="PRESCRIBED BY"
              value={request.doctor_name || request.doctorName || request.doctor || "-"}
              detail={`Doctor ID: ${request.doctor_id || request.doctorId || "—"}`}
            />
            <InvoiceInfo
              label="ORDER"
              value={request.order_id || request.id || "—"}
              detail={`Version: ${request.request_version || request.version || 1}`}
              last
            />
          </Box>

          {/* =================================================
              MEDICINE & BILLING DETAILS (EXTRACTED COMPONENT)
          ================================================= */}

          <MedicineBillingTable
            invoiceLines={invoiceLines}
            onUpdateLine={updateLine}
            onRemoveLine={handleRemoveLine}
          />

          {/* =================================================
              NOTE + SUMMARY
          ================================================= */}
{/* =================================================
    PAYMENT SUMMARY + SIGNATURE
================================================= */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 3,
              alignItems: "start",
            }}
          >
            <Box
              sx={{
                p: 1.8,
                border: "1px solid #D6E6E0",
                borderRadius: "8px",
              }}
            >
              <Typography sx={{ color: "#172033", fontSize: 13, mb: 0.6 }}>
                Payment
              </Typography>
              <SummaryRow label="Method" value={request.payment_mode || request.payment_method || "—"} />
              <SummaryRow label="Status" value={request.payment_status || status} />
            </Box>

            <Box sx={{ pt: 0.3 }}>
              <SummaryRow label="Quantity" value={totalQuantity} />
              <SummaryRow label="Total Unit Price" value={`₹${subtotalAmount.toFixed(2)}`} />
              <SummaryRow label="GST Rate" value={`${averageGstRate.toFixed(2)}%`} />
              <SummaryRow
                label="Amount"
                value={`₹${invoiceTotal.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
              />
              <Box
                sx={{
                  mt: 1.2,
                  pt: 1.2,
                  borderTop: "2px solid #172033",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Typography sx={{ color: "#172033", fontSize: 14, fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography sx={{ color: "#07876A", fontSize: 22, lineHeight: 1, fontWeight: 800 }}>
                  ₹{invoiceTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              p: 1.8,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 2,
              bgcolor: "#FAFCFB",
              border: "1px solid #D6E6E0",
              borderRadius: "8px",
            }}
          >
            <StoreDetail label="STORE ADDRESS" value={request.store_address || request.address || "—"} />
            <StoreDetail label="CONTACT" value={request.store_phone || request.phone_number || request.store_contact || "—"} />
            <StoreDetail label="STORE TIMINGS" value={request.store_timings || request.store_timing || "—"} />
          </Box>
        </Stack>
      </DialogContent>

      {/* =====================================================
          ACTIONS
      ====================================================== */}

      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: 1.5,
          bgcolor: "#FFFFFF",
          borderTop: "1px solid #E2E8F0",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          startIcon={<ArrowBackOutlinedIcon />}
          sx={{
            height: 36,
            px: 1.5,
            color: "#475569",
            borderRadius: "6px",
            textTransform: "none",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          Back
        </Button>

        {!isCompleted && (
          <Button
            variant="contained"
            onClick={handleComplete}
            disabled={loading}
            startIcon={<CheckCircleOutlineRoundedIcon />}
            sx={{
              height: 38,
              px: 2,
              bgcolor: "#07876A",
              borderRadius: "6px",
              boxShadow: "none",
              textTransform: "none",
              fontSize: "12.5px",
              fontWeight: 600,

              "&:hover": {
                bgcolor: "#066F58",
                boxShadow: "none",
              },
            }}
          >
            {loading ? "Completing..." : "Complete & Deliver"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InvoiceInfo({ label, value, detail, last = false }) {
  return (
    <Box
      sx={{
        minWidth: 0,
        px: 1.8,
        py: 1.5,
        borderRight: { xs: 0, sm: last ? 0 : "1px solid #D6E6E0" },
        borderBottom: { xs: last ? 0 : "1px solid #D6E6E0", sm: 0 },
      }}
    >
      <Typography sx={{ color: "#718096", fontSize: 10, fontWeight: 700, letterSpacing: ".45px" }}>
        {label}
      </Typography>
      <Typography sx={{ mt: 0.6, color: "#172033", fontSize: 12.5, fontWeight: 650, wordBreak: "break-word" }}>
        {value}
      </Typography>
      <Typography sx={{ mt: 0.4, color: "#475569", fontSize: 11, wordBreak: "break-word" }}>
        {detail}
      </Typography>
    </Box>
  );
}

function StoreDetail({ label, value }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ color: "#718096", fontSize: 10, fontWeight: 700, letterSpacing: ".45px" }}>
        {label}
      </Typography>
      <Typography sx={{ mt: 0.7, color: "#475569", fontSize: 12, wordBreak: "break-word" }}>
        {value}
      </Typography>
    </Box>
  );
}

/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({ label, value }) {
  return (
    <Box
      sx={{
        py: 0.45,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Typography sx={{ color: "#64748B", fontSize: "11.5px" }}>
        {label}
      </Typography>

      <Typography
        sx={{ color: "#172033", fontSize: "11.5px", fontWeight: 650 }}
      >
        {value}
      </Typography>
    </Box>
  );
}