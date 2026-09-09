"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Avatar,
  Tabs,
  Tab,
  Pagination,
  TextField,
  useTheme,
  Alert,
  Snackbar,
  useMediaQuery,
  Skeleton,
} from "@mui/material";

import { FilterList as FilterIcon } from "@mui/icons-material";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function SearchPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isLaptopUp = useMediaQuery(theme.breakpoints.up("lg"));
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("relevance");
  const [activeTab, setActiveTab] = useState(0);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackType, setSnackType] = useState("warning");
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 6;
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();

    const fetchDoctors = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API_URL}/api/doctors/getDoctors`,
          {
            signal: controller.signal,
          }
        );

        const data = res.data;

        if (Array.isArray(data?.data) && data.data.length > 0) {
          const enhancedData = data.data.map((doctor) => ({
            ...doctor,
            name: doctor.full_name || "Dr. User",
            speciality: doctor.specialization || "",
            hospital: doctor.hospital_name || "",
            education: doctor.education || "",
            experience: Number(doctor.experience) || 0,
            fee: Number(doctor.fee) || 0,
            rating: Number(doctor.avg_rating) || 0,

            photo:
              doctor.photo ||
              "/img/IconDoctor.png",
          }));

          setResults(enhancedData);
          setError("");
        } else {
        setResults([]);
  setError("");
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
    return () => controller.abort();
  }, []);


  const isLoggedIn = () => {
    try {
      return !!localStorage.getItem("token");
    } catch {
      return false;
    }
  };




  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const filteredResults = useMemo(() => {
    return results
      .filter((doctor) =>
        activeTab === 1 ? doctor.rating >= 4.5 : true
      )
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "experience") return b.experience - a.experience;
        return a.name.localeCompare(b.name);
      });
  }, [results, activeTab, sortBy]);
  const forceLogin = () => {
    if (isLoggedIn()) {
      router.push("/Home/pages/Appointment");
      return;
    }

    setSnackMsg("Please login first");
    setSnackType("warning");
    setSnackOpen(true);

    timerRef.current = setTimeout(() => {
      router.push("/Home/pages/Register");
    }, 1500);
  };



  const pageCount = Math.max(
    1,
    Math.ceil(filteredResults.length / itemsPerPage)
  );
  const paginatedResults = filteredResults.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box
      sx={{
        backgroundColor: "background.thrid",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Navbar />

      <Box sx={{ width: "100%", py: 4, px: isMobile ? 2 : 6 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            backgroundColor: "background.paper",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            borderRadius: 0.5,
            boxShadow: "0 4px 12px rgba(30, 102, 88, 0.25)",

            gap: isMobile ? 2 : 0,
            mb: 3,
            p: 2,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              color: "text.primary",
            }}
          >
            All Doctors
            <Typography component="span" color="text.thrid" ml={1}>
              ({filteredResults.length} doctors found)
            </Typography>
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: isMobile ? "column" : "row",
              width: isMobile ? "100%" : "auto",
              alignItems: isMobile ? "stretch" : "center",
            }}
          >


            <TextField
              select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                minWidth: 140,
                backgroundColor: "background.paper",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "border.thrid" },
                  "&:hover fieldset": { borderColor: "border.thrid" },
                  "&.Mui-focused fieldset": { borderColor: "border.thrid" },
                },
              }}
              SelectProps={{ native: true }}
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Highest Rating</option>
              <option value="experience">Most Experienced</option>
            </TextField>
          </Box>
        </Box>

        {loading ? (
          <Grid container spacing={3} mb={5}>
            {[...Array(itemsPerPage)].map((_, index) => (
              <Grid size={12} key={index}>
                <Card
                  sx={{
                    width: isLaptopUp ? 455 : "100%",
                    border: "1px solid",
                    borderColor: "border.third",
                  }}
                >
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid>
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={100}
                          sx={{ borderRadius: 0.5 }}
                        />
                      </Grid>

                      <Grid size="grow">
                        <Skeleton variant="text" width="60%" height={28} />
                        <Skeleton variant="text" width="40%" />
                        <Skeleton variant="text" width="50%" />
                        <Skeleton variant="text" width="30%" />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
       ) : filteredResults.length === 0 ? (
  <Box
  sx={{
    minHeight: "450px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
 
  }}
>
  <Box
    component="img"
    src="/img/IconDoctor.png"
    alt="No Doctors"
    sx={{
      width: 130,
      height: 130,
      objectFit: "contain",

    border:"2px solid black",
    borderRadius:30,
    mb:3
    }}
  />

  <Typography
    variant="h4"
    fontWeight={700}
    sx={{
      color: "text.primary",
      mb: 1,
    }}
  >
    No Doctors Found
  </Typography>

  <Typography
    variant="body1"
    sx={{
      maxWidth: 450,
      color: "black",
      mb: 5,
    }}
  >
    We couldn't find any doctors matching your criteria.
    Please try again later or explore other options.
  </Typography>

  <Button
    variant="contained"
    onClick={() => window.location.reload()}
    sx={{
      px: 4,
      py: 1.2,
      borderRadius: "12px",
      backgroundColor: "background.primary",
      color: "text.secondary",
      textTransform: "none",
      fontWeight: 600,
      "&:hover": {
        backgroundColor: "hover.primary",
      },
    }}
  >
    Refresh Page
  </Button>
</Box>
) : (
          <>
            <Grid container spacing={3} mb={5}>
              {paginatedResults.map((doctor) => (
                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                    lg: 4,
                  }}
                  key={doctor.id}
                >
                  <Card
                    sx={{
                      width: isLaptopUp ? 455 : "100%",
                      border: "2px solid",
                      borderColor: "border.third",
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid>
                          <Avatar
                            variant="square"
                            src={doctor.photo}
                            alt={doctor.name}
                            imgProps={{
                              onError: (e) => {
                                e.target.src = "/img/IconDoctor.png";
                              },
                            }}
                            sx={{ width: 100, height: 100, borderRadius: 1 }}
                          />
                        </Grid>
                        <Grid size="grow">
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="text.third"
                          >
                            {doctor.name}
                          </Typography>
                          <Typography
                            sx={{ fontSize: 14, color: "text.primary" }}
                          >
                            {doctor.speciality || "Speciality Not Available"}
                          </Typography>
                          <Typography
                            sx={{ color: "text.third", fontSize: 14 }}
                          >
                            {doctor.hospital || "Hospital Not Available"}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 2, borderColor: "border.light" }} />

                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="text.primary"
                        >
                          Education:{" "}
                          <Box
                            component="span"
                            sx={{ fontWeight: 100, color: "text.primary" }}
                          >
                            {doctor.education || "Not Available"}
                          </Box>
                        </Typography>

                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="text.primary"
                        >
                          Experience:{" "}
                          <Box
                            component="span"
                            sx={{ fontWeight: 100, color: "text.primary" }}
                          >
                            {doctor.experience}+ Years
                          </Box>
                        </Typography>

                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="text.primary"
                        >
                          Fee:{" "}
                          <Box
                            component="span"
                            sx={{ fontWeight: 100, color: "text.primary" }}
                          >
                            ₹{doctor.fee}
                          </Box>
                        </Typography>

                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="text.primary"
                        >
                          Rating:{" "}
                          <Box
                            component="span"
                            sx={{ fontWeight: 100, color: "text.primary" }}
                          >
                            {doctor.rating}
                          </Box>
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2, borderColor: "border.light" }} />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 3,
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "background.primary",
                            color: "text.secondary",
                            "&:hover": { backgroundColor: "hover.primary" },
                          }}
                          onClick={() => router.push("/Home/pages/Register")}

                        >
                          Book Appointment
                        </Button>

                        <Button
                          variant="outlined"
                          sx={{
                            borderColor: "border.third",
                            color: "text.third",
                          }}
                          onClick={() => router.push("/Home/pages/Register")}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {pageCount > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={handlePageChange}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "text.third",
                    },
                    "& .Mui-selected": {
                      backgroundColor: "background.primary",
                      color: "text.secondary",
                    },
                  }}
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Box>
      
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity={snackType}
          sx={{ width: "100%" }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
      <Footer />
    </Box>
  );
}
