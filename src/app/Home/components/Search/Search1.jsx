// SearchPage.jsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,

  Pagination,
  Button,
  Drawer,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,

  IconButton,

  Skeleton,
  Fab,
  Chip,

  Card,
  CardContent,

} from "@mui/material";

import {
  Close,

  FilterList,
  Tune,
  Refresh,

} from "@mui/icons-material";

import Navbar from "../../components/Navbar";

import DoctorsGrid from "../../components/Search/DoctorsGrid";
import FiltersSidebar from "../../components/Search/FiltersSidebar";

// Theme Color - 1e6658
const THEME_COLOR = "#1e6658";
const THEME_COLOR_DARK = "#163a4a";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
const filter = searchParams.get("filter");

const isEmergency = filter === "emergency";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [filterDrawer, setFilterDrawer] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    specialization: [],
    experience: [],
    rating: [],
    availability: [],
    consultationType: [],
    gender: [],
    feeRange: [],
  });
  
  const [activeFilter, setActiveFilter] = useState("relevance");

  const itemsPerPage = isMobile ? 4 : 6;

useEffect(() => {
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      let searchValue = query || "";

      // Emergency button se aaye hain
      if (isEmergency) {
        searchValue = "Emergency";
      }

      // Normal search bhi nahi hai aur emergency bhi nahi
      if (!searchValue) {
        setResults([]);
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/doctors/doctor/search/`,
        {
          params: {
            search: searchValue,
          },
        }
      );

      if (res.data.success) {
        const mappedData = res.data.data.map((doc) => ({
          id: doc._id || doc.userId,
          userId: doc.userId || doc._id,

          name: doc.fullName,

          speciality:
            doc.specialization === "Cardiolody"
              ? "Cardiology"
              : doc.specialization === "Cardiologist"
                ? "Cardiology"
                : doc.specialization === "Neurologists"
                  ? "Neurology"
                  : doc.specialization,

          education: doc.qualification,
          experience: doc.experience,
          fee: doc.consultationFee,

          hospital: doc.hospitalDetail?.hospitalName,
          hospitalDetail: doc.hospitalDetail || [],

          city: doc.hospitalDetail?.[0]?.city || "",
          state: doc.hospitalDetail?.[0]?.state || "",

          rating: doc.avgRating || 0,
          hasRating: !!doc.avgRating,

          profileImage: doc.profileImage,

          availability: "Available Today",

          // IMPORTANT
          acceptEmergencyPatients: doc.acceptEmergencyPatients,
        }));

        setResults(mappedData);

        if (mappedData.length === 0) {
          setError(
            isEmergency
              ? "No emergency doctors found"
              : "No doctors found"
          );
        }
      } else {
        setResults([]);
        setError(
          isEmergency
            ? "No emergency doctors found"
            : "No doctors found"
        );
      }
    } catch (err) {
      console.error("Doctor search error:", err);

      setResults([]);
      setError("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  fetchDoctors();
}, [query, isEmergency]);

  const filteredResults = results.filter((doctor) => {
    // TAB FILTERS
    if (activeTab === 1 && doctor.rating < 4.5) return false;
    if (activeTab === 2 && doctor.availability !== "Available Today") return false;
    if (activeTab === 3 && !doctor.videoConsultation) return false;

    // 🔥 SPECIALIZATION
    if (
      selectedFilters.specialization.length > 0 &&
      !selectedFilters.specialization.includes(doctor.speciality)
    ) {
      return false;
    }

    // 🔥 EXPERIENCE
    if (selectedFilters.experience.length > 0) {
      const exp = parseInt(doctor.experience);

      const match = selectedFilters.experience.some((range) => {
        if (range === "0-5 years") return exp <= 5;
        if (range === "5-10 years") return exp > 5 && exp <= 10;
        if (range === "10-15 years") return exp > 10 && exp <= 15;
        if (range === "15+ years") return exp > 15;
        return false;
      });

      if (!match) return false;
    }

    // 🔥 RATING
    if (selectedFilters.rating.length > 0) {
      const match = selectedFilters.rating.some(
        (r) => doctor.rating >= Number(r)
      );
      if (!match) return false;
    }

    // 🔥 AVAILABILITY
    if (
      selectedFilters.availability.length > 0 &&
      !selectedFilters.availability.includes(doctor.availability)
    ) {
      return false;
    }

 

    // 🔥 FEE RANGE
    if (selectedFilters.feeRange.length > 0) {
      const match = selectedFilters.feeRange.some((range) => {
        if (range === "0-500") return doctor.fee <= 500;
        if (range === "500-1000") return doctor.fee > 500 && doctor.fee <= 1000;
        if (range === "1000-2000") return doctor.fee > 1000 && doctor.fee <= 2000;
        if (range === "2000+") return doctor.fee > 2000;
        return false;
      });

      if (!match) return false;
    }

    return true;
  });

  const pageCount = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
   
    <Box sx={{ bgcolor: "#fafbfc" }}>
      <Navbar />


      <Container maxWidth={false} sx={{ width: "99%", px: { xs: 2, md: 3 }, py: 4,  }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          {!isTablet && (
            <Grid size={{ lg: 3, xl: 2.5 }}>
              <Paper
                sx={{
                  position: "sticky",
                  top: 20,

                  border: `1px solid ${alpha(THEME_COLOR, 0.15)}`,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >

                <FiltersSidebar
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                />
              </Paper>
            </Grid>
          )}

          {/* Main Content */}
          <Grid size={{ xs: 12, lg: 9, xl: 9.5 }}>
            {/* Results Header */}
            <Paper
              sx={{
                mb: 3,
                px: { xs: 2, sm: 3 },
                py: 2,
                borderRadius: 2,
                border: "1px solid #a9cdc9",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                spacing={{ xs: 1.5, sm: 0 }}
              >
                {/* Title */}
              <Typography
  variant="h6"
  sx={{ fontWeight: 600, color: "#1a1a1a", flexShrink: 0 }}
>
  {isEmergency ? "Emergency Doctors Available" : "Doctors Available"}
</Typography>

                {/* Sort chips — scrollable on mobile, wrap on desktop */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    overflowX: { xs: "auto", sm: "visible" },
                    flexWrap: { xs: "nowrap", sm: "wrap" },
                    justifyContent: { xs: "flex-start", sm: "flex-end" },
                    pb: { xs: 0.5, sm: 0 },
                    width: { xs: "100%", sm: "auto" },
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                  }}
                >
                  {[
                    { label: "Relevance", value: "relevance" },
                    { label: "Rating", value: "rating" },
                    { label: "Experience", value: "experience" },
                    { label: "Fees: Low to High", value: "fees" },
                  ].map((item) => (
                    <Chip
                      key={item.value}
                      label={item.label}
                      clickable
                      onClick={() => setActiveFilter(item.value)}
                      sx={{
                        flexShrink: 0,
                        height: 34,
                        px: 1.5,
                        borderRadius: 18,
                        bgcolor:
                          activeFilter === item.value
                            ? alpha(THEME_COLOR, 0.08)
                            : "transparent",
                        border:
                          activeFilter === item.value
                            ? `1px solid ${THEME_COLOR}`
                            : `1px solid ${alpha(THEME_COLOR, 0.3)}`,
                        color:
                          activeFilter === item.value
                            ? THEME_COLOR
                            : alpha(THEME_COLOR, 0.7),
                        fontWeight: activeFilter === item.value ? 500 : 400,
                        fontSize: "0.8125rem",
                        "&:hover": {
                          bgcolor: alpha(THEME_COLOR, 0.04),
                          borderColor: THEME_COLOR,
                          color: THEME_COLOR,
                        },
                      }}
                    />
                  ))}
                </Box>
              </Stack>
            </Paper>



            {loading && (
              <Box>
                {[...Array(6)].map((_, index) => (
                  <Card key={index} sx={{ mb: 2, borderRadius: 3 }}>
                    <CardContent>
                      <Stack direction="row" spacing={2}>
                        <Skeleton variant="circular" width={80} height={80} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" width="60%" height={30} />
                          <Skeleton variant="text" width="40%" height={20} />
                          <Skeleton variant="text" width="80%" height={20} />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
            {error && (
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 3,
                  border: `1px solid ${alpha("#d32f2f", 0.2)}`,
                  bgcolor: alpha("#d32f2f", 0.05),
                }}
              >
                <Typography sx={{ color: "#d32f2f", mb: 2 }}>
                  {error}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  sx={{
                    bgcolor: THEME_COLOR,
                    "&:hover": { bgcolor: THEME_COLOR_DARK },
                  }}
                >
                  Try Again
                </Button>
              </Paper>
            )}

            {!loading && !error && (
              <>
                <DoctorsGrid doctors={paginatedResults} />

                {pageCount > 1 && (
                  <Paper
                    sx={{
                      p: 3,
                      mt: 4,
                      borderRadius: 3,
                      border: `1px solid ${alpha(THEME_COLOR, 0.15)}`,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Showing {(page - 1) * itemsPerPage + 1} -{" "}
                        {Math.min(
                          page * itemsPerPage,
                          filteredResults.length
                        )}{" "}
                        of {filteredResults.length} doctors
                      </Typography>

                      <Pagination
  count={pageCount}
  page={page}
  onChange={(e, value) => {
    setPage(value);
  }}
/>
                    </Stack>
                  </Paper>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawer}
        onClose={() => setFilterDrawer(false)}
        PaperProps={{
          sx: {
            width: 320,
            borderLeft: `3px solid ${THEME_COLOR}`,
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              p: 3,
              bgcolor: THEME_COLOR,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Tune />
              <Typography fontWeight={600}>Filters</Typography>
            </Stack>
            <IconButton
              onClick={() => setFilterDrawer(false)}
              sx={{ color: "white" }}
            >
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflow: "auto" }}>
            <FiltersSidebar
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
          </Box>
        </Box>
      </Drawer>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="filter"
          onClick={() => setFilterDrawer(true)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            bgcolor: THEME_COLOR,
            "&:hover": { bgcolor: THEME_COLOR_DARK },
            zIndex: 1000,
          }}
        >
          <FilterList />
        </Fab>
      )}
    </Box>
  );
}