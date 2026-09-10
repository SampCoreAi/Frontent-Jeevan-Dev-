"use client";

import { ArrowRight } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

const EntryDoctor = () => {
  const router = useRouter();

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#13483D] via-[#1E6658] to-[#2D8A76] transform -skew-y-3 scale-110"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Are you a doctor and want to join our platform?
        </h2>

        <p className="text-xl text-green-100 mb-10">
          Complete your onboarding in just a few steps.
        </p>

        <button
          onClick={() => router.push("/Home/pages/DoctorRegister")}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-[#1E6658] rounded-full font-semibold overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
        >
          <span className="absolute inset-0 bg-[#E8F5F2] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>

          <span className="relative z-10">Get Started</span>

          <ArrowRight
            className="relative z-10 group-hover:translate-x-2 transition-transform duration-300"
            size={20}
          />
        </button>
      </div>
    </section>
  );
};

export default EntryDoctor;