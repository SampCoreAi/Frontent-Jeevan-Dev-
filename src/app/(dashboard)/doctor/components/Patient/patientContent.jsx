"use client";

import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  Divider,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import OnOffCard from "./on-offCard";
import PatientCard from "./patientCard";

import { scheduleService } from "../../services/api";

const PatientContent = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedMode, setSelectedMode] = useState("online");
  const [selectedFilter, setSelectedFilter] = useState("day");
  const [cardMode, setCardMode] = useState("online");
  const [tableMode, setTableMode] = useState("online");
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await scheduleService.getHospitals();

        const hospitalData = data.data || [];

        setHospitals(hospitalData);

        if (hospitalData.length > 0) {
          setSelectedHospital(hospitalData[0].hospitalName);
        }
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        setHospitals([]);
      }
    };

    fetchHospitals();
  }, []);

useEffect(() => {
  const fetchDashboardCards = async () => {
    try {
      const token = localStorage.getItem("token");

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

      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error(
        "Error fetching dashboard cards:",
        error.response?.data || error.message
      );
    }
  };

  fetchDashboardCards();
}, [selectedFilter, cardMode]);
  return (
   <Box
         sx={{
           width: {
             xs: "30%",
             sm: "100%",
             md: "60%",
             lg: "100%",
             xl: "100%",
   
             "@media (min-width: 375px)": {
               width: "35%",
             },
   
             "@media (min-width: 425px)": {
               width: "40%",
             },
   
             "@media (min-width: 600px)": {
               width: "70%",
             },
   
            
   
             "@media (min-width: 1024px)": {
               width: "67%",
             },
   
             "@media (min-width: 1140px)": {
               width: "100%",
             },
           },
           minHeight: "100vh",
           mt: { xs: 6, sm: 7.5 },
           p: { xs: 1, sm: 2, md: 1 },
           bgcolor: "#f5f7f9",
   
         }}
       >

      <Grid
        container
        spacing={2}
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: "0 4px 12px #0f7468",
          overflow: "hidden",
          p: { xs: 2, sm: 3 },

        }}
      >
        <Grid
          size={12}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          {/* Filter */}
          <FormControl
            size="small"
            sx={{
              minWidth: 180,
              "& .MuiInputLabel-root": {
                color: "#1e6658",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#1e6658",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#1e6658",
                },
                "&:hover fieldset": {
                  borderColor: "#1e6658",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1e6658",
                },
              },
            }}
          >
            <InputLabel>Filter</InputLabel>

            <Select
              value={selectedFilter}
              label="Filter"
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <MenuItem value="day">Today</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="year">Yearly</MenuItem>
            </Select>
          </FormControl>

          {/* Mode */}
          <FormControl
            size="small"
            sx={{
              minWidth: 180,
              "& .MuiInputLabel-root": {
                color: "#1e6658",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#1e6658",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#1e6658",
                },
                "&:hover fieldset": {
                  borderColor: "#1e6658",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1e6658",
                },
              },
            }}
          >
            <InputLabel>Mode</InputLabel>

            <Select
              value={cardMode}
              label="Mode"
              onChange={(e) => setCardMode(e.target.value)}
            >
              <MenuItem value="online">Online</MenuItem>
              <MenuItem value="offline">Offline</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={12}>
          <PatientCard
            dashboardData={dashboardData}
            selectedMode={cardMode}
          />
        </Grid>

        {/* <Grid size={{ xs: 12, lg: 6 }}>
          <PatientDetailsCard />
        </Grid> */}

        <Grid sx={{ mt: 2, mb: 2, gap: 2, display: "flex", width: "100%" }}>
          {/* Left Half */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                  color: "#1e6658",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#1e6658",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#1e6658",
                  },
                  "&:hover fieldset": {
                    borderColor: "#1e6658",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1e6658",
                  },
                },
              }}
            >
              <InputLabel id="hospital-select-label">
                Select Hospital
              </InputLabel>

              <Select
                labelId="hospital-select-label"
                value={selectedHospital}
                label="Select Hospital"
                onChange={(e) => setSelectedHospital(e.target.value)}
              >
                {hospitals.length > 0 ? (
                  hospitals.map((h, i) => (
                    <MenuItem key={i} value={h.hospitalName}>
                      {`${h.hospitalName} - ${h.landmark}, ${h.city}`}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No hospitals found</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Right Half */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                  color: "#1e6658",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#1e6658",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#1e6658",
                  },
                  "&:hover fieldset": {
                    borderColor: "#1e6658",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1e6658",
                  },
                },
              }}
            >
              <InputLabel>Select Mode</InputLabel>

              <Select
                value={tableMode}
                label="Select Mode"
                onChange={(e) => setTableMode(e.target.value)}
              >
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Divider */}

        {/* OnOff Card */}
        <Grid size={12}>
          <OnOffCard
            selectedHospital={selectedHospital}
            selectedMode={tableMode}
          />
        </Grid>
      </Grid>


    </Box>
  );
};

export default PatientContent;