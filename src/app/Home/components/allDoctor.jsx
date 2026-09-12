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
  const S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BUCKET_URL;

  const getCurrentCity = async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await res.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state_district ||
            data.address.state;

          resolve(city);
        } catch (err) {
          reject(err);
        }
      },
      (err) => reject(err)
    );
  });
};

const searchDoctorsByCity = async (pageNo = 1) => {
  try {
    setLoading(true);
    setError("");

    const limit = itemsPerPage;
    const offset = (pageNo - 1) * itemsPerPage;

    let city = "";

    try {
      city = await getCurrentCity();
      console.log("City:", city);
    } catch (err) {
      console.log("Location nahi mili, all doctors load honge");
    }

    const res = await api.get("/api/doctors/doctor/search", {
      params: {
        search: city || "",
        limit,
        offset,
      },
    });

    const mappedData = (res.data.data || []).map((doctor) => ({
      ...doctor,
      id: doctor.userId,
      name: doctor.fullName || "Dr. User",
      speciality: doctor.specialization || "Speciality Not Available",
      education: doctor.qualification || "Not Available",
      hospital:
        doctor.hospitalDetail?.[0]?.hospitalName ||
        "Hospital Not Available",
      fee: Number(doctor.consultationFee) || 0,
      experience: Number(doctor.experience) || 0,
      rating: Number(doctor.avgRating) || 0,
      totalFeedbacks: Number(doctor.totalFeedbacks) || 0,
      photo: doctor.profileImage || "/img/IconDoctor.png",
    }));

    setResults(mappedData);
  } catch (err) {
    console.error(err);

    setError(
      err?.response?.data?.message ||
        "Doctors load nahi ho pa rahe. Please try again."
    );
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  searchDoctorsByCity();
}, []);
 

