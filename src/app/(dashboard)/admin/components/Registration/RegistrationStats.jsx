"use client";

import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const RegistrationStats = ({ stats }) => {
  const cards = [
    {
      label: "Total Registered",
      value: stats?.total_registered || 0,
      color: "#1e6658",
    },
    {
      label: "Total Submitted",
      value: stats?.total_submitted || 0,
      color: "#2563eb",
    },
    {
      label: "Total Draft",
      value: stats?.total_draft || 0,
      color: "#d97706",
    },
    {
      label: "Total Verified",
      value: stats?.total_verified || 0,
      color: "#16a34a",
    },
    {
      label: "Total Rejected",
      value: stats?.total_rejected || 0,
      color: "#dc2626",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(5, 1fr)",
        },
        gap: 2,
        mb: 3,
      }}
    >
      {cards.map((card) => (
        <Paper
          key={card.label}
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            transition: "all 0.2s ease",

            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            },
          }}
        >
          <Typography
            sx={{
              color: "#64748b",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            {card.label}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: "1.8rem",
              fontWeight: 700,
              color: card.color,
            }}
          >
            {card.value}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default RegistrationStats;