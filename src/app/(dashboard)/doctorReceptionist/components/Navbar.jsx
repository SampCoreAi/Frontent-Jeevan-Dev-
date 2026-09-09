"use client";

import React from "react";
import { Grid, Typography, InputBase, IconButton, Box } from "@mui/material";
import {
  NotificationsActiveRounded,
  CalendarMonthRounded,
  ChatRounded,
  Search,
  Menu,
} from "@mui/icons-material";

const Navbar = ({ title, onMenuClick }) => {
  return (
    <Grid
      container
      sx={{
        backgroundColor: "#ffffff",
        minHeight: 80,
        display: "flex",
        alignItems: "center",
        paddingX: { xs: 2, sm: 3, md: 4 },
        paddingY: { xs: 1, sm: 0 },
        borderBottom: "1px solid #e0e0e0",
        justifyContent: "space-between",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        flexWrap: { xs: "wrap", sm: "nowrap" },
        gap: { xs: 2, sm: 0 },
      }}
    >
      {/* Left Section - Menu Button & Title */}
      <Grid
        item
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          minWidth: 0,
          flex: { xs: "1 1 auto", sm: "0 0 auto" },
        }}
      >
        {/* Mobile Menu Button */}
        <IconButton
          onClick={onMenuClick}
          sx={{
            display: { xs: "flex", sm: "none" },
            color: "#153933",
          }}
        >
          <Menu />
        </IconButton>

        {/* Page Title */}
        <Typography
          variant="h5"
          fontWeight={700}
          color="#153933"
          sx={{
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </Typography>
      </Grid>

      {/* Right Section - Search + Icons */}
      <Grid
        item
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 2, md: 3 },
          minWidth: 0,
          flex: { xs: "1 1 100%", sm: "0 0 auto" },
          justifyContent: { xs: "space-between", sm: "flex-end" },
          order: { xs: 2, sm: 1 },
        }}
      >
        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            paddingX: { xs: 1.5, sm: 2 },
            width: { xs: "100%", sm: 200, md: 280 },
            height: { xs: 36, sm: 42 },
            gap: 1.5,
            borderRadius: 3,
            border: "1px solid #e0e0e0",
            transition: "all 0.2s ease",
            "&:hover": { backgroundColor: "#eeeeee" },
            flex: { xs: "1 1 auto", sm: "0 0 auto" },
          }}
        >
          <Search style={{ width: 20, height: 20, color: "#666" }} />
          <InputBase
            placeholder="Search..."
            sx={{
              fontSize: { xs: 13, sm: 14 },
              color: "#333",
              width: "100%",
              "& input": {
                padding: 0,
              },
            }}
          />
        </Box>

        {/* Notification Icons */}
        <Box
          sx={{
            display: "flex",
            gap: { xs: 1, sm: 2 },
            flexShrink: 0,
          }}
        >
          <IconButton
            size="small"
            sx={{
              color: "#666",
              "&:hover": { color: "#14b8a6", backgroundColor: "transparent" },
              padding: { xs: 0.5, sm: 1 },
            }}
          >
            <NotificationsActiveRounded
              sx={{
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
              }}
            />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color: "#666",
              "&:hover": { color: "#14b8a6", backgroundColor: "transparent" },
              padding: { xs: 0.5, sm: 1 },
            }}
          >
            <CalendarMonthRounded
              sx={{
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
              }}
            />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color: "#666",
              "&:hover": { color: "#14b8a6", backgroundColor: "transparent" },
              padding: { xs: 0.5, sm: 1 },
            }}
          >
            <ChatRounded
              sx={{
                width: { xs: 20, sm: 24 },
                height: { xs: 20, sm: 24 },
              }}
            />
          </IconButton>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Navbar;