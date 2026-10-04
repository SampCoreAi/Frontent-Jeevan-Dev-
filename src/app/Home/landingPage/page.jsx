"use client";
import Lenis from "lenis";
import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../components/landing/SearchBar";
import HeroContent from "../components/landing/HeroContent";
import JeevanShowcase from "../components/MobileUi/JeevanShowcase";
import {
  Box,
  Container,
  Typography,
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
import JeevanDevLogo from "../components/landing/JeevanDevLogo";
import AppSvg from "../components/landing/AppSvg";
import Navbar from "../components/Navbar";
import PopularSearches from "../components/landing/PopularSearches";
import { RadialOrbitalTimelineDemo } from "../components/feature/demo";
import Footer from "../components/Footer";
import HowItWorks from "../components/landing/HowItWorks";
import Main from "../components/DoctorRegister/EntryDoctor";
import ElasticLine from "../components/ElasticLine";
import HealthcareEcosystem from "../components/landing/HealthcareEcosystem";
import FeedbackCTA from "../components/landing/FeedbackCTA";
const slideUpFade = keyframes`
  0% {
    opacity: 0;
    transform: translateY(40px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const rotateContinuous = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const StyledContainer = styled(Container)(() => ({
  position: "relative",
  zIndex: 1,
}));

const GlassCard = styled(Paper)(() => ({
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(236,253,245,0.96) 45%, rgba(224,242,254,0.80) 100%)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(7,135,106,0.12)",
  boxShadow: "0 10px 30px rgba(7,135,106,0.08)",
  transition: "all 0.3s ease",

  "&:hover": {
    boxShadow: "0 14px 38px rgba(7,135,106,0.15)",
  },
}));

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [city, setCity] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSearch, setActiveSearch] = useState("All");

  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });

    let rafId;

    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

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

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          bgcolor: "#F8FAFC",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
          }}
        >
          <Skeleton
            variant="circular"
            width={60}
            height={60}
            sx={{
              bgcolor: "#07876A",
              opacity: 0.2,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              top: -10,
              left: -10,
              right: -10,
              bottom: -10,
              borderRadius: "50%",
              border: "2px solid #07876A",
              borderTopColor: "transparent",
              animation: `${rotateContinuous} 1s linear infinite`,
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "#F8FAFC",
        overflowX: "clip",
      }}
    >
      <Navbar />

      <Box
        sx={{
          backgroundColor: "#FFFFFF",

         backgroundImage: `
  linear-gradient(
    90deg,
    rgba(7, 135, 106, 0.13) 0%,
    rgba(7, 135, 106, 0.05) 25%,
    rgba(255, 255, 255, 0.35) 45%,
    rgba(255, 255, 255, 0.35) 55%,
    rgba(7, 135, 106, 0.05) 75%,
    rgba(7, 135, 106, 0.13) 100%
  ),

  linear-gradient(
    135deg,
    rgba(7, 135, 106, 0.09) 0%,
    rgba(52, 211, 153, 0.035) 45%,
    rgba(255, 255, 255, 0.08) 100%
  ),

  linear-gradient(
    rgba(7, 135, 106, 0.10) 1px,
    transparent 1px
  ),

  linear-gradient(
    90deg,
    rgba(7, 135, 106, 0.10) 1px,
    transparent 1px
  )
`,


          backgroundSize: `
      100% 100%,
      40px 40px,
      40px 40px,
      40px 40px
    `,

          backgroundPosition: `
      center,
      0 0,
      0 0,
      0 0
    `,

          pt: {
            xs: 6,
            md: 2,
          },

          textAlign: "center",
          position: "relative",
          overflow: "hidden",

          minHeight: {
            xs: "auto",
            md: "90vh",
          },

          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {!isMobile && (
          <Zoom
            in={isVisible}
            timeout={800}
            style={{
              transitionDelay: "500ms",
            }}
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

                  "&:hover": {
                    transform: "scale(1.08) rotate(90deg)",

                    "& svg": {
                      color: "#07876A",
                    },
                  },
                }}
              >
                <AppsIcon
                  sx={{
                    width: 24,
                    height: 24,
                    color: "#07876A",
                  }}
                />
              </GlassCard>
            </Box>
          </Zoom>
        )}

        {isMobile && (
          <IconButton
            onClick={toggleMobileMenu}
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              zIndex: 10,

              background: "linear-gradient(135deg, #FFFFFF 0%, #ECFDF5 100%)",

              border: "1px solid rgba(7,135,106,0.12)",

              boxShadow: "0 8px 25px rgba(7,135,106,0.10)",

              "&:hover": {
                background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={toggleMobileMenu}
          PaperProps={{
            sx: {
              width: 280,
              borderRadius: "20px 0 0 20px",
              p: 2,

              background: `
                linear-gradient(
                  160deg,
                  #FFFFFF 0%,
                  #F0FDF4 45%,
                  #EFF6FF 100%
                )
              `,
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 700,
              color: "#07876A",
            }}
          >
            Quick Tools
          </Typography>

          <List>
            <ListItem
              button
              sx={{
                borderRadius: 2,
                mb: 1.2,

                background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",

                border: "1px solid rgba(16,185,129,0.12)",

                transition: "all 0.25s ease",

                "&:hover": {
                  transform: "translateX(5px)",

                  background:
                    "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
                },
              }}
            >
              <DocumentScannerIcon
                sx={{
                  mr: 2,
                  color: "#07876A",
                }}
              />

              <ListItemText primary="AI Scanner" />
            </ListItem>

            <ListItem
              button
              sx={{
                borderRadius: 2,
                mb: 1,

                background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",

                border: "1px solid rgba(59,130,246,0.12)",

                transition: "all 0.25s ease",

                "&:hover": {
                  transform: "translateX(5px)",

                  background:
                    "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",
                },
              }}
            >
              <TrendingUpIcon
                sx={{
                  mr: 2,
                  color: "#0284C7",
                }}
              />

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

      <ElasticLine />
      <HealthcareEcosystem />
      <ElasticLine />

      <div>
        <RadialOrbitalTimelineDemo />
      </div>
      <ElasticLine />
      <HowItWorks />
      <JeevanShowcase />
      <ElasticLine />
      {/* <AppSvg /> */}

      <Main />
<FeedbackCTA />
      <JeevanDevLogo />

      <Footer />
    </Box>
  );
}
