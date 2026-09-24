"use client";

import React from "react";
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

const DoctorAssistantFilters = ({
  // doctors
  doctors,
  doctorsLoading,
  selectedDoctor,
  onDoctorSelect,
  getDoctorId,
  getDoctorName,
  getDoctorEmail,
  getDoctorMobile,

  // assistants
  assistantsCount,
  assistantSearch,
  onAssistantSearchChange,
  assistantsLoading,
  onRefresh,
}) => {
  const theme = useTheme();

  return (
    <>
      {/* PAGE HEADER */}
      <Box sx={{ mb: 2.5 }}>
        <Typography
          sx={{
            fontSize: { xs: "18px", sm: "20px" },
            fontWeight: 700,
            color: "text.primary",
            lineHeight: 1.3,
          }}
        >
          Doctor & Assistant
        </Typography>

        <Typography
          sx={{
            mt: 0.4,
            fontSize: "12px",
            color: "text.secondary",
          }}
        >
          Select a doctor to view their assigned assistants.
        </Typography>
      </Box>

      {/* DOCTOR SELECTION */}
      <Paper
        elevation={0}
        sx={{
          mb: 2,

          p: { xs: 1.5, sm: 2 },
          border: "1px solid",
          borderColor: "#b1b1b1",
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            
            gap: 1.5,
          }}
        >
          {/* LEFT */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                flexShrink: 0,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: `${theme.palette.primary.main}10`,
                color: "primary.main",
              }}
            >
              <MedicalServicesOutlinedIcon sx={{ fontSize: 20 }} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                Choose Doctor
              </Typography>

              <Typography
                sx={{
                  mt: 0.2,
                  fontSize: "11px",
                  color: "text.secondary",
                }}
              >
                Search and select a doctor.
              </Typography>
            </Box>
          </Box>

          {/* RIGHT */}
          <Autocomplete
            options={doctors}
            value={selectedDoctor}
            loading={doctorsLoading}
            onChange={onDoctorSelect}
            getOptionLabel={(option) => getDoctorName(option)}
            isOptionEqualToValue={(option, value) =>
              getDoctorId(option) === getDoctorId(value)
            }
            noOptionsText="No doctors found"
            sx={{ width: { xs: "100%", sm: 350 } }}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                key={getDoctorId(option)}
                sx={{
                  display: "flex !important",
                  flexDirection: "column !important",
                  alignItems: "flex-start !important",
                  py: "8px !important",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  {getDoctorName(option)}
                </Typography>

                <Typography
                  sx={{ fontSize: "10px", color: "text.secondary" }}
                >
                  {getDoctorEmail(option)}
                </Typography>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Search doctor..."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <SearchRoundedIcon
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {doctorsLoading ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    minHeight: 38,
                    borderRadius: 1.5,
                    fontSize: "12px",
                  },
                }}
              />
            )}
          />
        </Box>
      </Paper>

      {/* SELECTED DOCTOR SUMMARY */}
      {selectedDoctor && (
        <Paper
          elevation={0}
          sx={{
            mb: 1,
            px: { xs: 1.5, sm: 2 },
            py: 1.4,
            border: "1px solid",
            borderColor: "#b1b1b1",
            borderRadius: 2,
            bgcolor: "background.paper",
            display: "flex",
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            gap: 1.5,
          }}
        >
          {/* LEFT - DOCTOR INFO */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                flexShrink: 0,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: `${theme.palette.primary.main}10`,
                color: "primary.main",
              }}
            >
              <PersonOutlineRoundedIcon sx={{ fontSize: 18 }} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                {getDoctorName(selectedDoctor)}
              </Typography>

              <Typography
                noWrap
                sx={{
                  mt: 0.1,
                  fontSize: "11px",
                  color: "text.secondary",
                }}
              >
                {getDoctorEmail(selectedDoctor)}
                {getDoctorMobile(selectedDoctor) !== "-"
                  ? ` • ${getDoctorMobile(selectedDoctor)}`
                  : ""}
              </Typography>
            </Box>
          </Box>

          {/* RIGHT - SEARCH + COUNT + REFRESH */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "space-between", sm: "flex-end" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              width: { xs: "100%", md: "auto" },
            }}
          >
            <TextField
              size="small"
              value={assistantSearch}
              onChange={(e) => onAssistantSearchChange(e.target.value)}
              placeholder="Search assistant..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon
                      sx={{ fontSize: 17, color: "text.secondary" }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: "100%", sm: 230 },
                "& .MuiOutlinedInput-root": {
                  height: 34,
                  borderRadius: 1.5,
                  fontSize: "11px",
                  bgcolor: "background.paper",
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                    borderWidth: "1px",
                  },
                },
                "& input::placeholder": {
                  fontSize: "11px",
                  opacity: 0.7,
                },
              }}
            />

            <Chip
              icon={
                <GroupsOutlinedIcon
                  sx={{ fontSize: "15px !important" }}
                />
              }
              label={`${assistantsCount} Assistant${
                assistantsCount === 1 ? "" : "s"
              }`}
              size="small"
              sx={{
                height: 28,
                borderRadius: 1.2,
                fontSize: "11px",
                fontWeight: 600,
                color: "primary.main",
                bgcolor: `${theme.palette.primary.main}10`,
                flexShrink: 0,
              }}
            />

            <Tooltip title="Refresh assistants">
              <span>
                <IconButton
                  size="small"
                  disabled={assistantsLoading}
                  onClick={onRefresh}
                  sx={{
                    width: 30,
                    height: 30,
                    flexShrink: 0,
                    border: "1px solid",
                    borderColor: "divider",
                    color: "text.secondary",
                    "&:hover": {
                      color: "primary.main",
                      borderColor: "primary.main",
                      bgcolor: `${theme.palette.primary.main}08`,
                    },
                  }}
                >
                  {assistantsLoading ? (
                    <CircularProgress size={14} color="inherit" />
                  ) : (
                    <RefreshRoundedIcon sx={{ fontSize: 17 }} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default DoctorAssistantFilters;