"use client";

import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import PrivacyTipOutlinedIcon from "@mui/icons-material/PrivacyTipOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

export default function UserPrivacySettings({
  onViewPrivacyPolicy,
  onChangePassword,
}) {
  const cardSx = {
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 2,
    boxShadow: "none",
    bgcolor: "background.paper",
  };

  const iconBoxSx = {
    width: 40,
    height: 40,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9px",
    bgcolor: "rgba(7,135,106,0.08)",
    color: "primary.main",
  };

  const titleSx = {
    fontSize: "13px",
    fontWeight: 600,
    color: "text.primary",
  };

  const descriptionSx = {
    mt: 0.3,
    fontSize: "12.5px",
    lineHeight: 1.55,
    color: "text.secondary",
  };

  const itemTitleSx = {
    fontSize: "12.5px",
    fontWeight: 600,
    color: "text.primary",
  };

  const buttonSx = {
    textTransform: "none",
    fontSize: "12.5px",
    fontWeight: 600,
    borderRadius: 1.5,
    whiteSpace: "nowrap",
  };

  return (
    <Stack spacing={2}>
      <Card sx={cardSx}>
        <CardContent
          sx={{
            p: { xs: 2, sm: 2.2 },
            "&:last-child": {
              pb: { xs: 2, sm: 2.2 },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              justifyContent: "space-between",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box sx={iconBoxSx}>
                <PrivacyTipOutlinedIcon sx={{ fontSize: 20 }} />
              </Box>

              <Box>
                <Typography sx={titleSx}>
                  Privacy Policy
                </Typography>

                <Typography sx={descriptionSx}>
                  Learn how Jeevan Dev collects, uses and protects
                  your personal and health information.
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              onClick={onViewPrivacyPolicy}
              endIcon={
                <ChevronRightRoundedIcon
                  sx={{ fontSize: "17px !important" }}
                />
              }
              sx={{
                ...buttonSx,
                width: {
                  xs: "100%",
                  sm: "auto",
                },
              }}
            >
              View Policy
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={cardSx}>
        <CardContent
          sx={{
            p: { xs: 2, sm: 2.2 },
            "&:last-child": {
              pb: { xs: 2, sm: 2.2 },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
            }}
          >
            <Box sx={iconBoxSx}>
              <ShareOutlinedIcon sx={{ fontSize: 20 }} />
            </Box>

            <Box>
              <Typography sx={titleSx}>
                Data Sharing
              </Typography>

              <Typography sx={descriptionSx}>
                See when your information is shared while using
                healthcare services.
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.3,
              py: 1.6,
            }}
          >
            <MedicalServicesOutlinedIcon
              sx={{
                mt: 0.15,
                fontSize: 19,
                color: "text.secondary",
              }}
            />

            <Box>
              <Typography sx={itemTitleSx}>
                With Your Doctor
              </Typography>

              <Typography sx={descriptionSx}>
                When you book an appointment, relevant information
                is shared with the selected doctor.
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.3,
              pt: 1.6,
            }}
          >
            <ScienceOutlinedIcon
              sx={{
                mt: 0.15,
                fontSize: 19,
                color: "text.secondary",
              }}
            />

            <Box>
              <Typography sx={itemTitleSx}>
                With Your Lab
              </Typography>

              <Typography sx={descriptionSx}>
                When your doctor creates a lab test request,
                relevant patient and test information is shared
                with the selected lab.
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 1.6,
              pt: 1.5,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Button
              variant="text"
              onClick={onViewPrivacyPolicy}
              endIcon={
                <ChevronRightRoundedIcon
                  sx={{ fontSize: "17px !important" }}
                />
              }
              sx={{
                ...buttonSx,
                px: 0,
              }}
            >
              Learn more in Privacy Policy
            </Button>
          </Box>
        </CardContent>
      </Card>

     
    </Stack>
  );
}