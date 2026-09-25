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

import api from "../../../../utils/axiosInstance";
import MedicalRequestInvoiceDialog from "./MedicalRequestInvoiceDialog";

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

      <Box
        sx={{
          backgroundColor:
            surface,
          border: "1px solid",
          borderColor,
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <TableContainer
          sx={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <Table
            size="small"
            sx={{
              minWidth: 900,
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor:
                    pageBackground,
                }}
              >
                {[
                  "#",
                  "Patient",
                  "Medicine",
                  "Store",
                  "Amount",
                  "Status",
                  "Date",
                  "Action",
                ].map(
                  (column) => (
                    <TableCell
                      key={column}
                      align={
                        column ===
                        "Action"
                          ? "center"
                          : "left"
                      }
                      sx={{
                        py: 1.25,
                        px: 1.5,
                        borderBottom:
                          "1px solid",
                        borderColor,
                        color:
                          secondaryText,
                        fontSize:
                          "11px",
                        fontWeight: 700,
                        textTransform:
                          "uppercase",
                        letterSpacing:
                          "0.04em",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {column}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                Array.from({
                  length: 5,
                }).map((_, index) => (
                  <TableRow
                    key={index}
                  >
                    {Array.from({
                      length: 8,
                    }).map(
                      (
                        __,
                        cellIndex
                      ) => (
                        <TableCell
                          key={
                            cellIndex
                          }
                          sx={{
                            py: 1.7,
                            borderColor,
                          }}
                        >
                          <Box
                            sx={{
                              height: 10,
                              width:
                                cellIndex ===
                                0
                                  ? 20
                                  : "75%",
                              borderRadius:
                                "4px",
                              backgroundColor:
                                theme
                                  .palette
                                  .action
                                  .hover,
                              animation:
                                "pulse 1.4s ease-in-out infinite",

                              "@keyframes pulse":
                                {
                                  "0%": {
                                    opacity: 0.5,
                                  },
                                  "50%":
                                    {
                                      opacity: 1,
                                    },
                                  "100%":
                                    {
                                      opacity: 0.5,
                                    },
                                },
                            }}
                          />
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))
              ) : visibleRows.length >
                0 ? (
                visibleRows.map(
                  (
                    row,
                    index
                  ) => {
                    const chipStyle =
                      statusStyle(
                        row.status
                      );

                    return (
                      <TableRow
                        key={
                          row.id
                        }
                        hover
                        sx={{
                          transition:
                            "background-color 0.2s ease",

                          "&:last-child td":
                            {
                              borderBottom:
                                0,
                            },
                        }}
                      >
                        <TableCell
                          sx={{
                            px: 1.5,
                            py: 1.25,
                            borderColor,
                            fontSize:
                              "12.5px",
                            fontWeight: 600,
                            color:
                              secondaryText,
                          }}
                        >
                          {(tablePage -
                            1) *
                            PAGE_SIZE +
                            index +
                            1}
                        </TableCell>

                        <TableCell
                          sx={{
                            px: 1.5,
                            py: 1.25,
                            borderColor,
                          }}
                        >
                          <Box
                            sx={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius:
                                  "50%",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                flexShrink: 0,
                                fontSize:
                                  "11px",
                                fontWeight: 700,
                                color:
                                  primary,
                                backgroundColor:
                                  theme
                                    .palette
                                    .action
                                    .hover,
                              }}
                            >
                              {String(
                                row.patientName ||
                                  "P"
                              )
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </Box>

                            <Box
                              sx={{
                                minWidth: 0,
                              }}
                            >
                              <Typography
                                sx={{
                                  maxWidth:
                                    150,
                                  overflow:
                                    "hidden",
                                  textOverflow:
                                    "ellipsis",
                                  whiteSpace:
                                    "nowrap",
                                  fontSize:
                                    "12.5px",
                                  fontWeight: 700,
                                  color:
                                    primaryText,
                                }}
                              >
                                {
                                  row.patientName
                                }
                              </Typography>

                              <Typography
                                sx={{
                                  mt: 0.15,
                                  fontSize:
                                    "11px",
                                  color:
                                    secondaryText,
                                }}
                              >
                                {row.age >
                                0
                                  ? `${row.age} yrs`
                                  : "Age N/A"}

                                {" • "}

                                {
                                  row.gender
                                }
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell
                          sx={{
                            px: 1.5,
                            py: 1.25,
                            borderColor,
                          }}
                        >
                          <Box
                            sx={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 0.7,
                            }}
                          >
                            <MedicationOutlinedIcon
                              sx={{
                                fontSize:
                                  16,
                                color:
                                  secondaryText,
                                flexShrink: 0,
                              }}
                            />

                            <Typography
                              sx={{
                                maxWidth:
                                  170,
                                overflow:
                                  "hidden",
                                textOverflow:
                                  "ellipsis",
                                whiteSpace:
                                  "nowrap",
                                fontSize:
                                  "12.5px",
                                color:
                                  primaryText,
                              }}
                            >
                              {
                                row.medicineName
                              }
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell
                          sx={{
                            px: 1.5,
                            py: 1.25,
                            borderColor,
                          }}
                        >
                          <Box
                            sx={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 0.7,
                            }}
                          >
                            <StorefrontOutlinedIcon
                              sx={{
                                fontSize:
                                  16,
                                color:
                                  secondaryText,
                                flexShrink: 0,
                              }}
                            />

                            <Typography
                              sx={{
                                maxWidth:
                                  150,
                                overflow:
                                  "hidden",
                                textOverflow:
                                  "ellipsis",
                                whiteSpace:
                                  "nowrap",
                                fontSize:
                                  "12.5px",
                                color:
                                  secondaryText,
                              }}
                            >
                              {
                                row.medicalStore
                              }
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell
                          sx={{
                            px: 1.5,
                            py: 1.25,
                            borderColor,
                            fontSize:
                              "12.5px",
                            fontWeight: 700,
                            color:
                              primaryText,
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {formatCurrency(
                            row.amount
                          )}
                        </TableCell>

                        <TableCell
                          sx={{
                            px: 1.5,
                            py: 1.25,
                            borderColor,
                          }}
                        >
                          <Chip
                            label={formatStatus(
                              row.status
                            )}
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 24,
                              borderRadius:
                                "6px",
                              fontSize:
                                "10.5px",
                              fontWeight: 700,
                              color:
                                chipStyle.color,
                              backgroundColor:
                                chipStyle.backgroundColor,
                              borderColor:
                                chipStyle.borderColor,

                              "& .MuiChip-label":
                                {
                                  px: 1,
                                },
                            }}
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            px: 1.5,
                            py: 1.25,
                            borderColor,
                            fontSize:
                              "12px",
                            color:
                              secondaryText,
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {formatDate(
                            row.invoiceDate
                          )}
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            px: 1.5,
                            py: 1.25,
                            borderColor,
                          }}
                        >
                          {row.status ===
                          "COMPLETED" ? (
                            <Tooltip title="View invoice">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  setSelectedInvoice(
                                    row
                                  )
                                }
                                aria-label={`View invoice for ${row.patientName}`}
                                sx={{
                                  width: 30,
                                  height: 30,
                                  border:
                                    "1px solid",
                                  borderColor,
                                  borderRadius:
                                    "7px",
                                  color:
                                    primary,

                                  "&:hover":
                                    {
                                      borderColor:
                                        primary,
                                      backgroundColor:
                                        theme
                                          .palette
                                          .action
                                          .hover,
                                    },
                                }}
                              >
                                <VisibilityOutlinedIcon
                                  sx={{
                                    fontSize:
                                      17,
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Typography
                              sx={{
                                fontSize:
                                  "12px",
                                color:
                                  theme
                                    .palette
                                    .text
                                    .disabled,
                              }}
                            >
                              —
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  }
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    sx={{
                      borderBottom:
                        0,
                      py: {
                        xs: 6,
                        md: 8,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display:
                          "flex",
                        flexDirection:
                          "column",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        textAlign:
                          "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius:
                            "12px",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          mb: 1.25,
                          backgroundColor:
                            theme
                              .palette
                              .action
                              .hover,
                        }}
                      >
                        <ReceiptLongOutlinedIcon
                          sx={{
                            fontSize:
                              25,
                            color:
                              secondaryText,
                          }}
                        />
                      </Box>

                      <Typography
                        sx={{
                          fontSize:
                            "13px",
                          fontWeight: 700,
                          color:
                            primaryText,
                        }}
                      >
                        {hasFilters
                          ? "No matching requests"
                          : "No medical requests yet"}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.4,
                          maxWidth:
                            320,
                          fontSize:
                            "12px",
                          color:
                            secondaryText,
                        }}
                      >
                        {hasFilters
                          ? "Try changing or clearing your filters."
                          : "Your medical requests will appear here once they are created."}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {!loading &&
          filteredRows.length >
            PAGE_SIZE && (
            <Box
              sx={{
                px: 1.5,
                py: 1.25,
                borderTop:
                  "1px solid",
                borderColor,
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
                backgroundColor:
                  surface,
              }}
            >
              <Typography
                sx={{
                  fontSize:
                    "11.5px",
                  color:
                    secondaryText,
                }}
              >
                Showing{" "}
                {(tablePage -
                  1) *
                  PAGE_SIZE +
                  1}
                –
                {Math.min(
                  tablePage *
                    PAGE_SIZE,
                  filteredRows.length
                )}{" "}
                of{" "}
                {
                  filteredRows.length
                }
              </Typography>

              <Pagination
                count={totalPages}
                page={tablePage}
                onChange={(
                  _,
                  value
                ) => {
                  setTablePage(
                    value
                  );
                }}
                size="small"
                color="primary"
                shape="rounded"
                siblingCount={1}
                boundaryCount={1}
                sx={{
                  "& .MuiPaginationItem-root":
                    {
                      fontSize:
                        "11.5px",
                      minWidth: 28,
                      height: 28,
                    },
                }}
              />
            </Box>
          )}
      </Box>

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