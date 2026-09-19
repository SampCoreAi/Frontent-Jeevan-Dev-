import React from "react";
import { Box, Typography, Divider } from "@mui/material";

export default function PrescriptionHeader({ doctor }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1.5, sm: 0 },
        }}
      >
        {/* Doctor Details */}
        <Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="primary"
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            {doctor?.name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            {doctor?.qualification} ({doctor?.specialization})
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            Reg. No: {doctor?.medical_license_no}
          </Typography>
        </Box>

        {/* Hospital Details */}
        <Box
          sx={{
            textAlign: { xs: "left", sm: "right" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              mt: { xs: 0, sm: 1 },
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            {doctor?.hospital_detail?.[0]?.hospitalName}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 1,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            {doctor?.hospital_detail?.[0]?.city},{" "}
            {doctor?.hospital_detail?.[0]?.state}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />
    </>
  );
}