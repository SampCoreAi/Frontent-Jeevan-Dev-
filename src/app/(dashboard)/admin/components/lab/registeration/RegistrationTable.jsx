
"use client";

import React, { useCallback, useState } from "react";
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

  page = 0,
  setPage = () => {},

  rowsPerPage = 10,
  setRowsPerPage = () => {},

  total = 0,

  search = "",
  setSearch = () => {},

  status = "",
  setStatus = () => {},

  sortModel = [],
  setSortModel = () => {},

  onViewDocuments,
}) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // --------------------------------
  // NORMALIZE API RESPONSE
  // --------------------------------

  const rows = registrations.map((item) => {
    // Supports both nested API objects and already mapped rows.
    const registrationData = item.registrationData || {};
    const labInformation = registrationData.labInformation || {};
    const labAddress = registrationData.labAddress || {};

    return {
      id: item.id,

      diagnosticLabName:
        item.diagnosticLabName ||
        labInformation.diagnosticLabName ||
        "-",

      labType:
        item.labType ||
        labInformation.labType ||
        "-",

      ownerFullName:
        item.ownerFullName ||
        labInformation.ownerFullName ||
        "-",

      ownerPhone:
        item.ownerPhone ||
        labInformation.ownerPhone ||
        "-",

      cityTown:
        item.cityTown ||
        labAddress.cityTown ||
        "-",

      onboardingStatus:
        item.onboardingStatus ||
        item.onboarding_status ||
        "-",

      createdAt:
        item.createdAt ||
        item.created_at ||
        "-",

      documents: item.documents || {},
      registrationData,
      originalData: item,
    };
  });

  // --------------------------------
  // THREE-DOT MENU
  // --------------------------------

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
      onViewDocuments?.(
        selectedRow.originalData
      );
    }

    handleMenuClose();
  };

  // --------------------------------
  // STATUS COLORS
  // --------------------------------

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

  // --------------------------------
  // TABLE COLUMNS: EXACTLY 8
  // --------------------------------

  const columns = [
    // 1. SERIAL NUMBER
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
        const rowIndex = rows.findIndex(
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

    // 2. LAB NAME
    {
      field: "diagnosticLabName",
      headerName: "LAB NAME",
      minWidth: 190,
      flex: 1.3,
      sortable: false,
      align: "left",
      headerAlign: "left",

      renderCell: (params) => (
        <Typography
          noWrap
          title={params.value}
          sx={{
            fontSize: "13px",
            fontWeight: 600,
            color: "text.primary",
            maxWidth: "100%",
          }}
        >
          {params.value || "-"}
        </Typography>
      ),
    },

    // 3. LAB TYPE
    {
      field: "labType",
      headerName: "LAB TYPE",
      minWidth: 125,
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

    // 4. OWNER NAME
    {
      field: "ownerFullName",
      headerName: "OWNER NAME",
      minWidth: 155,
      flex: 1,
      sortable: false,
      align: "left",
      headerAlign: "left",

      renderCell: (params) => (
        <Typography
          noWrap
          title={params.value}
          sx={{
            fontSize: "12px",
            fontWeight: 500,
            color: "text.primary",
            maxWidth: "100%",
          }}
        >
          {params.value || "-"}
        </Typography>
      ),
    },

    // 5. CONTACT
    {
      field: "ownerPhone",
      headerName: "CONTACT",
      minWidth: 135,
      flex: 0.9,
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

    // 6. CITY
    {
      field: "cityTown",
      headerName: "CITY",
      minWidth: 120,
      flex: 0.8,
      sortable: false,
      align: "center",
      headerAlign: "center",

      renderCell: (params) => (
        <Typography
          noWrap
          title={params.value}
          sx={{
            fontSize: "12px",
            color: "text.primary",
            maxWidth: "100%",
          }}
        >
          {params.value || "-"}
        </Typography>
      ),
    },

    // 7. STATUS
    {
      field: "onboardingStatus",
      headerName: "STATUS",
      minWidth: 130,
      flex: 0.8,
      sortable: false,
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

    // 8. ACTION: THREE DOTS
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
          aria-label="Lab registration actions"
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

  // --------------------------------
  // SERVER-SIDE SORTING
  // --------------------------------

  const handleSortModelChange = useCallback(
    (model) => {
      const currentField = sortModel?.[0]?.field;
      const currentSort = sortModel?.[0]?.sort;

      const newField = model?.[0]?.field;
      const newSort = model?.[0]?.sort;

      if (
        currentField === newField &&
        currentSort === newSort
      ) {
        return;
      }

      setSortModel(model);
    },
    [sortModel, setSortModel]
  );

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <Box>
      {/* SEARCH AND STATUS FILTER */}

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
          placeholder="Search lab..."
          onChange={(event) => {
            setSearch(event.target.value);
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
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(0);
          }}
          sx={{
            width: {
              xs: "100%",
              sm: 160,
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

      {/* REGISTRATION TABLE */}

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
          rows={rows}
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
            if (model.pageSize !== rowsPerPage) {
              setRowsPerPage(model.pageSize);
              setPage(0);
              return;
            }

            setPage(model.page);
          }}

          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}

          pageSizeOptions={[5, 10, 20, 50]}
          disableRowSelectionOnClick
          rowHeight={52}
          columnHeaderHeight={44}
          disableColumnMenu

          sx={{
            border: 0,

            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "action.hover",
              borderBottom: "1px solid",
              borderColor: "divider",
            },

            "& .MuiDataGrid-columnHeader": {
              "&:focus, &:focus-within": {
                outline: "none",
              },
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              width: "100%",
              fontSize: "10px",
              fontWeight: 700,
              color: "text.secondary",
            },

            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              borderColor: "divider",
              fontSize: "12px",

              "&:focus, &:focus-within": {
                outline: "none",
              },
            },

            "& .MuiDataGrid-row:hover": {
              bgcolor: "action.hover",
            },

            "& .MuiDataGrid-footerContainer": {
              minHeight: 48,
              borderTop: "1px solid",
              borderColor: "divider",
            },

            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                fontSize: "11px",
                color: "text.secondary",
              },
          }}
        />
      </Box>

      {/* THREE-DOT ACTION MENU */}

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
