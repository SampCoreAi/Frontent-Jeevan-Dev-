import {
  Notifications as NotificationsIcon,
  CalendarToday as CalendarIcon,
  Chat as ChatIcon,
} from "@mui/icons-material";

import TrackChangesIcon from "@mui/icons-material/TrackChanges";

export const navbarItems = {
  1: [
   
    {
      icon: CalendarIcon,
      label: "Calendar",
      onClick: () => console.log("User Calendar"),
    },
    {
      icon: TrackChangesIcon,
      label: "Track Appointment",
      onClick: () => console.log("Track Appointment"),
    },
  ],

  2: [
    {
      icon: NotificationsIcon,
      label: "Notifications",
      badge: 5,
      onClick: () => console.log("Doctor Notifications"),
    },
    {
      icon: ChatIcon,
      label: "Messages",
      onClick: () => console.log("Doctor Messages"),
    },
    {
      icon: CalendarIcon,
      label: "Calendar",
      onClick: () => console.log("Doctor Schedule"),
    },
  ],

  3: [
    {
      icon: NotificationsIcon,
      label: "New Patients",
      badge: 10,
      onClick: () => console.log("Receptionist Patient Alerts"),
    },
  ],

  4: [
    {
      icon: NotificationsIcon,
      label: "New Patients",
      badge: 10,
      onClick: () => console.log("Receptionist Patient Alerts"),
    },
  ],
};