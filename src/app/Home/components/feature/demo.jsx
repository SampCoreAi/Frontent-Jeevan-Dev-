"use client";

import {
  Ambulance, Globe, Brain, ClipboardList, Stethoscope,
  Volume2, Mic, Syringe, History
} from "lucide-react";
import RadialOrbitalTimeline from "../feature/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "Patient Registration",
    date: "v1.0",
    content: "Quick patient check-in with just a few taps. Register new patients or pull up existing records instantly at the front desk.",
    category: "Core",
    icon: Ambulance,
    relatedIds: [2, 3],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Multi-Language Support",
    date: "Feature",
    content: "Supports 9 Indian languages including Hindi, Tamil, Bengali, Gujarati, Marathi, Telugu, Kannada, and Punjabi for patient communication.",
    category: "Language",
    icon: Globe,
    relatedIds: [1, 3],
    status: "completed",
    energy: 95,
  },
  {
    id: 3,
    title: "AI Symptom Checker",
    date: "AI",
    content: "Understands patient-described symptoms to suggest the right department and possible conditions using AI-powered analysis.",
    category: "AI",
    icon: Brain,
    relatedIds: [1, 2, 4],
    status: "completed",
    energy: 90,
  },
  {
    id: 4,
    title: "Doctor Consultation",
    date: "Feature",
    content: "Book in-person or video consultations with specialists, with clean color-coded slots for available and busy doctors.",
    category: "Consultation",
    icon: Stethoscope,
    relatedIds: [3, 5],
    status: "completed",
    energy: 85,
  },
  {
    id: 5,
    title: "Medical Reports",
    date: "Feature",
    content: "View lab results and diagnostic reports with clear explanations to help patients understand their health status.",
    category: "Diagnostics",
    icon: ClipboardList,
    relatedIds: [4, 6],
    status: "completed",
    energy: 80,
  },
  {
    id: 6,
    title: "Voice Report Reading",
    date: "Feature",
    content: "Listen to medical reports and prescriptions read aloud in native voice with adjustable speed (0.5×, 1×, 2×).",
    category: "Audio",
    icon: Volume2,
    relatedIds: [5, 7],
    status: "completed",
    energy: 75,
  },
  {
    id: 7,
    title: "Voice Symptom Search",
    date: "Feature",
    content: "Speak your symptoms using the microphone and instantly get matched with the right specialist.",
    category: "Input",
    icon: Mic,
    relatedIds: [6, 8],
    status: "completed",
    energy: 70,
  },
  {
    id: 8,
    title: "Prescription & Medication",
    date: "Feature",
    content: "Digital prescriptions with dosage highlights and reminders, directly shared with the pharmacy for quick dispensing.",
    category: "Treatment",
    icon: Syringe,
    relatedIds: [7, 9],
    status: "completed",
    energy: 65,
  },
  {
    id: 9,
    title: "Save & Medical History",
    date: "Feature",
    content: "Pin important reports for later and track the last 50 visits and prescriptions with timestamps for full medical history.",
    category: "Storage",
    icon: History,
    relatedIds: [8],
    status: "completed",
    energy: 60,
  }
];

export function RadialOrbitalTimelineDemo() {
  return <RadialOrbitalTimeline timelineData={timelineData} />;
}

export default RadialOrbitalTimelineDemo;