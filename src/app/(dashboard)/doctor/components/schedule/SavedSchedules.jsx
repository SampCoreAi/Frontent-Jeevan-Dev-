// SavedSchedules.js

import React, { memo, useState } from "react";

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
  Tooltip,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";

import { useTheme } from "@mui/material/styles";

import DoctorScheduleSlots from "./ScheduleSlots";
import DeleteReasonDialog from "./DeleteReasonDialog";

// ============================================================
// DATE FORMAT
// ============================================================

const formatDate = (dateString) => {
  if (!dateString) return "—";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ============================================================
// HOSPITAL NAME
// ============================================================

const getHospitalName = (schedule) => {
  if (!schedule) return "Unknown Hospital";

  try {
    const hospitalInfo = JSON.parse(
      schedule.location || schedule.hospital_name || "{}"
    );

    return (
      hospitalInfo?.hospitalName ||
      schedule.location ||
      schedule.hospital_name ||
      "Unknown Hospital"
    );
  } catch {
    return (
      schedule.location ||
      schedule.hospital_name ||
      "Unknown Hospital"
    );
  }
};

// ============================================================
// COMPONENT
// ============================================================

function SavedSchedules({
  schedules = [],
  onView,
  onEdit,
  onDelete,
}) {
  const theme = useTheme();

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [scheduleId, setScheduleId] = useState(null);

  const [slotsDialogOpen, setSlotsDialogOpen] = useState(false);

  const [
    selectedScheduleForSlots,
    setSelectedScheduleForSlots,
  ] = useState(null);

  const [
    selectedHospitalForSlots,
    setSelectedHospitalForSlots,
  ] = useState("");

  // ============================================================
  // THEME
  // ============================================================

  const primaryColor = theme.palette.primary.main;
  const textColor = theme.palette.text.primary;
  const secondaryText = theme.palette.text.secondary;
  const dividerColor = theme.palette.divider;
  const paperColor = theme.palette.background.paper;
  const backgroundColor = theme.palette.background.default;

  // ============================================================
  // VIEW SLOTS
  // ============================================================

  const handleViewSlots = (schedule) => {
    const hospitalName = getHospitalName(schedule);

    setSelectedScheduleForSlots(schedule);
    setSelectedHospitalForSlots(hospitalName);
    setSlotsDialogOpen(true);
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDeleteClick = (schedule) => {
    const id = schedule?.scheduleId || schedule?.id;

    if (Number(schedule?.booking_length) === 0) {
      onDelete(id, "");
      return;
    }

    setScheduleId(id);
    setDeleteDialog(true);
  };

  // ============================================================
  // EMPTY STATE
  // ============================================================

  if (!Array.isArray(schedules) || schedules.length === 0) {
    return (
      <Box
        sx={{
          minHeight: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px dashed ${dividerColor}`,
          borderRadius: "10px",
          backgroundColor: paperColor,
          px: 2,
        }}
      >
        <Stack
          alignItems="center"
          spacing={0.8}
          textAlign="center"
        >
          <LocalHospitalOutlinedIcon
            sx={{
              fontSize: 30,
              color: secondaryText,
            }}
          />

          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 600,
              color: textColor,
            }}
          >
            No schedules found
          </Typography>

          <Typography
            sx={{
              fontSize: "11.5px",
              color: secondaryText,
            }}
          >
            Create a schedule to start generating
            appointment slots.
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={1.5}>
        {schedules.map((schedule, index) => {
          const hospitalName = getHospitalName(schedule);

          const activeDays = Array.isArray(
            schedule?.activeDays
          )
            ? schedule.activeDays
            : [];

          return (
            <Grid
              key={
                schedule?.scheduleId ||
                schedule?.id ||
                index
              }
              size={{
                xs: 12,
                sm: 6,
                lg: 4,
              }}
            >
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderRadius: "10px",
                  borderColor: dividerColor,
                  backgroundColor: paperColor,
                  boxShadow: "none",
                  transition:
                    "border-color 0.2s ease, box-shadow 0.2s ease",

                  "&:hover": {
                    borderColor: `${primaryColor}80`,
                    boxShadow:
                      "0 4px 14px rgba(0,0,0,0.05)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 1.7,

                    "&:last-child": {
                      pb: 1.7,
                    },
                  }}
                >
                  {/* ================================
                      HOSPITAL + TIME
                  ================================= */}

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={1}
                  >
                    <Box
                      sx={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.7}
                      >
                        <LocalHospitalOutlinedIcon
                          sx={{
                            fontSize: 17,
                            color: primaryColor,
                            flexShrink: 0,
                          }}
                        />

                        <Typography
                          title={hospitalName}
                          sx={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: textColor,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {hospitalName}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.7}
                        mt={0.7}
                      >
                        <AccessTimeOutlinedIcon
                          sx={{
                            fontSize: 15,
                            color: secondaryText,
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: "11.5px",
                            color: secondaryText,
                          }}
                        >
                          {schedule?.startTime || "—"}
                          {" - "}
                          {schedule?.endTime || "—"}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 1.3 }} />

                  {/* ================================
                      SLOT + BREAK
                  ================================= */}

                  <Grid container spacing={1}>
                    <Grid size={6}>
                      <Box
                        sx={{
                          backgroundColor: backgroundColor,
                          borderRadius: "7px",
                          px: 1.2,
                          py: 0.9,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "10.5px",
                            color: secondaryText,
                            mb: 0.2,
                          }}
                        >
                          Slot Duration
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "12.5px",
                            fontWeight: 600,
                            color: textColor,
                          }}
                        >
                          {schedule?.slotDuration || 0} min
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid size={6}>
                      <Box
                        sx={{
                          backgroundColor: backgroundColor,
                          borderRadius: "7px",
                          px: 1.2,
                          py: 0.9,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "10.5px",
                            color: secondaryText,
                            mb: 0.2,
                          }}
                        >
                          Break Duration
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "12.5px",
                            fontWeight: 600,
                            color: textColor,
                          }}
                        >
                          {schedule?.breakDuration || 0} min
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* ================================
                      DATE RANGE
                  ================================= */}

                  {(schedule?.startDate ||
                    schedule?.endDate) && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.8}
                      mt={1.3}
                    >
                      <CalendarTodayOutlinedIcon
                        sx={{
                          fontSize: 15,
                          color: primaryColor,
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: "11.5px",
                          color: textColor,
                        }}
                      >
                        {formatDate(schedule?.startDate)}
                        {"  →  "}
                        {formatDate(schedule?.endDate)}
                      </Typography>
                    </Stack>
                  )}

                  {/* ================================
                      ACTIVE DAYS
                  ================================= */}

                  <Box mt={1.3}>
                    <Typography
                      sx={{
                        fontSize: "10.5px",
                        color: secondaryText,
                        mb: 0.7,
                      }}
                    >
                      Active Days
                    </Typography>

                    {activeDays.length > 0 ? (
                      <Stack
                        direction="row"
                        gap={0.6}
                        flexWrap="wrap"
                      >
                        {activeDays.map((day) => (
                          <Chip
                            key={day}
                            label={day}
                            size="small"
                            sx={{
                              height: 24,
                              borderRadius: "5px",
                              backgroundColor:
                                `${primaryColor}12`,
                              color: primaryColor,
                              border: `1px solid ${primaryColor}30`,

                              "& .MuiChip-label": {
                                px: 1,
                                fontSize: "10.5px",
                                fontWeight: 500,
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Typography
                        sx={{
                          fontSize: "11px",
                          color: secondaryText,
                        }}
                      >
                        No active days
                      </Typography>
                    )}
                  </Box>

                  <Divider sx={{ my: 1.4 }} />

                  {/* ================================
                      ACTIONS
                  ================================= */}

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={1}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() =>
                        handleViewSlots(schedule)
                      }
                      sx={{
                        height: 32,
                        px: 1.7,
                        borderRadius: "6px",
                        backgroundColor: primaryColor,
                        color: "#fff",
                        textTransform: "none",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        boxShadow: "none",

                        "&:hover": {
                          backgroundColor: primaryColor,
                          boxShadow: "none",
                          opacity: 0.92,
                        },
                      }}
                    >
                      View Slots
                    </Button>

                    <Stack direction="row" spacing={0.4}>
                      <Tooltip title="Edit schedule">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(index)}
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "6px",
                            color: primaryColor,
                            border: `1px solid ${dividerColor}`,

                            "&:hover": {
                              backgroundColor:
                                `${primaryColor}0D`,
                            },
                          }}
                        >
                          <EditOutlinedIcon
                            sx={{ fontSize: 17 }}
                          />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete schedule">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleDeleteClick(schedule)
                          }
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "6px",
                            color:
                              theme.palette.error.main,
                            border: `1px solid ${dividerColor}`,

                            "&:hover": {
                              backgroundColor:
                                theme.palette.error
                                  .main + "0D",
                            },
                          }}
                        >
                          <DeleteOutlineIcon
                            sx={{ fontSize: 17 }}
                          />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* DELETE REASON */}

      <DeleteReasonDialog
        open={deleteDialog}
        title="Delete Schedule"
        onClose={() => {
          setDeleteDialog(false);
          setScheduleId(null);
        }}
        onSubmit={(reason) => {
          onDelete(scheduleId, reason);

          setDeleteDialog(false);
          setScheduleId(null);
        }}
      />

      {/* SCHEDULE SLOTS */}

      <DoctorScheduleSlots
        open={slotsDialogOpen}
        onClose={() => {
          setSlotsDialogOpen(false);
          setSelectedScheduleForSlots(null);
          setSelectedHospitalForSlots("");
        }}
        schedule={selectedScheduleForSlots}
        hospitalName={selectedHospitalForSlots}
      />
    </>
  );
}

export default memo(SavedSchedules);