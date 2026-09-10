"use client";
import { useEffect, useState } from "react";

import { useTheme } from "@mui/material/styles";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
  CardContent,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Alert,
  Paper,
  Tooltip,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  LocalHospital,
  Person,
  Phone,
  Cake,
  Email,
  LocationOn,
  Height,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LoadingButton from "@mui/lab/LoadingButton";
import { useFormik } from "formik";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import * as Yup from "yup";

const steps = ["Patient Information", "Appointment Details"];

export default function Home() {
  const theme = useTheme();
  const color = theme.palette.primary;
  const [activeStep, setActiveStep] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingFor, setBookingFor] = useState("self"); // "self" or "other"

  const formik = useFormik({
    initialValues: {
      name: "",
      age: "",
      gender: "",
      dob: "",
      mobile: "",
      email: "",
      area: "",
      city: "",
      problem: "",
      date: "",
      time: "",
      message: "",
    },
  });

  // Filter and group slots by availability
  const groupedSlots = React.useMemo(() => {
    if (!availableSlots.length) return {};
    
    // Show all slots (including inactive) but handle them in the UI
    const allSlots = availableSlots;
    
    // Group slots by time period (Morning, Afternoon, Evening)
    const groups = {
      Morning: [],
      Afternoon: [],
      Evening: [],
    };
    
    allSlots.forEach(slot => {
      const hour = parseInt(slot.start?.split(':')[0]) || 0;
      if (hour < 12) {
        groups.Morning.push(slot);
      } else if (hour < 17) {
        groups.Afternoon.push(slot);
      } else {
        groups.Evening.push(slot);
      }
    });
    
    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });
    
    return groups;
  }, [availableSlots]);
  return (
    <>
      <Grid>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
            }}
          >
            <Box
              sx={{
                backgroundColor: color.main,
                borderTop: "2px solid white",
                color: "white",
                textAlign: "center",
                py: { xs: 3, md: 4 },
              }}
            >
              <LocalHospital sx={{ fontSize: 44, mb: 1 }} />
              <Typography variant="h4" fontWeight={700}>
                Book Your Appointment
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Quick and easy scheduling with our expert doctors
              </Typography>

              <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                <ToggleButtonGroup
                  value={bookingFor}
                  exclusive
                  aria-label="booking type"
                  sx={{
                    position: "relative",
                    backgroundColor: "#f5f7f6",
                    borderRadius: "30px",
                    padding: "6px",
                    width: 390,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",

                    // Sliding background
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 6,
                      left: bookingFor === "self" ? 6 : "50%",
                      width: "calc(50% - 6px)",
                      height: "calc(100% - 12px)",
                      backgroundColor: "#0f7468",
                      borderRadius: "24px",
                      transition: "all 0.3s ease",
                      zIndex: 0,
                    },

                    "& .MuiToggleButton-root": {
                      flex: 1,
                      border: "none",
                      borderRadius: "24px",
                      zIndex: 1,
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      color: "#0f7468",
                      transition: "color 0.3s ease",
                      "&.Mui-selected": {
                        color: "white",
                        backgroundColor: "transparent",
                      },
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    },
                  }}
                >
                  <ToggleButton value="self">For Myself</ToggleButton>
                  <ToggleButton value="other">For Someone Else</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>

            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                  mb: 5,
                  "& .MuiStepLabel-label": { fontWeight: 500 },
                  color: theme.palette.text.secondary,
                }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <form onSubmit={formik.handleSubmit}>
                {/* Step 0 - Patient Info */}
                {activeStep === 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 4,
                        borderRadius: 3,
                        backgroundColor: "#fdfbfbff",
                      }}
                    >
                      <Typography variant="h6" gutterBottom fontWeight="600">
                        {bookingFor === "self"
                          ? "Your Information"
                          : "Patient Information"}
                      </Typography>
                      <Typography variant="body2" mb={3}>
                        {bookingFor === "self"
                          ? "Your personal details will be automatically taken from your profile. Please make sure your profile information is up to date before booking the appointment."
                          : "Please provide the patient's details to proceed with the appointment."}
                      </Typography>

                      <Grid container spacing={3}>
                        {/* Name - Only show when booking for others */}
                        {bookingFor === "other" && (
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Patient Full Name"
                              name="name"
                              sx={{
                                "& .MuiInputLabel-root": { color: "black" },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "blue",
                                },
                                "& .MuiInputLabel-root.Mui-error": {
                                  color: "red",
                                },
                              }}
                              value={formik.values.name}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.name &&
                                Boolean(formik.errors.name)
                              }
                              helperText={
                                formik.touched.name && formik.errors.name
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Person color="primary" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        )}

                        {/* Age - Only show when booking for others */}
                        {bookingFor === "other" && (
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              type="number"
                              name="age"
                              label="Patient Age"
                              sx={{
                                "& .MuiInputLabel-root": { color: "black" },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "blue",
                                },
                                "& .MuiInputLabel-root.Mui-error": {
                                  color: "red",
                                },
                              }}
                              value={formik.values.age}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.age && Boolean(formik.errors.age)
                              }
                              helperText={
                                formik.touched.age && formik.errors.age
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Cake color="primary" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        )}

                        {/* Gender - Only show when booking for others */}
                        {bookingFor === "other" && (
                          <Grid item xs={12} md={6}>
                            <TextField
                              select
                              fullWidth
                              label="Patient Gender"
                              name="gender"
                              sx={{
                                "& .MuiInputLabel-root": { color: "black" },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "blue",
                                },
                                "& .MuiInputLabel-root.Mui-error": {
                                  color: "red",
                                },
                              }}
                              value={formik.values.gender}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.gender &&
                                Boolean(formik.errors.gender)
                              }
                              helperText={
                                formik.touched.gender && formik.errors.gender
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Person color="primary" />
                                  </InputAdornment>
                                ),
                              }}
                            >
                              <MenuItem value="Male">Male</MenuItem>
                              <MenuItem value="Female">Female</MenuItem>
                              <MenuItem value="Other">Other</MenuItem>
                            </TextField>
                          </Grid>
                        )}

                        {/* Area - Only show when booking for others */}
                        {bookingFor === "other" && (
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Area"
                              name="area"
                              sx={{
                                "& .MuiInputLabel-root": { color: "black" },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "blue",
                                },
                                "& .MuiInputLabel-root.Mui-error": {
                                  color: "red",
                                },
                              }}
                              value={formik.values.area}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.area &&
                                Boolean(formik.errors.area)
                              }
                              helperText={
                                formik.touched.area && formik.errors.area
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LocationOn color="primary" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        )}

                        {/* City - Only show when booking for others */}
                        {bookingFor === "other" && (
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Pin Code"
                              name="city"
                              sx={{
                                "& .MuiInputLabel-root": { color: "black" },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "blue",
                                },
                                "& .MuiInputLabel-root.Mui-error": {
                                  color: "red",
                                },
                              }}
                              value={formik.values.city}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.city &&
                                Boolean(formik.errors.city)
                              }
                              helperText={
                                formik.touched.city && formik.errors.city
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LocationOn color="primary" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        )}

                        {/* Problem Description - Always required */}
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            label={
                              bookingFor === "self"
                                ? "Health issue or reason for visit"
                                : "Health issue or reason for visit"
                            }
                            name="problem"
                            sx={{
                              "& .MuiInputLabel-root": { color: "black" },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: "blue",
                              },
                              width: "500px",
                              "& .MuiInputLabel-root.Mui-error": {
                                color: "red",
                              },
                            }}
                            value={formik.values.problem}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.problem &&
                              Boolean(formik.errors.problem)
                            }
                            helperText={
                              formik.touched.problem && formik.errors.problem
                            }
                            placeholder="Please describe the symptoms, concerns, or issues..."
                          />
                        </Grid>

                        {/* Next Button */}
                        <Grid item xs={12} sx={{ mt: 1 }}>
                          <Button
                            variant="contained"
                            size="large"
                            sx={{
                              backgroundColor: theme.palette.primary.main,
                              color: "white",
                              "&:hover": {
                                backgroundColor: theme.palette.primary.dark,
                              },
                            }}
                          >
                            Next
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                )}

                {/* Step 1 - Appointment Details (Only Date and Additional Message) */}
                {activeStep === 1 && (
                  <Box sx={{ mt: 4, width: "100%" }}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 4,
                        borderRadius: 3,
                        width: "100%",
                      }}
                    >
                      <Typography variant="h6" gutterBottom fontWeight="600">
                        Appointment Details
                      </Typography>
                      <Typography variant="body2" mb={3}>
                        Please select your preferred date and time for the
                        appointment.
                      </Typography>

                      <Grid container spacing={3}>
                        {/* Date */}
                        <Grid item xs={12} md={6}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Appointment Date"
                              value={formik.values.date || null}
                              sx={{
                                "& .MuiInputLabel-root": { color: "black" },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "blue",
                                },
                                "& .MuiInputLabel-root.Mui-error": {
                                  color: "red",
                                },
                              }}
                              onChange={(newValue) => {
                                formik.setFieldValue("date", newValue);
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  error: Boolean(formik.errors.date),
                                  helperText: formik.errors.date,
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </Grid>

                        {/* Additional Message */}
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            sx={{
                              "& .MuiInputLabel-root": { color: "black" },
                              "& .MuiInputLabel-root.Mui-focused": {
                                color: "blue",
                              },
                              "& .MuiInputLabel-root.Mui-error": {
                                color: "red",
                              },
                            }}
                            label="Additional Message (Optional)"
                            name="message"
                            value={formik.values.message}
                            onChange={formik.handleChange}
                            placeholder="Please share any additional symptoms, concerns, or special requests..."
                          />
                        </Grid>

                        {/* Time Slots Section */}
                        <Grid item xs={12}>
                          <Box sx={{ width: "100%" }}>
                            <Typography
                              variant="h6"
                              sx={{ color: "green", mb: 2 }}
                            >
                              {availableSlots.length}{" "}
                              {availableSlots.length === 1 ? "Slot" : "Slots"}{" "}
                              Available
                            </Typography>

                            {Object.entries(groupedSlots).map(
                              ([groupName, slots]) => (
                                <Box key={groupName} sx={{ mb: 4 }}>
                                  <Typography
                                    variant="subtitle1"
                                    sx={{ color: "blue", mb: 1 }}
                                  >
                                    {groupName} Slots
                                  </Typography>

                                  <Grid container spacing={2}>
                                    {slots.map((slot, index) => {
                                      const isSelected =
                                        formik.values.time === slot.value;
                                      const isDisabled = slot.is_booked || slot.booked || slot.status === 'inactive';
                                      
                                      const getTooltipMessage = () => {
                                        if (slot.status === 'inactive') return "Slot is inactive";
                                        if (slot.is_booked || slot.booked) return "Already booked";
                                        return isSelected ? "Selected Time Slot" : "Click to select";
                                      };

                                      return (
                                        <Grid
                                          item
                                          xs={6}
                                          sm={4}
                                          md={3}
                                          lg={2}
                                          key={index}
                                        >
                                          <Tooltip
                                            title={getTooltipMessage()}
                                            arrow
                                          >
                                            <Button
                                              fullWidth
                                              disabled={isDisabled}
                                              variant={
                                                isSelected
                                                  ? "contained"
                                                  : "outlined"
                                              }
                                              onClick={() =>
                                                !isDisabled && formik.setFieldValue(
                                                  "time",
                                                  slot.value
                                                )
                                              }
                                              sx={{
                                                height: 70,
                                                width: 150,
                                                borderWidth: isSelected ? 2 : 1,
                                                borderColor: isSelected
                                                  ? "primary.main"
                                                  : isDisabled
                                                    ? "#e0e0e0"
                                                    : "grey.900",
                                                backgroundColor: isSelected
                                                  ? "primary.main"
                                                  : isDisabled
                                                    ? "#f5f5f5"
                                                    : "#f9f9f9",
                                                color: isSelected
                                                  ? "#fff"
                                                  : isDisabled
                                                    ? "#9e9e9e"
                                                    : "text.primary",
                                                textTransform: "none",
                                                flexDirection: "column",
                                                display: "flex",
                                                alignItems: "start",
                                                transition: "all 0.3s ease",
                                                boxShadow: isSelected ? 3 : 0,

                                                "&:hover": {
                                                  backgroundColor: isSelected
                                                    ? "primary.dark"
                                                    : isDisabled
                                                      ? "#f5f5f5"
                                                      : "#e0f7fa",
                                                  boxShadow: isSelected || isDisabled ? (isSelected ? 3 : 0) : 12,
                                                },
                                              }}
                                            >
                                              <Typography
                                                variant="caption"
                                                fontWeight="bold"
                                                fontSize={15}
                                              >
                                                {slot.label}
                                              </Typography>
                                              <Typography
                                                variant="body2"
                                                fontSize={18}
                                              >
                                                {slot.time}
                                              </Typography>

                                              {slot.popular && (
                                                <Chip
                                                  label="Popular"
                                                  size="small"
                                                  color="warning"
                                                  sx={{ mt: 0.5 }}
                                                />
                                              )}
                                            </Button>
                                          </Tooltip>
                                        </Grid>
                                      );
                                    })}
                                  </Grid>
                                </Box>
                              )
                            )}

                            {availableSlots.length === 0 && (
                              <Typography color="text.secondary" mt={2}>
                                No slots available for the selected date.
                              </Typography>
                            )}
                          </Box>
                        </Grid>

                        <Box
                          sx={{
                            borderTop: "2px solid #1976d2",
                            width: "100%",
                            height: "2px",
                          }}
                        />

                        <Grid item xs={12}>
                          <Box
                            sx={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "end",
                              alignItems: "end",
                              gap: 2,
                            }}
                          >
                            <Button
                              variant="outlined"
                              onClick={handleBack}
                              size="large"
                            >
                              Back
                            </Button>

                            <LoadingButton
                              type="submit"
                              loading={loading}
                              variant="contained"
                              size="large"
                              sx={{
                                backgroundColor: theme.palette.primary.main,
                                color: "white",
                                "&:hover": {
                                  backgroundColor: theme.palette.primary.dark,
                                },
                              }}
                            >
                              Book Appointment
                            </LoadingButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                )}
              </form>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Appointment booked successfully!
        </Alert>
      </Snackbar>
    </>
  );
}
