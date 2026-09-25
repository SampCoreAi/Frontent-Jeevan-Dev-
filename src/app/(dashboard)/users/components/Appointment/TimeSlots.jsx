"use client";

import React from "react";
import {
  Box,
  Typography,
  Alert,
  Chip,
  Button,
} from "@mui/material";

import dayjs from "dayjs";

import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// ============================================
// COMPONENT
// ============================================

const TimeSlots = ({
  selectedDate,
  selectedSlot,
  setSelectedSlot,
  filteredSlots = [],
  errors = {},
  setErrors,
}) => {
  // ============================================
  // HELPERS
  // ============================================

  const getSlotStatus = (slot) =>
    String(slot?.status || "").toUpperCase();

  const isSlotDisabled = (slot) =>
    getSlotStatus(slot) !== "ACTIVE";

  // ============================================
  // TIME RANGE
  // ============================================

  const getTimeRange = (slot) => {
    if (!slot?.start) return "Time unavailable";

    const startTime = dayjs(`2000-01-01 ${slot.start}`);

    if (!startTime.isValid()) {
      return "Time unavailable";
    }

    const beforeTime = startTime.subtract(10, "minute");
    const afterTime = startTime.add(10, "minute");

    return `${beforeTime.format("hh:mm A")} – ${afterTime.format(
      "hh:mm A"
    )}`;
  };

  // ============================================
  // AVAILABLE COUNT
  // ============================================

  const availableSlots = filteredSlots.filter(
    (slot) => !isSlotDisabled(slot)
  );

  // ============================================
  // SELECT SLOT
  // ============================================

  const handleSelectSlot = (slot) => {
    if (!selectedDate) {
      setErrors?.((prev) => ({
        ...prev,
        slot: "Please select a date before choosing a time slot.",
      }));

      return;
    }

    if (isSlotDisabled(slot)) {
      return;
    }

    setSelectedSlot(slot);

    // Clear only slot validation
    setErrors?.((prev) => ({
      ...prev,
      slot: undefined,
    }));
  };

  // ============================================
  // EMPTY STATE
  // ============================================
const EmptyState = ({ icon, title, description }) => (
  <Box
    sx={{
      width: "100%",
      minHeight: 300,
      px: { xs: 2, sm: 4 },
      py: 3,
      border: "1px solid",
      borderColor: "rgba(30, 102, 88, 0.14)",
      borderRadius: 3,
      background:
        "linear-gradient(145deg, rgba(30, 102, 88, 0.045), rgba(255, 255, 255, 0.7))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      boxSizing: "border-box",
    }}
  >
    {/* Background decoration */}
    <Box
      sx={{
        position: "absolute",
        width: 180,
        height: 180,
        borderRadius: "50%",
        background: "rgba(30, 102, 88, 0.035)",
        top: -90,
        right: -70,
        pointerEvents: "none",
      }}
    />

    <Box
      sx={{
        position: "absolute",
        width: 140,
        height: 140,
        borderRadius: "50%",
        background: "rgba(30, 102, 88, 0.025)",
        bottom: -70,
        left: -50,
        pointerEvents: "none",
      }}
    />

    {/* Main content */}
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: 420,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: { xs: 58, sm: 64 },
          height: { xs: 58, sm: 64 },
          borderRadius: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(145deg, rgba(30, 102, 88, 0.12), rgba(30, 102, 88, 0.06))",
          color: "primary.main",
          border: "1px solid rgba(30, 102, 88, 0.12)",
          boxShadow: "0 8px 22px rgba(30, 102, 88, 0.08)",
          mb: 2,
          "& svg": {
            fontSize: { xs: 28, sm: 30 },
          },
        }}
      >
        {icon}
      </Box>

      {/* Title */}
      <Typography
        sx={{
          fontSize: { xs: "15px", sm: "16px" },
          fontWeight: 700,
          color: "text.primary",
          lineHeight: 1.4,
          letterSpacing: "-0.01em",
          mb: 0.75,
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        sx={{
          fontSize: { xs: "11px", sm: "12px" },
          fontWeight: 400,
          color: "text.secondary",
          lineHeight: 1.6,
          maxWidth: 340,
        }}
      >
        {description}
      </Typography>
    </Box>
  </Box>
);
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {/* ============================================
          HEADER
      ============================================ */}

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

          gap: 1,

          mb: 1.5,
        }}
      >
        {/* LEFT */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,

              borderRadius: 1.5,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              backgroundColor: "secondary.light",
              color: "primary.main",
            }}
          >
            <AccessTimeOutlinedIcon
              sx={{
                fontSize: 18,
              }}
            />
          </Box>

          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.4,
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "text.primary",
                  lineHeight: 1.2,
                }}
              >
                Available Time Slots
              </Typography>

              <Typography
                component="span"
                sx={{
                  color: "error.main",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                *
              </Typography>
            </Box>

            <Typography
              sx={{
                mt: 0.2,
                fontSize: "10px",
                color: "text.secondary",
                lineHeight: 1.3,
              }}
            >
              Choose your preferred appointment time
            </Typography>
          </Box>

          {/* DATE CHIP */}

          {selectedDate && (
            <Chip
              icon={
                <CalendarTodayOutlinedIcon
                  sx={{
                    fontSize: "13px !important",
                  }}
                />
              }
              label={selectedDate.format("MMM D")}
              size="small"
              sx={{
                ml: {
                  xs: 0,
                  sm: 0.5,
                },

                height: 24,

                backgroundColor: "secondary.light",
                color: "primary.main",

                fontSize: "9.5px",
                fontWeight: 700,

                "& .MuiChip-label": {
                  px: 0.8,
                },

                "& .MuiChip-icon": {
                  color: "primary.main",
                  ml: 0.7,
                },
              }}
            />
          )}
        </Box>

        {/* AVAILABLE COUNT */}

        {selectedDate && filteredSlots.length > 0 && (
          <Typography
            sx={{
              fontSize: "10px",
              color: "text.secondary",
              whiteSpace: "nowrap",
            }}
          >
            <Box
              component="span"
              sx={{
                color: "primary.main",
                fontWeight: 700,
              }}
            >
              {availableSlots.length}
            </Box>{" "}
            available
          </Typography>
        )}
      </Box>

      {/* ============================================
          VALIDATION ERROR
      ============================================ */}

      {errors?.slot && (
        <Alert
          severity="error"
          variant="outlined"
          sx={{
            mb: 1.5,

            py: 0.2,
            px: 1,

            borderRadius: 1.5,

            fontSize: "10.5px",

            "& .MuiAlert-icon": {
              fontSize: 17,
              py: 0.6,
            },

            "& .MuiAlert-message": {
              py: 0.6,
            },
          }}
        >
          {errors.slot}
        </Alert>
      )}

      {/* ============================================
          NO DATE SELECTED
      ============================================ */}

      {!selectedDate ? (
        <EmptyState
          icon={
            <CalendarTodayOutlinedIcon
              sx={{ fontSize: 20 }}
            />
          }
          title="Select a date first"
          description="Available appointment slots will appear here after you select a date."
        />
      ) : filteredSlots.length === 0 ? (
        /* ============================================
           NO SLOTS
        ============================================ */

        <EmptyState
          icon={
            <EventBusyOutlinedIcon
              sx={{ fontSize: 20 }}
            />
          }
          title="No slots available"
          description={`There are no appointment slots available for ${selectedDate.format(
            "MMM D, YYYY"
          )}. Please choose another date.`}
        />
      ) : (
        /* ============================================
           SLOT GRID
        ============================================ */

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },

            gap: {
              xs: 1,
              sm: 1.2,
            },
          }}
        >
          {filteredSlots.map((slot, index) => {
            const status = getSlotStatus(slot);

            const isDisabled = isSlotDisabled(slot);

            const isSelected =
              selectedSlot?.start === slot?.start &&
              selectedSlot?.date === slot?.date;

            const timeRange = getTimeRange(slot);

            return (
              <Button
                key={`${slot?.date || "date"}-${
                  slot?.start || index
                }-${slot?.tokenNumber || index}`}
                type="button"
                disabled={isDisabled}
                onClick={() => handleSelectSlot(slot)}
                disableElevation
                sx={{
                  position: "relative",

                  minWidth: 0,
                  minHeight: 48,

                  px: 0.5,
                  py: 0.5,

                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 2,

                  textTransform: "none",

                  border: "1px solid",

                  borderColor: isSelected
                    ? "primary.main"
                    : isDisabled
                      ? "divider"
                      : "rgba(100,116,139,0.24)",

                  backgroundColor: isSelected
                    ? "primary.main"
                    : isDisabled
                      ? "rgba(241,245,249,0.8)"
                      : "background.paper",

                  color: isSelected
                    ? "primary.contrastText"
                    : isDisabled
                      ? "text.disabled"
                      : "text.primary",

                  boxShadow: isSelected
                    ? "0 4px 12px rgba(7,135,106,0.16)"
                    : "none",

                  transition:
                    "border-color 0.15s ease, background-color 0.15s ease",

                  "&:hover": {
                    backgroundColor: isSelected
                      ? "primary.dark"
                      : "secondary.light",

                    borderColor: isSelected
                      ? "primary.dark"
                      : "primary.main",

                    boxShadow: "none",
                  },

                  "&.Mui-disabled": {
                    color: "text.disabled",
                    borderColor: "divider",
                    backgroundColor:
                      "rgba(241,245,249,0.75)",
                  },
                }}
              >
                {/* SELECTED CHECK */}

                {isSelected && (
                  <CheckCircleRoundedIcon
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,

                      fontSize: 14,

                      color: "primary.contrastText",
                    }}
                  />
                )}

                {/* TOKEN */}

                <Typography
                  component="span"
                  sx={{
                    fontSize: "11px",
                    fontWeight: 700,
                    lineHeight: 1.25,

                    color: "inherit",
                  }}
                >
                  Token {slot?.tokenNumber ?? index + 1}
                </Typography>

                      
                {/* STATUS */}

                {isDisabled && (
                  <Typography
                    component="span"
                    sx={{
                      mt: 0.45,

                      fontSize: "8.5px",
                      fontWeight: 600,

                      lineHeight: 1,

                      color: "text.disabled",
                    }}
                  >
                    {status === "DELETED"
                      ? "Unavailable"
                      : "Booked"}
                  </Typography>
                )}
              </Button>
            );
          })}
        </Box>
      )}

      {/* ============================================
          BOTTOM INFORMATION
      ============================================ */}

      {selectedDate && filteredSlots.length > 0 && (
        <Box
          sx={{
            mt: 1.3,

            display: "flex",
            alignItems: "center",

            gap: 0.7,
          }}
        >
          <InfoOutlinedIcon
            sx={{
              fontSize: 14,
              color: "text.secondary",
            }}
          />

          <Typography
            sx={{
              fontSize: "9.5px",
              color: "text.secondary",
              lineHeight: 1.4,
            }}
          >
            Select an available token to confirm your preferred
            appointment time.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TimeSlots;