"use client";

import React from "react";
import {
  Box,
  Typography,
  Chip,
  Divider,
} from "@mui/material";

import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import dayjs from "dayjs";

const LeftSide = ({
  bookingFor,
  setBookingFor,
  selectedDate,
  selectedSlot,
  userCity,
  hasMatchingSchedules,
}) => {
  // ============================================
  // TIME
  // ============================================

  const getTimeRange = () => {
    if (!selectedSlot?.start) return null;

    const startTime = dayjs(`2000-01-01 ${selectedSlot.start}`);

    const beforeTime = startTime.subtract(10, "minute");
    const afterTime = startTime.add(10, "minute");

    return `${beforeTime.format("hh:mm A")} – ${afterTime.format(
      "hh:mm A"
    )}`;
  };

  const timeRange = getTimeRange();

  // ============================================
  // FEATURE
  // ============================================

  const FeatureItem = ({ icon, title, description }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.3,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          minWidth: 40,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          borderRadius: "50%",

          bgcolor: "rgba(255,255,255,0.82)",

          border: "1px solid",
          borderColor: "rgba(7,135,106,0.12)",

          color: "primary.main",

          boxShadow: "0 3px 10px rgba(7,135,106,0.06)",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: "12.5px",
            fontWeight: 700,
            lineHeight: 1.25,
            color: "text.primary",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.2,
            fontSize: "10px",
            color: "text.secondary",
            lineHeight: 1.3,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );

  // ============================================
  // STATIC PLACEHOLDER
  // no animation
  // ============================================

  const EmptyValue = ({ width = "70%" }) => (
    <Box
      sx={{
        width,
        maxWidth: 180,
        height: 9,
        borderRadius: 10,
        bgcolor: "rgba(100,116,139,0.12)",
      }}
    />
  );

  // ============================================
  // SUMMARY ROW
  // ============================================

  const SummaryRow = ({
    icon,
    label,
    value,
    placeholderWidth,
  }) => (
    <Box
      sx={{
        minHeight: 38,

        display: "grid",

        gridTemplateColumns: {
          xs: "20px 70px minmax(0,1fr)",
          sm: "20px 100px minmax(0,1fr)",
        },

        alignItems: "center",

        columnGap: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          color: "text.secondary",
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          fontSize: "10.5px",
          fontWeight: 500,
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>

      {value ? (
        <Typography
          sx={{
            fontSize: "11px",
            fontWeight: 600,
            color: "text.primary",

            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {value}
        </Typography>
      ) : (
        <EmptyValue width={placeholderWidth} />
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        width: "100%",

        height: {
          xs: "auto",
          md: "100%",
        },

        minHeight: {
          xs: 600,
          md: "100%",
        },

        position: "relative",
        overflow: "hidden",

        background:
          "linear-gradient(145deg,#F4FCFA 0%,#E5F8F3 50%,#D9F5EE 100%)",

        p: {
          xs: 2.5,
          sm: 3,
          md: 3,
        },
      }}
    >
      {/* ==========================================
          BACKGROUND CIRCLE
      ========================================== */}

      <Box
        sx={{
          position: "absolute",

          width: 260,
          height: 260,

          borderRadius: "50%",

          right: -110,
          top: -120,

          bgcolor: "rgba(7,135,106,0.045)",
        }}
      />

      {/* ==========================================
          MAIN
      ========================================== */}

      <Box
        sx={{
          height: "100%",

          position: "relative",
          zIndex: 1,

          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ========================================
            TOP AREA
        ======================================== */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              md: "55% 45%",
            },

            position: "relative",
          }}
        >
          {/* ======================================
              LEFT CONTENT
          ====================================== */}

          <Box>
            {/* GREEN LINE */}

            <Box
              sx={{
                width: 42,
                height: 4,

                mb: 1.5,

                borderRadius: 10,

                bgcolor: "primary.main",
              }}
            />

            {/* TITLE */}

            <Typography
              sx={{
                fontSize: {
                  xs: "26px",
                  md: "29px",
                },

                fontWeight: 800,
                lineHeight: 1.05,

                color: "text.primary",

                letterSpacing: "-0.7px",
              }}
            >
              Book Your
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: "26px",
                  md: "29px",
                },

                fontWeight: 800,
                lineHeight: 1.05,

                color: "primary.main",

                letterSpacing: "-0.7px",
              }}
            >
              Appointment
            </Typography>

            {/* SUBTITLE */}

            <Typography
              sx={{
                mt: 1,

                fontSize: "11px",

                lineHeight: 1.4,

                color: "text.secondary",
              }}
            >
              Quick and easy scheduling
              <br />
              with expert doctors
            </Typography>

            {/* ====================================
                FEATURES
            ==================================== */}

            <Box
              sx={{
                mt: 2.5,

                display: "flex",
                flexDirection: "column",

                gap: 1.5,
              }}
            >
              <FeatureItem
                icon={
                  <CalendarTodayOutlinedIcon
                    sx={{ fontSize: 18 }}
                  />
                }
                title="Choose Date & Time"
                description="Select your convenient slot"
              />

              <FeatureItem
                icon={
                  <PersonOutlineRoundedIcon
                    sx={{ fontSize: 19 }}
                  />
                }
                title="Consult Top Doctors"
                description="Get expert medical advice"
              />

              <FeatureItem
                icon={
                  <VerifiedUserOutlinedIcon
                    sx={{ fontSize: 18 }}
                  />
                }
                title="Safe & Secure"
                description="Your data is always protected"
              />
              <FeatureItem
  icon={
    <EventAvailableOutlinedIcon
      sx={{ fontSize: 18 }}
    />
  }
  title="Instant Booking"
  description="Book your appointment in seconds"
/>
            </Box>
          </Box>

          {/* ======================================
              DOCTOR
          ====================================== */}

          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },

              position: "relative",

              alignItems: "flex-start",
              justifyContent: "center",

              minHeight: 255,
            }}
          >
            {/* GREEN CIRCLE */}

            <Box
              sx={{
                position: "absolute",

                top: 5,
                left: "50%",

                transform: "translateX(-50%)",

                width: 220,
                height: 220,

                borderRadius: "50%",

                background:
                  "linear-gradient(145deg, rgba(110,231,183,0.25), rgba(45,212,191,0.12))",
              }}
            />

            {/* INNER CIRCLE */}

            <Box
              sx={{
                position: "absolute",

                top: 30,
                left: "50%",

                transform: "translateX(-50%)",

                width: 170,
                height: 170,

                borderRadius: "50%",

                bgcolor: "rgba(255,255,255,0.22)",
              }}
            />

            {/* DOCTOR IMAGE */}

            <Box
              component="img"
              src="/img/appointment-doctor.png"
              alt="Doctor"
              sx={{
                position: "relative",

                zIndex: 2,

                mt: 8,

                width: "100%",
                maxWidth: 245,

                height: 285,

                objectFit: "contain",

                objectPosition: "center top",

                filter:
                  "drop-shadow(0 10px 14px rgba(7,135,106,0.08))",
              }}
            />
          </Box>
        </Box>

        {/* ==========================================
            SUMMARY
            ALWAYS VISIBLE
        ========================================== */}

        <Box
          sx={{
            mt: {
              xs: 3,
              md: "auto",
            },

            p: {
              xs: 1.7,
              md: 1.8,
            },

            borderRadius: 2.5,

            bgcolor: "rgba(255,255,255,0.88)",

            border: "1px solid",
            borderColor: "rgba(7,135,106,0.09)",

            boxShadow:
              "0 8px 25px rgba(15,118,110,0.055)",
          }}
        >
          {/* ======================================
              SUMMARY HEADER
          ====================================== */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",

              mb: 0.6,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",

                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,

                  borderRadius: 1.5,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  bgcolor: "rgba(7,135,106,0.07)",

                  color: "primary.main",
                }}
              >
                <CalendarTodayOutlinedIcon
                  sx={{ fontSize: 18 }}
                />
              </Box>

              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,

                  color: "text.primary",
                }}
              >
                Appointment Summary
              </Typography>
            </Box>

            <Chip
              label="Upcoming"
              size="small"
              sx={{
                height: 22,

                bgcolor: "rgba(7,135,106,0.06)",

                color: "primary.main",

                fontSize: "9px",
                fontWeight: 700,

                "& .MuiChip-label": {
                  px: 1.2,
                },
              }}
            />
          </Box>

          {/* ======================================
              DATE
          ====================================== */}

          <SummaryRow
            icon={
              <CalendarTodayOutlinedIcon
                sx={{ fontSize: 16 }}
              />
            }
            label="Date"
            value={
              selectedDate
                ? selectedDate.format(
                    "dddd, MMMM D, YYYY"
                  )
                : null
            }
            placeholderWidth="75%"
          />

          <Divider
            sx={{
              borderColor: "rgba(15,23,42,0.055)",
            }}
          />

          {/* ======================================
              TIME
          ====================================== */}

          <SummaryRow
            icon={
              <AccessTimeOutlinedIcon
                sx={{ fontSize: 17 }}
              />
            }
            label="Time"
            value={timeRange}
            placeholderWidth="55%"
          />

          {/* ======================================
              MESSAGE
          ====================================== */}

          <Box
            sx={{
              mt: 1,

              px: 1.4,
              py: 1.1,

              display: "flex",
              alignItems: "center",

              gap: 1.1,

              borderRadius: 1.8,

              background:
                "linear-gradient(90deg, rgba(7,135,106,0.075), rgba(7,135,106,0.025))",
            }}
          >
            <FormatQuoteRoundedIcon
              sx={{
                fontSize: 22,

                color: "primary.main",
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontSize: "10px",

                  fontWeight: 700,

                  color: "primary.main",
                }}
              >
                Your health is our priority
              </Typography>

              <Typography
                sx={{
                  mt: 0.1,

                  fontSize: "9.5px",

                  color: "text.secondary",
                }}
              >
                Book with confidence, consult with care.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LeftSide;