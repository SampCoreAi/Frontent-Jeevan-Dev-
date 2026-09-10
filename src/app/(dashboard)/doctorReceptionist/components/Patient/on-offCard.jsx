"use client";
import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import WifiIcon from "@mui/icons-material/Wifi";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import PatientDetailsCard from "./PatientDetailsCard";
import CustomToolbar from "../../components/CustomToolbar";

const onlinePatients = [
  { id: 102345, appointmentId: 102345, name: "Ravi Kumar", diagnology: "Fever", date: "05-10-2025", mode: "Online", status: "In Progress" },
  { id: 203456, appointmentId: 203456, name: "Amit Verma", diagnology: "Cold", date: "15-10-2025", mode: "Online", status: "Pending" },
  { id: 304567, appointmentId: 304567, name: "Sunita Das", diagnology: "Diabetes", date: "25-10-2025", mode: "Virtual", status: "Pending" },
];

const offlinePatients = [
  { id: 405678, appointmentId: 405678, name: "Neha Singh", diagnology: "Diabetes", date: "05-10-2025", mode: "Offline", status: "Pending" },
  { id: 506789, appointmentId: 506789, name: "Priya Patel", diagnology: "Fever", date: "05-10-2025", mode: "Offline", status: "Pending" },
  { id: 607890, appointmentId: 607890, name: "Arjun Yadav", diagnology: "Cold", date: "05-10-2025", mode: "Offline", status: "Pending" },
];

export default function Home() {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [onlinePagination, setOnlinePagination] = useState({ page: 0, pageSize: 5 });
  const [offlinePagination, setOfflinePagination] = useState({ page: 0, pageSize: 5 });
  const router = useRouter();

  const handleOpen = (patient) => {
    setSelectedPatient(patient);
    setOpen(true);
  };

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setSelectedPatient(null);
  };

  const handleClose = () => {
    setOpen(false);
    setToken("");
  };

  const handleNext = () => {
    router.push("/doctor/pages/prescription");
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
  
    { field: "date", headerName: "Date", flex: 1 },
    { field: "appointmentId", headerName: "Appointment ID", flex: 1 },
    { field: "mode", headerName: "Mode", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "details",
      headerName: "Details",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          sx={{ backgroundColor: "#e6f6ed", color: "#000" }}
          onClick={() => handleView(params.row)}
        >
          View
        </Button>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
            renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          sx={{ backgroundColor: "#e6f6ed", color: "#000" }}
          onClick={() => handleView(params.row)}
        >
          View
        </Button>
      ),
      renderCell: (params) => (
        
        <Button
          variant="contained"
          size="small"
          onClick={() => handleOpen(params.row)}
        >
          Start
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fbfdfc", p: 2 }}>
      <Grid container spacing={2}>
        {/* Online Patients */}
        <Grid item xs={12} md={12}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <WifiIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                E - Visit
              </Typography>
            </Box>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={onlinePatients}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                paginationModel={onlinePagination}
                onPaginationModelChange={setOnlinePagination}
                slots={{ toolbar: CustomToolbar }}
                disableRowSelectionOnClick
              />
            </div>
          </Paper>
        </Grid>

        {/* Offline Patients */}
        <Grid item xs={12} md={12}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <OfflineBoltIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Clinic Visit
              </Typography>
            </Box>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={offlinePatients}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                paginationModel={offlinePagination}
                onPaginationModelChange={setOfflinePagination}
                slots={{ toolbar: CustomToolbar }}
                disableRowSelectionOnClick
              />
            </div>
          </Paper>
        </Grid>
      </Grid>

      {/* View Details Dialog */}
      <Dialog
        open={viewOpen}
        onClose={handleViewClose}
        PaperProps={{ sx: { width: 550, maxHeight: "90vh", overflow: "hidden", position: "relative" } }}
      >
        <IconButton
          onClick={handleViewClose}
          sx={{ position: "absolute", top: -3, right: -4, zIndex: 10 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <PatientDetailsCard patient={selectedPatient} />
        </DialogContent>
      </Dialog>

      {/* Token Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <Box sx={{ width: 400 }}>
          <DialogTitle>Enter Token</DialogTitle>
          <DialogContent>
            <TextField
              label="Token"
              variant="outlined"
              fullWidth
              value={token}
              onChange={(e) => setToken(e.target.value)}
              sx={{ mt: 1, "& .MuiInputLabel-root": { color: "#000" } }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">Cancel</Button>
            <Button onClick={handleNext} variant="contained">Next</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
