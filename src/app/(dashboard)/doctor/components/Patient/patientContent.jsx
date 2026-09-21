"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import OnOffCard from "./on-offCard";
import PatientCard from "./patientCard";
import { scheduleService } from "../../services/api";

const PatientContent = () => {
  const theme = useTheme();
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("day");
  const [cardMode, setCardMode] = useState("online");
  const [tableMode, setTableMode] = useState("online");

  const selectStyle = {
    "& .MuiInputLabel-root": {
      fontSize: "13px",
      color: theme.palette.text.secondary,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: theme.palette.primary.main,
    },
    "& .MuiOutlinedInput-root": {
      height: 42,
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
    "& .MuiSelect-select": {
      fontSize: "13px",
    },
  };

  const menuProps = {
    PaperProps: {
      sx: {
        maxHeight: 300,
        "& .MuiMenuItem-root": {
          fontSize: "13px",
        },
      },
    },
  };

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await scheduleService.getHospitals();
        const hospitalData = Array.isArray(data?.data) ? data.data : [];

        setHospitals(hospitalData);

        if (hospitalData.length) {
          setSelectedHospital(hospitalData[0]?.hospitalName || "");
        }
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        setHospitals([]);
        setSelectedHospital("");
      }
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    const fetchDashboardCards = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setDashboardData(null);
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/patient-dashboard-cards`,
          {
            params: {
              filter: selectedFilter,
              mode: cardMode,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data?.success) {
          setDashboardData(response.data?.data || null);
        } else {
          setDashboardData(null);
        }
      } catch (error) {
        console.error(
          "Error fetching dashboard cards:",
          error.response?.data || error.message
        );
        setDashboardData(null);
      }
    };

    fetchDashboardCards();
  }, [selectedFilter, cardMode]);

  return (
    <Box
      sx={{
        // minHeight: "100vh",
        mt: { xs: 6, sm: 7.5 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height:"100vh",
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          // p
          pt:4,
          px:3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            gap: 1.5,
            mb: 1.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              Patient Overview
            </Typography>

            <Typography
              sx={{
                mt: 0.25,
                fontSize: "11px",
                color: theme.palette.text.secondary,
              }}
            >
              Filter patient statistics by period and consultation mode
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              width: { xs: "100%", md: "auto" },
            }}
          >
            <FormControl
              size="small"
              sx={{
                ...selectStyle,
                width: { xs: "100%", sm: 160 },
              }}
            >
              <InputLabel>Period</InputLabel>

              <Select
                value={selectedFilter}
                label="Period"
                onChange={(e) => setSelectedFilter(e.target.value)}
                MenuProps={menuProps}
              >
                <MenuItem value="day">Today</MenuItem>
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="year">Yearly</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{
                ...selectStyle,
                width: { xs: "100%", sm: 160 },
              }}
            >
              <InputLabel>Patient Mode</InputLabel>

              <Select
                value={cardMode}
                label="Patient Mode"
                onChange={(e) => setCardMode(e.target.value)}
                MenuProps={menuProps}
              >
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <PatientCard
          dashboardData={dashboardData}
          selectedMode={cardMode}
        />

        <Box
          sx={{
            mt: { xs: 2.5, sm: 3 },
            mb: 1.5,
          }}
        >
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            Appointments
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: "11px",
              color: theme.palette.text.secondary,
            }}
          >
            Select hospital and consultation mode to manage appointments
          </Typography>
        </Box>

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, md: 8 }}>
            <FormControl
              fullWidth
              size="small"
              disabled={!hospitals.length}
              sx={selectStyle}
            >
              <InputLabel>Select Hospital</InputLabel>

              <Select
                value={selectedHospital}
                label="Select Hospital"
                onChange={(e) => setSelectedHospital(e.target.value)}
                MenuProps={menuProps}
              >
                {hospitals.map((hospital, index) => {
                  const hospitalName = hospital?.hospitalName || "";

                  const location = [
                    hospital?.landmark,
                    hospital?.city,
                  ]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <MenuItem
                      key={hospital?.id || hospital?._id || index}
                      value={hospitalName}
                      disabled={!hospitalName}
                    >
                      {location
                        ? `${hospitalName} - ${location}`
                        : hospitalName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl
              fullWidth
              size="small"
              sx={selectStyle}
            >
              <InputLabel>Consultation Mode</InputLabel>

              <Select
                value={tableMode}
                label="Consultation Mode"
                onChange={(e) => setTableMode(e.target.value)}
                MenuProps={menuProps}
              >
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 1.5 }}>
          <OnOffCard
            selectedHospital={selectedHospital}
            selectedMode={tableMode}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PatientContent;