// components/about/StatsSection.jsx
'use client';

import * as React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CalendarCheck, Users, Building2, Star } from 'lucide-react';

const stats = [
  { icon: CalendarCheck, value: '10,000+', label: 'Appointments', suffix: '' },
  { icon: Users, value: '500+', label: 'Doctors', suffix: '' },
  { icon: Building2, value: '50+', label: 'Hospitals', suffix: '' },
  { icon: Star, value: '99%', label: 'Patient Satisfaction', suffix: '%' },
];

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#ffffff' }}>
      <Container maxWidth="lg" ref={ref}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card
                  sx={{
                    borderRadius: '20px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    border: '1px solid #E5E7EB',
                    transition: 'all 0.3s',
                    textAlign: 'center',
                    '&:hover': {
                      boxShadow: '0 12px 32px rgba(30,102,88,0.08)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 1.5,
                        borderRadius: '50%',
                        bgcolor: '#EAF7F4',
                        color: '#1E6658',
                        mb: 2,
                      }}
                    >
                      <stat.icon size={28} />
                    </Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        color: '#1E6658',
                        fontSize: { xs: '2rem', md: '2.5rem' },
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6B7280', fontWeight: 500 }}>
                      {stat.label}
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

export default StatsSection;