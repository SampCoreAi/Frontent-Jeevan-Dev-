"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import WifiIcon from "@mui/icons-material/Wifi";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import CloseIcon from "@mui/icons-material/Close";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import PatientDetailsCard from "./PatientDetailsCard";
import CustomToolbar from "../../../doctorReceptionist/components/CustomToolbar";
import { scheduleService, appointmentService } from "../../services/api"; // Ensure this path is correct
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function onOffCard({ selectedHospital, selectedMode }) {
  const router = useRouter();
const searchParams = useSearchParams();

const appointmentIdFromDashboard =
  searchParams.get("appointment_id");

const verifyFromDashboard =
  searchParams.get("verify");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [patients, setPatients] = useState([]);

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [status, setStatus] = useState("pending");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [token, setToken] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 5
  });

  const handleOpen = (patient) => {
    const status = patient.status?.toLowerCase();

    if (status === "in_progress" || status === "completed") {
      router.push(`/doctor/pages/prescription?appointment_id=${patient.id}`);
    } else if (status === "pending") {
      setSelectedAppointmentId(patient.id); // Save appointment id
      setOpen(true);
    }
  };
  useEffect(() => {
  if (
    verifyFromDashboard === "true" &&
    appointmentIdFromDashboard
  ) {
    setSelectedAppointmentId(
      appointmentIdFromDashboard
    );

    setOpen(true);
  }
}, [
  verifyFromDashboard,
  appointmentIdFromDashboard,
]);
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const roleId = user.role_id;


useEffect(() => {
  if (!selectedHospital) return;

  const fetchAppointments = async () => {
    try {
      const paginationParams = {
        limit: pagination.pageSize,
        offset: pagination.page * pagination.pageSize,
      };

      const res =
        await scheduleService.getDoctorAppointments(
          selectedHospital,
          selectedMode,
          status,
          date,
          paginationParams
        );


      setPatients(
        res?.appointments?.map((a) => ({
          id: a.appointment_id,
          tokenNumber: a.token_number,
          name: a.name,
          phoneNumber: a.phone_number,
          Diagnostic: a.diagnostic,
          date: a.date,
          time: a.time,
          mode: a.mode,
          hospitalName: a.hospital_name,
          status: a.status,
          bookedAt: a.booked_at,
        })) || []
      );

    } catch (err) {
      console.error(
        "Appointment API Error:",
        err
      );
    }
  };

  fetchAppointments();
}, [
  selectedHospital,
  selectedMode,
  status,
  date,
  pagination.page,
  pagination.pageSize,
]);


  // Open view details dialog
  const handleView = async (patient) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/user/getPatientDetails/${patient.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setSelectedPatient(result.data);
        setViewOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setSelectedPatient(null);
  };

  const handleClose = () => {
    setOpen(false);
    setToken("");
    setSelectedAppointmentId(null);
    setError("");
  };

