"use client"
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  Menu,
  Fade,
  MenuItem,
  TextField,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useState } from "react";
import axios from "@/utils/axiosInstance";

const statusColor = {
  Active: "success",
  "On Leave": "warning",
  Inactive: "default",
};

export default function DoctorsTable({
  doctors,
  totalDoctors,
  loading,
  onViewProfile,
  onStatusUpdate,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [selectedQr, setSelectedQr] = useState([]);
  const [regNumberOpen, setRegNumberOpen] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [selectedQrCodes, setSelectedQrCodes] = useState([]);

  const handleAssignQr = async () => {
    if (!selectedDoctor) return;
    console.log("efa", selectedDoctor);
    try {
      const res = await axios.put(
        `/api/QR/doctors/${selectedDoctor.doctorId}/connect-qr`,
        {
          qrCodes: selectedQrCodes,
        }
      );

      console.log(res.data);

      alert("QR Assigned Successfully");

      setQrOpen(false);
      setSelectedQrCodes([]);
      setInputValue("");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleMenuOpen = (event, doctor) => {
    setAnchorEl(event.currentTarget);
    setSelectedDoctor(doctor);
  };

  const handleCloseQrDialog = () => {
    setQrOpen(false);
    setSelectedQrCodes([]);
    setInputValue("");
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleStatus = () => {
    if (!selectedDoctor) return;
    const newStatus = selectedDoctor.status === "Active" ? "Inactive" : "Active";
    onStatusUpdate(selectedDoctor.doctorId, newStatus);
    handleMenuClose();
  };

  const handleAssignRegistrationNumber = () => {
    // Handle registration number assignment logic here
    console.log("Assigning registration number:", registrationNumber, "to doctor:", selectedDoctor);
    // Add your API call here
    alert(`Registration number ${registrationNumber} assigned successfully`);
    setRegNumberOpen(false);
    setRegistrationNumber("");
    handleMenuClose();
  };

  const getToggleButtonInfo = (status) => {
    if (status === "Active") {
      return {
        label: "Deactivate",
        icon: <CancelIcon fontSize="small" sx={{ color: "#f44336" }} />,
        color: "#f44336",
      };
    } else {
      return {
        label: "Activate",
        icon: <CheckCircleIcon fontSize="small" sx={{ color: "#4caf50" }} />,
        color: "#4caf50",
      };
    }
  };

  if (loading) {
    return (
      <Paper>
        <Box p={4} textAlign="center">
          <Typography>Loading doctors...</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper >
      <Table >
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
            <TableCell>DOCTOR NAME</TableCell>
            <TableCell>CONTACT</TableCell>
            <TableCell>AGE/GENDER</TableCell>
            <TableCell>QUALIFICATION</TableCell>
            <TableCell>STATUS</TableCell>
            <TableCell align="right">ACTIONS</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {doctors && doctors.length > 0 ? (
            doctors.map((doc, index) => (
              <TableRow
                key={doc.doctorId ?? doc.id ?? doc.email ?? `doctor-${index}`}
                sx={{
                  "&:hover": { backgroundColor: "#f5f7fb" },
                }}
              >
                <TableCell>
                  <Box display="flex" gap={1} alignItems="center">
                    <Avatar src={doc.images?.[0]?.url || ""} />
                    <Box>
                      <Typography fontWeight={500}>
                        {doc.full_name || "N/A"}
                      </Typography>
                      <Typography fontSize={12} color="black">
                        ID: {doc.doctorId}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography fontSize={14}>
                    {doc.email || "N/A"}
                  </Typography>
                  <Typography fontSize={12} color="black">
                    {doc.phoneNumber || "N/A"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography fontSize={14}>
                    Age: {doc.age || "N/A"}
                  </Typography>
                  <Typography fontSize={12} color="black">
                    Gender: {doc.gender || "N/A"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography fontSize={14}>
                    {doc.specialization || "N/A"}
                  </Typography>
                  <Typography fontSize={12} color="black">
                    {doc.qualification || "N/A"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={doc.status}
                    size="small"
                    color={statusColor[doc.status]}
                    sx={{ fontWeight: 500, minWidth: 80 }}
                  />
                </TableCell>

                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, doc)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                align="center"
                sx={{
                  py: 6,
                  color: "black",
                  fontSize: 16,
                }}
              >
                No Data Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Typography color="text.secondary" fontSize={14}>
          Showing {doctors.length} of {totalDoctors} results
        </Typography>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: { minWidth: 200, py: 0.5 },
        }}
      >
        {selectedDoctor && (
          <MenuItem onClick={handleToggleStatus}>
            <Box display="flex" alignItems="center" gap={1}>
              {getToggleButtonInfo(selectedDoctor.status).icon}
              <Typography
                sx={{ color: getToggleButtonInfo(selectedDoctor.status).color }}
              >
                {getToggleButtonInfo(selectedDoctor.status).label}
              </Typography>
            </Box>
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            setQrOpen(true);
            handleMenuClose();
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Assign QR Code</Typography>
          </Box>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setRegNumberOpen(true);
            handleMenuClose();
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Assign Registration Number</Typography>
          </Box>
        </MenuItem>

        {selectedDoctor && selectedDoctor.status !== "On Leave" && (
          <MenuItem
            onClick={() => {
              onViewProfile(selectedDoctor);
              handleMenuClose();
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <AccessTimeIcon fontSize="small" />
              <Typography>View Profile</Typography>
            </Box>
          </MenuItem>
        )}
      </Menu>

      {/* Assign QR Code Dialog */}
      <Dialog
        open={qrOpen}
        onClose={handleCloseQrDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: 28,
          }}
        >
          Assign QR Code
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              mb: 1.5,
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            Enter the QR Code
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                flex: 1,
                minHeight: 54,
                border: "1px solid #D0D5DD",
                borderRadius: 2,
                px: 1.5,
                py: 1,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                transition: ".2s",
                "&:focus-within": {
                  borderColor: "#1b8d67",
                  boxShadow: "0 0 0 3px rgba(27,141,103,.15)",
                },
              }}
            >
              {selectedQrCodes.map((code) => (
                <Chip
                  key={code}
                  label={code}
                  size="small"
                  onDelete={() =>
                    setSelectedQrCodes((prev) =>
                      prev.filter((item) => item !== code)
                    )
                  }
                  sx={{
                    bgcolor: "#EAF7F1",
                    border: "1px solid #1b8d67",
                    color: "#222",
                    fontWeight: 600,
                    borderRadius: "20px",
                    "& .MuiChip-deleteIcon": {
                      color: "#666",
                    },
                    "& .MuiChip-deleteIcon:hover": {
                      color: "#f44336",
                    },
                  }}
                />
              ))}

              <input
                value={inputValue}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value.endsWith(",")) {
                    const qr = value.replace(",", "").trim();

                    if (qr && !selectedQrCodes.includes(qr)) {
                      setSelectedQrCodes((prev) => [...prev, qr]);
                    }

                    setInputValue("");
                  } else {
                    setInputValue(value);
                  }
                }}
                placeholder={
                  selectedQrCodes.length === 0
                    ? "Enter QR Code..."
                    : ""
                }
                style={{
                  border: "none",
                  outline: "none",
                  flex: 1,
                  minWidth: "120px",
                  fontSize: "15px",
                  padding: "6px 0",
                  background: "transparent",
                }}
              />
            </Box>

            <Button
              variant="contained"
              onClick={handleAssignQr}
              disabled={selectedQrCodes.length === 0}
              sx={{
                bgcolor: "#1b8d67",
                minWidth: 120,
                height: 54,
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#167a59",
                },
              }}
            >
              Save
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Assign Registration Number Dialog */}
      <Dialog
        open={regNumberOpen}
        onClose={() => {
          setRegNumberOpen(false);
          setRegistrationNumber("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: 28,
          }}
        >
          Assign Registration Number
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              mb: 1.5,
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            Enter Registration Number for {selectedDoctor?.full_name || "Doctor"}
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter registration number..."
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&.Mui-focused fieldset": {
                  borderColor: "#1b8d67",
                },
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => {
              setRegNumberOpen(false);
              setRegistrationNumber("");
            }}
            sx={{
              color: "#666",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAssignRegistrationNumber}
            disabled={!registrationNumber.trim()}
            sx={{
              bgcolor: "#1b8d67",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#167a59",
              },
            }}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}