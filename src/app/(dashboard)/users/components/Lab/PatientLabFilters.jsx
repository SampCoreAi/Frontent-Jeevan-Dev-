"use client";

import {
  Box,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "PENDING", label: "Requested" },
  { value: "APPROVED", label: "Accepted" },
  { value: "SAMPLE_SCHEDULED", label: "Sample Scheduled" },
  { value: "SAMPLE_COLLECTED", label: "Sample Collected" },
  { value: "RECOLLECTION_REQUIRED", label: "Recollection Required" },
  { value: "PROCESSING", label: "Testing" },
  { value: "REPORT_READY", label: "Report Ready" },
  { value: "REPORT_UPLOADED", label: "Report Uploaded" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function PatientLabFilters({
  search = "",
  status = "",
  date = "",
  onSearch,
  onStatus,
  onDate,
}) {
  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      height: 46,
      borderRadius: "9px",
      backgroundColor: "#F8FAF9",
      fontSize: "13px",

      "& fieldset": {
        borderColor: "#DDE7E3",
      },

      "&:hover fieldset": {
        borderColor: "#B9CBC5",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#07876A",
        borderWidth: "1px",
      },
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 180px",
          md: "minmax(280px, 1fr) 200px 210px",
        },
        gap: 1.25,

        p: 1.5,

        border: "1px solid #E1E9E6",
        borderRadius: "12px",

        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Search */}

      <TextField
        fullWidth
        value={search}
        onChange={(event) => onSearch?.(event.target.value)}
        placeholder="Search lab, doctor, test..."
        size="small"
        sx={fieldSx}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon
                  sx={{
                    fontSize: 20,
                    color: "#64748B",
                  }}
                />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Status */}

      <FormControl
        fullWidth
        size="small"
        sx={fieldSx}
      >
        <Select
          value={status}
          onChange={(event) => onStatus?.(event.target.value)}
          displayEmpty
          MenuProps={{
            PaperProps: {
              sx: {
                mt: 0.5,
                maxHeight: 320,
                borderRadius: "9px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 8px 25px rgba(15,23,42,0.08)",

                "& .MuiMenuItem-root": {
                  minHeight: 36,
                  fontSize: "12.5px",
                },
              },
            },
          }}
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Date */}

      <TextField
        fullWidth
        type="date"
        value={date}
        onChange={(event) => onDate?.(event.target.value)}
        size="small"
        sx={{
          ...fieldSx,

          "& input::-webkit-calendar-picker-indicator": {
            cursor: "pointer",
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <CalendarTodayOutlinedIcon
                  sx={{
                    fontSize: 18,
                    color: "#64748B",
                  }}
                />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}