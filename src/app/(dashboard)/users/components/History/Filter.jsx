"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Popover,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

import {
  DateCalendar,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const FILTERS = [
  "All",
  "Today",
  "Upcoming",
  "Complete",
  "Cancel",
];

const Filter = ({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  selectedDate,
  setSelectedDate,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(
    theme.breakpoints.down("sm")
  );

  const [showSearch, setShowSearch] =
    useState(false);

  const [anchorEl, setAnchorEl] =
    useState(null);

  const handleOpenPicker = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePicker = () => {
    setAnchorEl(null);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    handleClosePicker();
  };

  const toggleSearch = () => {
    setShowSearch((prev) => {
      if (prev) {
        setSearchQuery("");
      }

      return !prev;
    });
  };

  return (
    <Box
      sx={{
        width: "100%",

        display: "flex",
        alignItems: {
          xs: "stretch",
          md: "center",
        },
        justifyContent: "space-between",

        flexDirection: {
          xs: "column",
          md: "row",
        },

        gap: {
          xs: 1.2,
          md: 1.5,
        },

        pb: 1.5,
        mb: 1.5,

        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* FILTERS */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",

          gap: 0.7,

          overflowX: "auto",

          pb: {
            xs: 0.5,
            md: 0,
          },

          scrollbarWidth: "none",

          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {FILTERS.map((filter) => {
          const active =
            activeFilter === filter;

          return (
            <Button
              key={filter}
              size="small"
              onClick={() =>
                setActiveFilter(filter)
              }
              sx={{
                minWidth: "auto",

                height: 30,

                px: {
                  xs: 1.2,
                  sm: 1.5,
                },

                borderRadius: 1.5,

                textTransform: "none",

                fontSize: "11.5px",

                fontWeight: active
                  ? 600
                  : 500,

                whiteSpace: "nowrap",

                bgcolor: active
                  ? "primary.main"
                  : "transparent",

                color: active
                  ? "primary.contrastText"
                  : "text.secondary",

                border: "1px solid",

                borderColor: active
                  ? "primary.main"
                  : "divider",

                "&:hover": {
                  bgcolor: active
                    ? "primary.dark"
                    : "action.hover",

                  borderColor:
                    "primary.main",

                  color: active
                    ? "primary.contrastText"
                    : "primary.main",
                },
              }}
            >
              {filter}
            </Button>
          );
        })}
      </Box>

      {/* SEARCH + DATE */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",

          justifyContent: {
            xs: "space-between",
            md: "flex-end",
          },

          gap: 0.8,

          minWidth: 0,
        }}
      >
        {showSearch ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",

              flex: {
                xs: 1,
                md: "none",
              },

              minWidth: 0,
            }}
          >
            <TextField
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search..."
              size="small"
              autoFocus
              fullWidth={isMobile}
              onKeyDown={(event) => {
                if (
                  event.key === "Escape"
                ) {
                  toggleSearch();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        fontSize: 17,
                        color:
                          "text.secondary",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: {
                  xs: "100%",
                  sm: 210,
                },

                "& .MuiOutlinedInput-root":
                  {
                    height: 32,

                    borderRadius: 1.5,

                    bgcolor:
                      "background.paper",

                    fontSize: "11.5px",
                  },

                "& .MuiInputBase-input":
                  {
                    py: 0.7,
                  },
              }}
            />

            <IconButton
              size="small"
              onClick={toggleSearch}
              aria-label="Close search"
              sx={{
                ml: 0.3,

                width: 30,
                height: 30,

                color: "text.secondary",

                "&:hover": {
                  bgcolor: "action.hover",
                  color: "primary.main",
                },
              }}
            >
              <CloseIcon
                sx={{ fontSize: 17 }}
              />
            </IconButton>
          </Box>
        ) : (
          <IconButton
            size="small"
            onClick={toggleSearch}
            aria-label="Search appointments"
            sx={{
              width: 32,
              height: 32,

              border: "1px solid",
              borderColor: "divider",

              borderRadius: 1.5,

              color: "primary.main",

              "&:hover": {
                bgcolor: "action.hover",
                borderColor:
                  "primary.main",
              },
            }}
          >
            <SearchIcon
              sx={{ fontSize: 17 }}
            />
          </IconButton>
        )}

        <Button
          variant="outlined"
          size="small"
          onClick={handleOpenPicker}
          startIcon={
            <CalendarMonthOutlinedIcon
              sx={{
                fontSize:
                  "16px !important",
              }}
            />
          }
          sx={{
            height: 32,

            px: 1.2,

            minWidth: "auto",

            borderRadius: 1.5,

            textTransform: "none",

            fontSize: "11.5px",
            fontWeight: 500,

            whiteSpace: "nowrap",

            borderColor: "divider",

            color: selectedDate
              ? "primary.main"
              : "text.secondary",

            "&:hover": {
              borderColor:
                "primary.main",

              bgcolor: "action.hover",
            },
          }}
        >
          {selectedDate
            ? selectedDate.format(
                "DD/MM/YYYY"
              )
            : "Date"}
        </Button>

        {selectedDate && (
          <Chip
            size="small"
            label={selectedDate.format(
              "DD/MM/YYYY"
            )}
            onDelete={() =>
              setSelectedDate(null)
            }
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },

              height: 28,

              bgcolor: "action.hover",

              color: "primary.main",

              fontSize: "11px",

              fontWeight: 500,

              "& .MuiChip-deleteIcon": {
                fontSize: 16,

                color: "text.secondary",

                "&:hover": {
                  color: "error.main",
                },
              },
            }}
          />
        )}

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClosePicker}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              mt: 0.5,

              borderRadius: 2,

              border: "1px solid",
              borderColor: "divider",

              boxShadow: (theme) =>
                theme.shadows[4],

              overflow: "hidden",
            },
          }}
        >
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
          >
            <DateCalendar
              value={selectedDate}
              onChange={
                handleDateSelect
              }
              sx={{
                width: {
                  xs: 290,
                  sm: 320,
                },

                "& .MuiPickersCalendarHeader-label":
                  {
                    fontSize: "12px",
                    fontWeight: 600,
                  },

                "& .MuiDayCalendar-weekDayLabel":
                  {
                    fontSize: "11px",
                    color:
                      "text.secondary",
                  },

                "& .MuiPickersDay-root": {
                  fontSize: "11px",

                  "&.Mui-selected": {
                    bgcolor:
                      "primary.main",

                    color:
                      "primary.contrastText",

                    "&:hover": {
                      bgcolor:
                        "primary.dark",
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Popover>
      </Box>
    </Box>
  );
};

export default Filter;