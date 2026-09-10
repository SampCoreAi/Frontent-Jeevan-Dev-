"use client";

import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  Chip,
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ScienceIcon from "@mui/icons-material/Science";

const EVisitTable = () => {
  const rows = [
    {
      date: "05-10-2025",
      doctor: "Dr. Sarah Wilson",
      place: "Mumbai",
    },
    {
      date: "15-10-2025",
      doctor: "Dr. Michael Chen",
      place: "Delhi",
    },
    {
      date: "25-10-2025",
      doctor: "Dr. Emily Davis",
      place: "Goa",
     
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        background: "linear-gradient(145deg, #ffffff 0%, #f3f8f7 100%)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* HEADER */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #009688 0%, #004d40 100%)",
            color: "white",
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(10px)",
              width: 56,
              height: 56,
            }}
          >
            <WifiIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Patient Visit History
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              View and download your past consultation records
            </Typography>
          </Box>
        </Box>

        {/* TABLE */}
        <TableContainer
  component={Paper}
  elevation={0}
  sx={{
    background: "transparent",
    borderRadius: 0,
    overflowY: "auto",
    scrollbarWidth: "none", // Firefox ke liye
    "&::-webkit-scrollbar": {
      display: "none", // Chrome, Safari, Edge
    },
  }}
>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)",
                }}
              >
                {[
                  "Date",
                  "Doctor",
                  "Place",
                 
                  "Doctor Report",
                  "Lab Report",
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.95rem",
                      py: 1.8,
                      color: "#004d40",
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#fafafa" : "#ffffff",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%)",
                      transform: "scale(1.005)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Typography fontWeight="bold" color="#004d40">
                      {row.date}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      
                      <Typography fontWeight="600">{row.doctor}</Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Typography>{row.place}</Typography>
                  </TableCell>

                  

                  <TableCell sx={{ py: 2 }}>
                    <Tooltip title="View Doctor Report">
                      <Button
                        variant="contained"
                        startIcon={<MedicalServicesIcon />}
                        endIcon={<VisibilityIcon />}
                        sx={{
                          background:
                            "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                          borderRadius: 1,
                          textTransform: "none",
                          fontWeight: "bold",
                          px: 2,
                          boxShadow: "0 2px 8px rgba(25,118,210,0.3)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                          },
                        }}
                      >
                        View
                      </Button>
                    </Tooltip>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Tooltip title="Download Lab Report">
                      <Button
                        variant="contained"
                        startIcon={<ScienceIcon />}
                        endIcon={<DownloadIcon />}
                        sx={{
                          background:
                            "linear-gradient(135deg, #ec407a 0%, #d81b60 100%)",
                          borderRadius: 1,
                          textTransform: "none",
                          fontWeight: "bold",
                          px: 2,
                          boxShadow: "0 2px 8px rgba(236,64,122,0.3)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #d81b60 0%, #c2185b 100%)",
                          },
                        }}
                      >
                        View
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default EVisitTable;
