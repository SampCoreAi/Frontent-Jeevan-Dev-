// components/about/TestimonialsSection.jsx
'use client';

import * as React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Rating, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Patient',
    avatar: 'P',
    rating: 5,
    comment: 'Jeevan Dev made finding a doctor so easy. I booked an appointment within minutes and received excellent care. The platform is truly life-changing.',
  },
  {
    name: 'Dr. Arjun Mehta',
    role: 'Cardiologist',
    avatar: 'A',
    rating: 5,
    comment: 'As a doctor, this platform has helped me manage my practice efficiently. The scheduling and patient management features are outstanding.',
  },
  {
    name: 'Sneha Patel',
    role: 'Patient',
    avatar: 'S',
    rating: 5,
    comment: 'I love how simple and secure Jeevan Dev is. My medical records are safe, and I can access them anytime. Highly recommended for everyone.',
  },
];

const TestimonialsSection = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#ffffff' }}>
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
            What Our Users Say
          </Typography>
          <Typography variant="body1" sx={{ color: '#6B7280', maxWidth: '600px', mx: 'auto' }}>
            Real stories from real people who trust Jeevan Dev.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
              >
                <Card
                  sx={{
                    borderRadius: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    border: '1px solid #E5E7EB',
                    transition: 'all 0.3s',
                    height: '100%',
                    '&:hover': {
                      boxShadow: '0 12px 40px rgba(30,102,88,0.08)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: '#EAF7F4',
                          color: '#1E6658',
                          width: 48,
                          height: 48,
                          mr: 2,
                          fontWeight: 600,
                        }}
                      >
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1F2937' }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B7280' }}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating value={testimonial.rating} readOnly precision={0.5} sx={{ mb: 2 }} />
                    <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.8 }}>
                      "{testimonial.comment}"
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;