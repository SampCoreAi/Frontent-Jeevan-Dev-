"use client";

import {
  Box,
  Typography,
  Stack,
  Chip,
  Button,
  Divider,
  Accordion,
  
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Fade,
  Slide,
  Zoom,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import {
  ExpandMore,
  LocalHospital,
  WorkOutline,
  Star,
  AccessTime,
  VideoCall,
  AttachMoney,
  FilterList,
  Refresh,
} from "@mui/icons-material";
import { useState, useEffect } from "react";

export default function FiltersSidebar({
  selectedFilters,
  setSelectedFilters,
  onClose,
}) {
  const [mounted, setMounted] = useState(false);
  const [expandedPanels, setExpandedPanels] = useState(["specialization"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleFilter = (key, value) => {
  const filterValue =
    typeof value === "string" ? value.toLowerCase() : value;

  setSelectedFilters((prev) => ({
    ...prev,
    [key]: prev[key].includes(filterValue)
      ? prev[key].filter((v) => v !== filterValue)
      : [...prev[key], filterValue],
  }));
};

  const clearAllFilters = () => {
    setSelectedFilters({
      specialization: [],
      experience: [],
      rating: [],
      availability: [],
      consultationType: [],
      feeRange: [],
      gender: [],
    });
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanels((prev) =>
      isExpanded ? [...prev, panel] : prev.filter((p) => p !== panel)
    );
  };

  const filterSections = [
    {
      id: "specialization",
      title: "Specialization",
      icon: <LocalHospital sx={{ fontSize: 22 }} />,
      items: [
        "Cardiology",
        "Dermatology",
        "Neurology",
        "Orthopedics",
        "Pediatrics",
        "Gynecologist",

        "Ophthalmology",
        "Psychiatry",
        "Oncology",
      ],
      type: "chips",
    },
    {
      id: "experience",
      title: "Experience",
      icon: <WorkOutline sx={{ fontSize: 22 }} />,
      items: ["0-5 years", "5-10 years", "10-15 years", "15+ years"],
      type: "chips",
    },
    {
      id: "rating",
      title: "Rating",
      icon: <Star sx={{ fontSize: 22 }} />,
      items: [
        { label: "4+ Stars", value: "4" },
        { label: "3+ Stars", value: "3" },
        { label: "2+ Stars", value: "2" },
      ],
      type: "checkbox",
    },
    {
      id: "availability",
      title: "Availability",
      icon: <AccessTime sx={{ fontSize: 22 }} />,
      items: ["Available Today", "Available Tomorrow", "This Week"],
      type: "chips",
    },
    {
      id: "consultationType",
      title: "Consultation Type",
      icon: <VideoCall sx={{ fontSize: 22 }} />,
      items: ["In-Person", "Video Consult", "Chat"],
      type: "chips",
    },
    {
      id: "feeRange",
      title: "Fee Range",
      icon: <AttachMoney sx={{ fontSize: 22 }} />,
      items: ["0-500", "500-1000", "1000-2000", "2000+"],
      type: "chips",
      prefix: "₹",
    },
  ];

  const getActiveFiltersCount = () => {
    return Object.values(selectedFilters).flat().length;
  };

  return (
    <Box
      sx={{
        height: { xs: "100vh", md: "100%" }, // mobile full screen
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #fafbfc 0%, #f5f7fa 100%)",
        position: "relative",
        border: { xs: "none", md: "1px solid #a9cdc9" }, // mobile clean
        borderRadius: { xs: 0, md: 2 },
        overflow: "hidden",
        maxWidth: { xs: "100%", md: 350 },
        mx: "auto",

        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "200px",
          background:
            "linear-gradient(135deg, rgba(30, 102, 88, 0.05) 0%, rgba(22, 58, 74, 0.02) 100%)",
          pointerEvents: "none",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          pb: { xs: 1, md: 2 },
          gap: { xs: 1, md: 0 },

          position: "relative",
          zIndex: 1,
        }}
      >
        <Slide
          direction="down"
          in={mounted}
          timeout={600}
          style={{ transitionDelay: "100ms" }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #1e6658 0%, #163a4a 100%)",
                  boxShadow: "0 4px 15px rgba(30, 102, 88, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FilterList sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #1e6658 0%, #163a4a 100%)",
                    backgroundClip: "text",
                    textFillColor: "transparent",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Filters
                </Typography>

              </Box>
            </Stack>

            {getActiveFiltersCount() > 0 && (
              <Zoom in={true}>
                <Button
                  size="small"
                  startIcon={<Refresh sx={{ fontSize: 16 }} />}
                  onClick={clearAllFilters}
                  sx={{
                    color: "#1e6658",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(30, 102, 88, 0.08)",
                    },
                  }}
                >
                  Clear All
                </Button>
              </Zoom>
            )}
          </Stack>
        </Slide>
      </Box>

      {/* Filter Sections */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: { xs: 1.5, md: 2 },
          pb: { xs: 1, md: 2 },
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(30, 102, 88, 0.2)",
            borderRadius: "10px",
          },
        }}
      >
        {filterSections.map((section, index) => (
          <Fade
            key={section.id}
            in={mounted}
            timeout={800}
            style={{ transitionDelay: `${200 + index * 100}ms` }}
          >
            <Accordion
              expanded={expandedPanels.includes(section.id)}
              onChange={handleAccordionChange(section.id)}
              elevation={0}
              sx={{
                mb: { xs: 1, md: 1.5 },
                borderRadius: "16px !important",
                overflow: "hidden",
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.06)",
                  transform: "translateY(-2px)",
                },
                "&::before": {
                  display: "none",
                },
                "&.Mui-expanded": {
                  margin: "0 0 12px 0",
                  boxShadow: "0 12px 40px rgba(30, 102, 88, 0.1)",
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMore
                    sx={{
                      color: "#1e6658",
                      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: expandedPanels.includes(section.id)
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                }
                sx={{
                  px: { xs: 1.5, md: 2.5 },
                  py: { xs: 1, md: 1.5 },
                  minHeight: { xs: "48px", md: "56px" },
                  "& .MuiAccordionSummary-content": {
                    margin: "8px 0",
                  },
                  background:
                    expandedPanels.includes(section.id)
                      ? "linear-gradient(135deg, rgba(30, 102, 88, 0.08) 0%, rgba(22, 58, 74, 0.04) 100%)"
                      : "transparent",
                  transition: "background 0.3s ease",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      color: "#1e6658",
                      display: "flex",
                      alignItems: "center",
                      transition: "transform 0.3s ease",
                      transform: expandedPanels.includes(section.id)
                        ? "scale(1.1)"
                        : "scale(1)",
                    }}
                  >
                    {section.icon}
                  </Box>
                  <Typography
                    fontWeight={600}
                    sx={{
                      color: expandedPanels.includes(section.id)
                        ? "#1e6658"
                        : "text.primary",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {section.title}
                  </Typography>
                  {selectedFilters[section.id]?.length > 0 && (
                    <Zoom in={true}>
                      <Box
                        sx={{
                          ml: 1,
                          px: 1,
                          py: 0.25,
                          borderRadius: "10px",
                          background: "linear-gradient(135deg, #1e6658 0%, #163a4a 100%)",
                          color: "white",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          minWidth: "20px",
                          textAlign: "center",
                        }}
                      >
                        {selectedFilters[section.id].length}
                      </Box>
                    </Zoom>
                  )}
                </Stack>
              </AccordionSummary>

              <AccordionDetails
                sx={{
                  px: 2.5,
                  pb: 2.5,
                  pt: 1,
                }}
              >
                {section.type === "chips" ? (
                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={{ xs: 0.5, md: 1 }}
                    sx={{
                      animation: expandedPanels.includes(section.id)
                        ? "fadeInUp 0.4s ease forwards"
                        : "none",
                      "@keyframes fadeInUp": {
                        from: {
                          opacity: 0,
                          transform: "translateY(10px)",
                        },
                        to: {
                          opacity: 1,
                          transform: "translateY(0)",
                        },
                      },
                    }}
                  >
                    {section.items.map((item, itemIndex) => {
                      const value = typeof item === "object" ? item.value : item;
                      const label = typeof item === "object" ? item.label : item;
                     const normalizedValue =
  typeof value === "string" ? value.toLowerCase() : value;

const isSelected =
  selectedFilters[section.id].includes(normalizedValue);

                      return (
                        <Zoom
                          key={value}
                          in={expandedPanels.includes(section.id)}
                          timeout={300}
                          style={{
                            transitionDelay: `${itemIndex * 50}ms`,
                          }}
                        >
                         <Chip
  label={`${section.prefix || ""}${label}`}
  onClick={() => toggleFilter(section.id, value)}
  size="small"
  icon={
    isSelected ? (
      <CheckIcon
        sx={{
          color: "white !important",
          fontSize: "16px !important",
        }}
      />
    ) : undefined
  }
  sx={{
    borderRadius: "12px",
    px: 1,
    fontWeight: isSelected ? 700 : 500,
    fontSize: { xs: "0.75rem", md: "0.85rem" },
    py: { xs: 2, md: 2.5 },
    cursor: "pointer",

    background: isSelected
      ? "linear-gradient(135deg, #1e6658 0%, #163a4a 100%)"
      : "#fff",

    color: isSelected ? "#fff" : "#555",

    border: isSelected
      ? "2px solid #1e6658"
      : "1px solid rgba(0,0,0,0.10)",

    boxShadow: isSelected
      ? "0 4px 15px rgba(30, 102, 88, 0.35)"
      : "none",

    "&:hover": {
      background: isSelected
        ? "linear-gradient(135deg, #163a4a 0%, #1e6658 100%)"
        : "rgba(30, 102, 88, 0.08)",
    },
  }}
/>
                        </Zoom>
                      );
                    })}
                  </Stack>
                ) : (
                  <FormGroup
                    sx={{
                      animation: expandedPanels.includes(section.id)
                        ? "fadeInUp 0.4s ease forwards"
                        : "none",
                    }}
                  >
                    {section.items.map((item, itemIndex) => {
                      const isSelected = selectedFilters[section.id].includes(
                        item.value
                      );

                      return (
                        <Zoom
                          key={item.value}
                          in={expandedPanels.includes(section.id)}
                          timeout={300}
                          style={{
                            transitionDelay: `${itemIndex * 50}ms`,
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isSelected}
                                onChange={() =>
                                  toggleFilter(section.id, item.value)
                                }
                                sx={{
                                  color: "rgba(30, 102, 88, 0.3)",
                                  "&.Mui-checked": {
                                    color: "#1e6658",
                                  },
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 22,
                                    transition: "transform 0.2s ease",
                                  },
                                  "&:hover .MuiSvgIcon-root": {
                                    transform: "scale(1.1)",
                                  },
                                }}
                              />
                            }
                            label={
                              <Typography
                                sx={{
                                  fontWeight: isSelected ? 600 : 400,
                                  color: isSelected ? "#1e6658" : "text.primary",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                {item.label}
                              </Typography>
                            }
                            sx={{
                              mb: 1,
                              borderRadius: 2,
                              p: 0.5,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                backgroundColor: "rgba(30, 102, 88, 0.04)",
                              },
                            }}
                          />
                        </Zoom>
                      );
                    })}
                  </FormGroup>
                )}
              </AccordionDetails>
            </Accordion>
          </Fade>
        ))}
      </Box>

     
    </Box>
  );
}