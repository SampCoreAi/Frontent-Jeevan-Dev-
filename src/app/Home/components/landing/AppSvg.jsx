"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const AppSvg = () => {
  const sectionRef = useRef(null);
  const [offset, setOffset] = useState(150);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const isInView = rect.top < windowHeight && rect.bottom > 0;
      setIsVisible(isInView);

      const centerY = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const distance = viewportCenter - centerY;
      const clampedDistance = Math.min(Math.max(distance, -200), 200);
      const progress = (clampedDistance + 200) / 400;
      const easedProgress = easeInOut(progress);
      const newOffset = 500 * (1 - easedProgress);

      setOffset(newOffset);
    };

    const easeInOut = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    handleScroll();

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Mobile stacked layout
  if (isMobile) {
    return (
      <div
        ref={sectionRef}
        className="flex flex-col items-center min-h-screen py-8 px-4 overflow-hidden"
      >
        {/* Header */}
        <div className="text-center w-full max-w-md">
          <h2 className="text-3xl font-extrabold leading-tight">
            Your Healthcare{" "}
            <span className="text-[#1e6658]">In Your Pocket</span>
          </h2>

          <div className="mt-5 rounded-2xl bg-[#e1f5ef] px-4 py-4">
            <p className="text-sm text-gray-600">
              Download our app from the Google Play Store and manage your
              healthcare anytime, anywhere.
            </p>

            <div className="mt-6 flex justify-center">
              <a
                href="https://play.google.com/store/apps"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/img/google-play-badge.png"
                  alt="Get it on Google Play"
                  width={150}
                  height={45}
                  className="transition-transform duration-300 hover:scale-105"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Image Stack */}
        <div className="flex flex-col items-center gap-6 mt-8 w-full max-w-xs">
          <div className="w-full flex flex-col items-center">
            <Image
              src="/svg/DocumentPage.svg"
              alt="Document"
              width={180}
              height={180}
              className="hover:scale-105 transition-transform duration-300"
            />
            <p className="text-xs text-gray-500 mt-1">Document</p>
          </div>

          <div className="w-full flex flex-col items-center">
            <Image
              src="/svg/HomePage.svg"
              alt="Home"
              width={180}
              height={180}
              className="hover:scale-105 transition-transform duration-300"
            />
            <p className="text-xs text-gray-500 mt-1">Home</p>
          </div>

          <div className="w-full flex flex-col items-center">
            <Image
              src="/svg/DoctorPage.svg"
              alt="Doctor"
              width={180}
              height={180}
              className="hover:scale-105 transition-transform duration-300"
            />
            <p className="text-xs text-gray-500 mt-1">Doctor</p>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout (original)
  return (
    <div
      ref={sectionRef}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        paddingTop: "40px",
        paddingBottom: "60px",
      }}
    >
      {/* Desktop header */}
      <div
        className="text-center"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: `translateY(${isVisible ? 0 : 20}px)`,
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        }}
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
          Your Healthcare{" "}
          <span className="text-[#1e6658]">In Your Pocket</span>
        </h2>

        <div className="mt-5 max-w-2xl mx-auto rounded-2xl bg-[#e1f5ef] px-6 py-4">
          <p className="text-base md:text-lg text-gray-600">
            Download our app from the Google Play Store and manage your
            healthcare anytime, anywhere.
          </p>

          <div className="mt-8 flex justify-center">
            <a
              href="https://play.google.com/store/apps"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/img/google-play-badge.png"
                alt="Get it on Google Play"
                width={180}
                height={54}
                className="transition-transform duration-300 hover:scale-105"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Desktop images - horizontal */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        <div
          className="flex flex-col items-center"
          style={{
            transform: `translateY(${offset + 100}px)`,
            opacity: isVisible ? 1 : 0,
            transition:
              "transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease-out",
          }}
        >
          <Image
            src="/svg/DocumentPage.svg"
            alt="Document"
            width={300}
            height={300}
            className="hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div
          className="relative inline-block"
          style={{
            transform: `translateY(100px) scale(${isVisible ? 1 : 0.95})`,
            transition: "transform 0.6s ease-out",
          }}
        >
          <Image
            src="/svg/HomePage.svg"
            alt="Home"
            width={300}
            height={300}
            className="hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div
          style={{
            transform: `translateY(${offset + 100}px)`,
            transition: "transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            opacity: isVisible ? 1 : 0,
          }}
        >
          <Image
            src="/svg/DoctorPage.svg"
            alt="Doctor"
            width={300}
            height={300}
            className="hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default AppSvg;