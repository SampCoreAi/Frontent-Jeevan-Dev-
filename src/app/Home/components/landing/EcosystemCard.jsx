"use client";

import React from "react";
import Image from "next/image";
import {
  Box,
  Stack,
  Typography,
} from "@mui/material";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const C = {
  primary: "#07876A",
  text: "#172033",
  muted: "#74807B",
  border: "#E2ECE9",
  soft: "#F0F8F5",
  white: "#FFFFFF",
};

/* =========================================================
   VISUAL IMAGE
========================================================= */

function CardVisual({ visual }) {
  const images = {
    doctor: "/img/doctor-stethoscope.png",
    lab: "/img/lab.png",
    patient: "/img/patient.png",
    medical: "/img/medical-store.png",
  };

  if (!images[visual]) return null;

  return (
    <Box
      sx={{
        position: "relative",
        width: {
          sm: 145,
          md: 165,
        },
        height: {
          sm: 145,
          md: 175,
        },
        filter:
          "drop-shadow(0 15px 18px rgba(23,32,51,.10))",
      }}
    >
      <Image
        src={images[visual]}
        alt={`${visual} visual`}
        fill
        sizes="150px"
        style={{
          objectFit: "contain",
          objectPosition: "center",
        }}
      />
    </Box>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureItem({
  label,
  Icon,
  onClick,
}) {
  return (
    <Box
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      sx={{
        height: {
          xs: 52,
          sm: 35,
        },

        display: "flex",
        alignItems: "center",

        bgcolor: "#FFFFFF",


        borderRadius: {
          xs: "13px",
          sm: "15px",
        },

        overflow: "hidden",

      

        cursor: onClick
          ? "pointer"
          : "default",

        transition: "all .2s ease",

       
      }}
    >
      {/* ICON */}

    

      {/* LABEL */}

      <Typography
        sx={{
          ml: 1.15,

          flex: 1,
          minWidth: 0,

          fontSize: {
            xs: "11px",
            sm: "12px",
            md: "12px",
          },

          fontWeight: 600,

        }}
      >
        {label}
      </Typography>

    </Box>
  );
}

/* =========================================================
   MAIN CARD
========================================================= */

export default function EcosystemCard({
  title,
  subtitle,
  Icon,
  features = [],
  visual,
  onClick,
}) {
  return (
   <Box
  onClick={onClick}
  sx={{
    position: "relative",
    width: "100%",

    // Compact card
    height: {
      xs: "auto",
      sm: 170,
    },

    minHeight: {
      xs: 260,
      sm: 170,
    },

    overflow: "hidden",

    borderRadius: {
      xs: "20px",
      sm: "22px",
    },

  
 backgroundColor:"white",

    border: `1px solid ${C.border}`,

    boxShadow:
      "0 10px 28px rgba(23,32,51,.045)",

    cursor: onClick ? "pointer" : "default",

    transition:
      "transform .25s ease, box-shadow .25s ease, border-color .25s ease",

    "&:hover": {
      transform: "translateY(-2px)",

      borderColor:
        "rgba(7,135,106,.18)",

      boxShadow:
        "0 16px 36px rgba(23,32,51,.07)",

      "& .main-arrow": {
        bgcolor: C.primary,
        color: "#FFFFFF",
        transform: "rotate(-45deg)",
      },

      "& .visual-image": {
        transform:
          "translate(-50%,-50%) scale(1.035)",
      },
    },
  }}
>
  {/* =====================================================
      RIGHT CURVE
  ===================================================== */}

  <Box
    sx={{
      position: "absolute",

      right: 0,
      top: 0,

      width: {
        sm: "33%",
      },

      height: "100%",

      display: {
        xs: "none",
        sm: "block",
      },

  
  
 backgroundColor:"#e2e2e2",
      borderRadius:
        "58% 0 0 58% / 85% 0 0 85%",

      "&::before": {
        content: '""',

        position: "absolute",

        left: 10,
        top: -10,

        width: "100%",
        height: "110%",

        borderRadius:
          "58% 0 0 58% / 85% 0 0 85%",

        borderLeft:
          "1px solid rgba(7,135,106,.045)",
      },
    }}
  />

  {/* =====================================================
      DECORATIVE DOTS
  ===================================================== */}

  <Box
    sx={{
      position: "absolute",

      right: "7%",
      top: "18%",

      width: 7,
      height: 7,

      borderRadius: "50%",


      display: {
        xs: "none",
        sm: "block",
      },
    }}
  />

  <Box
    sx={{
      position: "absolute",

      right: "3%",
      top: "31%",

      width: 9,
      height: 9,

      borderRadius: "50%",

  

      display: {
        xs: "none",
        sm: "block",
      },
    }}
  />

  <Box
    sx={{
      position: "absolute",

      right: "26%",
      bottom: "19%",
      width: 8,
      height: 8,

      borderRadius: "50%",


      display: {
        xs: "none",
        sm: "block",
      },
    }}
  />

  {/* =====================================================
      HEADER
  ===================================================== */}

  <Stack
    direction="row"
    alignItems="center"
    spacing={1.15}
    sx={{
      position: "absolute",

      top: {
        xs: 16,
        sm: 16,
      },

      left: {
        xs: 16,
        sm: 17,
      },

      zIndex: 10,
    }}
  >
    {/* MAIN ICON */}

    <Box
      sx={{
        width: {
          xs: 46,
          sm: 46,
        },

        height: {
          xs: 46,
          sm: 16,
        },

        borderRadius: "14px",

        flexShrink: 0,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        color: C.primary,

        background:
          "linear-gradient(145deg,#FFFFFF,#F3F9F7)",

        border:
          "1px solid #E1EBE8",

        boxShadow:
          "0 7px 18px rgba(7,135,106,.065)",
      }}
    >
      <Icon
        sx={{
          fontSize: 21,
        }}
      />
    </Box>

    {/* TITLE + SUBTITLE */}

    <Box>
      <Typography
        sx={{
          fontSize: "15px",

          lineHeight: 1.15,

          fontWeight: 800,

          letterSpacing: "-0.02em",

          color: C.text,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          mt: 0.3,

          fontSize: "10.5px",

          lineHeight: 1.3,

          color: C.muted,
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  </Stack>

  {/* =====================================================
      MAIN ARROW
  ===================================================== */}

  <Box
    className="main-arrow"
    sx={{
      position: "absolute",

      zIndex: 12,

      top: 18,

      right: "29%",

      width: 37,
      height: 37,

      display: {
        xs: "none",
        sm: "flex",
      },

      alignItems: "center",
      justifyContent: "center",

      borderRadius: "50%",

      bgcolor:
        "rgba(255,255,255,.95)",

      color: C.primary,

      border:
        "1px solid #E1EAE7",

      boxShadow:
        "0 4px 12px rgba(23,32,51,.035)",

      transition: "all .25s ease",
    }}
  >
    <ArrowForwardRoundedIcon
      sx={{
        fontSize: 18,
      }}
    />
  </Box>

  {/* =====================================================
      FEATURES
  ===================================================== */}

  <Box
    sx={{
      position: {
        xs: "relative",
        sm: "absolute",
      },

      left: {
        sm: 17,
      },

      bottom: {
        sm: 17,
      },

      width: {
        xs: "auto",
        sm: "64%",
      },

      mx: {
        xs: 2,
        sm: 0,
      },

      pt: {
        xs: "85px",
        sm: 0,
      },

      pb: {
        xs: 2,
        sm: 0,
      },

      display: "grid",

      gridTemplateColumns: {
        xs: "1fr",
        sm: "1fr 1fr",
      },

      columnGap: 0.8,
      rowGap: 0.8,

      zIndex: 10,
    }}
  >
    {features.map(
      ({
        label,
        Icon: FeatureIcon,
        onClick: featureClick,
      }) => (
        <FeatureItem
          key={label}
          label={label}
          Icon={FeatureIcon}
          onClick={featureClick}
        />
      )
    )}
  </Box>

  {/* =====================================================
      RIGHT VISUAL
  ===================================================== */}

  <Box
    className="visual-image"
    sx={{
      position: "absolute",

      left: "84%",
      top: "61%",

      transform:
        "translate(-50%,-50%)",

      zIndex: 7,

      display: {
        xs: "none",
        sm: "block",
      },

      pointerEvents: "none",

      transition:
        "transform .3s ease",
    }}
  >
    <CardVisual visual={visual} />
  </Box>
</Box>
  );
}