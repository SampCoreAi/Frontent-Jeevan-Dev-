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
import {
  User,
  Stethoscope,
  Building2,
  Home,
  Users,
} from "lucide-react";

const audiences = [
  {
    icon: User,
    title: "Patients",
    description:
      "Book appointments, manage health records, and connect with trusted doctors easily.",
  },
  {
    icon: Stethoscope,
    title: "Doctors",
    description:
      "Manage schedules, appointments, and deliver better patient care efficiently.",
  },
  {
    icon: Building2,
    title: "Hospitals",
    description:
      "Digitize hospital operations with smart appointment and patient management.",
  },
  {
    icon: Home,
    title: "Clinics",
    description:
      "Simplify clinic workflows and improve patient experience with digital tools.",
  },
  {
    icon: Users,
    title: "Healthcare Assistants",
    description:
      "Manage appointments, patient queues, and daily clinic operations smoothly.",
  },
];

export default function WhoWeServe() {
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
            Our Community
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
            Who We Serve
          </Typography>

          <Typography
            sx={{
              color: "#6B7280",
              maxWidth: 650,
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            Jeevan Dev is designed for every part of the healthcare ecosystem,
            making healthcare management simple, connected, and efficient.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {audiences.map((item, index) => {
            const Icon = item.icon;

            return (
              <Grid
                key={index}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                  lg: 3,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
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
                          "0 18px 40px rgba(30,102,88,.12)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 4,
                        textAlign: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 70,
                          height: 70,
                          bgcolor: "#EAF7F4",
                          borderRadius: "50%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          mx: "auto",
                          mb: 3,
                        }}
                      >
                        <Icon
                          size={32}
                          color="#1E6658"
                        />
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#1F2937",
                          mb: 2,
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#6B7280",
                          lineHeight: 1.8,
                        }}
                      >
                        {item.description}
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