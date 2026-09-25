"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import HistoryIcon from "@mui/icons-material/History";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import CustomToolbar from "../../../doctorReceptionist/components/CustomToolbar";

export default function AppointmentTable({
  patients,
  loading,
  pagination,
  setPagination,
  roleId,
  onStart,
  onViewDetails,
  onViewMedicalDetails,
  onViewHistory,
  medicalDetailsLoading,
}) {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleDetails = () => {
    if (!selectedRow) return;

    const row = selectedRow;
    handleMenuClose();
    onViewDetails(row);
  };

  const handleMedical = () => {
    if (!selectedRow) return;

    const row = selectedRow;
    handleMenuClose();
    onViewMedicalDetails(row);
  };

  const handleHistory = () => {
    if (!selectedRow) return;

    const row = selectedRow;
    handleMenuClose();
    onViewHistory(row);
  };

  const columns = useMemo(() => {
    const data = [
      {
        field: "name",
        headerName: "Name",
        minWidth: 160,
        flex: 1,
      },
      {
        field: "date",
        headerName: "Date",
        minWidth: 130,
        flex: 0.8,
      },
      {
        field: "time",
        headerName: "Time",
        minWidth: 120,
        flex: 0.7,
      },
      {
        field: "mode",
        headerName: "Mode",
        minWidth: 110,
        flex: 0.7,
        renderCell: (params) => (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                textTransform: "capitalize",
                color: theme.palette.text.primary,
                lineHeight: 1.2,
              }}
            >
              {params.value || "Not provided"}
            </Typography>
          </Box>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 130,
        flex: 0.8,
        renderCell: (params) => {
          const value = String(
            params.value || ""
          ).toLowerCase();

          const statusStyles = {
            pending: {
              bgcolor: "#FFF6DD",
              color: "#A66B00",
            },
            in_progress: {
              bgcolor: "#EDF7F2",
              color: theme.palette.primary.main,
            },
            completed: {
              bgcolor: "#EDF7F2",
              color: theme.palette.primary.main,
            },
            cancelled: {
              bgcolor: "#FDECEC",
              color: theme.palette.error.main,
            },
          };

          const currentStyle =
            statusStyles[value] || {
              bgcolor: theme.palette.background.default,
              color: theme.palette.text.secondary,
            };

          return (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                width: "fit-content",
                px: 1,
                py: 0.35,
                borderRadius: 1,
                fontSize: "12px",
                fontWeight: 600,
                lineHeight: 1.3,
                ...currentStyle,
              }}
            >
              {value
                ? value
                    .replaceAll("_", " ")
                    .replace(/\b\w/g, (char) =>
                      char.toUpperCase()
                    )
                : "Not provided"}
            </Box>
          );
        },
      },
    ];

    if (roleId === 2) {
      data.push({
        field: "action",
        headerName: "Action",
        minWidth: 110,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const appointmentStatus =
            params.row.status?.toLowerCase();

          const label =
            appointmentStatus === "in_progress"
              ? "Continue"
              : appointmentStatus === "completed"
              ? "View"
              : "Start";

          return (
            <Button
              variant="contained"
              size="small"
              onClick={() => onStart(params.row)}
              sx={{
                minWidth: 70,
                height: 30,
                px: 1.25,
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 1.25,
                boxShadow: "none",
                bgcolor: theme.palette.primary.main,
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                  boxShadow: "none",
                },
              }}
            >
              {label}
            </Button>
          );
        },
      });
    }

    data.push({
      field: "details",
      headerName: "Details",
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(event) =>
            handleMenuOpen(event, params.row)
          }
          sx={{
            width: 30,
            height: 30,
            color: theme.palette.text.secondary,
            "&:hover": {
              bgcolor: theme.palette.background.default,
              color: theme.palette.primary.main,
            },
          }}
        >
          <MoreVertIcon sx={{ fontSize: 19 }} />
        </IconButton>
      ),
    });

    return data;
  }, [roleId, theme, onStart]);

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      <DataGrid
        rows={patients}
        columns={columns}
        loading={loading}
        autoHeight
        pageSizeOptions={[5, 10, 20]}
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
        slots={{
          toolbar: CustomToolbar,
        }}
        disableRowSelectionOnClick
        sx={{
          minWidth: 760,
          border: 0,
          borderRadius: 0,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          "& .MuiDataGrid-toolbarContainer": {
            minHeight: 0,
            p: 0,
          },
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: "#F8FAF9",
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          "& .MuiDataGrid-columnHeader": {
            bgcolor: "#F8FAF9",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "13px",
            fontWeight: 600,
            color: theme.palette.text.primary,
          },
          "& .MuiDataGrid-cell": {
            fontSize: "13px",
            borderColor: theme.palette.divider,
          },
          "& .MuiDataGrid-row": {
            bgcolor: theme.palette.background.paper,
          },
          "& .MuiDataGrid-row:hover": {
            bgcolor: "#F8FAF9",
          },
          "& .MuiDataGrid-footerContainer": {
            minHeight: 48,
            borderTop: `1px solid ${theme.palette.divider}`,
          },
          "& .MuiTablePagination-root": {
            fontSize: "12px",
            color: theme.palette.text.secondary,
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            {
              fontSize: "12px",
            },
          "& .MuiDataGrid-overlayWrapper": {
            minHeight: 150,
          },
        }}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            minWidth: 170,
            mt: 0.5,
            borderRadius: 1.5,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          },
        }}
      >
        <MenuItem
          onClick={handleDetails}
          sx={{
            minHeight: 36,
            gap: 1,
            fontSize: "12.5px",
          }}
        >
          <VisibilityOutlinedIcon
            sx={{
              fontSize: 17,
              color: theme.palette.primary.main,
            }}
          />
          View Details
        </MenuItem>

        <MenuItem
          onClick={handleMedical}
          disabled={medicalDetailsLoading}
          sx={{
            minHeight: 36,
            gap: 1,
            fontSize: "12.5px",
          }}
        >
          <LocalPharmacyOutlinedIcon
            sx={{
              fontSize: 17,
              color: theme.palette.success.main,
            }}
          />
          Medical Details
        </MenuItem>

        <MenuItem
          onClick={handleHistory}
          sx={{
            minHeight: 36,
            gap: 1,
            fontSize: "12.5px",
          }}
        >
          <HistoryIcon
            sx={{
              fontSize: 17,
              color: theme.palette.text.secondary,
            }}
          />
          View Past Details
        </MenuItem>
      </Menu>
    </Box>
  );
}