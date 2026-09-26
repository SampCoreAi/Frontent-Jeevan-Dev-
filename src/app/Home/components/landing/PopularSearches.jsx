"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Fade,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  InputBase,
} from "@mui/material";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccessibilityNewRoundedIcon from "@mui/icons-material/AccessibilityNewRounded";
import ChildCareRoundedIcon from "@mui/icons-material/ChildCareRounded";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import HearingOutlinedIcon from "@mui/icons-material/HearingOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FemaleRoundedIcon from "@mui/icons-material/FemaleRounded";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";

const specialities = [
  {
    name: "All",
    subtitle: "Explore doctors",
    count: "",
    icon: LocalHospitalOutlinedIcon,
  },
  {
    name: "Cardiology",
    subtitle: "Heart care",
    count: "124 Doctors",
    icon: FavoriteBorderRoundedIcon,
  },
  {
    name: "Neurology",
    subtitle: "Brain & nerves",
    count: "98 Doctors",
    icon: PsychologyOutlinedIcon,
  },
  {
    name: "Pediatrics",
    subtitle: "Child care",
    count: "104 Doctors",
    icon: ChildCareRoundedIcon,
  },
  {
    name: "Dermatology",
    subtitle: "Skin care",
    count: "87 Doctors",
    icon: SpaOutlinedIcon,
  },
  {
    name: "Orthopedics",
    subtitle: "Bone & joints",
    count: "112 Doctors",
    icon: AccessibilityNewRoundedIcon,
  },
  {
    name: "Gynecology",
    subtitle: "Women's health",
    count: "96 Doctors",
    icon: FemaleRoundedIcon,
  },
  {
    name: "General Medicine",
    subtitle: "General care",
    count: "210 Doctors",
    icon: MedicalServicesOutlinedIcon,
  },
  {
    name: "ENT",
    subtitle: "Ear, nose & throat",
    count: "76 Doctors",
    icon: HearingOutlinedIcon,
  },
  {
    name: "Ophthalmology",
    subtitle: "Eye care",
    count: "68 Doctors",
    icon: VisibilityOutlinedIcon,
  },
  {
    name: "Psychiatry",
    subtitle: "Mental health",
    count: "54 Doctors",
    icon: PsychologyOutlinedIcon,
  },
  {
    name: "Dentistry",
    subtitle: "Dental care",
    count: "82 Doctors",
    icon: MedicalServicesOutlinedIcon,
  },
];

