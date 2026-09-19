"use client";

import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { SectionTitle } from "./LabUi";

export default function LabDashboard({ profile, stats, onNavigate }) {
  return (
    <>
      <Paper elevation={0} className="lab-workspace__hero" sx={{ color: "#123f66", background: "#eaf5fb", boxShadow: "none", border: "1px solid #cfe3ef" }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography sx={{ fontSize: "0.58rem", letterSpacing: "0.12em", fontWeight: 800, color: "#0b5c8e" }}>CONNECTED LAB WORKSPACE</Typography>
            <Typography sx={{ fontSize: { xs: "1rem", md: "1.12rem" }, fontWeight: 750, mt: 0.35, color: "#123f66" }}>{profile?.lab_name || "Diagnostic Laboratory"}</Typography>
            <Typography sx={{ fontSize: "0.68rem", color: "#65767b", mt: 0.25 }}>Code: {profile?.lab_code || "-"} · Manage requests, doctors and reports</Typography>
          </Box>
          <Chip size="small" label={profile?.status || "UNKNOWN"} sx={{ alignSelf: { xs: "flex-start", sm: "center" }, bgcolor: "#d7f0e7", color: "#14734f", fontWeight: 700, position: "relative", zIndex: 1 }} />
        </Stack>
      </Paper>

      <SectionTitle title="Overview" description="A clear view of your laboratory network, workload and reports." />
      <Box className="lab-workspace__kpis">
        {[
          ["Lab Status", profile?.status || "-", "#15803d"],
          ["Doctors", stats.connections, "#1769aa"],
          ["Test Requests", stats.requests, "#0f766e"],
          ["Reports", stats.reports, "#3578b5"],
        ].map(([label, value, color]) => (
          <Paper key={label} elevation={0} sx={{ p: { xs: 1.75, md: 2 }, minHeight: 104, border: "1px solid #cfe3ef", borderRadius: "4px" }}>
            <Typography variant="body2" sx={{ color: "#65767b", fontWeight: 650 }}>{label}</Typography>
            <Typography variant="h4" sx={{ color, fontWeight: 700, mt: 0.5 }}>{value}</Typography>
          </Paper>
        ))}
      </Box>

      <Box className="lab-workspace__split">
        <Paper elevation={0} className="lab-workspace__surface">
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Box><Typography sx={{ color: "#123f66", fontWeight: 750, fontSize: "1rem" }}>Laboratory profile</Typography><Typography sx={{ color: "#65767b", mt: 0.35 }}>Registered organisation details</Typography></Box>
            <Button size="small" variant="outlined" onClick={() => onNavigate("/lab/pages/profile")}>View profile</Button>
          </Stack>
          <Box className="lab-workspace__profile-grid">
            {[["Lab name", profile?.lab_name], ["Lab code", profile?.lab_code], ["Registration", profile?.registration_number], ["Phone", profile?.phone_number], ["Address", profile?.address], ["Status", profile?.status]].map(([label, value]) => <Box key={label}><Typography variant="caption" sx={{ color: "#70858c", display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</Typography><Typography sx={{ color: "#1f2937", fontWeight: 650, mt: 0.35 }}>{value || "-"}</Typography></Box>)}
          </Box>
        </Paper>
        <Paper elevation={0} className="lab-workspace__surface">
          <Typography sx={{ color: "#123f66", fontWeight: 750, fontSize: "1rem" }}>Quick actions</Typography>
          <Typography sx={{ color: "#65767b", mt: 0.35, mb: 2 }}>Move directly to your daily work.</Typography>
          <Stack spacing={1}>
            <Button fullWidth variant="contained" onClick={() => onNavigate("/lab/pages/requests")} sx={{ justifyContent: "flex-start", bgcolor: "#0b5c8e" }}>Review test requests</Button>
            <Button fullWidth variant="outlined" onClick={() => onNavigate("/lab/pages/connections")} sx={{ justifyContent: "flex-start" }}>Manage doctor connections</Button>
            <Button fullWidth variant="outlined" onClick={() => onNavigate("/lab/pages/reports")} sx={{ justifyContent: "flex-start" }}>Open uploaded reports</Button>
          </Stack>
        </Paper>
      </Box>
    </>
  );
}
