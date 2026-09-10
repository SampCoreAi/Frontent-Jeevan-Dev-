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
  CalendarCheck,
  Shield,
  Clock,
  Smartphone,
  Users,
  Stethoscope,
} from "lucide-react";

const features = [
  {
    icon: CalendarCheck,
    title: "Easy Booking",
    description:
      "Book doctor appointments quickly with a simple and hassle-free process.",
  },
  {
    icon: Users,
    title: "Trusted Doctors",
    description:
      "Connect with verified and experienced healthcare professionals.",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description:
      "Your personal information and medical records are protected with advanced security.",
  },
  {
    icon: Clock,
    title: "Fast Appointments",
    description:
      "Reduce waiting time and schedule appointments in just a few clicks.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description:
      "Access Jeevan Dev seamlessly from your mobile, tablet, or desktop.",
  },
  {
    icon: Stethoscope,
    title: "Smart Dashboard",
    description:
      "Doctors and hospitals can efficiently manage schedules and appointments.",
  },
];

export default function WhyChooseUs() {
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
            Why Choose Us
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
            Why Choose Jeevan Dev?
          </Typography>

          <Typography
            sx={{
              maxWidth: 650,
              mx: "auto",
              color: "#6B7280",
              lineHeight: 1.8,
            }}
          >
            We combine modern technology with compassionate healthcare to
            deliver a faster, safer, and more convenient experience for
            patients, doctors, and hospitals.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Grid
                key={index}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
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
                          borderRadius: "50%",
                          bgcolor: "#EAF7F4",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 3,
                        }}
                      >
                        <Icon size={32} color="#1E6658" />
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#1F2937",
                          mb: 2,
                        }}
                      >
                        {feature.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#6B7280",
                          lineHeight: 1.8,
                        }}
                      >
                        {feature.description}
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