"use client";

import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

const COLORS = {
  primary: "#1B6E4F",
  primaryLight: "#E8F5EE",
  border: "#E6EBE8",
  inputBorder: "#E1E7E3",
  dashedBorder: "#CBD8D1",
  textPrimary: "#1F2A24",
  textSecondary: "#6B7A72",
  error: "#E0483C",
  white: "#FFFFFF",
};

export default function OnboardingHeader() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 2, sm: 2 }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <Box
            sx={{
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              borderRadius: 2,
              bgcolor: COLORS.primaryLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLORS.primary,
              flexShrink: 0,
            }}
          >
            <LocalHospitalIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                fontWeight: 700,
                color: COLORS.primary,
                fontSize: { xs: "1.1rem", sm: "1.5rem", md: "1.8rem" },
                lineHeight: { xs: 1.3, sm: 1.2 },
              }}
            >
              Doctor Verification &amp; Onboarding
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: COLORS.textSecondary,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                display: { xs: "none", sm: "block" },
              }}
            >
              Join our trusted network of healthcare professionals
            </Typography>
          </Box>
        </Stack>

        {/* Required fields indicator - hidden on mobile, shown on tablet+ */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            display: { xs: "none", sm: "flex" },
            ml: { sm: "auto", md: 0 },
            flexShrink: 0,
          }}
        >
          <VerifiedUserOutlinedIcon
            fontSize="small"
            sx={{ color: COLORS.textSecondary, fontSize: { sm: 16, md: 20 } }}
          />
          <Typography
            variant="body2"
            sx={{
              color: COLORS.textSecondary,
              fontSize: { sm: "0.7rem", md: "0.875rem" },
              whiteSpace: "nowrap",
            }}
          >
            All fields marked with{" "}
            <Box component="span" sx={{ color: COLORS.error }}>
              *
            </Box>{" "}
            are required
          </Typography>
        </Stack>
      </Stack>

      {/* Subtitle for mobile only */}
      <Typography
        variant="body2"
        sx={{
          color: COLORS.textSecondary,
          fontSize: "0.75rem",
          display: { xs: "block", sm: "none" },
          mb: 2,
        }}
      >
        Join our trusted network of healthcare professionals
      </Typography>

      {/* Required fields indicator for mobile only */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          display: { xs: "flex", sm: "none" },
          mb: 2,
        }}
      >
        <VerifiedUserOutlinedIcon
          fontSize="small"
          sx={{ color: COLORS.textSecondary, fontSize: 16 }}
        />
        <Typography
          variant="body2"
          sx={{
            color: COLORS.textSecondary,
            fontSize: "0.7rem",
          }}
        >
          All fields marked with{" "}
          <Box component="span" sx={{ color: COLORS.error }}>
            *
          </Box>{" "}
          are required
        </Typography>
      </Stack>

      {/* Info banner */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 1.5 }}
        alignItems={{ xs: "flex-start", sm: "flex-start" }}
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: 2,
          bgcolor: COLORS.primaryLight,
          mb: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            width: { xs: 22, sm: 26 },
            height: { xs: 22, sm: 26 },
            flexShrink: 0,
            borderRadius: "50%",
            bgcolor: COLORS.primary,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: { xs: 0.5, sm: 0 },
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: { xs: 13, sm: 15 } }} />
        </Box>
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: COLORS.textPrimary,
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
            }}
          >
            Why do we collect this information?
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: COLORS.textSecondary,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            To verify your identity, communicate with you, and create your doctor
            account after approval.
          </Typography>
        </Box>
      </Stack>
    </>
  );
}