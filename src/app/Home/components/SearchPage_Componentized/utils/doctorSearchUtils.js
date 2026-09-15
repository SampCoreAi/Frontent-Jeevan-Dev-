export const mapDoctors = (doctors = []) => {
  return doctors.map((doctor) => ({
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
};

// Browser permission status check
export const checkLocationPermission = async () => {
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
    console.log("Permission API error:", error);
    return "prompt";
  }
};

// Current city get karega
// Agar permission "prompt" hai to getCurrentPosition()
// automatically browser popup open karega.
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

          console.log("Latitude:", latitude);
          console.log("Longitude:", longitude);

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

          console.log("Detected City:", city);

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

export const filterDoctors = ({
  results = [],
  selectedDoctorId,
  selectedFilters,
}) => {
  return results.filter((doctor) => {
    if (
      selectedDoctorId &&
      String(doctor.id) !== String(selectedDoctorId)
    ) {
      return false;
    }

    if (
      selectedFilters.specialization?.length > 0 &&
      !selectedFilters.specialization.some((specialization) =>
        doctor.speciality
          ?.toLowerCase()
          .includes(specialization.toLowerCase())
      )
    ) {
      return false;
    }

    if (selectedFilters.experience?.length > 0) {
      const experienceMatch = selectedFilters.experience.some((item) => {
        const exp = Number(doctor.experience);

        if (item === "0-5") return exp >= 0 && exp <= 5;
        if (item === "5-10") return exp > 5 && exp <= 10;
        if (item === "10+") return exp > 10;

        return true;
      });

      if (!experienceMatch) return false;
    }

    if (selectedFilters.rating?.length > 0) {
      const ratingMatch = selectedFilters.rating.some((rating) => {
        return Number(doctor.rating) >= Number(rating);
      });

      if (!ratingMatch) return false;
    }

    if (selectedFilters.feeRange?.length > 0) {
      const feeMatch = selectedFilters.feeRange.some((range) => {
        const fee = Number(doctor.fee);

        if (range === "0-500") return fee <= 500;
        if (range === "500-1000") return fee > 500 && fee <= 1000;
        if (range === "1000+") return fee > 1000;

        return true;
      });

      if (!feeMatch) return false;
    }

    return true;
  });
};