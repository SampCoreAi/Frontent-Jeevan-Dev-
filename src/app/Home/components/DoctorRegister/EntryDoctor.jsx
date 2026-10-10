"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Stethoscope,
  FlaskConical,
  Store,
  Users,
  CircleCheck,
  Sparkles,
  TrendingUp,
  Heart,
  BarChart3,
} from "lucide-react";

const platformData = [
  {
    number: "01",
    title: "For",
    highlight: "Doctors",
    description:
      "Connect with patients, manage appointments and grow your practice.",
    image: "/img/doctor-stethoscope.png",
    icon: Stethoscope,
    accent: "#087B68",
    darkAccent: "#056353",
    light: "#EAF9F4",
    imageBg: "#DDF6ED",
    features: [
      "Online & offline appointments",
      "Patient management",
      "Build your professional profile",
    ],
    bottomText: "Grow your impact",
    bottomIcon: Users,
    href: "/Home/pages/DoctorRegister",
  },

  {
    number: "02",
    title: "For",
    highlight: "Labs",
    description:
      "Register your lab, provide test services and reach more patients.",
    image: "/img/lab.png",
    icon: FlaskConical,
    accent: "#1764C0",
    darkAccent: "#074C9E",
    light: "#EEF6FF",
    imageBg: "#DDEEFF",
    features: [
      "Manage test bookings",
      "Upload reports easily",
      "Expand your reach",
    ],
    bottomText: "Serve more lives",
    bottomIcon: BarChart3,
    href: "/Home/pages/LabOnboarding",
  },

  {
    number: "03",
    title: "For",
    highlight: "Medical Stores",
    description:
      "List your medicines, manage orders and serve customers easily.",
    image: "/img/medical-store.png",
    icon: Store,
    accent: "#F05A0A",
    darkAccent: "#C94200",
    light: "#FFF4EA",
    imageBg: "#FFE7D3",
    features: [
      "Receive prescription orders",
      "Manage stock and pricing",
      "Build customer trust",
    ],
    bottomText: "Grow your business",
    bottomIcon: TrendingUp,
    href: "/Home/pages/MedicalStoreOnboarding",
  },

  {
    number: "04",
    title: "For",
    highlight: "Users",
    description:
      "Book appointments, order medicines, get lab tests and manage your health.",
    image: "/img/patient.png",
    icon: Users,
    accent: "#7147D9",
    darkAccent: "#5930BC",
    light: "#F6F1FF",
    imageBg: "#ECE3FF",
    features: [
      "Find trusted doctors",
      "Order medicines",
      "Access lab reports",
    ],
    bottomText: "Your health, our priority",
    bottomIcon: Heart,
    href: "/Home/pages/Register",
  },
];

