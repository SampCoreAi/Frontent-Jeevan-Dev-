"use client";

import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";

const cards = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To make quality healthcare accessible to everyone through a secure and easy-to-use digital platform that connects patients with trusted doctors, reduces waiting time, and improves healthcare experiences.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To build a future where technology makes healthcare simple, transparent, and available to everyone, empowering hospitals, doctors, and patients with smarter digital solutions.",
  },
];

export default function MissionVision() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "#F8FBFA",
      }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <Box textAlign="center" mb={7}>
          <Typography
            sx={{
              color: "#1E6658",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
              mb: 1,
            }}
          >
            Our Purpose
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#1F2937",
              mb: 2,
              fontSize: {
                xs: "2rem",
                md: "2.8rem",
              },
            }}
          >
            Mission & Vision
          </Typography>

          <Typography
            sx={{
              maxWidth: 650,
              mx: "auto",
              color: "#6B7280",
              lineHeight: 1.8,
            }}
          >
            Our commitment is to improve healthcare accessibility through
            innovation, trust, and patient-focused technology.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <Grid
                key={index}
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.15,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 5,
                      border: "1px solid #E5E7EB",
                      boxShadow: "0 8px 24px rgba(0,0,0,.05)",
                      transition: ".3s",

                      "&:hover": {
                        borderColor: "#1E6658",
                        boxShadow:
                          "0 20px 40px rgba(30,102,88,.12)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 5 }}>
                      <Box
                        sx={{
                          width: 70,
                          height: 70,
                          borderRadius: 3,
                          bgcolor: "#EAF7F4",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 3,
                        }}
                      >
                        <Icon size={34} color="#1E6658" />
                      </Box>

                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          color: "#1F2937",
                        }}
                      >
                        {card.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#6B7280",
                          lineHeight: 1.9,
                        }}
                      >
                        {card.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}