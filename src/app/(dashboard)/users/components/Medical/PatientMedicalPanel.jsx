"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";

import api from "../../../../../utils/axiosInstance";
import MedicalRequestInvoiceDialog from "./MedicalRequestInvoiceDialog";
import MedicalRequestTable from "./MedicalRequestTable";
const PAGE_SIZE = 8;

const STATUS_OPTIONS = [
  "PENDING",
  "APPROVED",
  "PROCESSING",
  "READY_FOR_PICKUP",
  "COMPLETED",
  "REJECTED",
  "CANCELLED",
];

const getRows = (response) => {
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response?.data?.results)) {
    return response.data.results;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
};

const getErrorMessage = (
  error,
  fallback = "Something went wrong."
) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};

const parseMedicineItems = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
};

const normalizeInvoice = (
  row = {},
  index = 0
) => {
  const id =
    row.id ||
    row.connection_id ||
    row.invoice_id ||
    row.medical_request_id ||
    `medical-request-${index}`;

  const medicineItems =
    parseMedicineItems(
      row.medicine_items
    );

  const firstMedicine =
    medicineItems?.[0] || {};

  return {
    id,

    patientName:
      row.patient_name ||
      row.patientName ||
      row.full_name ||
      row.user_name ||
      "Patient",

    age: Number(
      row.age ||
        row.patient_age ||
        0
    ),

    gender:
      row.gender ||
      row.patient_gender ||
      "Not specified",

    doctorName:
      row.doctor_name ||
      row.doctorName ||
      "Doctor",

    medicineName:
      row.medicine_name ||
      row.medicineName ||
      row.item_name ||
      row.test_name ||
      firstMedicine.medicine_name ||
      firstMedicine.name ||
      "Medication",

    medicalStore:
      row.store_name ||
      row.medical_store_name ||
      row.medicalStore ||
      row.name ||
      "Medical Store",

    quantity: Number(
      row.quantity ||
        row.qty ||
        firstMedicine.quantity ||
        1
    ),

    batchNumber:
      row.batch_number ||
      row.batchNumber ||
      "-",

    expiryDate:
      row.expiry_date ||
      row.expiryDate ||
      "-",

    unitPrice: Number(
      row.unit_price ||
        row.unitPrice ||
        0
    ),

    gstRate: Number(
      row.gst_rate ||
        row.gstRate ||
        0
    ),

    note:
      row.note ||
      row.notes ||
      row.doctor_note ||
      "",

    medicineItems,

    amount: Number(
      row.amount ||
        row.total_amount ||
        row.price ||
        0
    ),

    status: String(
      row.status ||
        row.invoice_status ||
        "PENDING"
    ).toUpperCase(),

    invoiceDate:
      row.invoice_date ||
      row.requested_at ||
      row.created_at ||
      row.date ||
      new Date().toISOString(),

    paymentMode:
      row.payment_mode ||
      row.paymentMode ||
      "Pending",

    invoiceNumber:
      row.invoice_number ||
      row.invoiceNo ||
      row.reference_no ||
      `MED-${id}`,
  };
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(Number(value || 0));
};

