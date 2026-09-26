"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { keyframes } from "@mui/system";

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(18, 184, 145, 0.28);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(18, 184, 145, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(18, 184, 145, 0);
  }
`;

export default function HeroContent() {
  return (
    <Box
      sx={{
        width: "100%",
        mx: "auto",
        textAlign: "center",
        fontFamily: "var(--font-inter), Arial, sans-serif",
        px: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        pt: {
          xs: 2,
          sm: 2.5,
          md: 2,
        },
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",

          height: {
            xs: "38px",
            md: "40px",
          },

          px: "13px",

          mb: {
            xs: "28px",
            sm: "30px",
            md: "20px",
          },

          bgcolor: "white",
          border: "1px solid #BCE8DE",
          borderRadius: "999px",

          boxShadow: "0 8px 24px rgba(7, 135, 106, 0.04)",

          animation: `${fadeUp} 0.45s ease-out`,
        }}
      >
        <Box
          sx={{
            width: "8px",
            height: "8px",
            flexShrink: 0,
            borderRadius: "50%",
            bgcolor: "#2DBF98",
            animation: `${pulse} 2s infinite`,
          }}
        />

        <Typography
          component="span"
          sx={{
            fontFamily: "inherit",
            fontSize: {
              xs: "11.5px",
              sm: "12px",
              md: "12.5px",
            },
            lineHeight: 1,
            fontWeight: 700,
            color: "#007D68",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
        >
          500+ doctors available now
        </Typography>

        <Box
          sx={{
          
            ml: "2px",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            flexShrink: 0,

         
            color: "#078F73",

          }}
        >
          <ArrowForwardIcon
            sx={{
              fontSize: "15px",
            }}
          />
        </Box>
      </Box>
      <Typography
        component="h1"
        sx={{
          maxWidth: "900px",
          margin: "5px auto 0",
          color: "#172033",
   userSelect: "none",
      WebkitUserSelect: "none",
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: "clamp(46px, 5vw, 78px)",
          fontWeight: 500,
          lineHeight: 1.03,
          letterSpacing: "-3.3px",

          "@media (max-width: 900px)": {
            fontSize: "47px",
          },

          "@media (max-width: 650px)": {
            fontSize: "38px",
            letterSpacing: "-2px",
          },
        }}
      >
        Better care starts with the
       <Box
  component="span"
  sx={{
    display: "block",
    mt: "5px",
    fontFamily: "inherit",
    fontSize: "inherit",
    fontWeight: "inherit",
    lineHeight: "inherit",
    letterSpacing: "inherit",
  }}
>
  <Box
    component="span"
    sx={{
      position: "relative",
      display: "inline-block",
      color: "#07876A",
      px: "12px",
      py: "1px",
      zIndex: 1,

      userSelect: "none",
      WebkitUserSelect: "none",

      "&::before": {
        content: '""',
        position: "absolute",

        left: "2px",
        right: "2px",
        top: "12%",
        bottom: "5%",

        background:
          "linear-gradient(100deg, #DDF8B7 0%, #CFF5A3 50%, #D9F8AE 100%)",

        borderRadius: "3px 1px 3px 2px",

        transform: "rotate(-0.5deg)",
        zIndex: -1,

        boxShadow:
          "0 3px 12px rgba(7,135,106,0.05)",
      },
    }}
  >
    right doctor.
  </Box>
</Box>
      </Typography>

      <Typography
        component="p"
        sx={{
          m: 0,

          mt: {
            xs: "24px",
            sm: "27px",
            md: "28px",
          },

          mx: "auto",
   userSelect: "none",
      WebkitUserSelect: "none",
          maxWidth: {
            xs: "500px",
            sm: "650px",
            md: "720px",
          },

          px: {
            xs: 1,
            sm: 0,
          },

          fontFamily: "inherit",

          fontSize: {
            xs: "13px",
            sm: "14px",
            md: "15px",
          },

          lineHeight: {
            xs: 1.6,
            md: 1.65,
          },

          fontWeight: 400,

          letterSpacing: "-0.01em",

          color: "#66748A",

          animation: `${fadeUp} 0.65s ease-out 0.05s both`,
        }}
      >
        Discover verified doctors and specialists near you. Search, compare and
        book the right care in
        <Box
          component="span"
          sx={{
            display: {
              xs: "inline",
              md: "block",
            },
          }}
        >
          just a few clicks.
        </Box>
      </Typography>
    </Box>
  );
}

function Feature({ text }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
      }}
    >
      <Box
        sx={{
          width: "18px",
          height: "18px",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          flexShrink: 0,

          borderRadius: "50%",

          bgcolor: "#E8F8F4",

          color: "#079276",

          fontSize: "11px",
          fontWeight: 800,
        }}
      >
        ✓
      </Box>

      <Typography
        component="span"
        sx={{
          fontFamily: "inherit",
          fontSize: {
            xs: "11px",
            sm: "11.5px",
          },
          fontWeight: 600,
          lineHeight: 1,
          color: "#6A7789",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

function Dot() {
  return (
    <Box
      sx={{
        width: "3px",
        height: "3px",
        borderRadius: "50%",
        bgcolor: "#D2D9DF",

        display: {
          xs: "none",
          sm: "block",
        },
      }}
    />
  );
}
