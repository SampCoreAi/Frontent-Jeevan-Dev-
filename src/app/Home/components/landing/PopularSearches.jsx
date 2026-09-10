"use client";
import React from "react";
import { Box, Fade } from "@mui/material";

export default function PopularSearches({
  popularSearches,
  activeSearch,
  setActiveSearch,
  setSearchQuery,
  setCity,
  isVisible,
  slideUpFade,
}) {
  return (
    <Fade in={isVisible} timeout={1400} style={{ transitionDelay: "600ms" }}>
      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: { xs: 1, sm: 2 },
          flexWrap: "wrap",
          px: { xs: 2, sm: 4, md: 10, lg: 20 },
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        {popularSearches.map((search, index) => {
          const isActive = activeSearch === search;

          return (
            <Box
              key={index}
              onClick={() => {
                setActiveSearch(search);
                setSearchQuery(search);
                setCity("bangalore");
              }}
              sx={{
                px: { xs: 1.5, sm: 2 },
                py: { xs: 1, sm: 1.5 },
                borderRadius: 2,
                fontSize: { xs: "0.875rem", sm: "1rem" },
                bgcolor: isActive ? "#1e6658" : "#fff",
                color: isActive ? "#fff" : "#1e6658",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                whiteSpace: "nowrap",
                position: "relative",
                overflow: "hidden",
                animation: `${slideUpFade} 0.5s ease-out ${
                  index * 0.05
                }s both`,
                boxShadow: isActive
                  ? "0 4px 15px rgba(30, 102, 88, 0.3)"
                  : "0 2px 8px rgba(0,0,0,0.05)",
                "&:hover": {
                  bgcolor: isActive
                    ? "#1e6658"
                    : "rgba(30, 102, 88, 0.1)",
                  transform: "translateY(-3px) scale(1.05)",
                  boxShadow: "0 6px 20px rgba(30, 102, 88, 0.2)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  transition: "left 0.5s",
                },
                "&:hover::before": {
                  left: "100%",
                },
              }}
            >
              {search}
            </Box>
          );
        })}
      </Box>
      
    </Fade>
  );
}
