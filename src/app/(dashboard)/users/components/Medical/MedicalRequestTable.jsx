"use client";

import {
  Box,
  Chip,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

const PAGE_SIZE = 8;

// ======================================================
// HELPERS
// ======================================================

const formatCurrency = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatStatus = (status = "") =>
  status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") => {
  const parts = String(name).trim().split(" ").filter(Boolean);

  if (!parts.length) return "P";

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
};

// ======================================================
// COMPONENT
// ======================================================

export default function MedicalRequestTable({
  rows = [],
  loading = false,
  tablePage = 1,
  hasFilters = false,
  onViewInvoice,
}) {
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  const surface = theme.palette.background.paper;
  const primaryText = theme.palette.text.primary;
  const secondaryText = theme.palette.text.secondary;
  const borderColor = isDark ? theme.palette.divider : "#E5ECE9";

  const pageBackground = isDark
    ? theme.palette.background.default
    : "#F8FAF9";

  const primary = "#07876A";

  // ======================================================
  // STATUS STYLE
  // ======================================================

  const statusStyle = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          color: "#15803D",
          backgroundColor: "#F0FDF4",
          borderColor: "#BBF7D0",
          dot: "#22C55E",
        };

      case "READY_FOR_PICKUP":
        return {
          color: "#0369A1",
          backgroundColor: "#F0F9FF",
          borderColor: "#BAE6FD",
          dot: "#0EA5E9",
        };

      case "PROCESSING":
        return {
          color: "#7C3AED",
          backgroundColor: "#F5F3FF",
          borderColor: "#DDD6FE",
          dot: "#8B5CF6",
        };

      case "APPROVED":
        return {
          color: "#047857",
          backgroundColor: "#ECFDF5",
          borderColor: "#A7F3D0",
          dot: "#10B981",
        };

      case "REJECTED":
      case "CANCELLED":
        return {
          color: "#B91C1C",
          backgroundColor: "#FEF2F2",
          borderColor: "#FECACA",
          dot: "#EF4444",
        };

      default:
        return {
          color: "#B45309",
          backgroundColor: "#FFFBEB",
          borderColor: "#FDE68A",
          dot: "#F59E0B",
        };
    }
  };

  // ======================================================
  // COMMON STYLES
  // ======================================================

  const cellSx = {
    px: 2,
    py: 1.45,
    borderBottom: "1px solid",
    borderColor,
    verticalAlign: "middle",
  };

  const ellipsisSx = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: surface,
        border: "1px solid",
        borderColor,
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: isDark
          ? "none"
          : "0 1px 2px rgba(15, 23, 42, 0.02)",
      }}
    >
      <TableContainer
        sx={{
          width: "100%",
          overflowX: "auto",

          "&::-webkit-scrollbar": {
            height: 6,
          },

          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },

          "&::-webkit-scrollbar-thumb": {
            backgroundColor: isDark ? "#475569" : "#D6E2DE",
            borderRadius: 10,
          },
        }}
      >
        <Table
          size="small"
          sx={{
            minWidth: 950,
            tableLayout: "auto",
          }}
        >
          {/* ==================================================
              HEADER
          ================================================== */}

       <TableHead>
  <TableRow
    sx={{
      backgroundColor: isDark ? theme.palette.background.default : "#F4F8F6",
    }}
  >
    {[
      "#",
      "Patient",
      "Medicine",
      "Medical Store",
      "Amount",
      "Status",
      "Date",
      "Action",
    ].map((column) => (
      <TableCell
        key={column}
        align={column === "Action" ? "center" : "left"}
        sx={{
          px: 2,
          py: 1.6,
          height: 46,

          borderBottom: "1px solid",
          borderColor: isDark ? theme.palette.divider : "#DDE9E5",

          color: isDark ? theme.palette.text.secondary : "#52615D",

          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.045em",
          whiteSpace: "nowrap",
        }}
      >
        {column}
      </TableCell>
    ))}
  </TableRow>
