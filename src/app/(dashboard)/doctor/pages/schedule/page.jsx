"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Chip,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import ScheduleForm from "../../components/schedule/ScheduleForm";
import SavedSchedules from "../../components/schedule/SavedSchedules";

import {
  fetchHospitals,
  fetchSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  setFormData,
  setEditIndex,
  setEditFormData,
  selectSchedules,
  selectHospitals,
  selectAvailability,
  selectLoading,
  selectFormData,
  selectEditIndex,
} from "../../store/scheduleSlice";

export default function SchedulePage() {
  const dispatch = useDispatch();

  const schedules = useSelector(selectSchedules);
  const hospitals = useSelector(selectHospitals);
  const availability = useSelector(selectAvailability);
  const loading = useSelector(selectLoading);
  const formData = useSelector(selectFormData);
  const editIndex = useSelector(selectEditIndex);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const handleSetFormData = useCallback(
    (data) => dispatch(setFormData(data)),
    [dispatch]
  );

  const handleSetEditIndex = useCallback(
    (index) => dispatch(setEditIndex(index)),
    [dispatch]
  );
  const showMessage = useCallback((message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }, []);

useEffect(() => {
  dispatch(fetchHospitals());

  dispatch(
    fetchSchedules({
      page: 1,
      limit: 20,
    })
  );

  return () => {
    dispatch(
      setFormData({
        location: "",
        hospitalId: null,
    
        slotDuration: "",
        breakDuration: "",
        startDate: "",
        endDate: "",
        activeDays: [],
      })
    );

    dispatch(setEditIndex(null));
  };
}, [dispatch]);

  const handleSaveSchedule = useCallback(
    async (schedule, index = null) => {
      if (!schedule.location) {
        showMessage("Please select hospital.", "error");
        return false;
      }

      if (!schedule.activeDays?.length) {
        showMessage(
          "Please select at least one active day.",
          "error"
        );
        return false;
      }

     

      try {
        if (index !== null) {
          const scheduleId = schedules[index]?.id;

          if (!scheduleId) {
            throw new Error("Invalid schedule.");
          }

          await dispatch(
            updateSchedule({
              id: scheduleId,
              scheduleData: schedule,
            })
          ).unwrap();

          showMessage(
            "Schedule updated successfully.",
            "success"
          );
        } else {
          await dispatch(
            createSchedule(schedule)
          ).unwrap();

          showMessage(
            "Schedule created successfully.",
            "success"
          );
        }

        // DON'T refetch complete schedule list here.
        // Redux already updates local state.

        return true;
      } catch (err) {
        const message =
          typeof err === "string"
            ? err
            : err?.message ||
            "Something went wrong. Please try again.";

        showMessage(message, "error");

        return false;
      }
    },
    [dispatch, schedules, showMessage]
  );

  const handleDelete = useCallback(
    async (scheduleId, reason = "") => {
      if (!scheduleId) {
        showMessage("Invalid schedule.", "error");
        return;
      }

      try {
        await dispatch(
          deleteSchedule({
            scheduleId,
            type: "schedule",
            reason: reason || null,
          })
        ).unwrap();

        showMessage(
          "Schedule deleted successfully.",
          "success"
        );
      } catch (err) {
        showMessage(
          typeof err === "string"
            ? err
            : err?.message || "Unable to delete schedule.",
          "error"
        );
      }
    },
    [dispatch, showMessage]
  );

  const handleEdit = useCallback(
    (index) => {
      const schedule = schedules[index];

      if (!schedule) return;

      dispatch(setEditFormData(schedule));
      dispatch(setEditIndex(index));
    },
    [dispatch, schedules]
  );

  const handleSnackbarClose = useCallback(() => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  return (
    <Grid
      sx={{
        p: {
          xs: 1,
          sm: 2,
        },
        mt: 7.5,
        backgroundColor:"white"
      }}
    >
      <ScheduleForm
        onSave={handleSaveSchedule}
        formData={formData}
        setFormData={handleSetFormData}
        editIndex={editIndex}
        setEditIndex={handleSetEditIndex}
        hospitals={hospitals}
        availability={availability}
        loading={loading}
      />
<Typography
 component="div"
  sx={{
    mt: 3,
    mb: 1.5,
    ml:1,
    fontSize: "14px",
    fontWeight: 600,
    color: "text.primary",
    display: "flex",
    alignItems: "center",
    gap: 1,
  }}
>
  Saved Schedules

  <Chip
    label={schedules.length}
    size="small"
    sx={{
      height: 22,
      fontSize: "10.5px",
    }}
  />
</Typography>

      <SavedSchedules
        schedules={schedules}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={handleSnackbarClose}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}