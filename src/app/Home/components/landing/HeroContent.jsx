"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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

const morphIn = keyframes`
  from {
    opacity: 0;
    filter: blur(10px);
    transform: translateX(-50%) scale(0.9);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: translateX(-50%) scale(1);
  }
`;

const morphOut = keyframes`
  from {
    opacity: 1;
    filter: blur(0);
    transform: translateX(-50%) scale(1);
  }
  to {
    opacity: 0;
    filter: blur(10px);
    transform: translateX(-50%) scale(1.08);
  }
`;

const MEDICAL_WORDS = [
  "doctor",
  "specialist",
  "dentist",
  "cardiologist",
  "pediatrician",
  "dermatologist",
  "physician",
  "therapist",
];

/**
 * Text morph: ek word se dusre word me blur-fade hota hai,
 * aur width smoothly change hoti hai (center preserve rehta hai).
 */
function MorphWord({ words = MEDICAL_WORDS, interval = 2600 }) {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [width, setWidth] = useState(0);
  const measureRefs = useRef([]);

  // Word cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => {
        setPrevIndex(current);
        return (current + 1) % words.length;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  // Purana word hatao animation ke baad
  useEffect(() => {
    if (prevIndex === null) return;
    const t = setTimeout(() => setPrevIndex(null), 600);
    return () => clearTimeout(t);
  }, [prevIndex]);

  // Width measure (current word ke hisaab se)
  useLayoutEffect(() => {
    const measure = () => {
      const el = measureRefs.current[index];
      if (el) setWidth(el.offsetWidth);
    };

    measure();
    window.addEventListener("resize", measure);

    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }

    return () => window.removeEventListener("resize", measure);
  }, [index, words]);

 const layerSx = {
  position: "absolute",
  top: 0,
  left: "50%",
  whiteSpace: "nowrap",
  lineHeight: "inherit",   // ← ye add karo
  willChange: "transform, opacity, filter",
};

  return (
    <Box
  component="span"
  aria-live="polite"
  sx={{
    position: "relative",
    display: "inline-block",
    verticalAlign: "top",          // bottom → top
    height: "1.03em",              // h1 ke lineHeight ke barabar
    lineHeight: "inherit",         // h1 ka lineHeight inherit ho
    width: width ? `${width}px` : "auto",
    transition: "width 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
    whiteSpace: "nowrap",
  }}
>
      {/* Hidden spans: width measure karne ke liye */}
      {words.map((word, i) => (
        <Box
          key={word}
          component="span"
          ref={(el) => (measureRefs.current[i] = el)}
          aria-hidden="true"
        sx={{
  position: "absolute",
  visibility: "hidden",
  pointerEvents: "none",
  whiteSpace: "nowrap",
  lineHeight: "inherit",
}}
        >
          {word}
        </Box>
      ))}

      {/* Purana word (bahar jaata hua) */}
      {prevIndex !== null && (
        <Box
          key={`out-${prevIndex}-${index}`}
          component="span"
          aria-hidden="true"
          sx={{
            ...layerSx,
            animation: `${morphOut} 0.5s ease forwards`,
          }}
        >
          {words[prevIndex]}
        </Box>
      )}

      {/* Naya word (andar aata hua) */}
      <Box
        key={`in-${index}`}
        component="span"
        sx={{
          ...layerSx,
          animation: `${morphIn} 0.55s ease forwards`,
        }}
      >
        {words[index]}
      </Box>
    </Box>
  );
}

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
          fontWeight: 400,
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
        <Box
          component="span"
          sx={{
            display: "block",
            fontWeight: 700,
            letterSpacing: "-2.8px",
          }}
        >
          Better care starts with the
        </Box>

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
              whiteSpace: "nowrap",
            }}
          >
            right <MorphWord />.
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
        book the right care in{" "}
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