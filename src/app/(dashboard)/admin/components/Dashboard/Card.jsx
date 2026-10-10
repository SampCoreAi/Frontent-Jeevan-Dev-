"use client";

import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import BiotechOutlinedIcon from "@mui/icons-material/BiotechOutlined";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const DashboardCard = ({
  filter,
  setFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  dashboardData,
  loading,
}) => {
  // =====================================================
  // ROLE CARDS
  // =====================================================
  const cards = [
    {
      icon: PersonIcon,
      title: "Patients",
      value: dashboardData?.patients ?? 0,
    },
    {
      icon: LocalHospitalIcon,
      title: "Doctors",
      value: dashboardData?.doctors ?? 0,
    },
    {
      icon: SupportAgentIcon,
      title: "Doctor Assistants",
      value: dashboardData?.assistants ?? 0,
    },
    {
      icon: ScienceOutlinedIcon,
      title: "Labs",
      value: dashboardData?.labs ?? 0,
    },
    {
      icon: BiotechOutlinedIcon,
      title: "Lab Assistants",
      value: dashboardData?.labAssistants ?? 0,
    },
    {
      icon: LocalPharmacyOutlinedIcon,
      title: "Medical Stores",
      value: dashboardData?.medicalStores ?? 0,
    },
  ];

  // =====================================================
  // CARD
  // =====================================================
  const renderCard = (item) => {
    const Icon = item.icon;

    return (
      <Grid
        key={item.title}
        size={{
          xs: 12,
          sm: 6,
          md: 4,
          lg: 2,
        }}
      >
        <Paper
          sx={{
            height: "100%",

            p: 1.5,

            borderRadius: 2,

            // Theme light mode = #EDF7F2
            bgcolor: "secondary.light",

            border: "1px solid",
            borderColor: "divider",

            boxShadow: "none",

            transition:
              "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",

            "&:hover": {
              transform: "translateY(-2px)",

              borderColor: "primary.main",

              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 4px 12px rgba(0,0,0,0.18)"
                  : "0 4px 12px rgba(15,23,42,0.06)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",

              gap: 1.25,

              // Compact height
              minHeight: 50,
            }}
          >
            {/* ICON */}
            <Box
              sx={{
                width: 36,
                height: 36,

                flexShrink: 0,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderRadius: 1.5,

                bgcolor: "background.paper",

                border: "1px solid",
                borderColor: "divider",

                color: "primary.main",
              }}
            >
              <Icon
                sx={{
                  fontSize: 20,
                }}
              />
            </Box>

            {/* CONTENT */}
            <Box
              sx={{
                minWidth: 0,
              }}
            >
              <Typography
                variant="body2"
                noWrap
                sx={{
                  color: "text.primary",
                  mb: 0.1,
                }}
              >
                {item.title}
              </Typography>

              <Typography
                component="div"
                sx={{
                  fontSize: "22px",
                  lineHeight: 1.15,

                  fontWeight: 700,

                  color: "text.primary",
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={17}
                    thickness={4}
                    color="primary"
                  />
                ) : (
                  item.value
                )}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
    );
  };

  return (
    <Box>
      {/* =================================================
          HEADER
      ================================================= */}
      <Box
        sx={{
          display: "flex",

          justifyContent: "space-between",

          alignItems: {
            xs: "flex-start",
            sm: "center",
          },

          flexDirection: {
            xs: "column",
            sm: "row",
          },

          gap: 1.5,

          mb: 2,
        }}
      >
        {/* TITLE */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              color: "text.primary",
            }}
          >
            Dashboard
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.25,

              color: "text.secondary",
            }}
          >
            Overview of users and healthcare partners
          </Typography>
        </Box>

        {/* FILTER */}
        <FormControl
          size="small"
          sx={{
            width: {
              xs: "100%",
              sm: 160,
            },
          }}
        >
          <Select
            value={filter}
            onChange={(e) => {
              const value = e.target.value;

              setFilter(value);

              if (value !== "custom") {
                setStartDate(null);
                setEndDate(null);
              }
            }}
          >
            <MenuItem value="today">
              Today
            </MenuItem>

            <MenuItem value="week">
              This Week
            </MenuItem>

            <MenuItem value="month">
              This Month
            </MenuItem>

            <MenuItem value="year">
              This Year
            </MenuItem>

            <MenuItem value="custom">
              Custom Date
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* =================================================
          CUSTOM DATE FILTER
      ================================================= */}
      {filter === "custom" && (
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
        >
          <Paper
            variant="outlined"
            sx={{
              p: 1.25,

              mb: 1.5,

              borderRadius: 2,

              borderColor: "divider",

              bgcolor: "background.paper",

              boxShadow: "none",
            }}
          >
            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: 1.25,

                flexWrap: "wrap",
              }}
            >
              <DatePicker
                label="From Date"
                value={startDate}
                onChange={(value) =>
                  setStartDate(value)
                }
                slotProps={{
                  textField: {
                    size: "small",

                    sx: {
                      width: {
                        xs: "100%",
                        sm: 170,
                      },
                    },
                  },
                }}
              />

              <DatePicker
                label="To Date"
                value={endDate}
                minDate={startDate || undefined}
                onChange={(value) =>
                  setEndDate(value)
                }
                slotProps={{
                  textField: {
                    size: "small",

                    sx: {
                      width: {
                        xs: "100%",
                        sm: 170,
                      },
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </LocalizationProvider>
      )}

      {/* =================================================
          6 ROLE CARDS
      ================================================= */}
      <Grid
        container
        spacing={1.5}
      >
        {cards.map(renderCard)}
      </Grid>
    </Box>
  );
};

export default DashboardCard;