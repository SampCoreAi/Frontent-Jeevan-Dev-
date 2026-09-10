"use client";

import {
  DashboardOutlined,
  CalendarMonthOutlined,
  PersonOutlined,
  PeopleAltOutlined,
  SettingsOutlined,
  BadgeOutlined,
  ThumbUpOffAltOutlined,
  MedicalServicesOutlined,
  DescriptionOutlined,
  HistoryOutlined,
  GroupOutlined,
  ManageAccountsOutlined,
  EventAvailableOutlined,
  QrCode2Outlined,
} from "@mui/icons-material";

export const menuItems = {
  // Patient
  1: [
    {
      label: "Doctor",
      icon: <MedicalServicesOutlined />,
      route: "/users/pages/doctor",
    },
    {
      label: "Document",
      icon: <DescriptionOutlined />,
      route: "/users/pages/document",
    },
    {
      label: "History",
      icon: <HistoryOutlined />,
      route: "/users/pages/history",
    },
    {
      label: "Profile",
      icon: <PersonOutlined />,
      route: "/users/pages/profile",
    },
    {
      label: "Setting",
      icon: <SettingsOutlined />,
      route: "/users/pages/setting",
    },
  ],

  // Doctor
  2: [
    {
      label: "Dashboard",
      icon: <DashboardOutlined />,
      route: "/doctor/pages/dashboard",
    },
    {
      label: "Assistants",
      icon: <GroupOutlined />,
      route: "/doctor/pages/doctorReceptionistUser",
    },
    {
      label: "Schedule",
      icon: <EventAvailableOutlined />,
      route: "/doctor/pages/schedule",
    },
    {
      label: "Patient",
      icon: <PeopleAltOutlined />,
      route: "/doctor/pages/patient",
    },
    {
      label: "Appointment",
      icon: <CalendarMonthOutlined />,
      route: "/doctor/pages/appointment",
    },
    {
      label: "Profile",
      icon: <BadgeOutlined />,
      route: "/doctor/pages/profile",
    },
    {
      label: "Setting",
      icon: <SettingsOutlined />,
      route: "/doctor/pages/setting",
    },
    {
      label: "Feedback",
      icon: <ThumbUpOffAltOutlined />,
      route: "/doctor/pages/feedback",
    },
  ],

  // Assistant / Receptionist
  3: [
    {
      label: "Dashboard",
      icon: <DashboardOutlined />,
      route: "/doctor/pages/dashboard",
    },
    {
      label: "Patient",
      icon: <PeopleAltOutlined />,
      route: "/doctor/pages/patient",
    },
    {
      label: "Appointment",
      icon: <CalendarMonthOutlined />,
      route: "/doctorReceptionist/pages/appointment",
    },
    {
      label: "Feedback",
      icon: <ThumbUpOffAltOutlined />,
      route: "/doctorReceptionist/pages/feedback",
    },
    {
      label: "Profile",
      icon: <PersonOutlined />,
      route: "/doctorReceptionist/pages/profile",
    },
    {
      label: "Setting",
      icon: <SettingsOutlined />,
      route: "/doctorReceptionist/pages/setting",
    },
  ],

  // Admin
  4: [
    {
      label: "Dashboard",
      icon: <DashboardOutlined />,
      route: "/admin/pages/dashboard",
    },
    {
      label: "Doctor",
      icon: <MedicalServicesOutlined />,
      route: "/admin/pages/Doctor",
    },
    {
      label: "QR Management",
      icon: <QrCode2Outlined />,
      route: "/admin/pages/qrcode",
    },
    {
      label: "Registration",
      icon: <ManageAccountsOutlined />,
      route: "/admin/pages/Registration",
    },
    {
      label: "Doctor Assistants",
      icon: <GroupOutlined />,
      route: "/admin/pages/Assistant",
    },
    {
      label: "Patient",
      icon: <PeopleAltOutlined />,
      route: "/admin/pages/patient",
    },
    {
      label: "Setting",
      icon: <SettingsOutlined />,
      route: "/admin/pages/setting",
    },
  ],
};