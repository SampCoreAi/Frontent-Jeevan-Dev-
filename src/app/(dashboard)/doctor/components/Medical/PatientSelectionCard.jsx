import {
  Box,
  Button,
  Chip,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import SectionCard from "./SectionCard";

export default function PatientSelectionCard({
  patients,
  selectedPatientId,
  selectedPatient,
  onPatientChange,
  onOpenStoreDialog,
}) {
  return (
    <SectionCard
      title="Patient & store selection"
      subtitle="Keep the patient and approved medical stores connected to the request flow."
      action={
        <Button
          variant="contained"
          startIcon={<LocalPharmacyOutlinedIcon />}
          onClick={onOpenStoreDialog}
          sx={{ textTransform: "none", fontWeight: 700 }}
        >
          Select Medical Store
        </Button>
      }
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }} justifyContent="space-between">
        <FormControl sx={{ minWidth: { xs: "100%", md: 260 } }}>
          <Typography variant="caption" sx={{ color: "#475569", mb: 0.75, fontWeight: 700 }}>
            Select patient
          </Typography>
          <Select
            size="small"
            value={selectedPatientId}
            onChange={(event) => onPatientChange(Number(event.target.value))}
          >
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.name} ({patient.age} yrs)
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Box sx={{ mt: 2.5, display: "grid", gap: 1.25 }}>
        <Typography variant="subtitle2" sx={{ color: "#1e293b", fontWeight: 700 }}>
          Patient details
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flexWrap="wrap" useFlexGap>
          <Chip label={`Name: ${selectedPatient.name}`} />
          <Chip label={`Age: ${selectedPatient.age}`} />
          <Chip label={`Gender: ${selectedPatient.gender}`} />
          <Chip label={`Phone: ${selectedPatient.phone}`} />
        </Stack>
      </Box>
    </SectionCard>
  );
}