export default function JoinPlatform() {
  const router = useRouter();

  return (
   <section className="relative overflow-hidden px-5 py-0 md:px-8 lg:py-4">

  {/* SAME BACKGROUND AS LANDING */}
  <div
    className="pointer-events-none absolute inset-0 z-0"
    style={{
      backgroundColor: "#FFFFFF",

      backgroundImage: `
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
          rgba(7, 135, 106, 0.10) 1px,
          transparent 1px
        ),

        linear-gradient(
          90deg,
          rgba(7, 135, 106, 0.10) 1px,
          transparent 1px
        )
      `,

      backgroundSize: `
        100% 100%,
        40px 40px,
        40px 40px,
        40px 40px
      `,

      backgroundPosition: `
        center,
        0 0,
        0 0,
        0 0
      `,
    }}
  />

  <div className="relative z-10 mx-auto max-w-[1180px]">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-[760px] text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#DDF7EC] px-5 py-2">
            <Sparkles size={14} className="text-[#087B68]" />

            <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#087B68]">
              Join our platform
            </span>
          </div>

          <h2 className="text-[36px] font-bold leading-[1.08] tracking-[-0.04em] text-[#14201D] sm:text-[44px] md:text-[52px]">
Be a Part of Our Growing
{" "}
            <span className="text-[#087B68]">Healthcare Community</span>
          </h2>

          <p className="mx-auto mt-5 max-w-[620px] text-[15px] leading-7 text-[#697470] md:text-[16px]">
            Whether you are a doctor, lab, medical store or a user,
            join our platform and be part of a connected healthcare ecosystem.
          </p>
        </div>

        {/* Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {platformData.map((item) => {
            const Icon = item.icon;
            const BottomIcon = item.bottomIcon;

            return (
              <article
  key={item.number}
  className="
    group relative overflow-hidden
    rounded-[26px] border border-white bg-white p-[3px]
    shadow-[0_14px_45px_rgba(25,72,59,0.07)]
    transition-all duration-500
    hover:-translate-y-1
    hover:shadow-[0_22px_55px_rgba(25,72,59,0.13)]
  "
>
  <div
    className="
      relative h-full overflow-hidden rounded-[23px]
      p-5 md:p-6
    "
    style={{
      background: `linear-gradient(135deg, #ffffff 10%, ${item.light} 100%)`,
    }}
  >
    {/* Number */}
    <div className="mb-4 flex items-center gap-2">
      <span
        className="text-[11px] font-semibold tracking-[0.08em]"
        style={{ color: item.accent }}
      >
        {item.number}
      </span>

      <span
        className="h-px w-8 opacity-30"
        style={{ backgroundColor: item.accent }}
      />
    </div>

    {/* MAIN CONTENT */}
    <div className="grid grid-cols-1 gap-5 md:grid-cols-[42%_1fr] md:gap-7">
      
      {/* ================= IMAGE SIDE ================= */}
      <div
        className="
          relative min-h-[230px] overflow-hidden
          rounded-[22px]
          md:min-h-[280px]
        "
        style={{
          background: `linear-gradient(
            145deg,
            ${item.imageBg},
            rgba(255,255,255,0.95)
          )`,
        }}
      >
        {/* Icon */}
        <div
          className="
            absolute left-4 top-4 z-20
            flex h-11 w-11 items-center justify-center
            rounded-full border border-white/80
            bg-white/80 shadow-sm backdrop-blur-md
          "
        >
          <Icon
            size={21}
            strokeWidth={2}
            style={{ color: item.accent }}
          />
        </div>

        {/* Background circle */}
        <div
          className="
            absolute -bottom-16 -right-16
            h-[230px] w-[230px] rounded-full opacity-60
          "
          style={{
            backgroundColor: item.imageBg,
          }}
        />

        {/* Small decorative circle */}
        <div
          className="
            absolute right-5 top-5
            h-2.5 w-2.5 rounded-full opacity-50
          "
          style={{
            backgroundColor: item.accent,
          }}
        />

        {/* Person / Role Image */}
        <img
          src={item.image}
          alt={item.highlight}
          className="
            absolute bottom-0 left-1/2 z-10
            h-[92%] w-[95%]
            -translate-x-1/2
            object-contain object-bottom
            transition-transform duration-500
            group-hover:scale-[1.035]
          "
        />
      </div>

      {/* ================= CONTENT SIDE ================= */}
      <div className="flex flex-col py-1">
        
        {/* Title */}
        <h3
          className="
            text-[28px] font-semibold
            leading-[0.98]
            tracking-[-0.04em]
            text-[#17211F]
            lg:text-[31px]
          "
        >
          {item.title}

          <span
            className="block"
            style={{
              color: item.darkAccent,
              fontWeight:700
            }}
          >
            {item.highlight}
          </span>
        </h3>

        {/* Description */}
        <p
          className="
            mt-4 max-w-[330px]
            text-[13px] leading-[1.65]
            text-[#66706D]
          "
        >
          {item.description}
        </p>

        {/* Divider */}
        <div className="my-4 h-px w-full bg-black/[0.06]" />

        {/* Features */}
        <div className="space-y-2.5">
          {item.features.map((feature) => (
            <div
              key={feature}
              className="flex items-start gap-2.5"
            >
              <CircleCheck
                size={16}
                strokeWidth={2.3}
                className="mt-[2px] shrink-0"
                style={{
                  color: item.accent,
                }}
              />

              <span
                className="
                  text-[12px] leading-5
                  text-[#596561]
                "
              >
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* ================= BOTTOM ================= */}
        <div
          className="
            mt-auto flex items-center
            justify-between gap-4 pt-6
          "
        >
          {/* Arrow Button */}
          <button
            type="button"
            onClick={() => router.push(item.href)}
            aria-label={`Continue as ${item.highlight}`}
            className="
              flex h-[46px] w-[46px]
              shrink-0 items-center justify-center
              rounded-full text-white
              shadow-[0_8px_20px_rgba(0,0,0,0.10)]
              transition-all duration-300
              hover:scale-105
              active:scale-95
            "
            style={{
              background: `linear-gradient(
                135deg,
                ${item.accent},
                ${item.darkAccent}
              )`,
            }}
          >
            <ArrowRight
              size={19}
              className="
                transition-transform duration-300
                group-hover:translate-x-[2px]
              "
            />
          </button>

          {/* Bottom Label */}
          <div className="flex items-center gap-2.5">
            <div
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-full border bg-white/70
                backdrop-blur-sm
              "
              style={{
                borderColor: `${item.accent}25`,
                color: item.accent,
              }}
            >
              <BottomIcon size={17} />
            </div>

            <span
              className="
                max-w-[90px]
                text-[11px] font-medium
                italic leading-[1.25]
              "
              style={{
                color: item.accent,
              }}
            >
              {item.bottomText}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Top right glow */}
    <div
      className="
        pointer-events-none
        absolute -right-16 -top-16
        h-[160px] w-[160px]
        rounded-full opacity-0 blur-3xl
        transition-opacity duration-500
        group-hover:opacity-25
      "
      style={{
        backgroundColor: item.accent,
      }}
    />
  </div>
</article>
            );
          })}
        </div>
      </div>
    </section>
  );
}