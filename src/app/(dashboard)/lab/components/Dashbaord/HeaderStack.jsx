"use client";

import { Box, Typography } from "@mui/material";
import {
  Building2,
  ClipboardList,
  Hourglass,
  FileCheck2,
  UsersRound,
  Plus,
  TreePine,
} from "lucide-react";

const stats = [
  {
    title: "Pending Requests",
    value: "0",
    description: "New requests to review",
    Icon: ClipboardList,
  },
  {
    title: "In Progress",
    value: "0",
    description: "Tests currently being processed",
    Icon: Hourglass,
  },
  {
    title: "Reports Ready",
    value: "0",
    description: "Completed reports ready to share",
    Icon: FileCheck2,
  },
  {
    title: "Connected Doctors",
    value: "0",
    description: "Doctors connected to your lab",
    Icon: UsersRound,
  },
];

export default function LabDashboardOverview() {
  return (
    <Box
      sx={{
        width: "100%",
        p: { xs: 1.5, sm: 2 },
        bgcolor: "#F8FAFA",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
          minHeight: 186,
          p: { xs: 2, sm: 3 },
          border: "1px solid #E2EBE9",
          borderRadius: "13px",
          bgcolor: "#FBFDFC",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 2, sm: 3 },
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: { xs: 64, sm: 88 },
              height: { xs: 64, sm: 88 },
              flexShrink: 0,
              borderRadius: "50%",
              bgcolor: "#E5F5F0",
              color: "#087F68",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Building2 size={38} strokeWidth={2.2} />
          </Box>

          <Box>
            <Typography
              sx={{
                color: "#13866F",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 0.5,
                mb: 0.6,
              }}
            >
              WELCOME TO YOUR LAB WORKSPACE
            </Typography>

            <Typography
              component="h1"
              sx={{
                color: "#172033",
                fontSize: { xs: 24, sm: 32 },
                lineHeight: 1.15,
                fontWeight: 800,
                mb: 1,
              }}
            >
              jeev labs
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1.5,
                mb: 1,
              }}
            >
              <Typography sx={{ color: "#526176", fontSize: 16 }}>
                Lab code: JDV-LJAXBT
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.7,
                  px: 1.4,
                  py: 0.5,
                  borderRadius: 10,
                  bgcolor: "#E6F6F0",
                  color: "#14856D",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                <Box
                  sx={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    bgcolor: "#159879",
                  }}
                />
                Active
              </Box>
            </Box>

            <Typography
              sx={{
                color: "#64748B",
                fontSize: { xs: 13, sm: 15 },
              }}
            >
              Manage test requests, connect with doctors and deliver reports —
              all in one place.
            </Typography>
          </Box>
        </Box>

        <Box
          aria-hidden="true"
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "flex-end",
            justifyContent: "center",
            position: "relative",
            width: 220,
            height: 135,
            flexShrink: 0,
            color: "#B9E4D8",
            borderBottom: "3px solid #B9E4D8",
          }}
        >
          <TreePine
            size={35}
            style={{ position: "absolute", left: 5, bottom: 0 }}
          />
          <TreePine
            size={42}
            style={{ position: "absolute", right: 2, bottom: 0 }}
          />

          <Box
            sx={{
              position: "relative",
              width: 100,
              height: 105,
              bgcolor: "#E7F6F1",
              border: "7px solid #B9E4D8",
              borderBottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={35} strokeWidth={4} color="#8ACDBB" />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                width: 26,
                height: 43,
                bgcolor: "#C9EDE3",
                borderRadius: "12px 12px 0 0",
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          mt: 2,
        }}
      >
        {stats.map(({ title, value, description, Icon }) => (
          <Box
            key={title}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              minHeight: 135,
              p: { xs: 2, sm: 2.5 },
              border: "1px solid #E2EBE9",
              borderRadius: "12px",
              bgcolor: "#FFFFFF",
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                flexShrink: 0,
                borderRadius: "50%",
                bgcolor: "#E7F6F1",
                color: "#13866F",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon size={27} strokeWidth={2.4} />
            </Box>

            <Box>
              <Typography
                sx={{
                  color: "#40516A",
                  fontSize: 15,
                  fontWeight: 700,
                  mb: 0.4,
                }}
              >
                {title}
              </Typography>

              <Typography
                sx={{
                  color: "#172033",
                  fontSize: 31,
                  lineHeight: 1.1,
                  fontWeight: 800,
                  mb: 0.8,
                }}
              >
                {value}
              </Typography>

              <Typography sx={{ color: "#64748B", fontSize: 14 }}>
                {description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}