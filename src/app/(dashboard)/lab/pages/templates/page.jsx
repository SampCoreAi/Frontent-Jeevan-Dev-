"use client";

import { Box } from "@mui/material";
import LabReportTemplateEditor from "../../components/LabReportTemplateEditor";

export default function LabReportTemplatesPage() {
  return (
    <Box sx={{ pt: 10, px: { xs: 1.5, md: 3 }, pb: 4, bgcolor: "#fff", minHeight: "100vh" }}>
      <LabReportTemplateEditor />
    </Box>
  );
}