"use client";

import { Button, MenuItem, Stack, TextField } from "@mui/material";

const textFieldSx = {
  "& .MuiInputBase-root": { fontSize: "13px" },
  "& .MuiInputLabel-root": { fontSize: "13px" },
  "& .MuiFormHelperText-root": { fontSize: "11px", mx: 0 },
};

const LabsFilters = ({
  tableSearch,
  tableStatus,
  tableDate,
  onSearchChange,
  onStatusChange,
  onDateChange,
  onClear,
}) => {
  const hasFilters = tableSearch || tableStatus || tableDate;

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={1}
      sx={{ p: 1.5, borderBottom: "1px solid", borderColor: "divider" }}
    >
      <TextField
        size="small"
        label="Search labs"
        value={tableSearch}
        onChange={(e) => onSearchChange(e.target.value.slice(0, 100))}
        sx={{ ...textFieldSx, flex: 1, minWidth: { md: 220 } }}
      />

      <TextField
        select
        size="small"
        label="Status"
        value={tableStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        sx={{ ...textFieldSx, width: { xs: "100%", md: 150 } }}
      >
        <MenuItem value="" sx={{ fontSize: "12.5px" }}>All statuses</MenuItem>
        <MenuItem value="ACTIVE" sx={{ fontSize: "12.5px" }}>Active</MenuItem>
        <MenuItem value="INACTIVE" sx={{ fontSize: "12.5px" }}>Inactive</MenuItem>
      </TextField>

      <TextField
        size="small"
        type="date"
        label="Created date"
        value={tableDate}
        onChange={(e) => onDateChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ ...textFieldSx, width: { xs: "100%", md: 170 } }}
      />

      {hasFilters && (
        <Button
          variant="text"
          onClick={onClear}
          sx={{
            whiteSpace: "nowrap",
            alignSelf: { xs: "flex-start", md: "center" },
          }}
        >
          Clear filters
        </Button>
      )}
    </Stack>
  );
};

export default LabsFilters;