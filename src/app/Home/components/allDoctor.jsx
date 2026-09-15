"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../../(dashboard)/users/components/Doctor/SearchBar";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import api from "../../../utils/axiosInstance";
import FiltersSidebar from "../../Home/components/Search/FiltersSidebar";

export default function SearchPage() {
  const router = useRouter();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Location states
  const [locationStatus, setLocationStatus] = useState("checking");
  // checking | allowed | denied | blocked

  const [currentCity, setCurrentCity] = useState("");

  // nearby = location ke doctors
  // all = sab doctors
  // search = user search
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

  // Responsive
  const [isMobile, setIsMobile] = useState(false);
  const [isLaptopUp, setIsLaptopUp] = useState(false);

  // -------------------------------------------------------
  // Doctor mapping
  // -------------------------------------------------------

  const mapDoctors = (doctors = []) => {
    return doctors.map((doctor) => ({
      ...doctor,

      id: doctor.userId,

      name: doctor.fullName || "Dr. User",

      speciality:
        doctor.specialization || "Speciality Not Available",

      education:
        doctor.qualification || "Not Available",

      hospital:
        doctor.hospitalDetail?.[0]?.hospitalName ||
        "Hospital Not Available",

      fee: Number(doctor.consultationFee) || 0,

      experience: Number(doctor.experience) || 0,

      rating: Number(doctor.avgRating) || 0,

      totalFeedbacks:
        Number(doctor.totalFeedbacks) || 0,

      photo:
        doctor.profileImage || "/img/IconDoctor.png",
    }));
  };

  // -------------------------------------------------------
  // Get current location/city
  // -------------------------------------------------------
const checkLocationPermission = async () => {
  try {
    if (!navigator.permissions) {
      return "prompt";
    }

    const permission = await navigator.permissions.query({
      name: "geolocation",
    });

    return permission.state;
    // granted | prompt | denied
  } catch (error) {
    return "prompt";
  }
};
  const getCurrentCity = async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({
          code: "NOT_SUPPORTED",
          message: "Geolocation is not supported.",
        });

        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } =
              position.coords;

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);

            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );

            if (!res.ok) {
              throw new Error(
                "Unable to get location details."
              );
            }

            const data = await res.json();

            const city =
              data?.address?.city ||
              data?.address?.town ||
              data?.address?.village ||
              data?.address?.state_district ||
              data?.address?.state;

            if (!city) {
              throw new Error(
                "City could not be detected."
              );
            }

            resolve(city);
          } catch (err) {
            reject(err);
          }
        },

        (err) => {
          console.log(
            "Geolocation error:",
            err
          );

          reject(err);
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  };

  // -------------------------------------------------------
  // Search nearby doctors
  // -------------------------------------------------------

