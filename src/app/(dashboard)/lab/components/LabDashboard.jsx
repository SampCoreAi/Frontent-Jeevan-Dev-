"use client";

import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { SectionTitle } from "./LabUi";

export default function LabDashboard({ profile, stats, onNavigate }) {
  const status = profile?.status || "UNKNOWN";

  const kpis = [
    {
      label: "Lab Status",
      value: status,
      icon: ScienceOutlinedIcon,
      color: "#15803d",
      bg: "#ecfdf3",
    },
    {
      label: "Doctors",
      value: stats?.connections ?? 0,
      icon: LocalHospitalOutlinedIcon,
      color: "#1769aa",
      bg: "#eff6ff",
    },
    {
      label: "Test Requests",
      value: stats?.requests ?? 0,
      icon: AssignmentOutlinedIcon,
      color: "#0f766e",
      bg: "#f0fdfa",
    },
    {
      label: "Reports",
      value: stats?.reports ?? 0,
      icon: DescriptionOutlinedIcon,
      color: "#3578b5",
      bg: "#f0f7ff",
    },
  ];

  const profileDetails = [
    ["Lab name", profile?.lab_name],
    ["Lab code", profile?.lab_code],
    ["Registration", profile?.registration_number],
    ["Phone", profile?.phone_number],
    ["Address", profile?.address],
    ["Status", profile?.status],
  ];

  const actions = [
    {
      title: "Review test requests",
      description: "View and process pending test requests",
      icon: AssignmentOutlinedIcon,
      path: "/lab/pages/requests",
    },
    {
      title: "Doctor connections",
      description: "Manage connected doctors",
      icon: LocalHospitalOutlinedIcon,
      path: "/lab/pages/connections",
    },
    {
      title: "Uploaded reports",
      description: "View and manage lab reports",
      icon: DescriptionOutlinedIcon,
      path: "/lab/pages/reports",
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          p: { xs: 2, sm: 2.5 },
          borderRadius: "8px",
          border: "1px solid #d5e7df",
          bgcolor: "#edf7f2",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 180,
            height: 180,
            borderRadius: "50%",
            bgcolor: "#dcefe5",
            top: -100,
            right: -50,
          }}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "8px",
                bgcolor: "#d7eee3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#14734f",
                flexShrink: 0,
              }}
            >
              <ScienceOutlinedIcon sx={{ fontSize: 22 }} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "9.5px",
                  letterSpacing: "0.1em",
                  fontWeight: 800,
                  color: "#14734f",
                }}
              >
                CONNECTED LAB WORKSPACE
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "16px", sm: "18px" },
                  fontWeight: 700,
                  color: "#123f66",
                  mt: 0.25,
                  lineHeight: 1.3,
                }}
              >
                {profile?.lab_name || "Diagnostic Laboratory"}
              </Typography>

              <Typography
                sx={{
                  fontSize: "11.5px",
                  color: "#65767b",
                  mt: 0.3,
                }}
              >
                Code: {profile?.lab_code || "-"} · Manage requests, doctors and
                reports
              </Typography>
            </Box>
          </Stack>

          <Chip
            size="small"
            label={status}
            sx={{
              height: 25,
              bgcolor: status === "ACTIVE" ? "#d7f0e7" : "#f1f5f9",
              color: status === "ACTIVE" ? "#14734f" : "#64748b",
              border: `1px solid ${
                status === "ACTIVE" ? "#b9dfcf" : "#e2e8f0"
              }`,
              fontSize: "10px",
              fontWeight: 700,
              "& .MuiChip-label": {
                px: 1.25,
              },
            }}
          />
        </Stack>
      </Paper>

      <Box sx={{ mt: 2.5 }}>
        <SectionTitle
          title="Overview"
          description="A clear view of your laboratory network, workload and reports."
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 1.5,
          mt: 1.5,
        }}
      >
        {kpis.map((item) => {
          const Icon = item.icon;

          return (
            <Paper
              key={item.label}
              elevation={0}
              sx={{
                p: 1.75,
                minHeight: 105,
                border: "1px solid #dfe7eb",
                borderRadius: "8px",
                bgcolor: "#fff",
                transition: "0.2s ease",
                "&:hover": {
                  borderColor: "#bfd5df",
                  boxShadow: "0 5px 18px rgba(18,63,102,0.07)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: "11.5px",
                      color: "#65767b",
                      fontWeight: 600,
                    }}
                  >
                    {item.label}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: item.label === "Lab Status" ? "18px" : "25px",
                      color: item.color,
                      fontWeight: 700,
                      mt: 1.1,
                      lineHeight: 1,
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "8px",
                    bgcolor: item.bg,
                    color: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon sx={{ fontSize: 19 }} />
                </Box>
              </Stack>
            </Paper>
          );
        })}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 1.65fr) minmax(300px, 0.8fr)",
          },
          gap: 1.5,
          mt: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #dfe7eb",
            borderRadius: "8px",
            bgcolor: "#fff",
            overflow: "hidden",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            gap={1.5}
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: "1px solid #edf1f3",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "7px",
                  bgcolor: "#edf7f2",
                  color: "#14734f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BusinessOutlinedIcon sx={{ fontSize: 18 }} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#123f66",
                    fontWeight: 700,
                    fontSize: "13px",
                  }}
                >
                  Laboratory Profile
                </Typography>

                <Typography
                  sx={{
                    color: "#7a8c92",
                    fontSize: "10.5px",
                    mt: 0.15,
                  }}
                >
                  Registered organisation details
                </Typography>
              </Box>
            </Stack>

            <Button
              size="small"
              variant="outlined"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => onNavigate("/lab/pages/profile")}
              sx={{
                minHeight: 30,
                px: 1.25,
                borderRadius: "6px",
                borderColor: "#c9dce6",
                color: "#0b5c8e",
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#f4f9fb",
                  borderColor: "#0b5c8e",
                },
              }}
            >
              View profile
            </Button>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
            }}
          >
            {profileDetails.map(([label, value], index) => (
              <Box
                key={label}
                sx={{
                  px: 2,
                  py: 1.7,
                  minHeight: 72,
                  borderRight: {
                    xs: "none",
                    sm: index % 2 === 0 ? "1px solid #edf1f3" : "none",
                    md: index % 3 !== 2 ? "1px solid #edf1f3" : "none",
                  },
                  borderBottom: {
                    xs:
                      index < profileDetails.length - 1
                        ? "1px solid #edf1f3"
                        : "none",
                    sm: index < 4 ? "1px solid #edf1f3" : "none",
                    md: index < 3 ? "1px solid #edf1f3" : "none",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "9.5px",
                    color: "#84959b",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </Typography>

                {label === "Status" ? (
                  <Chip
                    size="small"
                    label={value || "-"}
                    sx={{
                      height: 22,
                      mt: 0.8,
                      bgcolor: value === "ACTIVE" ? "#ecfdf3" : "#f1f5f9",
                      color: value === "ACTIVE" ? "#15803d" : "#64748b",
                      fontSize: "9.5px",
                      fontWeight: 700,
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      color: "#1f2937",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      mt: 0.55,
                      lineHeight: 1.4,
                      wordBreak: "break-word",
                    }}
                  >
                    {value || "-"}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            border: "1px solid #dfe7eb",
            borderRadius: "8px",
            bgcolor: "#fff",
            p: 2,
          }}
        >
          <Typography
            sx={{
              color: "#123f66",
              fontWeight: 700,
              fontSize: "13px",
            }}
          >
            Quick Actions
          </Typography>

          <Typography
            sx={{
              color: "#7a8c92",
              fontSize: "10.5px",
              mt: 0.25,
              mb: 1.5,
            }}
          >
            Move directly to your daily work.
          </Typography>

          <Stack spacing={1}>
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <Button
                  key={action.title}
                  fullWidth
                  onClick={() => onNavigate(action.path)}
                  endIcon={
                    <ArrowForwardRoundedIcon
                      sx={{
                        fontSize: "16px !important",
                      }}
                    />
                  }
                  sx={{
                    minHeight: 57,
                    px: 1.25,
                    py: 0.9,
                    borderRadius: "7px",
                    border: "1px solid #e0e7ea",
                    bgcolor: "#fff",
                    color: "#1f2937",
                    justifyContent: "flex-start",
                    textAlign: "left",
                    textTransform: "none",
                    "& .MuiButton-endIcon": {
                      ml: "auto",
                      color: "#82939a",
                    },
                    "&:hover": {
                      bgcolor: "#f7fbf9",
                      borderColor: "#bad8ca",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "7px",
                      bgcolor: "#edf7f2",
                      color: "#14734f",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1.2,
                      flexShrink: 0,
                    }}
                  >
                    <Icon sx={{ fontSize: 18 }} />
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "11.5px",
                        fontWeight: 700,
                        color: "#26373d",
                        lineHeight: 1.3,
                      }}
                    >
                      {action.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "9.5px",
                        color: "#84959b",
                        mt: 0.2,
                        lineHeight: 1.3,
                      }}
                    >
                      {action.description}
                    </Typography>
                  </Box>
                </Button>
              );
            })}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}