"use client";

import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { SectionTitle } from "./LabUi";

export default function LabProfile({ profile }) {
  const fields = [
    ["Registration Number", profile?.registration_number],
    ["Phone Number", profile?.phone_number],
    ["Address", profile?.address],
    ["Lab Owner", profile?.full_name || profile?.admin_name],
    ["Owner Email", profile?.email],
    ["Created On", profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "-"],
  ];

  return (
    <>
      <SectionTitle title="Lab Profile" description="View your registered laboratory details and account status." />
      <Paper elevation={0} className="lab-workspace__surface">
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2} mb={4}>
          <Box><Typography variant="h5" sx={{ color: "#123d66", fontWeight: 700 }}>{profile?.lab_name || "Lab profile"}</Typography><Typography sx={{ color: "#64748b", mt: 0.5 }}>Lab code: {profile?.lab_code || "-"}</Typography></Box>
          <Chip label={profile?.status || "UNKNOWN"} color={profile?.status === "ACTIVE" ? "success" : "default"} sx={{ alignSelf: { xs: "flex-start", sm: "center" }, fontWeight: 600 }} />
        </Stack>
        <Box className="lab-workspace__profile-grid">
          {fields.map(([label, value]) => <Box key={label}><Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 0.5 }}>{label}</Typography><Typography sx={{ color: "#1f2937", fontWeight: 600, wordBreak: "break-word" }}>{value || "-"}</Typography></Box>)}
        </Box>
      </Paper>
    </>
  );
}
