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
          onClose={
            onClose
          }
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,

              overflow:
                "hidden",

              m: isMobile
                ? 1
                : 2,

              width:
                isMobile
                  ? "calc(100% - 16px)"
                  : "100%",

              maxHeight:
                isMobile
                  ? "95vh"
                  : "90vh",
            },
          }}
        >
          <Box
            sx={{
              px: {
                xs: 2,
                sm: 3,
              },

              py: {
                xs: 1.5,
                sm: 2,
              },

              borderBottom:
                "1px solid #ddd",

              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",
            }}
          >
            <Typography
              variant={
                isMobile
                  ? "subtitle1"
                  : "h6"
              }
              fontWeight={
                600
              }
            >
              Doctor Schedule
              Slots
            </Typography>

            <IconButton
              onClick={
                onClose
              }
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display:
                "flex",

              flexDirection:
                isMobile
                  ? "column"
                  : "row",

              height:
                isMobile
                  ? "auto"
                  : 520,

              overflow:
                "hidden",
            }}
          >
            {/* LEFT DATE PANEL */}

            <Box
              sx={{
                width:
                  isMobile
                    ? "100%"
                    : 230,

                borderRight:
                  isMobile
                    ? "none"
                    : "1px solid #ddd",

                borderBottom:
                  isMobile
                    ? "1px solid #ddd"
                    : "none",

                p: 2,

                overflowY:
                  "auto",

                bgcolor:
                  "#fafafa",
              }}
            >
              <Typography
                variant="subtitle2"
                mb={2}
              >
                Available Dates
              </Typography>

              {dateList.map(
                (date) => (
                  <Paper
                    key={
                      date
                    }
                    elevation={
                      0
                    }
                    onMouseEnter={() =>
                      setHoverDate(
                        date
                      )
                    }
                    onMouseLeave={() =>
                      setHoverDate(
                        null
                      )
                    }
                    onClick={() => {
                      setSelectedDate(
                        date
                      );

                      fetchSlots(
                        selectedSchedule.doctorId,
                        selectedHospital,
                        date
                      );
                    }}
                    sx={{
                      p: 1.8,

                      position:
                        "relative",

                      mb: 1.5,

                      borderRadius:
                        2,

                      cursor:
                        "pointer",

                      border:
                        "1px solid",

                      borderColor:
                        selectedDate ===
                        date
                          ? "#1E6658"
                          : "#e0e0e0",

                      bgcolor:
                        selectedDate ===
                        date
                          ? "#E4ECEB"
                          : "#fff",
                    }}
                  >
                    <Typography
                      fontWeight={
                        600
                      }
                    >
                      {dayjs(
                        date
                      ).format(
                        "dddd"
                      )}
                    </Typography>

                    <Typography
                      variant="body2"
                    >
                      {dayjs(
                        date
                      ).format(
                        "DD MMM YYYY"
                      )}
                    </Typography>

                   {hoverDate === date && (
  <>
    {selectedDate === date && isCurrentDateDeleted ? (
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
          color: "#1E6658",
          bgcolor: "#fff",
          "&:hover": {
            bgcolor: "#E8F5E9",
          },
        }}
      >
        <RestoreIcon fontSize="small" />
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
        String(slot.status || "").toUpperCase() === "ACTIVE"
    );

  if (
    Number(bookingLength) === 0 &&
    allSlotsActive
  ) {
    await handleDeleteDate(date, "");
    return;
  }

  // booking hai -> reason box
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
          color: "red",
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    )}
  </>
)}
                  </Paper>
                )
              )}
            </Box>

            {/* RIGHT SLOT PANEL */}

            <Box
              sx={{
                flex: 1,

                p: {
                  xs: 1.5,
                  sm: 2,
                  md: 3,
                },

                overflowY:
                  "auto",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={
                  600
                }
                mb={3}
              >
                {selectedDate &&
                  dayjs(
                    selectedDate
                  ).format(
                    "dddd, DD MMM YYYY"
                  )}
              </Typography>

              <Grid
                container
                spacing={2}
              >
                {viewSlots.map(
                  (slot) => {
                    const status =
                      String(
                        slot.status ||
                          ""
                      ).toUpperCase();

                    const isActive =
                      status ===
                      "ACTIVE";

                    const isDeleted =
                      status ===
                      "DELETED";

                    return (
                      <Grid
                        item
                        xs={
                          12
                        }
                        sm={
                          6
                        }
                        md={
                          isTablet
                            ? 6
                            : 4
                        }
                        lg={
                          3
                        }
                        key={
                          slot.slotId
                        }
                      >
                        <Paper
                          onMouseEnter={() =>
                            setHoverSlot(
                              slot.slotId
                            )
                          }
                          onMouseLeave={() =>
                            setHoverSlot(
                              null
                            )
                          }
                          elevation={
                            0
                          }
                          sx={{
                            p: 2,

                            borderRadius:
                              2,

                            position:
                              "relative",

                            border:
                              "1px solid",

                            borderColor:
                              isActive
                                ? "#1E6658"
                                : isDeleted
                                ? "#d32f2f"
                                : "#ed6c02",

                            bgcolor:
                              isActive
                                ? "#E4ECEB"
                                : isDeleted
                                ? "#FDECEC"
                                : "#FFF4E5",

                            opacity:
                              isDeleted
                                ? 0.8
                                : 1,
                          }}
                        >
                          <Chip
                            label={
                              status ||
                              "UNKNOWN"
                            }
                            size="small"
                            variant="outlined"
                            sx={{
                              mb: 2,

                              fontWeight:
                                600,

                              color:
                                isActive
                                  ? "#1E6658"
                                  : isDeleted
                                  ? "#d32f2f"
                                  : "#ed6c02",

                              borderColor:
                                isActive
                                  ? "#1E6658"
                                  : isDeleted
                                  ? "#d32f2f"
                                  : "#ed6c02",
                            }}
                          />

                          <Typography
                            variant="h6"
                            fontWeight={
                              600
                            }
                            sx={{
                              textDecoration:
                                isDeleted
                                  ? "line-through"
                                  : "none",
                            }}
                          >
                            Token{" "}
                            {
                              slot.tokenNumber
                            }
                          </Typography>

                          <Typography
                            variant="body2"
                            mt={
                              0.5
                            }
                          >
                            Start at{" "}
                            {dayjs(
                              `2000-01-01 ${slot.startTime}`
                            ).format(
                              "hh:mm A"
                            )}
                          </Typography>

                          {/* ACTIVE -> DELETE */}

                          {isActive &&
                            hoverSlot ===
                              slot.slotId && (
                              <IconButton
                                size="small"
                              onClick={async (e) => {
  e.stopPropagation();

  if (
    Number(bookingLength) === 0 &&
    String(slot.status).toUpperCase() === "ACTIVE"
  ) {
    await handleDeleteSlot(
      slot.slotId,
      ""
    );

    return;
  }

  // Booking hai to reason box
  setDeleteDialog({
    open: true,
    type: "slot",
    value: slot.slotId,
  });

  setDeleteReason("");
}}
                                sx={{
                                  position:
                                    "absolute",

                                  top: 5,

                                  right: 5,

                                  color:
                                    "red",
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}

                          {/* DELETED -> RESTORE */}

                          {isDeleted && (
                            <IconButton
                              size="small"
                              onClick={async (
                                e
                              ) => {
                                e.stopPropagation();

                               await handleActivateSlot(
  slot.slotId
);
                              }}
                              sx={{
                                position:
                                  "absolute",

                                top: 5,

                                right: 5,

                                color:
                                  "#1E6658",

                                bgcolor:
                                  "#fff",

                                "&:hover":
                                  {
                                    bgcolor:
                                      "#E8F5E9",
                                  },
                              }}
                            >
                              <RestoreIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Paper>
                      </Grid>
                    );
                  }
                )}

                {viewSlots.length ===
                  0 && (
                  <Grid
                    item
                    xs={
                      12
                    }
                  >
                    <Paper
                      elevation={
                        0
                      }
                      sx={{
                        p: 4,

                        textAlign:
                          "center",

                        border:
                          "1px dashed #ccc",
                      }}
                    >
                      <Typography>
                        No slots
                        available
                        for this
                        date.
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Box>
        </Dialog>

        {/* DELETE REASON DIALOG */}

        <Dialog
          open={
            deleteDialog.open
          }
          onClose={() =>
            setDeleteDialog({
              open: false,

              type: "",

              value: null,
            })
          }
        >
          <Box
            p={3}
            width={
              400
            }
          >
            <Typography
              variant="h6"
              mb={2}
            >
              Delete
              Confirmation
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Reason"
              value={
                deleteReason
              }
              onChange={(
                e
              ) =>
                setDeleteReason(
                  e.target.value
                )
              }
            />

            <Stack
              direction="row"
              spacing={2}
              mt={3}
              justifyContent="flex-end"
            >
              <Button
                onClick={() =>
                  setDeleteDialog(
                    {
                      open: false,

                      type: "",

                      value:
                        null,
                    }
                  )
                }
              >
                Cancel
              </Button>

              <Button
                color="error"
                variant="contained"
                onClick={
                  handleDeleteSubmit
                }
              >
                Delete
              </Button>
            </Stack>
          </Box>
        </Dialog>

        <Snackbar
          open={
            snackbar.open
          }
          autoHideDuration={
            3000
          }
          onClose={() =>
            setSnackbar(
              (prev) => ({
                ...prev,

                open: false,
              })
            )
          }
          anchorOrigin={{
            vertical:
              "top",

            horizontal:
              "right",
          }}
        >
          <Alert
            severity={
              snackbar.severity
            }
            variant="filled"
            onClose={() =>
              setSnackbar(
                (prev) => ({
                  ...prev,

                  open: false,
                })
              )
            }
          >
            {
              snackbar.message
            }
          </Alert>
        </Snackbar>
      </>
    );
  };

  export default DoctorScheduleSlots;