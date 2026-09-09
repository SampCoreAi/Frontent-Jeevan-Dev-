"use client";

import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { VisibilityOutlined } from "@mui/icons-material";

const DocumentButton = ({ title, path, getFileUrl }) => {
  if (!path) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: "10px",
          color: "#94a3b8",
        }}
      >
        {title}: Not Available
      </Paper>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.72rem",
            color: "#64748b",
            mt: 0.3,
            wordBreak: "break-all",
          }}
        >
          {path}
        </Typography>
      </Box>
      <Button
        component="a"
        href={getFileUrl(path)}
        target="_blank"
        rel="noopener noreferrer"
        variant="outlined"
        startIcon={<VisibilityOutlined />}
        sx={{
          flexShrink: 0,
          borderColor: "#1e6658",
          color: "#1e6658",
          borderRadius: "8px",
          textTransform: "none",
          "&:hover": {
            borderColor: "#155347",
            backgroundColor: "#f0fdf9",
          },
        }}
      >
        View
      </Button>
    </Paper>
  );
};

export default DocumentButton;