// SavedSchedules.js
import React, { useState, memo } from "react";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Stack,
  Chip,
  Divider,
  Box,

} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";
import DoctorScheduleSlots from "./ScheduleSlots";
import DeleteReasonDialog from "./DeleteReasonDialog";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};



function SavedSchedules({
  schedules,
  onView,
  onEdit,
  onDelete,
}) {
  const theme = useTheme();
  const [deleteDialog, setDeleteDialog] = useState(false);

  const [scheduleId, setScheduleId] = useState(null);
  // State for DoctorScheduleSlots component
  const [slotsDialogOpen, setSlotsDialogOpen] = useState(false);
  const [selectedScheduleForSlots, setSelectedScheduleForSlots] = useState(null);
  const [selectedHospitalForSlots, setSelectedHospitalForSlots] = useState("");

  const handleViewSlots = (schedule) => {

    const hospitalName = (() => {
      try {
        const hospitalInfo = JSON.parse(schedule.location);
        return hospitalInfo.hospitalName;
      } catch {
        return schedule.location;
      }
    })();

    setSelectedScheduleForSlots(schedule);
    setSelectedHospitalForSlots(hospitalName);
    setSlotsDialogOpen(true);
  };
  return (
    <>
      <Grid container spacing={3}>
        {schedules.map((schedule, index) => (
          <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }}>
            <Card
              sx={{
                height: "100%",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
              }}
            >
              <CardContent>
                {/* Location */}
                <Typography fontWeight={700} fontSize={16}>
                  {(() => {
                    try {
                      const hospitalInfo = JSON.parse(schedule.location || schedule.hospital_name || '{}');
                      return hospitalInfo.hospitalName || schedule.location || 'Unknown Hospital';
                    } catch (error) {
                      return schedule.location || schedule.hospital_name || 'Unknown Hospital';
                    }
                  })()}
                </Typography>

                {/* Time */}
                <Stack direction="row" alignItems="center" gap={1} mt={0.5}>
                  <AccessTimeIcon fontSize="small" />
                  <Typography variant="body2">
                    {schedule.startTime} – {schedule.endTime}
                  </Typography>
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                {/* Slot & Break */}
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <Typography variant="caption">Slot Duration</Typography>
                    <Typography fontWeight={600}>
                      {schedule.slotDuration} min
                    </Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="caption">Break</Typography>
                    <Typography fontWeight={600}>
                      {schedule.breakDuration || 0} min
                    </Typography>
                  </Grid>
                </Grid>

                {/* Date Range */}
                {(schedule.startDate || schedule.endDate) && (
                  <Stack direction="row" alignItems="center" gap={1} mt={1.5}>
                    <CalendarTodayIcon fontSize="small" />
                    <Typography variant="caption">
                      {formatDate(schedule.startDate)} →{" "}
                      {formatDate(schedule.endDate)}
                    </Typography>
                  </Stack>
                )}

                {/* Active Days */}
                <Box mt={1.5}>
                  <Typography variant="caption">Active Days</Typography>
                  <Stack direction="row" gap={0.5} flexWrap="wrap" mt={0.5}>
                    {schedule.activeDays?.map((day) => (
                      <Chip
                        key={day}
                        label={day}
                        size="small"
                        sx={{
                          bgcolor: "#0f7468",
                          color: "white",
                          fontSize: "0.7rem",
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Actions */}
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleViewSlots(schedule)}
                    sx={{
                      bgcolor: "#0f7468",
                      "&:hover": { bgcolor: "#0d655a" },
                    }}
                  >
                    View Slots
                  </Button>

                  <IconButton onClick={() => onEdit(index)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                 
                      const scheduleId = schedule.scheduleId || schedule.id;

                      if (Number(schedule.booking_length) === 0) {
                        onDelete(scheduleId, "");
                        return;
                      }

                      setScheduleId(scheduleId);
                      setDeleteDialog(true);
                    }}
                  >
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <DeleteReasonDialog
        open={deleteDialog}
        title="Delete Schedule"
        onClose={() => setDeleteDialog(false)}
        onSubmit={(reason) => {

          onDelete(scheduleId, reason);

          setDeleteDialog(false);

        }}
      />
      {/* Doctor Schedule Slots Component */}
      <DoctorScheduleSlots
        open={slotsDialogOpen}
        onClose={() => setSlotsDialogOpen(false)}
        schedule={selectedScheduleForSlots}
        hospitalName={selectedHospitalForSlots}
      />
    </>
  );
}

export default memo(SavedSchedules);