</TableHead>

          {/* ==================================================
              BODY
          ================================================== */}

          <TableBody>
            {/* ==================================================
                LOADING
            ================================================== */}

            {loading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: 8 }).map((_, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      sx={{
                        ...cellSx,
                        py: 1.7,
                      }}
                    >
                      <Skeleton
                        variant="rounded"
                        width={
                          cellIndex === 0
                            ? 20
                            : cellIndex === 7
                              ? 30
                              : "75%"
                        }
                        height={cellIndex === 7 ? 30 : 12}
                        sx={{
                          borderRadius: "5px",
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length > 0 ? (
              // ==================================================
              // ROWS
              // ==================================================

              rows.map((row, index) => {
                const chipStyle = statusStyle(row.status);

                return (
                  <TableRow
                    key={row.id || index}
                    sx={{
                      transition:
                        "background-color 0.18s ease, box-shadow 0.18s ease",

                      "&:hover": {
                        backgroundColor: isDark
                          ? theme.palette.action.hover
                          : "#FBFDFC",
                      },

                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    {/* ==================================================
                        NUMBER
                    ================================================== */}

                    <TableCell
                      sx={{
                        ...cellSx,
                        width: 50,

                        fontSize: "12px",
                        fontWeight: 600,

                        color: secondaryText,
                      }}
                    >
                      {(tablePage - 1) * PAGE_SIZE + index + 1}
                    </TableCell>

                    {/* ==================================================
                        PATIENT
                    ================================================== */}

                    <TableCell
                      sx={{
                        ...cellSx,
                        minWidth: 200,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.15,
                        }}
                      >
                        {/* Avatar */}

                        <Box
                          sx={{
                            width: 36,
                            height: 36,

                            borderRadius: "9px",

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            flexShrink: 0,

                            fontSize: "11px",
                            fontWeight: 800,

                            color: primary,

                            backgroundColor: isDark
                              ? "rgba(7,135,106,0.14)"
                              : "#EDF8F5",

                            border: "1px solid",

                            borderColor: isDark
                              ? "rgba(7,135,106,0.25)"
                              : "#D9EFE9",
                          }}
                        >
                          {getInitials(row.patientName)}
                        </Box>

                        {/* Patient details */}

                        <Box
                          sx={{
                            minWidth: 0,
                          }}
                        >
                          <Tooltip
                            title={row.patientName || ""}
                            placement="top"
                            arrow
                          >
                            <Typography
                              sx={{
                                ...ellipsisSx,

                                maxWidth: 160,

                                fontSize: "12.5px",
                                fontWeight: 700,

                                color: primaryText,
                                lineHeight: 1.35,
                              }}
                            >
                              {row.patientName || "Unknown Patient"}
                            </Typography>
                          </Tooltip>

                          <Typography
                            sx={{
                              mt: 0.3,

                              fontSize: "10.8px",
                              fontWeight: 500,

                              color: secondaryText,
                              lineHeight: 1.3,
                            }}
                          >
                            {row.age > 0 ? `${row.age} yrs` : "Age N/A"}

                            <Box
                              component="span"
                              sx={{
                                mx: 0.65,
                                color: theme.palette.text.disabled,
                              }}
                            >
                              •
                            </Box>

                            {row.gender || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* ==================================================
                        MEDICINE
                    ================================================== */}

                    <TableCell
                      sx={{
                        ...cellSx,
                        minWidth: 170,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.9,
                        }}
                      >
                        <Box
                          sx={{
                            width: 28,
                            height: 28,

                            borderRadius: "7px",

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            flexShrink: 0,

                            backgroundColor: isDark
                              ? theme.palette.action.hover
                              : "#F6F8F7",
                          }}
                        >
                          <MedicationOutlinedIcon
                            sx={{
                              fontSize: 15,
                              color: secondaryText,
                            }}
                          />
                        </Box>

                        <Tooltip
                          title={row.medicineName || ""}
                          placement="top"
                          arrow
                        >
                          <Typography
                            sx={{
                              ...ellipsisSx,

                              maxWidth: 160,

                              fontSize: "12px",
                              fontWeight: 600,

                              color: primaryText,
                            }}
                          >
                            {row.medicineName || "—"}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </TableCell>

                    {/* ==================================================
                        MEDICAL STORE
                    ================================================== */}

                    <TableCell
                      sx={{
                        ...cellSx,
                        minWidth: 180,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.9,
                        }}
                      >
                        <Box
                          sx={{
                            width: 28,
                            height: 28,

                            borderRadius: "7px",

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            flexShrink: 0,

                            backgroundColor: isDark
                              ? theme.palette.action.hover
                              : "#F6F8F7",
                          }}
                        >
                          <StorefrontOutlinedIcon
                            sx={{
                              fontSize: 15,
                              color: secondaryText,
                            }}
                          />
                        </Box>

                        <Tooltip
                          title={row.medicalStore || ""}
                          placement="top"
                          arrow
                        >
                          <Typography
                            sx={{
                              ...ellipsisSx,

                              maxWidth: 155,

                              fontSize: "12px",
                              fontWeight: 500,

                              color: secondaryText,
                            }}
                          >
                            {row.medicalStore || "—"}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </TableCell>

                    {/* ==================================================
                        AMOUNT
                    ================================================== */}

                    <TableCell
                      sx={{
                        ...cellSx,

                        minWidth: 110,

                        fontSize: "12.5px",
                        fontWeight: 700,

                        color: primaryText,

                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatCurrency(row.amount)}
                    </TableCell>

                    {/* ==================================================
                        STATUS
                    ================================================== */}

                    <TableCell
                      sx={{
                        ...cellSx,
                        minWidth: 130,
                      }}
                    >
                      <Chip
                        icon={
                          <Box
                            component="span"
                            sx={{
                              width: 6,
                              height: 6,

                              borderRadius: "50%",

                              backgroundColor: chipStyle.dot,

                              ml: "8px !important",
                            }}
                          />
                        }
                        label={formatStatus(row.status)}
                        size="small"
                        variant="outlined"
                        sx={{
                          height: 25,

                          borderRadius: "6px",

                          fontSize: "10px",
                          fontWeight: 700,

                          color: chipStyle.color,

                          backgroundColor: chipStyle.backgroundColor,

                          borderColor: chipStyle.borderColor,

                          "& .MuiChip-label": {
                            px: 0.9,
                          },

                          "& .MuiChip-icon": {
                            mr: -0.2,
                          },
                        }}
                      />
                    </TableCell>

                    {/* ==================================================
                        DATE
                    ================================================== */}

                    <TableCell
                      sx={{
                        ...cellSx,

                        minWidth: 115,

                        fontSize: "11.5px",
                        fontWeight: 500,

                        color: secondaryText,

                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(row.invoiceDate)}
                    </TableCell>

                    {/* ==================================================
                        ACTION
                    ================================================== */}

                    <TableCell
                      align="center"
                      sx={{
                        ...cellSx,
                        width: 80,
                      }}
                    >
                      {row.status === "COMPLETED" ? (
                        <Tooltip title="View invoice" arrow>
                          <IconButton
                            size="small"
                            onClick={() => onViewInvoice?.(row)}
                            aria-label={`View invoice for ${
                              row.patientName || "patient"
                            }`}
                            sx={{
                              width: 32,
                              height: 32,

                              borderRadius: "8px",

                              color: primary,

                              border: "1px solid",
                              borderColor: isDark
                                ? theme.palette.divider
                                : "#DCE8E4",

                              backgroundColor: isDark
                                ? "transparent"
                                : "#FFFFFF",

                              transition: "all 0.18s ease",

                              "&:hover": {
                                color: "#FFFFFF",

                                borderColor: primary,

                                backgroundColor: primary,

                                boxShadow:
                                  "0 3px 8px rgba(7,135,106,0.18)",
                              },
                            }}
                          >
                            <VisibilityOutlinedIcon
                              sx={{
                                fontSize: 17,
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: theme.palette.text.disabled,
                          }}
                        >
                          —
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              // ==================================================
              // EMPTY STATE
              // ==================================================

              <TableRow>
                <TableCell
                  colSpan={8}
                  sx={{
                    borderBottom: 0,

                    py: {
                      xs: 7,
                      md: 9,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",

                      alignItems: "center",
                      justifyContent: "center",

                      textAlign: "center",
                    }}
                  >
                    {/* Empty Icon */}

                    <Box
                      sx={{
                        width: 58,
                        height: 58,

                        borderRadius: "14px",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        mb: 1.5,

                        color: primary,

                        backgroundColor: isDark
                          ? "rgba(7,135,106,0.12)"
                          : "#F0F8F6",

                        border: "1px solid",

                        borderColor: isDark
                          ? "rgba(7,135,106,0.18)"
                          : "#E0EFEB",
                      }}
                    >
                      <ReceiptLongOutlinedIcon
                        sx={{
                          fontSize: 27,
                        }}
                      />
                    </Box>

                    {/* Title */}

                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 700,

                        color: primaryText,
                      }}
                    >
                      {hasFilters
                        ? "No matching requests"
                        : "No medical requests yet"}
                    </Typography>

                    {/* Description */}

                    <Typography
                      sx={{
                        mt: 0.5,

                        maxWidth: 340,

                        fontSize: "11.5px",
                        lineHeight: 1.6,

                        color: secondaryText,
                      }}
                    >
                      {hasFilters
                        ? "No requests match your current filters. Try changing or clearing them."
                        : "Medical requests will appear here once a prescription is assigned to a medical store."}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}