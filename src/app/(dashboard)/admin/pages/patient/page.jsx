"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SearchIcon from "@mui/icons-material/Search";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PRIMARY = "#0f7468";
const PRIMARY_LIGHT = "#EAF6F4";

/* ==========================================
   PATIENTS PAGE
========================================== */

export default function PatientsPage() {
  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("sm")
  );

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedPatient, setSelectedPatient] =
    useState(null);

  const [openDialog, setOpenDialog] =
    useState(false);

  /* ==========================================
     FETCH PATIENTS
  ========================================== */

  const fetchPatients = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/api/user/getAllUsers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res?.data?.success) {
        setPatients(
          Array.isArray(res.data.data)
            ? res.data.data
            : []
        );
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error(
        "Error fetching patients:",
        error
      );

      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  /* ==========================================
     FILTER PATIENTS
  ========================================== */

  const filteredPatients = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) => {
      const values = [
        patient?.full_name,
        patient?.email,
        patient?.username,
        patient?.phone_number,
      ];

      return values.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [patients, search]);

  /* ==========================================
     STATS
  ========================================== */

  const stats = useMemo(() => {
    const now = new Date();

    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    let today = 0;
    let week = 0;
    let month = 0;

    patients.forEach((patient) => {
      if (!patient?.created_at) return;

      const createdAt = new Date(
        patient.created_at
      );

      if (Number.isNaN(createdAt.getTime())) {
        return;
      }

      if (createdAt >= todayStart) {
        today += 1;
      }

      if (createdAt >= weekStart) {
        week += 1;
      }

      if (createdAt >= monthStart) {
        month += 1;
      }
    });

    return {
      total: patients.length,
      month,
      week,
      today,
    };
  }, [patients]);

  /* ==========================================
     DIALOG
  ========================================== */

  const handleOpenDialog = (patient) => {
    setSelectedPatient(patient);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);

    setTimeout(() => {
      setSelectedPatient(null);
    }, 150);
  };

  /* ==========================================
     HELPERS
  ========================================== */

  const displayValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    return value;
  };

  const getInitial = (name) => {
    return (
      name?.trim()?.charAt(0)?.toUpperCase() ||
      "P"
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* ==========================================
     STATS DATA
  ========================================== */

  const statCards = [
    {
      title: "Total Patients",
      value: stats.total,
      icon: <PeopleAltOutlinedIcon />,
    },
    {
      title: "This Month",
      value: stats.month,
      icon: <CalendarMonthOutlinedIcon />,
    },
    {
      title: "This Week",
      value: stats.week,
      icon: <DateRangeOutlinedIcon />,
    },
    {
      title: "Today",
      value: stats.today,
      icon: <TodayOutlinedIcon />,
    },
  ];

  return (
    <Box
      sx={{
        px: {
          xs: 1.5,
          sm: 2,
          md: 2.5,
        },

        pb: 3,

        pt: {
          xs: 9,
          md: 10,
        },

        minHeight: "100vh",
        bgcolor: "#fff",

        overflowX: "hidden",
      }}
    >
      {/* =====================================
          HEADER
      ====================================== */}

      <Box sx={{ mb: 2 }}>
        <Typography
          sx={{
            fontSize: {
              xs: "17px",
              sm: "19px",
            },

            fontWeight: 700,
            color: "#172033",
          }}
        >
          Patients
        </Typography>

        <Typography
          sx={{
            mt: 0.25,
            fontSize: "12px",
            color: "text.secondary",
          }}
        >
          View and manage registered patients.
        </Typography>
      </Box>

      {/* =====================================
          STATS
      ====================================== */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },

          gap: {
            xs: 1,
            sm: 1.5,
          },

          mb: 2,
        }}
      >
        {statCards.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </Box>

      {/* =====================================
          MAIN TABLE CARD
      ====================================== */}

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",

          borderRadius: 2.5,

          overflow: "hidden",

          bgcolor: "#fff",
        }}
      >
        {/* SEARCH */}

        <Box
          sx={{
            p: {
              xs: 1.25,
              sm: 1.5,
            },

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            gap: 1,

            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <TextField
            size="small"
            placeholder="Search patient..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      fontSize: 18,
                      color: "text.secondary",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              width: {
                xs: "100%",
                sm: 340,
              },

              "& .MuiOutlinedInput-root": {
                height: 38,
                borderRadius: 1.5,
                fontSize: "12px",

                bgcolor: "#fff",
              },
            }}
          />

          {!isMobile && (
            <Typography
              sx={{
                fontSize: "11px",
                color: "text.secondary",
                whiteSpace: "nowrap",
              }}
            >
              {filteredPatients.length} patients
            </Typography>
          )}
        </Box>

        {/* =====================================
            TABLE
        ====================================== */}

        <TableContainer
          sx={{
            width: "100%",
            overflowX: "auto",

            maxHeight: "calc(100vh - 330px)",

            "&::-webkit-scrollbar": {
              height: 5,
              width: 5,
            },

            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#D5DADD",
              borderRadius: 10,
            },
          }}
        >
          <Table
            stickyHeader
            size="small"
            sx={{
              minWidth: 900,

              "& .MuiTableCell-root": {
                borderColor: "#EDF0F2",
              },
            }}
          >
            {/* HEADER */}

            <TableHead>
              <TableRow>
                {[
                  "PATIENT",
                  "USERNAME",
                  "EMAIL",
                  "PHONE",
                  "AGE",
                  "GENDER",
                  "BLOOD GROUP",
                  "ACTION",
                ].map((heading) => (
                  <TableCell
                    key={heading}
                    align={
                      heading === "ACTION"
                        ? "center"
                        : "left"
                    }
                    sx={{
                      py: 1.2,

                      bgcolor: "#F8FAF9",

                      color: "#667085",

                      fontSize:
                        "10.5px !important",

                      fontWeight: 700,

                      whiteSpace: "nowrap",

                      letterSpacing: "0.3px",
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* BODY */}

            <TableBody>
              {/* LOADING */}

              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{
                      height: 250,
                    }}
                  >
                    <CircularProgress
                      size={25}
                      sx={{
                        color: PRIMARY,
                      }}
                    />

                    <Typography
                      sx={{
                        mt: 1,
                        fontSize: "11px",
                        color: "text.secondary",
                      }}
                    >
                      Loading patients...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {/* EMPTY */}

              {!loading &&
                filteredPatients.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      align="center"
                      sx={{
                        height: 230,
                      }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,

                          mx: "auto",
                          mb: 1,

                          borderRadius: "50%",

                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",

                          bgcolor: PRIMARY_LIGHT,
                          color: PRIMARY,
                        }}
                      >
                        <PeopleAltOutlinedIcon />
                      </Box>

                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#172033",
                        }}
                      >
                        No patients found
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.25,
                          fontSize: "11px",
                          color: "text.secondary",
                        }}
                      >
                        {search
                          ? "Try a different search."
                          : "Registered patients will appear here."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

              {/* DATA */}

              {!loading &&
                filteredPatients.map(
                  (patient) => (
                    <TableRow
                      key={patient.user_id}
                      hover
                      sx={{
                        "&:last-child td": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      {/* PATIENT */}

                      <TableCell
                        sx={{
                          py: 1.15,
                          minWidth: 190,
                        }}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.1}
                        >
                          <Avatar
                            src={
                              patient?.profile_image ||
                              patient?.profileImage ||
                              undefined
                            }
                            sx={{
                              width: 34,
                              height: 34,

                              bgcolor: PRIMARY,

                              fontSize: "13px",
                              fontWeight: 600,
                            }}
                          >
                            {getInitial(
                              patient.full_name
                            )}
                          </Avatar>

                          <Box
                            sx={{
                              minWidth: 0,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "12px",
                                fontWeight: 600,

                                color: "#172033",

                                maxWidth: 150,

                                overflow: "hidden",
                                textOverflow:
                                  "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {displayValue(
                                patient.full_name
                              )}
                            </Typography>

                            <Typography
                              sx={{
                                mt: 0.1,
                                fontSize: "10px",
                                color:
                                  "text.secondary",
                              }}
                            >
                              ID:{" "}
                              {displayValue(
                                patient.user_id
                              )}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* USERNAME */}

                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: "11.5px",
                            color: "#344054",
                          }}
                        >
                          {displayValue(
                            patient.username
                          )}
                        </Typography>
                      </TableCell>

                      {/* EMAIL */}

                      <TableCell>
                        <Tooltip
                          title={
                            patient.email || ""
                          }
                          arrow
                        >
                          <Typography
                            sx={{
                              maxWidth: 190,

                              fontSize: "11.5px",
                              color: "#344054",

                              overflow: "hidden",
                              textOverflow:
                                "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {displayValue(
                              patient.email
                            )}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      {/* PHONE */}

                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: "11.5px",
                            color: "#344054",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {displayValue(
                            patient.phone_number
                          )}
                        </Typography>
                      </TableCell>

                      {/* AGE */}

                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: "11.5px",
                            color: "#344054",
                          }}
                        >
                          {displayValue(
                            patient.age
                          )}
                        </Typography>
                      </TableCell>

                      {/* GENDER */}

                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: "11.5px",
                            color: "#344054",
                            textTransform:
                              "capitalize",
                          }}
                        >
                          {patient.gender
                            ? patient.gender
                                .toLowerCase()
                            : "-"}
                        </Typography>
                      </TableCell>

                      {/* BLOOD */}

                      <TableCell>
                        {patient.blood_group ? (
                          <Chip
                            label={
                              patient.blood_group
                            }
                            size="small"
                            sx={{
                              height: 23,

                              bgcolor: "#FFF1F1",
                              color: "#C62828",

                              borderRadius: 1.2,

                              "& .MuiChip-label": {
                                px: 1,
                                fontSize: "10px",
                                fontWeight: 600,
                              },
                            }}
                          />
                        ) : (
                          <Typography
                            sx={{
                              fontSize: "11px",
                              color:
                                "text.secondary",
                            }}
                          >
                            -
                          </Typography>
                        )}
                      </TableCell>

                      {/* ACTION */}

                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={
                            <VisibilityOutlinedIcon
                              sx={{
                                fontSize:
                                  "16px !important",
                              }}
                            />
                          }
                          onClick={() =>
                            handleOpenDialog(
                              patient
                            )
                          }
                          sx={{
                            minWidth: 80,
                            height: 30,

                            px: 1,

                            fontSize: "10.5px",

                            textTransform: "none",

                            borderRadius: 1.5,

                            borderColor: "#CFE3DF",
                            color: PRIMARY,

                            "&:hover": {
                              borderColor:
                                PRIMARY,

                              bgcolor:
                                PRIMARY_LIGHT,
                            },
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* FOOTER */}

        {!loading &&
          filteredPatients.length > 0 && (
            <Box
              sx={{
                px: 1.5,
                py: 1.1,

                borderTop: "1px solid",
                borderColor: "divider",

                bgcolor: "#fff",
              }}
            >
              <Typography
                sx={{
                  fontSize: "10.5px",
                  color: "text.secondary",
                }}
              >
                Showing{" "}
                <Box
                  component="span"
                  sx={{
                    fontWeight: 600,
                    color: "#344054",
                  }}
                >
                  {filteredPatients.length}
                </Box>{" "}
                of{" "}
                <Box
                  component="span"
                  sx={{
                    fontWeight: 600,
                    color: "#344054",
                  }}
                >
                  {patients.length}
                </Box>{" "}
                patients
              </Typography>
            </Box>
          )}
      </Paper>

      {/* =====================================
          PATIENT DETAIL DIALOG
      ====================================== */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            width: {
              xs: "calc(100% - 24px)",
              sm: "100%",
            },

            maxHeight: {
              xs: "88vh",
              sm: "85vh",
            },

            m: {
              xs: 1.5,
              sm: 3,
            },

            borderRadius: {
              xs: 2.5,
              sm: 3,
            },

            overflow: "hidden",

            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* DIALOG HEADER */}

        <DialogTitle
          sx={{
            px: {
              xs: 1.75,
              sm: 2.25,
            },

            py: 1.5,

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            flexShrink: 0,

            borderBottom: "1px solid",
            borderColor: "divider",

            bgcolor: "#fff",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#172033",
              }}
            >
              Patient Details
            </Typography>

            <Typography
              sx={{
                mt: 0.15,
                fontSize: "10.5px",
                color: "text.secondary",
              }}
            >
              View patient profile information
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={handleCloseDialog}
            sx={{
              width: 30,
              height: 30,

              bgcolor: "#F5F7F8",

              "&:hover": {
                bgcolor: "#ECEFF1",
              },
            }}
          >
            <CloseIcon
              sx={{
                fontSize: 18,
              }}
            />
          </IconButton>
        </DialogTitle>

        {/* ===================================
            SCROLLABLE CONTENT
        ==================================== */}

        <DialogContent
          sx={{
            flex: 1,
            minHeight: 0,

            overflowY: "auto",
            overflowX: "hidden",

            px: {
              xs: 1.5,
              sm: 2.25,
            },

            py: "18px !important",

            WebkitOverflowScrolling: "touch",

            "&::-webkit-scrollbar": {
              width: 5,
            },

            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#CDD3D6",
              borderRadius: 10,
            },
          }}
        >
          {selectedPatient && (
            <>
              {/* PROFILE */}

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                alignItems={{
                  xs: "center",
                  sm: "center",
                }}
                spacing={1.5}
                sx={{
                  p: 1.5,

                  border: "1px solid",
                  borderColor: "divider",

                  borderRadius: 2,

                  bgcolor: "#FAFCFB",
                }}
              >
                <Avatar
                  src={
                    selectedPatient
                      ?.profile_image ||
                    selectedPatient
                      ?.profileImage ||
                    undefined
                  }
                  sx={{
                    width: {
                      xs: 70,
                      sm: 76,
                    },

                    height: {
                      xs: 70,
                      sm: 76,
                    },

                    bgcolor: PRIMARY,

                    fontSize: "25px",
                    fontWeight: 600,
                  }}
                >
                  {getInitial(
                    selectedPatient.full_name
                  )}
                </Avatar>

                <Box
                  sx={{
                    minWidth: 0,

                    textAlign: {
                      xs: "center",
                      sm: "left",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#172033",
                    }}
                  >
                    {displayValue(
                      selectedPatient.full_name
                    )}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.2,
                      fontSize: "11px",
                      color: "text.secondary",
                    }}
                  >
                    {displayValue(
                      selectedPatient.email
                    )}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={0.7}
                    justifyContent={{
                      xs: "center",
                      sm: "flex-start",
                    }}
                    sx={{
                      mt: 0.8,
                    }}
                  >
                    {selectedPatient.gender && (
                      <Chip
                        size="small"
                        label={
                          selectedPatient.gender
                        }
                        sx={{
                          height: 22,

                          bgcolor:
                            PRIMARY_LIGHT,

                          color: PRIMARY,

                          "& .MuiChip-label": {
                            px: 1,
                            fontSize: "9.5px",
                            fontWeight: 600,
                          },
                        }}
                      />
                    )}

                    {selectedPatient
                      .blood_group && (
                      <Chip
                        size="small"
                        label={
                          selectedPatient
                            .blood_group
                        }
                        sx={{
                          height: 22,

                          bgcolor: "#FFF1F1",
                          color: "#C62828",

                          "& .MuiChip-label": {
                            px: 1,
                            fontSize: "9.5px",
                            fontWeight: 600,
                          },
                        }}
                      />
                    )}
                  </Stack>
                </Box>
              </Stack>

              {/* PERSONAL INFORMATION */}

              <SectionTitle title="Personal Information" />

              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                  },

                  gap: 1,
                }}
              >
                <DetailItem
                  icon={<PersonOutlineIcon />}
                  label="Username"
                  value={
                    selectedPatient.username
                  }
                />

                <DetailItem
                  label="User ID"
                  value={
                    selectedPatient.user_id
                  }
                />

                <DetailItem
                  label="Age"
                  value={selectedPatient.age}
                />

                <DetailItem
                  label="Date of Birth"
                  value={formatDate(
                    selectedPatient.dob
                  )}
                />
              </Box>

              {/* CONTACT */}

              <SectionTitle title="Contact Information" />

              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                  },

                  gap: 1,
                }}
              >
                <DetailItem
                  icon={<EmailOutlinedIcon />}
                  label="Email"
                  value={
                    selectedPatient.email
                  }
                />

                <DetailItem
                  icon={<PhoneOutlinedIcon />}
                  label="Phone Number"
                  value={
                    selectedPatient
                      .phone_number
                  }
                />
              </Box>

              {/* ADDRESS */}

              <SectionTitle title="Address" />

              <DetailItem
                icon={
                  <LocationOnOutlinedIcon />
                }
                label="Patient Address"
                value={
                  selectedPatient.address
                }
              />

              {/* ACCOUNT */}

              <SectionTitle title="Account Information" />

              <DetailItem
                label="Registered On"
                value={formatDate(
                  selectedPatient.created_at
                )}
              />
            </>
          )}
        </DialogContent>

        {/* ===================================
            FOOTER
        ==================================== */}

        <DialogActions
          sx={{
            px: {
              xs: 1.5,
              sm: 2.25,
            },

            py: 1.25,

            flexShrink: 0,

            borderTop: "1px solid",
            borderColor: "divider",

            bgcolor: "#FAFBFB",
          }}
        >
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            sx={{
              minWidth: 85,
              height: 33,

              bgcolor: PRIMARY,

              fontSize: "11px",

              textTransform: "none",

              borderRadius: 1.5,

              boxShadow: "none",

              "&:hover": {
                bgcolor: "#0B6259",
                boxShadow: "none",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/* ==========================================
   STAT CARD
========================================== */

function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 1.25,
          sm: 1.5,
        },

        minWidth: 0,

        border: "1px solid",
        borderColor: "divider",

        borderRadius: 2,

        bgcolor: "#fff",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        gap: 1,
      }}
    >
      <Box
        sx={{
          minWidth: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "10px",
              sm: "11px",
            },

            color: "text.secondary",

            whiteSpace: "nowrap",

            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.35,

            fontSize: {
              xs: "18px",
              sm: "21px",
            },

            fontWeight: 700,

            color: "#172033",
          }}
        >
          {value}
        </Typography>
      </Box>

      <Box
        sx={{
          width: {
            xs: 34,
            sm: 40,
          },

          height: {
            xs: 34,
            sm: 40,
          },

          flexShrink: 0,

          borderRadius: 1.7,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          bgcolor: PRIMARY_LIGHT,
          color: PRIMARY,

          "& svg": {
            fontSize: {
              xs: 18,
              sm: 21,
            },
          },
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
}

/* ==========================================
   SECTION TITLE
========================================== */

function SectionTitle({ title }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,

        mt: 2,
        mb: 1,
      }}
    >
      <Typography
        sx={{
          fontSize: "11px",
          fontWeight: 700,

          color: "#667085",

          textTransform: "uppercase",

          letterSpacing: "0.4px",

          whiteSpace: "nowrap",
        }}
      >
        {title}
      </Typography>

      <Divider
        sx={{
          flex: 1,
        }}
      />
    </Box>
  );
}

/* ==========================================
   DETAIL ITEM
========================================== */

function DetailItem({
  label,
  value,
  icon,
}) {
  const hasValue =
    value !== null &&
    value !== undefined &&
    value !== "";

  return (
    <Box
      sx={{
        p: 1.25,

        minWidth: 0,

        border: "1px solid",
        borderColor: "#E8ECEE",

        borderRadius: 1.5,

        bgcolor: "#fff",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
      >
        {icon && (
          <Box
            sx={{
              display: "flex",
              color: "#98A2B3",

              "& svg": {
                fontSize: 14,
              },
            }}
          >
            {icon}
          </Box>
        )}

        <Typography
          sx={{
            fontSize: "9.5px",

            color: "#98A2B3",

            fontWeight: 600,

            textTransform: "uppercase",

            letterSpacing: "0.25px",
          }}
        >
          {label}
        </Typography>
      </Stack>

      <Typography
        sx={{
          mt: 0.45,

          fontSize: "11.5px",

          fontWeight: 500,

          color: hasValue
            ? "#344054"
            : "#98A2B3",

          wordBreak: "break-word",
        }}
      >
        {hasValue ? value : "-"}
      </Typography>
    </Box>
  );
}