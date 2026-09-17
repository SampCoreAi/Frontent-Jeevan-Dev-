"use client";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function SearchPagination({
  pageCount,
  page,
  onPageChange,
}) {
  return (
    <Stack spacing={2} alignItems="center" sx={{ mt: 4, mb: 2 }}>
      <Pagination
        count={Math.max(pageCount, 1)}
        page={page}
        onChange={(event, value) => onPageChange(value)}
        shape="rounded"
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={1}
        sx={{
          // Normal numbers + arrows
          "& .MuiPaginationItem-root": {
            color: "#028275",
          },

          // Selected page
          "& .MuiPaginationItem-root.Mui-selected": {
            backgroundColor: "#028275",
            color: "#fff",

            "&:hover": {
              backgroundColor: "#026d63",
            },
          },

          // Hover
          "& .MuiPaginationItem-root:hover": {
            backgroundColor: "#e6f4f2",
          },
        }}
      />
    </Stack>
  );
}