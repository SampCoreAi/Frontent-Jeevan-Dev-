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
  LocalPharmacyOutlined,
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
      label: "Lab Reports",
      icon: <DescriptionOutlined />,
      route: "/users/pages/lab/reports",
    },
    {
      label: "Medical",
      icon: <LocalPharmacyOutlined />,
      route: "/users/pages/medical",
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
      label: "Medical",
      icon: <LocalPharmacyOutlined />,
      route: "/doctor/pages/medical",
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
      label: "Technicians",
      icon: <GroupOutlined />,
      route: "/lab/pages/technicians",
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
      label: "Medical",
      icon: <LocalPharmacyOutlined />,
      route: "/admin/pages/medical",
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

  // Medical user
  6: [
    {
      label: "Dashboard",
      icon: <DashboardOutlined />,
      route: "/medical/pages/dashboard",
    },
    {
      label: "Connections",
      icon: <GroupOutlined />,
      route: "/medical/pages/connections",
    },
    {
      label: "Medical Requests",
      icon: <AssignmentOutlined />,
      route: "/medical/pages/requests",
    },
    {
      label: "History",
      icon: <DescriptionOutlined />,
      route: "/medical/pages/reports",
    },
    {
      label: "Profile",
      icon: <PersonOutlined />,
      route: "/medical/pages/profile",
    },
    {
      label: "Setting",
      icon: <SettingsOutlined />,
      route: "/medical/pages/setting",
    },
  ],

  // Lab technician
  7: [
    {
      label: "Technician Dashboard",
      icon: <AssignmentOutlined />,
      route: "/lab/pages/technician",
    },
    {
      label: "Setting",
      icon: <SettingsOutlined />,
      route: "/lab/pages/setting",
    },
  ],
};