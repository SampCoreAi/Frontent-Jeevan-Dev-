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

const PRIMARY = "#0a9f7d";
const PRIMARY_DARK = "#07876a";

export default function SearchBar({
  onSearch,
  onFilterClick,
  onNearbyClick,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
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
      {/* ===============================
          TITLE
      =============================== */}


      {/* ===============================
          SEARCH ROW
      =============================== */}

      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: {
            xs: "7px",
            sm: "10px",
          },
          width: "100%",
        }}
      >
        {/* ===========================
            INPUT
        =========================== */}

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
                xs: "48px",
                sm: "56px",
              },

              display: "flex",
              alignItems: "center",

              px: {
                xs: "13px",
                sm: "18px",
              },

              bgcolor: "#ffffff",

              border: "1px solid #d9e4e1",

              borderRadius: {
                xs: "11px",
                sm: "13px",
              },

              boxShadow:
                "0 2px 8px rgba(15,23,42,0.03)",

              transition: "all .2s ease",

              "&:hover": {
                borderColor: "#b9cec8",
              },

              "&:focus-within": {
                borderColor: PRIMARY,

                boxShadow:
                  "0 0 0 3px rgba(10,159,125,0.08)",
              },
            }}
          >
            <SearchIcon
              sx={{
                color: "#8795a8",

                fontSize: {
                  xs: "20px",
                  sm: "22px",
                },

                mr: {
                  xs: 1,
                  sm: 1.5,
                },

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

                color: "#27364b",

                fontSize: {
                  xs: "12px",
                  sm: "14px",
                },

                "& input::placeholder": {
                  color: "#929caf",
                  opacity: 1,
                },
              }}
            />

            {loading && (
              <CircularProgress
                size={18}
                thickness={4}
                sx={{
                  color: PRIMARY,
                  ml: 1,
                }}
              />
            )}
          </Paper>

          {/* ===========================
              SUGGESTIONS
          =========================== */}

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

                    top: "calc(100% + 6px)",
                    left: 0,
                    right: 0,

                    bgcolor: "#fff",

                    border:
                      "1px solid #e1e8e6",

                    borderRadius: "11px",

                    overflow: "hidden",

                    boxShadow:
                      "0 12px 30px rgba(15,23,42,0.12)",

                    zIndex: 1500,
                  }}
                >
                  {suggestions.map(
                    (item, index) => (
                      <Box
                        key={`${item}-${index}`}
                        onClick={() =>
                          handleSuggestionClick(
                            item
                          )
                        }
                        sx={{
                          height: "46px",

                          px: 2,

                          display: "flex",
                          alignItems: "center",

                          gap: 1.3,

                          cursor: "pointer",

                          borderBottom:
                            index !==
                            suggestions.length -
                              1
                              ? "1px solid #f0f3f2"
                              : "none",

                          "&:hover": {
                            bgcolor:
                              "#f0faf7",
                          },
                        }}
                      >
                        <SearchIcon
                          sx={{
                            fontSize: "18px",
                            color: "#8795a5",
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#263238",
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

        {/* ===========================
            SEARCH
        =========================== */}

        <Button
          type="submit"
          disableElevation
          variant="contained"
          sx={{
            height: {
              xs: "48px",
              sm: "56px",
            },

            minWidth: {
              xs: "74px",
              sm: "112px",
            },

            px: {
              xs: 1.5,
              sm: 2.5,
            },

            bgcolor: PRIMARY,

            color: "#fff",

            borderRadius: {
              xs: "11px",
              sm: "13px",
            },

            fontSize: {
              xs: "11px",
              sm: "13px",
            },

            fontWeight: 700,

            textTransform: "none",

            "&:hover": {
              bgcolor: PRIMARY_DARK,
            },
          }}
        >
          Search
        </Button>

        {/* ===========================
            FILTER
        =========================== */}

        <Button
          type="button"
          onClick={onFilterClick}
          startIcon={
            <TuneIcon
              sx={{
                fontSize: "19px !important",
              }}
            />
          }
          sx={{
            height: {
              xs: "48px",
              sm: "56px",
            },

            minWidth: {
              xs: "48px",
              sm: "112px",
            },

            px: {
              xs: 0,
              sm: 2,
            },

            bgcolor: "#f0faf7",

            color: "#087d64",

            border:
              "1px solid #c6e8df",

            borderRadius: {
              xs: "11px",
              sm: "13px",
            },

            fontSize: "13px",
            fontWeight: 700,

            textTransform: "none",

            "&:hover": {
              bgcolor: "#e5f7f2",
              borderColor: "#9edaca",
            },

            "& .MuiButton-startIcon": {
              margin: {
                xs: 0,
                sm: "0 7px 0 0",
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

        {/* ===========================
            NEARBY
        =========================== */}

        <Button
          type="button"
          onClick={handleNearby}
          startIcon={
            <LocationOnOutlinedIcon
              sx={{
                fontSize: "20px !important",
              }}
            />
          }
          sx={{
            height: {
              xs: "48px",
              sm: "56px",
            },

            minWidth: {
              xs: "48px",
              sm: "112px",
            },

            px: {
              xs: 0,
              sm: 2,
            },

            bgcolor: "#ffffff",

            color: PRIMARY,

            border:
              "1px solid #bde3da",

            borderRadius: {
              xs: "11px",
              sm: "13px",
            },

            fontSize: "13px",
            fontWeight: 700,

            textTransform: "none",

            "&:hover": {
              bgcolor: "#f0faf7",
              borderColor: PRIMARY,
            },

            "& .MuiButton-startIcon": {
              margin: {
                xs: 0,
                sm: "0 7px 0 0",
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