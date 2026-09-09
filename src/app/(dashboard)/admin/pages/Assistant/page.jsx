"use client"

import { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Autocomplete,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Avatar,
  Chip,
} from "@mui/material";

const DoctorAssistant = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assistants, setAssistants] = useState([]);
const API_URL = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    getDoctors();
  }, []);

 const getDoctors = async () => {
  try {
    const res = await axios.get(
      `${API_URL}/api/doctors/getDoctors`
    );

    setDoctors(res.data.data || res.data);
  } catch (err) {
    console.log(err);
  }
};


const handleDoctorSelect = async (_, doctor) => {
  setSelectedDoctor(doctor);
  setAssistants([]);

  if (!doctor) return;

  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${API_URL}/api/assistant/getAllAssistantProfiles/${doctor.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAssistants(res.data.data || []);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <Box p={4}>

      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid #E5E7EB",
          mb: 3,
        }}
      >
        <CardContent>

          <Typography
            variant="h5"
            fontWeight={700}
            mb={3}
          >
            Doctor & Assistant Details
          </Typography>

         <Autocomplete
  options={doctors}
  value={selectedDoctor}
  onChange={handleDoctorSelect}
  getOptionLabel={(option) => option.full_name || ""}
  isOptionEqualToValue={(option, value) => option.id === value.id}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Choose Doctor"
      placeholder="Search Doctor..."
    />
  )}
/>

        </CardContent>
      </Card>

      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          mt={5}
        >
          <CircularProgress />
        </Box>
      )}

  {!loading && selectedDoctor && (
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid #E5E7EB",
          }}
        >
          <CardContent>

            <Typography
              variant="h6"
              fontWeight={700}
              mb={3}
            >
              Doctor Information
            </Typography>

            <TableContainer component={Paper} elevation={0}>
              <Table>

                <TableHead>
                  <TableRow
                    sx={{
                      background: "#F8FAFC",
                    }}
                  >
                    <TableCell>
                      <b>Doctor</b>
                    </TableCell>

                    <TableCell>
                      <b>Email</b>
                    </TableCell>

                    <TableCell>
                      <b>Phone</b>
                    </TableCell>

                    <TableCell>
                      <b>Assistant</b>
                    </TableCell>

                    <TableCell>
                      <b>Status</b>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
{assistants.map((assistant) => (
  <TableRow key={assistant.id}>
    <TableCell>
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar>
          {selectedDoctor?.full_name?.charAt(0)}
        </Avatar>

        <Typography fontWeight={600}>
          {selectedDoctor?.full_name}
        </Typography>
      </Box>
    </TableCell>

    <TableCell>
      {selectedDoctor?.email}
    </TableCell>

    <TableCell>
      {selectedDoctor?.mobile}
    </TableCell>

    <TableCell>
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: "#1976d2" }}>
          {assistant.full_name?.charAt(0)}
        </Avatar>

        <Box>
          <Typography fontWeight={600}>
            {assistant.full_name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {assistant.email}
          </Typography>
        </Box>
      </Box>
    </TableCell>

    <TableCell>
      <Chip
        label={assistant.status || "Active"}
        color="success"
        size="small"
      />
    </TableCell>
  </TableRow>
))}

                </TableBody>

              </Table>
            </TableContainer>

          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DoctorAssistant;