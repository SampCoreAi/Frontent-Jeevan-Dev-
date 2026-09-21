"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter, useSearchParams } from "next/navigation";
import PatientDetailsCard from "./PatientDetailsCard";
import CustomToolbar from "../../../doctorReceptionist/components/CustomToolbar";
import { scheduleService } from "../../services/api";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import HistoryIcon from "@mui/icons-material/History";
import Menu from "@mui/material/Menu";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OnOffCard({ selectedHospital, selectedMode }) {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentIdFromDashboard = searchParams.get("appointment_id");
  const verifyFromDashboard = searchParams.get("verify");
const [detailsAnchorEl, setDetailsAnchorEl] = useState(null);
const [detailsRow, setDetailsRow] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [patients, setPatients] = useState([]);
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState("pending");
  const [token, setToken] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 5,
  });

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const roleId = user?.role_id;

const fieldStyle = {
  "& .MuiInputLabel-root": {
    fontSize: "13px",
    color: theme.palette.text.secondary,
  },
  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
    transform: "translate(14px, -5px) scale(0.75)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: theme.palette.primary.main,
  },
  "& .MuiOutlinedInput-root": {
    height: 40,
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
  "& input": {
    fontSize: "13px",
    color: theme.palette.text.primary,
  },
  "& .MuiSelect-select": {
    fontSize: "13px",
  },
};

  const handleOpen = (patient) => {
    const appointmentStatus = patient?.status?.toLowerCase();

    if (
      appointmentStatus === "in_progress" ||
      appointmentStatus === "completed"
    ) {
      router.push(
        `/doctor/pages/prescription?appointment_id=${patient.id}`
      );
      return;
    }

    if (appointmentStatus === "pending") {
      setSelectedAppointmentId(patient.id);
      setToken("");
      setError("");
      setOpen(true);
    }
  };
const handleDetailsMenuOpen = (event, row) => {
  setDetailsAnchorEl(event.currentTarget);
  setDetailsRow(row);
};

const handleDetailsMenuClose = () => {
  setDetailsAnchorEl(null);
  setDetailsRow(null);
};

const handleViewDetails = () => {
  if (!detailsRow) return;
  const row = detailsRow;
  handleDetailsMenuClose();
  handleView(row);
};

