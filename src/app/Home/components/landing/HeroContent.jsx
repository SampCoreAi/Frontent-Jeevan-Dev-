"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { styled, keyframes } from "@mui/material";
const words = [
  "Doctors",
  "Specialists",
  "Hospitals",
  "Healthcare",
];

const pulse = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
`;

const slideUpFade = keyframes`
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const heartbeat = keyframes`
  0%, 100% { transform: scale(1); }
  10% { transform: scale(1.1); }
  20% { transform: scale(1); }
  30% { transform: scale(1.1); }
  40% { transform: scale(1); }
`;

const GradientText = styled("span")({
  background: "linear-gradient(135deg, #1e6658 0%, #2dd4a0 50%, #1e6658 100%)",
  backgroundSize: "200% auto",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",

  display: "inline-block",
  fontWeight: 800,
  minWidth: "240px",
  textAlign: "center",

  border: "2px solid #1e6658",
  borderRadius: "12px",
  padding: "8px 20px", // px:3 py:1 ki jagah

  transition: "all 0.5s ease",
  animation: `${shimmer} 3s linear infinite`,
});

export default function HeroContent() {
  const [currentWord, setCurrentWord] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", px: { xs: 2, sm: 0 } }}>
      {/* Badge */}
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          
          bgcolor: "rgba(30, 102, 88, 0.1)",
          color: "#1e6658",
          px: { xs: 1.5, sm: 2 },
          py: { xs: 0.5, sm: 0.75 },
          borderRadius: "50px",
          mb: 3,
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          fontWeight: 600,
          flexWrap: "wrap",
          justifyContent: "center",
          textAlign: "center",
          maxWidth: { xs: "100%", sm: "fit-content" },
          animation: `${pulse} 2s infinite`,
          cursor: "default",
          "&:hover": {
            animation: `${heartbeat} 1s ease-in-out`,
          },
        }}
      >
        <Box
          sx={{
            width: { xs: 6, sm: 8 },
            height: { xs: 6, sm: 8 },
            bgcolor: "#22c55e",
            borderRadius: "50%",
            animation: `${pulse} 2s infinite`,
          }}
        />
        Available Now - 500+ Doctors Online
      </Box>

      {/* Heading - Improved Responsive */}
      <Typography
        variant="h1"
        sx={{
           whiteSpace: {
      xs: "normal",
      lg: "nowrap",
    },
          color: "#0f172a",
          fontWeight: 800,
          fontSize: {
            xs: "2.25rem",    // Mobile: slightly reduced
            sm: "2.75rem",    // Small tablet
            md: "3.5rem",     // Tablet
            lg: "4rem",       // Desktop
            xl: "4.5rem",     // Large screens
          },
          lineHeight: {
            xs: 1.25,         // Mobile: better spacing
            sm: 1.2,
            md: 1.15,
            lg: 1.1,
          },
          letterSpacing: {
            xs: "-0.01em",    // Mobile: less tight
            sm: "-0.02em",
          },
          textAlign: "center",
          px: { xs: 1, sm: 0 },  // Mobile: slightly less padding
          animation: `${slideUpFade} 0.8s ease-out`,
        }}
      >
        Find Your Right{" "}
        <GradientText>
          {words[currentWord]}
        </GradientText>{" "}
        For You
      </Typography>

      {/* Sub heading - Improved */}
      <Typography
        // Semantic HTML
        sx={{
          color: "#475569",
          mt: { xs: 2, sm: 2 },     // Added top margin
          mb: { xs: 4, sm: 3 },
          fontSize: {
            xs: "1rem",       // Mobile: 1.1 se 1rem (balanced)
            sm: "1.15rem",
            md: "1.35rem",
            lg: "1.2rem",
          },
          fontWeight: 400,
          maxWidth: 700,
          mx: "auto",
          lineHeight: {
            xs: 1.6,          // Mobile: slightly tighter
            sm: 1.7,
          },

          textAlign: "center",
          animation: `${slideUpFade} 0.8s ease-out 0.2s both`,
        }}
      >
        Connect with top-rated specialists, book appointments instantly.
      </Typography>

    </Box>

  );
}