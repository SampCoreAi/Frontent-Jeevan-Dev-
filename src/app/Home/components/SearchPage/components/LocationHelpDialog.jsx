"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// Generic steps — works regardless of which icon the browser shows
const locationSteps = [
  "Look at the very start of the address bar (left side, before the website URL) — you'll see a small icon there",
  "Click on that icon — it opens a small permissions panel",
  "Find \"Location\" in the list and change it from \"Block\" to \"Allow\"",
  "Refresh this page or click \"Retry\" below",
];

const fallbackSteps = [
  "Open your browser's main Settings (usually from the menu icon, top-right corner)",
  "Go to \"Privacy and Security\" → \"Site Settings\" (or \"Permissions\")",
  "Click \"Location\" and find this website in the list",
  "Change its permission to \"Allow\"",
];

export default function LocationHelpDialog({ open, onClose, onRetry }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: "#1e6658" }}>
        📍 Turn On Location Access
      </DialogTitle>

      <DialogContent>
        <p style={{ color: "#333", fontWeight: 600, marginBottom: "8px" }}>
          Quick way:
        </p>

        <ol style={{ paddingLeft: "20px", margin: 0, marginBottom: "16px" }}>
          {locationSteps.map((step, index) => (
            <li
              key={index}
              style={{
                marginBottom: "10px",
                color: "#444",
                lineHeight: 1.5,
              }}
            >
              {step}
            </li>
          ))}
        </ol>

        <p style={{ color: "#333", fontWeight: 600, marginBottom: "8px" }}>
          If you can't find that icon:
        </p>

        <ol style={{ paddingLeft: "20px", margin: 0 }}>
          {fallbackSteps.map((step, index) => (
            <li
              key={index}
              style={{
                marginBottom: "10px",
                color: "#666",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              {step}
            </li>
          ))}
        </ol>
      </DialogContent>

      <DialogActions sx={{ padding: "16px 24px" }}>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "2px solid #028275",
            color: "#028275",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Close
        </button>

        <button
          onClick={() => {
            onClose();
            onRetry();
          }}
          style={{
            background: "#028275",
            border: "none",
            color: "#fff",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Retry After Allowing
        </button>
      </DialogActions>
    </Dialog>
  );
}