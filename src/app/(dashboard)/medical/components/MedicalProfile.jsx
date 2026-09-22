"use client";

import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { SectionTitle } from "../../lab/components/LabUi";

export default function MedicalProfile({ profile }) {
  const fields = [
    ["Store Name", profile?.store_name || profile?.medical_store_name],
    ["Store Code", profile?.store_code || profile?.medical_store_code],
    ["Phone Number", profile?.phone_number || profile?.phone],
    ["Address", profile?.address],
    ["Owner", profile?.full_name || profile?.owner_name],
    ["Email", profile?.email],
    ["Created On", profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "-"],
  ];

  return (
    <>
      <SectionTitle title="Medical Store Profile" description="View your registered medical store details and account status." />
      <Paper elevation={0} className="lab-workspace__surface">
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2} mb={4}>
          <Box>
            <Typography variant="h5" sx={{ color: "#123d66", fontWeight: 700 }}>{profile?.store_name || profile?.medical_store_name || "Medical store"}</Typography>
            <Typography sx={{ color: "#64748b", mt: 0.5 }}>Store code: {profile?.store_code || profile?.medical_store_code || "-"}</Typography>
          </Box>
          <Chip label={profile?.status || "ACTIVE"} color={profile?.status === "ACTIVE" ? "success" : "default"} sx={{ alignSelf: { xs: "flex-start", sm: "center" }, fontWeight: 600 }} />
        </Stack>
        <Box className="lab-workspace__profile-grid">
          {fields.map(([label, value]) => (
            <Box key={label}>
              <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 0.5 }}>{label}</Typography>
              <Typography sx={{ color: "#1f2937", fontWeight: 600, wordBreak: "break-word" }}>{value || "-"}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </>
  );
}
