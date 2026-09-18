"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";

import {
  Box,
  Paper,
  Button,
  InputBase,
  ClickAwayListener,
  CircularProgress,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SearchActions from "../../../../Home/components/SearchPage/components/SearchActions";
import api from "../../../../../utils/axiosInstance";

export default function SearchBar({
  onSearch,
  onFilterClick,
  onNearbyClick,
  onEmergencyClick, // add this
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // ANIMATED PLACEHOLDER
  // ==========================================
const placeholderTexts = [
  "Find the right doctor for your health needs",
  "Search doctors by name, specialty or hospital",
  "Find experienced doctors and book your appointment",
  "Search for trusted doctors and hospitals near you",
  "Find specialists for the care you need",
];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const debounceRef = useRef(null);
  const isFetching = useRef(false);
  const lastQueryRef = useRef("");

  // ==========================================
  // PLACEHOLDER ROTATION
  // ==========================================

  useEffect(() => {
    // User type kar raha hai to animation ki zarurat nahi
    if (searchQuery.trim()) return;

    const interval = setInterval(() => {
      setPlaceholderIndex(
        (prev) => (prev + 1) % placeholderTexts.length
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [searchQuery]);

  // ==========================================
  // FETCH SUGGESTIONS
  // ==========================================

  const fetchSuggestions = useCallback(async (query) => {
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      setSuggestions([]);
      setShowSuggestions(false);
      lastQueryRef.current = "";
      return;
    }

    if (isFetching.current) return;

    if (lastQueryRef.current === cleanQuery) return;

    lastQueryRef.current = cleanQuery;

    isFetching.current = true;
    setLoading(true);

    try {
      const res = await api.get(
        "/api/doctors/doctor/search",
        {
          params: {
            search: cleanQuery,
            limit: 6,
            offset: 0,
          },
        }
      );

      const data = res.data;

      const results = Array.isArray(data)
        ? data
        : data.doctors ??
          data.results ??
          data.data ??
          [];

      const labels = results
        .slice(0, 6)
        .map(
          (item) =>
            item.fullName ||
            item.username ||
            item.specialization ||
            item.hospitalDetail?.[0]?.hospitalName
        )
        .filter(Boolean);

      setSuggestions(labels);
      setShowSuggestions(labels.length > 0);
    } catch (err) {
      console.error("Suggestion Error:", err);

      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, []);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleQueryChange = (e) => {
    const value = e.target.value;

    setSearchQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      lastQueryRef.current = "";
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 500);
  };

  // ==========================================
  // CLEANUP
  // ==========================================

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (e) => {
    e.preventDefault();

    setShowSuggestions(false);

    onSearch?.(searchQuery.trim());
  };

  // ==========================================
  // SUGGESTION CLICK
  // ==========================================

  const handleSuggestionClick = (item) => {
    setSearchQuery(item);

    setSuggestions([]);
    setShowSuggestions(false);

    onSearch?.(item);
  };

  // ==========================================
  // NEARBY
  // ==========================================

  const handleNearby = () => {
    setShowSuggestions(false);

    onNearbyClick?.();
  };

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{
          display: "flex",
          alignItems: "center",

          gap: {
            xs: "6px",
            sm: "8px",
          },

          width: "100%",
        }}
      >
        {/* =====================================
            SEARCH INPUT
        ====================================== */}

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            position: "relative",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",

              height: {
                xs: "44px",
                sm: "46px",
              },

              display: "flex",
              alignItems: "center",

              px: {
                xs: "12px",
                sm: "14px",
              },

              bgcolor: "background.paper",

              border: "1px solid",
              borderColor: "#c6c6c6",

              borderRadius: 1,

              boxShadow:
                "0 1px 3px rgba(15, 23, 42, 0.03)",

              transition: "all 0.2s ease",

              "&:hover": {
                borderColor: "primary.light",
              },

              "&:focus-within": {
                borderColor: "primary.main",

                boxShadow:
                  "0 0 0 3px rgba(63, 166, 90, 0.10)",
              },
            }}
          >
            {/* SEARCH ICON */}

            <SearchIcon
              sx={{
                color: "text.disabled",

                fontSize: {
                  xs: "19px",
                  sm: "20px",
                },

                mr: 1,

                flexShrink: 0,
              }}
            />

            {/* =====================================
                INPUT + ANIMATED PLACEHOLDER
            ====================================== */}

            <Box
              sx={{
                flex: 1,
                minWidth: 0,

                height: "100%",

                position: "relative",

                display: "flex",
                alignItems: "center",

                overflow: "hidden",
              }}
            >
              {/* ANIMATED PLACEHOLDER */}

              {!searchQuery && (
                <Box
                  key={placeholderIndex}
                  sx={{
                    position: "absolute",

                    left: 0,
                    right: 0,

                    display: "flex",
                    alignItems: "center",

                    color: "text.disabled",

                    fontSize: {
                      xs: "12px",
                      sm: "13px",
                    },

                    whiteSpace: "nowrap",

                    overflow: "hidden",
                    textOverflow: "ellipsis",

                    pointerEvents: "none",

                    animation:
                      "placeholderSlide 0.5s ease",

                    "@keyframes placeholderSlide": {
                      "0%": {
                        opacity: 0,
                        transform: "translateY(22px)",
                      },

                      "100%": {
                        opacity: 1,
                        transform: "translateY(0)",
                      },
                    },
                  }}
                >
                  {placeholderTexts[placeholderIndex]}
                </Box>
              )}

              {/* REAL INPUT */}

              <InputBase
                value={searchQuery}
                onChange={handleQueryChange}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                inputProps={{
                  maxLength: 100,
                  "aria-label":
                    "Search doctors and hospitals",
                }}
                sx={{
                  width: "100%",
                  height: "100%",

                  position: "relative",
                  zIndex: 1,

                  color: "text.primary",

                  fontSize: {
                    xs: "12px",
                    sm: "13px",
                  },

                  "& input": {
                    padding: 0,
                  },
                }}
              />
            </Box>

            {/* LOADING */}

            {loading && (
              <CircularProgress
                size={16}
                thickness={4}
                color="primary"
                sx={{
                  ml: 1,
                }}
              />
            )}
          </Paper>

          {/* =====================================
              SUGGESTIONS
          ====================================== */}

          {showSuggestions &&
            suggestions.length > 0 && (
              <ClickAwayListener
                onClickAway={() =>
                  setShowSuggestions(false)
                }
              >
                <Paper
                  elevation={0}
                  sx={{
                    position: "absolute",

                    top: "calc(100% + 5px)",
                    left: 0,
                    right: 0,

                    bgcolor: "background.paper",

                    border: "1px solid",
                    borderColor: "divider",

                    borderRadius: 1,

                    overflow: "hidden",

                    boxShadow:
                      "0 10px 25px rgba(15, 23, 42, 0.10)",

                    zIndex: 1500,
                  }}
                >
                  {suggestions.map(
                    (item, index) => (
                      <Box
                        key={`${item}-${index}`}
                        onClick={() =>
                          handleSuggestionClick(item)
                        }
                        sx={{
                          minHeight: "42px",

                          px: 1.6,

                          display: "flex",
                          alignItems: "center",

                          gap: 1,

                          cursor: "pointer",

                          borderBottom:
                            index !==
                            suggestions.length - 1
                              ? "1px solid"
                              : "none",

                          borderColor: "divider",

                          transition:
                            "background-color 0.15s ease",

                          "&:hover": {
                            bgcolor:
                              "secondary.light",
                          },
                        }}
                      >
                        <SearchIcon
                          sx={{
                            fontSize: "17px",

                            color:
                              "text.disabled",
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: "12.5px",

                            fontWeight: 500,

                            color:
                              "text.primary",
                          }}
                        >
                          {item}
                        </Typography>
                      </Box>
                    )
                  )}
                </Paper>
              </ClickAwayListener>
            )}
        </Box>

        {/* =====================================
            SEARCH BUTTON
        ====================================== */}

        <Button
          type="submit"
          startIcon={
            <SearchIcon
              sx={{
                fontSize: "17px !important",
              }}
            />
          }
          sx={{
            height: {
              xs: "44px",
              sm: "46px",
            },

            minWidth: {
              xs: "44px",
              sm: "92px",
            },

            px: {
              xs: 0,
              sm: 1.7,
            },

            bgcolor: "primary.main",
            color: "primary.contrastText",

            borderRadius: 1,

            fontSize: "12.5px",
            fontWeight: 600,

            whiteSpace: "nowrap",

            "&:hover": {
              bgcolor: "primary.dark",
            },

            "& .MuiButton-startIcon": {
              margin: {
                xs: 0,
                sm: "0 6px 0 0",
              },
            },
          }}
        >
          <Box
            component="span"
            sx={{
              display: {
                xs: "none",
                sm: "inline",
              },
            }}
          >
            Search
          </Box>
        </Button>

        <SearchActions
  onFilterClick={onFilterClick}
  onNearbyClick={handleNearby}
  onEmergencyClick={onEmergencyClick}
/>
      </Box>
    </Box>
  );
}