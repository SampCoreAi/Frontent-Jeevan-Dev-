"use client";

import { useMemo } from "react";
import {
  Box,
  Chip,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

/* =========================================================
   INPUT STYLES
========================================================= */

const baseInputStyle = {
  width: "100%",

  "& .MuiInputBase-root": {
    width: "100%",
    height: 36,
    px: 0.7,
    borderRadius: "5px",
    fontSize: "11.5px",
    transition: "0.15s",
    bgcolor: "transparent",
  },

  "& .MuiInputBase-root:hover": {
    bgcolor: "#F8FAFC",
  },

  "& .MuiInputBase-root.Mui-focused": {
    bgcolor: "#FFFFFF",
    boxShadow: "0 0 0 1px #07876A",
  },

  "& .MuiInputBase-root.Mui-disabled": {
    bgcolor: "transparent",
  },

  "& input": {
    p: 0,
    color: "#172033",
    fontWeight: 500,
  },

  "& input::placeholder": {
    color: "#94A3B8",
    opacity: 1,
  },
};

const numberInputStyle = {
  ...baseInputStyle,

  "& input": {
    p: 0,
    textAlign: "right",
    fontWeight: 600,
    color: "#172033",
  },

  "& input::-webkit-inner-spin-button": {
    display: "none",
  },

  "& input::-webkit-outer-spin-button": {
    display: "none",
  },
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function MedicineBillingTable({
  invoiceLines = [],
  onUpdateLine = () => {},
  onRemoveLine = () => {},
}) {
  const columns = useMemo(() => {
    const editableColumn = (field, headerName, width, type = "text", inputProps = {}) => ({
      field,
      headerName,
      width,
      minWidth: 75,
      sortable: false,
      renderCell: ({ row }) => (
        <TextField
          type={type}
          value={row[field] ?? ""}
          onChange={(event) =>
            onUpdateLine(row._lineIndex, field, event.target.value)
          }
          placeholder={field === "medicine_name" ? "Medicine name" : ""}
          variant="standard"
          fullWidth
          InputProps={{ disableUnderline: true }}
          inputProps={inputProps}
          sx={type === "number" ? numberInputStyle : baseInputStyle}
        />
      ),
    });

    return [
      editableColumn("medicine_name", "MEDICINE", 120),
      editableColumn("dose", "DOSE", 60),
      editableColumn("batch_number", "BATCH", 100),
      editableColumn("expiry_date", "EXPIRY", 135, "date"),
      editableColumn("quantity", "QTY", 10, "number", { min: 1 }),
      editableColumn("unit_price", "UNIT PRICE", 80, "number", {
        min: 0,
        step: "0.01",
      }),
      editableColumn("gst_rate", "GST %", 50, "number", {
        min: 0,
        max: 100,
      }),
      {
        field: "amount",
        headerName: "AMOUNT",
        width: 100,
        minWidth: 100,
        sortable: false,
        renderCell: ({ value }) => (
          <Typography
            sx={{
              width: "100%",
              textAlign: "right",
              pr: 1,
              color: value > 0 ? "#07876A" : "#94A3B8",
              fontSize: "12px",
              fontWeight: 800,
            }}
          >
            ₹{value.toFixed(2)}
          </Typography>
        ),
      },
      {
        field: "actions",
        headerName: "",
        width: 14,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: ({ row }) => (
          <IconButton
            size="small"
            onClick={() => onRemoveLine(row._lineIndex)}
            aria-label="Remove medicine"
            title="Remove medicine"
            sx={{
              width: 30,
              height: 30,
              color: "#DC2626",
              "&:hover": { bgcolor: "#FEF2F2" },
            }}
          >
            <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        ),
      },
    ];
  }, [onRemoveLine, onUpdateLine]);

  const rows = invoiceLines.map((line, index) => {
    const quantity = Number(line.quantity || 0);
    const price = Number(line.unit_price || 0);
    const gst = Number(line.gst_rate || 0);
    const subtotal = quantity * price;

    return {
      ...line,
      id: line._rowId || index,
      _lineIndex: index,
      amount: subtotal + (subtotal * gst) / 100,
    };
  });

  /* ---------- GRAND TOTAL ---------- */

  const calculatedAmount = invoiceLines.reduce((total, line) => {
    const quantity = Number(line.quantity || 0);
    const price = Number(line.unit_price || 0);
    const gst = Number(line.gst_rate || 0);

    const subtotal = quantity * price;
    const gstAmount = (subtotal * gst) / 100;

    return total + subtotal + gstAmount;
  }, 0);

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        border: "1px solid #CBD5E1",
        borderRadius: "9px",
        overflow: "hidden",
      }}
    >
      {/* ================= TITLE BAR ================= */}

      <Box
        sx={{
          px: 1.5,
          py: 1.1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#172033",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            Medicine &amp; Billing Details
          </Typography>

          <Typography
            sx={{
              mt: 0.15,
              color: "#64748B",
              fontSize: "10.5px",
            }}
          >
            "Edit fields directly; drag column edges to resize"
          </Typography>
        </Box>

        <Chip
          size="small"
          label={`${invoiceLines.length} item(s)`}
          sx={{
            height: 24,
            bgcolor: "#F1F5F9",
            color: "#475569",
            borderRadius: "5px",
            fontSize: "10px",
            fontWeight: 700,
          }}
        />
      </Box>

      {/* ================= TABLE ================= */}

      <Box sx={{ width: "100%", overflowX: "auto" }}>
     <DataGrid
  rows={rows}
  columns={columns}
  autoHeight
  rowHeight={46}
  columnHeaderHeight={38}
  disableColumnResize={false}
  disableRowSelectionOnClick
  disableColumnMenu
  hideFooter

sx={{
  width: "100%",
  border: 0,
  borderRadius: 0,

    "& .MuiDataGrid-columnHeaders": {
      bgcolor: "#F1F5F9",
      borderBottom: "1px solid #CBD5E1",
    },

    "& .MuiDataGrid-columnHeaderTitle": {
      color: "#475569",
      fontSize: "9.5px",
      fontWeight: 800,
      letterSpacing: ".3px",
    },

    /* CELL */
    "& .MuiDataGrid-cell": {
      px: 0.8,
      py: 0,
      borderColor: "#E2E8F0",
      display: "flex",
      alignItems: "center",
    },

    /* INPUT */
    "& .MuiDataGrid-cell .MuiInputBase-root": {
      height: 34,
      margin: 0,
    },

    /* AMOUNT */
    "& .MuiDataGrid-cell .MuiTypography-root": {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      height: "100%",
    },

    /* DELETE */
    "& .MuiDataGrid-cell .MuiIconButton-root": {
      margin: 0,
      alignSelf: "center",
    },

    "& .MuiDataGrid-row:hover": {
      bgcolor: "#F8FFFC",
    },

    "& .MuiDataGrid-overlay": {
      color: "#94A3B8",
      fontSize: "12px",
    },
  }}
  localeText={{
    noRowsLabel: "No medicines added yet",
  }}
/>
      </Box>

      {/* ================= TOTAL ================= */}

      <Box
        sx={{
          px: 2,
          py: 1.2,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 3,
          bgcolor: "#F8FAFC",
          borderTop: "1px solid #CBD5E1",
        }}
      >
        <Typography
          sx={{
            color: "#64748B",
            fontSize: "10.5px",
            fontWeight: 700,
          }}
        >
          TOTAL
        </Typography>

        <Typography
          sx={{
            color: "#07876A",
            fontSize: "15px",
            fontWeight: 800,
          }}
        >
          ₹{calculatedAmount.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
}