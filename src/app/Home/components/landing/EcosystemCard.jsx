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
   FEATURE ITEM
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
          xs: 42,
          sm: 35,
        },

        px: {
          xs: 0.9,
          sm: 0,
        },

        display: "flex",
        alignItems: "center",

        minWidth: 0,

        /* =========================================
           MOBILE BUTTON DESIGN
        ========================================= */

        bgcolor: {
          xs: "#F8FBFA",
          sm: "#FFFFFF",
        },

        border: {
          xs: "1px solid #E1ECE8",
          sm: "none",
        },

        borderRadius: {
          xs: "11px",
          sm: "15px",
        },

        overflow: "hidden",

        cursor: onClick
          ? "pointer"
          : "default",

        transition:
          "background-color .2s ease, border-color .2s ease, transform .2s ease",

        "&:hover": {
          bgcolor: {
            xs: "#F0F8F5",
            sm: "#FFFFFF",
          },

          borderColor: {
            xs: "rgba(7,135,106,.20)",
          },
        },
      }}
    >
      {/* =========================================
          FEATURE ICON
          ONLY MOBILE
      ========================================= */}

      <Box
        sx={{
          width: 27,
          height: 27,

          flexShrink: 0,

          display: {
            xs: "flex",
            sm: "none",
          },

          alignItems: "center",
          justifyContent: "center",

          borderRadius: "8px",

          bgcolor:
            "rgba(7,135,106,.075)",

          color: C.primary,
        }}
      >
        <Icon
          sx={{
            fontSize: 14,
          }}
        />
      </Box>

      {/* =========================================
          LABEL
      ========================================= */}

      <Typography
        sx={{
          ml: {
            xs: 0.7,
            sm: 1.15,
          },

          flex: 1,

          minWidth: 0,

          fontSize: {
            xs: "9.5px",
            sm: "12px",
            md: "12px",
          },

          lineHeight: 1.2,

          fontWeight: 600,

          color: C.text,

          whiteSpace: "nowrap",

          overflow: "hidden",

          textOverflow: "ellipsis",
        }}
      >
        {label}
      </Typography>

      {/* =========================================
          MOBILE CHEVRON
      ========================================= */}

      <ChevronRightRoundedIcon
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },

          ml: 0.1,

          fontSize: 13,

          flexShrink: 0,

          color: "#9AA8A4",
        }}
      />
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

        /* =========================================
           MOBILE COMPACT
           DESKTOP SAME
        ========================================= */

        height: {
          xs: "auto",
          sm: 170,
        },

        minHeight: {
          xs: 0,
          sm: 170,
        },

        overflow: "hidden",

        borderRadius: {
          xs: "18px",
          sm: "22px",
        },

        backgroundColor: "#FFFFFF",

        border:
          `1px solid ${C.border}`,

        boxShadow:
          "0 10px 28px rgba(23,32,51,.045)",

        cursor: onClick
          ? "pointer"
          : "default",

        transition:
          "transform .25s ease, box-shadow .25s ease, border-color .25s ease",

        "&:hover": {
          transform: {
            xs: "none",
            sm: "translateY(-2px)",
          },

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
          MOBILE HIDDEN
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

          backgroundColor: "#e2e2e2",

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
          DESKTOP/TABLET ONLY
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
            xs: 14,
            sm: 16,
          },

          left: {
            xs: 14,
            sm: 17,
          },

          right: {
            xs: 14,
            sm: "auto",
          },

          zIndex: 10,
        }}
      >
        {/* MAIN ICON */}

        <Box
          sx={{
            width: {
              xs: 42,
              sm: 46,
            },

            height: {
              xs: 42,
              sm: 46,
            },

            borderRadius: {
              xs: "12px",
              sm: "14px",
            },

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
              fontSize: {
                xs: 19,
                sm: 21,
              },
            }}
          />
        </Box>

        {/* TITLE + SUBTITLE */}

        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "14px",
                sm: "15px",
              },

              lineHeight: 1.15,

              fontWeight: 800,

              letterSpacing:
                "-0.02em",

              color: C.text,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              mt: 0.3,

              fontSize: {
                xs: "10px",
                sm: "10.5px",
              },

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
          MOBILE HIDDEN
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

          transition:
            "all .25s ease",
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

          /* MOBILE SIDE SPACE */

          mx: {
            xs: 1.4,
            sm: 0,
          },

          /* HEADER KE LIYE SPACE */

          pt: {
            xs: "72px",
            sm: 0,
          },

          pb: {
            xs: 1.4,
            sm: 0,
          },

          display: "grid",

          /* =================================
             MOBILE:
             [ BUTTON ][ BUTTON ]
             [ BUTTON ][ BUTTON ]
          ================================= */

          gridTemplateColumns: {
            xs:
              "repeat(2, minmax(0, 1fr))",

            sm:
              "1fr 1fr",
          },

          columnGap: {
            xs: 0.8,
            sm: 0.8,
          },

          rowGap: {
            xs: 0.8,
            sm: 0.8,
          },

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
          MOBILE HIDDEN
          LAPTOP/DESKTOP SAME
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