"use client";

import React, { useState } from "react";
import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Typography,
  useTheme,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

const RegistrationTable = ({
  registrations = [],
  loading = false,

  page,
  setPage,

  rowsPerPage,
  setRowsPerPage,

  total,

  search,
  setSearch,

  status,
  setStatus,

  sortModel,
  setSortModel,

  onViewDocuments,
}) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // =========================
  // ACTION MENU
  // =========================

  const handleMenuOpen = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleViewDocuments = () => {
    if (selectedRow) {
      onViewDocuments?.(selectedRow);
    }

    handleMenuClose();
  };

  // =========================
  // STATUS STYLE
  // =========================

  const getStatusStyle = (value) => {
    switch (value) {
      case "VERIFIED":
        return {
          color: theme.palette.success.main,
          bgcolor: `${theme.palette.success.main}12`,
        };

      case "SUBMITTED":
        return {
          color: theme.palette.info.main,
          bgcolor: `${theme.palette.info.main}12`,
        };

      case "DRAFT":
        return {
          color: theme.palette.warning.main,
          bgcolor: `${theme.palette.warning.main}12`,
        };

      case "REJECTED":
        return {
          color: theme.palette.error.main,
          bgcolor: `${theme.palette.error.main}12`,
        };

      default:
        return {
          color: theme.palette.text.secondary,
          bgcolor: theme.palette.action.hover,
        };
    }
  };

  // =========================
  // COLUMNS
  // =========================

  const columns = [
    // SERIAL NUMBER
    {
      field: "serialNumber",
      headerName: "S.NO",
      width: 75,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,

      align: "center",
      headerAlign: "center",

      renderCell: (params) => {
        const rowIndex = registrations.findIndex(
          (item) => item.id === params.row.id
        );

        return (
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "text.secondary",
            }}
          >
            {page * rowsPerPage + rowIndex + 1}
          </Typography>
        );
      },
    },

    // DOCTOR
    {
      field: "full_name",
      headerName: "DOCTOR",
      minWidth: 170,
      flex: 1,

      align: "center",
      headerAlign: "center",

      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          {params.value || "-"}
        </Typography>
      ),
    },

    // CONTACT
    {
      field: "mobile",
      headerName: "CONTACT",
      minWidth: 135,
      flex: 0.8,

      sortable: false,

      align: "center",
      headerAlign: "center",

      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: "12px",
            color: "text.primary",
          }}
        >
          {params.value || "-"}
        </Typography>
      ),
    },

    // REGISTRATION
    {
      field: "medical_registration_number",
      headerName: "REGISTRATION NO.",
      minWidth: 190,
      flex: 1.1,

      sortable: false,

      align: "center",
      headerAlign: "center",

      renderCell: (params) => (
        <Typography
          noWrap
          sx={{
            maxWidth: "100%",
            fontSize: "12px",
            color: "text.primary",
          }}
        >
          {params.value || "-"}
        </Typography>
      ),
    },

    // AGE
    {
      field: "age",
      headerName: "AGE",
      width: 90,

      sortable: false,

      align: "center",
      headerAlign: "center",

      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: "12px",
            color: "text.primary",
          }}
        >
          {params.value ?? "-"}
        </Typography>
      ),
    },

    // QUALIFICATION
    {
      field: "qualification",
      headerName: "QUALIFICATION",
      minWidth: 140,
      flex: 0.8,

      align: "center",
      headerAlign: "center",

      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 500,
            color: "text.primary",
          }}
        >
          {params.value || "-"}
        </Typography>
      ),
    },

    // STATUS
    {
      field: "onboarding_status",
      headerName: "STATUS",
      minWidth: 130,
      flex: 0.7,

      align: "center",
      headerAlign: "center",

      renderCell: (params) => {
        const value = params.value;
        const style = getStatusStyle(value);

        const label = value
          ? value.charAt(0) +
            value.slice(1).toLowerCase()
          : "-";

        return (
          <Chip
            label={label}
            size="small"
            sx={{
              height: 24,
              borderRadius: 1,

              fontSize: "10px",
              fontWeight: 700,

              color: style.color,
              bgcolor: style.bgcolor,

              "& .MuiChip-label": {
                px: 1.2,
              },
            }}
          />
        );
      },
    },

    // ACTION
    {
      field: "action",
      headerName: "",
      width: 65,

      sortable: false,
      filterable: false,
      disableColumnMenu: true,

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
            color: "text.secondary",

            "&:hover": {
              color: "primary.main",
              bgcolor: `${theme.palette.primary.main}10`,
            },
          }}
        >
          <MoreVertRoundedIcon
            sx={{ fontSize: 19 }}
          />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      {/* ================= SEARCH / FILTER ================= */}

      <Box
        sx={{
          mb: 1.5,

          display: "flex",
          alignItems: {
            xs: "stretch",
            sm: "center",
          },

          justifyContent: "space-between",

          flexDirection: {
            xs: "column",
            sm: "row",
          },

          gap: 1.2,
        }}
      >
        {/* SEARCH */}

        <TextField
          size="small"
          value={search}
          placeholder="Search doctor..."
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon
                  sx={{
                    fontSize: 18,
                    color: "text.secondary",
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            width: {
              xs: "100%",
              sm: 300,
            },

            "& .MuiOutlinedInput-root": {
              height: 38,
              borderRadius: 1.5,
              fontSize: "12px",
              bgcolor: "background.paper",
            },
          }}
        />

        {/* STATUS FILTER */}

        <TextField
          select
          size="small"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(0);
          }}
          sx={{
            width: {
              xs: "100%",
              sm: 150,
            },

            "& .MuiOutlinedInput-root": {
              height: 38,
              borderRadius: 1.5,
              fontSize: "12px",
              bgcolor: "background.paper",
            },
          }}
        >
          <MenuItem value="">
            All Status
          </MenuItem>

          <MenuItem value="SUBMITTED">
            Submitted
          </MenuItem>

          <MenuItem value="VERIFIED">
            Verified
          </MenuItem>

          <MenuItem value="DRAFT">
            Draft
          </MenuItem>

          <MenuItem value="REJECTED">
            Rejected
          </MenuItem>
        </TextField>
      </Box>

      {/* ================= TABLE ================= */}

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
          rows={registrations}
          columns={columns}

          loading={loading}

          rowCount={total}

          paginationMode="server"
          sortingMode="server"

          paginationModel={{
            page,
            pageSize: rowsPerPage,
          }}

          onPaginationModelChange={(model) => {
            if (
              model.pageSize !== rowsPerPage
            ) {
              setRowsPerPage(
                model.pageSize
              );

              setPage(0);

              return;
            }

            setPage(model.page);
          }}

          sortModel={sortModel}

          onSortModelChange={(model) => {
            setSortModel(model);
            setPage(0);
          }}

          pageSizeOptions={[
            5,
            10,
            20,
            50,
          ]}

          disableRowSelectionOnClick

          rowHeight={52}
          columnHeaderHeight={44}

          sx={{
            border: 0,

            // HEADER
            "& .MuiDataGrid-columnHeaders":
              {
                bgcolor:
                  "action.hover",

                borderBottom:
                  "1px solid",

                borderColor:
                  "divider",
              },

            "& .MuiDataGrid-columnHeader":
              {
                "&:focus, &:focus-within":
                  {
                    outline: "none",
                  },
              },

            "& .MuiDataGrid-columnHeaderTitle":
              {
                width: "100%",

                fontSize: "10px",
                fontWeight: 700,

                color:
                  "text.secondary",
              },

            // COLUMN MENU ICON
            "& .MuiDataGrid-menuIcon":
              {
                visibility:
                  "visible !important",

                opacity:
                  "1 !important",

                width:
                  "auto !important",
              },

            "& .MuiDataGrid-menuIconButton":
              {
                opacity:
                  "1 !important",

                color:
                  "text.secondary",
              },

            // CELL
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",

              borderColor:
                "divider",

              fontSize: "12px",

              "&:focus, &:focus-within":
                {
                  outline: "none",
                },
            },

            // ROW
            "& .MuiDataGrid-row:hover":
              {
                bgcolor:
                  "action.hover",
              },

            // FOOTER
            "& .MuiDataGrid-footerContainer":
              {
                minHeight: 48,

                borderTop:
                  "1px solid",

                borderColor:
                  "divider",
              },

            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                fontSize: "11px",
                color:
                  "text.secondary",
              },
          }}
        />
      </Box>

      {/* ================= 3 DOT MENU ================= */}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            minWidth: 160,
            mt: 0.5,
            borderRadius: 1.5,

            border: "1px solid",
            borderColor: "divider",

            boxShadow:
              "0 8px 24px rgba(15,23,42,0.10)",
          },
        }}
      >
        <MenuItem
          onClick={handleViewDocuments}
          sx={{
            gap: 1,
            fontSize: "12px",
            py: 1,
          }}
        >
          <DescriptionOutlinedIcon
            sx={{
              fontSize: 17,
              color: "primary.main",
            }}
          />

          View Documents
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default RegistrationTable;