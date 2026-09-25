"use client";

import { Box, Paper, Typography } from "@mui/material";
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
        height: {
          xs: "auto",
          md: "100%",
        },
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        borderRadius: 0,
        overflow: "hidden",
        border: "none",
       
        px: {
          xs: 3,
          sm: 4,
          md: 4,
        },
        py: {
          xs: 4,
          md: 3,
        },

        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "3px",
          backgroundColor: "primary.main",
        },
      }}
    >
      
        <Box
          sx={{
            width: "100%",
            maxWidth: 350,
            mx: "auto",
          }}
        >
          {icon && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 1.5,
              }}
            >
              <Box
                component="img"
                src={icon}
                alt="Jeevan"
                sx={{
                  width: 68,
                  height: 68,
                  objectFit: "contain",
                }}
              />
            </Box>
          )}

          {title && (
            <Typography
              sx={{
                textAlign: "center",
                fontSize: {
                  xs: "22px",
                  md: "24px",
                },
                lineHeight: 1.25,
                fontWeight: 700,
                color: "primary.main",
                letterSpacing: "-0.4px",
              }}
            >
              {title}
            </Typography>
          )}

          {subtitle && (
            <Typography
              sx={{
                mt: 0.7,
                mb: 3,
                textAlign: "center",
                fontSize: "12.5px",
                lineHeight: 1.5,
                fontWeight: 400,
                color: "text.secondary",
              }}
            >
              {subtitle}
            </Typography>
          )}

          <Box
            sx={{
              width: "100%",
              color: "text.primary",
            }}
          >
            {children}
          </Box>
        </Box>
      
    </Paper>
  );
}