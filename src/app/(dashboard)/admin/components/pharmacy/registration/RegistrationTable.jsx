
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

  page = 0,
  setPage = () => {},

  rowsPerPage = 10,
  setRowsPerPage = () => {},

  total = 0,

  search = "",
  setSearch = () => {},

  status = "",
  setStatus = () => {},

  onViewDocuments,
}) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const rows = registrations.map((item) => {
    const registrationData = item.registrationData || {};
    const premises = registrationData.premisesDetails || {};
    const signatory = registrationData.signatoryDetails || {};

    return {
      id: item.id,

      tradeName:
        registrationData.licensedTradeName || "-",

      legalEntityName:
        registrationData.legalEntityName || "-",

      entityType:
        registrationData.entityType || "-",

      signatoryName:
        signatory.fullName || "-",

      contact:
        registrationData.storePhone ||
        signatory.phone ||
        "-",

      city:
        premises.cityDistrict || "-",

      state:
        premises.state || "-",

      onboardingStatus:
        item.onboardingStatus || "-",

      storeEmail:
        item.storeEmail ||
        registrationData.storeEmail ||
        "-",

      createdAt:
        item.createdAt || "-",

      originalData: item,
    };
  });

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
      onViewDocuments?.(selectedRow.originalData);
    }

    handleMenuClose();
  };

  const getStatusStyle = (value) => {
    switch (value) {
      case "APPROVED":
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

  const columns = [
    {
      field: "serialNumber",
      headerName: "S.NO",
      width: 70,
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
              fontSize: 12,
              fontWeight: 600,
              color: "text.secondary",
            }}
          >
            {page * rowsPerPage + rowIndex + 1}
          </Typography>
        );
      },
    },

    {
      field: "tradeName",
      headerName: "PHARMACY NAME",
      minWidth: 180,
      flex: 1.2,
      sortable: false,

      renderCell: (params) => (
        <Typography
          noWrap
          title={params.value}
          sx={{
            fontSize: 13,
            fontWeight: 600,
            color: "text.primary",
            maxWidth: "100%",
          }}
        >
          {params.value || "-"}
        </Typography>
      ),
    },

    {
      field: "legalEntityName",
      headerName: "LEGAL ENTITY",
      minWidth: 160,
      flex: 1,
      sortable: false,

      renderCell: (params) => (
        <Typography
          noWrap
          title={params.value}
          sx={{
            fontSize: 12,
            color: "text.primary",
            maxWidth: "100%",
          }}
        >
          {params.value || "-"}
        </Typography>
      ),
    },

    {
      field: "entityType",
      headerName: "ENTITY TYPE",
      minWidth: 125,
      flex: 0.8,
      sortable: false,
      align: "center",
      headerAlign: "center",

      renderCell: (params) => (
        <Typography sx={{ fontSize: 12 }}>
          {params.value || "-"}
        </Typography>
      ),
    },

    {
      field: "signatoryName",
      headerName: "SIGNATORY",
      minWidth: 145,
      flex: 1,
      sortable: false,

      renderCell: (params) => (
        <Typography
          noWrap
          title={params.value}
          sx={{
            fontSize: 12,
            color: "text.primary",
            maxWidth: "100%",
          }}
        >
          {params.value || "-"}
        </Typography>
      ),
    },

    {
      field: "contact",
      headerName: "CONTACT",
      minWidth: 125,
      flex: 0.9,
      sortable: false,
      align: "center",
      headerAlign: "center",

      renderCell: (params) => (
        <Typography sx={{ fontSize: 12 }}>
          {params.value || "-"}
        </Typography>
      ),
    },

    {
      field: "city",
      headerName: "CITY",
      minWidth: 110,
      flex: 0.8,
      sortable: false,
      align: "center",
      headerAlign: "center",

      renderCell: (params) => (
        <Typography
          noWrap
          title={params.value}
          sx={{ fontSize: 12, maxWidth: "100%" }}
        >
          {params.value || "-"}
        </Typography>
      ),
    },

    {
      field: "onboardingStatus",
      headerName: "STATUS",
      minWidth: 120,
      flex: 0.8,
      sortable: false,
      align: "center",
      headerAlign: "center",

      renderCell: (params) => {
        const value = params.value;
        const style = getStatusStyle(value);

        const label = value
          ? value.charAt(0) + value.slice(1).toLowerCase()
          : "-";

        return (
          <Chip
            label={label}
            size="small"
            sx={{
              height: 24,
              borderRadius: 1,
              fontSize: 10,
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

    {
      field: "action",
      headerName: "",
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",

      renderCell: (params) => (
        <IconButton
          size="small"
          aria-label="Pharmacy registration actions"
          onClick={(event) => handleMenuOpen(event, params.row)}
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
          <MoreVertRoundedIcon sx={{ fontSize: 19 }} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          mb: 1.5,
          display: "flex",
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.2,
        }}
      >
        <TextField
          size="small"
          value={search}
          placeholder="Search pharmacy..."
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
            width: { xs: "100%", sm: 300 },

            "& .MuiOutlinedInput-root": {
              height: 38,
              borderRadius: 1.5,
              fontSize: 12,
              bgcolor: "background.paper",
            },
          }}
        />

        <TextField
          select
          size="small"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(0);
          }}
          sx={{
            width: { xs: "100%", sm: 170 },

            "& .MuiOutlinedInput-root": {
              height: 38,
              borderRadius: 1.5,
              fontSize: 12,
              bgcolor: "background.paper",
            },
          }}
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="DRAFT">Draft</MenuItem>
          <MenuItem value="SUBMITTED">Submitted</MenuItem>
          <MenuItem value="APPROVED">Approved</MenuItem>
          <MenuItem value="REJECTED">Rejected</MenuItem>
        </TextField>
      </Box>

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
              fontSize: 10,
              fontWeight: 700,
              color: "text.secondary",
            },

            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              borderColor: "divider",
              fontSize: 12,

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
                fontSize: 11,
                color: "text.secondary",
              },
          }}
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              minWidth: 170,
              mt: 0.5,
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 24px rgba(15,23,42,0.10)",
            },
          },
        }}
      >
        <MenuItem
          onClick={handleViewDocuments}
          sx={{
            gap: 1,
            fontSize: 12,
            py: 1,
          }}
        >
          <DescriptionOutlinedIcon
            sx={{ fontSize: 17, color: "primary.main" }}
          />
          View Details & Documents
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default RegistrationTable;
