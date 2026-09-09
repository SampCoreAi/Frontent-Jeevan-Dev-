"use client";

import React, { useMemo } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";
import RegistrationTableRow from "./RegistrationTableRow";

const RegistrationTable = ({
  registrations = [],
  loading = false,
  getStatusColor = () => "default",
  onViewDocuments = () => {},
}) => {
  // Memoize columns to prevent recreation on each render
  const columns = useMemo(() => [
    "ID",
    "Doctor",
    "Gender",
    "Age",
    "Contact",
    "Medical Registration",
    "Qualification",
    "Status",
    "Action",
  ], []);

  return (
    <Paper
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      }}
    >
      <TableContainer
        sx={{
          maxHeight: "calc(100vh - 280px)",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((heading) => (
                <TableCell
                  key={heading}
                  sx={{
                    fontWeight: 700,
                    color: "#334155",
                    backgroundColor: "#f1f5f9",
                    whiteSpace: "nowrap",
                  }}
                >
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                  <CircularProgress
                    size={35}
                    sx={{ color: "#1e6658" }}
                    aria-label="Loading registrations"
                  />
                  <Typography
                    sx={{
                      mt: 1.5,
                      color: "#64748b",
                    }}
                  >
                    Loading registrations...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : registrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                  <Typography sx={{ color: "#64748b" }}>
                    No doctor registrations found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              registrations.map((doctor, index) => (
                <RegistrationTableRow
                  key={doctor.id || `row-${index}`}
                  doctor={doctor}
                  getStatusColor={getStatusColor}
                  onViewDocuments={onViewDocuments}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RegistrationTable;