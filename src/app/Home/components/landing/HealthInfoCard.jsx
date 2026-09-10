"use client";
import React from "react";
import { motion } from "framer-motion";
import { Box, Stack, Typography } from "@mui/material";
import {
  VerifiedUser,
  Lock,
  Schedule,
  ArrowForward,
} from "@mui/icons-material";
export default function HealthInfoCard() {
  return (
    <Box
      sx={{
        mt: { xs: 8, md: 12 },
        width: "100%",
        maxWidth: "1260px",
        mx: "auto",
        bgcolor: "rgba(255,255,255,0.95)",
        borderRadius: "26px",
        boxShadow: "0 20px 45px rgba(15,23,42,0.08)",
        py: { xs: 3, md: 2 },
        px:4,
        animation: "fadeUp 0.8s ease-out 0.5s both",
        "@keyframes fadeUp": {
          "0%": {
            opacity: 0,
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 3, md: 0 }}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Left Section */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              bgcolor: "rgba(16, 185, 129, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#10B981",
            }}
          >
            <VerifiedUser sx={{ fontSize: 30 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#0F172A",
                lineHeight: 1.2,
              }}
            >
              Your Health, Our Priority
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 400,
                color: "#64748B",
              }}
            >
              We ensure a smooth, secure and reliable healthcare
              experience.
            </Typography>
          </Box>
        </Stack>

        {/* Right Section - Feature Items */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2, sm: 4 }}
          divider={
            <Box
              sx={{
                width: "1px",
                height: 40,
                bgcolor: "#E2E8F0",
                display: { xs: "none", sm: "block" },
              }}
            />
          }
          alignItems="center"
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Lock sx={{ fontSize: 22, color: "#10B981" }} />
            <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "#0F172A" }}>
              Secure & Private
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Schedule sx={{ fontSize: 22, color: "#10B981" }} />
            <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "#0F172A" }}>
              24/7 Support
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <VerifiedUser sx={{ fontSize: 22, color: "#10B981" }} />
            <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "#0F172A" }}>
              Trusted Doctors
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}