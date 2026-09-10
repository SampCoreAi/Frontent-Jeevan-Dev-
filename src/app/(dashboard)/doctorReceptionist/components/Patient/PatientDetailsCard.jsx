import React from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Divider,
  Button,
  Grid,
} from "@mui/material";

const PatientDetailsCard = ({ patient }) => {
  if (!patient) return null;
  return (
    <Grid
      sx={{
        p: 3,
        maxWidth: 500,
        border: "2px solid black",

        mx: "auto",
        borderRadius: 0.5,
        fontFamily: "Arial",
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar
          sx={{
            bgcolor: "#00796B",
            width: 48,
            height: 48,
            fontWeight: "bold",
            mr: 2,
          }}
        >
          SD
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Patient Details
          </Typography>
          <Typography>Sanath Deo</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2, height: 3, backgroundColor: "#07716a" }} />

      <Grid sx={{ display: "flex", gap: 7 }}>
        <Box>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Patient ID</b>
            <br />
            <b style={{ color: "#000000" }}>0000000000</b>
          </Typography>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Sex</b>
            <br />
            <b style={{ color: "#000000" }}>Male</b>
          </Typography>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Phone</b>
            <br />
            <b style={{ color: "#000000" }}>0000000000</b>
          </Typography>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Reg. Date</b>
            <br />
            <b style={{ color: "#000000" }}>10 Dec 2021</b>
          </Typography>
          <Typography>
            <b style={{ color: "#666666" }}>Visit Type</b>
            <br />
            <b style={{ color: "#000000" }}>New</b>
          </Typography>
        </Box>

        {/* Column 2 */}
        <Box mb={3}>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Name</b>
            <br />
            <b style={{ color: "#000000" }}>Sanath Deo</b>
          </Typography>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Weight</b>
            <br />
            <b style={{ color: "#000000" }}>59 kg</b>
          </Typography>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Email</b>
            <br />
            <b style={{ color: "#000000" }}>demo@gmail.com</b>
          </Typography>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Last Appointment</b>
            <br />
            <b style={{ color: "#000000" }}>15 Dec 2021</b>
          </Typography>
          <Typography>
            <b style={{ color: "#666666" }}>Diagnosis</b>
            <br />
            <b style={{ color: "#000000" }}>Fever</b>
          </Typography>
        </Box>

        {/* Column 3 */}
        <Box mb={3}>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Age</b>
            <br />
            <b style={{ color: "#000000" }}>19</b>
          </Typography>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Height</b>
            <br />
            <b style={{ color: "#000000" }}>172 cm</b>
          </Typography>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Blood Group</b>
            <br />
            <b style={{ color: "#000000" }}>A+</b>
          </Typography>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Mode</b>
            <br />
            <b style={{ color: "#000000" }}>Virtual</b>
          </Typography>
          <Typography>
            <b style={{ color: "#666666" }}>Payment Status</b>
            <br />
            <b style={{ color: "#000000" }}>Paid</b>
          </Typography>
        </Box>
      </Grid>
      <Typography>
        <b style={{ color: "#666666" }}>Note:</b>{" "}
        <b> Feeling unwell due to fever; resting and monitoring symptoms.</b>
      </Typography>
    </Grid>
  );
};

export default PatientDetailsCard;
