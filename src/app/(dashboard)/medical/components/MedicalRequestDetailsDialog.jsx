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
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

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

  const invoiceNumber =
    request.invoice_number ||
    `INV-${new Date(request.created_at || Date.now()).getFullYear()}-${String(
      request.id
    ).padStart(6, "0")}`;

  /* =========================================================
     DATE
  ========================================================= */

  const invoiceDate = new Date(
    request.created_at || Date.now()
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
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
          width: "59%",
          maxHeight: "94vh",
          m: { xs: 1, sm: 2 },
          borderRadius: "12px",
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
            px: { xs: 1.5, sm: 2.5 },
            py: 1.6,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            borderBottom: "1px solid #E2E8F0",
          }}
        >
          <Box
            sx={{
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              gap: 1.2,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                flexShrink: 0,
                borderRadius: "8px",
                bgcolor: "#ECFDF5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ReceiptLongOutlinedIcon
                sx={{ color: "#07876A", fontSize: 20 }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  color: "#172033",
                  fontSize: { xs: "15px", sm: "17px" },
                  fontWeight: 700,
                }}
              >
                Medical Request Details
              </Typography>

            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={status.replaceAll("_", " ")}
              size="small"
              sx={{
                ...statusStyle,
                height: 25,
                borderRadius: "6px",
                fontSize: "10.5px",
                fontWeight: 700,
              }}
            />

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
          p: { xs: 1.5, sm: 2.5 },
          bgcolor: "#F8FAF9",
        }}
      >
        <Stack spacing={2}>
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
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "9px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.1,
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <Typography
                sx={{ color: "#172033", fontSize: "13px", fontWeight: 700 }}
              >
                Request Information
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2,1fr)",
                  md: "repeat(4,1fr)",
                },
                gap: 1.5,
              }}
            >
              <InfoItem
                icon={<LocalPharmacyOutlinedIcon />}
                label="Medical Store"
                value={request.store_name || "Medical Store"}
                subValue={
                  request.store_address ||
                  request.address ||
                  "Registered store"
                }
              />

              <InfoItem
                icon={<PersonOutlineRoundedIcon />}
                label="Patient"
                value={request.patient_name || "-"}
              />

              <InfoItem
                icon={<MedicalServicesOutlinedIcon />}
                label="Doctor"
                value={request.doctor_name || "-"}
              />

              <InfoItem
                icon={<ReceiptLongOutlinedIcon />}
                label="Invoice"
                value={invoiceNumber}
                subValue={invoiceDate}
              />
            </Box>
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
    gridTemplateColumns: {
      xs: "1fr",
      md: isCompleted ? "1fr 320px" : "1fr",
    },
    gap: 2,
    alignItems: "stretch",
  }}
>
  {/* ================= PAYMENT SUMMARY - LEFT ================= */}

  <Box
    sx={{
      bgcolor: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: "9px",
      p: 2,
    }}
  >
    <Typography
      sx={{
        color: "#64748B",
        fontSize: "10.5px",
        fontWeight: 700,
        letterSpacing: ".3px",
      }}
    >
      PAYMENT SUMMARY
    </Typography>

    <Divider sx={{ my: 1.3 }} />

    <SummaryRow
      label="Items"
      value={invoiceLines.length}
    />

    <SummaryRow
      label="Subtotal"
      value={`₹${subtotalAmount.toFixed(2)}`}
    />

    <SummaryRow
      label="GST"
      value={`₹${gstAmount.toFixed(2)}`}
    />

    {/* GRAND TOTAL */}

    <Box
      sx={{
        mt: 1.5,
        pt: 1.5,
        borderTop: "1px dashed #CBD5E1",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Typography
        sx={{
          color: "#172033",
          fontSize: "13px",
          fontWeight: 700,
        }}
      >
        Grand Total
      </Typography>

      <Typography
        sx={{
          color: "#07876A",
          fontSize: "20px",
          lineHeight: 1,
          fontWeight: 800,
        }}
      >
        ₹{calculatedAmount.toFixed(2)}
      </Typography>
    </Box>
  </Box>

  {/* ================= SIGNATURE - RIGHT ================= */}

  {isCompleted && (
    <Box
      sx={{
        borderRadius: "9px",
        p: 2,

        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",

        minHeight: 170,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 220,
          textAlign: "center",
        }}
      >
        {/* signature space */}

        <Box
          sx={{
            height: 75,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          {/* Future signature image can come here */}
        </Box>

        <Box
          sx={{
            borderTop: "1px solid #94A3B8",
            mb: 0.7,
          }}
        />

        <Typography
          sx={{
            color: "#475569",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          Authorized Signature
        </Typography>
      </Box>
    </Box>
  )}
</Box>
        </Stack>
      </DialogContent>

      {/* =====================================================
          ACTIONS
      ====================================================== */}

      <DialogActions
        sx={{
          px: { xs: 1.5, sm: 2.5 },
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

function InfoItem({ icon, label, value, subValue }) {
  return (
    <Box
      sx={{
        minWidth: 0,
        display: "flex",
        alignItems: "flex-start",
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          borderRadius: "7px",
          bgcolor: "#F0FDF9",
          color: "#07876A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          "& svg": { fontSize: 17 },
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{ color: "#64748B", fontSize: "10.5px", fontWeight: 500 }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            mt: 0.15,
            color: "#172033",
            fontSize: "12.5px",
            lineHeight: 1.35,
            fontWeight: 650,
            wordBreak: "break-word",
          }}
        >
          {value}
        </Typography>

        {subValue && (
          <Typography
            sx={{
              mt: 0.15,
              color: "#64748B",
              fontSize: "10.5px",
              lineHeight: 1.35,
              wordBreak: "break-word",
            }}
          >
            {subValue}
          </Typography>
        )}
      </Box>
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