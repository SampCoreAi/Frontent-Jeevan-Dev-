"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Chip,
  Divider,
} from "@mui/material";

import {
  CalendarMonthOutlined,
  MedicalServicesOutlined,
  EmailOutlined,
  PhoneOutlined,
  LocalHospitalOutlined,
  LocationOnOutlined,
  AccessTimeOutlined,
  QrCode2Outlined,
  CheckCircleRounded,
} from "@mui/icons-material";

import { formatTimeRange } from "../../../../../config/timeFormatter";

export default function DoctorProfileContent({ data }) {
  const doctor = data || {};

  // =====================================================
  // HOSPITALS
  // =====================================================

  const hospitals = Array.isArray(doctor?.hospital_detail)
    ? doctor.hospital_detail
    : [];

  // =====================================================
  // REMOVE DUPLICATE HOSPITALS USING CLINIC ID
  // =====================================================

  const uniqueHospitals = useMemo(() => {
    const hospitalMap = new Map();

    hospitals.forEach((hospital, index) => {
      const key =
        hospital?.clinicId ||
        `${hospital?.hospitalName || "hospital"}-${index}`;

      if (!hospitalMap.has(key)) {
        hospitalMap.set(key, hospital);
      }
    });

    return Array.from(hospitalMap.values());
  }, [hospitals]);

  // =====================================================
  // ALL AVAILABILITY
  // =====================================================

  const availability = useMemo(() => {
    if (!Array.isArray(doctor?.availability)) {
      return [];
    }

    return doctor.availability.filter(
      (item) => item?.isAvailable !== false
    );
  }, [doctor?.availability]);

  // =====================================================
  // SELECTED CLINIC
  // =====================================================

  const [selectedClinicId, setSelectedClinicId] =
    useState("");

  // Default first clinic selected

  useEffect(() => {
    if (uniqueHospitals.length === 0) {
      setSelectedClinicId("");
      return;
    }

    const selectedStillExists = uniqueHospitals.some(
      (hospital) =>
        hospital?.clinicId === selectedClinicId
    );

    if (!selectedClinicId || !selectedStillExists) {
      setSelectedClinicId(
        uniqueHospitals[0]?.clinicId || ""
      );
    }
  }, [uniqueHospitals, selectedClinicId]);

  // =====================================================
  // SELECTED HOSPITAL
  // =====================================================

  const selectedHospital = useMemo(() => {
    if (!selectedClinicId) {
      return uniqueHospitals[0] || null;
    }

    return (
      uniqueHospitals.find(
        (hospital) =>
          hospital?.clinicId === selectedClinicId
      ) ||
      uniqueHospitals[0] ||
      null
    );
  }, [uniqueHospitals, selectedClinicId]);

  // =====================================================
  // SELECTED CLINIC AVAILABILITY
  // =====================================================

  const selectedAvailability = useMemo(() => {
    if (!selectedClinicId) {
      return [];
    }

    return availability.filter(
      (item) =>
        item?.clinicId === selectedClinicId
    );
  }, [availability, selectedClinicId]);

  // =====================================================
  // QR URL
  // =====================================================

  const qrUrl = getMediaUrl(doctor?.qr_url);

  return (
    <Box
      sx={{
        maxWidth: 1300,
        mx: "auto",
        width: "100%",
        mb: 1.5,
      }}
    >
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
            ABOUT DOCTOR
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
            {doctor?.bio ||
              "No information available."}
          </Typography>
        </SectionCard>

        {/* =====================================================
            CONTACT INFORMATION
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
            CLINICS / HOSPITALS
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
            {/* HEADER */}

            <Box
              sx={{
                display: "flex",

                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },

                justifyContent: "space-between",

                gap: 1,

                flexWrap: "wrap",
              }}
            >
              <Box>
                <SectionHeading
                  icon={
                    <LocalHospitalOutlined />
                  }
                  title={
                    uniqueHospitals.length > 1
                      ? "Clinics / Hospitals"
                      : "Clinic / Hospital"
                  }
                />

                {uniqueHospitals.length > 1 && (
                  <Typography
                    sx={{
                      mt: 0.35,
                      ml: 2.9,

                      fontSize: 9.5,

                      color: "text.secondary",
                    }}
                  >
                    Select a clinic to view its
                    consultation timings
                  </Typography>
                )}
              </Box>

              {uniqueHospitals.length > 1 && (
                <Chip
                  label={`${uniqueHospitals.length} Clinics`}
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

            {/* HOSPITAL LIST */}

            {uniqueHospitals.length > 0 ? (
              <Box
                sx={{
                  mt: 1,

                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",

                    md:
                      uniqueHospitals.length > 1
                        ? "repeat(2, minmax(0, 1fr))"
                        : "1fr",
                  },

                  gap: 0.8,
                }}
              >
                {uniqueHospitals.map(
                  (hospital, index) => {
                    const clinicKey =
                      hospital?.clinicId ||
                      `${hospital?.hospitalName}-${index}`;

                    const isSelected =
                      hospital?.clinicId ===
                      selectedClinicId;

                    const clinicAvailability =
                      availability.filter(
                        (item) =>
                          item?.clinicId ===
                          hospital?.clinicId
                      );

                    return (
                      <HospitalCard
                        key={clinicKey}
                        hospital={hospital}
                        selected={isSelected}
                        availabilityCount={
                          clinicAvailability.length
                        }
                        onClick={() =>
                          setSelectedClinicId(
                            hospital?.clinicId || ""
                          )
                        }
                      />
                    );
                  }
                )}
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
            AVAILABILITY + QR
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
          {/* =====================================================
              SELECTED CLINIC AVAILABILITY
          ===================================================== */}

          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 1.4,
                sm: 1.7,
              },

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

                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },

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

                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    width: 34,

                    height: 34,

                    minWidth: 34,

                    borderRadius: 1.6,

                    bgcolor: "secondary.light",

                    color: "primary.main",

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",
                  }}
                >
                  <AccessTimeOutlined
                    sx={{
                      fontSize: 18,
                    }}
                  />
                </Box>

                <Box sx={{ minWidth: 0 }}>
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

              {selectedAvailability.length >
                0 && (
                <Chip
                  label={`${selectedAvailability.length} Days Available`}
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

            {/* =====================================================
                SELECTED CLINIC INFO
            ===================================================== */}

            {selectedHospital && (
              <Box
                sx={{
                  mt: 1.1,

                  px: 1,

                  py: 0.8,

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "space-between",

                  gap: 1,

                  border: "1px solid",

                  borderColor: "divider",

                  borderRadius: 1.7,

                  bgcolor: "secondary.light",
                }}
              >
                <Box
                  sx={{
                    display: "flex",

                    alignItems: "center",

                    gap: 0.7,

                    minWidth: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: 30,

                      height: 30,

                      minWidth: 30,

                      borderRadius: 1.4,

                      bgcolor:
                        "background.paper",

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

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 11.5,

                        fontWeight: 700,

                        color: "text.primary",

                        overflow: "hidden",

                        textOverflow:
                          "ellipsis",

                        whiteSpace: "nowrap",
                      }}
                    >
                      {selectedHospital?.hospitalName ||
                        "Clinic"}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.1,

                        fontSize: 9.5,

                        color:
                          "text.secondary",
                      }}
                    >
                      {[
                        selectedHospital?.city,
                        selectedHospital?.clinicId,
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </Typography>
                  </Box>
                </Box>

                <Chip
                  label="Selected Clinic"
                  size="small"
                  sx={{
                    height: 21,

                    bgcolor:
                      "background.paper",

                    color: "primary.main",

                    fontSize: 8.5,

                    fontWeight: 700,

                    flexShrink: 0,

                    "& .MuiChip-label": {
                      px: 0.8,
                    },
                  }}
                />
              </Box>
            )}

            {/* =====================================================
                AVAILABILITY DAYS
            ===================================================== */}

            {selectedAvailability.length >
            0 ? (
              <Box
                sx={{
                  mt: 1,

                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",

                    sm: "repeat(2, minmax(0, 1fr))",
                  },

                  gap: 0.7,
                }}
              >
                {selectedAvailability.map(
                  (item, index) => (
                    <AvailabilityCard
                      key={`${item?.clinicId}-${item?.day}-${index}`}
                      day={item?.day}
                      time={getAvailabilityTime(
                        item
                      )}
                    />
                  )
                )}
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
                  No consultation timings are
                  available for this clinic.
                </Typography>
              </Box>
            )}
          </Paper>

          {/* =====================================================
              BOOK FROM PHONE
          ===================================================== */}

          <SectionCard>
            <SectionHeading
              icon={<QrCode2Outlined />}
              title="Book From Your Phone"
            />

            {qrUrl ? (
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
                {/* QR IMAGE */}

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
                    src={qrUrl}
                    alt="Doctor booking QR code"
                    sx={{
                      width: "100%",

                      height: "100%",

                      objectFit: "contain",
                    }}
                  />
                </Box>

                {/* QR INFO */}

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
                    Scan this QR code with your
                    phone to book an appointment.
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

                      bgcolor:
                        "background.paper",
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

                  bgcolor:
                    "background.default",
                }}
              >
                <Box
                  sx={{
                    width: 40,

                    height: 40,

                    mx: "auto",

                    borderRadius: 1.7,

                    bgcolor:
                      "secondary.light",

                    color: "text.disabled",

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",
                  }}
                >
                  <QrCode2Outlined
                    sx={{
                      fontSize: 23,
                    }}
                  />
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
                  Mobile QR booking is currently
                  unavailable.
                </Typography>
              </Box>
            )}
          </SectionCard>
        </Box>
      </Box>
    </Box>
  );
}

