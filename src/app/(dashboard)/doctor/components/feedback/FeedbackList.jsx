"use client";
import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Rating,
  Stack,
} from "@mui/material";

const FeedbackList = ({ feedbacks = [] }) => {
  return (
    <Box sx={{ mt: 3 }}>
      {feedbacks.map((item) => {
        const dateTime = new Date(item.created_at).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <Paper
            key={item.id}
            elevation={0}
            sx={{
              p: 2.5,
              mb: 2.5,
              borderRadius: 4,
              border: "1px solid #afafaf",
              backgroundColor: "#fff",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "center", sm: "flex-start" }}
            >
              {/* Avatar */}
              <Avatar
                sx={{
                  bgcolor: "#1e6658",
                  width: 48,
                  height: 48,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {item?.full_name?.charAt(0)?.toUpperCase() || "A"}
              </Avatar>

              {/* Content */}
              <Box
                sx={{
                  flex: 1,
                  width: "100%",
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                {/* Header */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "center", sm: "flex-start" }}
                  spacing={1}
                >
                  {/* Left Side */}
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "#1f1f1f",
                      }}
                    >
                   {item?.full_name || "Anonymous"}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: "#8a8a8a",
                        fontSize: "0.8rem",
                      }}
                    >
                      {dateTime}
                    </Typography>
                  </Box>

                  {/* Right Side Rating */}
                  <Rating
                    value={item.rating || 0}
                    readOnly
                    size="small"
                    sx={{
                      mt: { xs: 0.5, sm: 0 },
                    }}
                  />
                </Stack>
                {/* Message Bubble */}
                <Box
                  sx={{
                    mt: 1.8,
                    p: 1.8,
                    borderRadius: 3,
                    backgroundColor: "#f6f8f9",
                    border: "1px solid #edf0f2",
                    maxWidth: { xs: "100%", sm: "75%" },
                    mx: { xs: "auto", sm: 0 },
                  }}
                >
                  <Typography
                    sx={{
                      color: "#444",
                      lineHeight: 1.7,
                      fontSize: "0.95rem",
                    }}
                  >
                    {item.feedback_text}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>
        );
      })}
    </Box>
  );
};

export default FeedbackList;