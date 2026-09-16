"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Drawer from "@mui/material/Drawer";

import SearchBar from "../../../(dashboard)/users/components/Doctor/SearchBar";
import FiltersSidebar from "../../../Home/components/Search/FiltersSidebar";
import api from "../../../../utils/axiosInstance";
import LocationHelpDialog from "./components/LocationHelpDialog";
import SearchLoading from "./components/SearchLoading";
import EmptyState from "./components/EmptyState";
import DoctorGrid from "./components/DoctorGrid";
import SearchPagination from "./components/SearchPagination";

import {
  mapDoctors,
  checkLocationPermission,
  getCurrentCity,
  filterDoctors,
} from "./utils/doctorSearchUtils";

export default function SearchPage() {
  const router = useRouter();
const [showLocationHelp, setShowLocationHelp] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // checking | allowed | denied | blocked
  const [locationStatus, setLocationStatus] = useState("checking");
  const [currentCity, setCurrentCity] = useState("");

  // nearby | all | search
  const [resultMode, setResultMode] = useState("nearby");

  const [page, setPage] = useState(1);
  const [bookingLoadingId, setBookingLoadingId] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  const itemsPerPage = 3;

  const [selectedFilters, setSelectedFilters] = useState({
    specialization: [],
    experience: [],
    rating: [],
    availability: [],
    consultationType: [],
    feeRange: [],
    gender: [],
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isLaptopUp, setIsLaptopUp] = useState(false);

  const resetFilters = () => {
    setSelectedFilters({
      specialization: [],
      experience: [],
      rating: [],
      availability: [],
      consultationType: [],
      feeRange: [],
      gender: [],
    });

    setSelectedDoctorId(null);
  };

  // -----------------------------------------
  // Nearby Doctors
const searchDoctorsByCity = async (pageNo = 1) => {
  try {
    setLoading(true);
    setError("");
    setResultMode("nearby");

    // 1. Browser permission status check
    const permission = await checkLocationPermission();

    console.log("Location Permission:", permission);

    // Already permanently blocked
    if (permission === "denied") {
      setLocationStatus("blocked");
      setCurrentCity("");
      setResults([]);
      return;
    }
    setLocationStatus("checking");

    let city;

    try {
      city = await getCurrentCity();

      console.log("Current city:", city);

      setCurrentCity(city);
      setLocationStatus("allowed");
    } catch (locationError) {
      console.log("Location Error:", locationError);


      if (locationError?.code === 1) {
        setLocationStatus("blocked");
      } else {
        setLocationStatus("denied");
      }

      setCurrentCity("");
      setResults([]);

      return;
    }

    // Doctor API
    const limit = itemsPerPage;
    const offset = (pageNo - 1) * itemsPerPage;

    const res = await api.get("/api/doctors/doctor/search", {
      params: {
        search: city,
        limit,
        offset,
      },
    });

    console.log("Nearby Doctors:", res?.data);

    setResults(mapDoctors(res?.data?.data || []));
    setPage(pageNo);
  } catch (err) {
    console.error("Nearby doctors error:", err);


    if (err?.response?.status === 404) {
      setResults([]);
      setError("");
      return;
    }

    setError(
      err?.response?.data?.message ||
        "Unable to load doctors. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  // -----------------------------------------
  // All Doctors
  // -----------------------------------------
  const loadAllDoctors = async (pageNo = 1) => {
    try {
      setLoading(true);
      setError("");
      setResultMode("all");

      const limit = itemsPerPage;
      const offset = (pageNo - 1) * itemsPerPage;

      const res = await api.get("/api/doctors/doctor/search", {
        params: {
          search: "",
          limit,
          offset,
        },
      });

      setResults(mapDoctors(res?.data?.data || []));
      setPage(pageNo);
      resetFilters();
    } catch (err) {
      console.error("All doctors error:", err);

      if (err?.response?.status === 404) {
        setResults([]);
        setError("");
        return;
      }

      setError(
        err?.response?.data?.message ||
          "Unable to load doctors. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Search
  // -----------------------------------------
  const searchDoctors = async (query) => {
    if (!query?.trim()) {
      loadAllDoctors(1);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResultMode("search");
      setPage(1);

      const res = await api.get("/api/doctors/doctor/search", {
        params: {
          search: query.trim(),
        },
      });

      setResults(mapDoctors(res?.data?.data || []));
    } catch (err) {
      console.error("Doctor search error:", err);

      if (err?.response?.status === 404) {
        setResults([]);
        setError("");
        return;
      }

      setError(
        err?.response?.data?.message ||
         "Unable to search for doctors. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Initial Load
  // -----------------------------------------
  useEffect(() => {
    searchDoctorsByCity(1);
  }, []);

  // -----------------------------------------
  // Responsive
  // -----------------------------------------
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 900);
      setIsLaptopUp(window.innerWidth >= 1200);
    };

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => {
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  // -----------------------------------------
  // Pagination
  // -----------------------------------------
  const handlePageChange = (newPage) => {
    setPage(newPage);

    if (resultMode === "nearby") {
      searchDoctorsByCity(newPage);
    } else if (resultMode === "all") {
      loadAllDoctors(newPage);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // -----------------------------------------
  // Navigation
  // -----------------------------------------
  const handleBookAppointment = (doctorId) => {
    setBookingLoadingId(doctorId);

    router.push(`/users/pages/Appointment?id=${doctorId}`);
  };

  const handleViewDetails = (doctorId) => {
    router.push(`/users/pages/DoctorDetail?id=${doctorId}`);
  };

  // -----------------------------------------
  // Filtered data
  // -----------------------------------------
  const filteredResults = filterDoctors({
    results,
    selectedDoctorId,
    selectedFilters,
  });

  const pageCount = Math.ceil(
    filteredResults.length / itemsPerPage
  );

  const styles = {
    container: {
      backgroundColor: "white",
      boxShadow: "0 4px 12px #0f7468",
      borderRadius: "8px",
      marginTop: "64px",
      marginBottom: "8px",
      marginLeft: "8px",
      marginRight: "8px",
      padding: isMobile ? "16px" : "32px 48px",
    },

    card: {
      width: isLaptopUp ? "357px" : "100%",
      border: "2px solid #028275",
      borderRadius: "8px",
      padding: "16px",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      cursor: "pointer",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : isLaptopUp
          ? "repeat(3, 1fr)"
          : "repeat(2, 1fr)",
      gap: "20px",
    },

    avatar: {
      width: "100px",
      height: "100px",
      borderRadius: "8px",
      objectFit: "cover",
    },

    btnPrimary: {
      backgroundColor: "#028275",
      color: "#fff",
      padding: "10px 18px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
      transition: "background-color 0.2s",
    },

    btnOutline: {
      backgroundColor: "transparent",
      color: "#028275",
      padding: "8px 16px",
      borderRadius: "6px",
      border: "2px solid #028275",
      cursor: "pointer",
      fontWeight: 500,
      transition: "all 0.2s",
    },

    skeleton: {
      background:
        "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
      borderRadius: "4px",
    },

    emptyBox: {
      textAlign: "center",
      padding: isMobile ? "40px 15px" : "60px 20px",
      border: "1px solid #e0e0e0",
      borderRadius: "12px",
      background: "#fafafa",
    },
  };

  const renderContent = () => {
    if (loading) {
      return <SearchLoading count={itemsPerPage} styles={styles} />;
    }

    if (error) {
      return (
        <EmptyState
          title="Something Went Wrong"
          description={error}
          primaryText="Try Again"
          onPrimary={() => {
            if (resultMode === "nearby") {
              searchDoctorsByCity(1);
            } else {
              loadAllDoctors(1);
            }
          }}
          styles={styles}
          titleColor="#c62828"
        />
      );
    }
if (locationStatus === "blocked" && resultMode === "nearby") {
  return (
    <EmptyState
      icon="📍"
      title="Location Permission Blocked"
      description="Location permission is blocked in your browser."
      subDescription="Click below to see the steps to allow it."
      primaryText="See Steps to Allow Location"
      onPrimary={() => setShowLocationHelp(true)}
      secondaryText="View All Doctors"
      onSecondary={() => loadAllDoctors(1)}
      styles={styles}
    />
  );
}

 if (
  locationStatus === "denied" &&
  resultMode === "nearby"
) {
  return (
    <EmptyState
      icon="📍"
      title="Location Not Available"
      description="We could not detect your current location."
      subDescription="Turn on your device location and click Retry Location."
      primaryText="Retry Location"
      onPrimary={() => searchDoctorsByCity(1)}
      secondaryText="View All Doctors"
      onSecondary={() => loadAllDoctors(1)}
      styles={styles}
    />
  );
}

    if (
      results.length === 0 &&
      resultMode === "nearby"
    ) {
      return (
        <EmptyState
          icon="🩺"
          title="No Nearby Doctors Found"
          description={
            <>
              We couldn't find any doctors near{" "}
              <strong>
                {currentCity || "your location"}
              </strong>
              .
            </>
          }
          subDescription="You can view doctors available in other locations."
          primaryText="View All Doctors"
          onPrimary={() => loadAllDoctors(1)}
          styles={styles}
        />
      );
    }

    if (
      results.length === 0 &&
      resultMode === "all"
    ) {
      return (
        <EmptyState
          title="No Doctors Available"
          description="Currently no doctors are available."
          styles={styles}
        />
      );
    }

    if (
      results.length === 0 &&
      resultMode === "search"
    ) {
      return (
        <EmptyState
          title="No Doctors Found"
          description="No doctor matched your search."
          primaryText="View All Doctors"
          onPrimary={() => loadAllDoctors(1)}
          styles={styles}
        />
      );
    }

    if (filteredResults.length === 0) {
      return (
        <EmptyState
          title="No Doctors Match Your Filters"
          description="Try removing some filters to see more doctors."
          secondaryText="Clear Filters"
          onSecondary={resetFilters}
          styles={styles}
        />
      );
    }

    return (
      <>
        <DoctorGrid
          doctors={filteredResults}
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
          bookingLoadingId={bookingLoadingId}
          onBook={handleBookAppointment}
          onViewDetails={handleViewDetails}
          styles={styles}
        />

        <SearchPagination
          pageCount={pageCount}
          page={page}
          onPageChange={handlePageChange}
        />
      </>
    );
  };

  return (
    <div style={styles.container}>
      {/* Search + Filter */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
          gap: isMobile ? "10px" : "12px",
          width: "100%",
          marginBottom: isMobile ? "20px" : "50px",
        }}
      >
        <div style={{ flex: 1, width: "100%" }}>
          <SearchBar onSearch={searchDoctors} />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: isMobile
              ? "flex-end"
              : "initial",
          }}
        >
          <button
            style={{
              minWidth: "110px",
              height: "48px",
              background: "#1e6658",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              padding: "0 20px",
            }}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            Filter
          </button>
        </div>
      </div>

      {renderContent()}
<LocationHelpDialog
  open={showLocationHelp}
  onClose={() => setShowLocationHelp(false)}
  onRetry={() => searchDoctorsByCity(1)}
/>
      <Drawer
        anchor="right"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        sx={{ zIndex: 1400 }}
        PaperProps={{
          sx: {
            width: {
              xs: "90%",
              sm: 340,
              md: 360,
            },
          },
        }}
      >
        <FiltersSidebar
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          onClose={() => setFilterOpen(false)}
        />
      </Drawer>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }

          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
