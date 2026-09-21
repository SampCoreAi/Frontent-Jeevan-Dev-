  "use client";

  import React, {
    useState,
    useEffect,
  } from "react";

  import axios from "axios";

  import dayjs from "dayjs";

  import {
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    Grid,
    IconButton,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
  } from "@mui/material";

  import CloseIcon from "@mui/icons-material/Close";

  import DeleteIcon from "@mui/icons-material/Delete";

  import RestoreIcon from "@mui/icons-material/Restore";

  import {
    useDispatch,
  } from "react-redux";

  import {
    deleteSchedule,
    updateSlotStatus,
  } from "../../store/scheduleSlice";

  const DoctorScheduleSlots = ({
    open,
    onClose,
    schedule,
    hospitalName,
  }) => {
    const dispatch =
      useDispatch();

    const theme =
      useTheme();

    const isMobile =
      useMediaQuery(
        theme.breakpoints.down(
          "sm"
        )
      );

    const isTablet =
      useMediaQuery(
        theme.breakpoints.down(
          "md"
        )
      );
const [bookingLength, setBookingLength] = useState(0);
    const [
      viewSlots,
      setViewSlots,
    ] = useState([]);

    const [
      selectedDate,
      setSelectedDate,
    ] = useState(null);

    const [
      dateList,
      setDateList,
    ] = useState([]);

    const [
      hoverDate,
      setHoverDate,
    ] = useState(null);

    const [
      hoverSlot,
      setHoverSlot,
    ] = useState(null);

    const [
      selectedSchedule,
      setSelectedSchedule,
    ] =
      useState(schedule);

    const [
      selectedHospital,
      setSelectedHospital,
    ] =
      useState(
        hospitalName
      );

    const [
      deleteReason,
      setDeleteReason,
    ] = useState("");

    const [
      deleteDialog,
      setDeleteDialog,
    ] = useState({
      open: false,

      type: "",

      value: null,
    });

    const [
      snackbar,
      setSnackbar,
    ] = useState({
      open: false,

      message: "",

      severity:
        "success",
    });

    const showSnackbar = (
      message,
      severity = "success"
    ) => {
      setSnackbar({
        open: true,
        message,
        severity,
      });
    };
  const isCurrentDateDeleted =
    viewSlots.length > 0 &&
    viewSlots.every(
      (slot) =>
        String(slot.status || "").toUpperCase() === "DELETED"
    );


    const handleActivateDate = async (date) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/schedules/Activate/${selectedSchedule.id}`,
        {
          date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSnackbar(
        response.data?.message ||
        "Schedule date activated successfully."
      );

      // dobara slots lao
      await fetchSlots(
        selectedSchedule.doctorId,
        selectedHospital,
        date
      );

    } catch (error) {
      console.log("Activate Date Error:", error);

      showSnackbar(
        error.response?.data?.message ||
        "Failed to activate date.",
        "error"
      );
    }
  };
    const fetchSlots =
      async (
        doctorId,
        hospital,
        date
      ) => {
        try {
          const token =
            localStorage.getItem(
              "token"
            );

          const res =
            await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/doctor-slots`,
              {
                params: {
                  doctorId,
                  hospitalName:
                    hospital,
                  date,
                },

                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          setViewSlots(
            res.data?.slots ||
              []
          );

setBookingLength(
  Number(res.data?.booking_length ?? 0)
);
        } catch (error) {
          console.log(
            "Fetch Slots Error:",
            error
          );

          setViewSlots(
            []
          );
        }
      };

    const handleDeleteSlot =
      async (
        slotId,
        reason
      ) => {
        try {
          const result =
            await dispatch(
            deleteSchedule({
    scheduleId: selectedSchedule.id,
    type: "slot",
    slotId,
    reason,
  })
            ).unwrap();

          showSnackbar(
            result.message ||
              "Slot deleted successfully."
          );

          await fetchSlots(
            selectedSchedule.doctorId,
            selectedHospital,
            selectedDate
          );
        } catch (error) {
          showSnackbar(
            error?.message ||
              "Failed to delete slot.",
            "error"
          );
        }
      };

    const handleDeleteDate =
      async (
        date,
        reason
      ) => {
        try {
          const result =
            await dispatch(
              deleteSchedule({
    scheduleId: selectedSchedule.id,
    type: "date",
    date,
    reason,
  })
            ).unwrap();

          showSnackbar(
            result.message ||
              "Schedule date deleted."
          );

          setSelectedDate(
            date
          );

          await fetchSlots(
            selectedSchedule.doctorId,
            selectedHospital,
            date
          );
        } catch (error) {
          showSnackbar(
            error?.message ||
              "Failed to delete date.",
            "error"
          );
        }
      };

