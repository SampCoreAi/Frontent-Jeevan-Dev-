"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Box,
  Paper,
  Button,
  InputBase,
  ClickAwayListener,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import api from "../../../../../utils/axiosInstance";


export default function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  const isFetching = useRef(false);
  const lastQueryRef = useRef("");

  const fetchSuggestions = useCallback(async (query) => {
    if (!query.trim() || isFetching.current) return;

    if (lastQueryRef.current === query) return;
    lastQueryRef.current = query;

    isFetching.current = true;
    setLoading(true);

    try {
      const res = await api.get(
        "/api/doctors/doctor/search",
        {
          params: {
  search: query.trim(),
  limit: 6,
  offset: 0,
          },
        }
      );

      const data = res.data;

      const results = Array.isArray(data)
        ? data
        : data.doctors ?? data.results ?? data.data ?? [];

  const labels = results
  .slice(0, 6)
  .map((item) => item.fullName)
  .filter(Boolean);
      setSuggestions(labels);
      setShowSuggestions(labels.length > 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, []);
  const handleQueryChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 500); // thoda increase bhi kar diya
  };
  // Cleanup debounce on unmount
  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    onSearch(searchQuery); // parent ko query bhejo
  };

  const handleSuggestionClick = (item) => {
    setSearchQuery(item);
    setShowSuggestions(false);

    onSearch(item);
  };

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        position: "relative",
        px: { xs: 2, sm: 0 },
      }}
      ref={searchRef}
    >
      <Paper
        component="form"
        onSubmit={handleSearch}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1, sm: 1.5 },
          p: { xs: 1.2, sm: 1.5 },
          borderRadius: { xs: "16px", sm: "20px" },
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* Search Input */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            bgcolor: "#f1f5f9",
            px: { xs: 2, sm: 3 },
            borderRadius: "50px",
          }}
        >
          <SearchIcon sx={{ color: "#94a3b8", mr: 1 }} />
          <InputBase
            placeholder="Search doctors, hospitals..."
            value={searchQuery}
              inputProps={{
    maxLength: 100,
  }}
            onChange={handleQueryChange}

            sx={{
              flex: 1,
              py: { xs: 1, sm: 1.2 },
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          />
          {/* Loading spinner inside input */}
          {loading && (
            <CircularProgress size={18} sx={{ color: "#1e6658", ml: 1 }} />
          )}
        </Box>

        {/* Search Button */}
        <Button
          type="submit"
          variant="contained"
          sx={{
            borderRadius: "50px",
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 1, sm: 1.2 },
            bgcolor: "#1e6658",
            textTransform: "none",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            width: { xs: "100%", sm: "auto" },
            minWidth: { sm: "120px" },
          }}
        >
          Search
        </Button>
      </Paper>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
          <Paper
            sx={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              borderRadius: 2,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              zIndex: 10,
              overflow: "hidden",
            }}
          >
            {suggestions.map((item, index) => (
              <Box
                key={index}
                onClick={() => handleSuggestionClick(item)}
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#f0fdf4" },
                }}
              >
                {item}
              </Box>
            ))}
          </Paper>
        </ClickAwayListener>
      )}
    </Box>
  );
}