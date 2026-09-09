"use client";
import React from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  LinearProgress,
  Divider,
  Card,
  Stack,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

const reviewData = [
  { label: "Excellent", value: 90, color: "primary" },
  { label: "Great", value: 70, color: "success" },
  { label: "Good", value: 50, color: "warning" },
  { label: "Avarage", value: 30, color: "info" },
];

const feedbackCard = () => {
  const theme = useTheme();
  const text = theme.palette.text;
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Card
          sx={{
            p: 2,
            borderRadius: 0.5,
            boxShadow: 3,
            height: "100%",
            width: 380,
            
            border: "1px solid #000000ff",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Patients Review
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {reviewData.map((r, i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 0.5 }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {r.label}
                </Typography>
                <Typography variant="body2" sx={{ color: "#555" }}>
                  {r.value}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={r.value}
                sx={{
                  height: 10,
                  borderRadius: 0.5,
                  bgcolor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 0.5,
                    backgroundColor: r.color,
                  },
                }}
              />
            </Box>
          ))}

          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2, textTransform: "none", color: text.primary }}
          >
            View Feedback
          </Button>
        </Card>
      </Grid>
    </Grid>
  );
};

export default feedbackCard;
