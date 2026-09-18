"use client";

import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import EmergencyOutlinedIcon from "@mui/icons-material/EmergencyOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

const S3_BASE_URL =
  process.env.NEXT_PUBLIC_S3_BUCKET_URL || "";

const parseJSON = (value, fallback = []) => {
  if (!value) return fallback;

  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed
      : fallback;
  } catch {
    return fallback;
  }
};

const getFileUrl = (path) => {
  if (!path) return "";

  return `${S3_BASE_URL}${path}`;
};

export default function DoctorProfileDialog({
  open,
  onClose,
  doctor,
}) {
  if (!doctor) return null;

  const languages = parseJSON(
    doctor?.language
  );

  const availability = parseJSON(
    doctor?.availability
  );

  const hospitalDetails = parseJSON(
    doctor?.hospital_detail
  );

  const hospital =
    hospitalDetails?.[0] || null;

  const profilePhoto = doctor?.profile?.photo
    ? getFileUrl(doctor.profile.photo)
    : "";

  const selfie = doctor?.profile?.selfie
    ? getFileUrl(doctor.profile.selfie)
    : "";

  const registrationCertificate =
    doctor?.certificates
      ?.medical_registration_certificate
      ? getFileUrl(
          doctor.certificates
            .medical_registration_certificate
        )
      : "";

  const degreeCertificate =
    doctor?.certificates
      ?.medical_degree_certificate
      ? getFileUrl(
          doctor.certificates
            .medical_degree_certificate
        )
      : "";

  const governmentId =
    doctor?.certificates
      ?.government_id_proof
      ? getFileUrl(
          doctor.certificates
            .government_id_proof
        )
      : "";

  const isActive =
    doctor?.status === "ACTIVE";

  const address = hospital
    ? [
        hospital.flatPlotNo,
        hospital.buildingSociety,
        hospital.streetName,
        hospital.areaLocality,
        hospital.landmark,
        hospital.city,
        hospital.district,
        hospital.state,
        hospital.pinCode,
      ]
        .filter(Boolean)
        .join(", ")
    : "-";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          width: "900px",
          maxWidth: "calc(100% - 24px)",
          maxHeight: "92vh",

          m: {
            xs: 1.5,
            sm: 2,
          },

          borderRadius: "14px",

          overflow: "hidden",

          border: "1px solid #E1E9E6",

          boxShadow:
            "0 20px 60px rgba(15, 23, 42, 0.16)",
        },
      }}
    >
      {/* ===================================
          HEADER
      ==================================== */}

      <Box
        sx={{
          position: "relative",

          px: {
            xs: 2,
            sm: 3,
          },

          py: {
            xs: 2.2,
            sm: 2.7,
          },

          background:
            "linear-gradient(135deg, #F1F9F6 0%, #FFFFFF 100%)",

          borderBottom:
            "1px solid #E1E9E6",
        }}
      >
        {/* CLOSE */}

        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",

            top: 14,
            right: 14,

            width: 34,
            height: 34,

            bgcolor: "#FFFFFF",

            border:
              "1px solid #DCE7E3",

            color: "#596575",

            "&:hover": {
              bgcolor: "#EAF7F2",
              color: "#07876A",
            },
          }}
        >
          <CloseIcon
            sx={{ fontSize: 18 }}
          />
        </IconButton>

        {/* PROFILE */}

        <Box
          sx={{
            display: "flex",

            flexDirection: {
              xs: "column",
              sm: "row",
            },

            alignItems: {
              xs: "flex-start",
              sm: "center",
            },

            gap: 2.2,

            pr: {
              xs: 4,
              sm: 5,
            },
          }}
        >
          {/* BIG PHOTO */}

          <Avatar
            src={profilePhoto}
            alt={doctor?.name || "Doctor"}
            sx={{
              width: {
                xs: 100,
                sm: 120,
              },

              height: {
                xs: 100,
                sm: 120,
              },

              bgcolor: "#DDF2EA",
              color: "#07876A",

              border:
                "4px solid #FFFFFF",

              boxShadow:
                "0 5px 18px rgba(15, 23, 42, 0.12)",

              fontSize: 30,
              fontWeight: 700,

              "& img": {
                width: "100%",
                height: "100%",
                objectFit: "cover",
              },
            }}
          >
            {doctor?.name
              ?.charAt(0)
              ?.toUpperCase()}
          </Avatar>

          {/* NAME */}

          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: 20,
                  sm: 23,
                },

                fontWeight: 700,
                color: "#172033",

                lineHeight: 1.2,
              }}
            >
              {doctor?.name || "-"}
            </Typography>

            <Typography
              sx={{
                mt: 0.5,

                fontSize: 12.5,
                fontWeight: 500,

                color: "#63706C",
              }}
            >
              {doctor?.specialization ||
                "Doctor"}

              {doctor?.qualification &&
                ` • ${doctor.qualification}`}
            </Typography>

            {/* CHIPS */}

            <Box
              sx={{
                mt: 1.3,

                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",

                gap: 0.7,
              }}
            >
              <StatusChip
                label={
                  isActive
                    ? "Active"
                    : "Inactive"
                }
                type={
                  isActive
                    ? "success"
                    : "danger"
                }
              />

              {doctor?.onboarding_status && (
                <StatusChip
                  label={
                    doctor.onboarding_status
                  }
                  type="verified"
                />
              )}

              {doctor?.accept_emergency_patients ===
                "YES" && (
                <StatusChip
                  label="Emergency Accepted"
                  type="warning"
                />
              )}
            </Box>

            {/* CONTACT QUICK INFO */}

            <Box
              sx={{
                mt: 1.4,

                display: "flex",
                flexWrap: "wrap",

                gap: {
                  xs: 1,
                  sm: 2,
                },
              }}
            >
              <QuickInfo
                icon={
                  <EmailOutlinedIcon />
                }
                value={doctor?.email}
              />

              <QuickInfo
                icon={
                  <PhoneOutlinedIcon />
                }
                value={doctor?.mobile}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ===================================
          SCROLL CONTENT
      ==================================== */}

      <DialogContent
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
          },

          bgcolor: "#F8FAF9",
        }}
      >
        {/* =================================
            BASIC + PROFESSIONAL
        ================================== */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },

            gap: 1.7,
          }}
        >
          {/* BASIC */}

          <SectionCard
            title="Basic Information"
            icon={
              <PersonOutlineOutlinedIcon />
            }
          >
            <InfoGrid>
              <InfoItem
                label="User ID"
                value={`#${doctor?.userId || "-"}`}
              />

              <InfoItem
                label="Username"
                value={doctor?.username}
              />

              <InfoItem
                label="Age"
                value={
                  doctor?.age
                    ? `${doctor.age} Years`
                    : "-"
                }
              />

              <InfoItem
                label="Gender"
                value={doctor?.gender}
              />
            </InfoGrid>
          </SectionCard>

          {/* PROFESSIONAL */}

          <SectionCard
            title="Professional Information"
            icon={
              <MedicalServicesOutlinedIcon />
            }
          >
            <InfoGrid>
              <InfoItem
                label="Specialization"
                value={
                  doctor?.specialization
                }
              />

              <InfoItem
                label="Qualification"
                value={
                  doctor?.qualification
                }
              />

              <InfoItem
                label="Experience"
                value={
                  doctor?.experience != null
                    ? `${doctor.experience} Years`
                    : "-"
                }
              />

              <InfoItem
                label="Consultation Fee"
                value={
                  doctor?.consultation_fee
                    ? `₹${doctor.consultation_fee}`
                    : "-"
                }
              />

              <InfoItem
                label="Registration No."
                value={
                  doctor?.registration_number
                }
              />

              <InfoItem
                label="Languages"
                value={
                  languages.length
                    ? languages.join(", ")
                    : "-"
                }
              />
            </InfoGrid>
          </SectionCard>
        </Box>

        {/* =================================
            BIO
        ================================== */}

        {doctor?.bio && (
          <SectionCard
            title="About Doctor"
            icon={
              <MedicalServicesOutlinedIcon />
            }
            sx={{ mt: 1.7 }}
          >
            <Typography
              sx={{
                fontSize: 12,
                lineHeight: 1.75,
                color: "#596575",
              }}
            >
              {doctor.bio}
            </Typography>
          </SectionCard>
        )}

        {/* =================================
            HOSPITAL
        ================================== */}

        <SectionCard
          title="Hospital Details"
          icon={
            <LocalHospitalOutlinedIcon />
          }
          sx={{ mt: 1.7 }}
        >
          {hospital ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,

                    flexShrink: 0,

                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",

                    bgcolor: "#EAF7F2",
                    color: "#07876A",

                    borderRadius: "9px",
                  }}
                >
                  <LocalHospitalOutlinedIcon
                    sx={{ fontSize: 19 }}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#25312E",
                    }}
                  >
                    {hospital.hospitalName ||
                      "-"}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.2,
                      fontSize: 10.5,
                      color: "#7B8884",
                    }}
                  >
                    {hospital.city}
                    {hospital.state
                      ? `, ${hospital.state}`
                      : ""}
                  </Typography>
                </Box>
              </Box>

              <Divider
                sx={{
                  my: 1.5,
                  borderColor: "#EDF1EF",
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  gap: 0.8,
                }}
              >
                <LocationOnOutlinedIcon
                  sx={{
                    mt: "2px",
                    fontSize: 16,
                    color: "#07876A",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 11.5,
                    lineHeight: 1.7,
                    color: "#596575",
                  }}
                >
                  {address}
                </Typography>
              </Box>
            </>
          ) : (
            <EmptyText>
              No hospital information
              available.
            </EmptyText>
          )}
        </SectionCard>

        {/* =================================
            AVAILABILITY
        ================================== */}

        <SectionCard
          title="Weekly Availability"
          icon={
            <ScheduleOutlinedIcon />
          }
          sx={{ mt: 1.7 }}
        >
          {availability.length > 0 ? (
            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },

                gap: 0.8,
              }}
            >
              {availability.map(
                (item, index) => (
                  <Box
                    key={`${item.day}-${index}`}
                    sx={{
                      px: 1.2,
                      py: 1,

                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "space-between",

                      gap: 1,

                      bgcolor:
                        item.isAvailable
                          ? "#F8FCFA"
                          : "#FAFAFA",

                      border:
                        "1px solid #E3EAE7",

                      borderRadius: "8px",
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
                          width: 6,
                          height: 6,

                          borderRadius:
                            "50%",

                          bgcolor:
                            item.isAvailable
                              ? "#0A9F7D"
                              : "#A0AAA7",
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: "#34423E",
                        }}
                      >
                        {item.day}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: 10.5,
                        color: "#687671",
                      }}
                    >
                      {item.startTime} -{" "}
                      {item.endTime}
                    </Typography>
                  </Box>
                )
              )}
            </Box>
          ) : (
            <EmptyText>
              No availability added.
            </EmptyText>
          )}
        </SectionCard>

        {/* =================================
            DOCUMENTS
        ================================== */}

        <SectionCard
          title="Documents & Verification"
          icon={
            <DescriptionOutlinedIcon />
          }
          sx={{ mt: 1.7 }}
        >
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              },

              gap: 1,
            }}
          >
            <DocumentCard
              title="Medical Registration Certificate"
              subtitle="Registration document"
              url={registrationCertificate}
            />

            <DocumentCard
              title="Medical Degree Certificate"
              subtitle="Qualification document"
              url={degreeCertificate}
            />

            <DocumentCard
              title="Government ID Proof"
              subtitle="Identity verification"
              url={governmentId}
            />

            <DocumentCard
              title="Verification Selfie"
              subtitle="Doctor verification image"
              url={selfie}
              image
            />
          </Box>
        </SectionCard>
      </DialogContent>
    </Dialog>
  );
}

