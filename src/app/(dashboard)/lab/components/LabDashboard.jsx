"use client";

import { WorkspaceDashboard } from "./LabUi";

export default function LabDashboard({ profile, stats, onNavigate, variant = "lab" }) {
  const isMedical = variant === "medical";

  return (
    <WorkspaceDashboard
      eyebrow={isMedical ? "MEDICAL STORE WORKSPACE" : "CONNECTED LAB WORKSPACE"}
      title={isMedical ? (profile?.store_name || profile?.medical_store_name || "Medical Store") : (profile?.lab_name || "Diagnostic Laboratory")}
      subtitle={isMedical
        ? `Code: ${profile?.store_code || profile?.medical_store_code || "-"} · Manage patient orders, connected doctors and history`
        : `Code: ${profile?.lab_code || "-"} · Manage requests, doctors and reports`}
      statusLabel={profile?.status || (isMedical ? "ACTIVE" : "UNKNOWN")}
      stats={[
        [isMedical ? "Store Status" : "Lab Status", profile?.status || (isMedical ? "ACTIVE" : "-"), "#15803d"],
        ["Doctors", stats.connections, "#1769aa"],
        [isMedical ? "Requests" : "Test Requests", stats.requests, "#0f766e"],
        [isMedical ? "History" : "Reports", stats.reports, "#3578b5"],
      ]}
      profileFields={{
        title: isMedical ? "Medical store profile" : "Laboratory profile",
        description: isMedical ? "Registered pharmacy account details" : "Registered organisation details",
        items: isMedical ? [
          ["Store name", profile?.store_name || profile?.medical_store_name],
          ["Store code", profile?.store_code || profile?.medical_store_code],
          ["Phone", profile?.phone_number || profile?.phone],
          ["Address", profile?.address],
          ["Owner", profile?.full_name || profile?.owner_name],
          ["Email", profile?.email],
        ] : [
          ["Lab name", profile?.lab_name],
          ["Lab code", profile?.lab_code],
          ["Registration", profile?.registration_number],
          ["Phone", profile?.phone_number],
          ["Address", profile?.address],
          ["Status", profile?.status],
        ],
      }}
      quickActions={{
        description: isMedical ? "Move directly to your daily medical operations." : "Move directly to your daily work.",
        items: isMedical ? [
          { label: "Review medical requests", route: "/medical/pages/requests", variant: "contained" },
          { label: "Manage doctor connections", route: "/medical/pages/connections", variant: "outlined" },
          { label: "Open history", route: "/medical/pages/reports", variant: "outlined" },
        ] : [
          { label: "Review test requests", route: "/lab/pages/requests", variant: "contained" },
          { label: "Manage doctor connections", route: "/lab/pages/connections", variant: "outlined" },
          { label: "Open uploaded reports", route: "/lab/pages/reports", variant: "outlined" },
        ],
      }}
      profilePath={isMedical ? "/medical/pages/profile" : "/lab/pages/profile"}
      profileButtonLabel="View profile"
      onNavigate={onNavigate}
    />
  );
}
