"use client";

import React from "react";

import {
  Box,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import EcosystemCard from "./EcosystemCard";

/* =========================================================
   MAIN ICONS
========================================================= */

import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LocalPharmacyRoundedIcon from "@mui/icons-material/LocalPharmacyRounded";

/* =========================================================
   FEATURE ICONS
========================================================= */

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import BiotechRoundedIcon from "@mui/icons-material/BiotechRounded";
import MedicationRoundedIcon from "@mui/icons-material/MedicationRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";

/* =========================================================
   COLORS
========================================================= */

const C = {
  primary: "#07876A",
  primaryDark: "#056D56",

  text: "#172033",
  muted: "#74807B",

  background: "#F8FAF9",
  border: "#DDE9E5",

  white: "#FFFFFF",
};

/* =========================================================
   CARDS DATA
========================================================= */

const cards = [
  {
    id: "doctor",

    title: "Doctor",
    subtitle: "Consultation & care",

    Icon: MedicalServicesRoundedIcon,

    visual: "doctor",

    features: [
      {
        label: "Appointments",
        Icon: CalendarMonthRoundedIcon,
      },
      {
        label: "Prescription",
        Icon: DescriptionRoundedIcon,
      },
      {
        label: "Lab Request",
        Icon: ScienceRoundedIcon,
      },
      {
        label: "Medicine",
        Icon: MedicationRoundedIcon,
      },
    ],
  },

  {
    id: "lab",

    title: "Diagnostic Lab",
    subtitle: "Tests & reports",

    Icon: ScienceRoundedIcon,

    visual: "lab",

    features: [
      {
        label: "Book Tests",
        Icon: BiotechRoundedIcon,
      },
      {
        label: "Lab Reports",
        Icon: DescriptionRoundedIcon,
      },
      {
        label: "Find Labs",
        Icon: SearchRoundedIcon,
      },
      {
        label: "Test History",
        Icon: FolderRoundedIcon,
      },
    ],
  },

  {
    id: "patient",

    title: "Patient",
    subtitle: "Your health journey",

    Icon: PersonRoundedIcon,

    visual: "patient",

    features: [
      {
        label: "Find Doctor",
        Icon: SearchRoundedIcon,
      },
      {
        label: "Appointments",
        Icon: CalendarMonthRoundedIcon,
      },
      {
        label: "Prescriptions",
        Icon: AssignmentRoundedIcon,
      },
      {
        label: "Health Records",
        Icon: FolderRoundedIcon,
      },
    ],
  },

  {
    id: "medical",

    title: "Medical Store",
    subtitle: "Medicines & pharmacy",

    Icon: LocalPharmacyRoundedIcon,

    visual: "medical",

    features: [
      {
        label: "Medicines",
        Icon: MedicationRoundedIcon,
      },
      {
        label: "Orders",
        Icon: ShoppingBagRoundedIcon,
      },
      {
        label: "Invoices",
        Icon: ReceiptLongRoundedIcon,
      },
      {
        label: "Delivery",
        Icon: LocalShippingRoundedIcon,
      },
    ],
  },
];

/* =========================================================
   CONNECTION LINES
========================================================= */

function ConnectionLines() {
  const paths = [
    // TOP LEFT
    "M350 125 C445 125 470 185 535 225",
    // TOP RIGHT
    "M850 125 C755 125 730 185 665 225",
    // BOTTOM LEFT
    "M350 430 C445 430 470 375 535 340",
    // BOTTOM RIGHT
    "M850 430 C755 430 730 375 665 340",
  ];

  // trail: head + 2 peeche wale dots (thoda delay, chhota size, kam opacity)
  const dots = [
    { r: 3.4, delay: 0, opacity: 1 },
    { r: 2.6, delay: 0.16, opacity: 0.5 },
    { r: 1.9, delay: 0.32, opacity: 0.25 },
  ];

  const DURATION = 4.2;
  const SPLINE = "0.45 0 0.55 1"; // smooth ease-in-out

  return (
    <Box
      component="svg"
      viewBox="0 0 1200 550"
      preserveAspectRatio="none"
      sx={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
        display: { xs: "none", lg: "block" },

        /* user ne reduced motion ON kiya ho to dots band */
        "@media (prefers-reduced-motion: reduce)": {
          "& .moving-dot": { display: "none" },
        },
      }}
    >
      <defs>
        {/* LINE GRADIENT */}
        <linearGradient id="ecosystemLine" x1="0" x2="1">
          <stop offset="0%" stopColor={C.primary} stopOpacity=".03" />
          <stop offset="45%" stopColor={C.primary} stopOpacity=".32" />
          <stop offset="55%" stopColor={C.primary} stopOpacity=".32" />
          <stop offset="100%" stopColor={C.primary} stopOpacity=".03" />
        </linearGradient>

        {/* DOT HALO (blur filter ki jagah, ye fast hai) */}
        <radialGradient id="dotHalo">
          <stop offset="0%" stopColor={C.primary} stopOpacity=".45" />
          <stop offset="60%" stopColor={C.primary} stopOpacity=".12" />
          <stop offset="100%" stopColor={C.primary} stopOpacity="0" />
        </radialGradient>
      </defs>

      {paths.map((path, index) => {
        const baseBegin = index * 0.9; // har path ka alag start

        return (
          <React.Fragment key={path}>
            {/* SOFT UNDER LINE */}
            <path
              d={path}
              fill="none"
              stroke="rgba(7,135,106,.025)"
              strokeWidth="9"
              strokeLinecap="round"
            />

            {/* MAIN LINE */}
            <path
              d={path}
              fill="none"
              stroke="url(#ecosystemLine)"
              strokeWidth="1.3"
              strokeLinecap="round"
            />

        {/* ANIMATED ECG DRAWING */}
<path
  d={path}
  fill="none"
  stroke={C.primary}
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeDasharray="12 5 3 5 12 5"
  opacity="0.8"
>
  <animate
    attributeName="stroke-dashoffset"
    from="100"
    to="0"
    dur="2s"
    repeatCount="indefinite"
  />
</path>
          </React.Fragment>
        );
      })}
    </Box>
  );
}

