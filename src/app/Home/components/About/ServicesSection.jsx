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
  Search,
  Calendar,
  History,
  Clock,
  Building2,
  User,
  LayoutDashboard,
  Bell,
  FileText,
} from "lucide-react";

const services = [
  {
    icon: Search,
    title: "Doctor Search",
    description:
      "Find experienced doctors based on specialization, location, ratings, and availability.",
  },
  {
    icon: Calendar,
    title: "Appointment Booking",
    description:
      "Book appointments online in just a few clicks with your preferred doctor.",
  },
  {
    icon: History,
    title: "Appointment History",
    description:
      "View all your previous and upcoming appointments in one place.",
  },
  {
    icon: Clock,
    title: "Schedule Management",
    description:
      "Doctors can easily manage consultation timings and available slots.",
  },
  {
    icon: Building2,
    title: "Hospital Management",
    description:
      "Digital tools to efficiently manage hospitals, clinics, and appointments.",
  },
  {
    icon: User,
    title: "Patient Profiles",
    description:
      "Secure patient information including prescriptions and medical history.",
  },
  {
    icon: LayoutDashboard,
    title: "Assistant Dashboard",
    description:
      "Clinic assistants can efficiently manage patients and appointments.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Receive appointment reminders and important healthcare updates.",
  },
  {
    icon: FileText,
    title: "Medical Records",
    description:
      "Store and access medical records securely anytime, anywhere.",
  },
];

export default function ServicesSection() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "#fff",
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
            What We Offer
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
            Our Services
          </Typography>

          <Typography
            sx={{
              maxWidth: 650,
              mx: "auto",
              color: "#6B7280",
              lineHeight: 1.8,
            }}
          >
            Complete healthcare solutions designed for patients, doctors,
            hospitals, and healthcare staff.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {services.map((service, index) => {
            const Icon = service.icon;

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
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
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
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 3,
                          bgcolor: "#EAF7F4",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 3,
                        }}
                      >
                        <Icon size={30} color="#1E6658" />
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          color: "#1F2937",
                        }}
                      >
                        {service.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#6B7280",
                          lineHeight: 1.8,
                        }}
                      >
                        {service.description}
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