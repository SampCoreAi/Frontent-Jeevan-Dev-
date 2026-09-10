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
import api from "../../../../utils/axiosInstance";

export default function SearchBar({ value, onChange }) {
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
          search: query,
        },
      }
    );

    const data = res.data;

    const results = Array.isArray(data)
      ? data
      : data.doctors ?? data.results ?? data.data ?? [];

    const labels = results.slice(0, 6).map((item) => {
      return (
        item.name ||
        item.doctorName ||
        item.fullName ||
        item.hospitalName ||
        item.title ||
        String(item)
      );
    });

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

  const handleSearch = useCallback(
  (e) => {
    e.preventDefault();

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    isFetching.current = true; // stop further calls

    const queryParams = new URLSearchParams({
      query: searchQuery,
      filter: "all",
    });

    router.push(`/Home/pages/search?${queryParams.toString()}`);
  },
  [searchQuery, router]
);

const handleSuggestionClick = (item) => {
  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }

  isFetching.current = true;

  setSearchQuery(item);
  setShowSuggestions(false);

  const queryParams = new URLSearchParams({ query: item, filter: "all" });
  router.push(`/Home/pages/search?${queryParams.toString()}`);
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
            onChange={handleQueryChange}
           
            sx={{
              flex: 1,
              py: { xs: 1, sm: 1.2 },
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          />
          <Button
  type="button"
  variant="contained"
  onClick={() => {
    router.push("/Home/pages/search?filter=emergency");
  }}
  sx={{
    minWidth: { xs: "auto", sm: "120px" },
    px: { xs: 2, sm: 2.5 },
    py: { xs: 0.8, sm: 1 },

    borderRadius: "50px",

    // Soft emergency red
    bgcolor: "#F45B69",
    color: "#fff",

    textTransform: "none",
    fontWeight: 600,
    fontSize: { xs: "0.8rem", sm: "0.9rem" },
    whiteSpace: "nowrap",

    boxShadow: "0 3px 8px rgba(244, 91, 105, 0.25)",

    "&:hover": {
      bgcolor: "#E94B5A",
      boxShadow: "0 4px 10px rgba(244, 91, 105, 0.3)",
    },

    "&:active": {
      transform: "scale(0.98)",
    },
  }}
>
  Emergency
</Button>
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