/* =========================================================
   CENTER HUB
========================================================= */

function CenterHub() {
  return (
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10,

        width: 166,
        height: 166,

        display: {
          xs: "none",
          lg: "flex",
        },

        alignItems: "center",
        justifyContent: "center",

        borderRadius: "50%",

        background:
          "linear-gradient(145deg,#FFFFFF 0%,#F5FAF8 100%)",

        border: "1px solid rgba(7,135,106,.13)",

        boxShadow: `
          0 20px 55px rgba(23,32,51,.055),
          0 0 0 10px rgba(7,135,106,.018)
        `,

        "&::before": {
          content: '""',
          position: "absolute",

          inset: -25,

          borderRadius: "50%",

          border:
            "1px dashed rgba(7,135,106,.15)",

          animation:
            "ecosystemRotate 35s linear infinite",
        },

        "&::after": {
          content: '""',
          position: "absolute",

          inset: -46,

          borderRadius: "50%",

          border:
            "1px solid rgba(7,135,106,.04)",
        },

      "@keyframes ecosystemRotate": {
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
},

/* NAYA: ye 2 add karo */
"@keyframes heartbeat": {
  "0%":   { transform: "scale(1)" },
  "14%":  { transform: "scale(1.09)" },
  "28%":  { transform: "scale(1)" },
  "42%":  { transform: "scale(1.06)" },
  "70%":  { transform: "scale(1)" },
  "100%": { transform: "scale(1)" },
},
"@keyframes ecgRipple": {
  "0%":   { transform: "scale(1)",   opacity: 0.35 },
  "100%": { transform: "scale(2.1)", opacity: 0 },
},
      }}
    >
      {/* INNER GLOW */}
{/* HEARTBEAT RIPPLES */}
{[0, 1.6].map((delay) => (
  <Box
    key={delay}
    sx={{
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      border: `1.5px solid ${C.primary}`,
      opacity: 0,
      pointerEvents: "none",
      animation: `ecgRipple 3.2s ease-out ${delay}s infinite`,
      "@media (prefers-reduced-motion: reduce)": { animation: "none" },
    }}
  />
))}
      <Box
        sx={{
          position: "absolute",

          inset: 12,

          borderRadius: "50%",

          background:
            "radial-gradient(circle at 50% 35%, rgba(7,135,106,.06), transparent 67%)",

          pointerEvents: "none",
        }}
      />

      {/* CONTENT */}

      <Stack
        alignItems="center"
        sx={{
          position: "relative",
          zIndex: 4,
          textAlign: "center",
        }}
      >
        {/* JEEVAN DEV LOGO */}

        <Box
          sx={{
            position: "relative",

            width: 58,
            height: 58,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            borderRadius: "17px",

            bgcolor: "#FFFFFF",
animation: "heartbeat 2.4s ease-in-out infinite",
"@media (prefers-reduced-motion: reduce)": { animation: "none" },
            border:
              "1px solid rgba(7,135,106,.10)",

            boxShadow:
              "0 10px 25px rgba(7,135,106,.12)",

            overflow: "hidden",
          }}
        >
          <Image
            src="/img/icon.png"
            alt="Jeevan Dev"
            fill
            sizes="58px"
            style={{
              objectFit: "contain",
              padding: "7px",
            }}
          />
        </Box>

        {/* BRAND NAME */}

        <Typography
          sx={{
            mt: 1.1,

            fontSize: "17px",

            fontWeight: 850,

            lineHeight: 1,

            letterSpacing: "-.04em",

            color: C.text,
          }}
        >
          JEEVAN{" "}

          <Box
            component="span"
            sx={{
              color: C.primary,
            }}
          >
            DEV
          </Box>
        </Typography>

        {/* SUBTEXT */}

        <Typography
          sx={{
            mt: 0.7,

            fontSize: "9px",

            lineHeight: 1.45,

            color: C.muted,

            letterSpacing: ".01em",
          }}
        >
          Connected Healthcare
          <br />
          Ecosystem
        </Typography>
      </Stack>
    </Box>
  );
}
/* =========================================================
   MOBILE / TABLET HUB
========================================================= */

