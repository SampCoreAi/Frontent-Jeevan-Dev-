"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import {
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const DAYS = [
  {
    key: "monday",
    label: "Monday",
    short: "Mon",
  },
  {
    key: "tuesday",
    label: "Tuesday",
    short: "Tue",
  },
  {
    key: "wednesday",
    label: "Wednesday",
    short: "Wed",
  },
  {
    key: "thursday",
    label: "Thursday",
    short: "Thu",
  },
  {
    key: "friday",
    label: "Friday",
    short: "Fri",
  },
  {
    key: "saturday",
    label: "Saturday",
    short: "Sat",
  },
  {
    key: "sunday",
    label: "Sunday",
    short: "Sun",
  },
];

const DEFAULT_START = "09:00";
const DEFAULT_END = "18:00";

const createEmptyHours = () =>
  DAYS.reduce((acc, day) => {
    acc[day.key] = {
      start: "",
      end: "",
    };

    return acc;
  }, {});

const normalizeWorkingHours = (workingHours) => {
  const result = createEmptyHours();

  DAYS.forEach(({ key }) => {
    result[key] = {
      start: workingHours?.[key]?.start || "",
      end: workingHours?.[key]?.end || "",
    };
  });

  return result;
};

const parseTime = (timeStr) => {
  if (!timeStr) return null;

  const parsed = dayjs(
    timeStr,
    ["HH:mm", "HH:mm:ss", "h:mm A", "hh:mm A"],
    true
  );

  return parsed.isValid() ? parsed : null;
};

const formatTime = (value) => {
  if (!value || !dayjs(value).isValid()) {
    return "";
  }

  return dayjs(value).format("HH:mm");
};

const formatDisplayTime = (time) => {
  if (!time) return "";

  const parsed = dayjs(
    time,
    ["HH:mm", "HH:mm:ss", "h:mm A", "hh:mm A"],
    true
  );

  if (!parsed.isValid()) {
    return time;
  }

  return parsed.format("hh:mm A");
};

