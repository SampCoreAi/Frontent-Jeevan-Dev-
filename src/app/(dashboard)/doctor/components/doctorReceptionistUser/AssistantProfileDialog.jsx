"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Divider,
  Chip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import InfoIcon from "@mui/icons-material/Info";
import CakeIcon from "@mui/icons-material/Cake";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";

export default function AssistantProfileDialog({
  open,
  onClose,
  assistant,
}) {
  if (!assistant) return null;

  const getGenderIcon = (gender) => {
    if (gender?.toLowerCase() === "male") return <MaleIcon fontSize="small" />;
    if (gender?.toLowerCase() === "female") return <FemaleIcon fontSize="small" />;
    return <PersonIcon fontSize="small" />;
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const InfoRow = ({ icon, label, value }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: 1.5,
        px: 2,
        borderRadius: 1,
        transition: "background-color 0.2s",
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      <Box sx={{ color: "#1e6658", display: "flex", alignItems: "center", minWidth: 32 }}>
        {icon}
      </Box>
      <Typography sx={{ minWidth: 110, fontWeight: 600, color: "#000000" }}>
        {label}:
      </Typography>
      <Typography sx={{ fontWeight: 400, flex: 1, color: "#000000" }}>
        {value || "N/A"}
      </Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      {/* Header with close button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          pt: 2,
          pb: 1,
          bgcolor: "#1e6658",
          color: "#ffffff",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#ffffff" }}>
          Assistant Profile
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: "#ffffff",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, py: 3 }}>
        {/* Profile Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "#1e6658",
              color: "#ffffff",
              fontSize: 32,
              fontWeight: 600,
              boxShadow: 2,
            }}
          >
            {getInitials(assistant.name)}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, color: "#000000" }}>
              {assistant.name}
            </Typography>
            <Chip
              label={assistant.department || "Department"}
              size="small"
              sx={{
                backgroundColor: "#1e6658",
                color: "#ffffff",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "#155447",
                },
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 2, borderColor: "#e0e0e0" }} />

        {/* Info Grid */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <InfoRow icon={<PersonIcon />} label="Name" value={assistant.name} />
          <InfoRow icon={<EmailIcon />} label="Email" value={assistant.email} />
          <InfoRow icon={<PhoneIcon />} label="Mobile" value={assistant.mobile} />
          <InfoRow
            icon={getGenderIcon(assistant.gender)}
            label="Gender"
            value={assistant.gender}
          />
          <InfoRow icon={<CakeIcon />} label="Age" value={assistant.age} />
          <InfoRow
            icon={<SchoolIcon />}
            label="Education"
            value={assistant.education}
          />
          <InfoRow
            icon={<WorkIcon />}
            label="Experience"
            value={`${assistant.experience} Years`}
          />
          <InfoRow
            icon={<InfoIcon />}
            label="Bio"
            value={assistant.bio}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#1e6658",
            color: "#ffffff",
            borderRadius: 2,
            textTransform: "none",
            px: 4,
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#155447",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}