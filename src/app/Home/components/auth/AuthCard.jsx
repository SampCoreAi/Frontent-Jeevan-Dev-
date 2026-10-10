"use client";

import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

export default function AuthCard({
  children,
  title,
  subtitle,
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

        boxSizing: "border-box",

        bgcolor: "#FFFFFF",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",

        position: "relative",
        overflow: "hidden",

        borderRadius: 0,
        border: "none",

        px: {
          xs: 2.5,
          sm: 4,
          md: 4,
          lg: 5,
        },

        py: {
          xs: 4,
          md: 2.5,
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "455px",
          mx: "auto",
        }}
      >
        {/* TITLE */}

        {title && (
          <Typography
            component="h1"
            sx={{
              textAlign: "center",

              fontSize: {
                xs: "23px",
                md: "26px",
              },

              lineHeight: 1.15,

              fontWeight: 700,

              color: "primary.main",

              letterSpacing: "-0.5px",
            }}
          >
            {title}
          </Typography>
        )}

        {/* SUBTITLE */}

        {subtitle && (
          <Typography
            sx={{
              mt: 0.7,
              mb: 2.2,

              textAlign: "center",

              fontSize: "12.5px",
              lineHeight: 1.45,

              fontWeight: 400,

              color: "text.secondary",
            }}
          >
            {subtitle}
          </Typography>
        )}

        {/* FORM / CHILD CONTENT */}

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