"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");

    const res = await axios.get(
  `${API_URL}/api/user/getAllUsers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setPatients(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          mt:7.5
        }}
      >
        <Table>
          <TableHead sx={{ background: "#0f7468" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Patient
              </TableCell>

              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Username
              </TableCell>

              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Email
              </TableCell>

              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Phone
              </TableCell>

              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Age
              </TableCell>

              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Gender
              </TableCell>

              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Blood Group
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <TableRow key={patient.user_id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar>
                        {patient.full_name?.charAt(0)?.toUpperCase()}
                      </Avatar>

                      <Typography fontWeight={500}>
                        {patient.full_name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>{patient.username || "-"}</TableCell>

                  <TableCell>{patient.email}</TableCell>

                  <TableCell>{patient.phone_number}</TableCell>

                  <TableCell>{patient.age || "-"}</TableCell>

                  <TableCell>{patient.gender || "-"}</TableCell>

                  <TableCell>{patient.blood_group || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No Patients Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}