/* =====================================================
   SECTION CARD
===================================================== */

function SectionCard({
  title,
  icon,
  children,
  sx = {},
}) {
  return (
    <Box
      sx={{
        p: {
          xs: 1.5,
          sm: 1.8,
        },

        bgcolor: "#FFFFFF",

        border:
          "1px solid #E1E9E6",

        borderRadius: "10px",

        ...sx,
      }}
    >
      <Box
        sx={{
          mb: 1.5,

          display: "flex",
          alignItems: "center",

          gap: 0.8,
        }}
      >
        <Box
          sx={{
            width: 29,
            height: 29,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            bgcolor: "#EAF7F2",
            color: "#07876A",

            borderRadius: "7px",

            "& svg": {
              fontSize: 16,
            },
          }}
        >
          {icon}
        </Box>

        <Typography
          sx={{
            fontSize: 12.5,
            fontWeight: 700,
            color: "#26332F",
          }}
        >
          {title}
        </Typography>
      </Box>

      {children}
    </Box>
  );
}

/* =====================================================
   INFO GRID
===================================================== */

function InfoGrid({ children }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns:
          "repeat(2, minmax(0, 1fr))",

        columnGap: 2,
        rowGap: 1.5,
      }}
    >
      {children}
    </Box>
  );
}

