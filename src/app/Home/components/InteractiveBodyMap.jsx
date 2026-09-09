"use client";

import React, { useState, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  MedicalInformation,
  Search,
  CalendarMonth,
  Male,
  Female,
} from "@mui/icons-material";

// Body Parts Data
const bodyData = {
  head: {
    title: "Head & Brain",
    conditions: [
      "Migraine",
      "Tension Headache",
      "Sinusitis",
      "Concussion",
      "Vertigo",
    ],
    treatments: [
      "Neurology Consultation",
      "MRI Scan",
      "Medication Management",
      "Cognitive Therapy",
    ],
    doctors: [
      "Dr. Sharma - Neurologist",
      "Dr. Patel - ENT Specialist",
      "Dr. Joshi - Ophthalmologist",
    ],
  },
  neck: {
    title: "Neck",
    conditions: [
      "Cervical Spondylosis",
      "Muscle Strain",
      "Whiplash Injury",
      "Thyroid Issues",
    ],
    treatments: [
      "Physiotherapy",
      "Pain Management",
      "Neck Exercises",
      "Ultrasound Scan",
    ],
    doctors: [
      "Dr. Kumar - Orthopedic Specialist",
      "Dr. Gupta - Physiotherapist",
    ],
  },
  shoulders: {
    title: "Shoulders",
    conditions: [
      "Rotator Cuff Injury",
      "Frozen Shoulder",
      "Arthritis",
      "Bursitis",
    ],
    treatments: [
      "Physical Therapy",
      "Corticosteroid Injections",
      "Shoulder Exercises",
      "X-Ray",
    ],
    doctors: [
      "Dr. Verma - Orthopedic Specialist",
      "Dr. Choudhary - Physiotherapist",
    ],
  },
  chest: {
    title: "Chest & Heart",
    conditions: [
      "Chest Pain",
      "Heart Disease",
      "Asthma",
      "Pneumonia",
      "Acid Reflux",
    ],
    treatments: [
      "Cardiology Checkup",
      "ECG",
      "X-Ray Chest",
      "Pulmonary Function Test",
    ],
    doctors: [
      "Dr. Kumar - Cardiologist",
      "Dr. Singh - Pulmonologist",
      "Dr. Reddy - Gastroenterologist",
    ],
  },
  stomach: {
    title: "Abdomen & Digestive System",
    conditions: [
      "Acidity",
      "Irritable Bowel Syndrome",
      "Gallstones",
      "Appendicitis",
      "Food Poisoning",
    ],
    treatments: [
      "Gastroenterology Consultation",
      "Endoscopy",
      "Ultrasound Abdomen",
      "Dietary Counseling",
    ],
    doctors: ["Dr. Gupta - Gastroenterologist", "Dr. Mehta - Nutritionist"],
  },
  pelvis: {
    title: "Pelvis & Hips",
    conditions: [
      "Hip Pain",
      "Pelvic Inflammatory Disease",
      "Hernia",
      "Osteoarthritis",
    ],
    treatments: [
      "Orthopedic Consultation",
      "Pelvic Ultrasound",
      "Physical Therapy",
      "Pain Management",
    ],
    doctors: [
      "Dr. Kapoor - Orthopedic Specialist",
      "Dr. Malhotra - Gynecologist",
    ],
  },
  back: {
    title: "Back & Spine",
    conditions: [
      "Lower Back Pain",
      "Slipped Disc",
      "Sciatica",
      "Scoliosis",
      "Arthritis",
    ],
    treatments: [
      "Physiotherapy",
      "Spinal Consultation",
      "X-Ray",
      "Pain Management Injections",
    ],
    doctors: ["Dr. Desai - Orthopedic Surgeon", "Dr. Iyer - Physiotherapist"],
  },
  "left-arm": {
    title: "Left Arm",
    conditions: [
      "Tennis Elbow",
      "Carpal Tunnel",
      "Arthritis",
      "Muscle Strain",
      "Fracture",
    ],
    treatments: [
      "Orthopedic Consultation",
      "X-Ray",
      "Physiotherapy",
      "Splinting",
    ],
    doctors: [
      "Dr. Verma - Orthopedic Specialist",
      "Dr. Choudhary - Physiotherapist",
    ],
  },
  "right-arm": {
    title: "Right Arm",
    conditions: [
      "Tennis Elbow",
      "Carpal Tunnel",
      "Arthritis",
      "Muscle Strain",
      "Fracture",
    ],
    treatments: [
      "Orthopedic Consultation",
      "X-Ray",
      "Physiotherapy",
      "Splinting",
    ],
    doctors: [
      "Dr. Verma - Orthopedic Specialist",
      "Dr. Choudhary - Physiotherapist",
    ],
  },
  "left-hand": {
    title: "Left Hand",
    conditions: [
      "Carpal Tunnel Syndrome",
      "Arthritis",
      "Tendonitis",
      "Fracture",
      "Sprain",
    ],
    treatments: ["Hand Therapy", "X-Ray", "Splinting", "Occupational Therapy"],
    doctors: [
      "Dr. Verma - Orthopedic Specialist",
      "Dr. Choudhary - Physiotherapist",
    ],
  },
  "right-hand": {
    title: "Right Hand",
    conditions: [
      "Carpal Tunnel Syndrome",
      "Arthritis",
      "Tendonitis",
      "Fracture",
      "Sprain",
    ],
    treatments: ["Hand Therapy", "X-Ray", "Splinting", "Occupational Therapy"],
    doctors: [
      "Dr. Verma - Orthopedic Specialist",
      "Dr. Choudhary - Physiotherapist",
    ],
  },
  "left-leg": {
    title: "Left Leg",
    conditions: [
      "Knee Pain",
      "Varicose Veins",
      "Sprain",
      "Arthritis",
      "Fracture",
    ],
    treatments: [
      "Orthopedic Consultation",
      "X-Ray",
      "Physiotherapy",
      "Compression Stockings",
    ],
    doctors: [
      "Dr. Kapoor - Orthopedic Specialist",
      "Dr. Malhotra - Vascular Surgeon",
    ],
  },
  "right-leg": {
    title: "Right Leg",
    conditions: [
      "Knee Pain",
      "Varicose Veins",
      "Sprain",
      "Arthritis",
      "Fracture",
    ],
    treatments: [
      "Orthopedic Consultation",
      "X-Ray",
      "Physiotherapy",
      "Compression Stockings",
    ],
    doctors: [
      "Dr. Kapoor - Orthopedic Specialist",
      "Dr. Malhotra - Vascular Surgeon",
    ],
  },
  "left-foot": {
    title: "Left Foot",
    conditions: [
      "Plantar Fasciitis",
      "Bunions",
      "Sprain",
      "Fracture",
      "Athlete's Foot",
    ],
    treatments: [
      "Podiatry Consultation",
      "X-Ray",
      "Orthotics",
      "Physical Therapy",
    ],
    doctors: [
      "Dr. Kapoor - Orthopedic Specialist",
      "Dr. Malhotra - Podiatrist",
    ],
  },
  "right-foot": {
    title: "Right Foot",
    conditions: [
      "Plantar Fasciitis",
      "Bunions",
      "Sprain",
      "Fracture",
      "Athlete's Foot",
    ],
    treatments: [
      "Podiatry Consultation",
      "X-Ray",
      "Orthotics",
      "Physical Therapy",
    ],
    doctors: [
      "Dr. Kapoor - Orthopedic Specialist",
      "Dr. Malhotra - Podiatrist",
    ],
  },
};