const handleActivateSlot = async (slotId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/schedules/Activate/${selectedSchedule.id}`,
      {
        slotId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    showSnackbar(
      response.data?.message ||
        "Slot activated successfully."
    );

    await fetchSlots(
      selectedSchedule.doctorId,
      selectedHospital,
      selectedDate
    );
  } catch (error) {
    console.log(
      "Activate Slot Error:",
      error
    );

    showSnackbar(
      error.response?.data?.message ||
        "Failed to activate slot.",
      "error"
    );
  }
};

    const handleDeleteSubmit =
      async () => {
        if (
          !deleteReason.trim()
        ) {
          showSnackbar(
            "Please enter reason.",
            "error"
          );

          return;
        }

        if (
          deleteDialog.type ===
          "slot"
        ) {
          await handleDeleteSlot(
            deleteDialog.value,
            deleteReason
          );
        }

        if (
          deleteDialog.type ===
          "date"
        ) {
          await handleDeleteDate(
            deleteDialog.value,
            deleteReason
          );
        }

        setDeleteDialog({
          open: false,
          type: "",
          value: null,
        });

        setDeleteReason(
          ""
        );
      };

    const generateDates = (
      startDate,
      endDate
    ) => {
      const dates = [];

      let current =
        dayjs(startDate);

      const last =
        dayjs(endDate);

      while (
        current.isBefore(
          last
        ) ||
        current.isSame(
          last,
          "day"
        )
      ) {
        dates.push(
          current.format(
            "YYYY-MM-DD"
          )
        );

        current =
          current.add(
            1,
            "day"
          );
      }

      return dates;
    };

    useEffect(() => {
      if (
        open &&
        schedule
      ) {
        setSelectedSchedule(
          schedule
        );

        setSelectedHospital(
          hospitalName
        );

        const dates =
          generateDates(
            schedule.startDate,
            schedule.endDate
          );

        setDateList(
          dates
        );

        if (
          dates.length ===
          0
        ) {
          setSelectedDate(
            null
          );

          setViewSlots(
            []
          );

          return;
        }

        const defaultDate =
          dates[0];

        setSelectedDate(
          defaultDate
        );

        fetchSlots(
          schedule.doctorId,
          hospitalName,
          defaultDate
        );
      }
    }, [
      open,
      schedule,
      hospitalName,
    ]);

   return (
  <>
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "10px",
          overflow: "hidden",
          m: isMobile ? 1 : 2,
          width: isMobile ? "calc(100% - 16px)" : "100%",
          maxHeight: isMobile ? "95vh" : "90vh",
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      {/* ================= HEADER ================= */}

      <Box
        sx={{
          px: { xs: 1.5, sm: 2 },
          py: 1.2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Doctor Schedule Slots
          </Typography>

          {selectedHospital && (
            <Typography
              sx={{
                mt: 0.2,
                fontSize: "10.5px",
                color: theme.palette.text.secondary,
              }}
            >
              {selectedHospital}
            </Typography>
          )}
        </Box>

        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            width: 30,
            height: 30,
            color: theme.palette.text.secondary,

            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* ================= BODY ================= */}

      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          height: isMobile ? "auto" : 520,
          overflow: "hidden",
        }}
      >
        {/* ================= LEFT DATE PANEL ================= */}

        <Box
          sx={{
            width: isMobile ? "100%" : 215,
            flexShrink: 0,

            borderRight: isMobile
              ? "none"
              : `1px solid ${theme.palette.divider}`,

            borderBottom: isMobile
              ? `1px solid ${theme.palette.divider}`
              : "none",

            p: 1.5,

            overflowX: isMobile ? "auto" : "hidden",
            overflowY: isMobile ? "hidden" : "auto",

            backgroundColor: theme.palette.background.default,

            "&::-webkit-scrollbar": {
              width: 4,
              height: 4,
            },

            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.divider,
              borderRadius: 10,
            },
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            Available Dates
          </Typography>

          <Stack
            direction={isMobile ? "row" : "column"}
            spacing={0.8}
            sx={{
              minWidth: isMobile ? "max-content" : "auto",
            }}
          >
            {dateList.map((date) => {
              const isSelected = selectedDate === date;

              return (
                <Paper
                  key={date}
                  elevation={0}
                  onMouseEnter={() => setHoverDate(date)}
                  onMouseLeave={() => setHoverDate(null)}
                  onClick={() => {
                    setSelectedDate(date);

                    fetchSlots(
                      selectedSchedule.doctorId,
                      selectedHospital,
                      date
                    );
                  }}
                  sx={{
                    position: "relative",

                    width: isMobile ? 145 : "100%",
                    minWidth: isMobile ? 145 : "auto",

                    px: 1.2,
                    py: 1,

                    borderRadius: "7px",
                    cursor: "pointer",

                    border: `1px solid ${
                      isSelected
                        ? theme.palette.primary.main
                        : theme.palette.divider
                    }`,

                    backgroundColor: isSelected
                      ? `${theme.palette.primary.main}0D`
                      : theme.palette.background.paper,

                    transition: "0.15s ease",

                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "11.5px",
                      fontWeight: 600,
                      color: isSelected
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                    }}
                  >
                    {dayjs(date).format("dddd")}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "10.5px",
                      mt: 0.2,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {dayjs(date).format("DD MMM YYYY")}
                  </Typography>

                  {/* DELETE / RESTORE DATE */}

                  {hoverDate === date && (
                    <>
                      {selectedDate === date &&
                      isCurrentDateDeleted ? (
                        <IconButton
                          size="small"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await handleActivateDate(date);
                          }}
                          sx={{
                            position: "absolute",
                            top: 5,
                            right: 5,

                            width: 25,
                            height: 25,

                            color: theme.palette.primary.main,
                            backgroundColor:
                              theme.palette.background.paper,

                            "&:hover": {
                              backgroundColor:
                                `${theme.palette.primary.main}12`,
                            },
                          }}
                        >
                          <RestoreIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      ) : (
                        <IconButton
                          size="small"
                          onClick={async (e) => {
                            e.stopPropagation();

                            const allSlotsActive =
                              viewSlots.length > 0 &&
                              viewSlots.every(
                                (slot) =>
                                  String(
                                    slot.status || ""
                                  ).toUpperCase() === "ACTIVE"
                              );

                            if (
                              Number(bookingLength) === 0 &&
                              allSlotsActive
                            ) {
                              await handleDeleteDate(date, "");
                              return;
                            }

                            setDeleteDialog({
                              open: true,
                              type: "date",
                              value: date,
                            });

                            setDeleteReason("");
                          }}
                          sx={{
                            position: "absolute",
                            top: 5,
                            right: 5,

                            width: 25,
                            height: 25,

                            color: theme.palette.error.main,

                            "&:hover": {
                              backgroundColor:
                                `${theme.palette.error.main}0D`,
                            },
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      )}
                    </>
                  )}
                </Paper>
              );
            })}
          </Stack>
        </Box>

        {/* ================= RIGHT SLOT PANEL ================= */}

        <Box
          sx={{
            flex: 1,
            minWidth: 0,

            p: {
              xs: 1.5,
              sm: 2,
            },

            overflowY: "auto",

            "&::-webkit-scrollbar": {
              width: 5,
            },

            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.divider,
              borderRadius: 10,
            },
          }}
        >
          {/* SELECTED DATE */}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            gap={0.7}
            mb={1.5}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                {selectedDate
                  ? dayjs(selectedDate).format(
                      "dddd, DD MMM YYYY"
                    )
                  : "Select Date"}
              </Typography>

              <Typography
                sx={{
                  fontSize: "10.5px",
                  color: theme.palette.text.secondary,
                  mt: 0.2,
                }}
              >
                {viewSlots.length} slot
                {viewSlots.length !== 1 ? "s" : ""} available
              </Typography>
            </Box>
          </Stack>

          {/* ================= SLOTS ================= */}

          <Grid container spacing={1}>
            {viewSlots.map((slot) => {
              const status = String(
                slot.status || ""
              ).toUpperCase();

              const isActive = status === "ACTIVE";
              const isDeleted = status === "DELETED";

              const statusColor = isActive
                ? theme.palette.primary.main
                : isDeleted
                ? theme.palette.error.main
                : theme.palette.warning.main;

              return (
                <Grid
                  key={slot.slotId}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: isTablet ? 6 : 4,
                    lg: 3,
                  }}
                >
                  <Paper
                    elevation={0}
                    onMouseEnter={() =>
                      setHoverSlot(slot.slotId)
                    }
                    onMouseLeave={() =>
                      setHoverSlot(null)
                    }
                    sx={{
                      position: "relative",

                      p: 1.3,


                      borderRadius: "8px",

                      border: `1px solid ${
                        isDeleted
                          ? `${theme.palette.error.main}40`
                          : theme.palette.divider
                      }`,

                      backgroundColor: isDeleted
                        ? `${theme.palette.error.main}08`
                        : theme.palette.background.paper,

                      opacity: isDeleted ? 0.75 : 1,

                      transition: "0.15s ease",

                      "&:hover": {
                        borderColor: statusColor,

                        boxShadow:
                          "0 3px 10px rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    {/* STATUS */}

                    <Chip
                      label={status || "UNKNOWN"}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 20,
                        mb: 1,

                        color: statusColor,
                        borderColor: `${statusColor}70`,

                        "& .MuiChip-label": {
                          px: 0.8,
                          fontSize: "9px",
                          fontWeight: 600,
                        },
                      }}
                    />

                    {/* TOKEN */}

                    <Typography
                      sx={{
                        fontSize: "12.5px",
                        fontWeight: 600,
                        color: theme.palette.text.primary,

                        textDecoration: isDeleted
                          ? "line-through"
                          : "none",
                      }}
                    >
                      Token {slot.tokenNumber}
                    </Typography>

                    {/* TIME */}

                    <Typography
                      sx={{
                        fontSize: "10.5px",
                        mt: 0.35,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Start at{" "}
                      {dayjs(
                        `2000-01-01 ${slot.startTime}`
                      ).format("hh:mm A")}
                    </Typography>

                    {/* ACTIVE SLOT -> DELETE */}

                    {isActive &&
                      hoverSlot === slot.slotId && (
                        <IconButton
                          size="small"
                          onClick={async (e) => {
                            e.stopPropagation();

                            if (
                              Number(bookingLength) === 0 &&
                              String(
                                slot.status
                              ).toUpperCase() === "ACTIVE"
                            ) {
                              await handleDeleteSlot(
                                slot.slotId,
                                ""
                              );

                              return;
                            }

                            setDeleteDialog({
                              open: true,
                              type: "slot",
                              value: slot.slotId,
                            });

                            setDeleteReason("");
                          }}
                          sx={{
                            position: "absolute",
                            top: 7,
                            right: 7,

                            width: 25,
                            height: 25,

                            color: theme.palette.error.main,

                            "&:hover": {
                              backgroundColor:
                                `${theme.palette.error.main}0D`,
                            },
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      )}

                    {/* DELETED SLOT -> RESTORE */}

                    {isDeleted && (
                      <IconButton
                        size="small"
                        onClick={async (e) => {
                          e.stopPropagation();

                          await handleActivateSlot(
                            slot.slotId
                          );
                        }}
                        sx={{
                          position: "absolute",
                          top: 7,
                          right: 7,

                          width: 25,
                          height: 25,

                          color: theme.palette.primary.main,

                          backgroundColor:
                            theme.palette.background.paper,

                          "&:hover": {
                            backgroundColor:
                              `${theme.palette.primary.main}12`,
                          },
                        }}
                      >
                        <RestoreIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    )}
                  </Paper>
                </Grid>
              );
            })}

            {/* ================= EMPTY ================= */}

            {viewSlots.length === 0 && (
              <Grid size={12}>
                <Box
                  sx={{
                    minHeight: 160,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    border: `1px dashed ${theme.palette.divider}`,
                    borderRadius: "8px",

                    backgroundColor:
                      theme.palette.background.default,
                  }}
                >
                  <Stack
                    alignItems="center"
                    spacing={0.5}
                    textAlign="center"
                  >
                    <Typography
                      sx={{
                        fontSize: "12.5px",
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      No slots available
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "10.5px",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      No appointment slots are available for
                      this date.
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </Dialog>

    {/* ================= DELETE REASON DIALOG ================= */}

    <Dialog
      open={deleteDialog.open}
      onClose={() => {
        setDeleteDialog({
          open: false,
          type: "",
          value: null,
        });

        setDeleteReason("");
      }}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: "10px",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 0.5,
          }}
        >
          Delete Confirmation
        </Typography>

        <Typography
          sx={{
            fontSize: "11px",
            color: theme.palette.text.secondary,
            mb: 1.5,
          }}
        >
          Please provide a reason before deleting.
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={3}
          size="small"
          label="Reason"
          value={deleteReason}
          onChange={(e) =>
            setDeleteReason(e.target.value)
          }
          sx={{
            "& .MuiInputBase-input": {
              fontSize: "12px",
            },

            "& .MuiInputLabel-root": {
              fontSize: "12px",
            },
          }}
        />

        <Stack
          direction="row"
          spacing={1}
          mt={1.5}
          justifyContent="flex-end"
        >
          <Button
            size="small"
            onClick={() => {
              setDeleteDialog({
                open: false,
                type: "",
                value: null,
              });

              setDeleteReason("");
            }}
            sx={{
              textTransform: "none",
              fontSize: "11.5px",
              color: theme.palette.text.secondary,
            }}
          >
            Cancel
          </Button>

          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={handleDeleteSubmit}
            sx={{
              height: 32,
              px: 2,
              borderRadius: "6px",
              textTransform: "none",
              fontSize: "11.5px",
              boxShadow: "none",

              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            Delete
          </Button>
        </Stack>
      </Box>
    </Dialog>

    {/* ================= SNACKBAR ================= */}

    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={() =>
        setSnackbar((prev) => ({
          ...prev,
          open: false,
        }))
      }
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Alert
        severity={snackbar.severity}
        variant="filled"
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        sx={{
          fontSize: "11.5px",
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  </>
);
  };

  export default DoctorScheduleSlots;