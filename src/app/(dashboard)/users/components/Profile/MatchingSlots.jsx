import React, { useState, useEffect } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import api from "../../../../../utils/axiosInstance";

const MatchingSlots = ({ userProfile }) => {

  
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCity, setUserCity] = useState("");

  // Extract city from user's address
  useEffect(() => {
    if (userProfile?.address) {
      
      let addressStr = "";
      if (Array.isArray(userProfile.address)) {
        addressStr = userProfile.address.join(" ");
      } else {
        addressStr = userProfile.address;
      }
      
      // Parse city from address string
      // Handle both JSON string and plain text formats
      try {
        // Try to parse as JSON first
        const cleanedStr = addressStr.replace(/["{}]/g, "").replace(/,\s*"/g, ',"');

        
        const addressObj = JSON.parse(cleanedStr);
        
        if (addressObj.city) {
          const city = addressObj.city.toLowerCase().trim();
          setUserCity(city);
        }
      } catch (error) {
        console.log("JSON parsing failed, trying regex:", error);
        
        // If parsing fails, try to extract city from plain text
        const cityMatch = addressStr.match(/city["\s:]+([^,}\s"]+)/i);
        if (cityMatch) {
          const city = cityMatch[1].toLowerCase().trim();
          setUserCity(city);
        } else {
          // Try to find city in array format
          const cityInArrayMatch = addressStr.match(/"city"\s*:\s*"([^"]+)"/i);
          if (cityInArrayMatch) {
            const city = cityInArrayMatch[1].toLowerCase().trim();
            setUserCity(city);
          }
        }
      }
    }
  }, [userProfile]);

  // Fetch schedules for the doctor
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
     
        if (!doctorId) {
          setError("Doctor ID not found");
          setLoading(false);
          return;
        }

       const response = await api.get(
  `/api/schedules/getSchedulePublicByDoctorId/${doctorId}`
);

        setSchedules(response.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching schedules:", err);
        setError("Failed to fetch schedules");
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // Filter schedules based on city matching
  useEffect(() => {

    
    if (schedules.length > 0) {
      if (!userCity) {
        setFilteredSchedules([]);
        return;
      }
      
      const filtered = schedules.filter((schedule) => {
        try {
          // Parse hospital_name JSON to extract city
          const hospitalData = JSON.parse(schedule.hospital_name);
          const scheduleCity = hospitalData.city?.toLowerCase().trim();
       
          return scheduleCity === userCity;
        } catch (err) {
          console.error("Error parsing hospital name:", err);
          return false;
        }
      });
      
     
      setFilteredSchedules(filtered);
    } else {
      setFilteredSchedules([]);
    }
  }, [schedules, userCity]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!userCity) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        City not found in your profile. Please update your address information.
      </Alert>
    );
  }

  if (filteredSchedules.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        No schedules found in your city ({userCity}).
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      {/* Debug Info */}
      <Box sx={{ mb: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          Debug: userCity = "{userCity}" | filteredSchedules = {filteredSchedules.length} | schedules = {schedules.length}
        </Typography>
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontSize: "1.2rem",
          fontWeight: 700,
          color: "#1c573e",
          mb: 2,
        }}
      >
        Available Slots in Your City ({userCity || "Not Found"})
      </Typography>

      <Grid container spacing={2}>
        {filteredSchedules.map((schedule) => (
          <Grid item xs={12} md={6} key={schedule.id}>
            <Card
              sx={{
                border: "1px solid #e3e7ea",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#1c573e",
                    mb: 1,
                  }}
                >
                  {(() => {
                    try {
                      const hospitalData = JSON.parse(schedule.hospital_name);
                      return hospitalData.hospitalName || "Hospital";
                    } catch {
                      return "Hospital";
                    }
                  })()}
                </Typography>

                <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
                  {(() => {
                    try {
                      const hospitalData = JSON.parse(schedule.hospital_name);
                      return `${hospitalData.landmark || ""}, ${hospitalData.city || ""}, ${hospitalData.state || ""}`;
                    } catch {
                      return schedule.hospital_name;
                    }
                  })()}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Schedule:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {schedule.start_time} - {schedule.end_time}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Duration: {schedule.slot_duration} mins
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Active Days:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {schedule.active_days.map((day) => (
                      <Chip
                        key={day}
                        label={day}
                        size="small"
                        sx={{
                          backgroundColor: "#15b8a7",
                          color: "white",
                          fontSize: "0.75rem",
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Available Slots:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {schedule.slots.map((slot, index) => (
                      <Chip
                        key={index}
                        label={`${slot.start} - ${slot.end}`}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: "#15b8a7",
                          color: "#15b8a7",
                          fontSize: "0.75rem",
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: "#15b8a7",
                    "&:hover": { backgroundColor: "#0fa192" },
                    borderRadius: "8px",
                    textTransform: "none",
                  }}
                  onClick={() => {
                    // Navigate to appointment page with this schedule
                    window.location.href = `/dashboard/users/appointment?id=${schedule.doctor_id}`;
                  }}
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MatchingSlots;
