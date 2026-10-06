"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";

// ======================================================
// SAMPLE DATA
// ======================================================

const doctors = [
  {
    name: "Dr. Sarah Jenkins",
    id: "@DOC-8892",
    department: "Cardiology",
    city: "New York",
    date: "Mar 15, 2024",
  },
  {
    name: "Dr. Mike Ross",
    id: "@DOC-8893",
    department: "Neurology",
    city: "Chicago",
    date: "Mar 10, 2024",
  },
  {
    name: "Dr. Emily Chen",
    id: "@DOC-8894",
    department: "Pediatrics",
    city: "Los Angeles",
    date: "Mar 05, 2024",
  },
  {
    name: "Dr. James Hall",
    id: "@DOC-8895",
    department: "Orthopedics",
    city: "Houston",
    date: "Feb 28, 2024",
  },
];

const patients = [
  {
    name: "John Smith",
    id: "@PAT-1001",
    age: "45 yrs",
    gender: "Male",
    city: "New York",
    date: "Mar 18, 2024",
  },
  {
    name: "Emma Wilson",
    id: "@PAT-1002",
    age: "32 yrs",
    gender: "Female",
    city: "Chicago",
    date: "Mar 16, 2024",
  },
  {
    name: "Robert Brown",
    id: "@PAT-1003",
    age: "58 yrs",
    gender: "Male",
    city: "Los Angeles",
    date: "Mar 12, 2024",
  },
  {
    name: "Sophia Garcia",
    id: "@PAT-1004",
    age: "28 yrs",
    gender: "Female",
    city: "Miami",
    date: "Mar 08, 2024",
  },
];

const labs = [
  {
    name: "HealthCare Diagnostics",
    id: "@LAB-2001",
    category: "Pathology",
    city: "Mumbai",
    date: "Mar 18, 2024",
  },
  {
    name: "LifeLine Labs",
    id: "@LAB-2002",
    category: "Diagnostic",
    city: "Bhopal",
    date: "Mar 15, 2024",
  },
  {
    name: "Prime Diagnostics",
    id: "@LAB-2003",
    category: "Radiology",
    city: "Indore",
    date: "Mar 11, 2024",
  },
  {
    name: "Care Path Labs",
    id: "@LAB-2004",
    category: "Pathology",
    city: "Delhi",
    date: "Mar 08, 2024",
  },
];

const medicalStores = [
  {
    name: "Apollo Pharmacy",
    id: "@MED-3001",
    category: "Pharmacy",
    city: "Mumbai",
    date: "Mar 19, 2024",
  },
  {
    name: "HealthPlus Medical",
    id: "@MED-3002",
    category: "Medical Store",
    city: "Bhopal",
    date: "Mar 16, 2024",
  },
  {
    name: "Care Pharmacy",
    id: "@MED-3003",
    category: "Pharmacy",
    city: "Indore",
    date: "Mar 12, 2024",
  },
  {
    name: "LifeCare Medicines",
    id: "@MED-3004",
    category: "Medical Store",
    city: "Pune",
    date: "Mar 09, 2024",
  },
];

// ======================================================
// CHIP COLORS
// ======================================================

const deptColors = {
  Cardiology: {
    bg: "#E1F5EE",
    color: "#085041",
  },

  Neurology: {
    bg: "#E6F1FB",
    color: "#0C447C",
  },

  Pediatrics: {
    bg: "#FBEAF0",
    color: "#72243E",
  },

  Orthopedics: {
    bg: "#FAEEDA",
    color: "#633806",
  },

  Pathology: {
    bg: "#EDF7F2",
    color: "#07876A",
  },

  Diagnostic: {
    bg: "#E6F1FB",
    color: "#0C447C",
  },

  Radiology: {
    bg: "#F3E8FF",
    color: "#6B21A8",
  },

  Pharmacy: {
    bg: "#EDF7F2",
    color: "#07876A",
  },

  "Medical Store": {
    bg: "#FFF7E6",
    color: "#8A5800",
  },
};

// ======================================================
// AVATAR
// ======================================================

function Avatar({ name, type }) {
  const initials = name
    .split(" ")
    .filter((word) => word)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <Box
      sx={{
        width: 34,
        height: 34,

        borderRadius: "50%",

        bgcolor:
          type === "patient"
            ? "#E6F1FB"
            : "secondary.light",

        color:
          type === "patient"
            ? "#185FA5"
            : "primary.main",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        fontSize: "11px",
        fontWeight: 700,

        flexShrink: 0,
      }}
    >
      {initials}
    </Box>
  );
}

// ======================================================
// TABLE CARD
// ======================================================

