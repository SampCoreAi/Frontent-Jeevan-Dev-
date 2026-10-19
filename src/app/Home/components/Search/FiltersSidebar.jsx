"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  Button,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";

import {
  Close,
  LocalHospitalOutlined,
  WorkOutline,
  StarOutline,
  CurrencyRupee,
  PersonOutline,
  Check,
  Tune,
} from "@mui/icons-material";
import api from "../../../../utils/axiosInstance";
import {
  getDoctorFilterOptionsCacheKey,
  readDoctorFilterOptionsCache,
  writeDoctorFilterOptionsCache,
} from "../../../../utils/doctorFilterOptionsCache";

export default function FiltersSidebar({
  selectedFilters,
  setSelectedFilters,
  onClose,
  onApply,
  open,
}) {
  const [filterOptions, setFilterOptions] = useState(null);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [optionsError, setOptionsError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (open === false) return undefined;

    let isActive = true;
    const cacheKey = getDoctorFilterOptionsCacheKey();
    const cachedOptions = readDoctorFilterOptionsCache(cacheKey);

    if (cachedOptions) {
      setFilterOptions(cachedOptions);
      setOptionsError("");
      setOptionsLoading(false);
      return undefined;
    }

    const fetchFilterOptions = async () => {
      setOptionsLoading(true);
      setOptionsError("");

      try {
        const response = await api.get("/api/doctors/filter-options");
        const payload = response?.data;

        if (
          payload?.success !== true ||
          !payload.data ||
          typeof payload.data !== "object" ||
          Array.isArray(payload.data)
        ) {
          throw new Error("The filter options response is invalid.");
        }

        if (!isActive) return;

        setFilterOptions(payload.data);
        writeDoctorFilterOptionsCache(cacheKey, payload.data);
      } catch (error) {
        if (!isActive) return;

        console.error(
          "Unable to load doctor filter options:",
          error?.response?.data || error
        );
        setOptionsError(
          "We couldn't load filters. Please try again."
        );
      } finally {
        if (isActive) setOptionsLoading(false);
      }
    };

    fetchFilterOptions();

    return () => {
      isActive = false;
    };
  }, [open, retryCount]);

  // ============================================
  // COLORS
  // ============================================

  const colors = {
    primary: "#0A8F73",
    primaryDark: "#08735D",
    primaryLight: "#EAF7F3",
    primaryBorder: "#B9E3D8",

    text: "#172033",
    textSecondary: "#64748B",

    border: "#E2E8F0",
    background: "#FFFFFF",
    sectionBackground: "#F8FBFA",
  };

  // ============================================
  // TOGGLE FILTER
  // ============================================

  const toggleFilter = (key, value) => {
    const normalizedValue =
      typeof value === "string" ? value.toLowerCase() : value;

    setSelectedFilters((prev) => {
      const currentValues = prev[key] || [];

      const exists = currentValues.includes(normalizedValue);

      return {
        ...prev,
        [key]: exists
          ? currentValues.filter((item) => item !== normalizedValue)
          : [...currentValues, normalizedValue],
      };
    });
  };

  // ============================================
  // CLEAR ALL
  // ============================================

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

  // ============================================
  // FILTER COUNT
  // ============================================

  const activeFilterCount = Object.values(selectedFilters || {}).reduce(
    (total, values) => total + (Array.isArray(values) ? values.length : 0),
    0
  );

  // ============================================
  // FILTER DATA
  // ============================================

  const sectionConfig = [
    {
      apiKey: "specialization",
      id: "specialization",
      title: "Specialization",
      icon: LocalHospitalOutlined,
    },
    {
      apiKey: "experience",
      id: "experience",
      title: "Experience",
      icon: WorkOutline,
    },
    {
      apiKey: "rating",
      id: "rating",
      title: "Rating",
      icon: StarOutline,
    },
    {
      apiKey: "consultationFee",
      id: "feeRange",
      title: "Consultation Fee",
      icon: CurrencyRupee,
      prefix: "₹",
    },
    {
      apiKey: "gender",
      id: "gender",
      title: "Gender",
      icon: PersonOutline,
    },
  ];

  const filterSections = sectionConfig
    .filter(({ apiKey }) => Array.isArray(filterOptions?.[apiKey]))
    .map((section) => ({
      ...section,
      options: filterOptions[section.apiKey]
        .filter(
          (option) =>
            typeof option === "string" || typeof option === "number"
        )
        .map((option) => {
          const value = String(option);
          let label = value;

          if (section.id === "experience") label = `${value} years`;
          if (section.id === "rating") label = `${value}+ Stars`;
          if (section.id === "gender") {
            label = value.charAt(0) + value.slice(1).toLowerCase();
          }

          return { label, value };
        }),
    }))
    .filter((section) => section.options.length > 0);
  const isLoadingOptions =
    optionsLoading || (open !== false && !filterOptions && !optionsError);

  // ============================================
  // FILTER SECTION
  // ============================================

  const FilterSection = ({ section }) => {
    const Icon = section.icon;

    return (
      <Box
        sx={{
          py: 2.3,
        }}
      >
        {/* SECTION TITLE */}

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            mb: 1.5,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              backgroundColor: colors.primaryLight,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              flexShrink: 0,
            }}
          >
            <Icon
              sx={{
                fontSize: 18,
                color: colors.primary,
              }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 700,
              color: colors.text,
            }}
          >
            {section.title}
          </Typography>

          {/* SELECTED COUNT */}

          {(selectedFilters?.[section.id]?.length || 0) > 0 && (
            <Box
              sx={{
                minWidth: 20,
                height: 20,

                px: 0.6,

                borderRadius: "20px",

                backgroundColor: colors.primary,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                fontSize: "11px",
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              {selectedFilters[section.id].length}
            </Box>
          )}
        </Stack>

        {/* OPTIONS */}

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {section.options.map((option) => {
            const value =
              typeof option === "object"
                ? option.value
                : option;

            const label =
              typeof option === "object"
                ? option.label
                : option;

            const normalizedValue =
              typeof value === "string"
                ? value.toLowerCase()
                : value;

            const selected =
              selectedFilters?.[section.id]?.includes(
                normalizedValue
              );

            return (
              <Chip
                key={`${section.id}-${value}`}

                label={`${section.prefix || ""}${label}`}

                onClick={() =>
                  toggleFilter(section.id, value)
                }

                icon={
                  selected ? (
                    <Check
                      sx={{
                        fontSize: "15px !important",
                      }}
                    />
                  ) : undefined
                }

                sx={{
                  height: 36,

                  borderRadius: "8px",

                  fontSize: "12.5px",

                  fontWeight: selected ? 600 : 500,

                  color: selected
                    ? "#FFFFFF"
                    : colors.text,

                  backgroundColor: selected
                    ? colors.primary
                    : "#FFFFFF",

                  border: selected
                    ? `1px solid ${colors.primary}`
                    : `1px solid ${colors.border}`,

                  cursor: "pointer",

                  transition: "all 0.18s ease",

                  "& .MuiChip-icon": {
                    color: selected
                      ? "#FFFFFF"
                      : colors.primary,
                  },

                  "&:hover": {
                    backgroundColor: selected
                      ? colors.primaryDark
                      : colors.primaryLight,

                    borderColor: selected
                      ? colors.primaryDark
                      : colors.primaryBorder,
                  },

                  "&:active": {
                    transform: "scale(0.97)",
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>
    );
  };

  // ============================================
  // UI
  // ============================================

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",

        display: "flex",
        flexDirection: "column",

        backgroundColor: colors.background,
      }}
    >
      {/* ==========================================
          HEADER
      ========================================== */}

      <Box
        sx={{
          px: {
            xs: 2,
            sm: 2.5,
          },

          py: 2,

          borderBottom: `1px solid ${colors.border}`,

          backgroundColor: "#FFFFFF",

          flexShrink: 0,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack
            direction="row"
            spacing={1.2}
            alignItems="center"
          >
            {/* ICON */}

            <Box
              sx={{
                width: 40,
                height: 40,

                borderRadius: "10px",

                backgroundColor: colors.primaryLight,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Tune
                sx={{
                  fontSize: 21,
                  color: colors.primary,
                }}
              />
            </Box>

            {/* TITLE */}

            <Box>
              <Stack
                direction="row"
                spacing={0.8}
                alignItems="center"
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: colors.text,
                  }}
                >
                  Filters
                </Typography>

                {activeFilterCount > 0 && (
                  <Box
                    sx={{
                      minWidth: 21,
                      height: 21,

                      px: 0.6,

                      borderRadius: "20px",

                      backgroundColor: colors.primary,

                      color: "#FFFFFF",

                      fontSize: "11px",
                      fontWeight: 700,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {activeFilterCount}
                  </Box>
                )}
              </Stack>

              <Typography
                sx={{
                  mt: 0.2,
                  fontSize: "11.5px",
                  color: colors.textSecondary,
                }}
              >
                Refine your doctor search
              </Typography>
            </Box>
          </Stack>

          {/* CLOSE */}

          <IconButton
            onClick={onClose}
            sx={{
              width: 36,
              height: 36,

              borderRadius: "8px",

              color: colors.textSecondary,

              border: `1px solid ${colors.border}`,

              "&:hover": {
                color: colors.primary,
                backgroundColor: colors.primaryLight,
                borderColor: colors.primaryBorder,
              },
            }}
          >
            <Close
              sx={{
                fontSize: 19,
              }}
            />
          </IconButton>
        </Stack>
      </Box>

      {/* ==========================================
          CONTENT
      ========================================== */}

      <Box
        sx={{
          flex: 1,

          overflowY: "auto",

          px: {
            xs: 2,
            sm: 2.5,
          },

          "&::-webkit-scrollbar": {
            width: "5px",
          },

          "&::-webkit-scrollbar-track": {
            backgroundColor: "#F8FAFC",
          },

          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#C9DDD8",
            borderRadius: "20px",
          },

          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: colors.primaryBorder,
          },
        }}
      >
        {isLoadingOptions ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={1.5}
            sx={{ minHeight: 180 }}
          >
            <CircularProgress size={28} sx={{ color: colors.primary }} />
            <Typography sx={{ fontSize: "13px", color: colors.textSecondary }}>
              Loading filters...
            </Typography>
          </Stack>
        ) : optionsError ? (
          <Stack spacing={1.5} sx={{ pt: 2 }}>
            <Alert
              severity="error"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => setRetryCount((count) => count + 1)}
                >
                  Retry
                </Button>
              }
            >
              {optionsError}
            </Alert>
          </Stack>
        ) : filterSections.length > 0 ? (
          filterSections.map((section, index) => (
            <Box key={section.id}>
              <FilterSection section={section} />

              {index !== filterSections.length - 1 && (
                <Divider sx={{ borderColor: "#EEF2F5" }} />
              )}
            </Box>
          ))
        ) : (
          <Typography
            sx={{
              py: 3,
              fontSize: "13px",
              color: colors.textSecondary,
            }}
          >
            No filters are available right now.
          </Typography>
        )}

        <Box sx={{ height: 20 }} />
      </Box>

      {/* ==========================================
          BOTTOM BUTTONS
      ========================================== */}

      <Box
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
          },

          borderTop: `1px solid ${colors.border}`,

          backgroundColor: "#FFFFFF",

          boxShadow:
            "0 -6px 20px rgba(15, 23, 42, 0.04)",

          flexShrink: 0,
        }}
      >
        {/* ACTIVE FILTER TEXT */}

        {activeFilterCount > 0 && (
          <Typography
            sx={{
              mb: 1.2,
              fontSize: "11.5px",
              color: colors.textSecondary,
            }}
          >
            {activeFilterCount}{" "}
            {activeFilterCount === 1
              ? "filter selected"
              : "filters selected"}
          </Typography>
        )}

        <Stack
          direction="row"
          spacing={1.2}
        >
          {/* CLEAR */}

          <Button
            fullWidth
            variant="outlined"
            onClick={clearAllFilters}
            disabled={activeFilterCount === 0 || isLoadingOptions}
            sx={{
              height: 44,

              borderRadius: "9px",

              textTransform: "none",

              fontWeight: 600,
              fontSize: "13px",

              color: colors.primary,

              borderColor: colors.primaryBorder,

              "&:hover": {
                borderColor: colors.primary,
                backgroundColor: colors.primaryLight,
              },

              "&.Mui-disabled": {
                borderColor: "#E2E8F0",
                color: "#94A3B8",
              },
            }}
          >
            Clear All
          </Button>

          {/* APPLY */}

          <Button
  fullWidth
  variant="contained"
  onClick={onApply}
  disabled={isLoadingOptions}
  disableElevation
  sx={{
    height: 44,
    borderRadius: "9px",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "13px",
    backgroundColor: colors.primary,

    "&:hover": {
      backgroundColor: colors.primaryDark,
    },
  }}
>
  Show Doctors
</Button>
        </Stack>
      </Box>
    </Box>
  );
}