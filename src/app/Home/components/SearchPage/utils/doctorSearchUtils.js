const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_S3_BUCKET_URL || "";

const getProfileImageUrl = (profileImage) => {
  if (!profileImage) return "";

  // Agar backend already full URL bhej raha hai
  if (
    profileImage.startsWith("http://") ||
    profileImage.startsWith("https://")
  ) {
    return profileImage;
  }

  // Remove extra slash
  const baseUrl = IMAGE_BASE_URL.replace(/\/$/, "");
  const imagePath = profileImage.replace(/^\//, "");

  return `${baseUrl}/${imagePath}`;
};

export const mapDoctors = (doctors = []) => {
  return doctors.map((item) => {
    const hospital = item.hospitalDetail?.[0] || null;

    const profileImageUrl = getProfileImageUrl(
      item.profileImage
    );

    return {
      // IDs
      id: item.userId,
      userId: item.userId,
      registrationId: item.registrationId,

      // Basic info
      fullName: item.fullName || "Doctor",
      username: item.username || "",
      gender: item.gender || "N/A",
      age: item.age ?? "N/A",

      // Professional info
      qualification: item.qualification || "N/A",
      specialization: item.specialization || "N/A",
      experience: item.experience ?? 0,
      consultationFee: item.consultationFee ?? 0,

      // Rating
      rating: item.avgRating ?? "0.0",
      avgRating: item.avgRating ?? "0.0",
      totalFeedbacks: item.totalFeedbacks ?? 0,

      // Image
      photo: profileImageUrl,
      profileImage: profileImageUrl,

      // Hospital
      hospitalDetail: item.hospitalDetail || [],
      hospitalName:
        hospital?.hospitalName || "Hospital not available",

      city: hospital?.city || "",
      area: hospital?.areaLocality || "",
    };
  });
};

// ======================================================
// LOCATION
// ======================================================

export const checkLocationPermission = async () => {
  try {
    if (!navigator.permissions) {
      return "prompt";
    }

    const permission = await navigator.permissions.query({
      name: "geolocation",
    });

    return permission.state;
  } catch (error) {
    console.log("Permission API error:", error);
    return "prompt";
  }
};

export const getCurrentCity = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: "Geolocation is not supported by this browser.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          if (!response.ok) {
            throw new Error("Unable to detect city.");
          }

          const data = await response.json();

          const address = data?.address || {};

          const city =
            address.city ||
            address.town ||
            address.village ||
            address.city_district ||
            address.state_district ||
            address.county ||
            address.state;

          if (!city) {
            throw new Error("City not found.");
          }

          resolve(city);
        } catch (error) {
          reject(error);
        }
      },

      (error) => {
        console.log("Geolocation error:", error);
        reject(error);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
};

// ======================================================
// FILTER DOCTORS
// ======================================================

export const filterDoctors = ({
  results = [],
  selectedDoctorId,
  selectedFilters,
}) => {
  return results.filter((doctor) => {
    // Doctor ID
    if (
      selectedDoctorId &&
      String(doctor.id) !== String(selectedDoctorId)
    ) {
      return false;
    }

    // Specialization
    if (
      selectedFilters.specialization?.length > 0 &&
      !selectedFilters.specialization.some((specialization) =>
        doctor.specialization
          ?.toLowerCase()
          .includes(specialization.toLowerCase())
      )
    ) {
      return false;
    }

    // Experience
    if (selectedFilters.experience?.length > 0) {
      const experienceMatch =
        selectedFilters.experience.some((item) => {
          const exp = Number(doctor.experience);

          if (item === "0-5") {
            return exp >= 0 && exp <= 5;
          }

          if (item === "5-10") {
            return exp > 5 && exp <= 10;
          }

          if (item === "10+") {
            return exp > 10;
          }

          return true;
        });

      if (!experienceMatch) return false;
    }

    // Rating
    if (selectedFilters.rating?.length > 0) {
      const ratingMatch =
        selectedFilters.rating.some(
          (rating) =>
            Number(doctor.rating) >= Number(rating)
        );

      if (!ratingMatch) return false;
    }

    // Fee
    if (selectedFilters.feeRange?.length > 0) {
      const feeMatch =
        selectedFilters.feeRange.some((range) => {
          const fee = Number(
            doctor.consultationFee
          );

          if (range === "0-500") {
            return fee <= 500;
          }

          if (range === "500-1000") {
            return fee > 500 && fee <= 1000;
          }

          if (range === "1000+") {
            return fee > 1000;
          }

          return true;
        });

      if (!feeMatch) return false;
    }

    return true;
  });
};