"use client";

import { useState } from "react";
import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import {
  ArrowRight,
  FilePlus2,
  FlaskConical,
  CloudUpload,
} from "lucide-react";

const slots = [
  { id: "09-10", time: "09:00 – 10:00 AM", count: 6, status: "Ongoing" },
  { id: "10-11", time: "10:00 – 11:00 AM", count: 8, status: "Upcoming" },
  { id: "11-12", time: "11:00 – 12:00 PM", count: 7, status: "Upcoming" },
  { id: "12-01", time: "12:00 – 01:00 PM", count: 5, status: "Upcoming" },
];

const patients = [
  ["Priya Sharma", "F • 32 yrs", "CBC", "Dr. R. Mehta", "City Care Hospital", "Routine", "Sample collected", "09:42 AM"],
  ["Amit Verma", "M • 45 yrs", "Lipid Profile", "Dr. S. Rao", "Sunrise Clinic", "Urgent", "In progress", "09:18 AM"],
  ["Neha Kapoor", "F • 29 yrs", "Thyroid Panel", "Dr. R. Mehta", "City Care Hospital", "Routine", "Report ready", "08:55 AM"],
  ["Rahul Mehta", "M • 38 yrs", "Blood Sugar", "Dr. A. Shah", "Green Cross Clinic", "Routine", "Upcoming", "10:05 AM"],
  ["Ananya Singh", "F • 26 yrs", "Vitamin D", "Dr. P. Nair", "Sunrise Clinic", "Urgent", "In progress", "10:12 AM"],
  ["Karan Patel", "M • 41 yrs", "Liver Function", "Dr. S. Rao", "City Care Hospital", "Routine", "Sample collected", "10:24 AM"],
  ["Pooja Rao", "F • 35 yrs", "CBC", "Dr. A. Shah", "Green Cross Clinic", "Routine", "Upcoming", "11:10 AM"],
  ["Rohan Das", "M • 30 yrs", "Kidney Function", "Dr. P. Nair", "Sunrise Clinic", "Urgent", "Report ready", "11:25 AM"],
];

const actions = [
  { label: "Add walk-in order", id: "walk-in", Icon: FilePlus2, color: "#16866F", bg: "#E5F7F2" },
  { label: "Enter results", id: "results", Icon: FlaskConical, color: "#2670C8", bg: "#EAF3FF" },
  { label: "Upload report", id: "upload", Icon: CloudUpload, color: "#7852D6", bg: "#F1EBFF" },
];

const chipColors = {
  Routine: { bgcolor: "#EEF1F5", color: "#526176" },
  Urgent: { bgcolor: "#FDE8E8", color: "#DC4545" },
  "Sample collected": { bgcolor: "#E4F6F0", color: "#14856D" },
  "In progress": { bgcolor: "#E8F1FF", color: "#2670C8" },
  "Report ready": { bgcolor: "#E5F6E8", color: "#268544" },
  Upcoming: { bgcolor: "#EEF1F5", color: "#748196" },
};

function DataChip({ label }) {
  return (
    <Chip
      label={label}
      size="small"
      sx={{ height: 23, borderRadius: 1.5, fontSize: 12, ...chipColors[label] }}
    />
  );
}

export default function DashboardWorkSection({ onAction }) {
  const [selectedSlot, setSelectedSlot] = useState(slots[0]);
  const slotIndex = slots.findIndex((slot) => slot.id === selectedSlot.id);

  const slotPatients = Array.from({ length: selectedSlot.count }, (_, index) => {
    const patient = patients[(index + slotIndex) % patients.length];

    return {
      id: `JD-${2841 - slotIndex * 10 - index}`,
      name: patient[0],
      details: patient[1],
      test: patient[2],
      doctor: patient[3],
      clinic: patient[4],
      priority: patient[5],
      status: patient[6],
      received: patient[7],
    };
  });

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "minmax(0, 2fr) minmax(340px, 1fr)",
        },
        gap: 2,
        mt:2,
        alignItems: "start",
      }}
    >
      <Paper
        elevation={0}
        sx={{ p: 2, border: "1px solid #E2EBE9", borderRadius: 2 }}
      >
        <Typography sx={{ color: "#172033", fontSize: 17, fontWeight: 700 }}>
          Patients in selected slot
        </Typography>
        <Typography sx={{ mt: 0.3, mb: 1.5, color: "#64748B", fontSize: 12.5 }}>
          {selectedSlot.time} · {selectedSlot.count} patients
        </Typography>

        <Box sx={{ overflowX: "auto" }}>
      <Box
  component="table"
  sx={{
    width: "100%",
    tableLayout: "fixed",
    borderCollapse: "collapse",
    "& th": {
      p: 1,
      bgcolor: "#F3F6F8",
      color: "#40516A",
      fontSize: 12.5,
      fontWeight: 700,
      textAlign: "left",
    },
    "& td": {
      p: 1,
      borderBottom: "1px solid #EDF1F2",
      color: "#40516A",
      fontSize: 12.5,
      verticalAlign: "middle",
      overflowWrap: "anywhere",
    },
  }}