function MobileHub() {
  return (
    <Box
      sx={{
        display: {
          xs: "flex",
          lg: "none",
        },

        alignItems: "center",

        gap: 1.2,

        mb: 2,

        p: 1.2,

        borderRadius: "16px",

        bgcolor:
          "rgba(255,255,255,.92)",

        border:
          `1px solid ${C.border}`,

        boxShadow:
          "0 8px 25px rgba(23,32,51,.035)",
      }}
    >
      {/* ICON */}

      <Box
        sx={{
          width: 41,
          height: 41,

          flexShrink: 0,

          borderRadius: "12px",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          bgcolor: C.primary,

          color: "#FFFFFF",

          boxShadow:
            "0 7px 17px rgba(7,135,106,.16)",
        }}
      >
        <FavoriteRoundedIcon
          sx={{
            fontSize: 19,
          }}
        />
      </Box>

      {/* TEXT */}

      <Box>
        <Typography
          sx={{
            fontSize: "13px",

            fontWeight: 800,

            lineHeight: 1.15,

            color: C.text,
          }}
        >
          JEEVAN{" "}

          <Box
            component="span"
            sx={{
              color: C.primary,
            }}
          >
            DEV
          </Box>
        </Typography>

        <Typography
          sx={{
            mt: 0.25,

            fontSize: "10px",

            color: C.muted,
          }}
        >
          Connected Healthcare Ecosystem
        </Typography>
      </Box>
    </Box>
  );
}

/* =========================================================
   BACKGROUND DECORATION
========================================================= */

