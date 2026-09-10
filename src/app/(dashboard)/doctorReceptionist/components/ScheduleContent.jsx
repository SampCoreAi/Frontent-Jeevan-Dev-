"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  TableContainer,
  TextField,
  MenuItem,
  Typography,
  Divider,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Chip,
  Card,
  CardContent,
  Paper,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function SchedulePage() {
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slotDuration, setSlotDuration] = useState("");
  const [breakDuration, setBreakDuration] = useState("");
  const [activeDays, setActiveDays] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [savedSchedules, setSavedSchedules] = useState([]);

  // For viewing slots
  const [viewSlots, setViewSlots] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  // Generate slots function
  const generateSlots = (start, end, slot, breakTime, location) => {
    let slots = [];
    let [sh, sm] = start.split(":").map(Number);
    let [eh, em] = end.split(":").map(Number);

    let startMinutes = sh * 60 + sm;
    let endMinutes = eh * 60 + em;

    while (startMinutes + slot <= endMinutes) {
      let slotStartH = Math.floor(startMinutes / 60)
        .toString()
        .padStart(2, "0");
      let slotStartM = (startMinutes % 60).toString().padStart(2, "0");

      let slotEndMinutes = startMinutes + slot;
      let slotEndH = Math.floor(slotEndMinutes / 60)
        .toString()
        .padStart(2, "0");
      let slotEndM = (slotEndMinutes % 60).toString().padStart(2, "0");

      slots.push({
        start: `${slotStartH}:${slotStartM}`,
        end: `${slotEndH}:${slotEndM}`,
        location,
      });

      startMinutes = slotEndMinutes + breakTime; // add break time
    }
    return slots;
  };

  const handleSave = () => {
    if (!location || !startTime || !endTime || !slotDuration) return;

    const newSchedule = {
      location,
      startTime,
      endTime,
      slotDuration,
      breakDuration,
      activeDays,
      startDate,
      endDate,
    };
    setSavedSchedules([...savedSchedules, newSchedule]);

    // clear form
    setLocation("");
    setStartTime("");
    setEndTime("");
    setSlotDuration("");
    setBreakDuration("");
    setActiveDays([]);
    setStartDate("");
    setEndDate("");
  };

  const handleDelete = (index) => {
    const updatedSchedules = [...savedSchedules];
    updatedSchedules.splice(index, 1);
    setSavedSchedules(updatedSchedules);
  };

  const handleEdit = (index) => {
    const schedule = savedSchedules[index];
    setLocation(schedule.location);
    setStartTime(schedule.startTime);
    setEndTime(schedule.endTime);
    setSlotDuration(schedule.slotDuration);
    setBreakDuration(schedule.breakDuration);
    setActiveDays(schedule.activeDays);
    setStartDate(schedule.startDate);
    setEndDate(schedule.endDate);

    // remove from savedSchedules
    const updatedSchedules = [...savedSchedules];
    updatedSchedules.splice(index, 1);
    setSavedSchedules(updatedSchedules);
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };
  return (
    <Grid
      sx={{ flex: 1, display: "flex", flexDirection: "column", padding: 3 , mt:4}}
    >
      <Grid
        container
        spacing={2}
        mb={2}
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
          boxShadow: "0 4px 12px #0f7468",
          overflow: "hidden",
          display: "flex",
          height: "100%",
          padding: 2,
          paddingTop: 5,
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{ alignItems: "center", width: "100%", gap: 5 }}
        >
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              sx={{
                minWidth: 200,
                "& .MuiInputLabel-root": { color: "white" },
              }}
              label="Location Name"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              InputLabelProps={{
                style: { color: "black" },
              }}
            >
              <MenuItem value="Adi">Mp Nagar</MenuItem>
              <MenuItem value="Other">Narila</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              type="time"
              fullWidth
              label="Start Time"
              InputLabelProps={{ shrink: true }}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              InputProps={{ endAdornment: <AccessTimeIcon /> }}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "black",
                },
              }}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              type="time"
              fullWidth
              label="End Time"
              InputLabelProps={{ shrink: true }}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              InputProps={{ endAdornment: <AccessTimeIcon /> }}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "black",
                },
              }}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              type="number"
              fullWidth
              label="Slot Duration (minutes)"
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
              InputProps={{ endAdornment: <AccessTimeIcon /> }}
              sx={{
                width: 230,
                "& .MuiFilledInput-root": {
                  backgroundColor: "#000000ff",
                  color: "#000000",
                },
                "& .MuiInputLabel-root": {
                  color: "#000000ff",
                },
                "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button":
                  {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
              }}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              type="number"
              fullWidth
              label="Break Between Slots (minutes)"
              value={breakDuration}
              onChange={(e) => setBreakDuration(e.target.value)}
              InputProps={{ endAdornment: <AccessTimeIcon /> }}
              sx={{
                width: 300,
                "& .MuiFilledInput-root": {
                  backgroundColor: "#000000ff",
                  color: "#000000",
                },
                "& .MuiInputLabel-root": {
                  color: "#000000ff",
                },
                "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button":
                  {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
              }}
            />
          </Grid>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, ml: 1 }}>
            Active Days
          </Typography>

          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
              paddingY: 1,
            }}
          >
            {daysOfWeek.map((day) => (
              <Button
                key={day}
                onClick={() => {
                  if (activeDays.includes(day)) {
                    setActiveDays(activeDays.filter((d) => d !== day));
                  } else {
                    setActiveDays([...activeDays, day]);
                  }
                }}
                sx={{
                  border: "1px solid black",
                  color: activeDays.includes(day) ? "white" : "black",
                  backgroundColor: activeDays.includes(day)
                    ? "#469d8f"
                    : "transparent",
                  fontWeight: 900,
                  fontSize: 16,
                  borderRadius: 1,
                  paddingX: 5,
                  paddingY: 1,
                  "&:hover": {
                    backgroundColor: "#0f7468",
                    color: "white",
                  },
                }}
              >
                {day}
              </Button>
            ))}
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              type="date"
              fullWidth
              label="Start Date ( Optional )"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputProps={{ endAdornment: <CalendarTodayIcon /> }}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "black",
                },
              }}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              type="date"
              fullWidth
              label="End Date ( Optional )"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputProps={{ endAdornment: <CalendarTodayIcon /> }}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "black",
                },
              }}
            />
          </Grid>
        </Grid>
        <Divider sx={{ width: "100%", my: 0 }} />

        <Grid>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ mr: 1, px: 4 }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            sx={{ mr: 1, px: 4 }}
            onClick={() => {
              setLocation("");
              setStartTime("");
              setEndTime("");
              setSlotDuration("");
              setBreakDuration("");
              setActiveDays([]);
              setStartDate("");
              setEndDate("");
            }}
          >
            Clear
          </Button>
        </Grid>
      </Grid>

      <Typography
        variant="h5"
        sx={{
          mb: 3,
          color: "#0f7468",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <AccessTimeIcon />
        Saved Schedules
        <Chip
          label={savedSchedules.length}
          size="small"
          sx={{ bgcolor: "#0f7468", color: "white", fontWeight: 600 }}
        />
      </Typography>

      {savedSchedules.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "grey.50",
            border: "2px dashed",
            borderColor: "grey.300",
          }}
        >
          <AccessTimeIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="grey.600" gutterBottom>
            No Schedules Created Yet
          </Typography>
          <Typography variant="body2" color="grey.500" sx={{ mb: 3 }}>
            Create your first schedule to get started with appointment
            management
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {savedSchedules.map((schedule, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  transition: "all 0.3s ease",
                  border: "1px solid",
                  borderColor: "grey.200",
                  width: 400,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                    borderColor: "#0f7468",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: "#0f7468", fontWeight: 600 }}
                    >
                      {schedule.location}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          fontSize={14}
                        >
                          {formatTime(schedule.startTime)} -{" "}
                          {formatTime(schedule.endTime)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Time Information */}
                  <Stack spacing={1.5} sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", gap: 22 }}>
                      <Box>
                        <Typography
                          variant="caption"
                          color="black"
                          display="block"
                          sx={{ mb: 0.3, fontSize: 14 }}
                        >
                          Slot Duration
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {schedule.slotDuration} min
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          color="black"
                          display="block"
                          sx={{ mb: 0.3, fontSize: 14 }}
                        >
                          Break Time
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {schedule.breakDuration} min
                        </Typography>
                      </Box>
                    </Box>

                    {/* Date Range */}
                    {(schedule.startDate || schedule.endDate) && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarTodayIcon
                          sx={{ color: "black", fontSize: 18 }}
                        />
                        <Typography variant="caption" color="black">
                          {formatDate(schedule.startDate)} →{" "}
                          {formatDate(schedule.endDate)}
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  {/* Active Days */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="caption"
                      color="black"
                      display="block"
                      gutterBottom
                    >
                      Active Days
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={0.5}>
                      {daysOfWeek.map((day) => (
                        <Chip
                          key={day}
                          label={day}
                          size="small"
                          variant={
                            schedule.activeDays?.includes(day)
                              ? "filled"
                              : "outlined"
                          }
                          sx={{
                            minWidth: 40,
                            height: 24,
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            ...(schedule.activeDays?.includes(day) && {
                              bgcolor: "#0f7468",
                              color: "white",
                            }),
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      onClick={() => {
                        const slots = generateSlots(
                          schedule.startTime,
                          schedule.endTime,
                          Number(schedule.slotDuration),
                          Number(schedule.breakDuration),
                          schedule.location
                        );
                        setViewSlots(slots);
                        setOpenDialog(true);
                      }}
                      sx={{
                        flex: 1,
                        bgcolor: "#0f7468",
                        "&:hover": { bgcolor: "#0d655a" },
                      }}
                    >
                      View Slots
                    </Button>

                    <IconButton
                      size="small"
                      onClick={() => handleEdit(index)}
                      sx={{
                        border: "1px solid",
                        borderColor: "primary.main",
                        color: "primary.main",
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => handleDelete(index)}
                      sx={{
                        border: "1px solid",
                        borderColor: "error.main",
                        color: "error.main",
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* View Slots Dialog */}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth={false}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0px 10px 40px rgba(0,0,0,0.15)",
            overflow: "hidden",
            width: 450,
          },
        }}
      >
        <DialogContent sx={{ p: 0, height: "100%" }}>
          {viewSlots.length > 0 && (
            <Box
              sx={{
                position: "relative",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Table */}
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  borderRadius: 0,
                  maxHeight: "calc(100% - 40px)", // summary bar के लिए space छोड़ा
                  overflowY: "auto",
                  scrollBehavior: "smooth",
                  "&::-webkit-scrollbar": { width: 6 },
                  "&::-webkit-scrollbar-track": { background: "transparent" },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(0,0,0,0.2)",
                    borderRadius: 8,
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "rgba(0,0,0,0.35)",
                  },
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow
                      sx={{
                        "& th": {
                          bgcolor: "#f9fafb",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          color: "#374151",
                          borderBottom: "2px solid #e5e7eb",
                        },
                      }}
                    >
                      <TableCell sx={{ width: 60 }}>#</TableCell>
                      <TableCell>Start</TableCell>
                      <TableCell>End</TableCell>
                      <TableCell>Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {viewSlots.map((slot, index) => {
                      const start = new Date(slot.start);
                      const end = new Date(slot.end);
                      const formatTime = (date) =>
                        date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });

                      return (
                        <TableRow
                          key={index}
                          sx={{
                            "&:nth-of-type(even)": { bgcolor: "#fafafa" },
                            "&:hover": {
                              bgcolor: "#f1f5f9",
                              transition: "background 0.2s ease",
                            },
                          }}
                        >
                          <TableCell>
                            <Box
                              sx={{
                                width: 28,
                                height: 28,
                                bgcolor: "#0f766e",
                                color: "white",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                              }}
                            >
                              {index + 1}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={600} color="#111827">
                              {formatTime(start)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={600} color="#111827">
                              {formatTime(end)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={slot.location}
                              size="small"
                              sx={{
                                bgcolor: "#e0f2fe",
                                color: "#0369a1",
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Summary Bar without padding */}
              <Box
                sx={{
                  bgcolor: "#ffffff",
                  borderTop: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="black" sx={{ ml: 3, py: 2 }}>
                  Showing {viewSlots.length} time slots
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Grid>
  );
}
