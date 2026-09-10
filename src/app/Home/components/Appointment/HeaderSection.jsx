import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import LocalHospital from "@mui/icons-material/LocalHospital";
import { useTheme } from "@mui/material/styles";
import AddIcon from '@mui/icons-material/Add';

export default function HeaderSection({ bookingFor, setBookingFor }) {
  const theme = useTheme();

  const handleChange = (_, value) => {
    if (value !== null) {
      setBookingFor(value);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f6faf9",
        color: "white",
        textAlign: "center",


      }}
    >
      <AddIcon sx={{ fontSize: 44, mb: 1, color: "#02836f", backgroundColor: "#e5f2f0", width: 50, height: 50, borderRadius: 1 }} />

      <Typography variant="h4" sx={{ color: "black" }} fontWeight={700}>
        Book Your Appointment
      </Typography>

      <Typography variant="subtitle1" sx={{ opacity: 0.9, color: "black" }}>
        Quick and easy scheduling with expert doctors
      </Typography>
    </Box>
  );
}