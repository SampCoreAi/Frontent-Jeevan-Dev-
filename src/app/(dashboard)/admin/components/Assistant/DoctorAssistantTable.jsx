"use client";

import React, { useMemo } from "react";
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

const DoctorAssistantTable = ({
  selectedDoctor,
  filteredAssistants,
  assistantsLoading,
  onMenuOpen,
  getDoctorName,
  formatStatus,
  getStatusStyle,
}) => {
  const theme = useTheme();

  // =========================================
  // DATAGRID COLUMNS
  // =========================================
  const columns = useMemo(
    () => [
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
          const index = filteredAssistants.findIndex(
            (item) =>
              (item.id ?? item.userId ?? item.user_id) ===
              (params.row.id ?? params.row.userId ?? params.row.user_id)
          );

          return (
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "text.secondary",
              }}
            >
              {index + 1}
            </Typography>
          );
        },
      },
     
      {
        field: "full_name",
        headerName: "ASSISTANT",
        minWidth: 170,
        flex: 1,
        align: "center",
        headerAlign: "center",
        valueGetter: (value, row) =>
          value || row?.fullName || row?.name || "-",
        renderCell: (params) => (
          <Typography
            noWrap
            sx={{
              width: "100%",
              textAlign: "center",
              fontSize: "12px",
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            {params.value || "-"}
          </Typography>
        ),
      },
      {
        field: "email",
        headerName: "EMAIL",
        minWidth: 210,
        flex: 1.2,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Typography
            noWrap
            sx={{
              width: "100%",
              textAlign: "center",
              fontSize: "12px",
              color: "text.primary",
            }}
          >
            {params.value || "-"}
          </Typography>
        ),
      },
      {
        field: "mobile",
        headerName: "CONTACT",
        minWidth: 135,
        flex: 0.8,
        sortable: false,
        align: "center",
        headerAlign: "center",
        valueGetter: (value, row) =>
          value || row?.phone_number || row?.phone || "-",
        renderCell: (params) => (
          <Typography
            sx={{
              width: "100%",
              textAlign: "center",
              fontSize: "12px",
              color: "text.primary",
            }}
          >
            {params.value || "-"}
          </Typography>
        ),
      },
      {
        field: "status",
        headerName: "STATUS",
        minWidth: 125,
        flex: 0.7,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const value = params.value || "ACTIVE";
          const statusStyle = getStatusStyle(value);

          return (
            <Chip
              label={formatStatus(value)}
              size="small"
              sx={{
                height: 24,
                borderRadius: 1,
                fontSize: "10px",
                fontWeight: 700,
                color: statusStyle.color,
                bgcolor: statusStyle.bgcolor,
                "& .MuiChip-label": { px: 1.2 },
              }}
            />
          );
        },
      },
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
          <Tooltip title="More">
            <IconButton
              size="small"
              onClick={(event) => onMenuOpen(event, params.row)}
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
          </Tooltip>
        ),
      },
    ],
    [
      selectedDoctor,
      filteredAssistants,
      theme.palette.primary.main,
      getDoctorName,
      formatStatus,
      getStatusStyle,
      onMenuOpen,
    ]
  );

  // =========================================
  // ADD UNIQUE ROW IDs
  // =========================================
  const rows = filteredAssistants.map((assistant, index) => ({
    ...assistant,
    _gridId:
      assistant.id ??
      assistant.userId ??
      assistant.user_id ??
      `assistant-${index}`,
  }));

  // =========================================
  // EMPTY INITIAL STATE
  // =========================================
  if (!selectedDoctor) {
    return (
      <Paper
        elevation={0}
        sx={{
          py: 6,
          px: 2,
          border: "1px dashed",
          borderColor: "#b1b1b1",
          borderRadius: 2,
          bgcolor: "background.paper",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            mx: "auto",
            mb: 1.3,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: `${theme.palette.primary.main}10`,
            color: "primary.main",
          }}
        >
          <GroupsOutlinedIcon />
        </Box>

        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          Select a doctor
        </Typography>

        <Typography
          sx={{
            mt: 0.4,
            fontSize: "11px",
            color: "text.secondary",
          }}
        >
          Choose a doctor above to view assigned assistants.
        </Typography>
      </Paper>
    );
  }

  // =========================================
  // DATAGRID
  // =========================================
  return (
    <Box
      sx={{
        width: "100%",
        border: "1px solid",
        borderColor: "#b1b1b1",
        borderRadius: 2,

        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row._gridId}
        loading={assistantsLoading}
        disableRowSelectionOnClick
        rowHeight={52}
        columnHeaderHeight={44}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        sx={{
          border: 0,
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: "action.hover",
            borderBottom: "1px solid",
            borderColor: "divider",
          },
          "& .MuiDataGrid-columnHeader": {
            "&:focus, &:focus-within": { outline: "none" },
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            width: "100%",
            textAlign: "center",
            fontSize: "10px",
            fontWeight: 700,
            color: "text.secondary",
          },
          "& .MuiDataGrid-menuIcon": {
            visibility: "visible !important",
            opacity: "1 !important",
            width: "auto !important",
          },
          "& .MuiDataGrid-menuIconButton": {
            opacity: "1 !important",
            visibility: "visible !important",
            color: "text.secondary",
            width: 27,
            height: 27,
            "&:hover": {
              bgcolor: "action.selected",
              color: "primary.main",
            },
          },
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderColor: "divider",
            fontSize: "12px",
            "&:focus, &:focus-within": { outline: "none" },
          },
          "& .MuiDataGrid-row:hover": { bgcolor: "action.hover" },
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
          "& .MuiDataGrid-overlay": {
            fontSize: "12px",
            color: "text.secondary",
          },
        }}
      />
    </Box>
  );
};

export default DoctorAssistantTable;