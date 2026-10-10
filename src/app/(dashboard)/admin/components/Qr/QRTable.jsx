"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";

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
  const apiRef = useGridApiRef();

  const [downloadingId, setDownloadingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    const baseUrl = process.env.NEXT_PUBLIC_S3_BUCKET_URL?.replace(
      /\/$/,
      ""
    );

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
      link.remove();

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

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return qrData.filter((row) => {
      const searchMatch =
        !query ||
        String(row.qr_code || "")
          .toLowerCase()
          .includes(query);

      const statusMatch =
        statusFilter === "ALL" ||
        row.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [qrData, search, statusFilter]);

  const renderHeader = (field, title) => (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 0.5,
      }}
    >
      <Box component="span">{title}</Box>

      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          apiRef.current.showColumnMenu(field);
        }}
        sx={{
          width: 26,
          height: 26,
          p: 0,
          color: "text.secondary",
          borderRadius: 1,
          "&:hover": {
            bgcolor: "action.selected",
            color: "primary.main",
          },
        }}
      >
        <MoreVertIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );

  const columns = [
    {
      field: "qr_code",
      headerName: "QR Code",
      flex: 1.5,
      minWidth: 190,
      renderHeader: () => renderHeader("qr_code", "QR Code"),
    },

    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 140,
      renderHeader: () => renderHeader("status", "Status"),
      renderCell: ({ value }) => {
        const available = value === "AVAILABLE";

        return (
          <Chip
            label={available ? "Available" : "Assigned"}
            size="small"
            sx={{
              height: 26,
              px: 0.5,
              fontSize: "11px",
              fontWeight: 600,
              borderRadius: 1.5,
              color: available
                ? "success.main"
                : "primary.main",
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
      renderHeader: () =>
        renderHeader("doctor_user_id", "Doctor ID"),
      valueGetter: (value) => value ?? "Not assigned",
    },

    {
      field: "action",
      headerName: "Action",
      width: 100,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderHeader: () => renderHeader("action", "Action"),
      renderCell: ({ row }) => {
        const downloading = downloadingId === row.id;

        return (
          <Tooltip
            title={
              downloading ? "Downloading..." : "Download QR"
            }
          >
            <span>
              <IconButton
                size="small"
                disabled={downloading || !row.qr_image}
                onClick={() => handleDownload(row)}
                sx={{
                  width: 35,
                  height: 35,
                  borderRadius: 1.5,
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
                  <DownloadRoundedIcon sx={{ fontSize: 18 }} />
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
      <Box
        sx={{
          p: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          flexWrap: "wrap",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <TextField
          size="small"
          placeholder="Search QR code..."
          value={search}
          onChange={handleSearch}
          slotProps={{
            input: {
              startAdornment: (
                <SearchIcon
                  sx={{
                    mr: 0.8,
                    fontSize: 19,
                    color: "text.secondary",
                  }}
                />
              ),
            },
          }}
          sx={{
            width: { xs: "100%", sm: 280 },
            "& .MuiOutlinedInput-root": {
              height: 38,
              borderRadius: 1.5,
              fontSize: "12.5px",
            },
          }}
        />

        <Select
          size="small"
          value={statusFilter}
          onChange={handleStatusFilter}
          sx={{
            minWidth: 140,
            height: 38,
            borderRadius: 1.5,
            fontSize: "12.5px",
          }}
        >
          <MenuItem value="ALL">All Status</MenuItem>
          <MenuItem value="AVAILABLE">Available</MenuItem>
          <MenuItem value="ASSIGNED">Assigned</MenuItem>
        </Select>
      </Box>

      <DataGrid
        apiRef={apiRef}
        rows={filteredRows}
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

          "& .MuiDataGrid-columnHeaders": {
            minHeight: 48,
            maxHeight: 48,
            bgcolor: "action.hover",
            borderBottom: "1px solid",
            borderColor: "divider",
          },

          "& .MuiDataGrid-columnHeader": {
            bgcolor: "action.hover",
            px: 1.5,

            "&:focus, &:focus-within": {
              outline: "none",
            },

            "& .MuiDataGrid-iconButtonContainer": {
              display: "none !important",
            },

            "& .MuiDataGrid-sortIcon": {
              display: "none !important",
            },

            "& .MuiDataGrid-menuIcon": {
              display: "none !important",
            },
          },

          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "12px",
            fontWeight: 700,
            color: "text.secondary",
          },

          "& .MuiDataGrid-cell": {
            fontSize: "13px",
            color: "text.primary",
            borderColor: "divider",
            px: 1.5,

            "&:focus, &:focus-within": {
              outline: "none",
            },
          },

          "& .MuiDataGrid-row": {
            minHeight: 54,

            "&:hover": {
              bgcolor: "action.hover",
            },
          },

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

          "& .MuiDataGrid-overlayWrapper": {
            bgcolor: "background.paper",
          },
        }}
      />
    </Box>
  );
}