>
  <thead>
    <tr>
      <th style={{ width: "15%" }}>Order</th>
      <th style={{ width: "22%" }}>Patient</th>
      <th style={{ width: "18%" }}>Test</th>
      <th style={{ width: "27%" }}>Ordered by</th>
      <th style={{ width: "18%" }}>Status</th>
    </tr>
  </thead>

  <tbody>
    {slotPatients.map((patient) => (
      <tr key={patient.id}>
        <td>
          <Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>
            {patient.id}
          </Typography>
          <Typography sx={{ color: "#748196", fontSize: 12 }}>
            {patient.received}
          </Typography>
        </td>

        <td>
          <Typography sx={{ color: "#172033", fontSize: 12.5, fontWeight: 600 }}>
            {patient.name}
          </Typography>
          <Typography sx={{ color: "#748196", fontSize: 12 }}>
            {patient.details}
          </Typography>
        </td>

        <td>
          <Typography sx={{ fontSize: 12.5 }}>{patient.test}</Typography>
          <Box sx={{ mt: 0.4 }}>
            <DataChip label={patient.priority} />
          </Box>
        </td>

        <td>
          <Typography sx={{ color: "#172033", fontSize: 12.5, fontWeight: 600 }}>
            {patient.doctor}
          </Typography>
          <Typography sx={{ color: "#748196", fontSize: 12 }}>
            {patient.clinic}
          </Typography>
        </td>

        <td>
          <DataChip label={patient.status} />
        </td>
      </tr>
    ))}
  </tbody>
</Box>
        </Box>
      </Paper>

      <Box sx={{ display: "grid", gap: 1.5 }}>
        <Paper
          elevation={0}
          sx={{ p: 1.5, border: "1px solid #E2EBE9", borderRadius: 2 }}
        >
          <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between", gap: 1 }}>
            <Box>
              <Typography sx={{ color: "#172033", fontSize: 17, fontWeight: 700 }}>
                Today&apos;s Work
              </Typography>
              <Typography sx={{ color: "#748196", fontSize: 12.5 }}>
                Sample collection slots
              </Typography>
            </Box>
            <Button
              onClick={() => onAction?.("schedule")}
              endIcon={<ArrowRight size={15} />}
              sx={{ color: "#2670C8", fontSize: 12.5, textTransform: "none" }}
            >
              View schedule
            </Button>
          </Box>

          {slots.map((slot) => {
            const selected = selectedSlot.id === slot.id;

            return (
              <Box
                component="button"
                key={slot.id}
                onClick={() => setSelectedSlot(slot)}
                sx={{
                  width: "100%",
                  minHeight: 40,
                  px: 0.8,
                  display: "grid",
                  gridTemplateColumns: "5px 1.5fr 1fr auto",
                  alignItems: "center",
                  gap: 1,
                  border: 0,
                  borderBottom: "1px solid #EDF1F3",
                  borderRadius: selected ? 1 : 0,
                  bgcolor: selected ? "#EFF9F6" : "#FFFFFF",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 20,
                    borderRadius: 2,
                    bgcolor: selected ? "#159879" : "#CBD5E1",
                  }}
                />
                <Typography sx={{ color: "#40516A", fontSize: 12.5, fontWeight: 600 }}>
                  {slot.time}
                </Typography>
                <Typography sx={{ color: "#748196", fontSize: 12.5 }}>
                  {slot.count} patients
                </Typography>
                <DataChip label={slot.status} />
              </Box>
            );
          })}
        </Paper>

      
      </Box>
    </Box>
  );
}