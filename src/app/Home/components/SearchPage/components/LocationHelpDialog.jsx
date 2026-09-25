"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

const PRIMARY = "#07876A";
const PRIMARY_LIGHT = "#EAF7F3";

export default function LocationHelpDialog({
  open,
  onClose,
  onRetry,
}) {
  const handleRetry = () => {
    onClose();
    onRetry();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          width: {
            xs: "calc(100% - 24px)",
            sm: 430,
          },

          maxWidth: 430,

          maxHeight: {
            xs: "92vh",
            sm: "88vh",
          },

          m: {
            xs: 1.5,
            sm: 2,
          },

          borderRadius: {
            xs: 2.5,
            sm: 3,
          },

          overflow: "hidden",

          boxShadow:
            "0 20px 55px rgba(15, 23, 42, 0.20)",
        },
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <DialogTitle
        sx={{
          p: 0,
          borderBottom: "1px solid #E8EEEB",
          bgcolor: "#FFFFFF",
        }}
      >
        <Box
          sx={{
            position: "relative",

            display: "flex",
            alignItems: "center",

            gap: 1.2,

            px: {
              xs: 1.75,
              sm: 2.25,
            },

            py: 1.7,

            pr: 6,
          }}
        >
          {/* ICON */}

          <Box
            sx={{
              width: 40,
              height: 40,

              flexShrink: 0,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              borderRadius: 2,

              bgcolor: PRIMARY_LIGHT,
              color: PRIMARY,
            }}
          >
            <LocationOnRoundedIcon
              sx={{
                fontSize: 22,
              }}
            />
          </Box>

          {/* TEXT */}

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: {
                  xs: "15px",
                  sm: "16px",
                },

                fontWeight: 700,

                lineHeight: 1.3,

                color: "#172033",
              }}
            >
              Turn On Location Access
            </Typography>

            <Typography
              sx={{
                mt: 0.2,

                fontSize: "10.5px",

                lineHeight: 1.4,

                color: "#667085",
              }}
            >
              Allow location to find doctors near you.
            </Typography>
          </Box>

          {/* CLOSE ICON */}

          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              position: "absolute",

              right: 13,
              top: 13,

              width: 29,
              height: 29,

              bgcolor: "#F4F6F5",
              color: "#667085",

              "&:hover": {
                bgcolor: "#E8ECEA",
              },
            }}
          >
            <CloseRoundedIcon
              sx={{
                fontSize: 17,
              }}
            />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* =====================================================
          SCROLLABLE CONTENT
      ===================================================== */}

      <DialogContent
        sx={{
          px: {
            xs: 1.5,
            sm: 2.25,
          },

          py: "16px !important",

          overflowY: "auto",

          bgcolor: "#FFFFFF",

          "&::-webkit-scrollbar": {
            width: 5,
          },

          "&::-webkit-scrollbar-thumb": {
            bgcolor: "#D4DDDA",
            borderRadius: 10,
          },
        }}
      >
        {/* ===================================================
            STEP 1 LABEL
        =================================================== */}

        <StepHeading
          number="1"
          title="Click the site icon"
        />

        {/* ===================================================
            BROWSER VISUAL
        =================================================== */}

        <Box
          sx={{
            mt: 1,

            border: "1px solid #DDE5E2",

            borderRadius: 2,

            overflow: "hidden",

            bgcolor: "#FFFFFF",

            boxShadow:
              "0 4px 14px rgba(15,23,42,0.06)",
          }}
        >
          {/* Browser top */}

          <Box
            sx={{
              height: 27,

              display: "flex",
              alignItems: "center",

              px: 1.2,

              gap: 0.55,

              bgcolor: "#F1F4F3",

              borderBottom: "1px solid #E4E9E7",
            }}
          >
            <BrowserDot color="#EF6A67" />
            <BrowserDot color="#E9B949" />
            <BrowserDot color="#56B870" />

            <Typography
              sx={{
                ml: 0.5,

                fontSize: "8.5px",

                color: "#98A2B3",
              }}
            >
              Browser
            </Typography>
          </Box>

          {/* Address bar area */}

          <Box
            sx={{
              p: 1.3,

              bgcolor: "#FAFBFB",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",

                gap: 0.7,

                minHeight: 38,

                px: 0.7,

                border: "1px solid #DDE4E1",

                borderRadius: 2,

                bgcolor: "#FFFFFF",
              }}
            >
              {/* Highlighted site control */}

              <Box
                sx={{
                  position: "relative",

                  width: 31,
                  height: 29,

                  flexShrink: 0,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 1.3,

                  bgcolor: PRIMARY_LIGHT,

                  border: `1px solid ${PRIMARY}`,

                  color: PRIMARY,

                  boxShadow:
                    "0 0 0 3px rgba(7,135,106,0.08)",
                }}
              >
                <TuneRoundedIcon
                  sx={{
                    fontSize: 16,
                  }}
                />

                {/* Click indicator */}

                <Box
                  sx={{
                    position: "absolute",

                    width: 7,
                    height: 7,

                    right: -3,
                    top: -3,

                    bgcolor: "#E5484D",

                    border: "2px solid #FFFFFF",

                    borderRadius: "50%",
                  }}
                />
              </Box>

              {/* URL */}

              <Box
                sx={{
                  minWidth: 0,

                  flex: 1,

                  height: 29,

                  px: 1,

                  display: "flex",
                  alignItems: "center",

                  gap: 0.5,

                  borderRadius: 1.2,

                  bgcolor: "#F5F7F6",
                }}
              >
                <LockRoundedIcon
                  sx={{
                    fontSize: 11,
                    color: "#667085",
                  }}
                />

                <Typography
                  noWrap
                  sx={{
                    fontSize: "9.5px",

                    color: "#475467",
                  }}
                >
                  jeevandev.com
                </Typography>
              </Box>

              <MoreVertRoundedIcon
                sx={{
                  fontSize: 16,
                  color: "#98A2B3",
                }}
              />
            </Box>

            {/* Click hint */}

            <Box
              sx={{
                mt: 0.8,

                display: "flex",
                alignItems: "center",

                gap: 0.6,

                color: PRIMARY,
              }}
            >
              <Box
                sx={{
                  width: 31,

                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <ArrowDownwardRoundedIcon
                  sx={{
                    fontSize: 14,

                    transform: "rotate(180deg)",
                  }}
                />
              </Box>

              <Typography
                sx={{
                  fontSize: "9.5px",

                  fontWeight: 600,

                  color: PRIMARY,
                }}
              >
                Click this icon
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* ===================================================
            CONNECTOR
        =================================================== */}

        <Box
          sx={{
            height: 25,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowDownwardRoundedIcon
            sx={{
              fontSize: 18,

              color: "#98A2B3",
            }}
          />
        </Box>

        {/* ===================================================
            STEP 2
        =================================================== */}

        <StepHeading
          number="2"
          title="Allow Location"
        />

        {/* ===================================================
            PERMISSION PANEL VISUAL
        =================================================== */}

        <Box
          sx={{
            mt: 1,

            p: 1.3,

            border: "1px solid #DDE5E2",

            borderRadius: 2,

            bgcolor: "#FAFBFB",
          }}
        >
          {/* Permission header */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",

              mb: 1.2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "11px",

                  fontWeight: 700,

                  color: "#344054",
                }}
              >
                Permissions
              </Typography>

              <Typography
                sx={{
                  mt: 0.1,

                  fontSize: "9px",

                  color: "#98A2B3",
                }}
              >
                jeevandev.com
              </Typography>
            </Box>

            <Box
              sx={{
                px: 0.8,
                py: 0.35,

                borderRadius: 1,

                bgcolor: "#EEF2F1",

                fontSize: "8px",

                color: "#667085",
              }}
            >
              Site settings
            </Box>
          </Box>

          {/* Location row */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",

              gap: 1,

              p: 1,

              borderRadius: 1.5,

              bgcolor: "#FFFFFF",

              border: `1px solid ${PRIMARY}`,

              boxShadow:
                "0 0 0 3px rgba(7,135,106,0.06)",
            }}
          >
            {/* Location icon */}

            <Box
              sx={{
                width: 30,
                height: 30,

                flexShrink: 0,

                borderRadius: "50%",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                bgcolor: PRIMARY_LIGHT,
                color: PRIMARY,
              }}
            >
              <LocationOnRoundedIcon
                sx={{
                  fontSize: 17,
                }}
              />
            </Box>

            <Box
              sx={{
                minWidth: 0,

                flex: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: "10.5px",

                  fontWeight: 600,

                  color: "#344054",
                }}
              >
                Location
              </Typography>

              <Typography
                sx={{
                  mt: 0.1,

                  fontSize: "8.5px",

                  color: "#98A2B3",
                }}
              >
                Allow this site to know your location
              </Typography>
            </Box>

            {/* Fake Allow select */}

            <Box
              sx={{
                minWidth: 64,

                px: 1,
                py: 0.6,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                gap: 0.35,

                borderRadius: 1.2,

                bgcolor: PRIMARY,

                color: "#FFFFFF",

                fontSize: "9px",

                fontWeight: 700,
              }}
            >
              <CheckRoundedIcon
                sx={{
                  fontSize: 12,
                }}
              />

              Allow
            </Box>
          </Box>
        </Box>

        {/* ===================================================
            SUCCESS INFO
        =================================================== */}

        <Box
          sx={{
            mt: 1.5,

            display: "flex",
            alignItems: "flex-start",

            gap: 1,

            p: 1.15,

            borderRadius: 1.7,

            bgcolor: PRIMARY_LIGHT,
          }}
        >
          <Box
            sx={{
              width: 25,
              height: 25,

              flexShrink: 0,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              borderRadius: "50%",

              bgcolor: PRIMARY,

              color: "#FFFFFF",
            }}
          >
            <CheckRoundedIcon
              sx={{
                fontSize: 15,
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "11px",

                fontWeight: 700,

                color: "#185D50",
              }}
            >
              Location allowed?
            </Typography>

            <Typography
              sx={{
                mt: 0.15,

                fontSize: "10px",

                lineHeight: 1.45,

                color: "#47736B",
              }}
            >
              Click Retry Location below. We'll try to
              detect your city again.
            </Typography>
          </Box>
        </Box>

        {/* ===================================================
            FALLBACK
        =================================================== */}

        <Box
          sx={{
            mt: 1.25,

            display: "flex",
            alignItems: "flex-start",

            gap: 0.9,

            p: 1.1,

            borderRadius: 1.5,

            bgcolor: "#F8FAF9",

            border: "1px solid #E7ECEA",
          }}
        >
          <TuneRoundedIcon
            sx={{
              mt: 0.15,

              fontSize: 16,

              color: "#667085",
            }}
          />

          <Typography
            sx={{
              fontSize: "9.5px",

              lineHeight: 1.5,

              color: "#667085",
            }}
          >
            <Box
              component="span"
              sx={{
                fontWeight: 700,
                color: "#475467",
              }}
            >
              Can't find it?
            </Box>{" "}
            Open Browser Settings → Privacy & Security →
            Site Settings → Location and allow this
            website.
          </Typography>
        </Box>
      </DialogContent>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <DialogActions
        sx={{
          px: {
            xs: 1.5,
            sm: 2.25,
          },

          py: 1.35,

          gap: 0.8,

          borderTop: "1px solid #E8EEEB",

          bgcolor: "#FAFBFB",

          flexDirection: {
            xs: "column-reverse",
            sm: "row",
          },

          "& > :not(style) ~ :not(style)": {
            ml: {
              xs: "0 !important",
              sm: "6px !important",
            },
          },
        }}
      >
        {/* CLOSE */}

        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },

            minWidth: 80,

            height: 35,

            px: 1.8,

            borderRadius: 1.5,

            borderColor: "#C8D5D1",

            color: "#475467",

            fontSize: "11px",

            fontWeight: 600,

            textTransform: "none",

            "&:hover": {
              borderColor: "#9FB5AE",
              bgcolor: "#F5F8F7",
            },
          }}
        >
          Close
        </Button>

        
      </DialogActions>
    </Dialog>
  );
}

/* =========================================================
   STEP HEADING
========================================================= */

function StepHeading({
  number,
  title,
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.8}
    >
      <Box
        sx={{
          width: 23,
          height: 23,

          flexShrink: 0,

          borderRadius: "50%",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          bgcolor: PRIMARY,

          color: "#FFFFFF",

          fontSize: "9.5px",

          fontWeight: 700,
        }}
      >
        {number}
      </Box>

      <Typography
        sx={{
          fontSize: "11.5px",

          fontWeight: 700,

          color: "#344054",
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
}

/* =========================================================
   BROWSER DOT
========================================================= */

function BrowserDot({ color }) {
  return (
    <Box
      sx={{
        width: 6,
        height: 6,

        borderRadius: "50%",

        bgcolor: color,
      }}
    />
  );
}