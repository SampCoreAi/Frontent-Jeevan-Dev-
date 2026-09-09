import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function UserDataGrid({ users, columns }) {
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
          pageSizeOptions={[5, 10]}
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
            backgroundColor: "#fff",
            borderRadius: 2,
            border: "1px solid #e0e0e0",

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#1e6658",
              color: "#1e6658",
              fontWeight: "bold",
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
            },

            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: "#f7fdfa",
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#e8f9f5",
            },
  width: {
  xs: "100%",
  sm: "100%",
  md: "100%",
  lg: "100%",
  xl: "100%",

},

            "& .MuiDataGrid-cell": {
              fontSize: {
                xs: "0.75rem",
                sm: "0.9rem",
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}