"use client";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function SearchPagination({
  pageCount,
  page,
  onPageChange,
}) {
  if (pageCount <= 1) return null;

  return (
    <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
      <Pagination
        count={pageCount}
        page={page}
        onChange={(event, value) => onPageChange(value)}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={1}
      />
    </Stack>
  );
}