const handleNext = async () => {
  if (!token) {
    setError("Token required");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const jwtToken = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/api/appointments/${selectedAppointmentId}/token/${token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    const res = await response.json();

    if (res.success) {
      // ❌ Don't close popup here
      // setOpen(false);
      // setToken("");

      router.push(
        `/doctor/pages/prescription?appointment_id=${selectedAppointmentId}`
      );

      // loading ko false bhi mat karo success case me
      // because page navigate hone tak button loading me rahega
      return;
    }

    setError(res.message || "Invalid Token");
    setLoading(false);

  } catch (err) {
    setError(err.message || "Token expired or invalid");
    setLoading(false);
  }
};



  const columns = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
    },
    {
      field: "date",
      headerName: "Date",
      minWidth: 140,
    },
    {
      field: "time",
      headerName: "Time",
      minWidth: 130,
    },
    {
      field: "mode",
      headerName: "Mode",
      minWidth: 120,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
    },
    {
      field: "details",
      headerName: "Details",
      minWidth: 140,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: "#1e6658",
            "&:hover": {
              backgroundColor: "#174d44",
            },
          }}
          onClick={() => handleView(params.row)}
        >
          View
        </Button>
      ),
    },
     ...(roleId === 2
    ? [
    {

      field: "action",
      headerName: "Action",
      minWidth: 160,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleOpen(params.row)}
          sx={{
            backgroundColor: "#1e6658",
            color: "#fff",
            fontSize: "12px",
            padding: "4px 10px",
            "&:hover": {
              backgroundColor: "#174d44",
            },
          }}
        >
          {params.row.status?.toLowerCase() === "in_progress"
            ? "Continue"
            : params.row.status?.toLowerCase() === "completed"
              ? "View"
              : "Start"}
        </Button>
      ),
    },
     ]
    : []),
  ];

  const finalColumns =
    roleId === 2
      ? columns
      : columns.filter((col) => col.field !== "action");
  return (
    <Box sx={{ backgroundColor: "#fbfdfc" }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Paper
            sx={{
              py: 4,
              px: 2,
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden",
              border: "1px solid #1e6658",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems={{ xs: "stretch", md: "center" }}
              flexDirection={{ xs: "column", md: "row" }}
              gap={2}

              mb={2}
            >
              {/* Visit Type */}
              <Box display="flex" alignItems="center">
                <WifiIcon sx={{ color: "#1e6658", mr: 1 }} />

                <Typography>
                  {selectedMode === "online" ? "E - Visit" : "Offline - Visit"}
                </Typography>
              </Box>

              {/* Filters */}
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                flexWrap="wrap"
                gap={2}
                width={{ xs: "100%", md: "auto" }}
              >
                <TextField
                  type="date"
                  label="Filter by Date"
                  InputLabelProps={{ shrink: true }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  size="small"
                  sx={{
                    minWidth: { xs: "100%", sm: 180 },
                    flex: { sm: 1 },

                    "& .MuiInputLabel-root": {
                      color: "#1e6658",
                    },

                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1e6658",
                    },

                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#777",
                      },

                      "&:hover fieldset": {
                        borderColor: "#1e6658",
                      },

                      "&.Mui-focused fieldset": {
                        borderColor: "#1e6658",
                        borderWidth: "2px",
                      },
                    },

                    "& input": {
                      color: "#000",
                    },

                    /* Calendar icon */
                    "& input::-webkit-calendar-picker-indicator": {
                      opacity: 1,
                      cursor: "pointer",

                      filter:
                        "invert(31%) sepia(19%) saturate(1048%) hue-rotate(121deg) brightness(89%) contrast(91%)",
                    },
                  }}
                />

                <FormControl
                  size="small"
                  sx={{
                    minWidth: { xs: "100%", sm: 180 },
                    flex: { sm: 1 },
                    "& .MuiInputLabel-root": {
                      color: "#1e6658",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1e6658",
                    },
                  }}
                >
                  <InputLabel id="status-label">Filter by Status</InputLabel>

                  <Select
                    labelId="status-label"
                    label="Filter by Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  onClick={() => {
                    setDate("");
                    setStatus("pending");
                  }}
                  sx={{
                    borderColor: "#1e6658",
                    color: "#1e6658",
                    width: { xs: "100%", sm: "auto" },
                    whiteSpace: "nowrap",
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                height: 400,
                width: "100%",
                overflowX: "auto",
              }}
            >
              <DataGrid
                rows={patients}
                columns={finalColumns}
                sx={{
                  width: "100%",

                  "& .MuiDataGrid-cell": {
                    fontSize: {
                      xs: "12px",
                      sm: "13px",
                      md: "14px",
                    },
                  },

                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontSize: {
                      xs: "12px",
                      sm: "13px",
                      md: "14px",
                    },
                  },
                }}
                pageSizeOptions={[5, 10, 20]}
                paginationModel={pagination}
                onPaginationModelChange={setPagination}
                slots={{ toolbar: CustomToolbar }}
                disableRowSelectionOnClick
              />
            </Box>
          </Paper>
        </Grid>

      </Grid>

      {/* View Details Dialog */}
      <Dialog
        open={viewOpen}
        onClose={handleViewClose}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: { xs: "95%", sm: 550 },
            m: 1, maxHeight: "90vh", overflow: "hidden", position: "relative"
          }
        }}
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
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: 400,
            },
          }}
        >
          <DialogTitle>Enter Token</DialogTitle>

          <DialogContent>
            <TextField
              label="Token"
              variant="outlined"
              fullWidth
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setError("");
              }}
              error={!!error}
              helperText={error}
              sx={{ mt: 1 }}
            />
          </DialogContent>

          <DialogActions>
            <Button
              onClick={handleClose}
              sx={{ color: "red" }}
            >
              Cancel
            </Button>

            <Button
  onClick={handleNext}
  variant="contained"
  disabled={!token || loading}
  sx={{
    backgroundColor: "#1e6658",
    "&:hover": {
      backgroundColor: "#174d44",
    },
  }}
>
  {loading ? "Verifying..." : "Verify"}
</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}