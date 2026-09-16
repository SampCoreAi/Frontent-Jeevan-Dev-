"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

import Badge from "@mui/material/Badge";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function Calender() {
  const [value, setValue] = useState(dayjs());
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
const res = await axios.get(
  `${API_URL}/api/appointments/getAllappoinment/my`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

        setAppointments(res.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAppointments();
  }, []);

  // Date-wise appointment count
  const appointmentCounts = appointments.reduce((acc, item) => {
    const date = dayjs(item.slot_date).format("YYYY-MM-DD");

    acc[date] = (acc[date] || 0) + 1;

    return acc;
  }, {});

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={value}
        onChange={(newValue) => setValue(newValue)}
        slots={{
          day: (props) => {
            const date = dayjs(props.day).format("YYYY-MM-DD");
            const count = appointmentCounts[date] || 0;

            return (
              <Badge
                badgeContent={count > 0 ? count : null}
                color="error"
                overlap="circular"
              >
                <PickersDay {...props} />
              </Badge>
            );
          },
        }}
      sx={{
  // Mobile only
  width: { xs: "100%", sm: "320px" },
  maxWidth: "100%",
  height: { xs: "300px", sm: "336px" },

  // Mobile me day size chhota
  "& .MuiPickersDay-root": {
    width: { xs: "32px", sm: "36px" },
    height: { xs: "32px", sm: "36px" },
    fontSize: { xs: "0.75rem", sm: "0.875rem" },
  },

  // Selected date
  "& .MuiPickersDay-root.Mui-selected": {
    backgroundColor: "#1e6658 !important",
  },

  "& .MuiPickersDay-root.Mui-selected:hover": {
    backgroundColor: "#1e6658 !important",
  },

  // Appointment count badge
  "& .MuiBadge-badge": {
    fontSize: { xs: "8px", sm: "10px" },
    minWidth: { xs: "14px", sm: "16px" },
    height: { xs: "14px", sm: "16px" },
  },

  // Month/year heading
  "& .MuiPickersCalendarHeader-label": {
    fontSize: { xs: "0.9rem", sm: "1rem" },
  },

  // Week names
  "& .MuiDayCalendar-weekDayLabel": {
    width: { xs: "32px", sm: "36px" },
    fontSize: { xs: "0.7rem", sm: "0.75rem" },
  },
}}
      />
    </LocalizationProvider>
  );
}