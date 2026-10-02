"use client";

import {
  Ambulance, Globe, Brain, ClipboardList, Stethoscope,
  Volume2, Mic, Syringe, History
} from "lucide-react";
import RadialOrbitalTimeline from "../feature/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "Find & Book Doctors",
    date: "Patient",
    content:
      "Search doctors by specialty, location and availability, view doctor profiles, and book appointments through available schedules.",
    category: "Appointment",
    icon: Stethoscope,
    relatedIds: [2, 3],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Doctor Consultation",
    date: "Doctor",
    content:
      "Doctors manage appointments, verify patient tokens, start consultations and access patient details during the consultation.",
    category: "Consultation",
    icon: Ambulance,
    relatedIds: [1, 3, 4],
    status: "completed",
    energy: 95,
  },
  {
    id: 3,
    title: "Digital Prescription",
    date: "Doctor",
    content:
      "Create digital prescriptions with medicines, dosage and instructions, then securely share prescription details with the patient.",
    category: "Prescription",
    icon: ClipboardList,
    relatedIds: [1, 2, 4],
    status: "completed",
    energy: 90,
  },
  {
    id: 4,
    title: "Lab Test & Reports",
    date: "Lab",
    content:
      "Doctors can request lab tests, labs can prepare reports, and patients can access their completed diagnostic reports digitally.",
    category: "Laboratory",
    icon: Syringe,
    relatedIds: [2, 3, 5],
    status: "completed",
    energy: 85,
  },
  {
    id: 5,
    title: "Medical Store",
    date: "Pharmacy",
    content:
      "Doctors can connect with verified medical stores and send medicine requests. Stores can process requests, add pricing and generate the final invoice.",
    category: "Medicine",
    icon: ClipboardList,
    relatedIds: [3, 4, 6],
    status: "completed",
    energy: 80,
  },
  {
    id: 6,
    title: "Medical Documents",
    date: "Patient",
    content:
      "Patients can keep prescriptions, lab reports and other medical documents organized and accessible from one place.",
    category: "Records",
    icon: History,
    relatedIds: [4, 5, 7],
    status: "completed",
    energy: 75,
  },
  {
    id: 7,
    title: "Medical History",
    date: "Records",
    content:
      "Track previous appointments, prescriptions and medical records to maintain a continuous view of the patient's healthcare journey.",
    category: "History",
    icon: History,
    relatedIds: [6, 8],
    status: "completed",
    energy: 70,
  },
  {
    id: 8,
    title: "Emergency Care",
    date: "Emergency",
    content:
      "Patients can find doctors accepting emergency cases, while doctors can manage their emergency availability from the platform.",
    category: "Emergency",
    icon: Ambulance,
    relatedIds: [1, 7, 9],
    status: "completed",
    energy: 65,
  },
  {
    id: 9,
    title: "Real-Time Notifications",
    date: "Live",
    content:
      "Keep doctors and patients updated with important appointment, medical request and emergency activity through real-time notifications.",
    category: "Notification",
    icon: Volume2,
    relatedIds: [2, 5, 8],
    status: "completed",
    energy: 60,
  },
];
export function RadialOrbitalTimelineDemo() {
  return <RadialOrbitalTimeline timelineData={timelineData} />;
}

export default RadialOrbitalTimelineDemo;