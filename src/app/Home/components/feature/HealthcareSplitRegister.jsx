"use client";

import Link from "next/link";
import {
  Stethoscope,
  FlaskConical,
  Store,
  Users,
  CircleCheck,
  TrendingUp,
} from "lucide-react";

const roles = [
  {
    key: "doctor",
    title: "Doctors",
    image: "/img/doctor-stethoscope.png",
    icon: Stethoscope,
    color: "#087B68",
    light: "#EAF9F4",
    imageBg: "#DDF6ED",
    features: [
      "Online & offline appointments",
      "Patient management",
      "Build your professional profile",
    ],
    tagline: "Grow your impact",
    bottomIcon: Users,
  },
  {
    key: "lab",
    title: "Labs",
    image: "/img/lab.png",
    icon: FlaskConical,
    color: "#1764C0",
    light: "#EEF6FF",
    imageBg: "#DDEEFF",
    features: [
      "Manage test bookings",
      "Upload reports easily",
      "Expand your reach",
    ],
    tagline: "Serve more lives",
    bottomIcon: TrendingUp,
  },
  {
    key: "pharmacy",
    title: "Medical Stores",
    image: "/img/medical-store.png",
    icon: Store,
    color: "#F05A0A",
    light: "#FFF4EA",
    imageBg: "#FFE7D3",
    features: [
      "Receive prescription orders",
      "Manage stock and pricing",
      "Build customer trust",
    ],
    tagline: "Grow your business",
    bottomIcon: TrendingUp,
  },
];

export default function HealthcareSplitRegister({
  hrefs = {
    doctor: "/doctor/register",
    lab: "/lab/register",
    pharmacy: "/pharmacy/register",
  },
}) {
  return (
    <section className="join-section">
      <div className="join-cards">
        {roles.map((role) => {
          const Icon = role.icon;
          const BottomIcon = role.bottomIcon;

          return (
            <article
              className="join-card"
              key={role.key}
              style={{
                "--role-color": role.color,
                "--role-light": role.light,
                "--image-bg": role.imageBg,
              }}
            >
              <div className="join-image">
                <span className="join-role-icon">
                  <Icon size={22} />
                </span>
                <span className="join-dot" />
                <div className="join-image-circle" />
                <img src={role.image} alt={role.title} />
              </div>

              <h3>
                <span>For</span>
                <strong>{role.title}</strong>
              </h3>

              <div className="join-divider" />

              <ul>
                {role.features.map((feature) => (
                  <li key={feature}>
                    <CircleCheck size={19} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="join-bottom">
                <Link
                  href={hrefs[role.key]}
                  className="join-button"
                  aria-label={`Register as ${role.title}`}
                >
                  <span>→</span>
                </Link>

                <div className="join-tagline">
                  <span className="join-tag-icon">
                    <BottomIcon size={19} />
                  </span>
                  <em>{role.tagline}</em>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <style jsx>{`
        .join-section {
          overflow: hidden;
          padding: 14px 24px;
          background-color: #f8fbf9;
          background-image:
            linear-gradient(rgba(7, 135, 106, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(7, 135, 106, 0.08) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .join-cards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 350px));
          justify-content: center;
          gap: 24px;
          max-width: 1122px;
          margin: 0 auto;
        }

        .join-card {
          display: flex;
          min-height: 680px;
          flex-direction: column;
          padding: 28px;
          overflow: hidden;
          border: 1.5px solid color-mix(in srgb, var(--role-color) 55%, white);
          border-radius: 30px;
          background: linear-gradient(155deg, #fff 8%, var(--role-light) 100%);
          box-shadow: 0 14px 35px rgba(23, 32, 51, 0.07);
        }

        .join-image {
          position: relative;
          display: flex;
          height: 288px;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 27px;
          background: var(--image-bg);
        }

        .join-image-circle {
          position: absolute;
          right: -35px;
          bottom: -95px;
          width: 245px;
          height: 245px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.48);
        }

        .join-image img {
          position: relative;
          z-index: 1;
          width: 94%;
          height: 88%;
          object-fit: contain;
          object-position: center bottom;
        }

        .join-role-icon {
          position: absolute;
          z-index: 2;
          top: 20px;
          left: 20px;
          display: grid;
          width: 56px;
          height: 56px;
          place-items: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          color: var(--role-color);
          box-shadow: 0 2px 8px rgba(23, 32, 51, 0.08);
        }

        .join-dot {
          position: absolute;
          top: 24px;
          right: 24px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--role-color);
          opacity: 0.5;
        }

        .join-card h3 {
          margin: 28px 0 20px;
          color: #17211f;
          font-size: 34px;
          line-height: 0.98;
          letter-spacing: -0.04em;
        }

        .join-card h3 span,
        .join-card h3 strong {
          display: block;
        }

        .join-card h3 strong {
          margin-top: 2px;
          color: var(--role-color);
          font-weight: 750;
        }

        .join-divider {
          height: 1px;
          background: rgba(23, 32, 51, 0.1);
        }

        .join-card ul {
          display: grid;
          gap: 17px;
          margin: 22px 0 0;
          padding: 0;
          color: #596561;
          list-style: none;
        }

        .join-card li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
        }

        .join-card li svg {
          flex: 0 0 auto;
          color: var(--role-color);
        }

        .join-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: auto;
          padding-top: 26px;
        }

        .join-button {
          display: grid;
          width: 56px;
          height: 56px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 50%;
          background: var(--role-color);
          color: white;
          font-size: 30px;
          line-height: 1;
          text-decoration: none;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
          transition: transform 180ms ease;
        }

        .join-button:hover {
          transform: translateX(3px);
        }

        .join-tagline {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--role-color);
        }

        .join-tag-icon {
          display: grid;
          width: 46px;
          height: 46px;
          flex: 0 0 auto;
          place-items: center;
          border: 1px solid color-mix(in srgb, var(--role-color) 22%, white);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.72);
        }

        .join-tagline em {
          max-width: 112px;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.25;
        }

        @media (max-width: 900px) {
          .join-cards {
            display: flex;
            justify-content: flex-start;
            gap: 18px;
            overflow-x: auto;
            padding: 0 0 12px;
            scroll-snap-type: x mandatory;
          }

          .join-card {
            width: min(350px, 88vw);
            min-width: min(350px, 88vw);
            scroll-snap-align: center;
          }
        }

        @media (max-width: 420px) {
          .join-section {
            padding: 14px 12px;
          }

          .join-card {
            min-height: 660px;
            padding: 24px;
          }

          .join-image {
            height: 280px;
          }
        }
      `}</style>
    </section>
  );
}