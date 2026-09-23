"use client";
import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  Card,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import {
  CalendarToday,
  EventNote,
  CheckCircleOutline,
  Schedule,
  CancelOutlined,
} from "@mui/icons-material";

const YearView = ({
  selectedDate,
  allEvents = [],
  onMonthClick,
}) => {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const paperColor = theme.palette.background.paper;
  const backgroundColor = theme.palette.background.default;
  const textColor = theme.palette.text.primary;
  const secondaryText = theme.palette.text.secondary;
  const dividerColor = theme.palette.divider;

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => {
      const month = dayjs(selectedDate).month(index);

      const monthEvents = allEvents.filter((event) =>
        dayjs(event.date).isSame(month, "month")
      );

      const completed = monthEvents.filter(
        (event) =>
          String(event.status || "").toUpperCase() ===
          "COMPLETED"
      ).length;

      const cancelled = monthEvents.filter(
        (event) =>
          String(event.status || "").toUpperCase() ===
          "CANCELLED"
      ).length;

      const upcoming = monthEvents.filter((event) => {
        const status = String(
          event.status || ""
        ).toUpperCase();

        return (
          status === "PENDING" ||
          status === "CONFIRMED" ||
          status === "IN_PROGRESS"
        );
      }).length;

      const isCurrentMonth =
        month.month() === dayjs().month() &&
        month.year() === dayjs().year();

      return {
        index,
        name: month.format("MMMM"),
        shortName: month.format("MMM"),
        events: monthEvents,
        completed,
        upcoming,
        cancelled,
        isCurrentMonth,
      };
    });
  }, [selectedDate, allEvents]);

  const totalCompleted = useMemo(() => {
    return months.reduce(
      (total, month) => total + month.completed,
      0
    );
  }, [months]);

  const totalUpcoming = useMemo(() => {
    return months.reduce(
      (total, month) => total + month.upcoming,
      0
    );
  }, [months]);

  const totalCancelled = useMemo(() => {
    return months.reduce(
      (total, month) => total + month.cancelled,
      0
    );
  }, [months]);

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        p: {
          xs: 0.8,
          sm: 1.2,
          md: 1.5,
        },
        borderRadius: "8px",
        backgroundColor,
        border: `1px solid ${dividerColor}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          justifyContent: "space-between",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: {
            xs: 0.8,
            sm: 1,
          },
          mb: {
            xs: 1,
            sm: 1.5,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.7,
          }}
        >
          <Box
            sx={{
              width: {
                xs: 27,
                sm: 30,
              },
              height: {
                xs: 27,
                sm: 30,
              },
              borderRadius: "7px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: `${primaryColor}10`,
              border: `1px solid ${primaryColor}20`,
              flexShrink: 0,
            }}
          >
            <CalendarToday
              sx={{
                color: primaryColor,
                fontSize: {
                  xs: 14,
                  sm: 16,
                },
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: "12px",
                  sm: "13px",
                },
                fontWeight: 700,
                lineHeight: 1.2,
                color: textColor,
              }}
            >
              Year Overview
            </Typography>

            <Typography
              sx={{
                mt: 0.15,
                fontSize: {
                  xs: "9px",
                  sm: "10px",
                },
                color: secondaryText,
              }}
            >
              {selectedDate.format("YYYY")} appointment
              summary
            </Typography>
          </Box>
        </Box>

        <Chip
          label={`${allEvents.length} total`}
          icon={<EventNote />}
          size="small"
          sx={{
            height: {
              xs: 22,
              sm: 24,
            },
            borderRadius: "6px",
            backgroundColor: `${primaryColor}0D`,
            color: primaryColor,
            border: `1px solid ${primaryColor}25`,
            "& .MuiChip-icon": {
              color: primaryColor,
              fontSize: {
                xs: 12,
                sm: 14,
              },
              ml: 0.6,
            },
            "& .MuiChip-label": {
              px: 0.7,
              fontSize: {
                xs: "9px",
                sm: "10px",
              },
              fontWeight: 600,
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: {
            xs: 0.7,
            sm: 1,
          },
        }}
      >
        {months.map((month) => (
          <Card
            key={month.name}
            elevation={0}
            onClick={() =>
              onMonthClick?.(month.index)
            }
            sx={{
              minWidth: 0,
              minHeight: {
                xs: 120,
                sm: 145,
              },
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              borderRadius: {
                xs: "7px",
                sm: "8px",
              },
              border: `1px solid ${
                month.isCurrentMonth
                  ? primaryColor
                  : dividerColor
              }`,
              backgroundColor: month.isCurrentMonth
                ? `${primaryColor}05`
                : paperColor,
              transition:
                "border-color 0.15s ease, background-color 0.15s ease, transform 0.15s ease",
              "&:hover": {
                borderColor: primaryColor,
                backgroundColor: `${primaryColor}04`,
                transform: {
                  xs: "none",
                  md: "translateY(-1px)",
                },
              },
            }}
          >
            {month.isCurrentMonth && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  px: {
                    xs: 0.5,
                    sm: 0.7,
                  },
                  py: 0.25,
                  borderBottomLeftRadius: "6px",
                  backgroundColor: primaryColor,
                  color:
                    theme.palette.primary.contrastText,
                  fontSize: {
                    xs: "7px",
                    sm: "8px",
                  },
                  fontWeight: 700,
                  lineHeight: 1.3,
                }}
              >
                Current
              </Box>
            )}

            <Box
              sx={{
                p: {
                  xs: 0.8,
                  sm: 1.1,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 0.5,
                  mb: {
                    xs: 0.7,
                    sm: 1,
                  },
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    noWrap
                    sx={{
                      fontSize: {
                        xs: "11px",
                        sm: "12.5px",
                      },
                      fontWeight: 700,
                      lineHeight: 1.2,
                      color: month.isCurrentMonth
                        ? primaryColor
                        : textColor,
                    }}
                  >
                    {month.shortName}
                  </Typography>

                  <Typography
                    noWrap
                    sx={{
                      mt: 0.15,
                      fontSize: {
                        xs: "8px",
                        sm: "9.5px",
                      },
                      color: secondaryText,
                    }}
                  >
                    {month.name}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    minWidth: {
                      xs: 22,
                      sm: 25,
                    },
                    height: {
                      xs: 21,
                      sm: 23,
                    },
                    px: 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "6px",
                    backgroundColor:
                      month.events.length > 0
                        ? `${primaryColor}0D`
                        : backgroundColor,
                    color:
                      month.events.length > 0
                        ? primaryColor
                        : secondaryText,
                    border: `1px solid ${
                      month.events.length > 0
                        ? `${primaryColor}20`
                        : dividerColor
                    }`,
                    fontSize: {
                      xs: "8px",
                      sm: "9.5px",
                    },
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {month.events.length}
                </Box>
              </Box>

              {month.events.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: {
                      xs: 0.45,
                      sm: 0.6,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 0.5,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.35,
                        minWidth: 0,
                      }}
                    >
                      <CheckCircleOutline
                        sx={{
                          fontSize: {
                            xs: 11,
                            sm: 13,
                          },
                          color:
                            theme.palette.success.main,
                          flexShrink: 0,
                        }}
                      />

                      <Typography
                        noWrap
                        sx={{
                          fontSize: {
                            xs: "8px",
                            sm: "9.5px",
                          },
                          color: secondaryText,
                        }}
                      >
                        Completed
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: {
                          xs: "8.5px",
                          sm: "10px",
                        },
                        fontWeight: 700,
                        color:
                          theme.palette.success.main,
                      }}
                    >
                      {month.completed}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 0.5,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.35,
                        minWidth: 0,
                      }}
                    >
                      <Schedule
                        sx={{
                          fontSize: {
                            xs: 11,
                            sm: 13,
                          },
                          color: primaryColor,
                          flexShrink: 0,
                        }}
                      />

                      <Typography
                        noWrap
                        sx={{
                          fontSize: {
                            xs: "8px",
                            sm: "9.5px",
                          },
                          color: secondaryText,
                        }}
                      >
                        Upcoming
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: {
                          xs: "8.5px",
                          sm: "10px",
                        },
                        fontWeight: 700,
                        color: primaryColor,
                      }}
                    >
                      {month.upcoming}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 0.5,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.35,
                        minWidth: 0,
                      }}
                    >
                      <CancelOutlined
                        sx={{
                          fontSize: {
                            xs: 11,
                            sm: 13,
                          },
                          color:
                            theme.palette.error.main,
                          flexShrink: 0,
                        }}
                      />

                      <Typography
                        noWrap
                        sx={{
                          fontSize: {
                            xs: "8px",
                            sm: "9.5px",
                          },
                          color: secondaryText,
                        }}
                      >
                        Cancelled
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: {
                          xs: "8.5px",
                          sm: "10px",
                        },
                        fontWeight: 700,
                        color:
                          theme.palette.error.main,
                      }}
                    >
                      {month.cancelled}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    minHeight: {
                      xs: 57,
                      sm: 72,
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "5px",
                    backgroundColor,
                    border: `1px dashed ${dividerColor}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "8px",
                        sm: "9.5px",
                      },
                      color: secondaryText,
                      textAlign: "center",
                    }}
                  >
                    No appointments
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          mt: {
            xs: 1,
            sm: 1.5,
          },
          pt: {
            xs: 0.8,
            sm: 1.2,
          },
          borderTop: `1px solid ${dividerColor}`,
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(3, 1fr)",
            sm: "repeat(3, auto)",
          },
          justifyContent: {
            sm: "center",
          },
          gap: {
            xs: 0.5,
            sm: 2,
          },
        }}
      >
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "8px",
                sm: "9px",
              },
              color: secondaryText,
            }}
          >
            Completed
          </Typography>

          <Typography
            sx={{
              mt: 0.1,
              fontSize: {
                xs: "11px",
                sm: "12px",
              },
              fontWeight: 700,
              color: theme.palette.success.main,
            }}
          >
            {totalCompleted}
          </Typography>
        </Box>

        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "8px",
                sm: "9px",
              },
              color: secondaryText,
            }}
          >
            Upcoming
          </Typography>

          <Typography
            sx={{
              mt: 0.1,
              fontSize: {
                xs: "11px",
                sm: "12px",
              },
              fontWeight: 700,
              color: primaryColor,
            }}
          >
            {totalUpcoming}
          </Typography>
        </Box>

        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "8px",
                sm: "9px",
              },
              color: secondaryText,
            }}
          >
            Cancelled
          </Typography>

          <Typography
            sx={{
              mt: 0.1,
              fontSize: {
                xs: "11px",
                sm: "12px",
              },
              fontWeight: 700,
              color: theme.palette.error.main,
            }}
          >
            {totalCancelled}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default YearView;