const WorkingHoursModal = ({
  open,
  onClose,
  workingHours,
  onWorkingHoursChange,
}) => {
  const [draftHours, setDraftHours] =
    useState(createEmptyHours());

  const [selectedDays, setSelectedDays] = useState([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ]);

  const [quickStart, setQuickStart] = useState(
    parseTime(DEFAULT_START)
  );

  const [quickEnd, setQuickEnd] = useState(
    parseTime(DEFAULT_END)
  );

  const [editingDay, setEditingDay] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setDraftHours(
      normalizeWorkingHours(workingHours)
    );

    setEditingDay(null);
    setError("");
  }, [open, workingHours]);

  const hasChanges = useMemo(() => {
    const original =
      normalizeWorkingHours(workingHours);

    return (
      JSON.stringify(original) !==
      JSON.stringify(draftHours)
    );
  }, [workingHours, draftHours]);

  const isDayOpen = (dayKey) => {
    const day = draftHours?.[dayKey];

    return Boolean(
      day?.start &&
      day?.end
    );
  };

  const handleTimeChange = (
    dayKey,
    field,
    value
  ) => {
    setError("");

    setDraftHours((prev) => ({
      ...prev,

      [dayKey]: {
        ...prev[dayKey],
        [field]: formatTime(value),
      },
    }));
  };

  const handleToggleDay = (
    dayKey,
    checked
  ) => {
    setError("");

    setDraftHours((prev) => {
      if (!checked) {
        return {
          ...prev,

          [dayKey]: {
            start: "",
            end: "",
          },
        };
      }

      return {
        ...prev,

        [dayKey]: {
          start:
            prev?.[dayKey]?.start ||
            formatTime(quickStart) ||
            DEFAULT_START,

          end:
            prev?.[dayKey]?.end ||
            formatTime(quickEnd) ||
            DEFAULT_END,
        },
      };
    });
  };

  const handleDaySelection = (dayKey) => {
    setSelectedDays((prev) =>
      prev.includes(dayKey)
        ? prev.filter(
            (item) => item !== dayKey
          )
        : [...prev, dayKey]
    );
  };

  const selectWeekdays = () => {
    setSelectedDays([
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
    ]);
  };

  const selectWeekend = () => {
    setSelectedDays([
      "saturday",
      "sunday",
    ]);
  };

  const selectAllDays = () => {
    setSelectedDays(
      DAYS.map((day) => day.key)
    );
  };

  const clearSelectedDays = () => {
    setSelectedDays([]);
  };

  const applyToSelectedDays = () => {
    const start =
      formatTime(quickStart);

    const end =
      formatTime(quickEnd);

    if (!selectedDays.length) {
      setError(
        "Please select at least one day."
      );

      return;
    }

    if (!start || !end) {
      setError(
        "Please select both opening and closing time."
      );

      return;
    }

    const startTime = dayjs(
      start,
      "HH:mm"
    );

    const endTime = dayjs(
      end,
      "HH:mm"
    );

    if (
      endTime.isSame(startTime) ||
      endTime.isBefore(startTime)
    ) {
      setError(
        "Closing time must be later than opening time."
      );

      return;
    }

    setDraftHours((prev) => {
      const updated = {
        ...prev,
      };

      selectedDays.forEach(
        (dayKey) => {
          updated[dayKey] = {
            start,
            end,
          };
        }
      );

      return updated;
    });

    setError("");
  };

  const closeAllSelectedDays = () => {
    if (!selectedDays.length) {
      setError(
        "Please select at least one day."
      );

      return;
    }

    setDraftHours((prev) => {
      const updated = {
        ...prev,
      };

      selectedDays.forEach(
        (dayKey) => {
          updated[dayKey] = {
            start: "",
            end: "",
          };
        }
      );

      return updated;
    });

    setError("");
  };

  const copyMondayToWeekdays = () => {
    const monday =
      draftHours?.monday;

    if (
      !monday?.start ||
      !monday?.end
    ) {
      setError(
        "Please set Monday working hours first."
      );

      return;
    }

    setDraftHours((prev) => ({
      ...prev,

      tuesday: {
        ...monday,
      },

      wednesday: {
        ...monday,
      },

      thursday: {
        ...monday,
      },

      friday: {
        ...monday,
      },
    }));

    setError("");
  };

  const validateSingleDay = (dayKey) => {
    const day =
      draftHours?.[dayKey];

    if (
      !day?.start ||
      !day?.end
    ) {
      return "Please select both opening and closing time.";
    }

    const start = dayjs(
      day.start,
      "HH:mm"
    );

    const end = dayjs(
      day.end,
      "HH:mm"
    );

    if (
      end.isSame(start) ||
      end.isBefore(start)
    ) {
      return "Closing time must be later than opening time.";
    }

    return "";
  };

  const validateHours = () => {
    for (const {
      key,
      label,
    } of DAYS) {
      const day =
        draftHours?.[key];

      if (
        !day?.start &&
        !day?.end
      ) {
        continue;
      }

      if (
        !day?.start ||
        !day?.end
      ) {
        return `${label}: Please select both opening and closing time.`;
      }

      const start = dayjs(
        day.start,
        "HH:mm"
      );

      const end = dayjs(
        day.end,
        "HH:mm"
      );

      if (
        end.isSame(start) ||
        end.isBefore(start)
      ) {
        return `${label}: Closing time must be later than opening time.`;
      }
    }

    return "";
  };

  const handleDoneEditing = () => {
    if (!editingDay) return;

    const validationError =
      validateSingleDay(editingDay);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setEditingDay(null);
  };

  const handleSave = () => {
    const validationError =
      validateHours();

    if (validationError) {
      setError(
        validationError
      );

      return;
    }

    DAYS.forEach(({ key }) => {
      const oldDay =
        workingHours?.[key] || {
          start: "",
          end: "",
        };

      const newDay =
        draftHours?.[key] || {
          start: "",
          end: "",
        };

      if (
        oldDay.start !==
        newDay.start
      ) {
        onWorkingHoursChange(
          key,
          "start",
          newDay.start
        );
      }

      if (
        oldDay.end !==
        newDay.end
      ) {
        onWorkingHoursChange(
          key,
          "end",
          newDay.end
        );
      }
    });

    setError("");
    setEditingDay(null);

    onClose();
  };

  const handleCancel = () => {
    setDraftHours(
      normalizeWorkingHours(
        workingHours
      )
    );

    setError("");
    setEditingDay(null);

    onClose();
  };

  const currentEditingDay =
    DAYS.find(
      (day) =>
        day.key === editingDay
    );

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
    >
      <Dialog
        open={open}
        onClose={handleCancel}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            width: {
              xs: "calc(100vw - 20px)",
              sm: "calc(100vw - 40px)",
              md: "min(700px, calc(100vw - 80px))",
            },
            maxWidth: "700px",
            maxHeight: {
              xs: "calc(100vh - 20px)",
              sm: "calc(100vh - 40px)",
            },
            m: {
              xs: "10px",
              sm: "20px",
            },
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 20px 60px rgba(15, 23, 42, 0.14)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            px: "16px",
            py: "10px",

            borderBottom:
              "1px solid",

            borderColor:
              "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              gap: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize:
                    "14px",

                  fontWeight:
                    700,

                  color:
                    "text.primary",

                  lineHeight:
                    1.2,
                }}
              >
                Working Hours
              </Typography>

              <Typography
                sx={{
                  mt: "2px",

                  fontSize:
                    "10.5px",

                  color:
                    "text.secondary",
                }}
              >
                Set your weekly
                availability and apply
                hours to multiple days.
              </Typography>
            </Box>

            <IconButton
              size="small"
              onClick={
                handleCancel
              }
              sx={{
                width: 29,
                height: 29,

                border:
                  "1px solid",

                borderColor:
                  "divider",
              }}
            >
              <CloseIcon
                sx={{
                  fontSize: 16,
                }}
              />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{
            p: {
              xs: "10px !important",
              sm: "12px 16px !important",
            },
            overflowY: "auto",
            overflowX: "hidden",
            minWidth: 0,
          }}
        >
          {error && (
            <Alert
              severity="error"
              onClose={() =>
                setError("")
              }
              sx={{
                mb: "9px",

                py: 0,

                "& .MuiAlert-message":
                  {
                    fontSize:
                      "10.5px",
                  },
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            sx={{
              display:
                "grid",

              gridTemplateColumns:
                {
                  xs: "1fr",

                  md: "275px minmax(0, 1fr)",
                },

              gap: "12px",

              alignItems:
                "start",
            }}
          >
            {/* QUICK SETUP */}

            <Box
              sx={{
                border:
                  "1px solid",

                borderColor:
                  "divider",

                borderRadius:
                  "8px",

                p: "11px",

                bgcolor:
                  "background.default",
              }}
            >
              <Box
                sx={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap: "7px",

                  mb: "10px",
                }}
              >
                <AccessTimeOutlinedIcon
                  sx={{
                    fontSize:
                      17,

                    color:
                      "primary.main",
                  }}
                />

                <Box>
                  <Typography
                    sx={{
                      fontSize:
                        "11.5px",

                      fontWeight:
                        700,

                      lineHeight:
                        1.2,
                    }}
                  >
                    Quick setup
                  </Typography>

                  <Typography
                    sx={{
                      mt: "2px",

                      fontSize:
                        "9.5px",

                      color:
                        "text.secondary",
                    }}
                  >
                    Apply same hours to
                    multiple days.
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display:
                    "flex",

                  flexDirection:
                    "column",

                  gap: "7px",
                }}
              >
                <TimePicker
                  label="Opening time"
                  value={
                    quickStart
                  }
                  onChange={
                    setQuickStart
                  }
                  slotProps={{
                    textField: {
                      size: "small",

                      fullWidth:
                        true,

                      sx: {
                        "& .MuiInputBase-root":
                          {
                            height:
                              36,

                            fontSize:
                              "11px",
                          },

                        "& .MuiInputLabel-root":
                          {
                            fontSize:
                              "10.5px",
                          },

                        "& input":
                          {
                            px: "8px",
                          },

                        "& .MuiSvgIcon-root":
                          {
                            fontSize:
                              17,
                          },
                      },
                    },
                  }}
                />

                <TimePicker
                  label="Closing time"
                  value={
                    quickEnd
                  }
                  onChange={
                    setQuickEnd
                  }
                  slotProps={{
                    textField: {
                      size: "small",

                      fullWidth:
                        true,

                      sx: {
                        "& .MuiInputBase-root":
                          {
                            height:
                              36,

                            fontSize:
                              "11px",
                          },

                        "& .MuiInputLabel-root":
                          {
                            fontSize:
                              "10.5px",
                          },

                        "& input":
                          {
                            px: "8px",
                          },

                        "& .MuiSvgIcon-root":
                          {
                            fontSize:
                              17,
                          },
                      },
                    },
                  }}
                />
              </Box>

              <Typography
                sx={{
                  mt: "10px",

                  mb: "6px",

                  fontSize:
                    "9.5px",

                  fontWeight:
                    700,

                  letterSpacing:
                    "0.5px",

                  color:
                    "text.secondary",
                }}
              >
                APPLY TO
              </Typography>

              <Box
                sx={{
                  display:
                    "flex",

                  flexWrap:
                    "wrap",

                  gap: "5px",
                }}
              >
                {DAYS.map(
                  (day) => {
                    const selected =
                      selectedDays.includes(
                        day.key
                      );

                    return (
                      <Chip
                        key={
                          day.key
                        }
                        label={
                          day.short
                        }
                        clickable
                        onClick={() =>
                          handleDaySelection(
                            day.key
                          )
                        }
                        variant={
                          selected
                            ? "filled"
                            : "outlined"
                        }
                        sx={{
                          height:
                            24,

                          fontSize:
                            "10px",

                          fontWeight:
                            600,

                          ...(selected && {
                            bgcolor:
                              "primary.main",

                            color:
                              "primary.contrastText",

                            "&:hover":
                              {
                                bgcolor:
                                  "primary.dark",
                              },
                          }),
                        }}
                      />
                    );
                  }
                )}
              </Box>

              <Box
                sx={{
                  display:
                    "flex",

                  flexWrap:
                    "wrap",

                  gap: "1px",

                  mt: "5px",
                }}
              >
                <Button
                  size="small"
                  onClick={
                    selectWeekdays
                  }
                  sx={{
                    minWidth: 0,

                    px: "5px",

                    fontSize:
                      "9.5px",

                    textTransform:
                      "none",
                  }}
                >
                  Weekdays
                </Button>

                <Button
                  size="small"
                  onClick={
                    selectWeekend
                  }
                  sx={{
                    minWidth: 0,

                    px: "5px",

                    fontSize:
                      "9.5px",

                    textTransform:
                      "none",
                  }}
                >
                  Weekend
                </Button>

                <Button
                  size="small"
                  onClick={
                    selectAllDays
                  }
                  sx={{
                    minWidth: 0,

                    px: "5px",

                    fontSize:
                      "9.5px",

                    textTransform:
                      "none",
                  }}
                >
                  All
                </Button>

                <Button
                  size="small"
                  onClick={
                    clearSelectedDays
                  }
                  sx={{
                    minWidth: 0,

                    px: "5px",

                    fontSize:
                      "9.5px",

                    color:
                      "text.secondary",

                    textTransform:
                      "none",
                  }}
                >
                  Clear
                </Button>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="small"
                startIcon={
                  <DoneAllOutlinedIcon
                    sx={{
                      fontSize:
                        "14px !important",
                    }}
                  />
                }
                onClick={
                  applyToSelectedDays
                }
                sx={{
                  mt: "6px",

                  height: 31,

                  fontSize:
                    "10.5px",

                  fontWeight:
                    600,

                  textTransform:
                    "none",

                  boxShadow:
                    "none",
                }}
              >
                Apply hours
              </Button>

              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={
                  closeAllSelectedDays
                }
                sx={{
                  mt: "5px",

                  height: 30,

                  fontSize:
                    "10px",

                  textTransform:
                    "none",
                }}
              >
                Mark selected closed
              </Button>

            
            </Box>

            {/* WEEKLY SCHEDULE */}

            <Box
              sx={{
                minWidth: 0,
              }}
            >
             

              <Box
                sx={{
                  display:
                    "grid",

gridTemplateColumns: "1fr",
                  gap: "6px",
                }}
              >
                {DAYS.map(
                  (day) => {
                    const dayData =
                      draftHours?.[
                        day.key
                      ] || {
                        start:
                          "",
                        end: "",
                      };

                    const dayOpen =
                      isDayOpen(
                        day.key
                      );

                    return (
                      <Box
                        key={
                          day.key
                        }
                        sx={{
                          minHeight:
                            "46px",

                          display: {
                            xs: "grid",
                            sm: "flex",
                          },

                          gridTemplateColumns: {
                            xs: "minmax(0, 1fr) auto",
                            sm: "none",
                          },

                          alignItems:
                            "center",

                          gap: "8px",

                          px: "10px",

                          py: "6px",

                          border:
                            "1px solid",

                          borderColor:
                            "divider",

                          borderRadius:
                            "7px",

                          bgcolor:
                            "background.default",

                          transition:
                            "0.15s ease",

                          "&:hover":
                            {
                              borderColor:
                                "action.selected",
                            },
                        }}
                      >
                        {/* DAY NAME */}

                        <Box
                          sx={{
                            minWidth: {
                              xs: 0,
                              sm: "75px",
                            },
                            gridColumn: {
                              xs: "1 / -1",
                              sm: "auto",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize:
                                "10.5px",

                              fontWeight:
                                700,

                              lineHeight:
                                1.15,

                              color:
                                "text.primary",
                            }}
                          >
                            {
                              day.label
                            }
                          </Typography>

                          <Typography
                            sx={{
                              mt: "2px",

                              fontSize:
                                "9px",

                              fontWeight:
                                600,

                              lineHeight:
                                1,

                              color:
                                dayOpen
                                  ? "primary.main"
                                  : "text.disabled",
                            }}
                          >
                            {dayOpen
                              ? "Open"
                              : "Closed"}
                          </Typography>
                        </Box>

                        {/* TIME */}

                        <Box
                          sx={{
                            flex: 1,

                            minWidth:
                              0,

                            width: {
                              xs: "100%",
                              sm: "auto",
                            },

                            display:
                              "flex",

                            justifyContent:
                              "flex-end",
                          }}
                        >
                          {dayOpen ? (
                            <Box
                              component="button"
                              type="button"
                              onClick={() => {
                                setError(
                                  ""
                                );

                                setEditingDay(
                                  day.key
                                );
                              }}
                              sx={{
                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                gap: "4px",

                                minWidth:
                                  0,

                                p: 0,

                                border:
                                  0,

                                bgcolor:
                                  "transparent",

                                cursor:
                                  "pointer",

                                fontFamily:
                                  "inherit",

                                color:
                                  "text.secondary",

                                "&:hover":
                                  {
                                    color:
                                      "primary.main",
                                  },
                              }}
                            >
                              <Typography
                                component="span"
                                sx={{
                                  fontSize:
                                    "10px",

                                  fontWeight:
                                    500,

                                  whiteSpace:
                                    "nowrap",

                                  color:
                                    "inherit",
                                }}
                              >
                                {formatDisplayTime(
                                  dayData.start
                                )}
                                {" - "}
                                {formatDisplayTime(
                                  dayData.end
                                )}
                              </Typography>

                              <EditOutlinedIcon
                                sx={{
                                  fontSize:
                                    12,

                                  flexShrink:
                                    0,
                                }}
                              />
                            </Box>
                          ) : (
                            <Typography
                              sx={{
                                fontSize:
                                  "9.5px",

                                color:
                                  "text.disabled",
                              }}
                            >
                              No hours
                            </Typography>
                          )}
                        </Box>

                        {/* SWITCH */}

                        <Switch
                          size="small"
                          checked={
                            dayOpen
                          }
                          onChange={(
                            event
                          ) =>
                            handleToggleDay(
                              day.key,

                              event
                                .target
                                .checked
                            )
                          }
                          sx={{
                            ml: {
                              xs: 0,
                              sm: "2px",
                            },

                            mr: {
                              xs: "-6px",
                              sm: "-6px",
                            },

                            flexShrink:
                              0,

                            "& .MuiSwitch-switchBase":
                              {
                                p: "6px",
                              },

                            "& .MuiSwitch-thumb":
                              {
                                width:
                                  13,

                                height:
                                  13,
                              },

                            "& .MuiSwitch-track":
                              {
                                borderRadius:
                                  10,
                              },
                          }}
                        />
                      </Box>
                    );
                  }
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>

        {/* MAIN FOOTER */}

        <DialogActions
          sx={{
            px: "16px",

            py: "8px",

            minHeight: 48,

            borderTop:
              "1px solid",

            borderColor:
              "divider",

            justifyContent:
              "space-between",
          }}
        >
         

          <Box
            sx={{
              display:
                "flex",

              gap: "7px",

              ml: "auto",

              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
          >
            <Button
              variant="outlined"
              onClick={
                handleCancel
              }
              sx={{
                height: 31,

                minWidth: {
                  xs: 0,
                  sm: 82,
                },

                flex: {
                  xs: 1,
                  sm: "none",
                },

                fontSize:
                  "10.5px",

                textTransform:
                  "none",
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              disabled={
                !hasChanges
              }
              onClick={
                handleSave
              }
              sx={{
                height: 31,

                minWidth: {
                  xs: 0,
                  sm: 108,
                },

                flex: {
                  xs: 1,
                  sm: "none",
                },

                fontSize:
                  "10.5px",

                fontWeight:
                  600,

                textTransform:
                  "none",

                boxShadow:
                  "none",
              }}
            >
              Save Changes
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* INDIVIDUAL DAY TIME EDIT */}

      <Dialog
        open={Boolean(editingDay)}
        onClose={() => {
          setEditingDay(null);
          setError("");
        }}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            width: {
              xs: "calc(100vw - 24px)",
              sm: "min(380px, calc(100vw - 32px))",
            },

            maxHeight: "calc(100vh - 24px)",

            borderRadius:
              "10px",

            border:
              "1px solid",

            borderColor:
              "divider",

            boxShadow:
              "0 16px 45px rgba(15, 23, 42, 0.18)",
          },
        }}
      >
        <DialogTitle
          sx={{
            px: "14px",

            py: "10px",

            borderBottom:
              "1px solid",

            borderColor:
              "divider",
          }}
        >
          <Box
            sx={{
              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize:
                    "12.5px",

                  fontWeight:
                    700,
                }}
              >
                Edit working hours
              </Typography>

              <Typography
                sx={{
                  mt: "1px",

                  fontSize:
                    "9.5px",

                  color:
                    "text.secondary",
                }}
              >
                {
                  currentEditingDay?.label
                }
              </Typography>
            </Box>

            <IconButton
              size="small"
              onClick={() => {
                setEditingDay(
                  null
                );

                setError("");
              }}
              sx={{
                width: 27,

                height: 27,

                border:
                  "1px solid",

                borderColor:
                  "divider",
              }}
            >
              <CloseIcon
                sx={{
                  fontSize: 15,
                }}
              />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{
            p: "14px !important",
          }}
        >
          {editingDay && (
            <Box
              sx={{
                display:
                  "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr auto 1fr",
                },

                alignItems:
                  "center",

                gap: "6px",
              }}
            >
              <TimePicker
                label="From"
                value={parseTime(
                  draftHours?.[
                    editingDay
                  ]?.start
                )}
                onChange={(
                  value
                ) =>
                  handleTimeChange(
                    editingDay,

                    "start",

                    value
                  )
                }
                slotProps={{
                  textField: {
                    size: "small",

                    fullWidth:
                      true,

                    sx: {
                      "& .MuiInputBase-root":
                        {
                          height:
                            38,

                          fontSize:
                            "11px",
                        },

                      "& .MuiInputLabel-root":
                        {
                          fontSize:
                            "10.5px",
                        },

                      "& input":
                        {
                          px: "7px",
                        },

                      "& .MuiSvgIcon-root":
                        {
                          fontSize:
                            16,
                        },
                    },
                  },
                }}
              />

              <Typography
                sx={{
                  fontSize:
                    "9.5px",

                  color:
                    "text.secondary",

                  display: {
                    xs: "none",
                    sm: "block",
                  },
                }}
              >
                to
              </Typography>

              <TimePicker
                label="To"
                value={parseTime(
                  draftHours?.[
                    editingDay
                  ]?.end
                )}
                onChange={(
                  value
                ) =>
                  handleTimeChange(
                    editingDay,

                    "end",

                    value
                  )
                }
                slotProps={{
                  textField: {
                    size: "small",

                    fullWidth:
                      true,

                    sx: {
                      "& .MuiInputBase-root":
                        {
                          height:
                            38,

                          fontSize:
                            "11px",
                        },

                      "& .MuiInputLabel-root":
                        {
                          fontSize:
                            "10.5px",
                        },

                      "& input":
                        {
                          px: "7px",
                        },

                      "& .MuiSvgIcon-root":
                        {
                          fontSize:
                            16,
                        },
                    },
                  },
                }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: "14px",

            py: "9px",

            borderTop:
              "1px solid",

            borderColor:
              "divider",
          }}
        >
          <Button
            variant="contained"
            onClick={
              handleDoneEditing
            }
            sx={{
              height: 30,

              px: "18px",

              fontSize:
                "10.5px",

              fontWeight:
                600,

              textTransform:
                "none",

              boxShadow:
                "none",
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default WorkingHoursModal;