"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const roles = [
  {
    key: "doctor",
    title: "For Doctors",
    color: "#07876A",
    tint: "#EAF8F4",
    features: [
      "Online & offline appointments",
      "Patient management",
      "Build your professional profile",
    ],
    tagline: "Grow your impact",
  },
  {
    key: "lab",
    title: "For Labs",
    color: "#1764BC",
    tint: "#EEF5FF",
    features: [
      "Manage test bookings",
      "Upload reports easily",
      "Expand your reach",
    ],
    tagline: "Serve more lives",
  },
  {
    key: "pharmacy",
    title: "For Medical Stores",
    color: "#E9530D",
    tint: "#FFF3EA",
    features: [
      "Receive prescription orders",
      "Manage stock and pricing",
      "Build customer trust",
    ],
    tagline: "Grow your business",
  },
];

export default function HealthcareSplitRegister({
  imageSrc = "/images/healthcare-team.jpg",
  hrefs = {
    doctor: "/doctor/register",
    lab: "/lab/register",
    pharmacy: "/pharmacy/register",
  },
}) {
  const sectionRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.35,
  });

  useMotionValueEvent(smoothProgress, "change", (value) => {
    setRevealed(value > 0.72);
  });

  return (
    <section ref={sectionRef} className="health-join">
      <div className="health-join__sticky">
        <header className="health-join__header">
          <span>JEEVAN DEV NETWORK</span>
          <h2>Healthcare, connected.</h2>
          <p>Choose your role and join our growing care network.</p>
        </header>

        <div className="health-join__stage">
          {roles.map((role, index) => {
            const shift = [-22, 0, 22][index];

            const x = useTransform(
              smoothProgress,
              [0, 0.32, 0.58, 1],
              [0, shift, shift, shift]
            );

            const rotateY = useTransform(
              smoothProgress,
              [0, 0.34, 0.72, 1],
              [0, 0, 180, 180]
            );

            return (
              <motion.div
                key={role.key}
                className="health-join__panel"
                data-index={index}
                style={{
                  x,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="health-join__front"
                  style={{
                    backgroundImage: `url("${imageSrc}")`,
                    backgroundSize: "300% 100%",
                    backgroundPosition: `${index * 50}% center`,
                    backgroundRepeat: "no-repeat",
                  }}
                  aria-hidden="true"
                />

                <div
                  className="health-join__back"
                  style={{
                    "--role-color": role.color,
                    "--role-tint": role.tint,
                  }}
                  aria-hidden={!revealed}
                >
                  <span className="health-join__number">
                    0{index + 1}
                  </span>

                  <h3>{role.title}</h3>

                  <ul>
                    {role.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>

                  <p className="health-join__tagline">
                    {role.tagline}
                  </p>

                  <Link
                    href={hrefs[role.key]}
                    className="health-join__button"
                    tabIndex={revealed ? 0 : -1}
                  >
                    Register <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="health-join__hint">
          {revealed ? "Choose your role to register" : "Scroll to explore"}
          <span aria-hidden="true"> ↓</span>
        </p>
      </div>

      <style jsx global>{`
        .health-join {
          position: relative;
          height: 190vh;
          color: #172033;
          background: #f8faf9;
        }

        .health-join__sticky {
          position: sticky;
          top: 0;
          display: flex;
          height: 100vh;
          min-height: 560px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 32px 24px;
        }

        .health-join__header {
          margin-bottom: 28px;
          text-align: center;
        }

        .health-join__header span {
          color: #07876a;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
        }

        .health-join__header h2 {
          margin: 10px 0 6px;
          font-size: clamp(28px, 4vw, 48px);
          letter-spacing: -0.04em;
        }

        .health-join__header p,
        .health-join__hint {
          color: #66736e;
          font-size: 14px;
        }

        .health-join__stage {
          position: relative;
          display: flex;
          width: min(100%, 1080px);
          height: clamp(320px, 54vh, 540px);
          gap: 0;
          perspective: 1400px;
        }

        .health-join__panel {
          position: relative;
          flex: 0 0 33.3333%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .health-join__front,
        .health-join__back {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border: 0;
          border-radius: 24px;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .health-join__front {
          background-repeat: no-repeat;
          box-shadow: none;
        }

        .health-join__back {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: clamp(14px, 3vw, 34px);
          transform: rotateY(180deg);
          border: 1px solid
            color-mix(in srgb, var(--role-color) 35%, white);
          background: var(--role-tint);
          box-shadow: 0 18px 50px #17203312;
        }

        .health-join__number {
          color: var(--role-color);
          font-size: 12px;
          font-weight: 700;
        }

        .health-join__back h3 {
          margin: 12px 0 6px;
          color: var(--role-color);
          font-size: clamp(16px, 2.2vw, 28px);
          line-height: 1.15;
        }

        .health-join__back ul {
          display: grid;
          gap: 8px;
          margin: 12px 0;
          padding: 0;
          color: #56635e;
          font-size: clamp(9px, 1.1vw, 13px);
          line-height: 1.45;
          list-style: none;
        }

        .health-join__back li::before {
          content: "✓";
          margin-right: 7px;
          color: var(--role-color);
          font-weight: 700;
        }

        .health-join__tagline {
          margin: 4px 0 18px;
          color: var(--role-color);
          font-size: 12px;
          font-style: italic;
        }

        .health-join__button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 9px;
          background: var(--role-color);
          color: #fff;
          font-size: clamp(10px, 1.1vw, 14px);
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: transform 180ms ease, filter 180ms ease;
        }

        .health-join__button:hover {
          filter: brightness(0.92);
          transform: translateY(-2px);
        }

        .health-join__panel[data-index="0"] .health-join__front,
        .health-join__panel[data-index="0"] .health-join__back {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        .health-join__panel[data-index="1"] .health-join__front,
        .health-join__panel[data-index="1"] .health-join__back {
          border-radius: 0;
        }

        .health-join__panel[data-index="2"] .health-join__front,
        .health-join__panel[data-index="2"] .health-join__back {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }

        .health-join__hint {
          margin-top: 22px;
        }

        @media (max-width: 600px) {
          .health-join__sticky {
            min-height: 500px;
            padding-inline: 14px;
          }

          .health-join__stage {
            height: 340px;
          }

          .health-join__front,
          .health-join__back {
            border-radius: 14px;
          }

          .health-join__back {
            padding: 10px;
          }

          .health-join__back ul {
            gap: 5px;
            font-size: 9px;
          }

          .health-join__tagline {
            margin-bottom: 12px;
            font-size: 10px;
          }

          .health-join__button {
            gap: 4px;
            padding: 8px;
          }
        }
      `}</style>
    </section>
  );
}