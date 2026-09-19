import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function UserDataGrid({
  users = [],
  columns = [],
  loading = false,
}) {
  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: {
            xs: 400,
            sm: 500,
          },
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
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

            // =========================
            // COLUMN HEADER
            // =========================
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

              "&:focus": {
                outline: "none",
              },

              "&:focus-within": {
                outline: "none",
              },
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              fontSize: "12.5px",
              fontWeight: 700,
            },

            // =========================
            // ROW
            // =========================
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

            // =========================
            // CELL
            // =========================
            "& .MuiDataGrid-cell": {
              fontSize: "12.5px",
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
            // FOOTER
            // =========================
            "& .MuiDataGrid-footerContainer": {
              minHeight: "44px",
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            },

            "& .MuiTablePagination-root": {
              color: "text.secondary",
            },

            "& .MuiTablePagination-toolbar": {
              minHeight: "44px",
            },

            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                fontSize: "12.5px",
              },

            "& .MuiTablePagination-select": {
              fontSize: "12.5px",
            },

            // =========================
            // ICONS
            // =========================
            "& .MuiDataGrid-iconButtonContainer .MuiSvgIcon-root": {
              fontSize: "17px",
              color: "text.secondary",
            },

            "& .MuiDataGrid-menuIcon .MuiSvgIcon-root": {
              fontSize: "17px",
              color: "text.secondary",
            },

            // =========================
            // LOADING
            // =========================
            "& .MuiDataGrid-overlayWrapper": {
              bgcolor: "background.paper",
            },

            // =========================
            // SCROLLBAR
            // =========================
            "& ::-webkit-scrollbar": {
              width: "6px",
              height: "6px",
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