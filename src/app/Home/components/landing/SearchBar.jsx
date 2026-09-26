"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
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
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EmergencyRoundedIcon from "@mui/icons-material/EmergencyRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { useRouter } from "next/navigation";
import api from "../../../../utils/axiosInstance";

export default function SearchBar() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  const fetchSuggestions = useCallback(async (query) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;

    setLoading(true);

    try {
      const res = await api.get(
        "/api/doctors/doctor/search",
        {
          params: {
            search: trimmedQuery,
          },
        }
      );

      if (requestId !== requestIdRef.current) return;

      const data = res.data;

      const results = Array.isArray(data)
        ? data
        : data?.doctors ??
          data?.results ??
          data?.data ??
          [];

      const labels = results
        .slice(0, 6)
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          return (
            item?.name ||
            item?.doctorName ||
            item?.doctor_name ||
            item?.fullName ||
            item?.full_name ||
            item?.hospitalName ||
            item?.hospital_name ||
            item?.specialization ||
            item?.title ||
            ""
          );
        })
        .filter(Boolean);

      const uniqueLabels = [...new Set(labels)];

      setSuggestions(uniqueLabels);
      setShowSuggestions(uniqueLabels.length > 0);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      console.error(
        "Search suggestion error:",
        error
      );

      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const handleQueryChange = (event) => {
    const newValue = event.target.value;

    setSearchQuery(newValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!newValue.trim()) {
      requestIdRef.current += 1;
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 450);
  };

  const handleSearch = useCallback(
    (event) => {
      event?.preventDefault();

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      const query = searchQuery.trim();

      if (!query) return;

      setShowSuggestions(false);

      const queryParams = new URLSearchParams({
        query,
        filter: "all",
      });

      router.push(
        `/Home/pages/search?${queryParams.toString()}`
      );
    },
    [searchQuery, router]
  );

  const handleSuggestionClick = (item) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setSearchQuery(item);
    setShowSuggestions(false);

    const queryParams = new URLSearchParams({
      query: item,
      filter: "all",
    });

    router.push(
      `/Home/pages/search?${queryParams.toString()}`
    );
  };

  const handleEmergency = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setShowSuggestions(false);

    router.push(
      "/Home/pages/search?filter=emergency"
    );
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      requestIdRef.current += 1;
    };
  }, []);

  return (
    <ClickAwayListener
      onClickAway={() =>
        setShowSuggestions(false)
      }
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1000px",
          mx: "auto",
          mt: {
            xs: 2.5,
            md: 3,
          },
          px: {
            xs: 2,
            sm: 0,
          },
          position: "relative",
          fontFamily:
            "var(--font-inter), Arial, sans-serif",
        }}
      >
        <Paper
          component="form"
          onSubmit={handleSearch}
          elevation={0}
          sx={{
            width: "100%",
            bgcolor: "rgba(255,255,255,0.97)",
            border: "1px solid #DFE9E6",
            borderRadius: {
              xs: "17px",
              md: "20px",
            },
            boxShadow:
              "0 14px 36px rgba(23,32,51,0.08)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              minHeight: {
                xs: "auto",
                md: "76px",
              },
              px: {
                xs: 1.3,
                sm: 1.6,
                md: 1.8,
              },
              pt: {
                xs: 1.3,
                md: 1.4,
              },
              pb: {
                xs: 1.3,
                md: 0.6,
              },
              display: "flex",
              alignItems: "center",
              gap: {
                xs: 0.8,
                md: 1.2,
              },
              flexWrap: {
                xs: "wrap",
                md: "nowrap",
              },
            }}
          >
            <Box
              sx={{
                flex: 1,
                minWidth: {
                  xs: "100%",
                  md: 0,
                },
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: {
                    xs: 44,
                    md: 48,
                  },
                  height: {
                    xs: 44,
                    md: 48,
                  },
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "13px",
                  bgcolor: "#EAF8F4",
                  color: "#07876A",
                }}
              >
                <SearchRoundedIcon
                  sx={{
                    fontSize: {
                      xs: 18,
                      md: 20,
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  ml: {
                    xs: 1.2,
                    md: 1.5,
                  },
                  textAlign: "left",
                }}
              >
               
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <InputBase
                    value={searchQuery}
                    onChange={handleQueryChange}
                    onFocus={handleFocus}
                    placeholder="Doctor, specialty or hospital..."
                    inputProps={{
                      "aria-label":
                        "Search doctors, specialties or hospitals",
                    }}
                    sx={{
                      width: "100%",
                      flex: 1,
                      fontFamily: "inherit",
                      fontSize: {
                        xs: "12px",
                        md: "13px",
                      },
                      fontWeight: 400,
                      lineHeight: 1.4,
                      color: "#172033",

                      "& input": {
                        p: 0,
                      },

                      "& input::placeholder": {
                        color: "#8A94A3",
                        opacity: 1,
                      },
                    }}
                  />

                  {loading && (
                    <CircularProgress
                      size={15}
                      thickness={4}
                      sx={{
                        ml: 1,
                        mr: 1,
                        flexShrink: 0,
                        color: "#07876A",
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            <Button
              type="button"
              onClick={handleEmergency}
              startIcon={
                <EmergencyRoundedIcon
                  sx={{
                    fontSize:
                      "16px !important",
                  }}
                />
              }
              sx={{
                height: {
                  xs: 44,
                  md: 48,
                },
                minWidth: {
                  xs: "calc(50% - 4px)",
                  sm: "125px",
                  md: "135px",
                },
                px: {
                  xs: 1.3,
                  md: 1.7,
                },
                borderRadius: "12px",
                border:
                  "1px solid #FFD0D3",
                bgcolor: "#FFF5F5",
                color: "#E5484D",
                fontFamily: "inherit",
                fontSize: {
                  xs: "11px",
                  md: "12px",
                },
                fontWeight: 700,
                textTransform: "none",
                whiteSpace: "nowrap",
                boxShadow: "none",

                "& .MuiButton-startIcon": {
                  mr: 0.6,
                },

                "&:hover": {
                  bgcolor: "#FFECEE",
                  borderColor: "#FFBEC3",
                  boxShadow: "none",
                },
              }}
            >
              Emergency
            </Button>

            <Button
              type="submit"
              variant="contained"
              endIcon={
                <ArrowForwardRoundedIcon
                  sx={{
                    fontSize:
                      "18px !important",
                  }}
                />
              }
              sx={{
                height: {
                  xs: 44,
                  md: 48,
                },
                minWidth: {
                  xs: "calc(50% - 4px)",
                  sm: "140px",
                  md: "150px",
                },
                px: {
                  xs: 1.3,
                  md: 2,
                },
                borderRadius: "12px",
                bgcolor: "#07876A",
                color: "#FFFFFF",
                fontFamily: "inherit",
                fontSize: {
                  xs: "11px",
                  md: "12px",
                },
                fontWeight: 700,
                textTransform: "none",
                whiteSpace: "nowrap",
                boxShadow:
                  "0 6px 15px rgba(7,135,106,0.18)",

                "& .MuiButton-endIcon": {
                  ml: 0.9,
                },

                "&:hover": {
                  bgcolor: "#056C55",
                  boxShadow:
                    "0 8px 19px rgba(7,135,106,0.22)",
                },
              }}
            >
              Find Doctor
            </Button>
          </Box>

          <Box
            sx={{
              minHeight: {
                xs: "30px",
                md: "32px",
              },
              px: {
                xs: 1.6,
                md: 1.8,
              },
              pb: {
                xs: 1,
                md: 0.8,
              },
              display: "flex",
              alignItems: "center",
              gap: 0.9,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <LocationOnOutlinedIcon
                sx={{
                  fontSize: "11px",
                  color: "#07876A",
                }}
              />

              <Typography
                sx={{
                  fontFamily: "inherit",
                  fontSize: {
                    xs: "9px",
                    md: "10px",
                  },
                  color: "#758190",
                  whiteSpace: "nowrap",
                }}
              >
                Bhopal
              </Typography>
            </Box>

            <Box
              sx={{
                width: "1px",
                height: "11px",
                bgcolor: "#DFE7E4",
              }}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <AccessTimeRoundedIcon
                sx={{
                  fontSize: "11px",
                  color: "#07876A",
                }}
              />

              <Typography
                sx={{
                  fontFamily: "inherit",
                  fontSize: {
                    xs: "9px",
                    md: "10px",
                  },
                  color: "#758190",
                  whiteSpace: "nowrap",
                }}
              >
                Available today
              </Typography>
            </Box>

            <Typography
              sx={{
                ml: "auto",
                display: {
                  xs: "none",
                  sm: "block",
                },
                fontFamily: "inherit",
                fontSize: "9.5px",
                color: "#98A1AD",
                whiteSpace: "nowrap",
              }}
            >
              Online consultation
            </Typography>
          </Box>
        </Paper>

        {showSuggestions &&
          suggestions.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                position: "absolute",
                top: "calc(100% + 7px)",
                left: {
                  xs: 16,
                  sm: 0,
                },
                right: {
                  xs: 16,
                  sm: 0,
                },
                zIndex: 30,
                overflow: "hidden",
                bgcolor: "#FFFFFF",
                border:
                  "1px solid #DFE9E6",
                borderRadius: "14px",
                boxShadow:
                  "0 14px 35px rgba(15,23,42,0.11)",
              }}
            >
              <Box
                sx={{
                  px: 1.8,
                  pt: 1.2,
                  pb: 0.6,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "inherit",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    color: "#758190",
                    textTransform:
                      "uppercase",
                    letterSpacing:
                      "0.6px",
                  }}
                >
                  Suggestions
                </Typography>
              </Box>

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
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 1.8,
                      py: 1,
                      cursor: "pointer",

                      borderTop:
                        index === 0
                          ? "none"
                          : "1px solid #E2E8F0",

                      "&:hover": {
                        bgcolor:
                          "#F8FAF9",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        flexShrink: 0,
                        borderRadius:
                          "8px",
                        bgcolor:
                          "#EAF8F4",
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                      }}
                    >
                      <SearchRoundedIcon
                        sx={{
                          fontSize: 15,
                          color:
                            "#07876A",
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        fontFamily:
                          "inherit",
                        fontSize:
                          "12px",
                        fontWeight: 500,
                        color:
                          "#172033",
                        overflow:
                          "hidden",
                        textOverflow:
                          "ellipsis",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {item}
                    </Typography>

                    <ArrowForwardRoundedIcon
                      sx={{
                        fontSize: 15,
                        color:
                          "#758190",
                        opacity: 0.6,
                      }}
                    />
                  </Box>
                )
              )}
            </Paper>
          )}
      </Box>
    </ClickAwayListener>
  );
}