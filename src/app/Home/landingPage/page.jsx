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
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { keyframes } from "@mui/material";
import JeevanDevLogo from "../components/landing/JeevanDevLogo";
import Navbar from "../components/Navbar";
import PopularSearches from "../components/landing/PopularSearches";
import { RadialOrbitalTimelineDemo } from "../components/feature/demo";
import Footer from "../components/Footer";
import HowItWorks from "../components/landing/HowItWorks";
import Main from "../components/DoctorRegister/EntryDoctor";
import HealthcareSplitRegister from "../components/feature/HealthcareSplitRegister";
import MedicalInvoice from "../../(dashboard)/medical/components/History/MedicalInvoice";
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
const revealSx = {
  animation: `${slideUpFade} 700ms ease-out both`,
};

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
        <Box sx={{ position: "relative" }}>
          <Skeleton
            variant="circular"
            width={60}
            height={60}
            sx={{ bgcolor: "#07876A", opacity: 0.2 }}
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
    <Box sx={{ bgcolor: "#F8FAFC", overflowX: "clip" }}>
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
          pt: { xs: 3, md: 0 },
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
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

        <StyledContainer
          maxWidth="lg"
          sx={{
            mt: { xs: -2, md: -3 },
            opacity: isVisible ? 1 : 0,
            animation: isVisible
              ? `${slideUpFade} 700ms ease-out both`
              : "none",
          }}
        >
          <HeroContent />

          <Box
            sx={{
              opacity: isVisible ? 1 : 0,
              animation: isVisible
                ? `${slideUpFade} 700ms ease-out 150ms both`
                : "none",
            }}
          >
            <SearchBar />
          </Box>

          <Box
            sx={{
              opacity: isVisible ? 1 : 0,
              animation: isVisible
                ? `${slideUpFade} 700ms ease-out 300ms both`
                : "none",
            }}
          >
            <PopularSearches
              popularSearches={popularSearches}
              activeSearch={activeSearch}
              setActiveSearch={setActiveSearch}
              setSearchQuery={setSearchQuery}
              setCity={setCity}
              isVisible={isVisible}
              slideUpFade={slideUpFade}
            />
          </Box>
        </StyledContainer>
      </Box>

        <MedicalInvoice />
      <ElasticLine />
      <Box sx={revealSx}>
        <HealthcareEcosystem />
      </Box>
      <ElasticLine />

      <Box sx={{ ...revealSx, animationDelay: "100ms" }}>
        <RadialOrbitalTimelineDemo />
      </Box>

      <ElasticLine />
      {/* <HealthcareSplitRegister /> */}

      <Box sx={{ ...revealSx, animationDelay: "150ms" }}>
        <HowItWorks />
      </Box>
      <Box sx={{ ...revealSx, animationDelay: "200ms" }}>
        <JeevanShowcase />
      </Box>
      <ElasticLine />
      <Box sx={{ ...revealSx, animationDelay: "250ms" }}>
        <Main />
      </Box>

      <Box sx={{ ...revealSx, animationDelay: "300ms" }}>
        <FeedbackCTA />
      </Box>
      <JeevanDevLogo />
      <Footer />
    </Box>
  );
}
