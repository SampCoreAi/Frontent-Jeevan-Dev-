"use client";

import { Box, Grid, Stack, Typography } from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";

export default function AuthSidePanel() {
  const features = [
    {
      icon: <CalendarMonthRoundedIcon />,
      label: "Book Appointments",
    },
    {
      icon: <PersonSearchRoundedIcon />,
      label: "Consult Verified Doctors",
    },
    {
      icon: <DescriptionRoundedIcon />,
      label: "View Reports",
    },
    {
      icon: <HealthAndSafetyRoundedIcon />,
      label: "Manage Your Health",
    },
  ];

  return (
    <Grid
      sx={{
        position: "relative",
        width: {
          xs: "100%",
          md: "50%",
        },
        height: {
          xs: 520,
          md: "100%",
        },
        overflow: "hidden",
        background:
          "linear-gradient(145deg, #F7FFFC 0%, #EEFAF6 55%, #E4F6F0 100%)",
        px: {
          xs: 3,
          md: 3.5,
        },
        py: {
          xs: 3,
          md: 3,
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 330,
          height: 330,
          borderRadius: "50%",
          backgroundColor: "rgba(7,135,106,0.035)",
          border: "1px solid rgba(7,135,106,0.08)",
          right: -150,
          top: 145,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 240,
          height: 240,
          borderRadius: "50%",
          border: "1px solid rgba(7,135,106,0.07)",
          right: -95,
          top: 190,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          backgroundColor: "rgba(7,135,106,0.035)",
          left: -100,
          bottom: -100,
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          gap: 1.2,
        }}
      >
        <Box
          component="img"
          src="/img/icon.png"
          alt="Jeevan"
          sx={{
            width: 46,
            height: 46,
            objectFit: "contain",
          }}
        />

        <Box>
          <Typography
            sx={{
              fontSize: "23px",
              fontWeight: 800,
              lineHeight: 1,
              color: "#102331",
              letterSpacing: "-0.4px",
            }}
          >
            Jeevan
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              fontSize: "11.5px",
              fontWeight: 500,
              color: "#687887",
            }}
          >
            Your Health Partner
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          position: "relative",
          zIndex: 5,
          mt: 4,
          maxWidth: 320,
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "29px",
              md: "31px",
            },
            lineHeight: 1.12,
            fontWeight: 800,
            letterSpacing: "-0.8px",
            color: "#102331",
          }}
        >
          Better Care
        </Typography>

        <Typography
          sx={{
            mt: 0.2,
            fontSize: {
              xs: "29px",
              md: "31px",
            },
            lineHeight: 1.12,
            fontWeight: 800,
            letterSpacing: "-0.8px",
            color: "primary.main",
          }}
        >
          For a Healthier
          <br />
          Tomorrow
        </Typography>

        <Typography
          sx={{
            mt: 1.7,
            maxWidth: 295,
            fontSize: "12.5px",
            lineHeight: 1.6,
            fontWeight: 400,
            color: "#647585",
          }}
        >
          Book appointments, consult doctors, manage reports and take
          control of your health — all in one place.
        </Typography>
      </Box>

      <Stack
        spacing={1.15}
        sx={{
          position: "relative",
          zIndex: 6,
          mt: 2.5,
        }}
      >
        {features.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.1,
              width: "fit-content",
            }}
          >
            <Box
              sx={{
                width: 31,
                height: 31,
                flexShrink: 0,
                borderRadius: "50%",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(7,135,106,0.09)",

                "& svg": {
                  fontSize: "16px",
                  color: "primary.main",
                },
              }}
            >
              {item.icon}
            </Box>

            <Typography
              sx={{
                fontSize: "11.5px",
                fontWeight: 500,
                color: "#596B79",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Box
        component="img"
        src="/img/auth-doctor.png"
        alt="Doctor"
        sx={{
          position: "absolute",
          zIndex: 4,
          right: {
            md: -18,
            lg: -8,
          },
          bottom: 0,
          
          width: 300,
          height: 400,
          objectFit: "contain",
          objectPosition: "bottom right",
          display: {
            xs: "none",
            md: "block",
          },
        }}
      />
    </Grid>
  );
}