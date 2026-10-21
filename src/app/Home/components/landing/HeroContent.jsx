"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { keyframes } from "@mui/system";

const words = [
  "doctor",
  "specialist",
  "dentist",
  "cardiologist",
  "pediatrician",
  "dermatologist",
];

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const wordIn = keyframes`
  from { opacity: 0; filter: blur(8px); transform: translate(-50%, 8px); }
  to { opacity: 1; filter: blur(0); transform: translate(-50%, 0); }
`;

const wordOut = keyframes`
  from { opacity: 1; filter: blur(0); transform: translate(-50%, 0); }
  to { opacity: 0; filter: blur(8px); transform: translate(-50%, -8px); }
`;

function MorphWord() {
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState(null);
  const [width, setWidth] = useState(0);
  const measureRefs = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => {
        setPrevious(current);
        return (current + 1) % words.length;
      });
    }, 2600);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (previous === null) return;

    const timer = setTimeout(() => setPrevious(null), 500);
    return () => clearTimeout(timer);
  }, [previous]);

  useLayoutEffect(() => {
    const measure = () => {
      const element = measureRefs.current[index];
      if (element) setWidth(element.offsetWidth);
    };

    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready?.then(measure);

    return () => window.removeEventListener("resize", measure);
  }, [index]);

  const layerSx = {
    position: "absolute",
    top: 0,
    left: "50%",
    whiteSpace: "nowrap",
    lineHeight: "inherit",
  };

  return (
    <Box
      component="span"
      aria-live="polite"
      sx={{
        position: "relative",
        display: "inline-block",
        width: width ? `${width}px` : "auto",
        height: "1em",
        verticalAlign: "top",
        transition: "width 0.45s ease",
        whiteSpace: "nowrap",
      }}
    >
      {words.map((word, i) => (
        <Box
          key={word}
          ref={(element) => (measureRefs.current[i] = element)}
          component="span"
          aria-hidden="true"
          sx={{
            position: "absolute",
            visibility: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {word}
        </Box>
      ))}

      {previous !== null && (
        <Box
          key={`out-${previous}-${index}`}
          component="span"
          aria-hidden="true"
          sx={{ ...layerSx, animation: `${wordOut} 0.45s ease forwards` }}
        >
          {words[previous]}
        </Box>
      )}

      <Box
        key={`in-${index}`}
        component="span"
        sx={{ ...layerSx, animation: `${wordIn} 0.45s ease forwards` }}
      >
        {words[index]}
      </Box>
    </Box>
  );
}

function HeroImage({ src, alt, sx = {} }) {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      aria-hidden="true"
      sx={{
        position: "absolute",
        objectFit: "contain",
        pointerEvents: "none",
        ...sx,
      }}
    />
  );
}

export default function HeroContent() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        pt: { xs: 5, md: 5 },
        pb: { xs: 3, md: 4 },
        textAlign: "center",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <HeroImage
        src="/img/LandingYoung.png"
        alt=""
        sx={{
          width: { md: 150, lg: 160 },
          height: { md: 250, lg: 285 },
          left: { md: 0, lg: 0 },
          top: { md: 95, lg: 90 },
          display: { xs: "none", md: "block" },
        }}
      />

      <HeroImage
        src="/img/LandingFriendly.png"
        alt=""
        sx={{
          width: { md: 150, lg: 160 },
          height: { md: 250, lg: 285 },
          right: { md: 0, lg: 0 },
          top: { md: 95, lg: 90 },
          display: { xs: "none", md: "block" },
        }}
      />

        

      <Box
  sx={{
    position: "relative",
    zIndex: 1,
    display: "inline-flex",
    alignItems: "center",
    gap: 1.25,
    height: 42,
    px: 1.75,
    mb: { xs: 3, md: 3.5 },
    bgcolor: "#FFFFFF",
    border: "1px solid #D7EEE8",
    borderRadius: "999px",
    boxShadow: "0 4px 14px rgba(7, 135, 106, 0.08)",
    animation: `${fadeUp} 0.45s ease both`,
  }}
>
  <Box
    sx={{
      width: 8,
      height: 8,
      flexShrink: 0,
      borderRadius: "50%",
      bgcolor: "#26B992",
      boxShadow: "0 0 0 4px #E8F8F3",
    }}
  />

  <Typography
    component="span"
    sx={{
      fontSize: { xs: 11, sm: 12 },
      fontWeight: 600,
      color: "#53645F",
      whiteSpace: "nowrap",
    }}
  >
    <Box component="span" sx={{ color: "#07876A", fontWeight: 800 }}>
      500+
    </Box>{" "}
    doctors available now
  </Typography>

  <Box
    sx={{
      display: "grid",
      placeItems: "center",
      width: 25,
      height: 25,
      ml: 0.25,
      borderRadius: "50%",
      bgcolor: "#EFF9F6",
      color: "#07876A",
    }}
  >
    <ArrowForwardIcon sx={{ fontSize: 15 }} />
  </Box>
</Box>

      <Typography
        component="h1"
        sx={{
          position: "relative",
          zIndex: 1,
          m: 0,
          color: "#172033",
          fontWeight: 700,
          fontSize: "clamp(38px, 4.5vw, 68px)",
          lineHeight: 1.1,
          letterSpacing: { xs: "-1.5px", md: "-2.5px" },
        }}
      >
        <Box component="span" sx={{ display: "block" }}>
          Better care starts with the
        </Box>

        <Box
          component="span"
          sx={{
            position: "relative",
            display: "inline-block",
            mt: 0.5,
            color: "#07876A",
            fontWeight: 400,
            whiteSpace: "nowrap",
          }}
        >
          right <MorphWord />.
        
        </Box>
      </Typography>

      <Typography
        component="p"
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 720,
          mx: "auto",
          mt: { xs: 2.5, md: 3.5 },
          mb: 0,
          px: 1,
          color: "#66748A",
          fontSize: { xs: 13, sm: 14, md: 15 },
          lineHeight: 1.7,
          animation: `${fadeUp} 0.6s ease 0.1s both`,
        }}
      >
        Discover verified doctors and specialists near you. Search, compare and
        book the right care in just 
      </Typography>
    </Box>
  );
}