export default function PopularSearches({
  popularSearches,
  activeSearch,
  setActiveSearch,
  setSearchQuery,
  setCity,
  isVisible,
  slideUpFade,
}) {
  const [open, setOpen] = useState(false);
  const [specialitySearch, setSpecialitySearch] =
    useState("");

  const landingSpecialities = useMemo(() => {
    const names =
      Array.isArray(popularSearches) &&
      popularSearches.length
        ? popularSearches
        : [
            "All",
            "Cardiology",
            "Neurology",
            "Pediatrics",
            "Dermatology",
          ];

    return names.slice(0, 5).map((name) => {
      const existing = specialities.find(
        (item) => item.name === name
      );

      return (
        existing || {
          name,
          subtitle: "Find doctors",
          count: "",
          icon: MedicalServicesOutlinedIcon,
        }
      );
    });
  }, [popularSearches]);

  const filteredSpecialities = useMemo(() => {
    const query = specialitySearch
      .trim()
      .toLowerCase();

    if (!query) {
      return specialities.filter(
        (item) => item.name !== "All"
      );
    }

    return specialities.filter((item) => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.subtitle
          .toLowerCase()
          .includes(query)
      );
    });
  }, [specialitySearch]);

  const handleSpeciality = (name) => {
    setActiveSearch(name);

    if (name === "All") {
      setSearchQuery("");
    } else {
      setSearchQuery(name);
    }

    setCity("bangalore");
  };

  const handleDialogSpeciality = (name) => {
    handleSpeciality(name);
    setOpen(false);
    setSpecialitySearch("");
  };

  const handleClose = () => {
    setOpen(false);
    setSpecialitySearch("");
  };

  return (
    <>
      <Fade
        in={isVisible}
        timeout={1400}
        style={{
          transitionDelay: "600ms",
        }}
      >
        <Box
          sx={{
            width: "100%",
            mx: "auto",
            mt: {
              xs: 3,
              md: "27px",
            },
            fontFamily:
              "var(--font-inter), Arial, sans-serif",
          }}
        >
          <Box
            sx={{
              mb: "12px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 2,
              textAlign: "left",
            }}
          >
            <Box>
              <Typography
                sx={{
                  mb: "3px",
                  color: "#07876A",
                  fontFamily: "inherit",
                  fontSize: "9px",
                  lineHeight: 1.2,
                  fontWeight: 800,
                  letterSpacing: "1.2px",
                }}
              >
                EXPLORE SPECIALTIES
              </Typography>

              <Typography
                component="h3"
                sx={{
                  m: 0,
                  color: "#172033",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  lineHeight: 1.3,
                  fontWeight: 700,
                }}
              >
                Find care by specialty
              </Typography>
            </Box>

            <Button
              onClick={() => setOpen(true)}
              endIcon={
                <ArrowForwardRoundedIcon />
              }
              sx={{
                minWidth: "auto",
                px: 0.5,
                py: 0.4,
                color: "#07876A",
                fontFamily: "inherit",
                fontSize: "10.5px",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "8px",

                "& .MuiButton-endIcon": {
                  ml: "4px",
                },

                "& .MuiSvgIcon-root": {
                  fontSize:
                    "15px !important",
                  transition:
                    "transform 0.2s ease",
                },

                "&:hover": {
                  bgcolor:
                    "rgba(7,135,106,0.06)",
                },

                "&:hover .MuiSvgIcon-root":
                  {
                    transform:
                      "translateX(3px)",
                  },
              }}
            >
              View all
            </Button>
          </Box>

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(3, minmax(0, 1fr))",
                md: "repeat(5, minmax(0, 1fr))",
              },

              gap: "9px",

              "@media (max-width:400px)": {
                gridTemplateColumns: "1fr",
              },
            }}
          >
            {landingSpecialities.map(
              (item, index) => {
                const isActive =
                  activeSearch === item.name;

                const Icon = item.icon;

                return (
                  <Box
                    component="button"
                    type="button"
                    key={item.name}
                    onClick={() =>
                      handleSpeciality(
                        item.name
                      )
                    }
                    sx={{
                      width: "100%",
                      minWidth: 0,
                      minHeight: "64px",
                      p: "9px 10px",

                      display: "flex",
                      alignItems: "center",

                      gap: "9px",

                      border: "1px solid",
                      borderColor: isActive
                        ? "#07876A"
                        : "#E4EBE9",

                      borderRadius: "14px",

                      bgcolor: isActive
                        ? "#07876A"
                        : "rgba(255,255,255,0.92)",

                      fontFamily: "inherit",
                      textAlign: "left",
                      cursor: "pointer",

                      boxShadow: isActive
                        ? "0 9px 24px rgba(7,135,106,0.17)"
                        : "0 5px 16px rgba(23,32,51,0.035)",

                      transition:
                        "all 0.2s ease",

                      animation: `${slideUpFade} 0.5s ease-out ${
                        index * 0.05
                      }s both`,

                      "&:hover": {
                        transform:
                          "translateY(-2px)",

                        borderColor: isActive
                          ? "#07876A"
                          : "#A9DACF",

                        boxShadow:
                          "0 9px 24px rgba(23,32,51,0.07)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: "35px",
                        height: "35px",
                        minWidth: "35px",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        borderRadius: "10px",

                        bgcolor: isActive
                          ? "rgba(255,255,255,0.16)"
                          : "#EAF8F4",

                        color: isActive
                          ? "#FFFFFF"
                          : "#07876A",
                      }}
                    >
                      <Icon
                        sx={{
                          fontSize: "19px",
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        sx={{
                          color: isActive
                            ? "#FFFFFF"
                            : "#315E55",

                          fontFamily:
                            "inherit",

                          fontSize:
                            "10.5px",

                          lineHeight: 1.25,

                          fontWeight: 700,

                          overflow: "hidden",
                          textOverflow:
                            "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        sx={{
                          mt: "2px",

                          color: isActive
                            ? "rgba(255,255,255,0.72)"
                            : "#98A19F",

                          fontFamily:
                            "inherit",

                          fontSize: "8.5px",
                          lineHeight: 1.25,

                          overflow: "hidden",
                          textOverflow:
                            "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                );
              }
            )}
          </Box>
        </Box>
      </Fade>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "760px",
            m: {
              xs: 1.5,
              sm: 3,
            },
            borderRadius: {
              xs: "18px",
              sm: "22px",
            },
            border:
              "1px solid #E2E8F0",
            boxShadow:
              "0 24px 70px rgba(15,23,42,0.16)",
            overflow: "hidden",
            fontFamily:
              "var(--font-inter), Arial, sans-serif",
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              bgcolor:
                "rgba(15,23,42,0.35)",
              backdropFilter: "blur(4px)",
            },
          },
        }}
      >
        <DialogContent
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
          }}
        >
          <Box
            sx={{
              mb: 2.2,

              display: "flex",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              justifyContent:
                "space-between",

              gap: 2,

              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >
            <Box
              sx={{
                textAlign: "left",
              }}
            >
              <Typography
                sx={{
                  color: "#172033",
                  fontFamily: "inherit",
                  fontSize: {
                    xs: "16px",
                    sm: "18px",
                  },
                  lineHeight: 1.25,
                  fontWeight: 800,
                }}
              >
                Select Specialization
              </Typography>

              <Typography
                sx={{
                  mt: "4px",
                  color: "#758190",
                  fontFamily: "inherit",
                  fontSize: {
                    xs: "10.5px",
                    sm: "11.5px",
                  },
                }}
              >
                Choose a specialization to
                find the right doctor for
                you
              </Typography>
            </Box>

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "285px",
                },
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  height: "42px",

                  display: "flex",
                  alignItems: "center",

                  px: 1.5,

                  border:
                    "1px solid #E7ECEB",

                  borderRadius: "13px",

                  bgcolor: "#F8FAF9",
                }}
              >
                <SearchRoundedIcon
                  sx={{
                    mr: 1,
                    fontSize: "18px",
                    color: "#596575",
                  }}
                />

                <InputBase
                  value={specialitySearch}
                  onChange={(e) =>
                    setSpecialitySearch(
                      e.target.value
                    )
                  }
                  placeholder="Search specialization..."
                  sx={{
                    flex: 1,
                    minWidth: 0,

                    fontFamily: "inherit",
                    fontSize: "11px",

                    color: "#172033",

                    "& input::placeholder":
                      {
                        color: "#8A94A3",
                        opacity: 1,
                      },
                  }}
                />
              </Box>

              <IconButton
                onClick={handleClose}
                sx={{
                  width: 38,
                  height: 38,
                  flexShrink: 0,

                  display: {
                    xs: "flex",
                    sm: "none",
                  },

                  border:
                    "1px solid #E2E8F0",

                  color: "#596575",
                }}
              >
                <CloseRoundedIcon
                  sx={{
                    fontSize: 18,
                  }}
                />
              </IconButton>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(3, minmax(0, 1fr))",
                md: "repeat(4, minmax(0, 1fr))",
              },

              gap: {
                xs: 1,
                sm: 1.2,
              },

              "@media(max-width:380px)": {
                gridTemplateColumns: "1fr",
              },
            }}
          >
            {filteredSpecialities.map(
              (item) => {
                const selected =
                  activeSearch === item.name;

                const Icon = item.icon;

                return (
                  <Box
                    component="button"
                    type="button"
                    key={item.name}
                    onClick={() =>
                      handleDialogSpeciality(
                        item.name
                      )
                    }
                    sx={{
                      minWidth: 0,
                      minHeight: {
                        xs: "105px",
                        sm: "118px",
                      },

                      p: {
                        xs: 1.3,
                        sm: 1.5,
                      },

                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent:
                        "center",

                      border: "1px solid",

                      borderColor: selected
                        ? "#28A881"
                        : "#E5EBEA",

                      borderRadius: "13px",

                      bgcolor: selected
                        ? "#F2FBF7"
                        : "#FFFFFF",

                      cursor: "pointer",

                      fontFamily: "inherit",

                      boxShadow: selected
                        ? "0 5px 18px rgba(7,135,106,0.08)"
                        : "0 3px 10px rgba(23,32,51,0.025)",

                      transition:
                        "all 0.2s ease",

                      "&:hover": {
                        transform:
                          "translateY(-2px)",

                        borderColor:
                          "#7ACDB7",

                        bgcolor:
                          "#F8FCFA",

                        boxShadow:
                          "0 8px 20px rgba(23,32,51,0.06)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: {
                          xs: 42,
                          sm: 46,
                        },
                        height: {
                          xs: 42,
                          sm: 46,
                        },

                        mb: 1,

                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "center",

                        borderRadius: "50%",

                        bgcolor: "#EAF8F4",

                        color: "#07876A",
                      }}
                    >
                      <Icon
                        sx={{
                          fontSize: {
                            xs: "23px",
                            sm: "25px",
                          },
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        width: "100%",

                        color: "#172033",

                        fontFamily:
                          "inherit",

                        fontSize: {
                          xs: "10.5px",
                          sm: "11.5px",
                        },

                        lineHeight: 1.25,

                        fontWeight: 700,

                        textAlign: "center",

                        overflow: "hidden",
                        textOverflow:
                          "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </Typography>

                    {item.count && (
                      <Typography
                        sx={{
                          mt: "3px",

                          color: "#758190",

                          fontFamily:
                            "inherit",

                          fontSize: {
                            xs: "8.5px",
                            sm: "9.5px",
                          },

                          lineHeight: 1.2,

                          textAlign:
                            "center",
                        }}
                      >
                        {item.count}
                      </Typography>
                    )}
                  </Box>
                );
              }
            )}
          </Box>

          {filteredSpecialities.length ===
            0 && (
            <Box
              sx={{
                py: 6,
                textAlign: "center",
              }}
            >
              <SearchRoundedIcon
                sx={{
                  mb: 1,
                  fontSize: 30,
                  color: "#A7B1AE",
                }}
              />

              <Typography
                sx={{
                  color: "#596575",
                  fontFamily: "inherit",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                No specialization found
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}