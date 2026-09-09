"use client";

import { Box, Typography, Container, Divider, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useState } from "react";

export default function Footer() {
  const [openSections, setOpenSections] = useState({
    quickLinks: false,
    services: false,
    support: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Social Media Icons
  const socialLinks = [
    { icon: FacebookIcon, url: "#", color: "#1877F2" },
    { icon: TwitterIcon, url: "#", color: "#1DA1F2" },
    { icon: InstagramIcon, url: "#", color: "#E4405F" },
    { icon: LinkedInIcon, url: "#", color: "#0A66C2" },
    { icon: YouTubeIcon, url: "#", color: "#FF0000" },
  ];

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #e5f3e9 0%, #d4ece0 100%)",
        py: { xs: 4, md: 6 },
        mt: "auto",
        borderTop: "1px solid rgba(30, 102, 88, 0.15)",
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Box
          sx={{
            display: { xs: "block", md: "flex" },
            flexDirection: { md: "row" },
            justifyContent: "space-between",
            alignItems: { md: "flex-start" },
            gap: { md: 6 },
          }}
        >
          {/* Left Side - Logo & Description */}
          <Box
            sx={{
              maxWidth: { md: "320px" },
              textAlign: { xs: "center", md: "left" },
              mb: { xs: 4, md: 0 },
            }}
          >
            <Box 
              sx={{ 
                display: "flex", 
                justifyContent: { xs: "center", md: "flex-start" },
                mb: 2,
              }}
            >
              <img
                src="/img/icon1.png"
                alt="Logo"
                style={{
                  width: "120px",
                  height: "auto",
                  maxWidth: "100%",
                }}
              />
            </Box>

            <Typography
              sx={{
                color: "#2d3748",
                fontSize: { xs: "0.85rem", md: "0.95rem" },
                lineHeight: 1.6,
                px: { xs: 2, md: 0 },
                mb: 2,
              }}
            >
              Helping you find trusted and certified doctors with ease. Your health is our priority.
            </Typography>

            {/* Social Media Icons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
                gap: 1,
                mt: 2,
              }}
            >
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <IconButton
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      width: { xs: 36, md: 40 },
                      height: { xs: 36, md: 40 },
                      bgcolor: "white",
                      color: social.color,
                      "&:hover": {
                        bgcolor: social.color,
                        color: "white",
                        transform: "translateY(-3px)",
                        boxShadow: `0 4px 12px ${social.color}40`,
                        transition: "all 0.3s ease",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Icon sx={{ fontSize: { xs: 18, md: 20 } }} />
                  </IconButton>
                );
              })}
            </Box>
          </Box>

          {/* Right Side - Links */}
          <Box
            sx={{
              display: { xs: "block", md: "flex" },
              gap: { md: 6 },
              width: { xs: "100%", md: "auto" },
            }}
          >
            {/* Quick Links */}
            <Box sx={{ mb: { xs: 2, md: 0 } }}>
              <Typography
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                  color: "#1e6658",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: { xs: "pointer", md: "default" },
                  py: { xs: 1.5, md: 0 },
                  borderBottom: { xs: "2px solid rgba(30, 102, 88, 0.1)", md: "none" },
                  position: "relative",
                  "&::after": {
                    content: { md: '""' },
                    position: { md: "absolute" },
                    bottom: { md: "-4px" },
                    left: { md: 0 },
                    width: { md: "30px" },
                    height: { md: "2px" },
                    bgcolor: { md: "#1e6658" },
                    borderRadius: { md: "2px" },
                  },
                }}
                onClick={() => toggleSection("quickLinks")}
              >
                Quick Links
                <KeyboardArrowDownIcon
                  sx={{
                    display: { xs: "block", md: "none" },
                    transform: openSections.quickLinks ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                    color: "#1e6658",
                  }}
                />
              </Typography>
              <Box
                sx={{
                  display: { xs: openSections.quickLinks ? "block" : "none", md: "block" },
                  mt: { xs: 1.5, md: 2 },
                }}
              >
                {["Home", "Find Doctors", "Specialties", "About Us", "Contact"].map((item, index) => (
                  <Typography
                    key={item}
                    sx={{
                      fontSize: { xs: "0.8rem", md: "0.9rem" },
                      color: "#4a5568",
                      cursor: "pointer",
                      "&:hover": {
                        color: "#1e6658",
                        transform: { md: "translateX(5px)" },
                        transition: "all 0.3s ease",
                      },
                      py: 0.8,
                      textAlign: { xs: "center", md: "left" },
                      borderBottom: { xs: index < 4 ? "1px solid rgba(0,0,0,0.05)" : "none" },
                      transition: "all 0.3s ease",
                      fontWeight: { md: 400 },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>

            {/* Services */}
            <Box sx={{ mb: { xs: 2, md: 0 } }}>
              <Typography
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                  color: "#1e6658",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: { xs: "pointer", md: "default" },
                  py: { xs: 1.5, md: 0 },
                  borderBottom: { xs: "2px solid rgba(30, 102, 88, 0.1)", md: "none" },
                  position: "relative",
                  "&::after": {
                    content: { md: '""' },
                    position: { md: "absolute" },
                    bottom: { md: "-4px" },
                    left: { md: 0 },
                    width: { md: "30px" },
                    height: { md: "2px" },
                    bgcolor: { md: "#1e6658" },
                    borderRadius: { md: "2px" },
                  },
                }}
                onClick={() => toggleSection("services")}
              >
                Services
                <KeyboardArrowDownIcon
                  sx={{
                    display: { xs: "block", md: "none" },
                    transform: openSections.services ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                    color: "#1e6658",
                  }}
                />
              </Typography>
              <Box
                sx={{
                  display: { xs: openSections.services ? "block" : "none", md: "block" },
                  mt: { xs: 1.5, md: 2 },
                }}
              >
                {["Appointments", "Doctors", "Clinics", "Consultation"].map((item, index) => (
                  <Typography
                    key={item}
                    sx={{
                      fontSize: { xs: "0.8rem", md: "0.9rem" },
                      color: "#4a5568",
                      cursor: "pointer",
                      "&:hover": {
                        color: "#1e6658",
                        transform: { md: "translateX(5px)" },
                        transition: "all 0.3s ease",
                      },
                      py: 0.8,
                      textAlign: { xs: "center", md: "left" },
                      borderBottom: { xs: index < 3 ? "1px solid rgba(0,0,0,0.05)" : "none" },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>

            {/* Support */}
            <Box>
              <Typography
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                  color: "#1e6658",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: { xs: "pointer", md: "default" },
                  py: { xs: 1.5, md: 0 },
                  borderBottom: { xs: "2px solid rgba(30, 102, 88, 0.1)", md: "none" },
                  position: "relative",
                  "&::after": {
                    content: { md: '""' },
                    position: { md: "absolute" },
                    bottom: { md: "-4px" },
                    left: { md: 0 },
                    width: { md: "30px" },
                    height: { md: "2px" },
                    bgcolor: { md: "#1e6658" },
                    borderRadius: { md: "2px" },
                  },
                }}
                onClick={() => toggleSection("support")}
              >
                Support
                <KeyboardArrowDownIcon
                  sx={{
                    display: { xs: "block", md: "none" },
                    transform: openSections.support ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                    color: "#1e6658",
                  }}
                />
              </Typography>
              <Box
                sx={{
                  display: { xs: openSections.support ? "block" : "none", md: "block" },
                  mt: { xs: 1.5, md: 2 },
                }}
              >
                {["Help Center", "Privacy Policy", "Terms & Conditions", "Contact Us"].map((item, index) => (
                  <Typography
                    key={item}
                    sx={{
                      fontSize: { xs: "0.8rem", md: "0.9rem" },
                      color: "#4a5568",
                      cursor: "pointer",
                      "&:hover": {
                        color: "#1e6658",
                        transform: { md: "translateX(5px)" },
                        transition: "all 0.3s ease",
                      },
                      py: 0.8,
                      textAlign: { xs: "center", md: "left" },
                      borderBottom: { xs: index < 3 ? "1px solid rgba(0,0,0,0.05)" : "none" },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Divider
          sx={{
            mt: { xs: 3, md: 4 },
            mb: { xs: 2, md: 3 },
            borderColor: "rgba(30, 102, 88, 0.15)",
            borderWidth: "1px",
          }}
        />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: { xs: 1, sm: 0 },
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "0.7rem", md: "0.85rem" },
              color: "#718096",
            }}
          >
            © {new Date().getFullYear()} Healthcare App. All rights reserved.
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "0.65rem", md: "0.8rem" },
              color: "#718096",
              display: "flex",
              gap: 2,
            }}
          >
            <span style={{ cursor: "pointer", "&:hover": { color: "#1e6658" } }}>
              Privacy Policy
            </span>
            <span style={{ cursor: "pointer", "&:hover": { color: "#1e6658" } }}>
              Terms of Service
            </span>
            <span style={{ cursor: "pointer", "&:hover": { color: "#1e6658" } }}>
              Cookies
            </span>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}