"use client";

import Image from "next/image";
import { Box, Button, Typography } from "@mui/material";
import {
  Building2,
  ClipboardList,
  Hourglass,
  FileCheck2,
  Plus,
  UsersRound,
} from "lucide-react";
import RecentTest from "./RecentTestOrders"
import TodayWork from "./TodayWorkQuickActions"

const cards = [
  ["Pending Requests", "0", "New requests to review", ClipboardList],
  ["In Progress", "0", "Tests currently being processed", Hourglass],
  ["Reports Ready", "0", "Completed reports ready to share", FileCheck2],
  ["Connected Doctors", "0", "Doctors connected to your lab", UsersRound],
];

export default function LabDashboard() {
  return (
    <Box sx={{ width: "100%",bgcolor: "white" }}>
       <Box
        sx={{
          minHeight: 110,
          p: { xs: 2, sm: 2.5 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          border: "1px solid #E2EBE9",
          borderRadius: 2,
          bgcolor: "#FBFDFC",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 68,
              height: 68,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              bgcolor: "#E5F5F0",
              color: "#087F68",
            }}
          >
            <Building2 size={30} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: "#13866F", fontSize: 11, fontWeight: 800 }}>
              WELCOME TO YOUR LAB WORKSPACE
            </Typography>

            <Typography
              component="h1"
              sx={{
                color: "#172033",
                fontSize: 23,
                lineHeight: 1.2,
                fontWeight: 800,
              }}
            >
              jeev labs
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                mt: 0.5,
              }}
            >
              <Typography sx={{ color: "#526176", fontSize: 12.5 }}>
                Lab code: JDV-LJAXBT
              </Typography>

              <Box
                sx={{
                  px: 1,
                  py: 0.3,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.6,
                  borderRadius: 5,
                  bgcolor: "#E6F6F0",
                  color: "#14856D",
                  fontSize: 12.5,
                  fontWeight: 700,
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    bgcolor: "#159879",
                  }}
                />
                Active
              </Box>

              <Button
                href="/lab/pages/requests"
                variant="contained"
                size="small"
                startIcon={<Plus size={14} />}
                sx={{
                  px: 1.2,
                  py: 0.45,
                  borderRadius: 1.5,
                  bgcolor: "#07876A",
                  fontSize: 12.5,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#066F58",
                    boxShadow: "none",
                  },
                }}
              >
                Add walk-in order
              </Button>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "block" },
            position: "relative",
            width: 190,
            height: 90,
            flexShrink: 0,
          }}
        >
          <Image
            src="/img/lab.png"
            alt="Laboratory illustration"
            width={190}
            height={90}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          mt: 1.5,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1.5,
        }}
      >
        {cards.map(([title, value, description, Icon]) => (
          <Box
            key={title}
            sx={{
              minHeight: 108,
              p: 1.8,
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              border: "1px solid #E2EBE9",
              borderRadius: 2,
              bgcolor: "#FFFFFF",
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                bgcolor: "#E7F6F1",
                color: "#13866F",
              }}
            >
              <Icon size={22} />
            </Box>

            <Box>
              <Typography sx={{ color: "#40516A", fontSize: 12.5, fontWeight: 700 }}>
                {title}
              </Typography>

              <Typography
                sx={{
                  color: "#172033",
                  fontSize: 24,
                  fontWeight: 800,
                  lineHeight: 1.2,
                }}
              >
                {value}
              </Typography>

              <Typography sx={{ color: "#64748B", fontSize: 12.5 }}>
                {description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

  <TodayWork />
    </Box>
  );
}