// ==========================================================
// HOSPITAL CARD
// ==========================================================

function HospitalCard({
  hospital,
  selected,
  availabilityCount,
  onClick,
}) {
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
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          onClick?.();
        }
      }}
      sx={{
        p: 1,

        border: "1px solid",

        borderColor: selected
          ? "primary.main"
          : "divider",

        borderRadius: 1.8,

        bgcolor: selected
          ? "secondary.light"
          : "background.paper",

        minWidth: 0,

        cursor: "pointer",

        transition: "0.2s ease",

        position: "relative",

        outline: "none",

        "&:hover": {
          borderColor: "primary.main",

          bgcolor: "secondary.light",
        },

        "&:focus-visible": {
          borderColor: "primary.main",
        },
      }}
    >
      {/* =====================================================
          HOSPITAL HEADER
      ===================================================== */}

      <Box
        sx={{
          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",

          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: 0.6,

            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 30,

              height: 30,

              minWidth: 30,

              borderRadius: 1.4,

              bgcolor: selected
                ? "background.paper"
                : "secondary.light",

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

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 12.5,

                fontWeight: 700,

                color: "text.primary",

                overflow: "hidden",

                textOverflow: "ellipsis",

                whiteSpace: "nowrap",
              }}
            >
              {hospital?.hospitalName ||
                "Hospital"}
            </Typography>

          </Box>
        </Box>

        {/* SELECTED */}

        {selected && (
          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: 0.3,

              flexShrink: 0,
            }}
          >
            <CheckCircleRounded
              sx={{
                fontSize: 15,

                color: "primary.main",
              }}
            />

            <Typography
              sx={{
                display: {
                  xs: "none",

                  sm: "block",
                },

                fontSize: 8.5,

                fontWeight: 700,

                color: "primary.main",
              }}
            >
              Selected
            </Typography>
          </Box>
        )}
      </Box>

      {/* =====================================================
          ADDRESS
      ===================================================== */}

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
          {address ||
            "Address not available"}
        </Typography>
      </Box>

      {/* =====================================================
          LANDMARK
      ===================================================== */}

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

      {/* =====================================================
          BOTTOM INFO
      ===================================================== */}

      <Box
        sx={{
          mt: 0.7,

          pt: 0.65,

          borderTop: "1px solid",

          borderColor: selected
            ? "rgba(7, 135, 106, 0.15)"
            : "divider",

          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",

          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: 0.35,
          }}
        >
          <AccessTimeOutlined
            sx={{
              fontSize: 13,

              color: "primary.main",
            }}
          />

          <Typography
            sx={{
              fontSize: 9,

              fontWeight: 600,

              color: "text.secondary",
            }}
          >
            {availabilityCount > 0
              ? `${availabilityCount} days available`
              : "Timing not available"}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: 9,

            fontWeight: 700,

            color: "primary.main",
          }}
        >
          {selected
            ? "Viewing timings"
            : "View timings"}
        </Typography>
      </Box>
    </Box>
  );
}

