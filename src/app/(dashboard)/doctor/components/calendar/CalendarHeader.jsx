"use client";

import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material";

import { alpha, useTheme } from "@mui/material/styles";

import axios from "axios";

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { formatTimeForDisplay } from "../../utils/index";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CalendarHeader = ({
  onExport,
  onAdd,
  onAppointmentCreated,
}) => {
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] =
    useState(false);

  const [hospitals, setHospitals] =
    useState([]);

  const [form, setForm] = useState({
    patientName: "",
    email: "",
    age: "",
    gender: "",
    phone: "",
    reason: "",

    appointmentDate: new Date()
      .toISOString()
      .split("T")[0],

    hospital: "",
    slotId: "",
  });

  // ============================================================
  // COMMON FIELD STYLE
  // ============================================================

  const fieldSx = {
    "& .MuiInputLabel-root": {
      fontSize: "12.5px",
      color: "text.secondary",

      "&.Mui-focused": {
        color: "primary.main",
      },
    },

    "& .MuiOutlinedInput-root": {
      minHeight: "40px",

      borderRadius: "8px",

      backgroundColor: "background.paper",

      fontSize: "12.5px",

      "& fieldset": {
        borderColor: "divider",
      },

      "&:hover fieldset": {
        borderColor: "primary.light",
      },

      "&.Mui-focused fieldset": {
        borderColor: "primary.main",
        borderWidth: "1px",
      },
    },

    "& .MuiInputBase-input": {
      fontSize: "12.5px",
    },

    "& .MuiSelect-select": {
      fontSize: "12.5px",
    },
  };

  // ============================================================
  // GET SLOTS
  // ============================================================

  const getSlots = async () => {
    if (
      !form.hospital ||
      !form.appointmentDate
    ) {
      setSlots([]);
      return;
    }

    try {
      setSlotsLoading(true);

      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/api/appointments/doctor-slots`,
        {
          params: {
            hospitalName:
              form.hospital,

            date:
              form.appointmentDate,
          },

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setSlots(
          res.data.slots || []
        );
      } else {
        setSlots([]);
      }
    } catch (error) {
      console.log(
        "Slot API Error:",
        error
      );

      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  // ============================================================
  // GET HOSPITALS
  // ============================================================

  const getHospitals = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/api/schedules/getHospitalsName`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const hospitalList =
          res.data.data || [];

        setHospitals(
          hospitalList
        );

        setForm((prev) => ({
          ...prev,

          hospital:
            hospitalList.length > 0
              ? hospitalList[0]
                  .hospitalName
              : "",
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ============================================================
  // EFFECTS
  // ============================================================

  useEffect(() => {
    getHospitals();
  }, []);

  useEffect(() => {
    if (
      hospitals.length > 0 &&
      !form.hospital
    ) {
      setForm((prev) => ({
        ...prev,

        hospital:
          hospitals[0]
            .hospitalName,
      }));
    }
  }, [hospitals]);

  useEffect(() => {
    if (
      form.hospital &&
      form.appointmentDate
    ) {
      getSlots();
    }
  }, [
    form.hospital,
    form.appointmentDate,
  ]);

  // ============================================================
  // USER
  // ============================================================

  let user = {};

  if (typeof window !== "undefined") {
    try {
      user = JSON.parse(
        localStorage.getItem("user") ||
          "{}"
      );
    } catch {
      user = {};
    }
  }

  const roleId = user?.role_id;

  // ============================================================
  // CHANGE
  // ============================================================

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setForm((prev) => ({
      ...prev,

      [name]: value,

      ...(name === "hospital" ||
      name ===
        "appointmentDate"
        ? {
            slotId: "",
          }
        : {}),
    }));
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const payload = {
        appointment_date:
          form.appointmentDate,

        hospital_name:
          form.hospital,

        mode: "offline",

        booking_type:
          "someone_else",

        reason_for_visit:
          form.reason,

        patient: {
          name:
            form.patientName,

          email:
            form.email,

          age:
            Number(form.age),

          gender:
            form.gender,

          phone:
            form.phone,
        },
      };

      const res =
        await axios.post(
          `${API_URL}/api/appointments/bookAppointmentByAssistant`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      if (res.data.success) {
        onAppointmentCreated?.();

        setOpen(false);

        setForm({
          patientName: "",
          email: "",
          age: "",
          gender: "",
          phone: "",
          reason: "",

          appointmentDate:
            new Date()
              .toISOString()
              .split("T")[0],

          hospital:
            hospitals.length > 0
              ? hospitals[0]
                  .hospitalName
              : "",

          slotId: "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      {/* ========================================================
          HEADER
      ======================================================== */}

      <Box
        sx={{
          width: "100%",

          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",

          gap: {
            xs: "8px",
            sm: "12px",
          },

          px: {
            xs: "10px",
            sm: "14px",
          },

          py: {
            xs: "9px",
            sm: "10px",
          },

          minHeight: {
            xs: "58px",
            sm: "64px",
          },

          bgcolor:
            "background.paper",

          border: "1px solid",
          borderColor: "divider",

          borderRadius: "10px",

          boxShadow: `0 2px 10px ${alpha(
            theme.palette.text
              .primary,
            0.04
          )}`,
        }}
      >
        {/* ====================================================
            LEFT
        ==================================================== */}

        <Stack
          direction="row"
          alignItems="center"
          spacing={1.2}
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* ICON */}

          <Box
            sx={{
              width: {
                xs: "36px",
                sm: "40px",
              },

              height: {
                xs: "36px",
                sm: "40px",
              },

              flexShrink: 0,

              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",

              borderRadius: "9px",

              bgcolor:
                "secondary.light",

              color: "primary.main",

              border: "1px solid",

              borderColor: alpha(
                theme.palette.primary
                  .main,
                0.1
              ),
            }}
          >
            <CalendarMonthOutlinedIcon
              sx={{
                fontSize: {
                  xs: "19px",
                  sm: "21px",
                },
              }}
            />
          </Box>

          {/* TEXT */}

          <Box
            sx={{
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "15px",
                  sm: "18px",
                },

                lineHeight: 1.2,

                fontWeight: 700,

                color:
                  "text.primary",

                whiteSpace:
                  "nowrap",

                overflow: "hidden",

                textOverflow:
                  "ellipsis",
              }}
            >
              Medical Calendar
            </Typography>

            <Typography
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },

                mt: "2px",

                fontSize:
                  "12.5px",

                lineHeight: 1.3,

                color:
                  "text.secondary",
              }}
            >
              Manage appointments
              and schedules
            </Typography>
          </Box>
        </Stack>

        {/* ====================================================
            ACTIONS
        ==================================================== */}

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.7,
            sm: 1,
          }}
          flexShrink={0}
        >
          {/* EXPORT */}

          <Button
            variant="outlined"
            onClick={onExport}
            startIcon={
              <DownloadOutlinedIcon />
            }
            sx={{
              height: "36px",

              minWidth: {
                xs: "36px",
                sm: "92px",
              },

              px: {
                xs: 0,
                sm: "12px",
              },

              borderRadius: "8px",

              borderColor:
                "divider",

              color:
                "text.secondary",

              bgcolor:
                "background.paper",

              fontSize: "12.5px",

              fontWeight: 600,

              textTransform: "none",

              boxShadow: "none",

              "& .MuiButton-startIcon":
                {
                  m: {
                    xs: 0,
                    sm: "0 6px 0 0",
                  },

                  "& svg": {
                    fontSize:
                      "17px",
                  },
                },

              "&:hover": {
                borderColor:
                  "primary.light",

                color:
                  "primary.main",

                bgcolor:
                  "secondary.light",
              },
            }}
          >
            <Box
              component="span"
              sx={{
                display: {
                  xs: "none",
                  sm: "inline",
                },
              }}
            >
              Export
            </Box>
          </Button>

          {/* NEW APPOINTMENT */}

          {roleId === 3 && (
            <Button
              variant="contained"
              onClick={() =>
                setOpen(true)
              }
              startIcon={
                <AddRoundedIcon />
              }
              sx={{
                height: "36px",

                minWidth: {
                  xs: "36px",
                  sm: "145px",
                },

                px: {
                  xs: 0,
                  sm: "14px",
                },

                borderRadius:
                  "8px",

                bgcolor:
                  "primary.main",

                color:
                  "primary.contrastText",

                fontSize:
                  "12.5px",

                fontWeight: 650,

                textTransform:
                  "none",

                boxShadow: "none",

                "& .MuiButton-startIcon":
                  {
                    m: {
                      xs: 0,
                      sm: "0 6px 0 0",
                    },

                    "& svg": {
                      fontSize:
                        "18px",
                    },
                  },

                "&:hover": {
                  bgcolor:
                    "primary.dark",

                  boxShadow:
                    "none",
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  display: {
                    xs: "none",
                    sm: "inline",
                  },
                }}
              >
                New Appointment
              </Box>
            </Button>
          )}
        </Stack>
      </Box>

      {/* ========================================================
          NEW APPOINTMENT DIALOG
      ======================================================== */}

      <Dialog
        open={open}
        onClose={() =>
          setOpen(false)
        }
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            width: "760px",

            maxWidth:
              "calc(100vw - 24px)",

            m: {
              xs: "12px",
              sm: "24px",
            },

            borderRadius:
              "12px",

            border:
              "1px solid",

            borderColor:
              "divider",

            boxShadow:
              "0 16px 45px rgba(15, 23, 42, 0.12)",

            overflow: "hidden",
          },
        }}
      >
        {/* ====================================================
            DIALOG HEADER
        ==================================================== */}

        <DialogTitle
          sx={{
            px: {
              xs: "14px",
              sm: "18px",
            },

            py: "13px",

            display: "flex",
            alignItems: "center",

            gap: "10px",

            borderBottom:
              "1px solid",

            borderColor:
              "divider",
          }}
        >
          <Box
            sx={{
              width: "34px",
              height: "34px",

              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",

              flexShrink: 0,

              borderRadius: "8px",

              bgcolor:
                "secondary.light",

              color:
                "primary.main",
            }}
          >
            <CalendarMonthOutlinedIcon
              sx={{
                fontSize: "18px",
              }}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "15px",

                lineHeight: 1.25,

                fontWeight: 700,

                color:
                  "text.primary",
              }}
            >
              New Appointment
            </Typography>

            <Typography
              sx={{
                mt: "2px",

                fontSize:
                  "11.5px",

                color:
                  "text.secondary",
              }}
            >
              Add an offline
              appointment
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={() =>
              setOpen(false)
            }
            sx={{
              width: "30px",
              height: "30px",

              color:
                "text.secondary",

              "&:hover": {
                bgcolor:
                  "background.default",

                color:
                  "text.primary",
              },
            }}
          >
            <CloseRoundedIcon
              sx={{
                fontSize: "18px",
              }}
            />
          </IconButton>
        </DialogTitle>

        {/* ====================================================
            CONTENT
        ==================================================== */}

        <DialogContent
          sx={{
            px: {
              xs: "14px",
              sm: "18px",
            },

            py: "16px !important",

            bgcolor:
              "background.paper",
          }}
        >
          {/* APPOINTMENT */}

          <Box
            sx={{
              mb: "14px",
            }}
          >
            <Typography
              sx={{
                mb: "8px",

                fontSize:
                  "12.5px",

                fontWeight: 700,

                color:
                  "text.primary",
              }}
            >
              Appointment Details
            </Typography>

            <Grid
              container
              spacing={1.25}
            >
              {/* HOSPITAL */}

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Hospital"
                  name="hospital"
                  value={
                    form.hospital
                  }
                  onChange={
                    handleChange
                  }
                  sx={fieldSx}
                >
                  {hospitals.map(
                    (item) => (
                      <MenuItem
                        key={
                          item.hospitalName
                        }
                        value={
                          item.hospitalName
                        }
                        sx={{
                          fontSize:
                            "12.5px",
                        }}
                      >
                        {
                          item.hospitalName
                        }
                      </MenuItem>
                    )
                  )}
                </TextField>
              </Grid>

              {/* DATE */}

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Appointment Date"
                  name="appointmentDate"
                  value={
                    form.appointmentDate
                  }
                  onChange={
                    handleChange
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={fieldSx}
                />
              </Grid>

              {/* SLOT */}

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Select Slot"
                  name="slotId"
                  value={
                    form.slotId
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    slotsLoading
                  }
                  sx={fieldSx}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          maxHeight:
                            280,
                        },
                      },
                    },
                  }}
                >
                  {slotsLoading && (
                    <MenuItem
                      disabled
                      sx={{
                        fontSize:
                          "12.5px",
                      }}
                    >
                      Loading slots...
                    </MenuItem>
                  )}

                  {!slotsLoading &&
                    slots.length ===
                      0 && (
                      <MenuItem
                        disabled
                        sx={{
                          fontSize:
                            "12.5px",
                        }}
                      >
                        No slots
                        available
                      </MenuItem>
                    )}

                  {slots.map(
                    (slot) => (
                      <MenuItem
                        key={
                          slot.slotId
                        }
                        value={
                          slot.slotId
                        }
                        disabled={
                          slot.status !==
                          "ACTIVE"
                        }
                        sx={{
                          fontSize:
                            "12.5px",
                        }}
                      >
                        Token{" "}
                        {
                          slot.tokenNumber
                        }{" "}
                        -{" "}
                        {formatTimeForDisplay(
                          slot.startTime
                        )}{" "}
                        to{" "}
                        {formatTimeForDisplay(
                          slot.endTime
                        )}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </Grid>

              {/* REASON */}

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  label="Reason for Visit"
                  name="reason"
                  value={
                    form.reason
                  }
                  onChange={
                    handleChange
                  }
                  sx={fieldSx}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider
            sx={{
              my: "14px",
            }}
          />

          {/* PATIENT */}

          <Box>
            <Typography
              sx={{
                mb: "8px",

                fontSize:
                  "12.5px",

                fontWeight: 700,

                color:
                  "text.primary",
              }}
            >
              Patient Information
            </Typography>

            <Grid
              container
              spacing={1.25}
            >
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  label="Patient Name"
                  name="patientName"
                  value={
                    form.patientName
                  }
                  onChange={
                    handleChange
                  }
                  sx={fieldSx}
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={
                    handleChange
                  }
                  sx={fieldSx}
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={
                    handleChange
                  }
                  sx={fieldSx}
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 3,
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Age"
                  name="age"
                  value={form.age}
                  onChange={
                    handleChange
                  }
                  sx={fieldSx}
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 3,
                }}
              >
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Gender"
                  name="gender"
                  value={
                    form.gender
                  }
                  onChange={
                    handleChange
                  }
                  sx={fieldSx}
                >
                  <MenuItem
                    value="Male"
                    sx={{
                      fontSize:
                        "12.5px",
                    }}
                  >
                    Male
                  </MenuItem>

                  <MenuItem
                    value="Female"
                    sx={{
                      fontSize:
                        "12.5px",
                    }}
                  >
                    Female
                  </MenuItem>

                  <MenuItem
                    value="Other"
                    sx={{
                      fontSize:
                        "12.5px",
                    }}
                  >
                    Other
                  </MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        {/* ====================================================
            ACTIONS
        ==================================================== */}

        <DialogActions
          sx={{
            px: {
              xs: "14px",
              sm: "18px",
            },

            py: "12px",

            gap: "6px",

            borderTop:
              "1px solid",

            borderColor:
              "divider",

            bgcolor:
              "background.default",
          }}
        >
          <Button
            variant="outlined"
            onClick={() =>
              setOpen(false)
            }
            sx={{
              height: "36px",

              px: "16px",

              borderRadius: "8px",

              borderColor:
                "divider",

              color:
                "text.secondary",

              fontSize:
                "12.5px",

              fontWeight: 600,

              textTransform:
                "none",

              "&:hover": {
                borderColor:
                  "primary.light",

                bgcolor:
                  "background.paper",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              height: "36px",

              px: "18px",

              borderRadius: "8px",

              bgcolor:
                "primary.main",

              fontSize:
                "12.5px",

              fontWeight: 650,

              textTransform:
                "none",

              boxShadow: "none",

              "&:hover": {
                bgcolor:
                  "primary.dark",

                boxShadow: "none",
              },
            }}
          >
            Book Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CalendarHeader;