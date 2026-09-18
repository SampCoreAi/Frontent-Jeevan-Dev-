"use client";

import { useState } from "react";

import {
  Paper,
  Box,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Button,
  Popover,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";

export default function DoctorsFilters({
  searchTerm,
  onSearchChange,
  onSearch, // ADD
  selectedSpec,
  onSpecChange,
  selectedDay,
  onDayChange,
  specializations = [],
  availableDays = [],
}) {
  const [filterAnchor, setFilterAnchor] = useState(null);

  const filterOpen = Boolean(filterAnchor);

  const activeFilterCount =
    (selectedSpec ? 1 : 0) + (selectedDay ? 1 : 0);

  const handleOpenFilter = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setFilterAnchor(null);
  };

  const handleClearFilters = () => {
    onSpecChange("");
    onDayChange("");
  };

  return (
    <>
      {/* ================= SEARCH BAR ================= */}

      <Paper
        elevation={0}
        sx={{
          mb: 2,
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: "100%",

            "@media (max-width: 650px)": {
              flexWrap: "wrap",
            },
          }}
        >
          {/* SEARCH INPUT */}

          <TextField
            fullWidth
  size="small"
  value={searchTerm}
  onChange={(e) => onSearchChange(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      onSearch?.();
    }
  }}
  placeholder="Search doctors by name, email or mobile"
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon
          sx={{
            fontSize: 19,
            color: "text.fourth",
          }}
        />
      </InputAdornment>
    ),
  }}
            sx={{
              flex: 1,

              "& .MuiOutlinedInput-root": {
                height: 42,
                borderRadius: "8px",

                // PURE WHITE SEARCH
                backgroundColor: "#ffffff",

                fontSize: "13px",

                "& fieldset": {
                  borderColor: "border.light",
                },

                "&:hover fieldset": {
                  borderColor: "border.third",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "border.third",
                  borderWidth: "1px",
                },
              },

              "& .MuiInputBase-input": {
                py: 0,
              },

              "& input::placeholder": {
                color: "text.fourth",
                opacity: 0.75,
              },

              "@media (max-width: 650px)": {
                flexBasis: "100%",
              },
            }}
          />

          {/* SEARCH BUTTON */}

          <Button
  variant="contained"
  onClick={onSearch}
  startIcon={
    <SearchIcon
      sx={{
        fontSize: "17px !important",
      }}
    />
  }
  sx={{
              height: 42,
              minWidth: 92,
              px: 1.8,

              borderRadius: "8px",

              backgroundColor: "background.primary",
              color: "primary.contrastText",

              textTransform: "none",
              fontWeight: 600,
              fontSize: "13px",

              boxShadow: "none",

              "& .MuiButton-startIcon": {
                mr: 0.7,
              },

              "&:hover": {
                backgroundColor: "hover.primary",
                boxShadow: "none",
              },

              "@media (max-width: 650px)": {
                flex: 1,
              },
            }}
          >
            Search
          </Button>

          {/* FILTER BUTTON */}

          <Button
            variant="outlined"
            startIcon={
              <TuneIcon
                sx={{
                  fontSize: "17px !important",
                }}
              />
            }
            onClick={handleOpenFilter}
            sx={{
              height: 42,
              minWidth: 92,
              px: 1.8,

              borderRadius: "8px",

              borderColor: "border.third",
              color: "text.third",

              backgroundColor: "background.third",

              textTransform: "none",
              fontWeight: 600,
              fontSize: "13px",

              position: "relative",

              "& .MuiButton-startIcon": {
                mr: 0.7,
              },

              "&:hover": {
                borderColor: "border.third",
                backgroundColor: "background.third",
              },

              "@media (max-width: 650px)": {
                flex: 1,
              },
            }}
          >
            Filters

            {activeFilterCount > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: -6,
                  right: -6,

                  width: 18,
                  height: 18,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: "50%",

                  backgroundColor: "background.primary",
                  color: "text.secondary",

                  border: "2px solid #fff",

                  fontSize: "9px",
                  fontWeight: 700,
                }}
              >
                {activeFilterCount}
              </Box>
            )}
          </Button>
        </Box>
      </Paper>

      {/* ================= FILTER POPOVER ================= */}

      <Popover
        open={filterOpen}
        anchorEl={filterAnchor}
        onClose={handleCloseFilter}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.7,

              // POPUP ALSO SMALLER
              width: 285,

              borderRadius: "10px",

              border: "1px solid",
              borderColor: "border.light",

              boxShadow: "0 6px 22px rgba(0,0,0,0.08)",
            },
          },
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            px: 1.7,
            py: 1.2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Filters
            </Typography>

            <Typography
              sx={{
                fontSize: "11px",
                color: "text.fourth",
              }}
            >
              Refine doctor results
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={handleCloseFilter}
            sx={{
              color: "text.fourth",
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Divider />

        {/* FILTER BODY */}

        <Box
          sx={{
            p: 1.7,
          }}
        >
          {/* SPECIALIZATION */}

          <Typography
            sx={{
              mb: 0.5,
              fontSize: "12px",
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            Specialization
          </Typography>

          <Select
            fullWidth
            size="small"
            value={selectedSpec}
            onChange={(e) => onSpecChange(e.target.value)}
            displayEmpty
            sx={{
              height: 39,
              mb: 1.5,

              borderRadius: "7px",
              fontSize: "12px",

              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "border.light",
              },

              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "border.third",
              },

              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "border.third",
              },
            }}
          >
            <MenuItem value="" sx={{ fontSize: "12px" }}>
              All Specializations
            </MenuItem>

            {specializations.map((spec) => (
              <MenuItem
                key={spec}
                value={spec}
                sx={{ fontSize: "12px" }}
              >
                {spec}
              </MenuItem>
            ))}
          </Select>

          {/* AVAILABILITY */}

          <Typography
            sx={{
              mb: 0.5,
              fontSize: "12px",
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            Availability
          </Typography>

          <Select
            fullWidth
            size="small"
            value={selectedDay}
            onChange={(e) => onDayChange(e.target.value)}
            displayEmpty
            sx={{
              height: 39,

              borderRadius: "7px",
              fontSize: "12px",

              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "border.light",
              },

              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "border.third",
              },

              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "border.third",
              },
            }}
          >
            <MenuItem value="" sx={{ fontSize: "12px" }}>
              Any Availability
            </MenuItem>

            {availableDays.map((day) => (
              <MenuItem
                key={day}
                value={day}
                sx={{ fontSize: "12px" }}
              >
                {day}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Divider />

        {/* ACTION BUTTONS */}

        <Box
          sx={{
            p: 1.5,
            display: "flex",
            gap: 0.8,
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            onClick={handleClearFilters}
            sx={{
              height: 36,
              borderRadius: "7px",

              textTransform: "none",
              fontSize: "12px",
              fontWeight: 600,

              borderColor: "border.light",
              color: "text.fourth",

              "&:hover": {
                borderColor: "border.third",
                backgroundColor: "background.third",
              },
            }}
          >
            Clear
          </Button>

          <Button
            fullWidth
            variant="contained"
            onClick={handleCloseFilter}
            sx={{
              height: 36,
              borderRadius: "7px",

              textTransform: "none",
              fontSize: "12px",
              fontWeight: 600,

              backgroundColor: "background.primary",
               color: "primary.contrastText",

              boxShadow: "none",

              "&:hover": {
                backgroundColor: "hover.primary",
                boxShadow: "none",
              },
            }}
          >
            Apply
          </Button>
        </Box>
      </Popover>
    </>
  );
}