// ==========================================================
// AVAILABILITY CARD
// ==========================================================

function AvailabilityCard({
  day,
  time,
}) {
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
            {day || "-"}
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

// ==========================================================
// GET AVAILABILITY TIME
// ==========================================================

function getAvailabilityTime(item) {
  if (
    !item?.startTime ||
    !item?.endTime
  ) {
    return "-";
  }

  try {
    const start =
      item.startTime.split(":")
        .length === 2
        ? `${item.startTime}:00`
        : item.startTime;

    const end =
      item.endTime.split(":")
        .length === 2
        ? `${item.endTime}:00`
        : item.endTime;

    return formatTimeRange(
      start,
      end
    );
  } catch {
    return `${item.startTime} - ${item.endTime}`;
  }
}

// ==========================================================
// MEDIA URL
// QR URL / S3 RELATIVE URL SUPPORT
// ==========================================================

function getMediaUrl(path) {
  if (!path) {
    return "";
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  const baseUrl =
    process.env
      .NEXT_PUBLIC_S3_BUCKET_URL || "";

  if (!baseUrl) {
    return path;
  }

  const cleanBase =
    baseUrl.replace(/\/$/, "");

  const cleanPath =
    path.replace(/^\//, "");

  return `${cleanBase}/${cleanPath}`;
}

// ==========================================================
// SECTION CARD
// ==========================================================

function SectionCard({
  children,
}) {
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

// ==========================================================
// SECTION HEADING
// ==========================================================

function SectionHeading({
  icon,
  title,
}) {
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

// ==========================================================
// CONTACT ROW
// ==========================================================

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