const searchDoctorsByCity = async (pageNo = 1) => {
  try {
    setLoading(true);
    setError("");
    setResultMode("nearby");

    const permission = await checkLocationPermission();

    console.log("Location Permission:", permission);

    // Browser me permanently/block kiya hua hai
    if (permission === "denied") {
      setLocationStatus("blocked");
      setCurrentCity("");
      setResults([]);
      return;
    }

    let city = "";

    try {
      setLocationStatus("checking");

      city = await getCurrentCity();

      console.log("Detected City:", city);

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

    const limit = itemsPerPage;
    const offset = (pageNo - 1) * itemsPerPage;

    const res = await api.get("/api/doctors/doctor/search", {
      params: {
        search: city,
        limit,
        offset,
      },
    });

    const mappedData = mapDoctors(res?.data?.data || []);

    setResults(mappedData);
    setPage(pageNo);
  } catch (err) {
    console.error("Nearby doctors error:", err);

    setError(
      err?.response?.data?.message ||
        "Doctors load nahi ho pa rahe. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  // -------------------------------------------------------
  // Load ALL doctors
  // -------------------------------------------------------

  const loadAllDoctors = async (
    pageNo = 1
  ) => {
    try {
      setLoading(true);
      setError("");
      setResultMode("all");

      const limit = itemsPerPage;

      const offset =
        (pageNo - 1) * itemsPerPage;

      const res = await api.get(
        "/api/doctors/doctor/search",
        {
          params: {
            search: "",
            limit,
            offset,
          },
        }
      );

      const mappedData = mapDoctors(
        res?.data?.data || []
      );

      setResults(mappedData);
      setPage(pageNo);

      // Filters reset
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
    } catch (err) {
      console.error(
        "All doctors error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Doctors load nahi ho pa rahe. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------
  // Search doctors from SearchBar
  // -------------------------------------------------------

  const searchDoctors = async (
    query
  ) => {
    // Empty search ho to all doctors
    if (!query?.trim()) {
      loadAllDoctors(1);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResultMode("search");
      setPage(1);

      const res = await api.get(
        "/api/doctors/doctor/search",
        {
          params: {
            search: query.trim(),
          },
        }
      );

      const mappedData = mapDoctors(
        res?.data?.data || []
      );

      setResults(mappedData);
    } catch (err) {
      console.error(
        "Doctor search error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Doctors search nahi ho pa rahe."
      );
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------
  // Initial Load
  // -------------------------------------------------------

  useEffect(() => {
    searchDoctorsByCity(1);
  }, []);

  // -------------------------------------------------------
  // Responsive check
  // -------------------------------------------------------

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(
        window.innerWidth < 900
      );

      setIsLaptopUp(
        window.innerWidth >= 1200
      );
    };

    checkScreen();

    window.addEventListener(
      "resize",
      checkScreen
    );

    return () =>
      window.removeEventListener(
        "resize",
        checkScreen
      );
  }, []);

  // -------------------------------------------------------
  // Pagination
  // -------------------------------------------------------

  const handlePageChange = (
    newPage
  ) => {
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

  // -------------------------------------------------------
  // Book Appointment
  // -------------------------------------------------------

  const handleBookAppointment = (
    doctorId
  ) => {
    setBookingLoadingId(doctorId);

    router.push(
      `/users/pages/Appointment?id=${doctorId}`
    );
  };

  // -------------------------------------------------------
  // Filters
  // -------------------------------------------------------

  const filteredResults =
    results.filter((doctor) => {
      // Doctor Id
      if (
        selectedDoctorId &&
        Number(doctor.id) !==
          Number(selectedDoctorId)
      ) {
        return false;
      }

      // Specialization
      if (
        selectedFilters.specialization
          .length
      ) {
        const doctorSpeciality = (
          doctor.speciality || ""
        ).toLowerCase();

        const match =
          selectedFilters.specialization.some(
            (item) =>
              item.toLowerCase() ===
              doctorSpeciality
          );

        if (!match) return false;
      }

      // Experience
      if (
        selectedFilters.experience.length
      ) {
        const exp = Number(
          doctor.experience
        );

        const match =
          selectedFilters.experience.some(
            (range) => {
              if (
                range === "0-5 years"
              )
                return (
                  exp >= 0 && exp <= 5
                );

              if (
                range === "5-10 years"
              )
                return (
                  exp > 5 && exp <= 10
                );

              if (
                range === "10-15 years"
              )
                return (
                  exp > 10 &&
                  exp <= 15
                );

              if (
                range === "15+ years"
              )
                return exp > 15;

              return false;
            }
          );

        if (!match) return false;
      }

      // Rating
      if (
        selectedFilters.rating.length
      ) {
        const rating = Number(
          doctor.rating
        );

        const match =
          selectedFilters.rating.some(
            (r) =>
              rating >= Number(r)
          );

        if (!match) return false;
      }

      // Fee
      if (
        selectedFilters.feeRange.length
      ) {
        const fee = Number(
          doctor.fee
        );

        const match =
          selectedFilters.feeRange.some(
            (range) => {
              if (range === "0-500")
                return fee <= 500;

              if (
                range === "500-1000"
              )
                return (
                  fee > 500 &&
                  fee <= 1000
                );

              if (
                range === "1000-2000"
              )
                return (
                  fee > 1000 &&
                  fee <= 2000
                );

              if (
                range === "2000+"
              )
                return fee > 2000;

              return false;
            }
          );

        if (!match) return false;
      }

      return true;
    });

  const pageCount = Math.ceil(
    filteredResults.length /
      itemsPerPage
  );

  const paginatedResults =
    filteredResults;

  // -------------------------------------------------------
  // Clear filters
  // -------------------------------------------------------

  const clearFilters = () => {
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

  // -------------------------------------------------------
  // Styles
  // -------------------------------------------------------

  const styles = {
    container: {
      backgroundColor: "white",
      boxShadow:
        "0 4px 12px #0f7468",
      borderRadius: "8px",
      marginTop: "64px",
      marginBottom: "8px",
      marginLeft: "8px",
      marginRight: "8px",

      padding: isMobile
        ? "16px"
        : "32px 48px",
    },

    card: {
      width: isLaptopUp
        ? "357px"
        : "100%",

      border:
        "2px solid #028275",

      borderRadius: "8px",
      padding: "16px",

      transition:
        "all 0.2s ease",

      boxShadow:
        "0 2px 8px rgba(0,0,0,0.05)",

      cursor: "pointer",
    },

    grid: {
      display: "grid",

      gridTemplateColumns:
        isMobile
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
      transition:
        "background-color 0.2s",
    },

    btnOutline: {
      backgroundColor:
        "transparent",
      color: "#028275",
      padding: "8px 16px",
      borderRadius: "6px",
      border:
        "2px solid #028275",
      cursor: "pointer",
      fontWeight: 500,
      transition:
        "all 0.2s",
    },

    skeleton: {
      background:
        "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",

      backgroundSize:
        "200% 100%",

      animation:
        "shimmer 1.5s infinite",

      borderRadius: "4px",
    },

    emptyBox: {
      textAlign: "center",
      padding: isMobile
        ? "40px 15px"
        : "60px 20px",

      border:
        "1px solid #e0e0e0",

      borderRadius: "12px",

      background: "#fafafa",
    },
  };

  return (
    <div style={styles.container}>
      {/* Search + Filter */}

      <div
        style={{
          display: "flex",

          flexDirection: isMobile
            ? "column"
            : "row",

          alignItems: isMobile
            ? "stretch"
            : "center",

          gap: isMobile
            ? "10px"
            : "12px",

          width: "100%",

          marginBottom: isMobile
            ? "20px"
            : "50px",
        }}
      >
        {/* Search */}

        <div
          style={{
            flex: 1,
            width: "100%",
          }}
        >
          <SearchBar
            onSearch={searchDoctors}
          />
        </div>

        {/* Filter */}

        <div
          style={{
            display: "flex",

            justifyContent:
              isMobile
                ? "flex-end"
                : "initial",
          }}
        >
          <button
            style={{
              minWidth: "110px",
              height: "48px",

              background:
                "#1e6658",

              color: "#fff",
              border: "none",
              borderRadius: "8px",

              cursor: "pointer",

              fontWeight: 600,

              padding: "0 20px",
            }}
            onClick={() =>
              setFilterOpen(
                !filterOpen
              )
            }
          >
            Filter
          </button>
        </div>
      </div>

      {/* =========================
          LOADING
      ========================== */}

      {loading ? (
        <div>
          {[...Array(itemsPerPage)].map(
            (_, index) => (
              <div
                key={index}
                style={{
                  marginBottom:
                    "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems:
                      "center",
                  }}
                >
                  <div
                    style={{
                      ...styles.skeleton,
                      width: "100px",
                      height: "100px",
                    }}
                  />

                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        ...styles.skeleton,

                        width: "60%",
                        height: "24px",

                        marginBottom:
                          "8px",
                      }}
                    />

                    <div
                      style={{
                        ...styles.skeleton,

                        width: "40%",
                        height: "16px",

                        marginBottom:
                          "8px",
                      }}
                    />

                    <div
                      style={{
                        ...styles.skeleton,

                        width: "50%",
                        height: "16px",
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : error ? (
        /* =========================
           API ERROR
        ========================== */

        <div style={styles.emptyBox}>
          <h2
            style={{
              color: "#c62828",
              marginBottom: "10px",
            }}
          >
            Something Went Wrong
          </h2>

          <p
            style={{
              color: "#666",
              marginBottom: "20px",
            }}
          >
            {error}
          </p>

          <button
            style={styles.btnPrimary}
            onClick={() => {
              if (
                resultMode ===
                "nearby"
              ) {
                searchDoctorsByCity(
                  1
                );
              } else {
                loadAllDoctors(1);
              }
            }}
          >
            Try Again
          </button>
        </div>
      ) : locationStatus === "blocked" &&
        resultMode === "nearby" ? (
        /* =========================
           LOCATION BLOCKED
        ========================== */

        <div style={styles.emptyBox}>
          <div
            style={{
              fontSize: "42px",
              marginBottom: "12px",
            }}
          >
            📍
          </div>

          <h2
            style={{
              color: "#1e6658",
              marginBottom: "10px",
            }}
          >
            Location Permission Blocked
          </h2>

          <p
            style={{
              color: "#666",
              marginBottom: "8px",
            }}
          >
            Location permission is blocked in your browser.
          </p>

          <p
            style={{
              color: "#888",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            Open browser site settings, set Location to Allow,
            then click Retry Location.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              style={styles.btnPrimary}
              onClick={() => searchDoctorsByCity(1)}
            >
              Retry Location
            </button>

            <button
              style={styles.btnOutline}
              onClick={() => loadAllDoctors(1)}
            >
              View All Doctors
            </button>
          </div>
        </div>
      ) : locationStatus === "denied" &&
        resultMode === "nearby" ? (
        /* =========================
           LOCATION UNAVAILABLE
        ========================== */

        <div style={styles.emptyBox}>
          <div
            style={{
              fontSize: "42px",
              marginBottom: "12px",
            }}
          >
            📍
          </div>

          <h2
            style={{
              color: "#1e6658",
              marginBottom: "10px",
            }}
          >
            Location Not Available
          </h2>

          <p
            style={{
              color: "#666",
              marginBottom: "8px",
            }}
          >
            We could not get your current location.
          </p>

          <p
            style={{
              color: "#888",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            Please check your device location and browser permission,
            then try again.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              style={styles.btnPrimary}
              onClick={() => searchDoctorsByCity(1)}
            >
              Retry Location
            </button>

            <button
              style={styles.btnOutline}
              onClick={() => loadAllDoctors(1)}
            >
              View All Doctors
            </button>
          </div>
        </div>
      ) : results.length === 0 &&
        resultMode ===
          "nearby" ? (
        /* =========================
           LOCATION ON BUT
           NO NEARBY DOCTOR
        ========================== */

        <div style={styles.emptyBox}>
          <div
            style={{
              fontSize: "42px",
              marginBottom: "12px",
            }}
          >
            🩺
          </div>

          <h2
            style={{
              color: "#1e6658",
              marginBottom: "10px",
            }}
          >
            No Nearby Doctors Found
          </h2>

          <p
            style={{
              color: "#666",
              marginBottom: "8px",
            }}
          >
            We couldn't find any
            doctors near{" "}
            <strong>
              {currentCity ||
                "your location"}
            </strong>
            .
          </p>

          <p
            style={{
              color: "#888",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            You can view doctors
            available in other
            locations.
          </p>

          <button
            style={styles.btnPrimary}
            onClick={() =>
              loadAllDoctors(1)
            }
          >
            View All Doctors
          </button>
        </div>
      ) : results.length === 0 &&
        resultMode === "all" ? (
        /* =========================
           DATABASE ME KOI DOCTOR NAHI
        ========================== */

        <div style={styles.emptyBox}>
          <h2
            style={{
              color: "#1e6658",
              marginBottom: "10px",
            }}
          >
            No Doctors Available
          </h2>

          <p
            style={{
              color: "#666",
            }}
          >
            Currently no doctors are
            available.
          </p>
        </div>
      ) : results.length === 0 &&
        resultMode ===
          "search" ? (
        /* =========================
           SEARCH RESULT EMPTY
        ========================== */

        <div style={styles.emptyBox}>
          <h2
            style={{
              color: "#1e6658",
              marginBottom: "10px",
            }}
          >
            No Doctors Found
          </h2>

          <p
            style={{
              color: "#666",
              marginBottom: "20px",
            }}
          >
            No doctor matched your
            search.
          </p>

          <button
            style={styles.btnPrimary}
            onClick={() =>
              loadAllDoctors(1)
            }
          >
            View All Doctors
          </button>
        </div>
      ) : filteredResults.length ===
        0 ? (
        /* =========================
           FILTER EMPTY RESULT
        ========================== */

        <div style={styles.emptyBox}>
          <h2
            style={{
              color: "#1e6658",
              marginBottom: "10px",
            }}
          >
            No Doctors Match Your
            Filters
          </h2>

          <p
            style={{
              color: "#666",
              marginBottom: "20px",
            }}
          >
            Try removing some filters
            to see more doctors.
          </p>

          <button
            style={styles.btnOutline}
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* =========================
              DOCTOR CARDS
          ========================== */}

          <div
            style={{
              ...styles.grid,
              marginTop: "10px",
            }}
          >
            {paginatedResults.map(
              (doctor, index) => (
                <div
                  key={
                    doctor.id ||
                    index
                  }
                  style={{
                    ...styles.card,

                    transform:
                      hoveredCard ===
                      index
                        ? "scale(1.02)"
                        : "scale(1)",

                    boxShadow:
                      hoveredCard ===
                      index
                        ? "0 4px 20px rgba(0,0,0,0.1)"
                        : "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                  onMouseEnter={() =>
                    setHoveredCard(
                      index
                    )
                  }
                  onMouseLeave={() =>
                    setHoveredCard(
                      null
                    )
                  }
                >
                  {/* Top */}

                  <div
                    style={{
                      display: "flex",
                      gap: "16px",

                      marginBottom:
                        "16px",
                    }}
                  >
                    <img
                      src={doctor.photo}
                      alt={doctor.name}
                      style={
                        styles.avatar
                      }
                      onError={(e) => {
                        e.target.onerror =
                          null;

                        e.target.src =
                          "/img/IconDoctor.png";
                      }}
                    />

                    <div>
                      <h3
                        style={{
                          color:
                            "#028275",

                          margin:
                            "0 0 8px 0",
                        }}
                      >
                        {doctor.name}
                      </h3>

                      <p
                        style={{
                          margin:
                            "0 0 4px 0",

                          fontSize:
                            "14px",
                        }}
                      >
                        {doctor.speciality ||
                          "Speciality Not Available"}
                      </p>

                      <p
                        style={{
                          margin: 0,
                          color:
                            "#028275",

                          fontSize:
                            "14px",
                        }}
                      >
                        {doctor.hospital ||
                          "Hospital Not Available"}
                      </p>
                    </div>
                  </div>

                  <hr
                    style={{
                      border: "none",

                      borderTop:
                        "1px solid #e0e0e0",

                      margin:
                        "16px 0",
                    }}
                  />

                  {/* Details */}

                  <div
                    style={{
                      marginBottom:
                        "16px",
                    }}
                  >
                    <p
                      style={{
                        margin:
                          "4px 0",
                      }}
                    >
                      <strong>
                        Education:
                      </strong>{" "}
                      {doctor.education ||
                        "Not Available"}
                    </p>

                    <p
                      style={{
                        margin:
                          "4px 0",
                      }}
                    >
                      <strong>
                        Experience:
                      </strong>{" "}
                      {
                        doctor.experience
                      }
                      + Years
                    </p>

                    <p
                      style={{
                        margin:
                          "4px 0",
                      }}
                    >
                      <strong>
                        Fee:
                      </strong>{" "}
                      ₹
                      {doctor.fee
                        ? doctor.fee.toFixed(
                            0
                          )
                        : "0"}
                    </p>

                    <p
                      style={{
                        margin:
                          "4px 0",
                      }}
                    >
                      <strong>
                        Rating:
                      </strong>{" "}
                      ⭐ {doctor.rating}
                      /5 (
                      {
                        doctor.totalFeedbacks
                      }{" "}
                      Review
                      {doctor.totalFeedbacks !==
                      1
                        ? "s"
                        : ""}
                      )
                    </p>
                  </div>

                  <hr
                    style={{
                      border: "none",

                      borderTop:
                        "1px solid #e0e0e0",

                      margin:
                        "16px 0",
                    }}
                  />

                  {/* Buttons */}

                  <div
                    style={{
                      display: "flex",

                      justifyContent:
                        "space-between",

                      gap: "12px",
                    }}
                  >
                    <button
                      style={{
                        ...styles.btnPrimary,

                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        gap: "8px",

                        opacity:
                          bookingLoadingId ===
                          doctor.id
                            ? 0.8
                            : 1,
                      }}
                      disabled={
                        bookingLoadingId ===
                        doctor.id
                      }
                      onClick={() =>
                        handleBookAppointment(
                          doctor.id
                        )
                      }
                    >
                      {bookingLoadingId ===
                      doctor.id ? (
                        <>
                          <CircularProgress
                            size={16}
                            sx={{
                              color:
                                "#fff",
                            }}
                          />

                          Loading...
                        </>
                      ) : (
                        "Book Appointment"
                      )}
                    </button>

                    <button
                      style={
                        styles.btnOutline
                      }
                      onClick={() =>
                        router.push(
                          `/users/pages/DoctorDetail?id=${doctor.id}`
                        )
                      }
                    >
                      View Details
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Pagination */}

          {pageCount > 1 && (
            <Stack
              spacing={2}
              alignItems="center"
              sx={{ mt: 4 }}
            >
              <Pagination
                count={pageCount}
                page={page}
                onChange={(
                  event,
                  value
                ) =>
                  handlePageChange(
                    value
                  )
                }
                color="primary"
                shape="rounded"
                showFirstButton
                showLastButton
                siblingCount={1}
                boundaryCount={1}
              />
            </Stack>
          )}
        </>
      )}

      {/* =========================
          FILTER DRAWER
      ========================== */}

      <Drawer
        anchor="right"
        open={filterOpen}
        onClose={() =>
          setFilterOpen(false)
        }
        sx={{
          zIndex: 1400,
        }}
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
          selectedFilters={
            selectedFilters
          }
          setSelectedFilters={
            setSelectedFilters
          }
          onClose={() =>
            setFilterOpen(false)
          }
        />
      </Drawer>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200%
              0;
          }

          100% {
            background-position: -200%
              0;
          }
        }
      `}</style>
    </div>
  );
}