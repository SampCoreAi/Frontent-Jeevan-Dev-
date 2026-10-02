"use client";

/**
 * HowItWorks.jsx
 * "Get Healthcare in Minutes — How It Works"
 * Next.js + MUI + Framer Motion
 */

import { useRef, useEffect } from "react";
import { Box, Container, Typography, Stack } from "@mui/material";
import { motion, useInView, useAnimation } from "framer-motion";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";

// ========================================
// DESIGN TOKENS
// ========================================

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

// ========================================
// STEPS
// ========================================

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

// ========================================
// FLOATING ICON
// ========================================

function FloatingIcon({ children, delay = 0 }) {
  return (
    <motion.div
      animate={{
        y: [0, -6, 0],
      }}
      transition={{
        duration: 3.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      style={{
        width: 72,
        height: 72,
      }}
    >
      {children}
    </motion.div>
  );
}

// ========================================
// TRAVELLING DOT
// ========================================

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

// ========================================
// CARD ANIMATION
// ========================================

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },

  visible: (i) => ({
    opacity: 1,
    y: 0,

    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

// ========================================
// MAIN COMPONENT
// ========================================

export default function HowItWorks() {
  const ref = useRef(null);

  const inView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  return (
    <Box
      component="section"
      ref={ref}
      sx={{
      

        px: {
          xs: 1.5,
          md: 2,
        },

        position: "relative",
        overflow: "hidden",

       py: {
  xs: 5,
  md: 6,
},
      }}
    >
      {/* ========================================
          SAME BACKGROUND AS LANDING HERO
      ======================================== */}

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",

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
        }}
      />

      {/* ========================================
          CONTENT
      ======================================== */}

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,

          px: {
            xs: 1,
            md: 2,
          },
        }}
      >
        {/* ========================================
            HEADING
        ======================================== */}

        <Stack
          spacing={{
            xs: 1,
            md: 1.5,
          }}
          alignItems="center"
          textAlign="center"
          sx={{
            mb: {
              xs: 5,
              md: 9,
            },
          }}
        >
          {/* SMALL LABEL */}

          <Typography
            sx={{
              fontFamily: "'IBM Plex Mono', monospace",

              fontSize: {
                xs: 10,
                md: 12,
              },

              fontWeight: "bold",

              letterSpacing: "0.14em",

              textTransform: "uppercase",

              color: colors.teal,
            }}
          >
            Get healthcare in minutes
          </Typography>

          {/* TOP LINE */}

          <Box
            sx={{
              width: {
                xs: "50%",
                md: "40%",
              },

              height: 1,

              bgcolor: "#1e6658",

              borderRadius: "50%",

              opacity: 0.5,
            }}
          />

          {/* TITLE */}

          <Box
            sx={{
              display: "inline-block",

              mb: {
                xs: 0.5,
                md: 1,
              },
            }}
          >
            <Typography
              component="h2"
              sx={{
                fontSize: {
                  xs: "32px",
                  sm: "38px",
                  md: "48px",
                },

                fontWeight: 900,

                letterSpacing: "-0.025em",

                lineHeight: 0.95,

                display: "flex",

                flexWrap: "wrap",

                justifyContent: "center",

                gap: {
                  xs: 0.5,
                  md: 1,
                },
              }}
            >
              <span
                style={{
                  color: "#1e6658",
                }}
              >
                HOW IT
              </span>

              <span
                style={{
                  color: "transparent",

                  WebkitTextStroke: "2px #1e6658",

                  MozTextStroke: "2px #1e6658",
                }}
              >
                WORKS
              </span>
            </Typography>
          </Box>

          {/* BOTTOM LINE */}

          <Box
            sx={{
              width: {
                xs: "60%",
                md: "35%",
              },

              height: 1,

              bgcolor: "#1e6658",

              borderRadius: "50%",

              opacity: 0.5,
            }}
          />

          {/* DESCRIPTION */}

          <Typography
            sx={{
              color: colors.inkMuted,

              maxWidth: {
                xs: "100%",
                md: 480,
              },

              fontSize: "13px",

              lineHeight: 1.7,

              px: {
                xs: 2,
                md: 0,
              },
            }}
          >
            Four steps between you and the right doctor — search, schedule,
            book, and show up your way.
          </Typography>
        </Stack>

        {/* ========================================
            STEPS
        ======================================== */}

        <Box
          sx={{
            position: "relative",
          }}
        >
          {/* ========================================
              CONNECTING LINE
              Desktop only
          ======================================== */}

          <Box
            sx={{
              display: {
                xs: "none",
                md: "block",
              },

              position: "absolute",

              top: 34,

              left: 0,
              right: 0,

              height: 2,

              zIndex: 0,
            }}
          >
            {/* BASE LINE */}

            <Box
              sx={{
                position: "absolute",

                left: "12.5%",
                right: "12.5%",

                top: 0,

                height: 2,

                bgcolor: colors.line,
              }}
            />

            {/* ANIMATED LINE */}

            <motion.div
              style={{
                position: "absolute",

                left: "12.5%",
                right: "12.5%",

                top: 0,

                height: 2,

                background: `linear-gradient(
                  90deg,
                  ${colors.teal},
                  ${colors.coral}
                )`,

                transformOrigin: "left",
              }}
              initial={{
                scaleX: 0,
              }}
              animate={
                inView
                  ? {
                      scaleX: 1,
                    }
                  : {
                      scaleX: 0,
                    }
              }
              transition={{
                duration: 1.1,

                ease: [0.22, 1, 0.36, 1],

                delay: 0.2,
              }}
            />

            <TravelingPulse inView={inView} />
          </Box>

          {/* ========================================
              STEP GRID
          ======================================== */}

          <Box
            sx={{
              position: "relative",

              zIndex: 1,

              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(4, 1fr)",
              },

              gap: {
                xs: 3,
                sm: 3,
                md: 3,
              },
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
                  whileHover={{
                    y: -6,
                  }}
                  style={{
                    cursor: "default",
                  }}
                >
                  <Stack
                    alignItems="center"
                    spacing={{
                      xs: 1.5,
                      md: 1.5,
                    }}
                    sx={{
                      textAlign: "center",

                      px: {
                        xs: 1,
                        md: 0,
                      },
                    }}
                  >
                    {/* ICON */}

                    <FloatingIcon delay={i * 0.2}>
                      <Box
                        sx={{
                          width: {
                            xs: 60,
                            md: 68,
                          },

                          height: {
                            xs: 60,
                            md: 68,
                          },

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
                            fontSize: {
                              xs: 24,
                              md: 28,
                            },

                            color: colors.teal,
                          }}
                        />
                      </Box>
                    </FloatingIcon>

                    {/* TEXT */}

                    <Stack
                      spacing={0.5}
                      alignItems="center"
                      textAlign="center"
                      sx={{
                        width: "100%",
                      }}
                    >
                      {/* STEP NUMBER */}

                      <Typography
                        sx={{
                          fontFamily: "'IBM Plex Mono', monospace",

                          fontSize: {
                            xs: 10,
                            md: 11,
                          },

                          letterSpacing: "0.1em",

                          color: colors.coralDeep,

                          fontWeight: 600,
                        }}
                      >
                        {step.label}
                      </Typography>

                      {/* STEP TITLE */}

                      <Typography
                        sx={{
                          fontFamily: "'Sora', sans-serif",

                          fontWeight: 700,

                          fontSize: {
                            xs: 16,
                            md: 18,
                          },

                          color: colors.ink,

                          lineHeight: 1.2,
                        }}
                      >
                        {step.title}
                      </Typography>

                      {/* DESCRIPTION */}

                      <Typography
                        sx={{
                          fontSize: {
                            xs: 12.5,
                            md: 13.5,
                          },

                          color: colors.inkMuted,

                          maxWidth: {
                            xs: "100%",
                            md: 220,
                          },

                          lineHeight: 1.5,

                          px: {
                            xs: 2,
                            md: 0,
                          },
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