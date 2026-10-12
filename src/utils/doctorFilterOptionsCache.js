export const DOCTOR_FILTER_OPTIONS_CACHE_PREFIX =
  "doctor-filter-options:";

const CACHE_TTL_MS = 5 * 60 * 1000;

export const getDoctorFilterOptionsCacheKey = () => {
  let userIdentity = "guest";

  if (typeof window === "undefined") return null;

  let user;
  try {
    const storedUser = window.localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Unable to read doctor identity for filter cache:", error);
  }

  const identity =
    user?.id ?? user?._id ?? user?.userId ?? user?.user_id;
  const email = user?.email;

  if (identity !== undefined && identity !== null && identity !== "") {
    userIdentity = `user:${String(identity)}`;
  } else if (typeof email === "string" && email) {
    userIdentity = `email:${email.toLowerCase()}`;
  } else {
    try {
      const token = window.localStorage.getItem("token");
      if (token) userIdentity = `session:${token}`;
    } catch (error) {
      console.error("Unable to read auth token for filter cache:", error);
    }
  }

  return `${DOCTOR_FILTER_OPTIONS_CACHE_PREFIX}${encodeURIComponent(
    userIdentity
  )}`;
};

export const readDoctorFilterOptionsCache = (cacheKey) => {
  if (!cacheKey || typeof window === "undefined") return null;

  try {
    const cachedValue = window.localStorage.getItem(cacheKey);
    if (!cachedValue) return null;

    const cached = JSON.parse(cachedValue);
    const age = Date.now() - cached?.timestamp;

    if (
      !Number.isFinite(cached?.timestamp) ||
      age < 0 ||
      age >= CACHE_TTL_MS ||
      !cached?.data ||
      typeof cached.data !== "object" ||
      Array.isArray(cached.data)
    ) {
      window.localStorage.removeItem(cacheKey);
      return null;
    }

    return cached.data;
  } catch (error) {
    console.error("Unable to read doctor filter options cache:", error);
    return null;
  }
};

export const writeDoctorFilterOptionsCache = (cacheKey, data) => {
  if (!cacheKey || typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      cacheKey,
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch (error) {
    console.error("Unable to cache doctor filter options:", error);
  }
};