function BackgroundDecoration() {
  return (
    <>
      {/* LEFT CURVE */}

      <Box
        sx={{
          position: "absolute",

          left: "-150px",
          top: "42%",

          width: 360,
          height: 360,

          borderRadius: "50%",

          border:
            "1px solid rgba(7,135,106,.045)",

          pointerEvents: "none",
        }}
      />

      {/* RIGHT CURVE */}

      <Box
        sx={{
          position: "absolute",

          right: "-180px",
          top: "18%",

          width: 420,
          height: 420,

          borderRadius: "50%",

          border:
            "1px solid rgba(7,135,106,.045)",

          pointerEvents: "none",
        }}
      />

      {/* SMALL DOT */}

      <Box
        sx={{
          position: "absolute",

          left: "9%",
          top: "26%",

          width: 6,
          height: 6,

          borderRadius: "50%",

          bgcolor:
            "rgba(7,135,106,.10)",

          display: {
            xs: "none",
            md: "block",
          },
        }}
      />

      <Box
        sx={{
          position: "absolute",

          right: "11%",
          bottom: "22%",

          width: 8,
          height: 8,

          borderRadius: "50%",

          bgcolor:
            "rgba(7,135,106,.075)",

          display: {
            xs: "none",
            md: "block",
          },
        }}
      />
    </>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function HealthcareEcosystem() {
  return (
   <Box
  component="section"
  sx={{
    position: "relative",
    overflow: "hidden",

    py: {
      xs: 5,
      sm: 6,
      md: 7,
      lg: 7.5,
    },

    /* =========================================
       SAME GRID BG AS LANDING / HERO
    ========================================= */

    backgroundColor: "#FFFFFF",

    backgroundImage: `
      linear-gradient(
        90deg,
        rgba(7, 135, 106, 0.13) 0%,
        rgba(7, 135, 106, 0.04) 25%,
        rgba(255, 255, 255, 0.96) 45%,
        rgba(255, 255, 255, 0.96) 55%,
        rgba(7, 135, 106, 0.04) 75%,
        rgba(7, 135, 106, 0.13) 100%
      ),

      linear-gradient(
        135deg,
        rgba(7, 135, 106, 0.09) 0%,
        rgba(52, 211, 153, 0.035) 45%,
        rgba(255, 255, 255, 0.08) 100%
      ),

      linear-gradient(
        rgba(7, 135, 106, 0.10) 1px,
        transparent 1px
      ),

      linear-gradient(
        90deg,
        rgba(7, 135, 106, 0.10) 1px,
        transparent 1px
      )
    `,

    backgroundSize: `
      100% 100%,
      40px 40px,
      40px 40px,
      40px 40px
    `,

    backgroundPosition: `
      center,
      0 0,
      0 0,
      0 0
    `,

    /* CENTER ECOSYSTEM GLOW */
    "&::before": {
      content: '""',
      position: "absolute",

      width: 650,
      height: 650,

      left: "50%",
      top: "59%",

      transform: "translate(-50%, -50%)",

      borderRadius: "50%",

      background:
        "radial-gradient(circle, rgba(7,135,106,.055), rgba(7,135,106,.015) 44%, transparent 70%)",

      pointerEvents: "none",
    },

    /* TOP WHITE GLOW */
    "&::after": {
      content: '""',
      position: "absolute",

      width: 700,
      height: 300,

      left: "50%",
      top: "-150px",

      transform: "translateX(-50%)",

      borderRadius: "50%",

      background: "rgba(255,255,255,.65)",

      filter: "blur(80px)",

      pointerEvents: "none",
    },
  }}
>
      {/* BACKGROUND ELEMENTS */}

      <BackgroundDecoration />

      <Container
        maxWidth={false}
        sx={{
          position: "relative",

          zIndex: 2,

          maxWidth: "1440px",

          px: {
            xs: 2,
            sm: 3,
            lg: 4,
          },
        }}
      >
        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <Stack
          alignItems="center"
          textAlign="center"
        >
          {/* BADGE */}

          <Stack
            direction="row"
            alignItems="center"
            spacing={0.8}
            sx={{
              px: 1.4,
              py: 0.6,

              borderRadius: "999px",

              bgcolor:
                "rgba(255,255,255,.82)",

              border:
                `1px solid ${C.border}`,

              boxShadow:
                "0 5px 15px rgba(23,32,51,.025)",
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,

                borderRadius: "50%",

                bgcolor: C.primary,

                boxShadow:
                  "0 0 0 4px rgba(7,135,106,.08)",
              }}
            />

            <Typography
              sx={{
                fontSize: "10px",

                fontWeight: 650,

                letterSpacing: ".01em",

                color: C.muted,
              }}
            >
              Connected Healthcare Ecosystem
            </Typography>
          </Stack>

          {/* TITLE */}

          <Typography
            component="h2"
            sx={{
              mt: 1.7,

              maxWidth: 900,

              fontSize: {
                xs: "28px",
                sm: "35px",
                md: "41px",
              },

              lineHeight: 1.05,

              letterSpacing: "-.045em",

              fontWeight: 850,

              color: C.text,
            }}
          >
            One ecosystem.{" "}

            <Box
              component="span"
              sx={{
                color: C.primary,
              }}
            >
              Every step connected.
            </Box>
          </Typography>

          {/* DESCRIPTION */}

          <Typography
            sx={{
              mt: 1.3,

              maxWidth: 570,

              px: {
                xs: 1,
                sm: 0,
              },

              fontSize: {
                xs: "12px",
                sm: "13px",
              },

              lineHeight: 1.65,

              color: C.muted,
            }}
          >
            Doctors, patients, diagnostic labs and
            medical stores connected through one
            seamless healthcare experience.
          </Typography>
        </Stack>

        {/* =================================================
            MOBILE HUB
        ================================================= */}

        <Box
          sx={{
            mt: {
              xs: 3.5,
              lg: 0,
            },
          }}
        >
          <MobileHub />
        </Box>

        {/* =================================================
            ECOSYSTEM AREA
        ================================================= */}

        <Box
          sx={{
            position: "relative",

            mt: {
              xs: 0,
              md: 2,
              lg: 4.5,
            },

            minHeight: {
              xs: "auto",
              lg: 545,
            },

            display: "grid",

            /* ===============================================
               RESPONSIVE COLUMNS
            =============================================== */

            gridTemplateColumns: {
              xs: "1fr",

              md:
                "repeat(2, minmax(0, 1fr))",

              lg:
                "430px minmax(170px,1fr) 430px",
            },

            /* ===============================================
               DESKTOP ROWS
            =============================================== */

            gridTemplateRows: {
              lg: "240px 240px",
            },

            columnGap: {
              md: 2,
              lg: "80px",
            },

            rowGap: {
              xs: 2,
              md: 2,
              lg: "42px",
            },

            alignItems: "center",
          }}
        >
          {/* CONNECTION LINES */}

          <ConnectionLines />

          {/* CENTER JEEVAN DEV */}

          <CenterHub />

          {/* =================================================
              DOCTOR
          ================================================= */}

          <Box
            sx={{
              position: "relative",

              zIndex: 5,

              minWidth: 0,

              gridColumn: {
                lg: "1",
              },

              gridRow: {
                lg: "1",
              },
            }}
          >
            <EcosystemCard
              {...cards[0]}
            />
          </Box>

          {/* =================================================
              DIAGNOSTIC LAB
          ================================================= */}

          <Box
            sx={{
              position: "relative",

              zIndex: 5,

              minWidth: 0,

              gridColumn: {
                lg: "3",
              },

              gridRow: {
                lg: "1",
              },
            }}
          >
            <EcosystemCard
              {...cards[1]}
            />
          </Box>

          {/* =================================================
              PATIENT
          ================================================= */}

          <Box
            sx={{
              position: "relative",

              zIndex: 5,

              minWidth: 0,

              gridColumn: {
                lg: "1",
              },

              gridRow: {
                lg: "2",
              },
            }}
          >
            <EcosystemCard
              {...cards[2]}
            />
          </Box>

          {/* =================================================
              MEDICAL STORE
          ================================================= */}

          <Box
            sx={{
              position: "relative",

              zIndex: 5,

              minWidth: 0,

              gridColumn: {
                lg: "3",
              },

              gridRow: {
                lg: "2",
              },
            }}
          >
            <EcosystemCard
              {...cards[3]}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}