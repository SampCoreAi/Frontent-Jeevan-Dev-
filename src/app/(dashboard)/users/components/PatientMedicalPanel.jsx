"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  Dialog,
  IconButton,
  Pagination,
  Snackbar,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import api from "../../../../utils/axiosInstance";
import { DataTable, SectionTitle, TableFilters } from "../../lab/components/LabUi";
import MedicalRequestInvoiceDialog from "./MedicalRequestInvoiceDialog";

const getRows = (response) => response?.data?.data || response?.data?.results || response?.data || [];
const getErrorMessage = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

const normalizeInvoice = (row = {}) => ({
  id: row.id || row.connection_id || row.invoice_id || row.medical_request_id || Date.now(),
  patientName: row.patient_name || row.patientName || row.full_name || row.user_name || "Patient",
  age: Number(row.age || row.patient_age || 0),
  gender: row.gender || row.patient_gender || "Not specified",
  doctorName: row.doctor_name || row.doctorName || "Doctor",
  medicineName: row.medicine_name || row.medicineName || row.item_name || row.test_name || "Medication",
  medicalStore: row.store_name || row.medical_store_name || row.medicalStore || row.name || "Medical Store",
  quantity: Number(row.quantity || row.qty || 1),
  batchNumber: row.batch_number || row.batchNumber || "-",
  expiryDate: row.expiry_date || row.expiryDate || "-",
  unitPrice: Number(row.unit_price || row.unitPrice || 0),
  gstRate: Number(row.gst_rate || row.gstRate || 0),
  note: row.note || "",
  medicineItems: (() => {
    try { return Array.isArray(row.medicine_items) ? row.medicine_items : JSON.parse(row.medicine_items || "[]"); } catch { return []; }
  })(),
  amount: Number(row.amount || row.total_amount || row.price || 0),
  status: String(row.status || row.invoice_status || "PENDING").toUpperCase(),
  invoiceDate: row.invoice_date || row.requested_at || row.created_at || row.date || new Date().toISOString(),
  paymentMode: row.payment_mode || row.paymentMode || "Pending",
  invoiceNumber: row.invoice_number || row.invoiceNo || row.reference_no || `MED-${row.id || row.connection_id || Date.now()}`,
});

