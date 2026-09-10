"use client"
import {
  Box,
  Card,
  Typography,
  Chip,
  Avatar,
  Grid,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { useRouter } from "next/navigation";
import { formatTimeRange } from "../../../../../config/timeFormatter";

export default function DoctorProfileDetail({ data, doctorId }) {
  const router = useRouter();

  // Direct access to data since API returns flat structure
  const doctor = data || {};

  const languages = doctor?.language || [];

  const handleBookAppointment = () => {
    router.push(`/users/pages/Appointment?id=${doctorId}`);
  };



const imageUrl = doctor?.img_key
  ? `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${doctor.img_key}`
  : "/img/IconDoctor.png";

  const workingHours =
    doctor?.availability?.length
      ? `${doctor.availability[0].startTime} - ${doctor.availability[0].endTime}`
      : "-";

  const hospital = doctor?.hospital_detail?.[0] || {};
  
  const clinicAddress = [
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
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "300px 1fr" },
        maxWidth: 1300,
        mx: "auto",
        boxShadow: "0 4px 12px #1e6658",
        borderRadius: 0,
      }}
    >
      {/* Left Section */}
      <Card sx={{ p: 3, textAlign: "center", borderRadius: 0 }}>
        <Avatar
          src={imageUrl}
          alt={doctor?.full_name || "Doctor"}
          sx={{
            width: 120,
            height: 120,
            mx: "auto",
            mb: 2,
            border: "4px solid #20b2aa",
          }}
        >
          {doctor?.full_name?.charAt(0) || "D"}
        </Avatar>

        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
          {doctor?.full_name || "Doctor Name"}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            mb: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            sx={{
              flex: 1,
              p: 1.5,
              textAlign: "center",
              background: "#e8f5e9",
              borderRadius: "10px",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "#00695c",
                fontWeight: 600,
              }}
            >
              Experience
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>
              {doctor?.experience || 0}+ yrs
            </Typography>
          </Paper>

          <Paper
            sx={{
              flex: 1,
              p: 1.5,
              textAlign: "center",
              background: "#fff3e0",
              borderRadius: "10px",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "#e65100",
                fontWeight: 600,
              }}
            >
              Consultation
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>
              ₹{doctor?.consultation_fee || "-"}
            </Typography>
          </Paper>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            mb: 2,
            justifyContent: "center",
          }}
        >
          <Paper
            sx={{
              flex: 1,
              p: 1.5,
              textAlign: "center",
              background: "#e3f2fd",
              borderRadius: "10px",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "#1565c0",
                fontWeight: 600,
              }}
            >
              Age
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>
              {doctor?.age ?? "-"}
            </Typography>
          </Paper>

          <Paper
            sx={{
              flex: 1,
              p: 1.5,
              textAlign: "center",
              background: "#f3e5f5",
              borderRadius: "10px",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "#7b1fa2",
                fontWeight: 600,
              }}
            >
              Gender
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>
              {doctor?.gender || "-"}
            </Typography>
          </Paper>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: "10px",
            border: "1px solid #e3e3e3",
            background: "#fdfefe",
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: "#333",
                mb: 1,
                fontSize: "1rem",
              }}
            >
              Clinic Address
            </Typography>

            <Typography
              sx={{
                color: "#666",
                fontSize: "0.9rem",
                lineHeight: 1.7,
              }}
            >
              {clinicAddress || "Address not available"}
            </Typography>

            <Typography
              sx={{
                mt: 1.5,
                fontWeight: 600,
                color: "#1e6658",
              }}
            >
              {hospital?.hospitalName || ""}
            </Typography>
          </Box>
        </Paper>

        <Button
          fullWidth
          variant="contained"
          sx={{ marginTop: 3, backgroundColor: "#1e6658", borderRadius: 1 }}
          onClick={handleBookAppointment}
        >
          Book Appointment
        </Button>
      </Card>

      {/* Right Section */}
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: "0px" }}>
        {/* About */}
        <Box sx={{ mb: 3, pb: 2, borderBottom: "2px solid #f0f0f0" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            About Doctor
          </Typography>
          <Typography sx={{ color: "#666" }}>{doctor?.bio || "-"}</Typography>
        </Box>

        {/* Contact */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Contact Information
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: "1px solid #e3e3e3",
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    backgroundColor: "#e8f5e9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <EmailIcon sx={{ color: "#20b2aa" }} />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "#7a8a99",
                    }}
                  >
                    Email Address
                  </Typography>
                  <Typography fontWeight={600}>
                    {doctor?.email || "-"}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: "1px solid #e3e3e3",
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    backgroundColor: "#e3f2fd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PhoneIcon sx={{ color: "#1976d2" }} />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "#7a8a99",
                    }}
                  >
                    Phone Number
                  </Typography>
                  <Typography fontWeight={600}>
                    {doctor?.mobile || "-"}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Professional Details */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, pb: 1 }}>
            Professional Details
          </Typography>

          <Grid container spacing={3} columns={12}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "10px",
                  border: "1px solid #e3e3e3",
                  background: "#fdfefe",
                }}
              >
                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                  Languages
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {languages.map((lang, i) => (
                    <Chip
                      key={i}
                      label={lang}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: "#20b2aa",
                        color: "#00695c",
                        borderRadius: 0.5,
                        fontWeight: 600,
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: "10px",
                  border: "1px solid #e3e3e3",
                  background: "#fdfefe",
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>Qualifications</Typography>
                <Typography sx={{ color: "#555", mt: 1 }}>
                  {doctor?.qualification || "-"}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#fff",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  Availability
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  {doctor?.availability?.map((item, index) => (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        border: "1px solid #20b2aa",
                        minWidth: 180,
                        backgroundColor: "#f8fffe",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#00695c",
                        }}
                      >
                        {item.day}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#666",
                          mt: 0.5,
                        }}
                      >
                        {formatTimeRange(
                          `${item.startTime}:00`,
                          `${item.endTime}:00`
                        )}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}