function TableCard({
  title,
  icon,
  data,
  type,
}) {
  const getColumns = () => {
    if (type === "doctor") {
      return [
        "Doctor",
        "Department",
        "City",
        "Date",
      ];
    }

    if (type === "patient") {
      return [
        "Patient",
        "Details",
        "City",
        "Date",
      ];
    }

    if (type === "lab") {
      return [
        "Laboratory",
        "Type",
        "City",
        "Date",
      ];
    }

    return [
      "Medical Store",
      "Type",
      "City",
      "Date",
    ];
  };

  return (
    <Card
      sx={{
        borderRadius: 2,

        border: "1px solid",
        borderColor: "divider",

        boxShadow:
          "0 2px 8px rgba(15,23,42,0.04)",

        height: "100%",

        bgcolor: "background.paper",
      }}
    >
      <CardContent
        sx={{
          p: "0 !important",
        }}
      >
        {/* =====================
            HEADER
        ===================== */}

        <Box
          sx={{
            height: 52,

            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            px: 2,

            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,

                borderRadius: 1.5,

                bgcolor: "secondary.light",
                color: "primary.main",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </Box>

            <Typography
              variant="subtitle2"
              sx={{
                color: "text.primary",
              }}
            >
              {title}
            </Typography>
          </Box>

          <Button
            size="small"
            variant="text"
            sx={{
              minWidth: "auto",
              px: 1.2,

              color: "primary.main",

              fontSize: "12px",
            }}
          >
            View All
          </Button>
        </Box>

        {/* =====================
            TABLE
        ===================== */}

        <Box
          sx={{
            overflowX: "auto",
          }}
        >
          <Box
            sx={{
              minWidth: 550,
            }}
          >
            {/* TABLE HEADER */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns:
                  "2.1fr 1.5fr 1.1fr 1.2fr",

                px: 2,
                py: 1,

                bgcolor: "secondary.light",

                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              {getColumns().map((column) => (
                <Typography
                  key={column}
                  variant="caption"
                  sx={{
                    fontWeight: 600,

                    color: "text.secondary",

                    textTransform: "uppercase",

                    letterSpacing: "0.04em",
                  }}
                >
                  {column}
                </Typography>
              ))}
            </Box>

            {/* =====================
                ROWS
            ===================== */}

            {data.map((item, index) => (
              <Box
                key={item.id}
                sx={{
                  display: "grid",

                  gridTemplateColumns:
                    "2.1fr 1.5fr 1.1fr 1.2fr",

                  px: 2,
                  py: 1.15,

                  minHeight: 55,

                  alignItems: "center",

                  borderBottom:
                    index !== data.length - 1
                      ? "1px solid"
                      : "none",

                  borderColor: "divider",

                  transition:
                    "background-color 0.15s ease",

                  "&:hover": {
                    bgcolor: "background.default",
                  },
                }}
              >
                {/* NAME */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minWidth: 0,
                  }}
                >
                  <Avatar
                    name={item.name}
                    type={type}
                  />

                  <Box
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      variant="body1"
                      noWrap
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                      }}
                    >
                      {item.name}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.disabled",
                      }}
                    >
                      {item.id}
                    </Typography>
                  </Box>
                </Box>

                {/* =====================
                    TYPE / DETAILS
                ===================== */}

                {type === "patient" ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.8,
                    }}
                  >
                    <Typography
                      variant="body2"
                    >
                      {item.age}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,

                        color:
                          item.gender === "Male"
                            ? "info.main"
                            : "#993556",
                      }}
                    >
                      {item.gender}
                    </Typography>
                  </Box>
                ) : (
                  <Chip
                    label={
                      type === "doctor"
                        ? item.department
                        : item.category
                    }
                    size="small"
                    sx={{
                      width: "fit-content",

                      height: 21,

                      fontSize: "11px",

                      fontWeight: 600,

                      bgcolor:
                        deptColors[
                          type === "doctor"
                            ? item.department
                            : item.category
                        ]?.bg ?? "secondary.light",

                      color:
                        deptColors[
                          type === "doctor"
                            ? item.department
                            : item.category
                        ]?.color ??
                        "primary.main",
                    }}
                  />
                )}

                {/* CITY */}

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  {item.city}
                </Typography>

                {/* DATE */}

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.date}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// ======================================================
// MAIN
// ======================================================

export default function RecentRegistrations() {
  return (
    <Box
      sx={{
        display: "grid",

        // Desktop = 2 x 2
        gridTemplateColumns: {
          xs: "1fr",
          lg: "repeat(2, minmax(0, 1fr))",
        },

        gap: 2,
      }}
    >
      {/* DOCTOR */}

      <TableCard
        title="Recent Doctor Registrations"
        icon={
          <LocalHospitalIcon
            sx={{
              fontSize: 17,
            }}
          />
        }
        data={doctors}
        type="doctor"
      />

      {/* PATIENT */}

      <TableCard
        title="Recent Patient Registrations"
        icon={
          <PersonIcon
            sx={{
              fontSize: 17,
            }}
          />
        }
        data={patients}
        type="patient"
      />

      {/* LAB */}

      <TableCard
        title="Recent Lab Registrations"
        icon={
          <ScienceOutlinedIcon
            sx={{
              fontSize: 17,
            }}
          />
        }
        data={labs}
        type="lab"
      />

      {/* MEDICAL STORE */}

      <TableCard
        title="Recent Medical Store Registrations"
        icon={
          <LocalPharmacyOutlinedIcon
            sx={{
              fontSize: 17,
            }}
          />
        }
        data={medicalStores}
        type="medical"
      />
    </Box>
  );
}