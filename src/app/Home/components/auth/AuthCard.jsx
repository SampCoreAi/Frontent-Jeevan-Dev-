"use client";

import { Box, Paper, Typography } from "@mui/material";

export default function AuthCard({
  children,
  title,
  subtitle,
  onGoogleLogin,
  showGoogleLogin = true,
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

        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "3px",
          bgcolor: "primary.main",
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

        <Box
          sx={{
            width: "100%",
            color: "text.primary",
          }}
        >
          {children}
        </Box>

        {showGoogleLogin && (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",

                gap: 1.4,

                my: 1.7,
              }}
            >
              <Box
                sx={{
                  height: "1px",
                  bgcolor: "#E2E8E5",
                  flex: 1,
                }}
              />

              <Typography
                sx={{
                  fontSize: "10px",
                  fontWeight: 600,

                  color: "#98A29E",

                  letterSpacing: "0.45px",
                  whiteSpace: "nowrap",
                }}
              >
                OR CONTINUE WITH
              </Typography>

              <Box
                sx={{
                  height: "1px",
                  bgcolor: "#E2E8E5",
                  flex: 1,
                }}
              />
            </Box>

            <Box
              component="button"
              type="button"
              onClick={onGoogleLogin}
              sx={{
                width: "100%",
                height: "46px",

                p: 0,

                border: "1px solid #D8E0DD",
                borderRadius: "9px",

                bgcolor: "#FFFFFF",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                gap: "10px",

                cursor: "pointer",

                fontFamily: "inherit",

                transition: "all 0.2s ease",

                "&:hover": {
                  bgcolor: "#F8FBFA",

                  borderColor: "#BFCFC9",

                  boxShadow:
                    "0 4px 12px rgba(23,32,51,0.05)",
                },

                "&:active": {
                  transform: "scale(0.995)",
                },
              }}
            >
              <Box
                component="svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
                sx={{
                  width: "18px",
                  height: "18px",
                  flexShrink: 0,
                }}
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.27c0-.64-.06-1.25-.16-1.84H12v3.48h5.25a4.49 4.49 0 0 1-1.95 2.94v2.26h3.16c1.85-1.7 2.89-4.21 2.89-6.84Z"
                />

                <path
                  fill="#34A853"
                  d="M12 21.8c2.64 0 4.86-.87 6.48-2.37l-3.16-2.26c-.88.59-2 .94-3.32.94-2.55 0-4.71-1.72-5.49-4.04H3.25v2.33A9.8 9.8 0 0 0 12 21.8Z"
                />

                <path
                  fill="#FBBC05"
                  d="M6.51 14.07A5.9 5.9 0 0 1 6.2 12c0-.72.12-1.42.31-2.07V7.6H3.25A9.8 9.8 0 0 0 2.2 12c0 1.58.38 3.08 1.05 4.4l3.26-2.33Z"
                />

                <path
                  fill="#EA4335"
                  d="M12 5.89c1.44 0 2.73.49 3.75 1.46l2.81-2.81A9.43 9.43 0 0 0 12 2.2a9.8 9.8 0 0 0-8.75 5.4l3.26 2.33C7.29 7.61 9.45 5.89 12 5.89Z"
                />
              </Box>

              <Typography
                component="span"
                sx={{
                  fontSize: "12.5px",
                  fontWeight: 600,

                  lineHeight: 1,

                  color: "#344054",
                }}
              >
                Continue with Google
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Paper>
  );
}