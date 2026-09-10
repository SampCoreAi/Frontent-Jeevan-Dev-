import {
  Paper,
  Box,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

export default function DoctorsFilters({
  searchTerm,
  onSearchChange,
  selectedSpec,
  onSpecChange,
  selectedDay,
  onDayChange,
  specializations,
  availableDays,
  onAddDoctor,
}) {
  return (
    <Paper sx={{ p: 2, mb: 3, backgroundColor: "#ffffff" }}>
      <Box display="flex" gap={2} flexWrap="wrap">
        <TextField
          fullWidth
          placeholder="Search by doctor name or ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Select
          size="small"
          value={selectedSpec}
          onChange={(e) => onSpecChange(e.target.value)}
          sx={{ minWidth: 150 }}
          displayEmpty
        >
          <MenuItem value="">Specialization</MenuItem>
          {specializations.map((spec) => (
            <MenuItem key={spec} value={spec}>
              {spec}
            </MenuItem>
          ))}
        </Select>

        <Select
          size="small"
          value={selectedDay}
          onChange={(e) => onDayChange(e.target.value)}
          sx={{ minWidth: 150 }}
          displayEmpty
        >
          <MenuItem value="">Availability</MenuItem>
          {availableDays.map((day) => (
            <MenuItem key={day} value={day}>
              {day}
            </MenuItem>
          ))}
        </Select>

       
      </Box>
    </Paper>
  );
}