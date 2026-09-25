"use client";

import React from "react";
import {
  Box,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const RegistrationStats = ({ stats }) => {
  const theme = useTheme();

  const cards = [
    {
      label: "Total Registered",
      value: stats?.total_registered || 0,
      icon: GroupsOutlinedIcon,
      color: theme.palette.primary.main,
    },
    {
      label: "Submitted",
      value: stats?.total_submitted || 0,
      icon: SendOutlinedIcon,
      color: theme.palette.info.main,
    },
    {
      label: "Draft",
      value: stats?.total_draft || 0,
      icon: EditNoteOutlinedIcon,
      color: theme.palette.warning.main,
    },
    {
      label: "Verified",
      value: stats?.total_verified || 0,
      icon: VerifiedOutlinedIcon,
      color: theme.palette.success.main,
    },
    {
      label: "Rejected",
      value: stats?.total_rejected || 0,
      icon: CancelOutlinedIcon,
      color: theme.palette.error.main,
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",

        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(3, 1fr)",
          lg: "repeat(5, 1fr)",
        },

        gap: 1.5,
        mb: 2.5,
      }}
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Paper
            key={card.label}
            elevation={0}
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderRadius: 2,

              border: "1px solid",
              borderColor: "divider",

              bgcolor: "background.paper",

              display: "flex",
              alignItems: "center",
              gap: 1.4,

              transition: "0.2s ease",

              "&:hover": {
                borderColor: `${card.color}50`,
                transform: "translateY(-1px)",
              },
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                flexShrink: 0,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderRadius: 1.5,

                bgcolor: `${card.color}10`,
                color: card.color,
              }}
            >
              <Icon sx={{ fontSize: 20 }} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={{
                  fontSize: "11px",
                  color: "text.secondary",
                  fontWeight: 500,
                }}
              >
                {card.label}
              </Typography>

              <Typography
                sx={{
                  mt: 0.1,
                  fontSize: {
                    xs: "18px",
                    sm: "21px",
                  },
                  lineHeight: 1.2,
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                {card.value}
              </Typography>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default RegistrationStats;