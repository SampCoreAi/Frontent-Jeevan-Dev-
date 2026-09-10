"use client";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Popover,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AssignmentIcon from "@mui/icons-material/Assignment";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { format, addMonths, subMonths } from "date-fns";

export default function DashboardPage() {
  const router = useRouter();
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [patientMonth, setPatientMonth] = useState(new Date());
  const [doctorMonth, setDoctorMonth] = useState(new Date());
  const [anchorElPatient, setAnchorElPatient] = useState(null);
  const [anchorElDoctor, setAnchorElDoctor] = useState(null);
  const [patientFilter, setPatientFilter] = useState("month");
  const [doctorFilter, setDoctorFilter] = useState("month");

  // Use theme colors with safe fallbacks
  const cardBg = theme.palette.background?.third || "#e4eceb";
  const textPrimary = theme.palette.text?.primary || "#000000";
  const textSecondary = theme.palette.text?.fourth || "#676f7e";
  const borderColor = theme.palette.border?.third || "#1e6658";
  const hoverColor = theme.palette.hover?.primary || "#439f8e";
  const borderLight = theme.palette.border?.light || "#e0e0e0";
  const backgroundPaper = theme.palette.background?.paper || "#ffffff";
  /* -------------------- DATA -------------------- */
  // Base data for different time periods
  const patientDataByPeriod = {
    week: [
      { day: "Mon", offline: 40, online: 25 },
      { day: "Tue", offline: 55, online: 35 },
      { day: "Wed", offline: 75, online: 40 },
      { day: "Thu", offline: 60, online: 45 },
      { day: "Fri", offline: 85, online: 50 },
      { day: "Sat", offline: 70, online: 30 },
      { day: "Sun", offline: 50, online: 35 },
    ],
    month: [
      { week: "Week 1", offline: 180, online: 120 },
      { week: "Week 2", offline: 220, online: 150 },
      { week: "Week 3", offline: 240, online: 180 },
      { week: "Week 4", offline: 200, online: 160 },
    ],
    year: [
      { month: "Jan", offline: 60, online: 30 },
      { month: "Feb", offline: 55, online: 45 },
      { month: "Mar", offline: 75, online: 40 },
      { month: "Apr", offline: 80, online: 20 },
      { month: "May", offline: 50, online: 85 },
      { month: "Jun", offline: 55, online: 30 },
      { month: "Jul", offline: 65, online: 35 },
      { month: "Aug", offline: 70, online: 40 },
      { month: "Sep", offline: 75, online: 45 },
      { month: "Oct", offline: 80, online: 50 },
      { month: "Nov", offline: 85, online: 55 },
      { month: "Dec", offline: 90, online: 60 },
    ],
  };

  const deptDataByPeriod = {
    week: [
      { name: "Cardiology", value: 25 },
      { name: "Neurology", value: 15 },
      { name: "Pediatrics", value: 20 },
      { name: "Orthopedics", value: 30 },
      { name: "Dermatology", value: 10 },
    ],
    month: [
      { name: "Cardiology", value: 45 },
      { name: "Neurology", value: 20 },
      { name: "Pediatrics", value: 15 },
      { name: "Orthopedics", value: 20 },
    ],
    year: [
      { name: "Cardiology", value: 35 },
      { name: "Neurology", value: 25 },
      { name: "Pediatrics", value: 20 },
      { name: "Orthopedics", value: 15 },
      { name: "Oncology", value: 5 },
    ],
  };

  const deptColors = {
    week: ["#0f766e", "#14b8a6", "#ef4444", "#facc15", "#8b5cf6"],
    month: ["#0f766e", "#14b8a6", "#ef4444", "#facc15"],
    year: ["#0f766e", "#14b8a6", "#ef4444", "#facc15", "#8b5cf6"],
  };

  // Memoized data based on selected filter
  const patientData = useMemo(() => {
    return patientDataByPeriod[patientFilter] || patientDataByPeriod.month;
  }, [patientFilter]);

  const deptData = useMemo(() => {
    return deptDataByPeriod[doctorFilter] || deptDataByPeriod.month;
  }, [doctorFilter]);

  const currentDeptColors = useMemo(() => {
    return deptColors[doctorFilter] || deptColors.month;
  }, [doctorFilter]);

  // X-axis key based on filter
  const xAxisKey = useMemo(() => {
    if (patientFilter === "week") return "day";
    if (patientFilter === "month") return "week";
    return "month";
  }, [patientFilter]);

  // Chart titles based on filter
  const patientChartTitle = useMemo(() => {
    const titles = {
      week: "Patient Visits Trend (This Week)",
      month: "Patient Visits Trend (This Month)",
      year: "Patient Visits Trend (This Year)",
    };
    return titles[patientFilter] || "Patient Visits Trend";
  }, [patientFilter]);

  const patientChartSubtitle = useMemo(() => {
    const subtitles = {
      week: "Daily offline vs online consultations",
      month: "Weekly offline vs online consultations",
      year: "Monthly offline vs online consultations",
    };
    return subtitles[patientFilter] || "Offline vs Online consultations";
  }, [patientFilter]);

  const deptChartTitle = useMemo(() => {
    const titles = {
      week: "Department Activity (This Week)",
      month: "Department Activity (This Month)",
      year: "Department Activity (This Year)",
    };
    return titles[doctorFilter] || "Department Activity";
  }, [doctorFilter]);

  const deptChartSubtitle = useMemo(() => {
    const subtitles = {
      week: "Active cases by department this week",
      month: "Active cases by department this month",
      year: "Active cases by department this year",
    };
    return subtitles[doctorFilter] || "Current active cases by department";
  }, [doctorFilter]);
  const doctorsData = [
    {
      id: "@DOC-8892",
      name: "Dr. Sarah Jenkins",
      dept: "Cardiology",
      city: "New York",
      date: "2024-03-15",
      status: "Pending Review",
      color: "warning",
      action: "Approve",
    },
    {
      id: "@DOC-8893",
      name: "Dr. Mike Ross",
      dept: "Neurology",
      city: "Chicago",
      date: "2024-03-10",
      status: "Active",
      color: "success",
      action: "",
    },
    {
      id: "@DOC-8894",
      name: "Dr. Emily Chen",
      dept: "Pediatrics",
      city: "Los Angeles",
      date: "2024-03-05",
      status: "Active",
      color: "success",
      action: "",
    },
    {
      id: "@DOC-8895",
      name: "Dr. James Hall",
      dept: "Orthopedics",
      city: "Houston",
      date: "2024-02-28",
      status: "On Leave",
      color: "info",
      action: "",
    },
    {
      id: "@DOC-8896",
      name: "Dr. Lisa Wang",
      dept: "Cardiology",
      city: "Boston",
      date: "2024-02-20",
      status: "Active",
      color: "success",
      action: "",
    },
  ];

  const patientsData = [
    {
      id: "@PAT-1001",
      name: "John Smith",
      age: 45,
      gender: "Male",
      city: "New York",
      department: "Cardiology",
      date: "2024-03-18",
      status: "Admitted",
      color: "warning",
      action: "View Details",
    },
    {
      id: "@PAT-1002",
      name: "Emma Wilson",
      age: 32,
      gender: "Female",
      city: "Chicago",
      date: "2024-03-16",
      status: "Discharged",
      color: "success",
      action: "View Details",
    },
    {
      id: "@PAT-1003",
      name: "Robert Brown",
      age: 58,
      gender: "Male",
      city: "Los Angeles",
      date: "2024-03-12",
      status: "In Treatment",
      color: "info",
      action: "View Details",
    },
    {
      id: "@PAT-1004",
      name: "Sophia Garcia",
      age: 28,
      gender: "Female",
      city: "Miami",
      date: "2024-03-08",
      status: "Scheduled",
      color: "secondary",
      action: "View Details",
    },
    {
      id: "@PAT-1005",
      name: "David Kim",
      age: 35,
      gender: "Male",
      city: "Seattle",
      date: "2024-03-05",
      status: "Discharged",
      color: "success",
      action: "View Details",
    },
  ];

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy");
  };
  // Handle patient filter change
  const handlePatientFilterChange = (value) => {
    setPatientFilter(value);
  };

  // Handle doctor filter change
  const handleDoctorFilterChange = (value) => {
    setDoctorFilter(value);
  };
  // Handle patient month calendar
  const handlePatientMonthClick = (event) => {
    setAnchorElPatient(event.currentTarget);
  };

  const handlePatientMonthClose = () => {
    setAnchorElPatient(null);
  };

  const handlePatientPrevMonth = () => {
    setPatientMonth(subMonths(patientMonth, 1));
  };

  const handlePatientNextMonth = () => {
    setPatientMonth(addMonths(patientMonth, 1));
  };

  // Handle doctor month calendar
  const handleDoctorMonthClick = (event) => {
    setAnchorElDoctor(event.currentTarget);
  };

  const handleDoctorMonthClose = () => {
    setAnchorElDoctor(null);
  };

  const handleDoctorPrevMonth = () => {
    setDoctorMonth(subMonths(doctorMonth, 1));
  };

  const handleDoctorNextMonth = () => {
    setDoctorMonth(addMonths(doctorMonth, 1));
  };

  const openPatientCalendar = Boolean(anchorElPatient);
  const openDoctorCalendar = Boolean(anchorElDoctor);

  /* -------------------- UI -------------------- */
  return (
    <Box
      sx={{
        mt: "50px",
        mx:"1",
        px: 2,
        pb: 3,
        pt: -12,
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
         boxShadow: `0 4px 12px ${borderColor}`,
        borderRadius: "2px",
      }}
    >
      <Box sx={{ width: "100%", py: 3 }}>
        {/* Top Row - 4 Cards Cover Full Width */}
        <Grid
          container
          spacing={2}
          alignItems="stretch"
          justifyContent="space-between"
        >
          {/* Card 1: Total Doctors */}
          <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
            <Card
              sx={{
                borderRadius: 1,
                // boxShadow: "0 2px 12px #1e6658",
                   border: "1px solid #0f7468",
                height: "100%",
                minHeight: 140,
                width: "100%",
                backgroundColor: "#e3eceb",
                
                  transition: "0.3s",
                 "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
              },
                display: "flex",
                alignItems: "center",
              }}
            >
              <CardContent
                sx={{ p: 2.5, flex: 1, display: "flex", alignItems: "center" }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2.5}
                  sx={{ width: "100%" }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "12px",
                      backgroundColor: "#e3eceb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PersonIcon sx={{ color: "black", fontSize: 50 }} />
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mb: 0.5,
                        fontWeight: 600,
                        fontSize: "0.90rem",
                        letterSpacing: "0.2px",
                        textTransform: "uppercase",
                        color:"black"
                      }}
                    >
                      Total Doctors
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      sx={{ color: "#1e293b", lineHeight: 1.2 }}
                    >
                      124
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 2: Total Patients */}
          <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
            <Card
              sx={{
                borderRadius: 1,
                // boxShadow: "0 2px 12px #1e6658",
                border: "1px solid #0f7468",
                height: "100%",
                minHeight: 140,
                width: "100%",
                backgroundColor: "#e3eceb",
                   transition: "0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
              },
                display: "flex",
                alignItems: "center",
              }}
            >
              <CardContent
                sx={{ p: 2.5, flex: 1, display: "flex", alignItems: "center" }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2.5}
                  sx={{ width: "100%" }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "12px",
                      backgroundColor: "",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PeopleIcon sx={{ color: "black", fontSize: 50 }} />
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mb: 0.5,
                        fontWeight: 600,
                        fontSize: "0.90rem",
                        letterSpacing: "0.1px",
                        textTransform: "uppercase",
                        color: "black"
                      }}
                    >
                      Total Patients
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      sx={{ color: "#1e293b", lineHeight: 1.2 }}
                    >
                      8,540
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 3: Today's Appointments */}
          <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
            <Card
              sx={{
                borderRadius: 1,
               
                   border: "1px solid #0f7468",
                height: "100%",
                minHeight: 140,
                width: "100%",
                backgroundColor: "#e3eceb",
                 transition: "0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
              },
                display: "flex",
                alignItems: "center",
              }}
            >
              <CardContent
                sx={{ p: 2.5, flex: 1, display: "flex", alignItems: "center" }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2.5}
                  sx={{ width: "100%" }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "12px",
                      
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CalendarMonthIcon
                      sx={{ color: "black", fontSize: 50 }}
                    />
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mb: 0.5,
                        fontWeight: 600,
                        fontSize: "0.90rem",
                        letterSpacing: "0.1px",
                        textTransform: "uppercase",
                        color: "black",
                      }}
                    >
                      Today's Appointments
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      sx={{ color: "#1e293b", lineHeight: 1.2 }}
                    >
                      342
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 4: Today's Revenue */}
          <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
            <Card
              sx={{
                borderRadius: 1,
                   border: "1px solid #0f7468",
                height: "100%",
                minHeight: 140,
                width: "100%",
                backgroundColor: "#e3eceb",
                 transition: "0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
              },
                display: "flex",
                alignItems: "center",
              }}
            >
              <CardContent
                sx={{ p: 2.5, flex: 1, display: "flex", alignItems: "center" }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2.5}
                  sx={{ width: "100%" }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "12px",
                      
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AttachMoneyIcon sx={{ color: "black", fontSize: 60 }} />
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mb: 0.5,
                        fontWeight: 600,
                        fontSize: "0.90rem",
                        letterSpacing: "0.1px",
                        textTransform: "uppercase",
                        color:"black",
                        value:"85"
                      }}
                    >
                      Today's Revenue
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      sx={{ color: "#1e293b", lineHeight: 1.2 }}
                    >
                      $24,580
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Bottom Row - 2 Cards Cover Full Width */}
        <Grid container spacing={2} mt={2} justifyContent="space-between">
          {/* Card 5: New Patient */}
          <Grid item xs={12} sm={6} sx={{ flex: 1 }}>
            <Card
              sx={{
                borderRadius: 1,
                  border: "1px solid #0f7468",
                
                height: "100%",
                minHeight: 140,
                width: "100%",
                backgroundColor: "#e3eceb",
                 transition: "0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
              },
                display: "flex",
                alignItems: "center",
              }}
            >
              <CardContent sx={{ p: 3, width: "100%" }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Stack direction="row" spacing={2.5} alignItems="center">
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "12px",
                        // backgroundColor: "rgba(239, 68, 68, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PersonAddIcon sx={{ color: "black", fontSize: 50 }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.90rem",
                          letterSpacing: "0.1px",
                          textTransform: "uppercase",
                          color: "black",
                        }}
                      >
                        New Patients
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{ color: "#1e293b", lineHeight: 1.2, mt: 0.5 }}
                      >
                        245
                      </Typography>
                    </Box>
                  </Stack>

                  {/* In New Patients Card */}
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel sx={{ color: "#475569" }}>Filter</InputLabel>
                    <Select
                      value={patientFilter}
                      label="Filter"
                      onChange={(e) => setPatientFilter(e.target.value)}
                      sx={{
                        width: 120,
                        backgroundColor: "#e3eceb",
                        borderRadius: 1,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(100, 116, 139, 0.3)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#94a3b8",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#0d9488",
                          borderWidth: 1,
                        },
                        "& .MuiSelect-select": {
                          color: "#1e293b",
                          minWidth: "100%",
                        },
                      }}
                      MenuProps={{
                        disableScrollLock: true,
                        PaperProps: {
                          sx: {
                            maxWidth: 120,
                            "& .MuiMenuItem-root": {
                              fontSize: "0.875rem",
                              minHeight: 32,
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="day">Day</MenuItem>
                      <MenuItem value="week">Week</MenuItem>
                      <MenuItem value="month">Month</MenuItem>
                      <MenuItem value="year">Year</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 6: New Doctor Register */}
          <Grid item xs={12} sm={6} sx={{ flex: 1 }}>
            <Card
              sx={{
                borderRadius: 1,
               
                   border: "1px solid #0f7468",
                height: "100%",
                minHeight: 140,
                width: "100%",
                backgroundColor: "#e3eceb",
                  transition: "0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
              },
                display: "flex",
                alignItems: "center",
              }}
            >
              <CardContent sx={{ p: 3, width: "100%" }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Stack direction="row" spacing={2.5} alignItems="center">
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "12px",
                       
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AssignmentIcon sx={{ color: "black", fontSize: 50 }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.90rem",
                          letterSpacing: "0.1px",
                          textTransform: "uppercase",
                          color:"black"
                        }}
                      >
                        New Doctors
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{ color: "#1e293b", lineHeight: 1.2, mt: 0.5 }}
                      >
                        18
                      </Typography>
                    </Box>
                  </Stack>

                  {/* In New Doctors Card */}
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel sx={{ color: "#475569" }}>Filter</InputLabel>
                    <Select
                      value={doctorFilter}
                      label="Filter"
                      onChange={(e) => setDoctorFilter(e.target.value)}
                      sx={{
                        width: 120,
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        borderRadius: 1,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(100, 116, 139, 0.3)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#94a3b8",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#0d9488",
                          borderWidth: 1,
                        },
                        "& .MuiSelect-select": {
                          color: "#1e293b",
                          minWidth: "100%",
                        },
                      }}
                      MenuProps={{
                        disableScrollLock: true,
                        PaperProps: {
                          sx: {
                            maxWidth: 120,
                            "& .MuiMenuItem-root": {
                              fontSize: "0.875rem",
                              minHeight: 32,
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="day">Day</MenuItem>
                      <MenuItem value="week">Week</MenuItem>
                      <MenuItem value="month">Month</MenuItem>
                      <MenuItem value="year">Year</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

{/* ================= MAIN CHARTS SECTION ================= */}

<Box
  sx={{
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    gap: 3, // Increased gap between charts
    mb: 2,
    minHeight: 56,
    alignItems: "center",
  }}
>
  {/* Patient Visits Trend */}
  <Box
    sx={{
     flex: 1,
      minWidth: 0,
      maxWidth: "48%", // Limit maximum width
    }}
  >
    <Card
      sx={{
        borderRadius: 2,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: `1px solid ${borderLight}`,
                height: 450,
                display: "flex",
                flexDirection: "column",
                width: "100%",
                backgroundColor: backgroundPaper,
      }}
    >
      <CardContent
         sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 2, // Reduced padding
          width: "100%",
          overflow: "visible",
        }}
          
        
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: 56,
            mb: 1,
            width: "100%",
            gap: 1,
            px: 0.5, // Add horizontal padding to create space from edges
          }}
        >
          {/* Title - Takes most of the space */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              pr: 1,
            }}
          >
             <Typography variant="h6" fontWeight={600} noWrap fontSize="1rem"  color={textPrimary}> {/* Smaller font */}
              {patientChartTitle}
            </Typography>
            <Typography
              variant="body2"
                color={textSecondary}
              noWrap
               fontSize="0.8rem" // Smaller font
            >
              {patientChartSubtitle}
            </Typography>
          </Box>

          {/* FIXED: Filter button with proper spacing */}
          <Box
            sx={{
              flexShrink: 0,
              width: "130px", // Increased width slightly
              ml: 1, // Add left margin
            }}
          >
            <FormControl size="small">
              <Select
                value={patientFilter}
                onChange={(e) => handlePatientFilterChange(e.target.value)}
                displayEmpty
                inputProps={{ "aria-label": "Filter" }}
                sx={{
                  backgroundColor: backgroundPaper,
                          borderRadius: "8px",
                          border: `1px solid ${borderLight}`,
                          height: "38px",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          width: "100%",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "&:hover": {
                            borderColor: hoverColor,
                            boxShadow: `0 1px 3px ${hoverColor}20`,
                          },
                          "&.Mui-focused": {
                            borderColor: borderColor,
                            borderWidth: "1px",
                            boxShadow: `0 0 0 3px ${borderColor}20`,
                          },
                          "& .MuiSelect-select": {
                            padding: "8px 32px 8px 12px",
                            minHeight: "auto",
                            color: textPrimary,
                          },
                          "& .MuiSvgIcon-root": {
                            color: textSecondary,
                            right: "8px",
                          },
                }}
                MenuProps={{
                    disableScrollLock: true,
                          PaperProps: {
                            sx: {
                              borderRadius: "8px",
                              marginTop: "4px",
                              marginRight: "4px",
                              border: `1px solid ${borderLight}`,
                              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                              backgroundColor: backgroundPaper,
                              "& .MuiMenuItem-root": {
                                fontSize: "0.875rem",
                                minHeight: "36px",
                                padding: "8px 16px",
                                color: textPrimary,
                                "&:hover": {
                                  backgroundColor: `${cardBg}`,
                                },
                                "&.Mui-selected": {
                                  backgroundColor: `${cardBg}80`,
                                  color: borderColor,
                                  fontWeight: 500,
                                  "&:hover": {
                                    backgroundColor: cardBg,
                                  },
                                },
                              },
                            },
                          },
                }}
              >
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="year">Year</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

     <Box
  sx={{
    flex: 1,
    minHeight: 300,
    width: "100%",
    mt: 0.5,
    
  }}
>
  <ResponsiveContainer width="100%" height="100%">
    <LineChart
      data={patientData}
      margin={{ 
        top: 5, 
        right: 5,  // Set to 0 - no right margin
        left: 0,   // Set to 0 - no left margin
        bottom: 5 
      }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke={cardBg} />
      <XAxis
        dataKey={xAxisKey}
        axisLine={false}
        tickLine={false}
        tick={{ fill: textSecondary, fontSize: 10 }} // Reduced font size
        angle={0}
        textAnchor="middle"
        interval={0}
        height={40}
        // Remove padding or make it minimal
        padding={{ left: 5, right: 5 }}
        // Add domain to control which data points are shown
        domain={['dataMin', 'dataMax']}
      />
      <YAxis
        axisLine={false}
        tickLine={false}
        tick={{ fill: textSecondary, fontSize: 11 }} // Reduced font size
        width={35} // Reduced width
      />
      <Tooltip
        contentStyle={{
          borderRadius: 8,
                          border: `1px solid ${borderLight}`,
                          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                          backgroundColor: backgroundPaper,
        }}
        formatter={(value) => [`${value} patients`, ""]}
        labelFormatter={(label) => `${xAxisKey}: ${label}`}
      />
      <Legend
        verticalAlign="top"
        height={30} // Reduced height
        iconType="circle"
        iconSize={8} // Reduced icon size
        wrapperStyle={{ 
          paddingBottom: 5, // Reduced
          paddingLeft: 0,   // Removed
          paddingRight: 0,  // Removed
          marginBottom: 5,  // Added
        }}
      />
      <Line
        name="Offline Patients"
        type="monotone"
        dataKey="offline"
        stroke="#ef4444"
        strokeWidth={1.5} // Further reduced
        dot={{ r: 2 }}    // Further reduced
        activeDot={{ r: 4, strokeWidth: 1 }}
      />
      <Line
        name="Online Patients"
        type="monotone"
        dataKey="online"
        stroke="#14b8a6"
        strokeWidth={1.5} // Further reduced
        dot={{ r: 2 }}    // Further reduced
        activeDot={{ r: 4, strokeWidth: 1 }}
      />
    </LineChart>
  </ResponsiveContainer>
</Box>
      </CardContent>
    </Card>
  </Box>

  {/* Department Activity */}
  <Box
    sx={{
      flex: 1,
      minWidth: 0,
    }}
  >
    <Card
      sx={{
         borderRadius: 2,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: `1px solid ${borderLight}`,
                height: 450,
                display: "flex",
                flexDirection: "column",
                width: "100%",
                backgroundColor: backgroundPaper,
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 3,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            width: "100%",
            gap: 1,
            px: 0.5, // Add horizontal padding
          }}
        >
          {/* Title - Takes most of the space */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              pr: 2,
            }}
          >
            <Typography
                      variant="h6"
                      fontWeight={600}
                      noWrap
                      color={textPrimary}
                    >
                      {deptChartTitle}
                    </Typography>
                    <Typography
                      variant="body2"
                      noWrap
                      color={textSecondary}
                    >
                      {deptChartSubtitle}
                    </Typography>
                  </Box>
          {/* FIXED: Filter button with proper spacing */}
          <Box
            sx={{
              flexShrink: 0,
              width: "130px", // Increased width
              ml: 1, // Add left margin
            }}
          >
            <FormControl size="small">
              <Select
                value={doctorFilter}
                onChange={(e) => handleDoctorFilterChange(e.target.value)}
                displayEmpty
                inputProps={{ "aria-label": "Filter" }}
                sx={{
                  backgroundColor: backgroundPaper,
                          borderRadius: "8px",
                          border: `1px solid ${borderLight}`,
                          height: "38px",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          width: "100%",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "&:hover": {
                            borderColor: hoverColor,
                            boxShadow: `0 1px 3px ${hoverColor}20`,
                          },
                          "&.Mui-focused": {
                            borderColor: borderColor,
                            borderWidth: "1px",
                            boxShadow: `0 0 0 3px ${borderColor}20`,
                          },
                          "& .MuiSelect-select": {
                            padding: "8px 32px 8px 12px",
                            minHeight: "auto",
                            color: textPrimary,
                          },
                          "& .MuiSvgIcon-root": {
                            color: textSecondary,
                            right: "8px",
                          },
                }}
                MenuProps={{
                  disableScrollLock: true,
                          PaperProps: {
                            sx: {
                              borderRadius: "8px",
                              marginTop: "4px",
                              marginRight: "4px",
                              border: `1px solid ${borderLight}`,
                              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                              backgroundColor: backgroundPaper,
                              "& .MuiMenuItem-root": {
                                fontSize: "0.875rem",
                                minHeight: "36px",
                                padding: "8px 16px",
                                color: textPrimary,
                                "&:hover": {
                                  backgroundColor: `${cardBg}`,
                                },
                                "&.Mui-selected": {
                                  backgroundColor: `${cardBg}80`,
                                  color: borderColor,
                                  fontWeight: 500,
                                  "&:hover": {
                                    backgroundColor: cardBg,
                                  },
                                },
                              },
                            },
                          },
                }}
              >
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="year">Year</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            mt: 1,
            px: 0.5, // Add horizontal padding
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deptData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {deptData.map((_, i) => (
                  <Cell
                    key={i}
                            fill={currentDeptColors[i]}
                            strokeWidth={2}
                            stroke={backgroundPaper}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, "Share"]}
                contentStyle={{
                   borderRadius: 8,
                          border: `1px solid ${borderLight}`,
                          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                          backgroundColor: backgroundPaper,
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={10}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  </Box>
</Box>

<Box sx={{ width: "100%" }}>
  <Grid container spacing={3} mt={2}>
    {/* Recent Doctor Registrations */}
    <Grid size={{ xs: 12, sm: 6 }}>
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: `1px solid ${borderLight}`,
          height: 450,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          backgroundColor: backgroundPaper,
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            p: 3,
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h6" fontWeight={600} color={textPrimary}>
              Recent Doctor Registrations
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                console.log("Navigating to /admin/pages/doctor/page");
                router.push("/admin/pages/doctor");
              }}
              sx={{
                borderRadius: 1,
                textTransform: "none",
                backgroundColor: borderColor,
                "&:hover": {
                  backgroundColor: hoverColor,
                },
                px: 2,
              }}
            >
              View All
            </Button>
          </Stack>

          <TableContainer
            sx={{
              flex: 1,
              overflow: "auto",
              width: "100%",
              mt: 1,
            }}
          >
            <Table
              sx={{
                minWidth: 300,
                width: "100%",
                
              }}
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: cardBg }}>
                  <TableCell sx={{ width: "30%" }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color={textPrimary}
                    >
                      DOCTOR NAME
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "25%" }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color={textPrimary}
                    >
                      DEPARTMENT
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "20%" }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color={textPrimary}
                    >
                      CITY
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "25%" }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color={textPrimary}
                    >
                      DATE
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doctorsData.map((doc, i) => (
                  <TableRow
                    key={i}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { backgroundColor: cardBg },
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography
                          fontWeight={600}
                          color={textPrimary}
                          fontSize="0.875rem"
                        >
                          {doc.name}
                        </Typography>
                        <Typography variant="caption" color={textSecondary}>
                          {doc.id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={textPrimary}
                        fontSize="0.875rem"
                      >
                        {doc.dept}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={textPrimary}
                        fontSize="0.875rem"
                      >
                        {doc.city}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={textPrimary}
                        fontSize="0.875rem"
                      >
                        {formatDate(doc.date)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Grid>

    {/* Recent Patient Registrations - Right Side */}
 <Grid size={{ xs: 12, sm: 6 }}>
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: `1px solid ${borderLight}`,
          height: 450,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          backgroundColor: backgroundPaper,
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            p: 3,
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h6" fontWeight={600} color={textPrimary}>
              Recent Patient Registrations
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                console.log("Navigating to /admin/pages/patient");
                router.push("/admin/pages/patient");
              }}
              sx={{
                borderRadius: 1,
                textTransform: "none",
                backgroundColor: borderColor,
                "&:hover": {
                  backgroundColor: hoverColor,
                },
                px: 2,
              }}
            >
              View All
            </Button>
          </Stack>

          <TableContainer
            sx={{
              flex: 1,
              overflow: "auto",
              width: "100%",
              mt: 1,
            }}
          >
            <Table
              sx={{
                minWidth: 300,
                width: "100%",
                
              }}
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: cardBg }}>
                  <TableCell sx={{ width: "30%" }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color={textPrimary}
                    >
                      PATIENT NAME
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "25%" }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color={textPrimary}
                    >
                      DETAILS
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "20%" }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color={textPrimary}
                    >
                      CITY
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "25%" }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color={textPrimary}
                    >
                      DATE
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patientsData.map((patient, i) => (
                  <TableRow
                    key={i}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { backgroundColor: cardBg },
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography
                          fontWeight={600}
                          color={textPrimary}
                          fontSize="0.875rem"
                        >
                          {patient.name}
                        </Typography>
                        <Typography variant="caption" color={textSecondary}>
                          {patient.id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={textPrimary}
                        fontSize="0.875rem"
                      >
                        {patient.age} yrs, {patient.gender}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={textPrimary}
                        fontSize="0.875rem"
                      >
                        {patient.city}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={textPrimary}
                        fontSize="0.875rem"
                      >
                        {formatDate(patient.date)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
</Box>

      {/* Month Picker Popovers */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {/* Patient Month Picker Popover */}
        <Popover
          open={openPatientCalendar}
          anchorEl={anchorElPatient}
          onClose={handlePatientMonthClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: 1.5,
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Box sx={{ p: 1.5, bgcolor: "background.paper" }}>
            <DatePicker
              value={patientMonth}
              onChange={(newDate) => {
                setPatientMonth(newDate);
              }}
              openTo="month"
              views={["year", "month"]}
              sx={{
                "& .MuiInputBase-root": {
                  width: "240px",
                  fontSize: "0.875rem",
                },
                "& .MuiPickersCalendarHeader-root": {
                  backgroundColor: "#14b8a6",
                  color: "white",
                },
                "& .MuiPickersMonth-root": {
                  fontSize: "0.875rem",
                  "&.Mui-selected": {
                    backgroundColor: "#14b8a6",
                    color: "white",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(20, 184, 166, 0.1)",
                  },
                },
              }}
            />
          </Box>
        </Popover>

        {/* Doctor Month Picker Popover */}
        <Popover
          open={openDoctorCalendar}
          anchorEl={anchorElDoctor}
          onClose={handleDoctorMonthClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: 1.5,
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Box sx={{ p: 1.5, bgcolor: "background.paper" }}>
            <DatePicker
              value={doctorMonth}
              onChange={(newDate) => {
                setDoctorMonth(newDate);
              }}
              openTo="month"
              views={["year", "month"]}
              sx={{
                "& .MuiInputBase-root": {
                  width: "240px",
                  fontSize: "0.875rem",
                },
                "& .MuiPickersCalendarHeader-root": {
                  backgroundColor: "#d97706",
                  color: "white",
                },
                "& .MuiPickersMonth-root": {
                  fontSize: "0.875rem",
                  "&.Mui-selected": {
                    backgroundColor: "#d97706",
                    color: "white",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(217, 119, 6, 0.1)",
                  },
                },
              }}
            />
          </Box>
        </Popover>
      </LocalizationProvider>
    </Box>
  );
}