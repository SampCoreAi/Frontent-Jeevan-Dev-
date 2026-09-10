"use client";

import React from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Card,
  Stack,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";

const requests = Array(6).fill({
  name: "Maria Sarafat",
  diagnosis: "Health Checkup",
  time: "9:30 AM",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
});

const RequestCard = () => {
  return (
    <Card
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        border: "2px solid #b4b4b4",
        width: "100%",
        boxShadow: "none",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={1}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            fontSize: {
              xs: "1rem",
              md: "1.2rem",
            },
          }}
        >
          Appointment Request
        </Typography>

        <Chip
          label={`${requests.length} Requests`}
          sx={{
            background: "#f3f4f6",
            fontWeight: 600,
          }}
        />
      </Box>

      {/* Request List */}
      <Stack spacing={2}>
        {requests.map((item, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid #f0f0f0",
              transition: "0.3s",
              "&:hover": {
                backgroundColor: "#fafafa",
              },
            }}
          >
            <Grid
              container
              spacing={2}
              alignItems="center"
            >
              {/* Avatar + Info */}
              <Grid item xs={12} md={5}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Avatar
                    src={item.avatar}
                    sx={{
                      width: { xs: 45, md: 50 },
                      height: { xs: 45, md: 50 },
                    }}
                  />

                  <Box>
                    <Typography
                      fontWeight={600}
                      sx={{
                        fontSize: {
                          xs: "0.95rem",
                          md: "1rem",
                        },
                      }}
                    >
                      {item.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: {
                          xs: "0.8rem",
                          md: "0.9rem",
                        },
                      }}
                    >
                      {item.diagnosis}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Time */}
              <Grid item xs={12} sm={4} md={2}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                  sx={{
                    textAlign: {
                      xs: "left",
                      md: "center",
                    },
                    pl: {
                      xs: 1,
                      md: 0,
                    },
                  }}
                >
                  {item.time}
                </Typography>
              </Grid>

              {/* Actions */}
              <Grid item xs={12} sm={8} md={5}>
                <Box
                  display="flex"
                  justifyContent={{
                    xs: "flex-start",
                    md: "flex-end",
                  }}
                  gap={1}
                  flexWrap="wrap"
                >
                  <IconButton
                    sx={{
                      background: "#e8f5e9",
                      color: "#2e7d32",
                      width: 42,
                      height: 42,
                      "&:hover": {
                        background: "#c8e6c9",
                      },
                    }}
                  >
                    <CheckCircleIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    sx={{
                      background: "#ffebee",
                      color: "#d32f2f",
                      width: 42,
                      height: 42,
                      "&:hover": {
                        background: "#ffcdd2",
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    sx={{
                      background: "#e3f2fd",
                      color: "#1976d2",
                      width: 42,
                      height: 42,
                      "&:hover": {
                        background: "#bbdefb",
                      },
                    }}
                  >
                    <ChatIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Stack>
    </Card>
  );
};

export default RequestCard;