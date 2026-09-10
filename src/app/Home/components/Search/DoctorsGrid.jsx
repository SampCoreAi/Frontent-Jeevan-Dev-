"use client";
import { Stack } from "@mui/material";
import DoctorCard from "./DoctorCard";

export default function DoctorsGrid({ doctors }) {
  return (
    <Stack spacing={2}>
      {doctors.map((doctor, index) => (
        <DoctorCard key={doctor.id || `doctor-${index}`} doctor={doctor} />
      ))}
    </Stack>
  );
}