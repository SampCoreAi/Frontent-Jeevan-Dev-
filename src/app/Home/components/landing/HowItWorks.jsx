"use client";

/**
 * HowItWorks.jsx
 * "Get Healthcare in Minutes — How It Works"
 * Stack: Next.js (App Router, client component) + MUI v5 + Framer Motion
 *
 * npm install @mui/material @emotion/react @emotion/styled framer-motion
 */

import { useRef, useEffect } from "react";
import { Box, Container, Typography, Stack } from "@mui/material";
import { motion, useInView, useAnimation } from "framer-motion";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";

// ---- design tokens -------------------------------------------------
const colors = {
  bg: "#FAFAF8",
  ink: "#16231F",
  inkMuted: "#5B7C78",
  teal: "#0F5257",
  tealLine: "#0F6E56",
  mint: "#E1F5EE",
  coral: "#FF6B5B",
  coralDeep: "#D85A30",
  line: "#DCEAE6",
};

const steps = [
  {
    icon: SearchRoundedIcon,
    label: "step 01",
    title: "Search doctor",
    desc: "Filter by specialty, symptom, location, or language and see who's free today.",
  },
  {
    icon: CalendarMonthRoundedIcon,
    label: "step 02",
    title: "Select date & time",
    desc: "Pick an open slot from real-time availability — no back-and-forth calls.",
  },
  {
    icon: FactCheckRoundedIcon,
    label: "step 03",
    title: "Book appointment",
    desc: "Confirm details and reserve your slot in one tap. Get an instant confirmation.",
  },
  {
    icon: VideocamRoundedIcon,
    label: "step 04",
    title: "Visit or connect",
    desc: "Walk in, or join a secure video call from wherever you are.",
  },
];

// ---- gentle continuous float for each illustration -------------------
function FloatingIcon({ children, delay = 0 }) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay }}
      style={{ width: 72, height: 72 }}
    >
      {children}
    </motion.div>
  );
}

