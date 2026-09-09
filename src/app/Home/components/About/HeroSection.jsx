'use client';

import * as React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Calendar, Users, Stethoscope } from 'lucide-react';

const HeroSection = () => {
  return (
    <Box
      sx={{
        overflow: 'hidden',
        py: { xs: 8, md: 8 },
        background: 'linear-gradient(135deg, #EAF7F4 0%, #F5FCFA 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box
                sx={{
                  display: 'inline-block',
                  px: 2,
                  py: 0.7,
                  borderRadius: '30px',
                  bgcolor: '#DDF3ED',
                  color: '#1E6658',
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  mb: 3,
                }}
              >
                About Jeevan Dev
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.6rem', md: '4rem' },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: '#1F2937',
                  mb: 3,
                }}
              >
                Making Healthcare{' '}
                <Box component="span" sx={{ color: '#1E6658' }}>
                  Simple
                </Box>
                , Accessible & Digital
              </Typography>

              <Typography
                sx={{
                  color: '#6B7280',
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  maxWidth: 500,
                  mb: 4,
                }}
              >
                Jeevan Dev is a complete healthcare ecosystem connecting
                patients with trusted doctors, hospitals, and clinics, making
                quality healthcare just a tap away.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Calendar size={20} />}
                  sx={{
                    bgcolor: '#1E6658',
                    px: 4,
                    py: 1.5,
                    borderRadius: '50px',
                    '&:hover': {
                      bgcolor: '#185447',
                    },
                  }}
                >
                  Book Appointment
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Users size={20} />}
                  sx={{
                    color: '#1E6658',
                    borderColor: '#1E6658',
                    px: 4,
                    py: 1.5,
                    borderRadius: '50px',
                    '&:hover': {
                      borderColor: '#185447',
                    },
                  }}
                >
                  Find Doctors
                </Button>
              </Stack>
            </motion.div>
          </Grid>

        
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;