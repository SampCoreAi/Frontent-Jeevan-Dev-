"use client";

import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import { ArrowRight } from "lucide-react";

const orders = [
  {
    id: "JD-2841",
    patient: "Priya Sharma",
    details: "F • 32 yrs",
    test: "CBC",
    doctor: "Dr. R. Mehta",
    clinic: "City Care Hospital",
    priority: "Routine",
    status: "Sample collected",
    received: "09:42 AM",
  },
  {
    id: "JD-2840",
    patient: "Amit Verma",
    details: "M • 45 yrs",
    test: "Lipid Profile",
    doctor: "Dr. S. Rao",
    clinic: "Sunrise Clinic",
    priority: "Urgent",
    status: "In progress",
    received: "09:18 AM",
  },
  {
    id: "JD-2839",
    patient: "Neha Kapoor",
    details: "F • 29 yrs",
    test: "Thyroid Panel",
    doctor: "Dr. R. Mehta",
    clinic: "City Care Hospital",
    priority: "Routine",
    status: "Report ready",
    received: "08:55 AM",
  },
];

const chipColors = {
  Routine: { bgcolor: "#EEF1F5", color: "#526176" },
  Urgent: { bgcolor: "#FDE8E8", color: "#DC4545" },
  "Sample collected": { bgcolor: "#E4F6F0", color: "#14856D" },
  "In progress": { bgcolor: "#E8F1FF", color: "#2670C8" },
  "Report ready": { bgcolor: "#E5F6E8", color: "#268544" },
};

function OrderChip({ label }) {
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        height: 25,
        borderRadius: 1.5,
        fontSize: 12.5,
        fontWeight: 600,
        ...chipColors[label],
      }}
    />
  );
}

export default function RecentTestOrders() {
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        p: { xs: 1.5, sm: 2 },
        border: "1px solid #E2EBE9",
        borderRadius: 2,
        bgcolor: "#FFFFFF",
      }}
    >
      <Box
        sx={{
          mb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box>
          <Typography sx={{ color: "#172033", fontSize: 17, fontWeight: 700 }}>
            Recent Test Orders
          </Typography>
          <Typography sx={{ mt: 0.3, color: "#64748B", fontSize: 12.5 }}>
            Latest test orders from hospitals and clinics
          </Typography>
        </Box>

        <Button
          href="/lab/pages/requests"
          endIcon={<ArrowRight size={16} />}
          sx={{
            flexShrink: 0,
            color: "#2670C8",
            fontSize: 12.5,
            textTransform: "none",
          }}
        >
          View all orders
        </Button>
      </Box>

      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Box
          component="table"
          sx={{
            width: "100%",
            minWidth: 820,
            borderCollapse: "collapse",
            "& th": {
              p: 1.2,
              bgcolor: "#F3F6F8",
              color: "#40516A",
              fontSize: 12.5,
              fontWeight: 700,
              textAlign: "left",
              whiteSpace: "nowrap",
            },
            "& td": {
              p: 1.2,
              borderBottom: "1px solid #EDF1F2",
              color: "#40516A",
              fontSize: 12.5,
              whiteSpace: "nowrap",
            },
          }}
        >
          <thead>
            <tr>
              {["Order ID", "Patient", "Test", "Ordered by", "Priority", "Status", "Received"].map(
                (heading) => (
                  <th key={heading}>{heading}</th>
                ),
              )}
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  <Typography sx={{ color: "#172033", fontSize: 12.5, fontWeight: 600 }}>
                    {order.patient}
                  </Typography>
                  <Typography sx={{ color: "#748196", fontSize: 12 }}>
                    {order.details}
                  </Typography>
                </td>
                <td>{order.test}</td>
                <td>
                  <Typography sx={{ color: "#172033", fontSize: 12.5, fontWeight: 600 }}>
                    {order.doctor}
                  </Typography>
                  <Typography sx={{ color: "#748196", fontSize: 12 }}>
                    {order.clinic}
                  </Typography>
                </td>
                <td><OrderChip label={order.priority} /></td>
                <td><OrderChip label={order.status} /></td>
                <td>{order.received}</td>
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>
    </Paper>
  );
}