const InteractiveBodyMap = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedPart, setSelectedPart] = useState(null);
  const [hoveredPart, setHoveredPart] = useState(null);
  const [view, setView] = useState("front");
  const [gender, setGender] = useState("male");
  const [searchQuery, setSearchQuery] = useState("");

  const handlePartSelect = useCallback((part) => {
    setSelectedPart(part);
  }, []);

  const handlePartHover = useCallback((part) => {
    setHoveredPart(part);
  }, []);

  const handlePartLeave = useCallback(() => {
    setHoveredPart(null);
  }, []);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleGenderChange = (event, newGender) => {
    if (newGender !== null) {
      setGender(newGender);
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.length >= 2) {
      for (const part in bodyData) {
        const matches = bodyData[part].conditions.some((condition) =>
          condition.toLowerCase().includes(query)
        );
        if (matches) {
          setSelectedPart(part);
          break;
        }
      }
    }
  };

  const handleBookConsultation = () => {
    if (selectedPart) {
      alert(
        `Booking consultation for ${bodyData[selectedPart].title}. This would redirect to the appointment booking page in a real application.`
      );
    }
  };

  const currentData = selectedPart ? bodyData[selectedPart] : null;

  // SVG Body Components with better click handling
  const BodyArea = ({ part, d, children, ...props }) => {
    const isSelected = selectedPart === part;
    const isHovered = hoveredPart === part;

    const getFillColor = () => {
      if (isSelected) return theme.palette.primary.main;
      if (isHovered) return alpha(theme.palette.primary.main, 0.7);
      return theme.palette.grey[300];
    };

    return (
      <g>
        <path
          d={d}
          fill={getFillColor()}
          stroke={theme.palette.common.white}
          strokeWidth={2}
          style={{
            cursor: "pointer",
            transition: "all 0.2s ease",
            pointerEvents: "all",
          }}
          onClick={() => handlePartSelect(part)}
          onMouseEnter={() => {
            handlePartHover(part);
            handlePartSelect(part);
          }}
          onMouseLeave={handlePartLeave}
          {...props}
        />
        {children}
      </g>
    );
  };

  const MaleFrontBody = () => (
    <svg
      viewBox="0 0 400 700"
      width="100%"
      height="100%"
      style={{ pointerEvents: "bounding-box", backgroundColor: "white" }}
    >
      <defs>
        <filter id="crispGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feFlood floodColor="#00ffff" floodOpacity="0.8" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <pattern
          id="cleanMesh"
          x="0"
          y="0"
          width="25"
          height="25"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0,0 L25,25 M25,0 L0,25 M12.5,0 L12.5,25 M0,12.5 L25,12.5"
            stroke="rgba(0, 180, 200, 0.7)"
            strokeWidth="0.6"
            fill="none"
          />
        </pattern>

        <linearGradient
          id="transparentBlueFill"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="rgba(0, 200, 255, 0.1)" />
          <stop offset="100%" stopColor="rgba(0, 150, 200, 0.1)" />
        </linearGradient>
      </defs>

      <g
        stroke="#00ffff"
        strokeWidth="2"
        fill="url(#cleanMesh)"
        filter="url(#crispGlow)"
      >
        {/* Head */}
        <BodyArea
          part="head"
          d="M 200,30 Q 235,30 235,75 
           Q 235,120 200,135 
           Q 165,120 165,75 
           Q 165,30 200,30 Z"
        />

        {/* Neck */}
        <BodyArea
          part="neck"
          d="M 188,130 Q 200,138 212,130 
           L 215,150 Q 200,158 185,150 Z"
        />

        {/* Chest */}
        <BodyArea
          part="chest"
          d="M 150,150 Q 200,130 250,150 
           Q 265,170 255,210 
           Q 200,230 145,210 
           Q 135,170 150,150 Z"
        />

        {/* Stomach */}
        <BodyArea
          part="stomach"
          d="M 155,215 Q 200,235 245,215 
           Q 250,280 240,330 
           Q 200,350 160,330 
           Q 150,280 155,215 Z"
        />

        {/* Pelvis */}
        <BodyArea
          part="pelvis"
          d="M 160,330 Q 200,350 240,330 
           Q 255,370 245,400 
           Q 200,420 155,400 
           Q 145,370 160,330 Z"
        />

        {/* Left Arm */}
        <BodyArea
          part="left-arm"
          d="M 150,155 
           Q 130,165 125,200 
           Q 120,250 130,280 
           L 115,380 
           Q 105,385 100,350 
           L 110,280 
           Q 100,220 120,180 
           L 150,155 Z"
        />

        {/* Right Arm */}
        <BodyArea
          part="right-arm"
          d="M 250,155 
           Q 270,165 275,200 
           Q 280,250 270,280 
           L 285,380 
           Q 295,385 300,350 
           L 290,280 
           Q 300,220 280,180 
           L 250,155 Z"
        />

        {/* Left Hand */}
        <BodyArea
          part="left-hand"
          d="M 115,380 
           L 100,420 
           Q 95,435 110,440 
           Q 125,435 130,420 
           L 125,385 Z"
        />

        {/* Right Hand */}
        <BodyArea
          part="right-hand"
          d="M 285,380 
           L 300,420 
           Q 305,435 290,440 
           Q 275,435 270,420 
           L 275,385 Z"
        />

        {/* Left Leg */}
        <BodyArea
          part="left-leg"
          d="M 155,400 
           Q 145,480 155,530 
           Q 160,560 150,600 
           L 145,650 
           L 170,650 
           L 175,600 
           Q 185,530 180,480 
           L 180,405 Z"
        />

        {/* Right Leg */}
        <BodyArea
          part="right-leg"
          d="M 245,400 
           Q 255,480 245,530 
           Q 240,560 250,600 
           L 255,650 
           L 230,650 
           L 225,600 
           Q 215,530 220,480 
           L 220,405 Z"
        />

        {/* Left Foot */}
        <BodyArea
          part="left-foot"
          d="M 145,650 
           L 135,670 
           Q 130,680 155,685 
           L 175,680 
           Q 180,660 170,650 Z"
        />

        {/* Right Foot */}
        <BodyArea
          part="right-foot"
          d="M 255,650 
           L 265,670 
           Q 270,680 245,685 
           L 225,680 
           Q 220,660 230,650 Z"
        />
      </g>

      <g stroke="#00ffff" strokeWidth="1" fill="none" filter="url(#crispGlow)">
        <circle cx="185" cy="70" r="1.5" fill="#00ffff" />
        <circle cx="215" cy="70" r="1.5" fill="#00ffff" />
        <path d="M190,100 Q200,103 210,100" />
        <path d="M200,85 L200,90" />
      </g>
    </svg>
  );

  const FemaleFrontBody = () => (
    <svg
      viewBox="0 0 400 700"
      width="100%"
      height="100%"
      style={{ pointerEvents: "bounding-box" }}
    >
      {/* HEAD */}
      <BodyArea
        part="head"
        d="
        M180,60
        Q200,20 220,60
        Q225,110 200,130
        Q175,110 180,60
      "
      />

      {/* FACE */}
      <ellipse cx="190" cy="80" rx="4" ry="6" fill="#333" />
      <ellipse cx="210" cy="80" rx="4" ry="6" fill="#333" />
      <path
        d="M190,100 Q200,110 210,100"
        stroke="#333"
        strokeWidth="2"
        fill="none"
      />

      {/* NECK */}
      <BodyArea
        part="neck"
        d="M185,130 Q200,140 215,130 L215,155 Q200,165 185,155Z"
      />

      {/* SHOULDERS */}
      <BodyArea
        part="shoulders"
        d="
        M155,155
        Q200,140 245,155
        Q255,170 245,185
        Q200,170 155,185
        Q145,170 155,155
      "
      />

      {/* CHEST / BREASTS */}
      <BodyArea
        part="chest"
        d="
        M165,185
        Q180,230 200,230
        Q220,230 235,185
        Q200,165 165,185
      "
      />

      {/* UNDERBUST */}
      <path
        d="M170,210 Q200,225 230,210"
        stroke="#aaa"
        strokeWidth="1.5"
        fill="none"
      />

      {/* WAIST */}
      <BodyArea
        part="stomach"
        d="
        M170,230
        Q200,250 230,230
        Q240,290 230,330
        Q200,345 170,330
        Q160,290 170,230
      "
      />

      {/* HIPS */}
      <BodyArea
        part="pelvis"
        d="
        M165,330
        Q200,355 235,330
        Q250,390 235,430
        Q200,450 165,430
        Q150,390 165,330
      "
      />

      {/* LEFT ARM */}
      <BodyArea
        part="left-arm"
        d="
        M155,185
        Q125,240 130,305
        Q135,360 145,395
        L110,390
        Q98,350 103,295
        Q108,235 145,165
      "
      />

      {/* RIGHT ARM */}
      <BodyArea
        part="right-arm"
        d="
        M245,185
        Q275,240 270,305
        Q265,360 255,395
        L290,390
        Q302,350 297,295
        Q292,235 255,165
      "
      />

      {/* LEFT HAND */}
      <BodyArea
        part="left-hand"
        d="
        M110,390
        L90,420
        Q83,433 95,445
        L120,430
        Q128,420 125,395
        Z
      "
      />

      {/* RIGHT HAND */}
      <BodyArea
        part="right-hand"
        d="
        M290,390
        L310,420
        Q317,433 305,445
        L280,430
        Q272,420 275,395
        Z
      "
      />

      {/* LEFT LEG */}
      <BodyArea
        part="left-leg"
        d="
        M170,430
        Q155,490 165,565
        Q175,630 165,650
        L140,650
        Q130,580 138,515
        Q145,450 160,410
      "
      />

      {/* RIGHT LEG */}
      <BodyArea
        part="right-leg"
        d="
        M230,430
        Q245,490 235,565
        Q225,630 235,650
        L260,650
        Q270,580 262,515
        Q255,450 240,410
      "
      />

      {/* LEFT FOOT */}
      <BodyArea
        part="left-foot"
        d="
        M140,650
        L170,650
        Q180,665 165,680
        L135,680
        Q120,665 140,650
      "
      />

      {/* RIGHT FOOT */}
      <BodyArea
        part="right-foot"
        d="
        M230,650
        L260,650
        Q275,665 255,680
        L225,680
        Q210,665 230,650
      "
      />
    </svg>
  );

  const MaleBackBody = () => (
    <svg
      viewBox="0 0 400 700"
      width="100%"
      height="100%"
      style={{ pointerEvents: "bounding-box" }}
    >
      {/* Head */}
      <BodyArea
        part="head"
        d="
        M180,55
        Q200,20 220,55
        Q220,95 200,115
        Q180,95 180,55
      "
      />

      {/* Neck */}
      <BodyArea
        part="neck"
        d="
        M188,115
        Q200,130 212,115
        L212,145
        Q200,155 188,145
        Z
      "
      />

      {/* Shoulders */}
      <BodyArea
        part="shoulders"
        d="
        M145,145
        Q200,125 255,145
        Q260,158 255,170
        Q200,150 145,170
        Q140,158 145,145
      "
      />

      {/* Back */}
      <BodyArea
        part="back"
        d="
        M160,170
        Q200,150 240,170
        L240,330
        Q200,350 160,330
        Z
      "
      />

      {/* Spine */}
      <path
        d="M198,175 L198,325"
        stroke="#bfbfbf"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Shoulder Blades */}
      <path
        d="M170,210 Q185,225 170,245"
        stroke="#b0b0b0"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M230,210 Q215,225 230,245"
        stroke="#b0b0b0"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Left Arm */}
      <BodyArea
        part="left-arm"
        d="
        M120,150
        Q135,185 138,240
        Q140,300 145,330
        L110,325
        Q100,290 103,235
        Q105,180 135,150
      "
      />

      {/* Right Arm */}
      <BodyArea
        part="right-arm"
        d="
        M260,150
        Q245,185 242,240
        Q240,300 235,330
        L270,325
        Q280,290 277,235
        Q275,180 245,150
      "
      />

      {/* Left Hand */}
      <BodyArea
        part="left-hand"
        d="
        M110,325
        L90,355
        Q85,365 95,375
        L120,360
        Q125,355 120,330
        Z
      "
      />

      {/* Right Hand */}
      <BodyArea
        part="right-hand"
        d="
        M270,325
        L290,355
        Q295,365 285,375
        L260,360
        Q255,355 260,330
        Z
      "
      />

      {/* Left Leg */}
      <BodyArea
        part="left-leg"
        d="
        M175,330
        Q165,400 170,500
        Q175,600 160,650
        L140,650
        Q130,580 140,500
        Q145,420 160,330
        Z
      "
      />

      {/* Right Leg */}
      <BodyArea
        part="right-leg"
        d="
        M225,330
        Q235,400 230,500
        Q225,600 240,650
        L260,650
        Q270,580 260,500
        Q255,420 240,330
        Z
      "
      />

      {/* Feet */}
      <BodyArea
        part="left-foot"
        d="
        M140,650
        L170,650
        Q175,670 160,690
        L130,690
        Q120,670 140,650
      "
      />
      <BodyArea
        part="right-foot"
        d="
        M230,650
        L260,650
        Q270,670 250,690
        L220,690
        Q210,670 230,650
      "
      />
    </svg>
  );

  const FemaleBackBody = () => (
    <svg
      viewBox="0 0 400 700"
      width="100%"
      height="100%"
      style={{ pointerEvents: "bounding-box" }}
    >
      {/* Head */}
      <BodyArea
        part="head"
        d="
        M180,55
        Q200,20 220,55
        Q220,95 200,115
        Q180,95 180,55
      "
      />

      {/* Neck */}
      <BodyArea
        part="neck"
        d="
        M188,115
        Q200,130 212,115
        L212,145
        Q200,155 188,145
        Z
      "
      />

      {/* Shoulders - softer slope */}
      <BodyArea
        part="shoulders"
        d="
        M150,145
        Q200,130 250,145
        Q255,158 250,170
        Q200,155 150,170
        Q145,158 150,145
      "
      />

      {/* Back - feminine narrower waist, wider hips */}
      <BodyArea
        part="back"
        d="
        M165,170
        Q200,150 235,170
        L235,300
        Q200,330 165,300
        Z
      "
      />

      {/* Spine */}
      <path
        d="M198,175 L198,295"
        stroke="#bfbfbf"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Shoulder Blades */}
      <path
        d="M175,210 Q188,225 175,245"
        stroke="#b0b0b0"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M225,210 Q212,225 225,245"
        stroke="#b0b0b0"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Left Arm */}
      <BodyArea
        part="left-arm"
        d="
        M125,150
        Q145,190 148,245
        Q150,295 155,330
        L120,325
        Q110,290 113,235
        Q115,180 140,150
      "
      />

      {/* Right Arm */}
      <BodyArea
        part="right-arm"
        d="
        M255,150
        Q235,190 232,245
        Q230,295 225,330
        L260,325
        Q270,290 267,235
        Q265,180 240,150
      "
      />

      {/* Left Hand */}
      <BodyArea
        part="left-hand"
        d="
        M120,325
        L100,355
        Q95,365 105,375
        L130,360
        Q135,355 130,330
        Z
      "
      />

      {/* Right Hand */}
      <BodyArea
        part="right-hand"
        d="
        M260,325
        L280,355
        Q285,365 275,375
        L250,360
        Q245,355 250,330
        Z
      "
      />

      {/* Left Leg - more feminine, curvier */}
      <BodyArea
        part="left-leg"
        d="
        M175,300
        Q160,380 165,480
        Q170,580 155,650
        L135,650
        Q125,570 135,480
        Q145,395 160,300
        Z
      "
      />

      {/* Right Leg */}
      <BodyArea
        part="right-leg"
        d="
        M225,300
        Q240,380 235,480
        Q230,580 245,650
        L265,650
        Q275,570 265,480
        Q255,395 240,300
        Z
      "
      />

      {/* Feet */}
      <BodyArea
        part="left-foot"
        d="
        M135,650
        L165,650
        Q170,670 155,690
        L125,690
        Q115,670 135,650
      "
      />
      <BodyArea
        part="right-foot"
        d="
        M235,650
        L265,650
        Q275,670 255,690
        L225,690
        Q215,670 235,650
      "
      />
    </svg>
  );

  const renderBody = () => {
    if (view === "front") {
      return gender === "male" ? <MaleFrontBody /> : <FemaleFrontBody />;
    } else {
      return gender === "male" ? <MaleBackBody /> : <FemaleBackBody />;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${
          theme.palette.background.default
        } 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <div>We Give This Treatment</div>
        {/* Main Content */}
        <Grid container spacing={3} sx={{ p: 3 }}>
          {/* Body Map Section */}
          <Grid xs={12} md={7}>
            <Card elevation={2} sx={{ borderRadius: 0.5, height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                {/* Controls */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  {/* Gender Controls */}
                  <ToggleButtonGroup
                    value={gender}
                    exclusive
                    onChange={handleGenderChange}
                    aria-label="gender"
                    sx={{
                      "& .MuiToggleButton-root": {
                        px: 3,
                        py: 1,
                        borderRadius: 0.5,
                        textTransform: "none",
                        fontWeight: 600,
                      },
                    }}
                  >
                    <ToggleButton value="male">
                      <Male sx={{ mr: 1 }} />
                      Male
                    </ToggleButton>
                    <ToggleButton value="female">
                      <Female sx={{ mr: 1 }} />
                      Female
                    </ToggleButton>
                  </ToggleButtonGroup>

                  {/* View Controls */}
                  <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={handleViewChange}
                    aria-label="body view"
                    sx={{
                      "& .MuiToggleButton-root": {
                        px: 3,
                        py: 1,
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: 600,
                      },
                    }}
                  >
                    <ToggleButton value="front">Front View</ToggleButton>
                    <ToggleButton value="back">Back View</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {/* Body Map */}
                <Paper
                  elevation={1}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    height: isMobile ? 400 : 600,
                    bgcolor: "background.default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  {renderBody()}
                </Paper>
              </CardContent>
            </Card>
          </Grid>

          {/* Info Panel */}
          <Grid item xs={12} md={5}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 0.5,
                height: "100%",
                display: "flex",
                width: "850px",

                flexDirection: "column",
              }}
            >
              <CardContent
                sx={{
                  p: 3,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h4"
                  component="h2"
                  color="primary"
                  gutterBottom
                >
                  {currentData ? currentData.title : "Select a Body Part"}
                </Typography>

                {!currentData ? (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Click on any body part in the diagram to see information
                    about common conditions, available treatments, and our
                    specialist doctors.
                  </Typography>
                ) : (
                  <>
                    {/* Conditions */}
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        Common Conditions:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {currentData.conditions.map((condition, index) => (
                          <Chip
                            key={index}
                            label={condition}
                            variant="outlined"
                            color="primary"
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* Treatments */}
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        Available Treatments:
                      </Typography>
                      <List dense>
                        {currentData.treatments.map((treatment, index) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemText
                              primary={treatment}
                              primaryTypographyProps={{ variant: "body2" }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    {/* Doctors */}
                    <Box sx={{ mt: 3, mb: 2 }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        Our Specialists:
                      </Typography>
                      <List dense>
                        {currentData.doctors.map((doctor, index) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemText
                              primary={doctor}
                              primaryTypographyProps={{ variant: "body2" }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<CalendarMonth />}
                      onClick={handleBookConsultation}
                      sx={{
                        mt: "auto",
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                      }}
                    >
                      View Docter
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InteractiveBodyMap;