const handleViewHistory = () => {
  if (!detailsRow) return;
  const patientId = detailsRow.id;
  handleDetailsMenuClose();
  router.push(`/doctor/pages/patient-history?appointment_id=${patientId}`);
};
  useEffect(() => {
    if (
      verifyFromDashboard === "true" &&
      appointmentIdFromDashboard
    ) {
      setSelectedAppointmentId(appointmentIdFromDashboard);
      setOpen(true);
    }
  }, [verifyFromDashboard, appointmentIdFromDashboard]);

  useEffect(() => {
    if (!selectedHospital || !selectedMode) {
      setPatients([]);
      return;
    }

    const fetchAppointments = async () => {
      setTableLoading(true);

      try {
        const paginationParams = {
          limit: pagination.pageSize,
          offset: pagination.page * pagination.pageSize,
        };

        const res = await scheduleService.getDoctorAppointments(
          selectedHospital,
          selectedMode,
          status,
          date,
          paginationParams
        );

        const appointments = Array.isArray(res?.appointments)
          ? res.appointments
          : [];

        setPatients(
          appointments.map((appointment) => ({
            id: appointment.appointment_id,
            tokenNumber: appointment.token_number,
            name: appointment.name || "Not provided",
            phoneNumber: appointment.phone_number || "Not provided",
            Diagnostic: appointment.diagnostic || "Not provided",
            date: appointment.date || "Not provided",
            time: appointment.time || "Not provided",
            mode: appointment.mode || "Not provided",
            hospitalName:
              appointment.hospital_name || "Not provided",
            status: appointment.status || "Not provided",
            bookedAt: appointment.booked_at,
          }))
        );
      } catch (err) {
        console.error("Appointment API Error:", err);
        setPatients([]);
      } finally {
        setTableLoading(false);
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

  const handleView = async (patient) => {
    if (!patient?.id) return;

    try {
      const authToken = localStorage.getItem("token");

      if (!authToken) return;

      const response = await fetch(
        `${API_URL}/api/user/getPatientDetails/${patient.id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const result = await response.json();

      if (result?.success) {
        setSelectedPatient(result.data);
        setViewOpen(true);
      }
    } catch (err) {
      console.error("Patient details error:", err);
    }
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setSelectedPatient(null);
  };

  const handleClose = () => {
    if (loading) return;

    setOpen(false);
    setToken("");
    setSelectedAppointmentId(null);
    setError("");
  };

  const handleNext = async () => {
    const cleanToken = token.trim();

    if (!cleanToken) {
      setError("Token is required");
      return;
    }

    if (!selectedAppointmentId) {
      setError("Appointment not found");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const jwtToken = localStorage.getItem("token");

      if (!jwtToken) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/appointments/${selectedAppointmentId}/token/${cleanToken}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      const res = await response.json();

      if (res?.success) {
        router.push(
          `/doctor/pages/prescription?appointment_id=${selectedAppointmentId}`
        );
        return;
      }

      setError(res?.message || "Invalid token");
      setLoading(false);
    } catch (err) {
      setError(err?.message || "Token expired or invalid");
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setDate("");
    setStatus("pending");
    setPagination((prev) => ({
      ...prev,
      page: 0,
    }));
  };

  const columns = useMemo(() => {
    const data = [
      {
        field: "name",
        headerName: "Name",
        minWidth: 160,
        flex: 1,
      },
      {
        field: "date",
        headerName: "Date",
        minWidth: 130,
        flex: 0.8,
      },
      {
        field: "time",
        headerName: "Time",
        minWidth: 120,
        flex: 0.7,
      },
      {
  field: "mode",
  headerName: "Mode",
  minWidth: 110,
  flex: 0.7,
  renderCell: (params) => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: "13px",
          textTransform: "capitalize",
          color: theme.palette.text.primary,
          lineHeight: 1.2,
        }}
      >
        {params.value || "Not provided"}
      </Typography>
    </Box>
  ),
},
      {
        field: "status",
        headerName: "Status",
        minWidth: 130,
        flex: 0.8,
        renderCell: (params) => {
          const value = String(params.value || "").toLowerCase();

          const statusStyles = {
            pending: {
              bgcolor: "#FFF6DD",
              color: "#A66B00",
            },
            in_progress: {
              bgcolor: "#EDF7F2",
              color: theme.palette.primary.main,
            },
            completed: {
              bgcolor: "#EDF7F2",
              color: theme.palette.primary.main,
            },
            cancelled: {
              bgcolor: "#FDECEC",
              color: theme.palette.error.main,
            },
          };

          const currentStyle = statusStyles[value] || {
            bgcolor: theme.palette.background.default,
            color: theme.palette.text.secondary,
          };

          return (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                width: "fit-content",
                px: 1,
                py: 0.35,
                borderRadius: 1,
                fontSize: "12px",
                fontWeight: 600,
                lineHeight: 1.3,
                ...currentStyle,
              }}
            >
              {value
                ? value
                    .replaceAll("_", " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())
                : "Not provided"}
            </Box>
          );
        },
      },
      
    ];

    if (roleId === 2) {
      data.push({
        field: "action",
        headerName: "Action",
        minWidth: 110,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const appointmentStatus =
            params.row.status?.toLowerCase();

          const label =
            appointmentStatus === "in_progress"
              ? "Continue"
              : appointmentStatus === "completed"
                ? "View"
                : "Start";

          return (
            <Button
              variant="contained"
              size="small"
              onClick={() => handleOpen(params.row)}
              sx={{
                minWidth: 70,
                height: 30,
                px: 1.25,
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 1.25,
                boxShadow: "none",
                bgcolor: theme.palette.primary.main,
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                  boxShadow: "none",
                },
              }}
            >
              {label}
            </Button>
          );
        },
      });
    }
data.push({
  field: "details",
  headerName: "Details",
  minWidth: 80,
  maxWidth: 80,
  sortable: false,
  filterable: false,
  align: "center",
  headerAlign: "center",
  renderCell: (params) => (
    <IconButton
      size="small"
      onClick={(event) => handleDetailsMenuOpen(event, params.row)}
      sx={{
        width: 30,
        height: 30,
        color: theme.palette.text.secondary,
        "&:hover": {
          bgcolor: theme.palette.background.default,
          color: theme.palette.primary.main,
        },
      }}
    >
      <MoreVertIcon sx={{ fontSize: 19 }} />
    </IconButton>
  ),
});

return data;
  }, [roleId, theme]);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: { xs: 1.5, sm: 2 },
            py: 1.5,
            bgcolor: theme.palette.background.default,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: "flex",
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                minWidth: 38,
                borderRadius: 1.5,
                bgcolor: "#EDF7F2",
                color: theme.palette.primary.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selectedMode === "online" ? (
                <WifiIcon sx={{ fontSize: 20 }} />
              ) : (
                <LocalHospitalOutlinedIcon sx={{ fontSize: 20 }} />
              )}
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                {selectedMode === "online"
                  ? "Online Appointments"
                  : "Offline Appointments"}
              </Typography>

              <Typography
                sx={{
                  mt: 0.15,
                  fontSize: "11px",
                  color: theme.palette.text.secondary,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {selectedHospital || "No hospital selected"}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              gap: 1,
              width: { xs: "100%", md: "auto" },
            }}
          >
            <TextField
              type="date"
              label="Date"
              size="small"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setPagination((prev) => ({
                  ...prev,
                  page: 0,
                }));
              }}
              InputLabelProps={{ shrink: true }}
              sx={{
                ...fieldStyle,
                width: { xs: "100%", sm: 165 },
              }}
            />

            <FormControl
              size="small"
              sx={{
                ...fieldStyle,
                width: { xs: "100%", sm: 165 },
              }}
            >
              <InputLabel>Status</InputLabel>

              <Select
                value={status}
                label="Status"
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPagination((prev) => ({
                    ...prev,
                    page: 0,
                  }));
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      "& .MuiMenuItem-root": {
                        fontSize: "13px",
                      },
                    },
                  },
                }}
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
              onClick={handleClearFilters}
              sx={{
                height: 40,
                minWidth: 72,
                px: 1.5,
                fontSize: "12px",
                fontWeight: 500,
                textTransform: "none",
                whiteSpace: "nowrap",
                borderColor: "#D8DEDC",
                color: theme.palette.text.secondary,
                borderRadius: 1.25,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  bgcolor: "#EDF7F2",
                },
              }}
            >
              Clear
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <DataGrid
            rows={patients}
            columns={columns}
            loading={tableLoading}
            autoHeight
            pageSizeOptions={[5, 10, 20]}
            paginationModel={pagination}
            onPaginationModelChange={setPagination}
            slots={{ toolbar: CustomToolbar }}
            disableRowSelectionOnClick
            sx={{
              minWidth: 760,
              border: 0,
              borderRadius: 0,
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              "& .MuiDataGrid-toolbarContainer": {
                minHeight: 0,
                p: 0,
              },
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "#F8FAF9",
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              "& .MuiDataGrid-columnHeader": {
                bgcolor: "#F8FAF9",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontSize: "13px",
                fontWeight: 600,
                color: theme.palette.text.primary,
              },
              "& .MuiDataGrid-cell": {
                fontSize: "13px",
                borderColor: theme.palette.divider,
              },
              "& .MuiDataGrid-row": {
                bgcolor: theme.palette.background.paper,
              },
              "& .MuiDataGrid-row:hover": {
                bgcolor: "#F8FAF9",
              },
              "& .MuiDataGrid-footerContainer": {
                minHeight: 48,
                borderTop: `1px solid ${theme.palette.divider}`,
              },
              "& .MuiTablePagination-root": {
                fontSize: "12px",
                color: theme.palette.text.secondary,
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  fontSize: "12px",
                },
              "& .MuiDataGrid-overlayWrapper": {
                minHeight: 150,
              },
            }}
          />
          <Menu
  anchorEl={detailsAnchorEl}
  open={Boolean(detailsAnchorEl)}
  onClose={handleDetailsMenuClose}
  anchorOrigin={{
    vertical: "bottom",
    horizontal: "right",
  }}
  transformOrigin={{
    vertical: "top",
    horizontal: "right",
  }}
  PaperProps={{
    sx: {
      minWidth: 170,
      mt: 0.5,
      borderRadius: 1.5,
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    },
  }}
>
  <MenuItem
    onClick={handleViewDetails}
    sx={{
      minHeight: 36,
      gap: 1,
      fontSize: "12.5px",
    }}
  >
    <VisibilityOutlinedIcon
      sx={{
        fontSize: 17,
        color: theme.palette.primary.main,
      }}
    />
    View Details
  </MenuItem>

  <MenuItem
    onClick={handleViewHistory}
    sx={{
      minHeight: 36,
      gap: 1,
      fontSize: "12.5px",
    }}
  >
    <HistoryIcon
      sx={{
        fontSize: 17,
        color: theme.palette.text.secondary,
      }}
    />
    View Past Details
  </MenuItem>
</Menu>
        </Box>
      </Paper>

      <Dialog
        open={viewOpen}
        onClose={handleViewClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: "90vh",
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
          },
        }}
      >
        <IconButton
          onClick={handleViewClose}
          size="small"
          aria-label="Close"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 10,
            bgcolor: theme.palette.background.default,
            color: theme.palette.text.secondary,
            "&:hover": {
              bgcolor: "#EDF7F2",
              color: theme.palette.primary.main,
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <DialogContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <PatientDetailsCard patient={selectedPatient} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            m: { xs: 1.5, sm: 2 },
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            px: 2,
            py: 1.5,
            fontSize: "13px",
            fontWeight: 700,
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          Verify Appointment Token
        </DialogTitle>

        <DialogContent
          sx={{
            px: 2,
            pt: "16px !important",
            pb: 1,
          }}
        >
          <Typography
            sx={{
              mb: 1.5,
              fontSize: "12px",
              color: theme.palette.text.secondary,
            }}
          >
            Enter the patient token to start this appointment.
          </Typography>

          <TextField
            label="Token"
            fullWidth
            size="small"
            autoFocus
            value={token}
            onChange={(e) => {
              setToken(e.target.value.replace(/\s/g, ""));
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && token.trim() && !loading) {
                handleNext();
              }
            }}
            error={Boolean(error)}
            helperText={error}
            inputProps={{
              maxLength: 100,
            }}
            sx={{
              ...fieldStyle,
              "& .MuiFormHelperText-root": {
                mx: 0,
                fontSize: "11px",
              },
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 2,
            py: 1.5,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{
              fontSize: "12px",
              textTransform: "none",
              color: theme.palette.text.secondary,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!token.trim() || loading}
            sx={{
              minWidth: 90,
              fontSize: "12px",
              textTransform: "none",
              boxShadow: "none",
              bgcolor: theme.palette.primary.main,
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
                boxShadow: "none",
              },
            }}
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}