"use client";

import React from "react";

import {
  Box,
  Button,
  Card,
  IconButton,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  useMediaQuery,
} from "@mui/material";

import { alpha, useTheme } from "@mui/material/styles";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ViewDayOutlinedIcon from "@mui/icons-material/ViewDayOutlined";
import ViewWeekOutlinedIcon from "@mui/icons-material/ViewWeekOutlined";
import ViewModuleOutlinedIcon from "@mui/icons-material/ViewModuleOutlined";
import CalendarViewMonthOutlinedIcon from "@mui/icons-material/CalendarViewMonthOutlined";

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
}) => {
  const theme = useTheme();

  const isTablet = useMediaQuery(
    theme.breakpoints.down("md")
  );

  // ============================================================
  // VIEW OPTIONS
  // ============================================================

  const viewOptions = [
    {
      value: "day",
      label: "Day",
      icon: <ViewDayOutlinedIcon />,
    },
    {
      value: "week",
      label: "Week",
      icon: <ViewWeekOutlinedIcon />,
    },
    {
      value: "month",
      label: "Month",
      icon: <CalendarViewMonthOutlinedIcon />,
    },
    {
      value: "year",
      label: "Year",
      icon: <ViewModuleOutlinedIcon />,
    },
  ];

  // ============================================================
  // COMMON ICON BUTTON STYLE
  // ============================================================

  const navigationButtonSx = {
    width: "34px",
    height: "34px",

    p: 0,

    flexShrink: 0,

    border: "1px solid",
    borderColor: "divider",

    borderRadius: "8px",

    color: "text.secondary",

    bgcolor: "background.paper",

    transition: "all 0.2s ease",

    "& svg": {
      fontSize: "14px",
    },

    "&:hover": {
      color: "primary.main",

      borderColor: "primary.light",

      bgcolor: "secondary.light",
    },
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",

        mt: "8px",
        mb: "12px",

        px: {
          xs: "10px",
          sm: "12px",
        },

        py: {
          xs: "9px",
          sm: "10px",
        },

        bgcolor: "background.paper",

        border: "1px solid",
        borderColor: "divider",

        borderRadius: "10px",

        boxShadow: `0 2px 8px ${alpha(
          theme.palette.text.primary,
          0.035
        )}`,

        overflow: "visible",
      }}
    >
      <Box
        sx={{
          display: "flex",

          flexDirection: {
            xs: "column",
            sm: "row",
          },

          alignItems: {
            xs: "stretch",
            sm: "center",
          },

          justifyContent: "space-between",

          gap: {
            xs: "9px",
            sm: "12px",
          },
        }}
      >
        {/* ====================================================
            LEFT - DATE NAVIGATION
        ==================================================== */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",

            gap: "6px",

            minWidth: 0,
          }}
        >
          {/* PREVIOUS */}

          <Tooltip title="Previous">
            <IconButton
              size="small"
              onClick={handlePrevious}
              sx={navigationButtonSx}
            >
              <ArrowBackIosNewRoundedIcon />
            </IconButton>
          </Tooltip>

          {/* DATE PICKER */}

          <DatePicker
            value={selectedDate}
            onChange={(newValue) => {
              if (newValue) {
                setSelectedDate(
                  dayjs(newValue)
                );
              }
            }}
            slots={{
              openPickerIcon:
                CalendarTodayOutlinedIcon,
            }}
            slotProps={{
              textField: {
                size: "small",

                sx: {
                  width: {
                    xs: "100%",
                    sm: "150px",
                  },

                  flex: {
                    xs: 1,
                    sm: "initial",
                  },

                  "& .MuiOutlinedInput-root":
                    {
                      height: "34px",

                      borderRadius: "8px",

                      bgcolor:
                        "background.paper",

                      fontSize:
                        "12.5px",

                      color:
                        "text.primary",

                      "& fieldset": {
                        borderColor:
                          "divider",
                      },

                      "&:hover fieldset":
                        {
                          borderColor:
                            "primary.light",
                        },

                      "&.Mui-focused fieldset":
                        {
                          borderColor:
                            "primary.main",

                          borderWidth:
                            "1px",
                        },
                    },

                  "& .MuiInputBase-input":
                    {
                      py: 0,

                      px: "10px",

                      fontSize:
                        "12.5px",

                      fontWeight: 550,
                    },

                  "& .MuiIconButton-root":
                    {
                      p: "5px",

                      color:
                        "primary.main",
                    },

                  "& .MuiSvgIcon-root":
                    {
                      fontSize:
                        "17px",
                    },
                },
              },
            }}
          />

          {/* NEXT */}

          <Tooltip title="Next">
            <IconButton
              size="small"
              onClick={handleNext}
              sx={navigationButtonSx}
            >
              <ArrowForwardIosRoundedIcon />
            </IconButton>
          </Tooltip>

          {/* TODAY */}

          <Button
            variant="outlined"
            size="small"
            onClick={handleToday}
            startIcon={
              <TodayOutlinedIcon />
            }
            sx={{
              height: "34px",

              minWidth: "auto",

              px: {
                xs: "9px",
                sm: "11px",
              },

              borderRadius: "8px",

              borderColor: "divider",

              color: "text.secondary",

              bgcolor:
                "background.paper",

              textTransform: "none",

              fontSize: "12.5px",
              fontWeight: 600,

              whiteSpace: "nowrap",

              "& .MuiButton-startIcon":
                {
                  mr: {
                    xs: 0,
                    sm: "5px",
                  },

                  "& svg": {
                    fontSize:
                      "16px",
                  },
                },

              "&:hover": {
                color:
                  "primary.main",

                borderColor:
                  "primary.light",

                bgcolor:
                  "secondary.light",
              },

              // Mobile par sirf icon
              "& .todayText": {
                display: {
                  xs: "none",
                  sm: "inline",
                },
              },
            }}
          >
            <Box
              component="span"
              className="todayText"
            >
              Today
            </Box>
          </Button>
        </Box>

        {/* ====================================================
            RIGHT - VIEW SWITCHER
        ==================================================== */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",

            justifyContent: {
              xs: "flex-end",
              sm: "flex-start",
            },
          }}
        >
          {/* ==================================================
              DESKTOP
          ================================================== */}

          {!isTablet ? (
            <ToggleButtonGroup
              value={view}
              exclusive
              size="small"
              onChange={(
                event,
                newView
              ) => {
                if (newView) {
                  setView(newView);
                }
              }}
              sx={{
                height: "34px",

                bgcolor:
                  "background.default",

                borderRadius:
                  "8px",

                p: "2px",

                "& .MuiToggleButtonGroup-grouped":
                  {
                    border:
                      "none !important",

                    borderRadius:
                      "6px !important",

                    mx: "1px",
                  },

                "& .MuiToggleButton-root":
                  {
                    minWidth:
                      "72px",

                    height: "30px",

                    px: "10px",

                    gap: "5px",

                    color:
                      "text.secondary",

                    bgcolor:
                      "transparent",

                    textTransform:
                      "none",

                    fontSize:
                      "12.5px",

                    lineHeight: 1,

                    fontWeight:
                      550,

                    transition:
                      "all 0.15s ease",

                    "& svg": {
                      fontSize:
                        "15px",
                    },

                    "&:hover": {
                      color:
                        "primary.main",

                      bgcolor: alpha(
                        theme.palette
                          .primary
                          .main,
                        0.05
                      ),
                    },

                    "&.Mui-selected":
                      {
                        color:
                          "primary.main",

                        bgcolor:
                          "background.paper",

                        fontWeight:
                          650,

                        boxShadow:
                          "0 1px 4px rgba(15, 23, 42, 0.08)",

                        "&:hover": {
                          bgcolor:
                            "background.paper",
                        },
                      },
                  },
              }}
            >
              {viewOptions.map(
                (option) => (
                  <ToggleButton
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {React.cloneElement(
                      option.icon,
                      {
                        fontSize:
                          "small",
                      }
                    )}

                    {option.label}
                  </ToggleButton>
                )
              )}
            </ToggleButtonGroup>
          ) : (
            /* ================================================
               TABLET / MOBILE
            ================================================ */

            <Select
              size="small"
              value={view}
              onChange={(event) =>
                setView(
                  event.target.value
                )
              }
              sx={{
                minWidth: {
                  xs: "110px",
                  sm: "125px",
                },

                height: "34px",

                borderRadius: "8px",

                bgcolor:
                  "background.paper",

                color:
                  "text.primary",

                fontSize: "12.5px",

                "& .MuiSelect-select":
                  {
                    py: 0,

                    display: "flex",
                    alignItems:
                      "center",

                    fontSize:
                      "12.5px",
                  },

                "& .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor:
                      "divider",
                  },

                "&:hover .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor:
                      "primary.light",
                  },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor:
                      "primary.main",

                    borderWidth:
                      "1px",
                  },
              }}
            >
              {viewOptions.map(
                (option) => (
                  <MenuItem
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                    sx={{
                      minHeight:
                        "36px",

                      fontSize:
                        "12.5px",
                    }}
                  >
                    <Box
                      sx={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap: "7px",

                        "& svg":
                          {
                            fontSize:
                              "16px",

                            color:
                              "primary.main",
                          },
                      }}
                    >
                      {option.icon}

                      {option.label}
                    </Box>
                  </MenuItem>
                )
              )}
            </Select>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default CalendarControls;