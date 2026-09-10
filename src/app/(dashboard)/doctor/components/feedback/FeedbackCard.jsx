import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const FeedbackCard = ({ title, value, icon }) => {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        borderRadius: 3,
        boxShadow: 1,
        border: "1px solid #1e6658",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 4,
        },
      }}
    >
      {/* Text */}
      <CardContent sx={{ p: 0 }}>
        <Typography
          variant="subtitle1"
          sx={{ color: "#1e6658", fontWeight: 600 }}
        >
          {title}
        </Typography>

        <Typography
          variant="h6"
          sx={{ color: "#1e6658", fontWeight: 500 }}
        >
          {value}
        </Typography>
      </CardContent>

      {/* Icon */}
      <Box
        sx={{
          backgroundColor: "#e8f5f2",
          borderRadius: 2,
          p: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#1e6658",
          "& svg": { fontSize: 30 },
        }}
      >
        {icon}
      </Box>
    </Card>
  );
};

export default FeedbackCard;