// ---- a dot that loops along the connecting line, once cards are in view
function TravelingPulse({ inView }) {
  const controls = useAnimation();

  useEffect(() => {
    if (!inView) return;

    controls.start({
      left: ["12.5%", "37.5%", "62.5%", "87.5%", "12.5%"],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });
  }, [inView, controls]);

  return (
    <motion.div
      animate={controls}
      style={{
        position: "absolute",
        top: -4,
        left: "12.5%",
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: colors.coral,
        boxShadow: `0 0 0 4px ${colors.coral}22`,
        transform: "translateX(-50%)",
      }}
    />
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Box
      component="section"
      ref={ref}
      sx={{
        py: { xs: 6, md: 8 },
        px: { xs: 1.5, md: 2 },
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {/* Gradient */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, #dcfce7 0%, #ecfdf5 45%, #ffffff 100%)",
          }}
        />

        {/* Large Grid - Mobile Responsive */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: { xs: 0.1, md: 0.18 },
            backgroundImage: `
              linear-gradient(to right,#16a34a 1px,transparent 1px),
              linear-gradient(to bottom,#16a34a 1px,transparent 1px)
            `,
            backgroundSize: { xs: "30px 30px", md: "60px 60px" },
          }}
        />

        {/* Small Grid - Mobile Responsive */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: { xs: 0.05, md: 0.08 },
            backgroundImage: `
              linear-gradient(to right,#15803d 1px,transparent 1px),
              linear-gradient(to bottom,#15803d 1px,transparent 1px)
            `,
            backgroundSize: { xs: "10px 10px", md: "20px 20px" },
          }}
        />

        {/* Radial Fade */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at center, transparent 0%, rgba(255,255,255,.3) 50%, rgba(255,255,255,.9) 100%)",
          }}
        />
      </Box>

      {/* Soft decorative blobs - Hide on mobile */}
      <Box
        sx={{
          position: "absolute",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: `${colors.teal}0F`,
          top: -80,
          left: -60,
          display: { xs: "none", md: "block" },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: `${colors.coral}0F`,
          bottom: -50,
          right: -30,
          display: { xs: "none", md: "block" },
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", px: { xs: 1, md: 2 } }}>
        {/* Eyebrow + heading */}
        <Stack 
          spacing={{ xs: 1, md: 1.5 }} 
          alignItems="center" 
          textAlign="center" 
          sx={{ mb: { xs: 5, md: 9 } }}
        >
          <Typography
            sx={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: { xs: 10, md: 12 },
              fontWeight: "bold",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: colors.teal,
            }}
          >
            Get healthcare in minutes
          </Typography>

          {/* Decorative lines - Mobile responsive */}
          <Box sx={{ width: { xs: "50%", md: "40%" }, height: 1, bgcolor: "#1e6658", borderRadius: "50%", opacity: 0.5 }} />

          <Box sx={{ inline: "block", mb: { xs: 0.5, md: 1 } }}>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "2.5rem", sm: "3rem", md: "4.5rem" },
                fontWeight: 900,
                letterSpacing: "-0.025em",
                lineHeight: 0.9,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: { xs: 0.5, md: 1 },
              }}
            >
              <span style={{ color: "#1e6658" }}>HOW IT</span>
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: '2px #1e6658',
                  MozTextStroke: '2px #1e6658',
                }}
              >
                WORKS
              </span>
            </Typography>
          </Box>

          <Box sx={{ width: { xs: "60%", md: "35%" }, height: 1, bgcolor: "#1e6658", borderRadius: "50%", opacity: 0.5 }} />

          <Typography 
            sx={{ 
              color: colors.inkMuted, 
              maxWidth: { xs: "100%", md: 480 }, 
              fontSize: { xs: 13, md: 15 },
              px: { xs: 2, md: 0 }
            }}
          >
            Four steps between you and the right doctor — search, schedule, book, and show up
            your way.
          </Typography>
        </Stack>

        {/* Path + steps */}
        <Box sx={{ position: "relative" }}>
          {/* connecting line + traveling pulse — desktop only */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              top: 34,
              left: 0,
              right: 0,
              height: 2,
              zIndex: 0,
            }}
          >
            <Box sx={{ position: "absolute", left: "12.5%", right: "12.5%", top: 0, height: 2, bgcolor: colors.line }} />
            <motion.div
              style={{
                position: "absolute",
                left: "12.5%",
                right: "12.5%",
                top: 0,
                height: 2,
                background: `linear-gradient(90deg, ${colors.teal}, ${colors.coral})`,
                transformOrigin: "left",
              }}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            />
            <TravelingPulse inView={inView} />
          </Box>

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gridTemplateColumns: { 
                xs: "1fr", 
                sm: "1fr 1fr", 
                md: "repeat(4, 1fr)" 
              },
              gap: { xs: 3, sm: 3, md: 3 },
            }}
          >
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  whileHover={{ y: -6 }}
                  style={{ cursor: "default" }}
                >
                  <Stack 
                    alignItems={{ xs: "center", md: "center" }} 
                    spacing={{ xs: 1.5, md: 1.5 }}
                    sx={{
                      textAlign: { xs: "center", md: "center" },
                      px: { xs: 1, md: 0 },
                    }}
                  >
                    {/* Icon Container - Mobile Responsive */}
                    <Box
                      sx={{
                        width: { xs: 60, md: 68 },
                        height: { xs: 60, md: 68 },
                        borderRadius: "50%",
                        bgcolor: colors.mint,
                        border: `1.5px solid ${colors.teal}33`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "none",
                        flexShrink: 0,
                      }}
                    >
                      <Icon 
                        sx={{ 
                          fontSize: { xs: 24, md: 28 }, 
                          color: colors.teal 
                        }} 
                      />
                    </Box>

                    {/* Text Content - Mobile Responsive */}
                    <Stack
                      spacing={0.5}
                      alignItems={{ xs: "center", md: "center" }}
                      textAlign={{ xs: "center", md: "center" }}
                      sx={{ width: "100%" }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: { xs: 10, md: 11 },
                          letterSpacing: "0.1em",
                          color: colors.coralDeep,
                          fontWeight: 600,
                        }}
                      >
                        {step.label}
                      </Typography>
                      
                      <Typography
                        sx={{
                          fontFamily: "'Sora', sans-serif",
                          fontWeight: 700,
                          fontSize: { xs: 16, md: 18 },
                          color: colors.ink,
                          lineHeight: 1.2,
                        }}
                      >
                        {step.title}
                      </Typography>
                      
                      <Typography 
                        sx={{ 
                          fontSize: { xs: 12.5, md: 13.5 }, 
                          color: colors.inkMuted, 
                          maxWidth: { xs: "100%", md: 220 },
                          lineHeight: 1.5,
                          px: { xs: 2, md: 0 },
                        }}
                      >
                        {step.desc}
                      </Typography>
                    </Stack>
                  </Stack>
                </motion.div>
              );
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}