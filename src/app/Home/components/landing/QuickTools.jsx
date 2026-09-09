"use client";
import React, { useState } from "react";
import {
  Box,
  Menu,
  Grid,
  Paper,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import MenuIcon from "@mui/icons-material/Menu";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useTheme } from "@mui/material/styles";
import { Fade, Zoom } from "@mui/material";

export default function QuickTools({ specialties = [], activeSearch, setActiveSearch, setSearchQuery }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <>
      {/* Desktop Quick Tools */}
      {!isMobile && (
        <Zoom in timeout={800} style={{ transitionDelay: "500ms" }}>
          <Box
            onClick={handleClick}
            sx={{
              position: "absolute",
              top: 30,
              right: 30,
              zIndex: 10,
            }}
          >
            <Paper
              sx={{
                width: 50,
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                borderRadius: "14px",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1) rotate(90deg)",
                  bgcolor: "#1e6658",
                  "& svg": { color: "white" },
                },
              }}
            >
              <AppsIcon sx={{ width: 24, height: 24, color: "#1e6658" }} />
            </Paper>
          </Box>
        </Zoom>
      )}

      {/* Desktop Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        disableScrollLock
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: "20px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "visible",
          },
        }}
      >
        <Box sx={{ p: 2, minWidth: 320 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, color: "#64748b", fontWeight: 600 }}>
            Quick Tools
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                  borderRadius: "16px",
                  cursor: "pointer",
                  bgcolor: "#f0fdf4",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#1e6658",
                    transform: "translateY(-4px) scale(1.02)",
                  },
                }}
              >
                <DocumentScannerIcon sx={{ fontSize: 32, color: "#1e6658", mb: 1 }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  AI Scanner
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                  borderRadius: "16px",
                  cursor: "pointer",
                  bgcolor: "#f0f9ff",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#0ea5e9",
                    transform: "translateY(-4px) scale(1.02)",
                  },
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 32, color: "#0ea5e9", mb: 1 }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Health Trends
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Menu>

      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          onClick={toggleMobileMenu}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 10,
            bgcolor: "white",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: {
            width: 280,
            borderRadius: "20px 0 0 20px",
            p: 2,
            background: "linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)",
          },
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: "#1e6658" }}>
          Quick Tools
        </Typography>

        <List>
          <ListItem button>
            <DocumentScannerIcon sx={{ mr: 2, color: "#1e6658" }} />
            <ListItemText primary="AI Scanner" />
          </ListItem>
          <ListItem button>
            <TrendingUpIcon sx={{ mr: 2, color: "#0ea5e9" }} />
            <ListItemText primary="Health Trends" />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 2, color: "#64748b" }}>
          Specialties
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {specialties.slice(0, 6).map((spec) => (
            <Paper
              key={spec}
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: 5,
                fontSize: "0.875rem",
                bgcolor: spec === activeSearch ? "#1e6658" : "#f1f5f9",
                color: spec === activeSearch ? "white" : "#64748b",
                cursor: "pointer",
              }}
              onClick={() => {
                setActiveSearch(spec);
                setSearchQuery(spec);
                setMobileMenuOpen(false);
              }}
            >
              {spec}
            </Paper>
          ))}
        </Box>
      </Drawer>
    </>
  );
}
