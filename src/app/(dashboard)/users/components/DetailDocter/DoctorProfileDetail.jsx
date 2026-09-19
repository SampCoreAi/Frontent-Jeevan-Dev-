"use client";

import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Chip,
  Divider,
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
  EmailOutlined,
  PhoneOutlined,
  LocalHospitalOutlined,
  LocationOnOutlined,
  AccessTimeOutlined,
  BadgeOutlined,
  EmergencyOutlined,
  QrCode2Outlined,
} from "@mui/icons-material";

import { useRouter } from "next/navigation";
import { formatTimeRange } from "../../../../../config/timeFormatter";

export default function DoctorProfileDetail({ data, doctorId }) {
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
      languages = Array.isArray(parsed) ? parsed : [];
    } catch {
      languages = doctor.language
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  // =====================================================
  // HOSPITALS
  // =====================================================

  const hospitals = Array.isArray(doctor?.hospital_detail)
    ? doctor.hospital_detail
    : [];

  // =====================================================
  // AVAILABILITY
  // =====================================================

  const availability = Array.isArray(doctor?.availability)
    ? doctor.availability.filter(
        (item) => item?.isAvailable !== false
      )
    : [];

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
    const cleanPath = doctor.img_key.replace(/^\//, "");

    return `${cleanBase}/${cleanPath}`;
  };

  const imageUrl = getImageUrl();

  // =====================================================
  // EMERGENCY
  // =====================================================

  const acceptsEmergency =
    String(doctor?.accept_emergency_patients || "")
      .trim()
      .toUpperCase() === "YES";

  // =====================================================
  // BOOK APPOINTMENT
  // =====================================================

  const handleBookAppointment = () => {
    router.push(`/users/pages/Appointment?id=${doctorId}`);
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
            height: { xs: 45, sm: 55 },
            bgcolor: "secondary.light",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        />

        <Box
          sx={{
            px: { xs: 1.5, sm: 2.2 },
            pb: 1.8,
          }}
        >
          {/* PROFILE INFO */}

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
              <Avatar
                src={imageUrl}
                alt={doctor?.full_name || "Doctor"}
                sx={{
                  width: { xs: 76, sm: 84 },
                  height: { xs: 76, sm: 84 },

                  mt: {
                    xs: -4.5,
                    sm: -4.8,
                  },

                  border: "4px solid",
                  borderColor: "background.paper",

                  bgcolor: "secondary.light",
                  color: "primary.main",

                  fontWeight: 700,
                  fontSize: 24,
                }}
              >
                {doctor?.full_name?.charAt(0) || "D"}
              </Avatar>

              {/* NAME INFO */}

              <Box
                sx={{
                  pb: { sm: 0.2 },
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
                      color: "text.primary",
                    }}
                  >
                    {doctor?.full_name || "Doctor Name"}
                  </Typography>

                  <VerifiedRounded
                    sx={{
                      fontSize: 18,
                      color: "primary.main",
                    }}
                  />
                </Box>

                {/* USERNAME */}

                {doctor?.username && (
                  <Typography
                    sx={{
                      mt: 0.2,
                      fontSize: 10.5,
                      color: "text.secondary",
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
                          fontSize: "13px !important",
                        }}
                      />
                    }
                    label="Accepts Emergency"
                    size="small"
                    sx={{
                      mt: 0.6,
                      height: 23,

                      bgcolor: "secondary.light",
                      color: "primary.dark",

                      fontSize: 9.5,
                      fontWeight: 700,

                      "& .MuiChip-icon": {
                        color: "primary.main",
                      },

                      "& .MuiChip-label": {
                        px: 0.8,
                      },
                    }}
                  />
                )}
              </Box>
            </Box>

            {/* BOOK APPOINTMENT BUTTON */}

            <Button
              variant="contained"
              startIcon={
                <CalendarMonthOutlined
                  sx={{
                    fontSize: "17px !important",
                  }}
                />
              }
              onClick={handleBookAppointment}
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
                doctor?.experience !== undefined &&
                doctor?.experience !== null
                  ? `${doctor.experience}+ Years`
                  : "-"
              }
            />

            <StatItem
              icon={<PaymentsOutlined />}
              title="Consultation"
              value={
                doctor?.consultation_fee
                  ? `₹${Number(
                      doctor.consultation_fee
                    ).toLocaleString("en-IN")}`
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
                  ? formatText(doctor.gender)
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
              value={doctor?.qualification || "-"}
            />

            <StatItem
              icon={<MedicalServicesOutlined />}
              title="Specialization"
              value={doctor?.specialization || "-"}
            />

            <StatItem
              icon={<BadgeOutlined />}
              title="Registration Number"
              value={doctor?.registration_number || "-"}
            />

            <StatItem
              icon={<LanguageOutlined />}
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

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <Box
        sx={{
          mt: 1,

          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(0, 1.25fr) minmax(320px, 0.75fr)",
          },

          gap: 1,
          alignItems: "start",
        }}
      >
        {/* =====================================================
            ABOUT
        ===================================================== */}

        <SectionCard>
          <SectionHeading
            icon={<MedicalServicesOutlined />}
            title="About Doctor"
          />

          <Typography
            sx={{
              mt: 0.8,
              lineHeight: 1.55,
              fontSize: 12,
              color: "text.secondary",
            }}
          >
            {doctor?.bio || "No information available."}
          </Typography>
        </SectionCard>

        {/* =====================================================
            CONTACT
        ===================================================== */}

        <SectionCard>
          <SectionHeading
            icon={<PhoneOutlined />}
            title="Contact Information"
          />

          <Box sx={{ mt: 0.8 }}>
            <ContactRow
              icon={<EmailOutlined />}
              label="Email"
              value={doctor?.email || "-"}
            />

            <Divider sx={{ my: 0.65 }} />

            <ContactRow
              icon={<PhoneOutlined />}
              label="Phone"
              value={doctor?.mobile || "-"}
            />
          </Box>
        </SectionCard>

        {/* =====================================================
            HOSPITALS
        ===================================================== */}

        <Box
          sx={{
            gridColumn: {
              xs: "auto",
              md: "1 / -1",
            },
          }}
        >
          <SectionCard>
            <SectionHeading
              icon={<LocalHospitalOutlined />}
              title={
                hospitals.length > 1
                  ? "Clinics / Hospitals"
                  : "Clinic / Hospital"
              }
            />

            {hospitals.length > 0 ? (
              <Box
                sx={{
                  mt: 0.8,

                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",
                    md:
                      hospitals.length > 1
                        ? "repeat(2, minmax(0, 1fr))"
                        : "1fr",
                  },

                  gap: 0.8,
                }}
              >
                {hospitals.map((hospital, index) => (
                  <HospitalCard
                    key={`${hospital?.hospitalName || "hospital"}-${index}`}
                    hospital={hospital}
                  />
                ))}
              </Box>
            ) : (
              <Typography
                sx={{
                  mt: 0.8,
                  fontSize: 11.5,
                  color: "text.secondary",
                }}
              >
                Hospital information not available.
              </Typography>
            )}
          </SectionCard>
        </Box>

        {/* =====================================================
            AVAILABILITY - MAIN IMPORTANT SECTION
        ===================================================== */}

       <Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "1.5fr 1fr",
    },
    gap: 1.5,
    gridColumn: {
      xs: "auto",
      md: "1 / -1",
    },
  }}