const statusColor = (status) => {
  switch (String(status || "").toUpperCase()) {
    case "COMPLETED":
      return "success";
    case "IN_PROGRESS":
    case "PROCESSING":
    case "READY_FOR_PICKUP":
      return "info";
    case "APPROVED":
      return "success";
    case "PENDING":
      return "warning";
    default:
      return "default";
  }
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function PatientMedicalPanel() {
  const [invoiceRows, setInvoiceRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableFilters, setTableFilters] = useState({ search: "", status: "", date: "" });
  const [tablePage, setTablePage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [error, setError] = useState("");
  const pageSize = 8;

  useEffect(() => {
    const loadMedicalRequests = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/medical-requests/patient");
        const rows = getRows(response).map(normalizeInvoice);
        setInvoiceRows(rows);
      } catch (requestError) {
        setError(getErrorMessage(requestError, "Unable to load medical requests."));
        setInvoiceRows([]);
      } finally {
        setLoading(false);
      }
    };

    loadMedicalRequests();
  }, []);

  const filteredRows = useMemo(() => {
    const search = tableFilters.search.trim().toLowerCase();
    return invoiceRows.filter((row) => {
      const matchesSearch =
        !search ||
        [row.patientName, row.doctorName, row.medicineName, row.medicalStore, row.invoiceNumber]
          .join(" ")
          .toLowerCase()
          .includes(search);

      const matchesStatus = !tableFilters.status || row.status === tableFilters.status;
      const matchesDate = !tableFilters.date || String(row.invoiceDate).startsWith(tableFilters.date);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [invoiceRows, tableFilters]);

  const visibleRows = filteredRows.slice((tablePage - 1) * pageSize, tablePage * pageSize);

  const handleFilter = (field) => (value) => {
    setTableFilters((current) => ({ ...current, [field]: value }));
  };

  const filterProps = useMemo(
    () => ({
      search: tableFilters.search,
      status: tableFilters.status,
      date: tableFilters.date,
      onSearch: handleFilter("search"),
      onStatus: handleFilter("status"),
      onDate: handleFilter("date"),
    }),
    [tableFilters]
  );

  return (
    <Box sx={{ mt: { xs: 7, md: 8 }, display: "grid", gap: 3 }}>
      <SectionTitle title="Medical Requests" description="Track your medical requests, preferred store, and invoice details in one place." />
      <TableFilters
        {...filterProps}
        statusOptions={["PENDING", "APPROVED", "PROCESSING", "READY_FOR_PICKUP", "COMPLETED", "REJECTED", "CANCELLED"]}
      />

      <DataTable
        columns={["SNO", "PATIENT", "MEDICINE", "STORE", "AMOUNT", "STATUS", "ACTION"]}
        loading={loading}
        emptyMessage="No medical requests found."
        footer={<Pagination count={Math.max(1, Math.ceil(filteredRows.length / pageSize))} page={tablePage - 1} onChange={(_, value) => setTablePage(value + 1)} size="small" color="primary" />}
      >
        {visibleRows.length ? visibleRows.map((row, index) => (
          <TableRow key={row.id} hover>
            <TableCell sx={{ color: "#1f2937 !important", fontWeight: 600 }}>{(tablePage - 1) * pageSize + index + 1}</TableCell>
            <TableCell sx={{ color: "#1f2937 !important", maxWidth: 180, whiteSpace: "normal" }}>
              <Box sx={{ display: "grid" }}>
                <Typography sx={{ fontWeight: 700 }}>{row.patientName}</Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  {row.age} yrs • {row.gender}
                </Typography>
              </Box>
            </TableCell>
            <TableCell sx={{ color: "#1f2937 !important", maxWidth: 210, whiteSpace: "normal" }}>{row.medicineName}</TableCell>
            <TableCell sx={{ color: "#475569 !important" }}>{row.medicalStore}</TableCell>
            <TableCell sx={{ color: "#0f172a !important", fontWeight: 600 }}>{formatCurrency(row.amount)}</TableCell>
            <TableCell>
              <Chip size="small" label={row.status.replace("_", " ")} color={statusColor(row.status)} />
            </TableCell>
            <TableCell>
              {row.status === "COMPLETED" ? (
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => setSelectedInvoice(row)}
                  aria-label={`View invoice for ${row.patientName}`}
                >
                  <VisibilityOutlinedIcon fontSize="small" />
                </IconButton>
              ) : null}
            </TableCell>
          </TableRow>
        )) : null}
      </DataTable>

      <Dialog
        open={false}
        onClose={() => setSelectedInvoice(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 8px 28px rgba(15, 23, 42, 0.12)",
            maxHeight: "82vh",
            margin: 1,
          },
        }}
      >
        {selectedInvoice ? (
          <Box sx={{ p: 1.75, background: "#f8fafc", maxHeight: "82vh", overflowY: "auto" }}>
            <Typography sx={{ color: "#123f66", fontWeight: 800, fontSize: "1.1rem", lineHeight: 1.2, mb: 1.5 }}>
              Medical Invoice
            </Typography>

            <Box
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                background: "#fff",
                p: 1.5,
                mb: 1.5,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1.5, flexWrap: "wrap" }}>
                <Box>
                  <Typography sx={{ color: "#64748b", fontSize: "0.78rem", mt: 0.5 }}>
                    Created: {new Date(selectedInvoice.invoiceDate).toLocaleDateString("en-GB")}
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.78rem", mt: 0.15 }}>
                    Status: {selectedInvoice.status.replace("_", " ")}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5, mt: 1.5 }}>
                <Box>
                  <Typography sx={{ color: "#123f66", fontWeight: 800, fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Patient
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: "0.9rem", mt: 0.35 }}>
                    {selectedInvoice.patientName}
                  </Typography>
                  <Typography sx={{ color: "#475569", fontSize: "0.78rem", mt: 0.15 }}>
                    {selectedInvoice.age} yrs • {selectedInvoice.gender}
                  </Typography>
                  <Typography sx={{ color: "#475569", fontSize: "0.78rem", mt: 0.15 }}>
                    {selectedInvoice.medicalStore}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ color: "#123f66", fontWeight: 800, fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Physician
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: "0.9rem", mt: 0.35 }}>
                    {selectedInvoice.doctorName}
                  </Typography>
                  <Typography sx={{ color: "#475569", fontSize: "0.78rem", mt: 0.15 }}>
                    Invoice no: {selectedInvoice.invoiceNumber}
                  </Typography>
                  <Typography sx={{ color: "#475569", fontSize: "0.78rem", mt: 0.15 }}>
                    Payment: {selectedInvoice.paymentMode}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2, background: "#fff", overflow: "hidden" }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "1.3fr 2fr 0.95fr 0.9fr", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <Typography sx={{ p: 0.85, color: "#123f66", fontWeight: 800, fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase", borderRight: "1px solid #e2e8f0" }}>Item</Typography>
                <Typography sx={{ p: 0.85, color: "#123f66", fontWeight: 800, fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase", borderRight: "1px solid #e2e8f0" }}>Description</Typography>
                <Typography sx={{ p: 0.85, color: "#123f66", fontWeight: 800, fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase", borderRight: "1px solid #e2e8f0" }}>Qty</Typography>
                <Typography sx={{ p: 0.85, color: "#123f66", fontWeight: 800, fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>Price</Typography>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: "1.3fr 2fr 0.95fr 0.9fr", borderBottom: "1px solid #e2e8f0" }}>
                <Typography sx={{ p: 0.85, color: "#0f172a", fontSize: "0.8rem", borderRight: "1px solid #e2e8f0" }}>{selectedInvoice.medicineName}</Typography>
                <Typography sx={{ p: 0.85, color: "#475569", fontSize: "0.78rem", borderRight: "1px solid #e2e8f0" }}>
                  Prescribed by {selectedInvoice.doctorName}
                </Typography>
                <Typography sx={{ p: 0.85, color: "#0f172a", fontSize: "0.8rem", borderRight: "1px solid #e2e8f0" }}>{selectedInvoice.quantity}</Typography>
                <Typography sx={{ p: 0.85, color: "#0f172a", fontWeight: 700, fontSize: "0.8rem" }}>{formatCurrency(selectedInvoice.amount)}</Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 1.5, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 0.8fr" }, gap: 1.5 }}>
              <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2, background: "#fff", p: 1.25 }}>
                <Typography sx={{ color: "#123f66", fontWeight: 800, fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", mb: 0.65 }}>
                  Notes
                </Typography>
                <Typography sx={{ color: "#475569", fontSize: "0.78rem" }}>
                  Medical prescription delivered through {selectedInvoice.medicalStore}. Please retain this invoice for payment and record tracking.
                </Typography>
              </Box>

              <Box sx={{ border: "1px solid #e2e8f0", borderRadius: 2, background: "#fff", p: 1.25 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.6 }}>
                  <Typography sx={{ color: "#475569", fontWeight: 700, fontSize: "0.75rem" }}>Subtotal</Typography>
                  <Typography sx={{ color: "#0f172a", fontWeight: 700, fontSize: "0.75rem" }}>{formatCurrency(selectedInvoice.amount)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.6 }}>
                  <Typography sx={{ color: "#475569", fontWeight: 700, fontSize: "0.75rem" }}>Discount</Typography>
                  <Typography sx={{ color: "#0f172a", fontWeight: 700, fontSize: "0.75rem" }}>{formatCurrency(selectedInvoice.amount * 0.09)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.6 }}>
                  <Typography sx={{ color: "#475569", fontWeight: 700, fontSize: "0.75rem" }}>Tax</Typography>
                  <Typography sx={{ color: "#0f172a", fontWeight: 700, fontSize: "0.75rem" }}>{formatCurrency(selectedInvoice.amount * 0.18)}</Typography>
                </Box>
                <Box sx={{ borderTop: "1px solid #e2e8f0", pt: 0.75, mt: 0.75, display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: "#ef4444", fontWeight: 900, fontSize: "0.95rem" }}>Total</Typography>
                  <Typography sx={{ color: "#ef4444", fontWeight: 900, fontSize: "0.95rem" }}>
                    {formatCurrency(selectedInvoice.amount - selectedInvoice.amount * 0.09 + selectedInvoice.amount * 0.18)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : null}
      </Dialog>

      <MedicalRequestInvoiceDialog
        open={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />

      <Snackbar open={Boolean(error)} autoHideDuration={5000} onClose={() => setError("")}>
        <Alert severity="error" onClose={() => setError("")}>{error}</Alert>
      </Snackbar>
    </Box>
  );
}
