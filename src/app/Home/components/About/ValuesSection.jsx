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
import { Heart, Shield, Lightbulb, Lock } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Trust",
    description:
      "Building lasting relationships through transparency, honesty, and reliability.",
  },
  {
    icon: Shield,
    title: "Care",
    description:
      "Putting patients first by delivering compassionate and accessible healthcare.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Creating smarter digital solutions that improve healthcare experiences.",
  },
  {
    icon: Lock,
    title: "Security",
    description:
      "Protecting personal and medical information with modern security practices.",
  },
];

export default function ValuesSection() {
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
            Our Values
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
            Our Core Values
          </Typography>

          <Typography
            sx={{
              maxWidth: 650,
              mx: "auto",
              color: "#6B7280",
              lineHeight: 1.8,
            }}
          >
            These values guide every decision we make and every healthcare
            experience we deliver.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {values.map((value, index) => {
            const Icon = value.icon;

            return (
              <Grid
                key={index}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      textAlign: "center",
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
                          width: 72,
                          height: 72,
                          borderRadius: "50%",
                          bgcolor: "#EAF7F4",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 3,
                        }}
                      >
                        <Icon size={34} color="#1E6658" />
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#1F2937",
                          mb: 2,
                        }}
                      >
                        {value.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#6B7280",
                          lineHeight: 1.8,
                        }}
                      >
                        {value.description}
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