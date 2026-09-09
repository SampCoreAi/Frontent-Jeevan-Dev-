import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  Stack,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";

const InfoRow = ({ label, value, icon, bold = false }) => (
  <Box display="flex" alignItems="flex-start" gap={1.5}>
    {icon && <Box sx={{ mt: 0.5, color: "#64748b" }}>{icon}</Box>}
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="caption"
        sx={{
          color: "#94a3b8",
          fontWeight: 600,
          fontSize: "0.65rem",
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          display: "block",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: bold ? "#0f172a" : "#334155",
          fontWeight: bold ? 600 : 400,
          fontSize: "0.875rem",
          mt: 0.25,
          wordBreak: "break-word",
        }}
      >
        {value || "—"}
      </Typography>
    </Box>
  </Box>
);

const SectionHeader = ({ icon, title }) => (
  <Box display="flex" alignItems="center" gap={1.5} mb={2.5}>
    {icon}
    <Typography fontWeight={700} color="#0f172a" fontSize="0.95rem" letterSpacing="0.3px">
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDialog({ open, onClose, doctor }) {
  if (!doctor) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          bgcolor: "#f8fafc",
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: "relative" }}>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 10,
            bgcolor: "rgba(255,255,255,0.95)",
            color: "#1e293b",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            "&:hover": {
              bgcolor: "#ffffff",
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              transform: "scale(1.05) rotate(90deg)",
            },
            transition: "all 0.3s ease",
            width: 40,
            height: 40,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {/* Profile Header */}
          <Grid container spacing={3} alignItems="stretch" mb={4}>
            {/* Avatar Section */}
            <Grid item xs={12} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "2px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  bgcolor: "#ffffff",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#1e6658",
                    boxShadow: "0 8px 25px rgba(30,102,88,0.12)",
                  },
                }}
              >
                <Avatar
                  src={doctor?.images?.[0]?.url || ""}
                  sx={{
                    width: { xs: 100, md: 140 },
                    height: { xs: 100, md: 140 },
                    border: "4px solid #ffffff",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    bgcolor: "#1e6658",
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    fontWeight: 600,
                  }}
                >
                  {!doctor?.images?.[0]?.url && doctor?.user?.fullName?.charAt(0)?.toUpperCase()}
                </Avatar>
              </Paper>
            </Grid>

            {/* Doctor Summary */}
            <Grid item xs={12} md={9}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  border: "2px solid #e2e8f0",
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#1e6658",
                    boxShadow: "0 8px 25px rgba(30,102,88,0.1)",
                  },
                }}
              >
                <SectionHeader
                  icon={<PersonIcon sx={{ color: "#1e6658", fontSize: 22 }} />}
                  title="Doctor Summary"
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      label="Name"
                      value={`Dr. ${doctor?.user?.fullName || "-"}`}
                      icon={<PersonIcon fontSize="small" />}
                      bold
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      label="Rating"
                      value={`⭐ ${doctor?.avgRating || "0"} / 5`}
                      icon={<StarIcon fontSize="small" sx={{ color: "#f59e0b" }} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      label="Specialization"
                      value={doctor?.specialization || "-"}
                      icon={<MedicalServicesIcon fontSize="small" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      label="Consultation Fee"
                      value={`₹ ${doctor?.consultationFee || "-"}`}
                      icon={<CurrencyRupeeIcon fontSize="small" sx={{ color: "#16a34a" }} />}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          {/* Main Content */}
          <Grid container spacing={3}>
            {/* Doctor Information */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  border: "2px solid #e2e8f0",
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#1e6658",
                    boxShadow: "0 8px 25px rgba(30,102,88,0.08)",
                  },
                }}
              >
                <SectionHeader
                  icon={<MedicalInformationIcon sx={{ color: "#1e6658", fontSize: 22 }} />}
                  title="Doctor Information"
                />

                <Stack spacing={2}>
                  <InfoRow label="Doctor ID" value={doctor?.doctorId} />
                  <InfoRow label="Username" value={doctor?.username} />
                  <InfoRow label="Qualification" value={doctor?.qualification} />
                  <InfoRow label="Experience" value={`${doctor?.experience || 0} Years`} />
                  <InfoRow 
                    label="Languages" 
                    value={doctor?.language?.length ? doctor.language.join(", ") : "-"} 
                  />
                </Stack>
              </Paper>
            </Grid>

            {/* Contact Details */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  border: "2px solid #e2e8f0",
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#1e6658",
                    boxShadow: "0 8px 25px rgba(30,102,88,0.08)",
                  },
                }}
              >
                <SectionHeader
                  icon={<ContactMailIcon sx={{ color: "#1e6658", fontSize: 22 }} />}
                  title="Contact Details"
                />

                <Stack spacing={2}>
                  <InfoRow
                    label="Email"
                    value={doctor?.user?.email}
                    icon={<EmailIcon fontSize="small" />}
                  />
                  <InfoRow
                    label="Phone"
                    value={doctor?.user?.phoneNumber}
                    icon={<PhoneIcon fontSize="small" />}
                  />
                  <InfoRow
                    label="User ID"
                    value={doctor?.userId}
                    icon={<PersonIcon fontSize="small" />}
                  />
                </Stack>
              </Paper>
            </Grid>

            {/* Availability */}
            <Grid item xs={12} md={8}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  border: "2px solid #e2e8f0",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#1e6658",
                    boxShadow: "0 8px 25px rgba(30,102,88,0.08)",
                  },
                }}
              >
                <SectionHeader
                  icon={<ScheduleIcon sx={{ color: "#1e6658", fontSize: 22 }} />}
                  title="Availability"
                />

                <Stack direction="row" flexWrap="wrap" gap={1.5}>
                  {doctor?.availability?.length ? (
                    doctor.availability.map((item, index) => (
                      <Chip
                        key={index}
                        label={`${item.day}: ${item.startTime} - ${item.endTime}`}
                        sx={{
                          bgcolor: "#f1f5f9",
                          color: "#0f172a",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          borderRadius: "10px",
                          py: 1,
                          "&:hover": {
                            bgcolor: "#1e6658",
                            color: "#ffffff",
                          },
                          transition: "all 0.2s ease",
                        }}
                      />
                    ))
                  ) : (
                    <Typography color="#94a3b8" fontSize="0.875rem">
                      No availability details available
                    </Typography>
                  )}
                </Stack>
              </Paper>
            </Grid>

            {/* Hospital Details */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  border: "2px solid #e2e8f0",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#1e6658",
                    boxShadow: "0 8px 25px rgba(30,102,88,0.08)",
                  },
                }}
              >
                <SectionHeader
                  icon={<LocalHospitalIcon sx={{ color: "#1e6658", fontSize: 22 }} />}
                  title="Hospital Details"
                />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                      <InfoRow
                        label="Hospital"
                        value={doctor?.hospitalDetail?.[0]?.hospitalName}
                        bold
                      />
                      <InfoRow label="City" value={doctor?.hospitalDetail?.[0]?.city} />
                      <InfoRow label="State" value={doctor?.hospitalDetail?.[0]?.state} />
                      <InfoRow label="Pincode" value={doctor?.hospitalDetail?.[0]?.pincode} />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#94a3b8",
                          fontWeight: 600,
                          fontSize: "0.65rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.8px",
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        Address
                      </Typography>
                      <Typography
                        sx={{
                          color: "#1e293b",
                          fontSize: "0.875rem",
                          lineHeight: 1.8,
                          bgcolor: "#f8fafc",
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        {doctor?.hospitalDetail?.[0]?.flatPlotNo && 
                          `${doctor.hospitalDetail[0].flatPlotNo}, `}
                        {doctor?.hospitalDetail?.[0]?.buildingSociety && 
                          `${doctor.hospitalDetail[0].buildingSociety}, `}
                        {doctor?.hospitalDetail?.[0]?.streetName && 
                          `${doctor.hospitalDetail[0].streetName}, `}
                        {doctor?.hospitalDetail?.[0]?.areaLocality && 
                          `${doctor.hospitalDetail[0].areaLocality}`}
                        {!doctor?.hospitalDetail?.[0]?.flatPlotNo && 
                         !doctor?.hospitalDetail?.[0]?.buildingSociety && 
                         !doctor?.hospitalDetail?.[0]?.streetName && 
                         !doctor?.hospitalDetail?.[0]?.areaLocality && 
                         "—"}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}