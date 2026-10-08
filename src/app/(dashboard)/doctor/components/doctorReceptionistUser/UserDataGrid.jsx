import { Box, Button, Chip, MenuItem, Select } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { DataGrid } from "@mui/x-data-grid";

export default function UserDataGrid({
  users = [],
  columns = [],
  loading = false,
  statusFilter = "ACTIVE",
  setStatusFilter,
  onStatusChange,
  onView,
}) {
  const filteredUsers = users.filter(
    (user) =>
      statusFilter === "ALL" || user.status === statusFilter
  );

  const statusColumn = {
    field: "status",
    headerName: "Status",
    minWidth: 110,
    flex: 0.6,
    sortable: false,
    renderCell: ({ row }) => {
      const active = row.status === "ACTIVE";

      return (
        <Chip
          label={active ? "Active" : "Inactive"}
          size="small"
          sx={{
            height: 25,
            fontSize: "11.5px",
            fontWeight: 600,
            bgcolor: active ? "#edf7f2" : "#f5f5f5",
            color: active ? "#1E6658" : "text.secondary",
            border: "1px solid",
            borderColor: active ? "#b7dfd0" : "divider",
          }}
        />
      );
    },
  };

  const actionColumn = {
    field: "action",
    headerName: "Action",
    minWidth: 170,
    flex: 0.9,
    sortable: false,
    filterable: false,
    renderCell: ({ row }) => {
      const active = row.status === "ACTIVE";

      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.7,
            height: "100%",
          }}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={
              <VisibilityIcon sx={{ fontSize: "15px !important" }} />
            }
            onClick={() => onView?.(row)}
            sx={{
              minWidth: 70,
              height: 30,
              px: 1,
              fontSize: "12px",
              textTransform: "none",
              borderRadius: 1,
            }}
          >
            View
          </Button>

          <Button
            variant="outlined"
            size="small"
            startIcon={
              active ? (
                <RemoveCircleOutlineIcon
                  sx={{ fontSize: "15px !important" }}
                />
              ) : (
                <CheckCircleOutlineIcon
                  sx={{ fontSize: "15px !important" }}
                />
              )
            }
            onClick={() =>
              onStatusChange?.(
                row,
                active ? "INACTIVE" : "ACTIVE"
              )
            }
            sx={{
              minWidth: 88,
              height: 30,
              px: 1,
              fontSize: "12px",
              textTransform: "none",
              borderRadius: 1,
              color: active ? "#d32f2f" : "#1E6658",
              borderColor: active ? "#ef9a9a" : "#9acbbb",
              "&:hover": {
                borderColor: active ? "#d32f2f" : "#1E6658",
                bgcolor: active ? "#fff5f5" : "#edf7f2",
              },
            }}
          >
            {active ? "Remove" : "Activate"}
          </Button>
        </Box>
      );
    },
  };

  const finalColumns = [
    ...columns.filter(
      (column) =>
        column.field !== "status" &&
        column.field !== "action"
    ),
    statusColumn,
    actionColumn,
  ];

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      

      <Box
        sx={{
          width: "100%",
          height: { xs: 400, sm: 500 },
        }}
      >
        <DataGrid
          rows={filteredUsers}
          columns={finalColumns}
          loading={loading}
          pageSizeOptions={[5, 8, 10]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 8,
                page: 0,
              },
            },
          }}
          disableRowSelectionOnClick
          getRowId={(row) => row.id || row._id}
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            overflow: "hidden",

            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "background.default",
              color: "text.primary",
              borderBottom: "1px solid",
              borderColor: "divider",
              minHeight: "42px !important",
              maxHeight: "42px !important",
            },

            "& .MuiDataGrid-columnHeader": {
              fontSize: "12.5px",
              fontWeight: 700,
              "&:focus, &:focus-within": {
                outline: "none",
              },
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              fontSize: "12.5px",
              fontWeight: 700,
            },

            "& .MuiDataGrid-row": {
              bgcolor: "background.paper",
              "&:hover": {
                bgcolor: "secondary.light",
              },
            },

            "& .MuiDataGrid-row:nth-of-type(odd)": {
              bgcolor: "background.default",
              "&:hover": {
                bgcolor: "secondary.light",
              },
            },

            "& .MuiDataGrid-cell": {
              fontSize: "12.5px",
              color: "text.primary",
              borderColor: "divider",
              "&:focus, &:focus-within": {
                outline: "none",
              },
            },

            "& .MuiDataGrid-footerContainer": {
              minHeight: 44,
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            },

            "& .MuiTablePagination-root": {
              color: "text.secondary",
            },

            "& .MuiTablePagination-toolbar": {
              minHeight: 44,
            },

            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select":
              {
                fontSize: "12.5px",
              },

            "& .MuiDataGrid-iconButtonContainer .MuiSvgIcon-root, & .MuiDataGrid-menuIcon .MuiSvgIcon-root":
              {
                fontSize: 17,
                color: "text.secondary",
              },

            "& .MuiDataGrid-overlayWrapper": {
              bgcolor: "background.paper",
            },

            "& ::-webkit-scrollbar": {
              width: 6,
              height: 6,
            },

            "& ::-webkit-scrollbar-thumb": {
              bgcolor: "divider",
              borderRadius: "10px",
            },
          }}
        />
      </Box>
    </Box>
  );
}