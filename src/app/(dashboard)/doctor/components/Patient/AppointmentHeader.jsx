"use client";

import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";

export default function AppointmentHeader({
  selectedHospital,
  selectedMode,
  date,
  status,
  onDateChange,
  onStatusChange,
  onClear,
}) {
  const theme = useTheme();

  const fieldStyle = {
    "& .MuiInputLabel-root": {
      fontSize: "13px",
      color: theme.palette.text.secondary,
    },
    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
      transform: "translate(14px, -5px) scale(0.75)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: theme.palette.primary.main,
    },
    "& .MuiOutlinedInput-root": {
      height: 40,
      fontSize: "13px",
      bgcolor: theme.palette.background.paper,
      "& fieldset": {
        borderColor: "#D8DEDC",
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.main,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: "1px",
      },
    },
    "& input": {
      fontSize: "13px",
      color: theme.palette.text.primary,
    },
    "& .MuiSelect-select": {
      fontSize: "13px",
    },
  };

  return (
    <Box
      sx={{
        px: { xs: 1.5, sm: 2 },
        py: 1.5,
        bgcolor: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: "flex",
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", md: "row" },
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            minWidth: 38,
            borderRadius: 1.5,
            bgcolor: "#EDF7F2",
            color: theme.palette.primary.main,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selectedMode === "online" ? (
            <WifiIcon sx={{ fontSize: 20 }} />
          ) : (
            <LocalHospitalOutlinedIcon sx={{ fontSize: 20 }} />
          )}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            {selectedMode === "online"
              ? "Online Appointments"
              : "Offline Appointments"}
          </Typography>

          <Typography
            sx={{
              mt: 0.15,
              fontSize: "11px",
              color: theme.palette.text.secondary,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {selectedHospital || "No hospital selected"}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: 1,
          width: { xs: "100%", md: "auto" },
        }}
      >
        <TextField
          type="date"
          label="Date"
          size="small"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            ...fieldStyle,
            width: { xs: "100%", sm: 165 },
            "& input::-webkit-calendar-picker-indicator": {
              filter:
                "invert(45%) sepia(60%) saturate(600%) hue-rotate(110deg) brightness(85%)",
              cursor: "pointer",
            },
          }}
        />

        <FormControl
          size="small"
          sx={{
            ...fieldStyle,
            width: { xs: "100%", sm: 165 },
          }}
        >
          <InputLabel>Status</InputLabel>

          <Select
            value={status}
            label="Status"
            onChange={(e) => onStatusChange(e.target.value)}
            MenuProps={{
              PaperProps: {
                sx: {
                  "& .MuiMenuItem-root": {
                    fontSize: "13px",
                  },
                },
              },
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          onClick={onClear}
          sx={{
            height: 40,
            minWidth: 72,
            px: 1.5,
            fontSize: "12px",
            fontWeight: 500,
            textTransform: "none",
            whiteSpace: "nowrap",
            borderColor: "#D8DEDC",
            color: theme.palette.text.secondary,
            borderRadius: 1.25,
            "&:hover": {
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              bgcolor: "#EDF7F2",
            },
          }}
        >
          Clear
        </Button>
      </Box>
    </Box>
  );
}