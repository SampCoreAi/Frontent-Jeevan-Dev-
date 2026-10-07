"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Snackbar,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import api from "../../../../../utils/axiosInstance";
import MedicalRequestInvoiceDialog from "../../../users/components/Medical/MedicalRequestInvoiceDialog";
import { DataTable, SectionTitle } from "../../../lab/components/LabUi";

const getRows = (response) =>
  response?.data?.data ||
  response?.data?.results ||
  response?.data ||
  [];

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const normalizeInvoice = (row = {}) => ({
  id:
    row.id ||
    row.connection_id ||
    row.invoice_id ||
    row.medical_request_id ||
    Date.now(),

  patientName:
    row.patient_name ||
    row.patientName ||
    row.full_name ||
    row.user_name ||
    "Patient",

  age: Number(row.age || row.patient_age || 0),

  gender: row.gender || row.patient_gender || "Not specified",

  doctorName: row.doctor_name || row.doctorName || "Doctor",

  medicineName:
    row.medicine_name ||
    row.medicineName ||
    row.item_name ||
    row.prescription_name ||
    row.store_name ||
    "Medication",

  medicalStore:
    row.store_name ||
    row.medical_store_name ||
    row.name ||
    row.medicalStore ||
    "Medical Store",

  quantity: Number(row.quantity || row.qty || 1),

  batchNumber: row.batch_number || row.batchNumber || "-",

  expiryDate: row.expiry_date || row.expiryDate || "-",

  unitPrice: Number(row.unit_price || row.unitPrice || 0),

  gstRate: Number(row.gst_rate || row.gstRate || 0),

  note: row.note || "",

  medicineItems: (() => {
    try {
      return Array.isArray(row.medicine_items)
        ? row.medicine_items
        : JSON.parse(row.medicine_items || "[]");
    } catch {
      return [];
    }
  })(),

  amount: Number(row.amount || row.total_amount || row.price || 0),

  status: String(row.status || "PENDING").toUpperCase(),

  invoiceDate:
    row.invoice_date ||
    row.requested_at ||
    row.created_at ||
    row.date ||
    new Date().toISOString(),

  paymentMode: row.payment_mode || row.paymentMode || "Pending",

  invoiceNumber:
    row.invoice_number ||
    row.invoiceNo ||
    row.reference_no ||
    `MED-${row.connection_id || row.id || Date.now()}`,
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


export default function DoctorMedicalPanel() {
  const [invoiceRows, setInvoiceRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tableFilters, setTableFilters] = useState({
    search: "",
    medicalStore: "",
    status: "",
    date: "",
  });

  const [tablePage, setTablePage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [error, setError] = useState("");

  const pageSize = 8;

  useEffect(() => {
    const loadMedicalRequests = async () => {
      try {
        setLoading(true);

        const response = await api.get("/api/medical-requests/doctor");

        const rows = getRows(response).map(normalizeInvoice);

        setInvoiceRows(rows);
      } catch (requestError) {
        setError(
          getErrorMessage(
            requestError,
            "Unable to load medical requests."
          )
        );

        setInvoiceRows([]);
      } finally {
        setLoading(false);
      }
    };

    loadMedicalRequests();
  }, []);

  const medicalStoreOptions = useMemo(
    () => [...new Set(invoiceRows.map((row) => row.medicalStore))],
    [invoiceRows]
  );

  const filteredRows = useMemo(() => {
    const search = tableFilters.search.trim().toLowerCase();

    return invoiceRows.filter((row) => {
      const matchesSearch =
        !search ||
        [
          row.patientName,
          row.doctorName,
          row.medicineName,
          row.medicalStore,
          row.invoiceNumber,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search);

      const matchesStore =
        !tableFilters.medicalStore ||
        row.medicalStore === tableFilters.medicalStore;

      const matchesStatus =
        !tableFilters.status ||
        row.status === tableFilters.status;

      const matchesDate =
        !tableFilters.date ||
        String(row.invoiceDate).startsWith(tableFilters.date);

      return (
        matchesSearch &&
        matchesStore &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [invoiceRows, tableFilters]);

  const visibleRows = filteredRows.slice(
    (tablePage - 1) * pageSize,
    tablePage * pageSize
  );

  const handleFilter = (field) => (value) => {
    const nextValue =
      value &&
      typeof value === "object" &&
      "target" in value
        ? value.target.value
        : value;

    setTableFilters((current) => ({
      ...current,
      [field]: nextValue,
    }));

    setTablePage(1);
  };

  const resetFilters = () => {
    setTableFilters({
      search: "",
      medicalStore: "",
      status: "",
      date: "",
    });

    setTablePage(1);
  };

  return (
    <Box
      sx={{
        mt: { xs: 7, sm: 7, md: 8 },
        pt: { xs: 2, sm: 3 },
        pb: 3,
        px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
        backgroundColor: "#fff",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <SectionTitle
        title="Medical Requests"
        description="Track your patient medical requests, preferred store, and invoice details in one place."
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          alignItems: { xs: "stretch", lg: "center" },
          justifyContent: "space-between",
          gap: { xs: 1.5, lg: 2 },
          p: { xs: 1.5, sm: 2 },
          mb: 3,
          border: "1px solid #b1b1b1",
          borderRadius: 2,
          backgroundColor: "#fff",
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(2, minmax(0, 1fr))",
              lg: "1.4fr 1.2fr 1fr 0.9fr auto",
            },
            gap: 1.25,
            width: "100%",
            minWidth: 0,
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            size="small"
            label="Search records"
            value={tableFilters.search}
            onChange={(event) =>
              handleFilter("search")(event.target.value)
            }
            sx={{
              minWidth: 0,
              "& .MuiOutlinedInput-root": {
                height: 40,
                backgroundColor: "#fff",
                borderRadius: 1.5,
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.85rem",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e1e1e1",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#b1b1b1",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: "#789096",
                      fontSize: 19,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            select
            size="small"
            label="Medical Store"
            value={tableFilters.medicalStore}
            onChange={(event) =>
              handleFilter("medicalStore")(event.target.value)
            }
            sx={{
              minWidth: 0,
              "& .MuiOutlinedInput-root": {
                height: 40,
                backgroundColor: "#fff",
                borderRadius: 1.5,
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.85rem",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e1e1e1",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#b1b1b1",
              },
            }}
          >
            <MenuItem value="">All medical stores</MenuItem>

            {medicalStoreOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            size="small"
            label="Status"
            value={tableFilters.status}
            onChange={(event) =>
              handleFilter("status")(event.target.value)
            }
            sx={{
              minWidth: 0,
              "& .MuiOutlinedInput-root": {
                height: 40,
                backgroundColor: "#fff",
                borderRadius: 1.5,
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.85rem",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e1e1e1",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#b1b1b1",
              },
            }}
          >
            <MenuItem value="">All statuses</MenuItem>
            <MenuItem value="PENDING">PENDING</MenuItem>
            <MenuItem value="APPROVED">APPROVED</MenuItem>
            <MenuItem value="PROCESSING">PROCESSING</MenuItem>
            <MenuItem value="READY_FOR_PICKUP">
              READY FOR PICKUP
            </MenuItem>
            <MenuItem value="IN_PROGRESS">IN PROGRESS</MenuItem>
            <MenuItem value="COMPLETED">COMPLETED</MenuItem>
            <MenuItem value="REJECTED">REJECTED</MenuItem>
            <MenuItem value="CANCELLED">CANCELLED</MenuItem>
          </TextField>

          <TextField
            fullWidth
            size="small"
            type="date"
            label="Date"
            value={tableFilters.date}
            onChange={(event) =>
              handleFilter("date")(event.target.value)
            }
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              minWidth: 0,
              "& .MuiOutlinedInput-root": {
                height: 40,
                backgroundColor: "#fff",
                borderRadius: 1.5,
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.85rem",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e1e1e1",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#b1b1b1",
              },
            }}
          />

          <Button
            fullWidth
            variant="outlined"
            onClick={resetFilters}
            sx={{
              height: 40,
              minWidth: 90,
              px: 1.75,
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.82rem",
              color: "#0b5c8e",
              borderColor: "#b1b1b1",
              backgroundColor: "#fff",
              whiteSpace: "nowrap",
              "&:hover": {
                borderColor: "#0b5c8e",
                backgroundColor: "#f8fafc",
              },
            }}
          >
            Reset
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          borderRadius: 2,
          "& table": {
            minWidth: 850,
          },
        }}
      >
        <DataTable
          columns={[
            "SNO",
            "PATIENT",
            "MEDICINE",
            "STORE",
            "AMOUNT",
            "STATUS",
            "ACTION",
          ]}
          loading={loading}
          emptyMessage="No medical requests found."
          footer={
            <Pagination
              count={Math.max(
                1,
                Math.ceil(filteredRows.length / pageSize)
              )}
              page={tablePage - 1}
              onChange={(_, value) => setTablePage(value + 1)}
              size="small"
              color="primary"
              sx={{
                "& .MuiPagination-ul": {
                  flexWrap: "wrap",
                  justifyContent: "center",
                },
              }}
            />
          }
        >
          {visibleRows.length
            ? visibleRows.map((row, index) => (
                <TableRow
                  key={row.id}
                  hover
                >
                  <TableCell
                    sx={{
                      color: "#1f2937 !important",
                      fontWeight: 600,
                    }}
                  >
                    {(tablePage - 1) * pageSize + index + 1}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "#1f2937 !important",
                      maxWidth: 180,
                      whiteSpace: "normal",
                    }}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gap: 0.25,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: "0.78rem", sm: "0.85rem" },
                          wordBreak: "break-word",
                        }}
                      >
                        {row.patientName}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontSize: "0.72rem",
                        }}
                      >
                        {row.age} yrs • {row.gender}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "#1f2937 !important",
                      maxWidth: 210,
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {row.medicineName}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "#475569 !important",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {row.medicalStore}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "#0f172a !important",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatCurrency(row.amount)}
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={row.status.replaceAll("_", " ")}
                      color={statusColor(row.status)}
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        maxWidth: 150,
                      }}
                    />
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
              ))
            : null}
        </DataTable>
      </Box>

      <MedicalRequestInvoiceDialog
        open={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
      />

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={5000}
        onClose={() => setError("")}
      >
        <Alert
          severity="error"
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
