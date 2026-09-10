"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Button,
  Select,
  MenuItem,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Fade,
  Chip,
  Typography,
  useMediaQuery,
  Collapse,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";


import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TodayIcon from "@mui/icons-material/Today";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ClearIcon from "@mui/icons-material/Clear";
import ViewDayIcon from "@mui/icons-material/ViewDay";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import ScheduleIcon from "@mui/icons-material/Schedule";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const CalendarControls = ({
  selectedDate,
  setSelectedDate,
  handlePrevious,
  handleNext,
  handleToday,
  view,
  setView,
  showFilters,
  setShowFilters,
  searchTerm,
  setSearchTerm,
  filterDepartment,
  setFilterDepartment,
  filterDoctor,
  setFilterDoctor,
  filterStatus,
  setFilterStatus,
  departments = [],
  doctors = [],
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [activeFilters, setActiveFilters] = useState(0);

  // Calculate active filters count
  React.useEffect(() => {
    let count = 0;
    if (searchTerm) count++;
    if (filterDepartment !== "all") count++;
    if (filterDoctor !== "all") count++;
    if (filterStatus !== "all") count++;
    setActiveFilters(count);
  }, [searchTerm, filterDepartment, filterDoctor, filterStatus]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterDepartment("all");
    setFilterDoctor("all");
    setFilterStatus("all");
  };

  const viewOptions = [
    { value: "day", icon: <ViewDayIcon fontSize="small" />, label: "Day" },
    { value: "week", icon: <ViewWeekIcon fontSize="small" />, label: "Week" },
    { value: "month", icon: <CalendarViewMonthIcon fontSize="small" />, label: "Month" },
    { value: "year", icon: <ViewModuleIcon fontSize="small" />, label: "Year" },
    
  ];

  return (
    <Fade in timeout={400}>
      <Card
        sx={{
          mb: 2,
          mt: 1,
          boxShadow: theme.shadows[2],
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 3,
          overflow: "visible",
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
          {/* Main Controls Row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            {/* Left: Navigation & Date */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap",
                width: { xs: "100%", sm: "auto" },
                justifyContent: { xs: "space-between", sm: "flex-start" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Tooltip title="Previous">
                  <IconButton
                    onClick={handlePrevious}
                    size="small"
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      p: 1,
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                        transform: "translateX(-2px)",
                      },
                    }}
                  >
                    <ArrowBackIosNewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <DatePicker
                  value={selectedDate}
                  
                  onChange={(newValue) => {
                    if (newValue) setSelectedDate(dayjs(newValue));
                  }}
                  slots={{ openPickerIcon: CalendarTodayIcon }}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        width: { xs: 140, sm: 160 },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: theme.palette.background.default,
                          fontWeight: 600,
                          fontSize: "0.95rem",
                        },
                      },
                    },
                  }}
                />

                <Tooltip title="Next">
                  <IconButton
                    onClick={handleNext}
                    size="small"
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      p: 1,
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                        transform: "translateX(2px)",
                      },
                    }}
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Button
                variant="outlined"
                onClick={handleToday}
                startIcon={<TodayIcon />}
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 2,
                  borderColor: theme.palette.divider,
                  color: theme.palette.text.primary,
                  "&:hover": {
                    borderColor: theme.palette.text.primary,
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                Today
              </Button>
            </Box>

            {/* Right: View Toggle & Filters */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                width: { xs: "100%", sm: "auto" },
                justifyContent: { xs: "space-between", sm: "flex-end" },
                flexWrap: "wrap",
              }}
            >
              {/* View Toggle - Desktop */}
              {!isTablet ? (
                <ToggleButtonGroup
                  value={view}
                  exclusive
                  onChange={(e, newView) => newView && setView(newView)}
                  size="small"
                  sx={{
                    "& .MuiToggleButton-root": {
                      border: `1px solid ${theme.palette.divider}`,
                      textTransform: "none",
                      fontWeight: 500,
                      px: 2,
                      gap: 0.5,
                      "&.Mui-selected": {
                        backgroundColor: theme.palette.action.selected,
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  {viewOptions.map((option) => (
                    <ToggleButton key={option.value} value={option.value}>
                      {option.icon}
                      {option.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              ) : (
                <Select
                  size="small"
                  value={view}
                  onChange={(e) => setView(e.target.value)}
                  sx={{
                    minWidth: 120,
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.divider,
                    },
                  }}
                >
                  {viewOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {option.icon}
                        {option.label} View
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              )}

            </Box>
          </Box>

        </CardContent>
      </Card>
    </Fade>
  );
};

export default CalendarControls;