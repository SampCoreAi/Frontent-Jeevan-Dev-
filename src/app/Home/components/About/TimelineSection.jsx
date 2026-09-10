// components/about/TimelineSection.jsx
'use client';

import * as React from 'react';
import { Box, Container, Typography, Grid, Paper, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, MapPin, Heart } from 'lucide-react';

const steps = [
  { icon: Search, title: 'Search Doctor', description: 'Find the perfect doctor based on your needs, location, and availability.' },
  { icon: Calendar, title: 'Choose Schedule', description: 'Select a convenient date and time that fits your schedule.' },
  { icon: Clock, title: 'Book Appointment', description: 'Confirm your booking instantly with a few simple clicks.' },
  { icon: MapPin, title: 'Visit Clinic', description: 'Arrive at the clinic for your consultation at the scheduled time.' },
  { icon: Heart, title: 'Get Better', description: 'Receive expert care and follow-up support for your recovery.' },
];

const TimelineSection = () => {
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
            How It Works
          </Typography>
          <Typography variant="body1" sx={{ color: '#6B7280', maxWidth: '600px', mx: 'auto' }}>
            Your journey to better healthcare in five simple steps.
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="center">
          {steps.map((step, index) => (
            <Grid item xs={12} md={6} lg={2.4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '20px',
                    bgcolor: '#ffffff',
                    border: '1px solid #E5E7EB',
                    textAlign: 'center',
                    height: '100%',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: '0 12px 32px rgba(30,102,88,0.08)',
                      borderColor: '#1E6658',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: '#EAF7F4',
                      color: '#1E6658',
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <step.icon size={28} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F2937', mb: 1 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.6 }}>
                    {step.description}
                  </Typography>
                  {index < steps.length - 1 && (
                    <Box
                      sx={{
                        display: { xs: 'none', lg: 'block' },
                        position: 'absolute',
                        right: '-20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#1E6658',
                        fontSize: '1.5rem',
                        opacity: 0.3,
                      }}
                    >
                      →
                    </Box>
                  )}
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TimelineSection;