/* =====================================================
   INFO ITEM
===================================================== */

function InfoItem({
  label,
  value,
}) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          mb: 0.25,

          fontSize: 9.5,
          fontWeight: 500,

          color: "#8A9692",
        }}
      >
        {label}
      </Typography>

      <Typography
        title={String(
          value ?? "-"
        )}
        sx={{
          fontSize: 11.5,
          fontWeight: 600,

          color: "#34423E",

          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value || "-"}
      </Typography>
    </Box>
  );
}

/* =====================================================
   QUICK INFO
===================================================== */

function QuickInfo({
  icon,
  value,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,

        color: "#65736F",

        "& svg": {
          fontSize: 14,
          color: "#07876A",
        },
      }}
    >
      {icon}

      <Typography
        sx={{
          fontSize: 10.5,
          fontWeight: 500,
        }}
      >
        {value || "-"}
      </Typography>
    </Box>
  );
}

/* =====================================================
   STATUS CHIP
===================================================== */

function StatusChip({
  label,
  type,
}) {
  const styles = {
    success: {
      bg: "#E8F7F1",
      color: "#087A61",
      border: "#C9EADF",
    },

    danger: {
      bg: "#FFF0F0",
      color: "#C83D3D",
      border: "#F2D1D1",
    },

    verified: {
      bg: "#EEF4FF",
      color: "#3C63A8",
      border: "#D7E2F5",
    },

    warning: {
      bg: "#FFF6E9",
      color: "#AD650F",
      border: "#F1DEBF",
    },
  };

  const current =
    styles[type] || styles.success;

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        height: 24,

        bgcolor: current.bg,
        color: current.color,

        border: `1px solid ${current.border}`,

        fontSize: 9.5,
        fontWeight: 600,

        "& .MuiChip-label": {
          px: 1,
        },
      }}
    />
  );
}