const formatStatus = (status) => {
  return String(status || "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

export default function PatientMedicalPanel() {
  const theme = useTheme();

  const [invoiceRows, setInvoiceRows] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    selectedInvoice,
    setSelectedInvoice,
  ] = useState(null);

  const [tablePage, setTablePage] =
    useState(1);

  const [
    tableFilters,
    setTableFilters,
  ] = useState({
    search: "",
    status: "",
    date: "",
  });

  const isDark =
    theme.palette.mode === "dark";

  const surface =
    theme.palette.background.paper;

  const pageBackground =
    theme.palette.background.default;

  const borderColor =
    theme.palette.divider;

  const primaryText =
    theme.palette.text.primary;

  const secondaryText =
    theme.palette.text.secondary;

  const primary =
    theme.palette.primary.main;

  const loadMedicalRequests =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get(
            "/api/medical-requests/patient"
          );

        const rows = getRows(
          response
        ).map((row, index) =>
          normalizeInvoice(
            row,
            index
          )
        );

        setInvoiceRows(rows);
      } catch (requestError) {
        setInvoiceRows([]);

        setError(
          getErrorMessage(
            requestError,
            "Unable to load medical requests."
          )
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadMedicalRequests();
  }, [loadMedicalRequests]);

  const handleFilterChange = (
    field,
    value
  ) => {
    setTableFilters((current) => ({
      ...current,
      [field]: value,
    }));

    setTablePage(1);
  };

  const clearFilters = () => {
    setTableFilters({
      search: "",
      status: "",
      date: "",
    });

    setTablePage(1);
  };

  const filteredRows = useMemo(() => {
    const search =
      tableFilters.search
        .trim()
        .toLowerCase();

    return invoiceRows.filter(
      (row) => {
        const searchable =
          [
            row.patientName,
            row.doctorName,
            row.medicineName,
            row.medicalStore,
            row.invoiceNumber,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const matchesSearch =
          !search ||
          searchable.includes(
            search
          );

        const matchesStatus =
          !tableFilters.status ||
          row.status ===
            tableFilters.status;

        const matchesDate =
          !tableFilters.date ||
          String(
            row.invoiceDate
          ).startsWith(
            tableFilters.date
          );

        return (
          matchesSearch &&
          matchesStatus &&
          matchesDate
        );
      }
    );
  }, [
    invoiceRows,
    tableFilters,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredRows.length /
        PAGE_SIZE
    )
  );

  useEffect(() => {
    if (
      tablePage > totalPages
    ) {
      setTablePage(
        totalPages
      );
    }
  }, [
    tablePage,
    totalPages,
  ]);

  const visibleRows = useMemo(() => {
    const start =
      (tablePage - 1) *
      PAGE_SIZE;

    return filteredRows.slice(
      start,
      start + PAGE_SIZE
    );
  }, [
    filteredRows,
    tablePage,
  ]);

  const hasFilters =
    Boolean(
      tableFilters.search ||
        tableFilters.status ||
        tableFilters.date
    );

  const statusStyle = (
    status
  ) => {
    switch (status) {
      case "COMPLETED":
        return {
          color: isDark
            ? "#86efac"
            : "#15803d",
          backgroundColor:
            isDark
              ? "rgba(34,197,94,0.14)"
              : "#f0fdf4",
          borderColor:
            isDark
              ? "rgba(34,197,94,0.25)"
              : "#bbf7d0",
        };

      case "APPROVED":
        return {
          color: isDark
            ? "#6ee7b7"
            : "#047857",
          backgroundColor:
            isDark
              ? "rgba(16,185,129,0.14)"
              : "#ecfdf5",
          borderColor:
            isDark
              ? "rgba(16,185,129,0.25)"
              : "#a7f3d0",
        };

      case "PROCESSING":
      case "IN_PROGRESS":
        return {
          color: isDark
            ? "#93c5fd"
            : "#1d4ed8",
          backgroundColor:
            isDark
              ? "rgba(59,130,246,0.14)"
              : "#eff6ff",
          borderColor:
            isDark
              ? "rgba(59,130,246,0.25)"
              : "#bfdbfe",
        };

      case "READY_FOR_PICKUP":
        return {
          color: isDark
            ? "#67e8f9"
            : "#0e7490",
          backgroundColor:
            isDark
              ? "rgba(6,182,212,0.14)"
              : "#ecfeff",
          borderColor:
            isDark
              ? "rgba(6,182,212,0.25)"
              : "#a5f3fc",
        };

      case "REJECTED":
      case "CANCELLED":
        return {
          color: isDark
            ? "#fca5a5"
            : "#b91c1c",
          backgroundColor:
            isDark
              ? "rgba(239,68,68,0.14)"
              : "#fef2f2",
          borderColor:
            isDark
              ? "rgba(239,68,68,0.25)"
              : "#fecaca",
        };

      default:
        return {
          color: isDark
            ? "#fcd34d"
            : "#a16207",
          backgroundColor:
            isDark
              ? "rgba(245,158,11,0.14)"
              : "#fffbeb",
          borderColor:
            isDark
              ? "rgba(245,158,11,0.25)"
              : "#fde68a",
        };
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      minHeight: 38,
      borderRadius: "8px",
      backgroundColor:
        pageBackground,
      fontSize: "12.5px",

      "& fieldset": {
        borderColor,
      },

      "&:hover fieldset": {
        borderColor:
          theme.palette.text
            .disabled,
      },

      "&.Mui-focused fieldset":
        {
          borderColor:
            primary,
          borderWidth: "1px",
        },
    },

    "& .MuiInputBase-input":
      {
        py: "8px",
        fontSize: "12.5px",
      },
  };

  return (
    <Box
      sx={{
        pt: {
          xs: 7,
          md: 10,
        },
        height:"100vh",
        backgroundColor:"white",
        paddingX:3,
        width: "100%",
      }}
    >
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          justifyContent:
            "space-between",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 1,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: "17px",
                md: "18px",
              },
              fontWeight: 700,
              color: primaryText,
              lineHeight: 1.3,
            }}
          >
            Medical Requests
          </Typography>

          <Typography
            sx={{
              mt: 0.35,
              fontSize: "12.5px",
              color:
                secondaryText,
            }}
          >
            Track medicine
            requests, stores and
            invoice details.
          </Typography>
        </Box>

        {!loading &&
          invoiceRows.length >
            0 && (
            <Typography
              sx={{
                fontSize:
                  "12px",
                color:
                  secondaryText,
              }}
            >
              {
                filteredRows.length
              }{" "}
              request
              {filteredRows.length !==
              1
                ? "s"
                : ""}
            </Typography>
          )}
      </Box>

      <Box
        sx={{
          backgroundColor:
            surface,
          border: "1px solid",
          borderColor,
          borderRadius: "10px",
          p: {
            xs: 1.25,
            sm: 1.5,
          },
          mb: 1.5,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "minmax(220px, 1fr) 170px 170px auto",
            },
            gap: 1,
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            size="small"
            value={
              tableFilters.search
            }
            onChange={(event) =>
              handleFilterChange(
                "search",
                event.target.value
              )
            }
            placeholder="Search patient, medicine, store..."
            sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon
                    sx={{
                      fontSize: 18,
                      color:
                        secondaryText,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <Select
            size="small"
            displayEmpty
            value={
              tableFilters.status
            }
            onChange={(event) =>
              handleFilterChange(
                "status",
                event.target.value
              )
            }
            sx={{
              minHeight: 38,
              borderRadius: "8px",
              backgroundColor:
                pageBackground,
              fontSize: "12.5px",

              "& .MuiOutlinedInput-notchedOutline":
                {
                  borderColor,
                },

              "&:hover .MuiOutlinedInput-notchedOutline":
                {
                  borderColor:
                    theme.palette
                      .text
                      .disabled,
                },

              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor:
                    primary,
                  borderWidth:
                    "1px",
                },
            }}
          >
            <MenuItem
              value=""
              sx={{
                fontSize:
                  "12.5px",
              }}
            >
              All Status
            </MenuItem>

            {STATUS_OPTIONS.map(
              (status) => (
                <MenuItem
                  key={status}
                  value={status}
                  sx={{
                    fontSize:
                      "12.5px",
                  }}
                >
                  {formatStatus(
                    status
                  )}
                </MenuItem>
              )
            )}
          </Select>

          <TextField
            type="date"
            size="small"
            value={
              tableFilters.date
            }
            onChange={(event) =>
              handleFilterChange(
                "date",
                event.target.value
              )
            }
            sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthOutlinedIcon
                    sx={{
                      fontSize: 17,
                      color:
                        secondaryText,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          {hasFilters && (
            <Tooltip title="Clear filters">
              <IconButton
                size="small"
                onClick={
                  clearFilters
                }
                sx={{
                  width: 38,
                  height: 38,
                  border:
                    "1px solid",
                  borderColor,
                  borderRadius:
                    "8px",
                  color:
                    secondaryText,
                  backgroundColor:
                    pageBackground,

                  "&:hover": {
                    color:
                      primary,
                    borderColor:
                      primary,
                    backgroundColor:
                      theme.palette
                        .action
                        .hover,
                  },
                }}
              >
                <FilterAltOffOutlinedIcon
                  sx={{
                    fontSize: 18,
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <MedicalRequestTable
  rows={visibleRows}
  loading={loading}
  tablePage={tablePage}
  hasFilters={hasFilters}
  onViewInvoice={setSelectedInvoice}
/>

      <MedicalRequestInvoiceDialog
        open={Boolean(
          selectedInvoice
        )}
        onClose={() =>
          setSelectedInvoice(
            null
          )
        }
        invoice={
          selectedInvoice
        }
      />

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={5000}
        onClose={() =>
          setError("")
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity="error"
          onClose={() =>
            setError("")
          }
          sx={{
            fontSize: "12.5px",
            borderRadius: "8px",
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}