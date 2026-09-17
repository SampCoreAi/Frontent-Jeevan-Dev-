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

import api from "../../../../../utils/axiosInstance";

export default function SearchBar({
  onSearch,
  onFilterClick,
  onNearbyClick,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);
  const isFetching = useRef(false);
  const lastQueryRef = useRef("");

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

              // GLOBAL THEME
              bgcolor: "background.paper",

              border: "1px solid",
              borderColor: "divider",

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

            <InputBase
              placeholder="Doctor, specialization or hospital"
              value={searchQuery}
              onChange={handleQueryChange}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              inputProps={{
                maxLength: 100,
              }}
              sx={{
                flex: 1,
                minWidth: 0,

                color: "text.primary",

                fontSize: {
                  xs: "12px",
                  sm: "13px",
                },

                "& input::placeholder": {
                  color: "text.disabled",
                  opacity: 1,
                },
              }}
            />

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

                          borderColor:
                            "divider",

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

            // IMPORTANT:
            // DIRECTLY GLOBAL THEME PRIMARY
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

        {/* =====================================
            FILTER BUTTON
        ====================================== */}

        <Button
          type="button"
          onClick={onFilterClick}
          startIcon={
            <TuneIcon
              sx={{
                fontSize: "18px !important",
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
              sm: "88px",
            },

            px: {
              xs: 0,
              sm: 1.5,
            },

            // GLOBAL THEME
            bgcolor: "secondary.light",

            color: "primary.main",

            border: "1px solid",

            borderColor: "primary.light",

            borderRadius: 1,

            fontSize: "12.5px",

            fontWeight: 600,

            whiteSpace: "nowrap",

            "&:hover": {
              bgcolor: "secondary.light",

              borderColor:
                "primary.main",

              color: "primary.dark",
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
            Filters
          </Box>
        </Button>

        {/* =====================================
            NEARBY BUTTON
        ====================================== */}

        <Button
          type="button"
          onClick={handleNearby}
          startIcon={
            <LocationOnOutlinedIcon
              sx={{
                fontSize: "19px !important",
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
              sm: 1.5,
            },

            // GLOBAL THEME
            bgcolor: "background.paper",

            color: "primary.main",

            border: "1px solid",

            borderColor: "primary.main",

            borderRadius: 1,

            fontSize: "12.5px",

            fontWeight: 600,

            whiteSpace: "nowrap",

            "&:hover": {
              bgcolor: "secondary.light",

              borderColor:
                "primary.dark",

              color: "primary.dark",
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
            Nearby
          </Box>
        </Button>
      </Box>
    </Box>
  );
}