/* =====================================================
   DOCUMENT CARD
===================================================== */

function DocumentCard({
  title,
  subtitle,
  url,
  image = false,
}) {
  const handleView = () => {
    if (!url) return;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <Box
      sx={{
        p: 1.2,

        display: "flex",
        alignItems: "center",

        gap: 1,

        minWidth: 0,

        bgcolor: "#FAFCFB",

        border:
          "1px solid #E2EAE7",

        borderRadius: "8px",
      }}
    >
      {/* ICON / THUMBNAIL */}

      {image && url ? (
        <Avatar
          src={url}
          variant="rounded"
          sx={{
            width: 38,
            height: 38,

            borderRadius: "7px",

            border:
              "1px solid #DDE7E3",

            "& img": {
              objectFit: "cover",
            },
          }}
        />
      ) : (
        <Box
          sx={{
            width: 38,
            height: 38,

            flexShrink: 0,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            bgcolor: url
              ? "#EAF7F2"
              : "#F1F3F2",

            color: url
              ? "#07876A"
              : "#9AA4A1",

            borderRadius: "7px",
          }}
        >
          <DescriptionOutlinedIcon
            sx={{ fontSize: 18 }}
          />
        </Box>
      )}

      {/* TEXT */}

      <Box
        sx={{
          minWidth: 0,
          flex: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 10.8,
            fontWeight: 600,

            color: "#34423E",

            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.15,

            fontSize: 9.3,

            color: url
              ? "#84908C"
              : "#A0AAA7",
          }}
        >
          {url
            ? subtitle
            : "Not uploaded"}
        </Typography>
      </Box>

      {/* VIEW BUTTON */}

      <Button
        disabled={!url}
        onClick={handleView}
        startIcon={
          <VisibilityOutlinedIcon
            sx={{
              fontSize:
                "14px !important",
            }}
          />
        }
        sx={{
          minWidth: "auto",

          height: 29,

          px: 1.1,

          flexShrink: 0,

          border:
            "1px solid #CDE4DC",

          borderRadius: "6px",

          bgcolor: "#FFFFFF",

          color: "#07876A",

          fontSize: 9.5,
          fontWeight: 600,

          textTransform: "none",

          "&:hover": {
            bgcolor: "#EAF7F2",
            borderColor: "#07876A",
          },

          "&.Mui-disabled": {
            borderColor: "#E5E9E7",
            color: "#ADB5B2",
          },
        }}
      >
        View
      </Button> 
    </Box>
  );
}

/* =====================================================
   EMPTY
===================================================== */

function EmptyText({
  children,
}) {
  return (
    <Typography
      sx={{
        fontSize: 11,
        color: "#8A9692",
      }}
    >
      {children}
    </Typography>
  );
}