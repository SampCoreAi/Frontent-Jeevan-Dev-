"use client";

import { Box, Paper, Typography, Avatar, Fade } from "@mui/material";
import { motion } from "framer-motion";

export default function AuthCard({
  children,
  title,
  subtitle,
  icon,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: {
          xs: "100%",
          md: "50%",
        },

        // GLOBAL THEME
        backgroundColor: "background.paper",

        display: "flex",
        py: 3,
        flexDirection: "column",
        justifyContent: "center",

        position: "relative",
        borderRadius: 0,
        overflow: "hidden",

        border: "1px solid",
        borderColor: "divider",

        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",

        // TOP GREEN LINE
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "4px",

          backgroundColor: "primary.main",

          zIndex: 1,
        },

        // BOTTOM GREEN LINE
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "4px",

          backgroundColor: "primary.main",

          zIndex: 1,
        },
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",

            width: "100%",
            maxWidth: 400,

            mx: "auto",
            px: 2,
          }}
        >
          {/* =========================
              ICON / LOGO
          ========================= */}

          {icon && (
            <motion.div
              initial={{
                scale: 0,
              }}
              animate={{
                scale: 1,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
            >
              <Avatar
                src={icon}
                sx={{
                  width: 100,
                  height: 100,

                  borderRadius: 4,

                  mx: "auto",
                  mb: 2,

                  border: "3px solid",
                  borderColor: "primary.main",

                  backgroundColor: "background.paper",

                  boxShadow:
                    "0 8px 32px rgba(7, 135, 106, 0.20)",

                  transition: "transform 0.3s ease",

                  "&:hover": {
                    transform: "scale(1.05) rotate(-5deg)",
                  },
                }}
              />
            </motion.div>
          )}

          {/* =========================
              TITLE
          ========================= */}

          {title && (
            <Typography
              variant="h4"
              fontWeight={800}
              textAlign="center"
              mb={1}
              sx={{
                fontSize: {
                  xs: "1.75rem",
                  sm: "2rem",
                },

                letterSpacing: "-0.5px",

                // FROM GLOBAL THEME
                color: "primary.main",
              }}
            >
              {title}
            </Typography>
          )}

          {/* =========================
              SUBTITLE
          ========================= */}

          {subtitle && (
            <Typography
              variant="body1"
              textAlign="center"
              mb={4}
              sx={{
                color: "text.secondary",

                fontSize: "0.95rem",

                maxWidth: "100%",
                mx: "auto",
              }}
            >
              {subtitle}
            </Typography>
          )}

          {/* =========================
              FORM CONTENT
          ========================= */}

          <Fade in timeout={600}>
            <Box
              sx={{
                width: "100%",
                color: "text.primary",
              }}
            >
              {children}
            </Box>
          </Fade>
        </Box>
      </motion.div>
    </Paper>
  );
}