"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  CalendarDays,
  FileText,
  Stethoscope,
  Search,
  ShieldCheck,
  FlaskConical,
  Pill,
  HeartPulse,
  ClipboardList,
  Store,
  Activity,
  UserRound,
} from "lucide-react";
const sections = [
  {
    id: 1,

    label: "SMART HEALTHCARE",

    title: "Your health.",
    highlight: "Your control.",

    description:
      "Appointments, prescriptions and medical records — organized around you.",

    features: [
      {
        icon: CalendarDays,
        text: "Book appointments",
        color: "#079b72",
        background: "#DDF7EF",
      },
      {
        icon: FileText,
        text: "Access medical records",
        color: "#168BE8",
        background: "#E4F1FF",
      },
      {
        icon: Stethoscope,
        text: "Connect with doctors",
        color: "#745BE7",
        background: "#EEE9FF",
      },
    ],

    button: "Get Started",
    href: "/Home/pages/search",

    image: "/img/top-doctors-mobile-cropped.svg",

    // Light left → stronger mint/green right
    background:
      "linear-gradient(110deg, #F8FCFA 0%, #F4FBF8 28%, #EAF8F3 52%, #D2F0E7 75%, #A9DFD0 100%)",
  },

  {
    id: 2,

    label: "FIND YOUR DOCTOR",

    title: "Care you trust.",
    highlight: "Doctors you choose.",

    description:
      "Search trusted doctors by specialty, location and availability — then book your appointment instantly.",

    features: [
      {
        icon: Search,
        text: "Search specialists",
        color: "#079b72",
        background: "#DDF7EF",
      },
      {
        icon: UserRound,
        text: "Explore doctor profiles",
        color: "#168BE8",
        background: "#E4F1FF",
      },
      {
        icon: CalendarDays,
        text: "Book appointments",
        color: "#745BE7",
        background: "#EEE9FF",
      },
    ],

    button: "Explore Doctors",
    href: "/Home/pages/search",

    image: "/img/DoctorsAppUIMockup.png",

    // Light left → stronger mint/blue right
    background:
      "linear-gradient(110deg, #F8FCFA 0%, #F3FAF8 28%, #E7F6F2 52%, #D1EBED 75%, #AED8E2 100%)",
  },

  {
    id: 3,

    label: "YOUR MEDICAL RECORDS",

    title: "Every record.",
    highlight: "Always with you.",

    description:
      "Prescriptions, reports and medical documents stay organized, secure and available whenever you need them.",

    features: [
      {
        icon: ClipboardList,
        text: "Prescriptions",
        color: "#079b72",
        background: "#DDF7EF",
      },
      {
        icon: FlaskConical,
        text: "Lab reports",
        color: "#168BE8",
        background: "#E4F1FF",
      },
      {
        icon: ShieldCheck,
        text: "Secure records",
        color: "#745BE7",
        background: "#EEE9FF",
      },
    ],

    button: "View Records",
    href: "/Home/pages/Login",

    image: "/img/jeevan-documents.svg",

    // Light cream left → stronger mint right
    background:
      "linear-gradient(110deg, #FFFCF8 0%, #FFF9F1 28%, #F7F8EE 52%, #DFF2E8 75%, #B6E2D2 100%)",
  },
];
/* ========================================
   FEATURE ITEM
======================================== */

function FeatureItem({ feature }) {
  const Icon = feature.icon;

  return (
    <div className="feature-item">
      <div
        className="feature-icon"
        style={{
          color: feature.color,
          background: feature.background,
        }}
      >
        <Icon size={23} strokeWidth={2} />
      </div>

      <span>{feature.text}</span>
    </div>
  );
}

/* ========================================
   SINGLE STICKY CARD
======================================== */

function StickyCard({ data }) {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);

  const router = useRouter();

  const [position, setPosition] = useState(null);

  useEffect(() => {
    const updatePosition = () => {
      const section = sectionRef.current;

      if (!section) return;

      const rect = section.getBoundingClientRect();

      const vh = window.innerHeight;

      /* SECTION NOT VISIBLE */

      if (rect.bottom <= 0 || rect.top >= vh) {
        setPosition(null);
        return;
      }

      setPosition({
        left: rect.left,

        width: rect.width,

        top: Math.max(0, rect.top),

        bottom: Math.max(0, vh - rect.bottom),
      });
    };

    const handleScroll = () => {
      if (frameRef.current !== null) return;

      frameRef.current = requestAnimationFrame(() => {
        updatePosition();

        frameRef.current = null;
      });
    };

    updatePosition();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);

      window.removeEventListener("resize", handleScroll);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="patient-section"
      style={{
        background: data.background,
      }}
    >
      {/* ========================================
          LEFT CONTENT
      ======================================== */}

      <div className="patient-content">
        <div className="patient-text">
          {/* LABEL */}

          <div className="patient-label-row">
            <span className="patient-label">{data.label}</span>

            <span className="label-line" />
          </div>

          {/* TITLE */}

          <h2 className="patient-title">
            {data.title}

            <br />

            <span className="patient-highlight">{data.highlight}</span>
          </h2>

          {/* DESCRIPTION */}

          <p className="patient-description">{data.description}</p>

          {/* FEATURES */}

          <div className="patient-features">
            {data.features.map((feature, index) => (
              <div className="feature-group" key={`${data.id}-${index}`}>
                <FeatureItem feature={feature} />

                {index < data.features.length - 1 && (
                  <div className="feature-divider" />
                )}
              </div>
            ))}
          </div>

          {/* BUTTON */}

          {data.button && (
            <button
              className="patient-button"
              onClick={() => router.push(data.href)}
            >
              {data.button}

              <span>↗</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================
          FIXED IMAGE
      ======================================== */}

      {position && (
        <div
          className="patient-fixed"
          style={{
            left: position.left,

            width: position.width,

            clipPath: `inset(
              ${position.top}px
              0px
              ${position.bottom}px
              0px
            )`,
          }}
        >
          <div className="patient-image">
            <Image
              src={data.image}
              alt={data.label}
              width={600}
              height={700}
              className="patient-img"
            />
          </div>
        </div>
      )}
    </section>
  );
}