const handlePageChange = (newPage) => {
  setPage(newPage);

  searchDoctorsByCity(newPage);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  const searchDoctors = async (query) => {
    setLoading(true);

    try {
    const res = await api.get(
  "/api/doctors/doctor/search",
  {
    params: {
      search: query,
    },
  }
);

      const mappedData = (res.data.data || []).map((doctor) => ({
        ...doctor,

        id: doctor.userId,

        name: doctor.fullName || "Dr. User",

        speciality: doctor.specialization || "Speciality Not Available",

        education: doctor.qualification || "Not Available",

        hospital:
          doctor.hospitalDetail?.[0]?.hospitalName || "Hospital Not Available",

        fee: Number(doctor.consultationFee) || 0,

        experience: Number(doctor.experience) || 0,

        rating: Number(doctor.avgRating) || 0,

        totalFeedbacks: Number(doctor.totalFeedbacks) || 0,

        photo: doctor.profileImage || "/img/IconDoctor.png",
      }));

      setResults(mappedData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleBookAppointment = (doctorId) => {
    setBookingLoadingId(doctorId);

    router.push(`/users/pages/Appointment?id=${doctorId}`);
  };

  // Responsive check
  const [isMobile, setIsMobile] = useState(false);
  const [isLaptopUp, setIsLaptopUp] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 900);
      setIsLaptopUp(window.innerWidth >= 1200);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

 const filteredResults = results.filter((doctor) => {
  // Doctor Id
  if (
    selectedDoctorId &&
    Number(doctor.id) !== Number(selectedDoctorId)
  ) {
    return false;
  }

  if (selectedFilters.specialization.length) {
  const doctorSpeciality = (doctor.speciality || "").toLowerCase();

  const match = selectedFilters.specialization.some(
    (item) => item.toLowerCase() === doctorSpeciality
  );

  if (!match) return false;
}

  // Experience
  if (selectedFilters.experience.length) {
    const exp = Number(doctor.experience);

    const match = selectedFilters.experience.some((range) => {
      if (range === "0-5 years") return exp >= 0 && exp <= 5;
      if (range === "5-10 years") return exp > 5 && exp <= 10;
      if (range === "10-15 years") return exp > 10 && exp <= 15;
      if (range === "15+ years") return exp > 15;
      return false;
    });

    if (!match) return false;
  }

  // Rating
  if (selectedFilters.rating.length) {
    const rating = Number(doctor.rating);

    const match = selectedFilters.rating.some(
      (r) => rating >= Number(r)
    );

    if (!match) return false;
  }

  // Fee
  if (selectedFilters.feeRange.length) {
    const fee = Number(doctor.fee);

    const match = selectedFilters.feeRange.some((range) => {
      if (range === "0-500") return fee <= 500;
      if (range === "500-1000") return fee > 500 && fee <= 1000;
      if (range === "1000-2000") return fee > 1000 && fee <= 2000;
      if (range === "2000+") return fee > 2000;
      return false;
    });

    if (!match) return false;
  }

  return true;
});
  const pageCount = Math.ceil(
    filteredResults.length / itemsPerPage
  );

const paginatedResults = filteredResults;

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
      transform: hoveredCard !== null ? "scale(1.02)" : "scale(1)",
      boxShadow: hoveredCard !== null
        ? "0 4px 20px rgba(0,0,0,0.1)"
        : "0 2px 8px rgba(0,0,0,0.05)",
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
      padding: "8px 16px",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
      fontWeight: 500,
      transition: "background-color 0.2s",
    },
    btnOutline: {
      backgroundColor: "transparent",
      color: "#028275",
      padding: "8px 16px",
      borderRadius: "4px",
      border: "2px solid #028275",
      cursor: "pointer",
      fontWeight: 500,
      transition: "all 0.2s",
    },
   
    skeleton: {
      background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
      borderRadius: "4px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header Row - Search + Favorites in one line */}
    <div style={{ ...styles.headerRow, marginBottom: isMobile ? "20px" : "50px" }}>
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
    {/* Search */}
    <div style={{ flex: 1, width: "100%" }}>
      <SearchBar onSearch={searchDoctors} />
    </div>

    {/* Filter */}
    <div
      style={{
        display: "flex",
        justifyContent: isMobile ? "flex-end" : "initial",
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
</div>

      {/* Loading State */}
      {loading ? (
        <div>
          {[...Array(itemsPerPage)].map((_, index) => (
            <div key={index} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ ...styles.skeleton, width: "100px", height: "100px" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ ...styles.skeleton, width: "60%", height: "24px", marginBottom: "8px" }} />
                  <div style={{ ...styles.skeleton, width: "40%", height: "16px", marginBottom: "8px" }} />
                  <div style={{ ...styles.skeleton, width: "50%", height: "16px" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <h3 style={{ color: "#666", marginBottom: "16px" }}>{error}</h3>
          <button
            style={styles.btnPrimary}
            onClick={() => (window.location.href = "/")}
          >
            Return to Home
          </button>
        </div>
      ) : (
        <>
       {filteredResults.length === 0 ? (
  <div
    style={{
      textAlign: "center",
      padding: "60px 20px",
      border: "1px solid #e0e0e0",
      borderRadius: "12px",
      background: "#fafafa",
    }}
  >
    <h2 style={{ color: "#1e6658", marginBottom: "10px" }}>
      No Doctors Found
    </h2>

    <p style={{ color: "#666", marginBottom: "12px" }}>
      We couldn't find any doctors matching your search or filters.
    </p>

    <p style={{ color: "#c62828", fontWeight: 500, marginBottom: "16px" }}>
      This may happen because location permission is not allowed, so nearby doctors cannot be loaded.
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
        onClick={() => searchDoctorsByCity()}
      >
        Allow Location & Retry
      </button>

      <button
        style={styles.btnOutline}
        onClick={() => {
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
        }}
      >
        Clear Filters
      </button>
    </div>
  </div>
) : (
  <div style={{ ...styles.grid, marginTop: "10px" }}>
      
            {paginatedResults.map((doctor, index) => (
              <div
                key={index}
                style={styles.card}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    style={styles.avatar}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/img/IconDoctor.png";
                    }}
                  />
                  <div>
                    <h3 style={{ color: "#028275", margin: "0 0 8px 0" }}>
                      {doctor.name}
                    </h3>
                    <p style={{ margin: "0 0 4px 0", fontSize: "14px" }}>
                      {doctor.speciality || "Speciality Not Available"}
                    </p>
                    <p style={{ margin: 0, color: "#028275", fontSize: "14px" }}>
                      {doctor.hospital || "Hospital Not Available"}
                    </p>
                  </div>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid #e0e0e0", margin: "16px 0" }} />

                <div style={{ marginBottom: "16px" }}>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Education:</strong> {doctor.education || "Not Available"}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Experience:</strong> {doctor.experience}+ Years
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Fee:</strong> ₹{doctor.fee ? doctor.fee.toFixed(0) : "0"}
                  </p>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Rating:</strong> ⭐ {doctor.rating}/5 ({doctor.totalFeedbacks} Review{doctor.totalFeedbacks !== 1 ? "s" : ""})
                  </p>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid #e0e0e0", margin: "16px 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                  <button
                    style={{
                      ...styles.btnPrimary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      opacity: bookingLoadingId === doctor.id ? 0.8 : 1,
                    }}
                    disabled={bookingLoadingId === doctor.id}
                    onClick={() => handleBookAppointment(doctor.id)}
                  >
                    {bookingLoadingId === doctor.id ? (
                      <>
                        <CircularProgress size={16} sx={{ color: "#fff" }} />
                        Loading...
                      </>
                    ) : (
                      "Book Appointment"
                    )}
                  </button>
                  <button
                    style={styles.btnOutline}
                    onClick={() => router.push(`/users/pages/DoctorDetail?id=${doctor.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
  </div>
)}
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
                onChange={(event, value) => handlePageChange(value)}
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

     <Drawer
  anchor="right"
  open={filterOpen}
  onClose={() => setFilterOpen(false)}
  sx={{
    zIndex: 1400,
  }}
  PaperProps={{
    sx: {
      // mt: "30px",
      width: { xs: "90%", sm: 340, md: 360 },
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
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

    </div>
  );
}