>
  {/* DOCTOR AVAILABILITY */}
  <Paper
    elevation={0}
    sx={{
      p: { xs: 1.4, sm: 1.7 },
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2,
      bgcolor: "background.paper",
    }}
  >
    {/* AVAILABILITY HEADER */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1,
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
            width: 34,
            height: 34,
            borderRadius: 1.6,
            bgcolor: "secondary.light",
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AccessTimeOutlined sx={{ fontSize: 18 }} />
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: 13.5,
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            Doctor Availability
          </Typography>

          <Typography
            sx={{
              mt: 0.1,
              fontSize: 10,
              color: "text.secondary",
            }}
          >
            Weekly consultation schedule
          </Typography>
        </Box>
      </Box>

      {availability.length > 0 && (
        <Chip
          label={`${availability.length} Days Available`}
          size="small"
          sx={{
            height: 23,
            bgcolor: "secondary.light",
            color: "primary.dark",
            fontSize: 9.5,
            fontWeight: 700,
            "& .MuiChip-label": {
              px: 1,
            },
          }}
        />
      )}
    </Box>

    {/* AVAILABILITY DAYS */}
    {availability.length > 0 ? (
      <Box
        sx={{
          mt: 1.2,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0,1fr))",
          },
          gap: 0.7,
        }}
      >
        {availability.map((item, index) => (
          <AvailabilityCard
            key={`${item.day}-${index}`}
            day={item.day}
            time={getAvailabilityTime(item)}
          />
        ))}
      </Box>
    ) : (
      <Box
        sx={{
          mt: 1.2,
          py: 2.5,
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <AccessTimeOutlined
          sx={{
            fontSize: 28,
            color: "text.disabled",
          }}
        />

        <Typography
          sx={{
            mt: 0.4,
            fontSize: 12,
            fontWeight: 700,
            color: "text.primary",
          }}
        >
          Availability Not Available
        </Typography>

        <Typography
          sx={{
            mt: 0.2,
            fontSize: 10,
            color: "text.secondary",
          }}
        >
          Doctor has not added consultation timings.
        </Typography>
      </Box>
    )}
  </Paper>

  {/* BOOK FROM PHONE */}
  <SectionCard>
    <SectionHeading
      icon={<QrCode2Outlined />}
      title="Book From Your Phone"
    />

    {doctor?.qr_url ? (
      <Box
        sx={{
          mt: 1,
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          alignItems: "center",
          gap: 1.2,
          p: 1,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          bgcolor: "secondary.light",
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            minWidth: 100,
            p: 0.5,
            borderRadius: 1.5,
            bgcolor: "#fff",
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={doctor.qr_url}
            alt="Doctor booking QR code"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>

        <Box
          sx={{
            minWidth: 0,
            textAlign: {
              xs: "center",
              sm: "left",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            Scan to Book Appointment
          </Typography>

          <Typography
            sx={{
              mt: 0.35,
              fontSize: 10.5,
              lineHeight: 1.5,
              color: "text.secondary",
            }}
          >
            Scan this QR code with your phone to book
            an appointment.
          </Typography>

          <Box
            sx={{
              mt: 0.7,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.4,
              px: 0.8,
              py: 0.35,
              borderRadius: 5,
              bgcolor: "background.paper",
            }}
          >
            <QrCode2Outlined
              sx={{
                fontSize: 13,
                color: "primary.main",
              }}
            />

            <Typography
              sx={{
                fontSize: 9,
                fontWeight: 700,
                color: "primary.main",
              }}
            >
              Scan with your phone
            </Typography>
          </Box>
        </Box>
      </Box>
    ) : (
      <Box
        sx={{
          mt: 1,
          py: 2,
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 2,
          textAlign: "center",
          bgcolor: "background.default",
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            mx: "auto",
            borderRadius: 1.7,
            bgcolor: "secondary.light",
            color: "text.disabled",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <QrCode2Outlined sx={{ fontSize: 23 }} />
        </Box>

        <Typography
          sx={{
            mt: 0.6,
            fontSize: 12,
            fontWeight: 700,
            color: "text.primary",
          }}
        >
          QR Not Available
        </Typography>

        <Typography
          sx={{
            mt: 0.2,
            fontSize: 10,
            color: "text.secondary",
          }}
        >
          Mobile QR booking is currently unavailable.
        </Typography>
      </Box>
    )}
  </SectionCard>
</Box>
      </Box>
    </Box>
  );
}

/* ==========================================================
   AVAILABILITY CARD
========================================================== */

function AvailabilityCard({ day, time }) {
  return (
    <Box
      sx={{
        p: 0.85,

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        gap: 0.8,

        border: "1px solid",
        borderColor: "divider",

        borderRadius: 1.7,

        bgcolor: "background.paper",

        transition: "0.2s ease",

        "&:hover": {
          borderColor: "primary.light",
          bgcolor: "secondary.light",
        },
      }}
    >
      {/* LEFT */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.65,

          minWidth: 0,
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            minWidth: 30,

            borderRadius: 1.4,

            bgcolor: "secondary.light",
            color: "primary.main",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CalendarMonthOutlined
            sx={{
              fontSize: 15,
            }}
          />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            {day}
          </Typography>

          <Box
            sx={{
              mt: 0.15,

              display: "flex",
              alignItems: "center",

              gap: 0.35,
            }}
          >
            <Box
              sx={{
                width: 5,
                height: 5,

                borderRadius: "50%",

                bgcolor: "primary.main",
              }}
            />

            <Typography
              sx={{
                fontSize: 8.5,
                fontWeight: 600,
                color: "primary.main",
              }}
            >
              Available
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* TIME */}

      <Box
        sx={{
          px: 0.8,
          py: 0.4,

          borderRadius: 5,

          bgcolor: "secondary.light",

          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: 9.5,
            fontWeight: 700,

            color: "primary.dark",

            whiteSpace: "nowrap",
          }}
        >
          {time}
        </Typography>
      </Box>
    </Box>
  );
}

/* ==========================================================
   GET AVAILABILITY TIME
========================================================== */

function getAvailabilityTime(item) {
  if (!item?.startTime || !item?.endTime) {
    return "-";
  }

  try {
    const start = item.startTime.includes(":")
      ? `${item.startTime}:00`
      : item.startTime;

    const end = item.endTime.includes(":")
      ? `${item.endTime}:00`
      : item.endTime;

    return formatTimeRange(start, end);
  } catch {
    return `${item.startTime} - ${item.endTime}`;
  }
}

/* ==========================================================
   FORMAT TEXT
========================================================== */

function formatText(value) {
  if (!value) return "-";

  return String(value)
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/* ==========================================================
   HOSPITAL CARD
========================================================== */

function HospitalCard({ hospital }) {
  const address = [
    hospital?.flatPlotNo,
    hospital?.buildingSociety,
    hospital?.streetName,
    hospital?.areaLocality,
    hospital?.city,
    hospital?.district,
    hospital?.state,
    hospital?.pinCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Box
      sx={{
        p: 1,

        border: "1px solid",
        borderColor: "divider",

        borderRadius: 1.8,

        bgcolor: "background.paper",

        minWidth: 0,
      }}
    >
      {/* HOSPITAL NAME */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.6,
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            minWidth: 30,

            borderRadius: 1.4,

            bgcolor: "secondary.light",
            color: "primary.main",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LocalHospitalOutlined
            sx={{
              fontSize: 16,
            }}
          />
        </Box>

        <Typography
          sx={{
            fontSize: 12.5,
            fontWeight: 700,
            color: "text.primary",
          }}
        >
          {hospital?.hospitalName || "Hospital"}
        </Typography>
      </Box>

      {/* ADDRESS */}

      <Box
        sx={{
          mt: 0.7,

          display: "flex",
          alignItems: "flex-start",

          gap: 0.5,
        }}
      >
        <LocationOnOutlined
          sx={{
            mt: 0.05,

            fontSize: 15,

            color: "primary.main",

            flexShrink: 0,
          }}
        />

        <Typography
          sx={{
            fontSize: 10.8,
            lineHeight: 1.5,
            color: "text.secondary",
          }}
        >
          {address || "Address not available"}
        </Typography>
      </Box>

      {/* LANDMARK */}

      {hospital?.landmark && (
        <Box
          sx={{
            mt: 0.45,
            pl: 2.4,

            display: "flex",
            alignItems: "center",

            gap: 0.4,
          }}
        >
          <Typography
            sx={{
              fontSize: 9.5,
              color: "text.secondary",
            }}
          >
            Landmark:
          </Typography>

          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            {hospital.landmark}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

/* ==========================================================
   SECTION CARD
========================================================== */

function SectionCard({ children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 1.3,
          sm: 1.5,
        },

        border: "1px solid",
        borderColor: "divider",

        borderRadius: 2,

        bgcolor: "background.paper",

        height: "fit-content",
        minHeight: 0,

        boxShadow: "none",
      }}
    >
      {children}
    </Paper>
  );
}

/* ==========================================================
   SECTION HEADING
========================================================== */

function SectionHeading({ icon, title }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.6,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          color: "primary.main",

          "& svg": {
            fontSize: 17,
          },
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 13.5,
          lineHeight: 1.2,
          color: "text.primary",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

/* ==========================================================
   STAT ITEM
========================================================== */

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
          md: last ? "none" : "1px solid",
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

        "&:nth-of-type(3), &:nth-of-type(4)": {
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

      <Box sx={{ minWidth: 0 }}>
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
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

/* ==========================================================
   CONTACT ROW
========================================================== */

function ContactRow({
  icon,
  label,
  value,
}) {
  return (
    <Box
      sx={{
        display: "grid",

        gridTemplateColumns:
          "30px 52px minmax(0,1fr)",

        alignItems: "center",

        gap: 0.7,
      }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,

          borderRadius: 1.4,

          bgcolor: "secondary.light",
          color: "primary.main",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          "& svg": {
            fontSize: 15,
          },
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          fontSize: 10,
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: 11.5,
          fontWeight: 600,
          color: "text.primary",
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}