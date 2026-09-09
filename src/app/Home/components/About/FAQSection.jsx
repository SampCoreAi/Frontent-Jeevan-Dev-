// components/about/FAQSection.jsx
'use client';

import * as React from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'What is Jeevan Dev?', a: 'Jeevan Dev is a comprehensive digital healthcare platform that connects patients with doctors, hospitals, and clinics for seamless appointment booking, medical record management, and healthcare services.' },
  { q: 'How do I book an appointment?', a: 'Simply sign up, search for a doctor by specialty or location, select an available time slot, and confirm your booking. You will receive a confirmation via email and SMS.' },
  { q: 'Is Jeevan Dev free to use?', a: 'Yes, Jeevan Dev is free for patients. We charge a small fee to healthcare providers for using our platform to manage their practice.' },
  { q: 'How do I find a doctor?', a: 'You can search for doctors by name, specialty, location, or availability. Our advanced filters help you find the perfect match for your healthcare needs.' },
  { q: 'Are my medical records secure?', a: 'Absolutely. We use enterprise-grade encryption and follow HIPAA-compliant standards to ensure your data is safe and private at all times.' },
  { q: 'Can I manage appointments for my family?', a: 'Yes, you can create and manage profiles for your family members and book appointments on their behalf.' },
  { q: 'What if I need to cancel my appointment?', a: 'You can cancel or reschedule your appointment easily through your dashboard. Please check our cancellation policy for details.' },
  { q: 'How do doctors join Jeevan Dev?', a: 'Doctors can sign up on our platform, create their profile, set their availability, and start accepting appointments from patients.' },
  { q: 'Is Jeevan Dev available on mobile?', a: 'Yes, we offer a fully responsive mobile experience and are planning to launch native apps for iOS and Android.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, debit cards, UPI, and net banking. Payments are processed securely through our trusted payment partners.' },
];

const FAQSection = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F8FBFA' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.8rem' },
              fontWeight: 700,
              color: '#1F2937',
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" sx={{ color: '#6B7280', maxWidth: '600px', mx: 'auto' }}>
            Got questions? We have answers. Here are the most common queries.
          </Typography>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  mb: 2,
                  borderRadius: '16px',
                  border: '1px solid #E5E7EB',
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { borderColor: '#1E6658', boxShadow: '0 4px 20px rgba(30,102,88,0.06)' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ChevronDown size={20} />}
                  sx={{
                    borderRadius: '16px',
                    bgcolor: '#ffffff',
                    '&:hover': { bgcolor: '#F8FBFA' },
                  }}
                >
                  <Typography sx={{ fontWeight: 600, color: '#1F2937' }}>{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#ffffff', borderRadius: '0 0 16px 16px' }}>
                  <Typography sx={{ color: '#6B7280', lineHeight: 1.8 }}>{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default FAQSection;