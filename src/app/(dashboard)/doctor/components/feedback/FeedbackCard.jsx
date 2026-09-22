import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const FeedbackCard = ({ title, value, icon }) => {
  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",
        border: "1px solid",
        borderColor: "#b1b1b1",
        borderRadius: "10px",
        py:1,
        bgcolor: "background.paper",
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 4px 14px rgba(15, 23, 42, 0.07)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent
        sx={{
          p: { xs: 1.5, sm: 1.8 },
          "&:last-child": {
            pb: { xs: 1.5, sm: 1.8 },
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              mb: 0.5,
              fontSize: "12.5px",
              fontWeight: 500,
              lineHeight: 1.4,
              color: "text.secondary",
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "19px", sm: "21px" },
              fontWeight: 700,
              lineHeight: 1.2,
              color: "text.primary",
            }}
          >
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 42,
            height: 42,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "9px",
            bgcolor: "rgba(15, 116, 104, 0.08)",
            color: "primary.main",
            "& svg": {
              fontSize: 21,
            },
          }}
        >
          {icon}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;