"use client";

import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Chip,
} from "@mui/material";

import {
  VerifiedRounded,
  CalendarMonthOutlined,
  WorkOutline,
  PaymentsOutlined,
  PersonOutline,
  MedicalServicesOutlined,
  SchoolOutlined,
  LanguageOutlined,
  BadgeOutlined,
  EmergencyOutlined,
} from "@mui/icons-material";

import { useRouter } from "next/navigation";

export default function DoctorProfileDetail({
  data,
  doctorId,
}) {
  const router = useRouter();

  const doctor = data || {};

  // =====================================================
  // LANGUAGES
  // =====================================================

  let languages = [];

  if (Array.isArray(doctor?.language)) {
    languages = doctor.language;
  } else if (typeof doctor?.language === "string") {
    try {
      const parsed = JSON.parse(doctor.language);

      languages = Array.isArray(parsed)
        ? parsed
        : [];
    } catch {
      languages = doctor.language
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const getImageUrl = () => {
    if (!doctor?.img_key) {
      return "/img/IconDoctor.png";
    }

    if (
      doctor.img_key.startsWith("http://") ||
      doctor.img_key.startsWith("https://")
    ) {
      return doctor.img_key;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_S3_BUCKET_URL || "";

    const cleanBase = baseUrl.replace(/\/$/, "");

    const cleanPath = doctor.img_key.replace(
      /^\//,
      ""
    );

    return `${cleanBase}/${cleanPath}`;
  };

  const imageUrl = getImageUrl();

  // =====================================================
  // EMERGENCY
  // =====================================================

  const acceptsEmergency =
    String(
      doctor?.accept_emergency_patients || ""
    )
      .trim()
      .toUpperCase() === "YES";

  // =====================================================
  // BOOK APPOINTMENT
  // =====================================================

  const handleBookAppointment = () => {
    router.push(
      `/users/pages/Appointment?id=${doctorId}`
    );
  };

  return (
    <Box
      sx={{
        maxWidth: 1300,
        mx: "auto",
        width: "100%",
        mb: 1.5,
      }}
    >
      {/* =====================================================
          PROFILE HEADER
      ===================================================== */}

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2.5,
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        {/* COVER */}

        <Box
          sx={{
            height: {
              xs: 45,
              sm: 55,
            },

            bgcolor: "secondary.light",

            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        />

        <Box
          sx={{
            px: {
              xs: 1.5,
              sm: 2.2,
            },

            pb: 1.8,
          }}
        >
          {/* =====================================================
              PROFILE INFO
          ===================================================== */}

          <Box
            sx={{
              display: "flex",

              flexDirection: {
                xs: "column",
                sm: "row",
              },

              alignItems: {
                xs: "stretch",
                sm: "flex-end",
              },

              justifyContent: "space-between",

              gap: 1.5,
            }}
          >
            {/* LEFT */}

            <Box
              sx={{
                display: "flex",

                flexDirection: {
                  xs: "column",
                  sm: "row",
                },

                alignItems: {
                  xs: "center",
                  sm: "flex-end",
                },

                gap: 1.3,
              }}
            >
              {/* PROFILE IMAGE */}

              <Avatar
                src={imageUrl}
                alt={
                  doctor?.full_name ||
                  "Doctor"
                }
                sx={{
                  width: {
                    xs: 76,
                    sm: 84,
                  },

                  height: {
                    xs: 76,
                    sm: 84,
                  },

                  mt: {
                    xs: -4.5,
                    sm: -4.8,
                  },

                  border: "4px solid",

                  borderColor:
                    "background.paper",

                  bgcolor:
                    "secondary.light",

                  color: "primary.main",

                  fontWeight: 700,

                  fontSize: 24,
                }}
              >
                {doctor?.full_name?.charAt(
                  0
                ) || "D"}
              </Avatar>

              {/* NAME INFO */}

              <Box
                sx={{
                  pb: {
                    sm: 0.2,
                  },

                  textAlign: {
                    xs: "center",
                    sm: "left",
                  },
                }}
              >
                {/* NAME */}

                <Box
                  sx={{
                    display: "flex",

                    alignItems: "center",

                    justifyContent: {
                      xs: "center",
                      sm: "flex-start",
                    },

                    gap: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: {
                        xs: 17,
                        sm: 20,
                      },

                      fontWeight: 700,

                      lineHeight: 1.2,

                      color:
                        "text.primary",
                    }}
                  >
                    {doctor?.full_name ||
                      "Doctor Name"}
                  </Typography>

                  <VerifiedRounded
                    sx={{
                      fontSize: 18,

                      color:
                        "primary.main",
                    }}
                  />
                </Box>

                {/* USERNAME */}

                {doctor?.username && (
                  <Typography
                    sx={{
                      mt: 0.2,

                      fontSize: 10.5,

                      color:
                        "text.secondary",

                      fontWeight: 500,
                    }}
                  >
                    @{doctor.username}
                  </Typography>
                )}

                {/* EMERGENCY */}

                {acceptsEmergency && (
                  <Chip
                    icon={
                      <EmergencyOutlined
                        sx={{
                          fontSize:
                            "13px !important",
                        }}
                      />
                    }
                    label="Accepts Emergency"
                    size="small"
                    sx={{
                      mt: 0.6,

                      height: 23,

                      bgcolor:
                        "secondary.light",

                      color:
                        "primary.dark",

                      fontSize: 9.5,

                      fontWeight: 700,

                      "& .MuiChip-icon":
                        {
                          color:
                            "primary.main",
                        },

                      "& .MuiChip-label":
                        {
                          px: 0.8,
                        },
                    }}
                  />
                )}
              </Box>
            </Box>

            {/* =====================================================
                BOOK APPOINTMENT BUTTON
            ===================================================== */}

            <Button
              variant="contained"
              startIcon={
                <CalendarMonthOutlined
                  sx={{
                    fontSize:
                      "17px !important",
                  }}
                />
              }
              onClick={
                handleBookAppointment
              }
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: 165,
                },

                px: 1.8,

                py: 0.75,

                fontSize: 12,

                borderRadius: 1.7,

                textTransform: "none",

                fontWeight: 700,
              }}
            >
              Book Appointment
            </Button>
          </Box>

          {/* =====================================================
              BASIC STATS
          ===================================================== */}

          <Box
            sx={{
              mt: 1.5,

              display: "grid",

              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },

              border: "1px solid",

              borderColor: "divider",

              borderRadius: 2,

              overflow: "hidden",
            }}
          >
            <StatItem
              icon={<WorkOutline />}
              title="Experience"
              value={
                doctor?.experience !==
                  undefined &&
                doctor?.experience !== null
                  ? `${doctor.experience}+ Years`
                  : "-"
              }
            />

            <StatItem
              icon={
                <PaymentsOutlined />
              }
              title="Consultation"
              value={
                doctor?.consultation_fee
                  ? `₹${Number(
                      doctor.consultation_fee
                    ).toLocaleString(
                      "en-IN"
                    )}`
                  : "-"
              }
            />

            <StatItem
              icon={<PersonOutline />}
              title="Age"
              value={
                doctor?.age
                  ? `${doctor.age} Years`
                  : "-"
              }
            />

            <StatItem
              icon={<PersonOutline />}
              title="Gender"
              value={
                doctor?.gender
                  ? formatText(
                      doctor.gender
                    )
                  : "-"
              }
              last
            />
          </Box>

          {/* =====================================================
              PROFESSIONAL STATS
          ===================================================== */}

          <Box
            sx={{
              mt: 0.8,

              display: "grid",

              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },

              border: "1px solid",

              borderColor: "divider",

              borderRadius: 2,

              overflow: "hidden",
            }}
          >
            <StatItem
              icon={<SchoolOutlined />}
              title="Qualification"
              value={
                doctor?.qualification ||
                "-"
              }
            />

            <StatItem
              icon={
                <MedicalServicesOutlined />
              }
              title="Specialization"
              value={
                doctor?.specialization ||
                "-"
              }
            />

            <StatItem
              icon={<BadgeOutlined />}
              title="Registration Number"
              value={
                doctor?.registration_number ||
                "-"
              }
            />

            <StatItem
              icon={
                <LanguageOutlined />
              }
              title="Languages"
              value={
                languages.length > 0
                  ? languages.join(", ")
                  : "-"
              }
              last
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

// ==========================================================
// FORMAT TEXT
// ==========================================================

function formatText(value) {
  if (!value) return "-";

  return String(value)
    .toLowerCase()
    .replace(
      /\b\w/g,
      (char) => char.toUpperCase()
    );
}

// ==========================================================
// STAT ITEM
// ==========================================================

function StatItem({
  icon,
  title,
  value,
  last,
}) {
  return (
    <Box
      sx={{
        px: {
          xs: 1,
          sm: 1.4,
        },

        py: 1,

        display: "flex",

        alignItems: "center",

        gap: 0.8,

        borderRight: {
          xs: "none",

          md: last
            ? "none"
            : "1px solid",
        },

        borderBottom: {
          xs: "1px solid",

          md: "none",
        },

        borderColor: "divider",

        "&:nth-of-type(odd)": {
          borderRight: {
            xs: "1px solid",

            md: "1px solid",
          },
        },

        "&:nth-of-type(3), &:nth-of-type(4)":
          {
            borderBottom: {
              xs: "none",

              md: "none",
            },
          },

        "&:last-of-type": {
          borderRight: "none",
        },
      }}
    >
      {/* ICON */}

      <Box
        sx={{
          width: 30,

          height: 30,

          minWidth: 30,

          borderRadius: 1.5,

          bgcolor: "secondary.light",

          color: "primary.main",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          "& svg": {
            fontSize: 16,
          },
        }}
      >
        {icon}
      </Box>

      {/* TEXT */}

      <Box
        sx={{
          minWidth: 0,
        }}
      >
        <Typography
          sx={{
            color: "text.secondary",

            fontSize: 10,

            lineHeight: 1.15,
          }}
        >
          {title}
        </Typography>

        <Typography
          title={String(value || "")}
          sx={{
            color: "text.primary",

            fontSize: {
              xs: 11.5,

              sm: 12.5,
            },

            fontWeight: 700,

            mt: 0.15,

            lineHeight: 1.3,

            overflow: "hidden",

            textOverflow:
              "ellipsis",

            whiteSpace: "nowrap",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}