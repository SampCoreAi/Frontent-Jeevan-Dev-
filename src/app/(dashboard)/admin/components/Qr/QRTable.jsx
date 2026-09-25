"use client";

import { useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

export default function QRTable({
  qrData = [],
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  total,
  loading,
  showMessage,
}) {
  const theme = useTheme();
  const [downloadingId, setDownloadingId] = useState(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

    return `${baseUrl}/${imagePath.replace(/^\//, "")}`;
  };

  const handleDownload = async (item) => {
    try {
      if (!item?.qr_image) {
        showMessage?.("QR image not available.", "error");
        return;
      }

      setDownloadingId(item.id);

      const response = await fetch(getImageUrl(item.qr_image));

      if (!response.ok) {
        throw new Error("Unable to download QR.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${item.qr_code}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      showMessage?.(
        error?.message || "QR download failed.",
        "error"
      );
    } finally {
      setDownloadingId(null);
    }
  };

  const columns = [
    {
      field: "qr_code",
      headerName: "QR Code",
      flex: 1.5,
      minWidth: 180,
    },

    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 140,

      renderCell: (params) => {
        const available = params.value === "AVAILABLE";

        return (
          <Chip
            label={available ? "Available" : "Assigned"}
            size="small"
            sx={{
              height: 25,
              fontSize: "11px",
              fontWeight: 600,
              borderRadius: 1,

              color: available
                ? theme.palette.success.main
                : theme.palette.primary.main,

              bgcolor: available
                ? `${theme.palette.success.main}12`
                : `${theme.palette.primary.main}12`,
            }}
          />
        );
      },
    },

    {
      field: "doctor_user_id",
      headerName: "Doctor ID",
      flex: 1,
      minWidth: 140,

      valueGetter: (value) => value ?? "Not assigned",
    },

    {
      field: "action",
      headerName: "Action",
      width: 110,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",

      renderCell: (params) => {
        const downloading =
          downloadingId === params.row.id;

        return (
          <Tooltip
            title={
              downloading
                ? "Downloading..."
                : "Download QR"
            }
          >
            <span>
              <IconButton
                size="small"
                disabled={
                  downloading || !params.row.qr_image
                }
                onClick={() =>
                  handleDownload(params.row)
                }
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 1.2,
                  color: "primary.main",
                  bgcolor: `${theme.palette.primary.main}10`,

                  "&:hover": {
                    bgcolor: `${theme.palette.primary.main}18`,
                  },
                }}
              >
                {downloading ? (
                  <CircularProgress
                    size={16}
                    color="inherit"
                  />
                ) : (
                  <DownloadRoundedIcon
                    sx={{ fontSize: 18 }}
                  />
                )}
              </IconButton>
            </span>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <DataGrid
        rows={qrData}
        columns={columns}

        loading={loading}

        rowCount={total}

        paginationMode="server"

        paginationModel={{
          page,
          pageSize: rowsPerPage,
        }}

        onPaginationModelChange={(model) => {
          if (model.pageSize !== rowsPerPage) {
            setRowsPerPage(model.pageSize);
            setPage(0);
            return;
          }

          setPage(model.page);
        }}

        pageSizeOptions={[5, 10, 20]}

        disableRowSelectionOnClick

       sx={{
  border: 0,

  // =========================
  // COLUMN HEADER
  // =========================
  "& .MuiDataGrid-columnHeaders": {
    bgcolor: "action.hover",
    borderBottom: "1px solid",
    borderColor: "divider",
  },

  "& .MuiDataGrid-columnHeader": {
    bgcolor: "action.hover",

    "&:focus": {
      outline: "none",
    },

    "&:focus-within": {
      outline: "none",
    },
  },

  "& .MuiDataGrid-columnHeaderTitle": {
    fontSize: "12px",
    fontWeight: 700,
    color: "text.secondary",
  },

  // =========================
  // 3 DOT MENU ALWAYS SHOW
  // =========================
  "& .MuiDataGrid-menuIcon": {
    visibility: "visible !important",
    width: "auto !important",
    opacity: "1 !important",
  },

  "& .MuiDataGrid-menuIconButton": {
    opacity: "1 !important",
    visibility: "visible !important",

    width: 28,
    height: 28,
    borderRadius: 1,

    color: "text.secondary",

    "&:hover": {
      bgcolor: "action.selected",
      color: "primary.main",
    },
  },

  // =========================
  // SORT ICON
  // =========================
  "& .MuiDataGrid-sortIcon": {
    opacity: "1 !important",
    color: "text.secondary",
  },

  // =========================
  // CELLS
  // =========================
  "& .MuiDataGrid-cell": {
    fontSize: "13px",
    color: "text.primary",
    borderColor: "divider",

    "&:focus": {
      outline: "none",
    },

    "&:focus-within": {
      outline: "none",
    },
  },

  // =========================
  // ROW
  // =========================
  "& .MuiDataGrid-row": {
    "&:hover": {
      bgcolor: "action.hover",
    },
  },

  // =========================
  // FOOTER
  // =========================
  "& .MuiDataGrid-footerContainer": {
    minHeight: 52,
    borderTop: "1px solid",
    borderColor: "divider",
  },

  "& .MuiTablePagination-root": {
    color: "text.secondary",
  },

  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
    {
      fontSize: "12px",
    },

  // =========================
  // REMOVE DEFAULT BLUE OUTLINE
  // =========================
  "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus":
    {
      outline: "none",
    },
}}
      />
    </Box>
  );
}