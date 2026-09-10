"use client";

import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Download } from "@mui/icons-material";

export default function QRTable({
  qrData,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  total,
}) {
  const [statusFilter, setStatusFilter] = useState("AVAILABLE");

  const filteredData = (qrData || []).filter(
    (item) => item.status === statusFilter
  );

  const handleDownload = async (imageUrl, fileName) => {
    try {
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(`Image fetch failed: ${response.status}`);
      }

      const blob = await response.blob();

      if (!blob.type.startsWith("image/")) {
        throw new Error("Server did not return a valid image");
      }

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("QR Download Error:", error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 2,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>

          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="AVAILABLE">Available</MenuItem>
            <MenuItem value="ASSIGNED">Assigned</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0 4px 12px rgba(15, 116, 104, 0.15)",
          borderRadius: 2,
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5faf8" }}>
              <TableCell sx={{ fontWeight: 600 }}>QR Code</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Doctor ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{item.qr_code}</TableCell>

                <TableCell>
                  <Chip
                    label={item.status}
                    size="small"
                    sx={{
                      borderRadius: 1,
                      color: "#0f7468",
                      backgroundColor: "#e1f5ef",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                    }}
                  />
                </TableCell>

                <TableCell>
                  {item.doctor_user_id ?? "-"}
                </TableCell>

                <TableCell>
                  <IconButton
                    onClick={() =>
                      handleDownload(
                        `${process.env.NEXT_PUBLIC_API_URL}/${item.qr_image}`,
                        `${item.qr_code}.png`
                      )
                    }
                    sx={{
                      color: "#0f7468",
                      backgroundColor: "#e1f5ef",
                      "&:hover": {
                        backgroundColor: "#c8ede3",
                      },
                      borderRadius: 1,
                      p: 1,
                    }}
                    size="small"
                  >
                    <Download fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No QR Codes Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 20]}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </Box>
  );
}