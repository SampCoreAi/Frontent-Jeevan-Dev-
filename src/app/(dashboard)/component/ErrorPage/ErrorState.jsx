"use client";

import { Box, Button, Typography } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function ErrorState({ onRetry, loading = false }) {
  return (
    <Box
      role="alert"
      sx={{
        minHeight: 350,
        display: "grid",
        placeItems: "center",
        p: 3,
        bgcolor: "white",
        border: "1px solid #DDE9E5",
        borderRadius: 2,
        textAlign: "center",
      }}
    >
      <Box>
        <DescriptionOutlinedIcon
          sx={{ fontSize: 64, color: "#94A3AB", mb: 2 }}
        />

        <Typography
          sx={{ fontSize: 20, fontWeight: 600, color: "#172033" }}
        >
          Unable to load data
        </Typography>

        <Typography sx={{ fontSize: 13, color: "#64748B", mt: 1 }}>
          Please try again in a moment.
        </Typography>

        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
          disabled={loading || !onRetry}
          sx={{
            mt: 3,
            px: 3,
            bgcolor: "#07876A",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { bgcolor: "#066D56", boxShadow: "none" },
          }}
        >
          {loading ? "Retrying..." : "Retry"}
        </Button>
      </Box>
    </Box>
  );
}