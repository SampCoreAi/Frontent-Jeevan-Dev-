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
  ScienceOutlined,
  AssignmentOutlined,
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
      label: "Lab Requests",
      icon: <AssignmentOutlined />,
      route: "/users/pages/lab/requests",
    },
    {
      label: "Lab Reports",
      icon: <DescriptionOutlined />,
      route: "/users/pages/lab/reports",
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
      label: "Patient",
      icon: <PeopleAltOutlined />,
      route: "/doctor/pages/patient",
    },
    {
      label: "Schedule",
      icon: <EventAvailableOutlined />,
      route: "/doctor/pages/schedule",
    },
   
    {
      label: "Appointment",
      icon: <CalendarMonthOutlined />,
      route: "/doctor/pages/appointment",
    },

{
      label: "Assistants",
      icon: <GroupOutlined />,
      route: "/doctor/pages/doctorReceptionistUser",
    },
    
    {
      label: "Connections",
      icon: <GroupOutlined />,
      route: "/doctor/pages/lab/connections",
    },
    {
      label: "Test Requests",
      icon: <AssignmentOutlined />,
      route: "/doctor/pages/lab/requests",
    },
    {
      label: "Reports",
      icon: <DescriptionOutlined />,
      route: "/doctor/pages/lab/reports",
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

  // Lab user
  4: [
    {
      label: "Dashboard",
      icon: <DashboardOutlined />,
      route: "/lab/pages/dashboard",
    },
    {
      label: "Connections",
      icon: <GroupOutlined />,
      route: "/lab/pages/connections",
    },
    {
      label: "Test Requests",
      icon: <AssignmentOutlined />,
      route: "/lab/pages/requests",
    },
    {
      label: "Reports",
      icon: <DescriptionOutlined />,
      route: "/lab/pages/reports",
    },
    {
      label: "Profile",
      icon: <PersonOutlined />,
      route: "/lab/pages/profile",
    },
    {
      label: "Setting",
      icon: <SettingsOutlined />,
      route: "/lab/pages/setting",
    },
  ],

  // Admin
  5: [
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
      label: "Labs",
      icon: <ScienceOutlined />,
      route: "/admin/pages/labs",
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