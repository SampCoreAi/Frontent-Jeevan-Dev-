// components/about/CTASection.jsx
'use client';

import * as React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { Calendar, Users } from 'lucide-react';

const CTASection = () => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #1E6658, #185447)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
          filter: 'blur(60px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.02)',
          filter: 'blur(40px)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', maxWidth: '700px', mx: 'auto' }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.2rem', md: '3.2rem' },
                fontWeight: 800,
                color: '#ffffff',
                mb: 2,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Ready to Experience Better Healthcare?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '1.125rem',
                mb: 4,
                maxWidth: '500px',
                mx: 'auto',
                lineHeight: 1.8,
              }}
            >
              Join thousands of patients and doctors who trust Jeevan Dev for
              seamless healthcare management.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<Calendar size={20} />}
                sx={{
                  bgcolor: '#ffffff',
                  color: '#1E6658',
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&:hover': {
                    bgcolor: '#EAF7F4',
                    transform: 'scale(1.02)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                Book Appointment
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Users size={20} />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: '#ffffff',
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&:hover': {
                    borderColor: '#ffffff',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    transform: 'scale(1.02)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                Explore Doctors
              </Button>
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CTASection;