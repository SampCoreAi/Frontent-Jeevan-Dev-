"use client";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function SearchPagination({
  pageCount,
  page,
  onPageChange,
}) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      sx={{
        mt: 4,
        mb: 2,
      }}
    >
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
          // Normal page numbers + arrows
          "& .MuiPaginationItem-root": {
            color: "primary.dark",
            transition: "all 0.2s ease",
          },

          // Normal item hover
          "& .MuiPaginationItem-root:hover": {
            backgroundColor: "primary.light",
          },

          // Selected page
          "& .MuiPaginationItem-root.Mui-selected": {
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            fontWeight: 600,

            "&:hover": {
              backgroundColor: "primary.dark",
            },
          },
        }}
      />
    </Stack>
  );
}