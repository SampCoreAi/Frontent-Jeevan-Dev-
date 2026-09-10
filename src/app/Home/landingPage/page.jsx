"use client";
import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../components/landing/SearchBar";
import HeroContent from "../components/landing/HeroContent";
import QuickTools from "../components/landing/QuickTools";
import {
  Box,
  Container,
  Typography,
  Fade,
  Zoom,
  Paper,
  Skeleton,
  styled,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AppsIcon from "@mui/icons-material/Apps";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { keyframes } from "@mui/material";
import JeevanDevLogo from '../components/landing/JeevanDevLogo'
import AppSvg from '../components/landing/AppSvg'
import Navbar from "../components/Navbar";
import PopularSearches from "../components/landing/PopularSearches";
import { RadialOrbitalTimelineDemo } from '../components/feature/demo'
import Footer from "../components/Footer";
import HowItWorks from "../components/landing/HowItWorks";
import HealthInfoCard from "../components/landing/HealthInfoCard";
import Main from "../components/DoctorRegister/EntryDoctor"
// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(1); box-shadow: 0 0 20px rgba(30, 102, 88, 0.2); }
  50% { opacity: 1; transform: scale(1.05); box-shadow: 0 0 40px rgba(30, 102, 88, 0.4); }
`;

const slideUpFade = keyframes`
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const rotateContinuous = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const StyledContainer = styled(Container)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 40px rgba(31, 38, 135, 0.15)",
  },
}));

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [city, setCity] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSearch, setActiveSearch] = useState("All");
  const [hoveredCard, setHoveredCard] = useState(null);

  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));



  const popularSearches = [
    "All",
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Dermatology",
    "Orthopedics",
    "Ophthalmology",
    "Dentistry",
    "Psychiatry",
  ];

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;
      const queryParams = new URLSearchParams({
        query: searchQuery,
        city: city || "all",
      });
      router.push(`/Home/pages/search?${queryParams.toString()}`);
    },
    [searchQuery, city, router],
  );

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  if (isLoading) {
    return (
      <Box
        sx={{
          bgcolor: "#f8fafc",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Skeleton
            variant="circular"
            width={60}
            height={60}
            sx={{ bgcolor: "#1e6658", opacity: 0.2 }}
          />
          <Box
            sx={{
              position: "absolute",
              top: -10,
              left: -10,
              right: -10,
              bottom: -10,
              borderRadius: "50%",
              border: "2px solid #1e6658",
              borderTopColor: "transparent",
              animation: `${rotateContinuous} 1s linear infinite`,
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8fafc", overflow: "hidden" }}>
      <Navbar />

      <Box
        sx={{
          background:
            "linear-gradient(135deg, #f0fdf4 0%, #f0f0f0 50%, #f8fafc 100%)",
          pt: { xs: 12, md: 6 },
          pb: { xs: 8, md: 12 },
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: "auto", md: "90vh" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",

        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          {/* Gradient */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, #dcfce7 0%, #ecfdf5 45%, #ffffff 100%)",
            }}
          />

          {/* Large Grid */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: 0.18,
              backgroundImage: `
        linear-gradient(to right,#16a34a 1px,transparent 1px),
        linear-gradient(to bottom,#16a34a 1px,transparent 1px)
      `,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Small Grid */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: 0.08,
              backgroundImage: `
        linear-gradient(to right,#15803d 1px,transparent 1px),
        linear-gradient(to bottom,#15803d 1px,transparent 1px)
      `,
              backgroundSize: "20px 20px",
            }}
          />

          {/* White Radial */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at center,transparent 0%,rgba(255,255,255,.3) 50%,rgba(255,255,255,.9) 100%)",
            }}
          />
        </Box>


        {/* Quick Access Menu - Desktop */}
        {!isMobile && (
          <Zoom
            in={isVisible}
            timeout={800}
            style={{ transitionDelay: "500ms" }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 30,
                right: 30,
                zIndex: 10,
              }}
            >
              <GlassCard
                sx={{
                  width: 50,
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  borderRadius: "14px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "scale(1.1) rotate(90deg)",
                    bgcolor: "#1e6658",
                    "& svg": { color: "white" },
                  },
                }}
              >
                <AppsIcon sx={{ width: 24, height: 24, color: "#1e6658" }} />
              </GlassCard>
            </Box>
          </Zoom>
        )}

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
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.1)",
                bgcolor: "#f0fdf4",
              },
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
          <Typography
            variant="h6"
            sx={{ mb: 3, fontWeight: 700, color: "#1e6658" }}
          >
            Quick Tools
          </Typography>
          <List>
            <ListItem
              button
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: "#f0fdf4",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "#e3fced",
                  transform: "translateX(5px)",
                },
              }}
            >
              <DocumentScannerIcon sx={{ mr: 2, color: "#1e6658" }} />
              <ListItemText primary="AI Scanner" />
            </ListItem>
            <ListItem
              button
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: "#f0f9ff",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "#e0f2fe",
                  transform: "translateX(5px)",
                },
              }}
            >
              <TrendingUpIcon sx={{ mr: 2, color: "#0ea5e9" }} />
              <ListItemText primary="Health Trends" />
            </ListItem>
          </List>
          <Divider sx={{ my: 2 }} />
        </Drawer>

        <StyledContainer maxWidth="lg">
          <HeroContent />
          <SearchBar />

          <PopularSearches
            popularSearches={popularSearches}
            activeSearch={activeSearch}
            setActiveSearch={setActiveSearch}
            setSearchQuery={setSearchQuery}
            setCity={setCity}
            isVisible={isVisible}
            slideUpFade={slideUpFade}
          />

        </StyledContainer>

      </Box>
      <div >
        <RadialOrbitalTimelineDemo />
      </div>
      <HowItWorks />
      <AppSvg />
      <Main />
      <JeevanDevLogo />
      <Footer />
    </Box>
  );
}
