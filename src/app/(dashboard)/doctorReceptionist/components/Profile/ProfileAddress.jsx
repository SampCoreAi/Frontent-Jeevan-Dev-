"use client";

import React from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Paper,
  Collapse,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const ProfileAddress = ({ address, isEditing, showAddress, setShowAddress, onAddressChange }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: 3,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <Paper
          elevation={0}
          onClick={() => setShowAddress(!showAddress)}
          sx={{
            p: 2,
            cursor: "pointer",
            borderRadius: 3,
            background: "#f5f5f5",
            border: "1px solid #d5ece7",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 18px rgba(0, 0, 0, 0.38)",
            },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700} color="#153933">
              Address Information
            </Typography>
          </Box>
          {showAddress ? (
            <ExpandLessIcon sx={{ color: "#14b8a6" }} />
          ) : (
            <ExpandMoreIcon sx={{ color: "#14b8a6" }} />
          )}
        </Paper>
        <Collapse in={showAddress} timeout={500} unmountOnExit>
          <Box
            sx={{
              mt: 2,
              p: 3,
              borderRadius: 3,
              backgroundColor: "#fafafa",
              border: "1px solid #eeeeee",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Flat / Plot No"
                  value={address.flatNo}
                  disabled={!isEditing}
                  onChange={(e) => onAddressChange('flatNo', e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fff",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Building / Society"
                  value={address.building}
                  disabled={!isEditing}
                  onChange={(e) => onAddressChange('building', e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fff",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Street Name"
                  value={address.street}
                  disabled={!isEditing}
                  onChange={(e) => onAddressChange('street', e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fff",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Area / Locality"
                  value={address.area}
                  disabled={!isEditing}
                  onChange={(e) => onAddressChange('area', e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fff",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Landmark"
                  value={address.landmark}
                  disabled={!isEditing}
                  onChange={(e) => onAddressChange('landmark', e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fff",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="City / Town"
                  value={address.city}
                  disabled={!isEditing}
                  onChange={(e) => onAddressChange('city', e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fff",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="District"
                  value={address.district}
                  disabled={!isEditing}
                  onChange={(e) => onAddressChange('district', e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fff",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="State"
                  value={address.state}
                  disabled={!isEditing}
                  onChange={(e) => onAddressChange('state', e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fff",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="PIN Code"
                  value={address.pinCode}
                  disabled={!isEditing}
                  onChange={(e) => onAddressChange('pinCode', e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fff",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default ProfileAddress;