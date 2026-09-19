"use client";

import {
  Box,
  Typography,
  Stack,
  Chip,
  Button,
  Divider,
  IconButton,
} from "@mui/material";

import {
  Close,
  LocalHospitalOutlined,
  WorkOutline,
  StarOutline,
  AccessTime,
  VideoCallOutlined,
  CurrencyRupee,
  PersonOutline,
  Check,
  Tune,
} from "@mui/icons-material";

export default function FiltersSidebar({
  selectedFilters,
  setSelectedFilters,
  onClose,
  onApply,
}) {
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

  const filterSections = [
    {
      id: "specialization",
      title: "Specialization",
      icon: LocalHospitalOutlined,
      options: [
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
    },

    {
      id: "experience",
      title: "Experience",
      icon: WorkOutline,
      options: [
        "0-5 years",
        "5-10 years",
        "10-15 years",
        "15+ years",
      ],
    },

    {
      id: "rating",
      title: "Rating",
      icon: StarOutline,
      options: [
        {
          label: "4+ Stars",
          value: "4",
        },
        {
          label: "3+ Stars",
          value: "3",
        },
        {
          label: "2+ Stars",
          value: "2",
        },
      ],
    },

    {
      id: "availability",
      title: "Availability",
      icon: AccessTime,
      options: [
        "Available Today",
        "Available Tomorrow",
        "This Week",
      ],
    },

    {
      id: "consultationType",
      title: "Consultation Type",
      icon: VideoCallOutlined,
      options: [
        "In-Person",
        "Video Consult",
        "Chat",
      ],
    },

    {
      id: "feeRange",
      title: "Consultation Fee",
      icon: CurrencyRupee,
      prefix: "₹",
      options: [
        "0-500",
        "500-1000",
        "1000-2000",
        "2000+",
      ],
    },

    {
      id: "gender",
      title: "Gender",
      icon: PersonOutline,
      options: [
        "Male",
        "Female",
        "Other",
      ],
    },
  ];

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
        {filterSections.map((section, index) => (
          <Box key={section.id}>
            <FilterSection section={section} />

            {index !== filterSections.length - 1 && (
              <Divider
                sx={{
                  borderColor: "#EEF2F5",
                }}
              />
            )}
          </Box>
        ))}

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
            disabled={activeFilterCount === 0}
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