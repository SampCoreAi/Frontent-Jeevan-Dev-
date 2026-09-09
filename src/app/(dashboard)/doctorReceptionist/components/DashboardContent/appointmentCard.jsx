import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Avatar,
  Chip,
  Divider,
  Card,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChatIcon from "@mui/icons-material/Chat";
import DescriptionIcon from "@mui/icons-material/Description";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const appointments = [
  {
    name: "M.J. Mical",
    diagnosis: "Health Cheakup",
    time: "9:00",
    status: "Complete",
  },
  {
    name: "Sanath Deo",
    diagnosis: "Health Cheakup",
    time: "9:30",
    status: "Pending",
  },
  {
    name: "M.J. Mical",
    diagnosis: "Health Cheakup",
    time: "10:00",
    status: "",
  },
  {
    name: "M.J. Mical",
    diagnosis: "Health Cheakup",
    time: "11:00",
    status: "",
  },
];

const appointmentCard = () => {
  const theme = useTheme();
  const text = theme.palette.text;
  const background = theme.palette.background;
  return (
    <Grid container spacing={2}>
      {/* Today Appointment */}
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <Paper
          sx={{
            p: 2,
            border: "1.5px solid black",
            borderRadius: 0.5,
            background: background.primary,
            width: { xs: "100%", sm: 415 },
            maxWidth: "100%",
            boxShadow: "none",
            overflowX: "auto",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Today Appointment
          </Typography>
          <TableContainer>
            <Table sx={{ minWidth: 360 }}>
              <TableHead>
                <TableRow sx={{ borderBottom: "3px solid #cf7a2aff" }}>
                  <TableCell
                    sx={{
                      py: 2,
                      fontWeight: 700,
                      borderRight: "3px solid #00ebfbff",
                    }}
                  >
                    Patient
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      borderRight: "3px solid #a6e2e6",
                    }}
                  >
                    Name/Diagnosis
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      borderRight: "3px solid #a6e2e6",
                    }}
                  >
                    Time
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment, index) => (
                  <TableRow key={index}>
                    <TableCell
                      sx={{
                        borderRight: "3px solid #a6e2e6",
                        borderBottom: "3px solid white",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: "#e0fef4",
                          color: "#0f7468",
                          fontWeight: 700,
                          fontSize: 18,
                          border: "2px solid #b2dfdb",
                        }}
                      >
                        {appointment.name[0]}
                      </Avatar>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "3px solid #a6e2e6",
                        borderBottom: "3px solid white",
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {appointment.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 300, color: text }}
                      >
                        {appointment.diagnosis}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "3px solid #a6e2e6",
                        borderBottom: "3px solid white",
                      }}
                    >
                      {appointment.time}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "3px solid white" }}>
                      {appointment.status || "Pending"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 2, borderColor: "#b2dfdb" }} />
          <Button
            variant="outlined"
            fullWidth
            sx={{
              background: "#439f8e",
              color: "text.thrid",
              borderColor: "#b2dfdb",
              fontWeight: 700,
              fontSize: 18,
              py: 1.2,
              borderRadius: 0.5,
              "&:hover": { background: "#0f7468" },
            }}
          >
            View More
          </Button>
        </Paper>
      </Grid>

      {/* Next Patient Details */}
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <Card
          sx={{
            p: 2,
            borderRadius: 0.5,
            boxShadow: 3,
            bgcolor: "#ffffff",
            color: text,
            border: "1px solid #000000ff",
            height: "100%",
            width: "100%",
            maxWidth: 500, // max width on larger screens
            boxSizing: "border-box",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Next Patient Details
          </Typography>
          <Divider sx={{ mb: 2, borderColor: "#e0e0e0" }} />

          {/* Patient header */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ marginTop: 2, flexWrap: "wrap" }}
          >
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: "#439f8e",
                color: "#ffffff",
              }}
            >
              S
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Sanath Deo
              </Typography>
              <Typography variant="body2" sx={{ color: text.secondary }}>
                Health Checkup
              </Typography>
            </Box>
          </Stack>

          {/* Patient info */}
          <Box
            sx={{
              mt: 4,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, // stack on small screens
              gap: 2,
              rowGap: 3,
            }}
          >
            <Box>
              <Typography variant="body2"  sx={{ color: "#6c757d" }} >
                Patient ID
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                0122363525142
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: "#6c757d" }}>
                D.O.B
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                15 January 1989
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: "#6c757d" }}>
                Sex
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                Male
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: "#6c757d" }}>
                Weight
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                59 kg
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: "#6c757d" }}>
                Height
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                172 cm
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: "#6c757d" }}>
                Last Appointment
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                15 Dec 2021
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: "#6c757d" }}>
                Reg. Date
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                10 Dec 2021
              </Typography>
            </Box>
            <Box />
          </Box>

          <Divider sx={{ my: 2, borderColor: "#e0e0e0" }} />

          {/* Patient history */}
          <Typography
            variant="subtitle2"
            sx={{ color: "#1976d2", fontWeight: 600, mb: 2, mt: 2 }}
          >
            Patient History
          </Typography>
          <Stack direction="row" spacing={{ xs: 1, sm: 2 }} flexWrap="wrap">
            <Chip label="00000-00000" variant="outlined" />
            <Button
              variant="outlined"
              startIcon={<DescriptionIcon />}
              size="small"
              sx={{
                color: "text.primary",
                borderColor: "#bdbdbd",
                
                "&:hover": { backgroundColor: "#e6f6ed", color: "#0f7468" },
              }}
            >
              Document
            </Button>
            <Button
              variant="outlined"
              startIcon={<ChatIcon />}
              size="small"
              sx={{
                color: "text.primary",
                borderColor: "#bdbdbd",
                "&:hover": { backgroundColor: "#e6f6ed", color: "#0f7468" },
              }}
            >
              Chat
            </Button>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
};

export default appointmentCard;
