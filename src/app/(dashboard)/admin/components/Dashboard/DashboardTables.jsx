"use client";

import { Box, Button, Card, CardContent, Chip, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

const doctors = [
  { name: "Dr. Sarah Jenkins", id: "@DOC-8892", department: "Cardiology", city: "New York", date: "Mar 15, 2024" },
  { name: "Dr. Mike Ross", id: "@DOC-8893", department: "Neurology", city: "Chicago", date: "Mar 10, 2024" },
  { name: "Dr. Emily Chen", id: "@DOC-8894", department: "Pediatrics", city: "Los Angeles", date: "Mar 05, 2024" },
  { name: "Dr. James Hall", id: "@DOC-8895", department: "Orthopedics", city: "Houston", date: "Feb 28, 2024" },
];

const patients = [
  { name: "John Smith", id: "@PAT-1001", age: "45 yrs", gender: "Male", city: "New York", date: "Mar 18, 2024" },
  { name: "Emma Wilson", id: "@PAT-1002", age: "32 yrs", gender: "Female", city: "Chicago", date: "Mar 16, 2024" },
  { name: "Robert Brown", id: "@PAT-1003", age: "58 yrs", gender: "Male", city: "Los Angeles", date: "Mar 12, 2024" },
  { name: "Sophia Garcia", id: "@PAT-1004", age: "28 yrs", gender: "Female", city: "Miami", date: "Mar 08, 2024" },
];

const deptColors = {
  Cardiology:  { bg: "#E1F5EE", color: "#085041" },
  Neurology:   { bg: "#E6F1FB", color: "#0C447C" },
  Pediatrics:  { bg: "#FBEAF0", color: "#72243E" },
  Orthopedics: { bg: "#FAEEDA", color: "#633806" },
};

function Avatar({ name, type }) {
  const initials = name
    .split(" ")
    .filter((w) => w[0] === w[0]?.toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  const bg = type === "doctor" ? "#E1F5EE" : "#E6F1FB";
  const color = type === "doctor" ? "#085041" : "#0C447C";

  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: bg,
        color: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initials}
    </Box>
  );
}

const colStyle = {
  fontSize: "11px",
  fontWeight: 600,
  color: "#6B7280",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

const cellStyle = {
  fontSize: "13px",
  color: "#374151",
  fontWeight: 500,
};

function TableCard({ title, icon, data, type, btnColor = "#0F766E", btnHover = "#085041" }) {
  return (
    <Card
      sx={{
        borderRadius: "14px",
        border: "1px solid #E5E7EB",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            py: 2,
            borderBottom: "1px solid #F3F4F6",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {icon}
            <Typography sx={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
              {title}
            </Typography>
          </Box>

          <Button
            size="small"
            sx={{
              background: btnColor,
              color: "#fff",
              borderRadius: "8px",
              px: 2,
              py: 0.6,
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { background: btnHover, boxShadow: "none" },
            }}
          >
            View All
          </Button>
        </Box>

        {/* Table */}
        <Box sx={{ overflowX: "auto" }}>
          <Box sx={{ minWidth: 580 }}>
            {/* Column Headers */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "2.2fr 1.6fr 1.2fr 1.2fr",
                px: 3,
                py: 1.2,
                background: "#F9FAFB",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              {(type === "doctor"
                ? ["Doctor", "Department", "City", "Date"]
                : ["Patient", "Details", "City", "Date"]
              ).map((col) => (
                <Typography key={col} sx={colStyle}>{col}</Typography>
              ))}
            </Box>

            {/* Rows */}
            {data.map((item, i) => (
              <Box
                key={i}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2.2fr 1.6fr 1.2fr 1.2fr",
                  px: 3,
                  py: 1.8,
                  borderBottom: i !== data.length - 1 ? "1px solid #F3F4F6" : "none",
                  alignItems: "center",
                  "&:hover": { background: "#FAFAFA" },
                  transition: "background 0.15s",
                }}
              >
                {/* Name + ID */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar name={item.name} type={type} />
                  <Box>
                    <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>
                      {item.name}
                    </Typography>
                    <Typography sx={{ fontSize: "11px", color: "#9CA3AF" }}>{item.id}</Typography>
                  </Box>
                </Box>

                {/* Dept / Details */}
                {type === "doctor" ? (
                  <Chip
                    label={item.department}
                    size="small"
                    sx={{
                      fontSize: "11px",
                      fontWeight: 600,
                      height: 22,
                      background: deptColors[item.department]?.bg ?? "#F3F4F6",
                      color: deptColors[item.department]?.color ?? "#374151",
                      border: "none",
                      width: "fit-content",
                    }}
                  />
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <Typography sx={{ fontSize: "12px", color: "#6B7280" }}>{item.age}</Typography>
                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: item.gender === "Male" ? "#185FA5" : "#993556",
                      }}
                    >
                      {item.gender}
                    </Typography>
                  </Box>
                )}

                <Typography sx={{ ...cellStyle, color: "#6B7280", fontSize: "12px" }}>{item.city}</Typography>
                <Typography sx={{ ...cellStyle, color: "#6B7280", fontSize: "12px" }}>{item.date}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function RecentRegistrations() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", xl: "1fr 1fr" },
        gap: 3,
      }}
    >
      <TableCard
        title="Recent Doctor Registrations"
        icon={<LocalHospitalIcon sx={{ fontSize: 18, color: "#0F766E" }} />}
        data={doctors}
        type="doctor"
        btnColor="#0F766E"
        btnHover="#085041"
      />

      <TableCard
        title="Recent Patient Registrations"
        icon={<PersonIcon sx={{ fontSize: 18, color: "#185FA5" }} />}
        data={patients}
        type="patient"
        btnColor="#185FA5"
        btnHover="#0C447C"
      />
    </Box>
  );
}