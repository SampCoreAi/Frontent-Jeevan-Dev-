"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Navbar from "../../components/Navbar";

const faqs = [
  {
    question: "What is Jeevan Dev?",
    answer:
      "Jeevan Dev is a healthcare platform that helps you search doctors, book appointments, and manage your healthcare journey online.",
  },
  {
    question: "Do I need an account to book an appointment?",
    answer:
      "Yes. You can search doctors without logging in, but booking and managing appointments requires an account.",
  },
  {
    question: "How do I book an appointment?",
    answer:
      "Search for your preferred doctor, choose an available date and time, and confirm your booking in just a few steps.",
  },
  {
    question: "Can I cancel or reschedule my appointment?",
    answer:
      "Yes. You can cancel or reschedule your appointment before the scheduled time from your account.",
  },
  {
    question: "Is there any booking fee?",
    answer:
      "No. Jeevan Dev does not charge a platform booking fee. Consultation charges depend on the doctor.",
  },
  {
    question: "Can I search doctors without logging in?",
    answer:
      "Yes. Anyone can browse doctors, specialties, ratings, and clinic details without creating an account.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Yes. We use secure technology to protect your personal and medical information.",
  },
  {
    question: "Can I use Jeevan Dev on mobile and desktop?",
    answer:
      "Yes. Jeevan Dev works seamlessly on both smartphones and desktop browsers.",
  },
];

export default function FAQSection() {
  return (
    <>
      <Navbar />
    <Box
    sx={{
      py: { xs: 7, md: 5 },

      bgcolor: "#f8fbfa",
    }}
    >
      <Container maxWidth="md">
        <Typography
          variant="overline"
          sx={{
            color: "#1E6658",
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          FAQ
        </Typography>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mt: 1,
            mb: 2,
            color: "#1a1a1a",
          }}
        >
          Frequently Asked Questions
        </Typography>

        <Typography
          sx={{
            color: "#666",
            mb: 5,
            fontSize: 16,
          }}
        >
          Find answers to the most common questions about appointments,
          doctors, accounts, and healthcare services.
        </Typography>

        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            disableGutters
            sx={{
              mb: 2,
              borderRadius: "14px !important",
              overflow: "hidden",
              border: "1px solid #E4E7EC",
              boxShadow: "none",
              "&:before": {
                display: "none",
              },
              "&.Mui-expanded": {
                borderColor: "#1E6658",
                boxShadow: "0 8px 24px rgba(30,102,88,0.12)",
              },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    color: "#1E6658",
                  }}
                />
              }
              sx={{
                bgcolor: "#fff",
                minHeight: 68,
                "& .MuiAccordionSummary-content": {
                  my: 2,
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 17,
                  color: "#222",
                }}
              >
                {faq.question}
              </Typography>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                bgcolor: "#fff",
                pt: 0,
                pb: 3,
              }}
            >
              <Typography
                sx={{
                  color: "#666",
                  lineHeight: 1.8,
                  fontSize: 15,
                }}
              >
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  </>
  );
}
