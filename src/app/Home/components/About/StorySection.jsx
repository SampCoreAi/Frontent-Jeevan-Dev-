"use client";

import * as React from "react";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function StorySection() {
return (
  <Box
    sx={{
      py: { xs: 8, md: 12 },
      bgcolor: "#fff",
    }}
  >
    <Container maxWidth="lg">

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Typography
          sx={{
            color: "#1E6658",
            fontWeight: 700,
            mb: 1,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Our Story
        </Typography>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: "#1F2937",
            mb: 6,
            fontSize: {
              xs: "2rem",
              md: "2.8rem",
            },
          }}
        >
          Building a Better Healthcare Experience
        </Typography>
      </motion.div>

      {/* Content */}
      <Grid container spacing={6} alignItems="center">

        {/* Left Image */}
        <Grid size={{ xs: 12, md: 5 }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box
              sx={{
                height: { xs: 320, md: 420 },
                borderRadius: 5,
                bgcolor: "#F8FBFA",
                border: "1px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: 260,
                  height: 260,
                  bgcolor: "#EAF7F4",
                  borderRadius: "50%",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  border: "2px dashed #1E6658",
                  opacity: 0.25,
                }}
              />

             <Box
  sx={{
    width: 120,
    height: 120,
    borderRadius: "50%",
    bgcolor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    boxShadow: "0 15px 35px rgba(30,102,88,.25)",
    p: 2,
  }}
>
  <img
    src="/img/icon.png" // public/logo.png
    alt="Jeevan Dev Logo"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",
    }}
  />
</Box>
            </Box>
          </motion.div>
        </Grid>

        {/* Right Content */}
        <Grid size={{ xs: 12, md: 7 }}>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              sx={{
                color: "#6B7280",
                lineHeight: 1.9,
                mb: 3,
              }}
            >
              Jeevan Dev was created with one clear goal: making healthcare
              easier, faster, and more accessible for everyone. We recognized
              that patients often spend too much time searching for doctors,
              waiting in long queues, and dealing with manual appointment
              systems.
            </Typography>

            <Typography
              sx={{
                color: "#6B7280",
                lineHeight: 1.9,
                mb: 3,
              }}
            >
              Our platform brings patients, doctors, hospitals, and clinics
              together in one secure digital ecosystem. From finding the right
              specialist to booking appointments in seconds, Jeevan Dev
              simplifies every step of the healthcare journey.
            </Typography>

            <Typography
              sx={{
                color: "#6B7280",
                lineHeight: 1.9,
              }}
            >
              We continue to build technology that saves time, improves
              communication, and helps healthcare providers deliver better
              patient care while making medical services more convenient and
              transparent.
            </Typography>
          </motion.div>
        </Grid>

      </Grid>

      {/* Bottom Quote */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Paper
          elevation={0}
          sx={{
            mt: 8,
            p: 4,
            borderRadius: 4,
            bgcolor: "#F8FBFA",
            borderLeft: "6px solid #1E6658",
            borderBottom: "6px solid #1E6658",
            borderRight: "6px solid #1E6658",
            borderTop: "1px solid #1E6658",
          }}
        >
          <Typography
            sx={{
              fontStyle: "italic",
              color: "#374151",
              lineHeight: 1.8,
              fontSize: "1.1rem",
            }}
          >
            "Our mission is to connect every patient with the right doctor
            through technology that is simple, secure, and accessible."
          </Typography>

          <Typography
            sx={{
              mt: 2,
              color: "#1E6658",
              fontWeight: 700,
            }}
          >
            — Jeevan Dev Team
          </Typography>
        </Paper>
      </motion.div>

    </Container>
  </Box>
);
}