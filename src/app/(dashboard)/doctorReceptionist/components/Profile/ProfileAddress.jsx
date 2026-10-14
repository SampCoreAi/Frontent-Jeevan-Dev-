"use client";

import React from "react";
import {
  Box,
  Collapse,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const fields = [
  ["flatNo", "Flat / Plot No"],
  ["building", "Building / Society"],
  ["street", "Street Name"],
  ["area", "Area / Locality"],
  ["landmark", "Landmark"],
  ["city", "City / Town"],
  ["district", "District"],
  ["state", "State"],
  ["pinCode", "PIN Code"],
];

export default function ProfileAddress({
  address = {},
  isEditing,
  showAddress,
  setShowAddress,
  onAddressChange,
}) {
  return (
    <Box sx={{ mt: 3, fontSize: "13px" }}>
      <Box
        sx={{
          overflow: "hidden",
          border: "1px solid #d5ece7",
          borderRadius: 2,
          bgcolor: "#fff",
        }}
      >
        <Paper
          elevation={0}
          onClick={() => setShowAddress((previous) => !previous)}
          sx={{
            px: 2,
            py: 1.5,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#f5f8f7",
            "&:hover": { bgcolor: "#eef6f3" },
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#153933" }}>
            Address Information
          </Typography>

          {showAddress ? (
            <ExpandLessIcon sx={{ color: "#14b8a6" }} />
          ) : (
            <ExpandMoreIcon sx={{ color: "#14b8a6" }} />
          )}
        </Paper>

        <Collapse in={showAddress} timeout={300} unmountOnExit>
          <Box sx={{ p: { xs: 2, sm: 2.5 }, bgcolor: "#fff" }}>
            <Grid container spacing={1.5}>
              {fields.map(([key, label]) => (
                <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label={label}
                    value={address[key] || ""}
                    disabled={!isEditing}
                    onChange={(event) =>
                      onAddressChange(key, event.target.value)
                    }
                    sx={{
                      "& .MuiInputBase-root, & .MuiInputLabel-root": {
                        fontSize: 13,
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}