export default function PatientStickySection() {
  return (
    <>
      <div className="patient-sections-wrapper">
        {sections.map((section) => (
          <StickyCard key={section.id} data={section} />
        ))}
      </div>

      <style jsx global>{`
        /* ========================================
           WRAPPER
        ======================================== */

        .patient-sections-wrapper {
          width: 100%;
          position: relative;
          padding: 16px 0;

          background-color: #ffffff;

          background-image:
            linear-gradient(
              90deg,
              rgba(7, 135, 106, 0.13) 0%,
              rgba(7, 135, 106, 0.04) 25%,
              rgba(255, 255, 255, 0.96) 45%,
              rgba(255, 255, 255, 0.96) 55%,
              rgba(7, 135, 106, 0.04) 75%,
              rgba(7, 135, 106, 0.13) 100%
            ),
            linear-gradient(
              135deg,
              rgba(7, 135, 106, 0.09) 0%,
              rgba(52, 211, 153, 0.035) 45%,
              rgba(255, 255, 255, 0.08) 100%
            ),
            linear-gradient(
              rgba(7, 135, 106, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(7, 135, 106, 0.1) 1px,
              transparent 1px
            );

          background-size:
            100% 100%,
            40px 40px,
            40px 40px,
            40px 40px;

          background-position:
            center,
            0 0,
            0 0,
            0 0;
        }

        /* ========================================
           SECTION
        ======================================== */

        .patient-section {
          position: relative;
          height: 500px;

          margin: 16px 74px;

          border-radius: 36px;
          border: 2px solid #07876a;

          box-sizing: border-box;
          overflow: hidden;
        }

        /* ========================================
           CONTENT
        ======================================== */

        .patient-content {
          position: relative;

          width: 100%;
          height: 100%;

          padding: 0 5%;

          display: flex;
          align-items: center;

          box-sizing: border-box;

          z-index: 4;
        }

        .patient-text {
          position: relative;

          width: 57%;

          z-index: 5;
        }

        /* ========================================
           LABEL
        ======================================== */

        .patient-label-row {
          display: flex;
          align-items: center;

          gap: 10px;

          margin-bottom: 18px;
        }

        .patient-label {
          font-size: 9px;

          font-weight: 700;

          letter-spacing: 2.4px;

          text-transform: uppercase;

          color: #15978d;
        }

        .label-line {
          width: 48px;
          height: 1px;

          background: #8caebd;
        }

        /* ========================================
           TITLE
        ======================================== */

        .patient-title {
          margin: 0;

          font-size: clamp(34px, 3.5vw, 44px);

          font-weight: 750;

          line-height: 1.05;

          letter-spacing: -2px;

          color: #11131d;
        }

        .patient-highlight {
          color: #079b72;
        }

        /* ========================================
           DESCRIPTION
        ======================================== */

        .patient-description {
          max-width: 520px;

          margin: 16px 0 0;

          font-size: 12px;

          line-height: 1.6;

          font-weight: 400;

          color: #737784;
        }

        /* ========================================
           FEATURES
        ======================================== */

        .patient-features {
          display: flex;

          align-items: center;

          margin-top: 24px;
        }

        .feature-group {
          display: flex;

          align-items: center;
        }

        .feature-item {
          display: flex;

          align-items: center;

          gap: 10px;
        }

        .feature-icon {
          width: 42px;
          height: 42px;

          flex-shrink: 0;

          border-radius: 50%;

          display: flex;

          align-items: center;

          justify-content: center;
        }

        .feature-icon svg {
          width: 20px;
          height: 20px;
        }

        .feature-item > span {
          width: 100px;

          font-size: 11px;

          line-height: 1.4;

          font-weight: 500;

          color: #343846;
        }

        .feature-divider {
          width: 1px;
          height: 32px;

          margin: 0 16px;

          background: #d9dee4;
        }

        /* ========================================
           BUTTON
        ======================================== */

        .patient-button {
          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 14px;

          margin-top: 22px;

          padding: 10px 18px;

          border: none;

          border-radius: 30px;

          background: #07876a;

          color: #ffffff;

          font-size: 11px;

          font-weight: 600;

          cursor: pointer;

          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .patient-button:hover {
          background: #056b54;

          transform: translateY(-2px);
        }

        .patient-button span {
          font-size: 14px;

          line-height: 1;
        }

        /* ========================================
           FIXED IMAGE
        ======================================== */

        .patient-fixed {
          position: fixed;

          top: 0;

          height: 100vh;

          z-index: 2;

          pointer-events: none;

          overflow: hidden;

          will-change: clip-path;
        }

        .patient-image {
          position: absolute;

          top: 5%;

          right: 4%;

          width: 40%;
          height: 100vh;

          display: flex;

          align-items: center;

          justify-content: center;
        }

        .patient-img {
          width: auto;

          height: 500px;

          max-width: 100%;

          object-fit: contain;

          display: block;
        }

        /* ========================================
           TABLET
        ======================================== */

        @media (max-width: 1100px) {
          .patient-section {
            height: 470px;

            margin: 14px 24px;

            border-radius: 30px;
          }

          .patient-content {
            padding: 0 4%;
          }

          .patient-text {
            width: 56%;
          }

          .patient-label-row {
            margin-bottom: 15px;
          }

          .patient-label {
            font-size: 8px;

            letter-spacing: 2px;
          }

          .patient-title {
            font-size: 36px;

            letter-spacing: -1.7px;
          }

          .patient-description {
            max-width: 440px;

            margin-top: 14px;

            font-size: 12px;
          }

          .patient-features {
            margin-top: 20px;
          }

          .feature-item {
            gap: 8px;
          }

          .feature-item > span {
            width: 84px;

            font-size: 10px;
          }

          .feature-icon {
            width: 38px;
            height: 38px;
          }

          .feature-icon svg {
            width: 18px;
            height: 18px;
          }

          .feature-divider {
            height: 28px;

            margin: 0 9px;
          }

          .patient-button {
            margin-top: 19px;

            padding: 9px 16px;

            font-size: 10px;
          }

          .patient-img {
            height: 340px;
          }
        }

        /* ========================================
           MOBILE
        ======================================== */

        @media (max-width: 768px) {
          .patient-section {
            height: 650px;

            margin: 12px;

            border-radius: 22px;

            border-width: 1.5px;
          }

          .patient-content {
            padding: 0 24px;

            align-items: flex-start;
          }

          .patient-text {
            width: 100%;

            padding-top: 38px;
          }

          .patient-label-row {
            gap: 8px;

            margin-bottom: 14px;
          }

          .patient-label {
            font-size: 8px;

            letter-spacing: 1.8px;
          }

          .label-line {
            width: 36px;
          }

          .patient-title {
            font-size: 30px;

            line-height: 1.08;

            letter-spacing: -1.3px;
          }

          .patient-description {
            max-width: 340px;

            margin-top: 12px;

            font-size: 11px;

            line-height: 1.55;
          }

          .patient-features {
            margin-top: 18px;

            gap: 10px;

            flex-wrap: wrap;
          }

          .feature-group {
            display: block;
          }

          .feature-item {
            gap: 7px;
          }

          .feature-icon {
            width: 34px;
            height: 34px;
          }

          .feature-icon svg {
            width: 16px;
            height: 16px;
          }

          .feature-item > span {
            width: auto;

            max-width: 78px;

            font-size: 9px;

            line-height: 1.35;
          }

          .feature-divider {
            display: none;
          }

          .patient-button {
            margin-top: 16px;

            padding: 8px 14px;

            gap: 10px;

            font-size: 10px;
          }

          .patient-button span {
            font-size: 13px;
          }

          .patient-image {
            width: 100%;

            right: 0;

            top: 145px;

            height: 100vh;

            align-items: center;
          }

          .patient-img {
            height: 250px;

            max-width: 85%;
          }
        }

        /* ========================================
           SMALL MOBILE
        ======================================== */

        @media (max-width: 480px) {
          .patient-section {
            height: 620px;

            margin: 10px;

            border-radius: 18px;
          }

          .patient-content {
            padding: 0 20px;
          }

          .patient-text {
            padding-top: 30px;
          }

          .patient-label-row {
            margin-bottom: 12px;
          }

          .patient-label {
            font-size: 7.5px;

            letter-spacing: 1.6px;
          }

          .patient-title {
            font-size: 27px;

            letter-spacing: -1px;
          }

          .patient-description {
            max-width: 300px;

            margin-top: 11px;

            font-size: 10.5px;
          }

          .patient-features {
            margin-top: 16px;

            gap: 9px;
          }

          .feature-icon {
            width: 32px;
            height: 32px;
          }

          .feature-icon svg {
            width: 15px;
            height: 15px;
          }

          .feature-item > span {
            font-size: 8.5px;

            max-width: 65px;
          }

          .patient-button {
            margin-top: 15px;

            padding: 8px 14px;

            font-size: 9.5px;
          }

          .patient-image {
            top: 155px;
          }

          .patient-img {
            height: 230px;

            max-width: 88%;
          }
        }
      `}</style>
    </>
  );
}
