
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Heart,
  MessageCircleHeart,
  HandHeart,
  Lightbulb,
  CircleAlert,
  Sparkles,
  Send,
  Check,
} from "lucide-react";

export default function FeedbackCTA() {
  const router = useRouter();
  const timerRef = useRef(null);

  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [feedback, setFeedback] = useState({
    type: "Feedback",
    message: "",
  });

  // =========================================================
  // CLEAN TIMER
  // =========================================================
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // =========================================================
  // OPEN FORM
  // =========================================================
  const handleOpenFeedback = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setShowSuccess(false);
    setShowFeedbackForm(true);
  };

  // =========================================================
  // CLOSE FORM
  // =========================================================
  const handleCloseFeedback = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setShowSuccess(false);
    setShowFeedbackForm(false);

    setFeedback({
      type: "Feedback",
      message: "",
    });
  };

  // =========================================================
  // SUBMIT
  // =========================================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!feedback.message.trim()) return;

    console.log("Feedback:", feedback);

    // Backend API baad me yahan connect karna.
    // Success screen ideally API success ke baad show karna.

    setShowSuccess(true);

    setFeedback({
      type: "Feedback",
      message: "",
    });

    timerRef.current = setTimeout(() => {
      setShowSuccess(false);
      setShowFeedbackForm(false);
    }, 3000);
  };

  return (
    <section className="relative w-full overflow-hidden px-5 py-10 md:px-8 lg:py-12">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundColor: "#FFFFFF",
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(7,135,106,0.13) 0%,
              rgba(7,135,106,0.04) 25%,
              rgba(255,255,255,0.96) 45%,
              rgba(255,255,255,0.96) 55%,
              rgba(7,135,106,0.04) 75%,
              rgba(7,135,106,0.13) 100%
            ),
            linear-gradient(
              135deg,
              rgba(7,135,106,0.09) 0%,
              rgba(52,211,153,0.035) 45%,
              rgba(255,255,255,0.08) 100%
            ),
            linear-gradient(
              rgba(7,135,106,0.10) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(7,135,106,0.10) 1px,
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

      {/* =====================================================
          MAIN CARD
      ====================================================== */}
      <div
        className="
          relative z-10
          mx-auto
          max-w-[1180px]
          overflow-hidden
          rounded-[28px]
          border border-[#DDEBE6]
          bg-white
          shadow-[0_16px_45px_rgba(24,72,59,0.07)]
        "
      >
        {/* INNER BACKGROUND */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(
                circle at 73% 50%,
                rgba(7,135,106,0.13) 0%,
                rgba(7,135,106,0.055) 24%,
                transparent 48%
              ),
              linear-gradient(
                115deg,
                #FFFFFF 0%,
                #FFFFFF 43%,
                #F6FBF9 68%,
                #EAF7F2 100%
              )
            `,
          }}
        />

        {/* DECORATIVE CIRCLE */}
        <div
          className="
            pointer-events-none
            absolute
            -right-[130px]
            -top-[170px]
            h-[380px]
            w-[380px]
            rounded-full
            border border-[#07876A]/10
          "
        />

        {/* =====================================================
            CONTENT GRID
        ====================================================== */}
        <div
          className="
            relative z-10
            grid
            min-h-[390px]
            grid-cols-1
            lg:grid-cols-[48%_52%]
          "
        >
          {/* =====================================================
              LEFT
          ====================================================== */}
          <div
            className="
              flex flex-col justify-center
              px-7 py-8
              sm:px-9
              md:px-10
              lg:px-12
              lg:py-9
            "
          >
            {/* BADGE */}
            <div
              className="
                mb-4
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                border border-[#D8E7E2]
                bg-white/90
                px-3
                py-1.5
                shadow-sm
              "
            >
              <Heart
                size={11}
                fill="#07876A"
                className="text-[#07876A]"
              />

              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-[#07876A]
                "
              >
                Your feedback matters
              </span>
            </div>

            {/* HEADING */}
            <h2
              className="
                max-w-[480px]
                text-[30px]
                font-bold
                leading-[1.02]
                tracking-[-0.04em]
                text-[#172033]
                sm:text-[34px]
                md:text-[38px]
                lg:text-[42px]
              "
            >
              Your feedback
              <span className="block text-[#07876A]">
                helps us grow.
              </span>
            </h2>

            {/* COPY */}
            <div
              className="
                mt-5
                space-y-0.5
                text-[12px]
                leading-[1.6]
                text-[#64748B]
              "
            >
              <p>
                See something you like?{" "}
                <strong className="font-semibold text-[#172033]">
                  Let us know.
                </strong>
              </p>

              <p>
                Found something that&apos;s not working?{" "}
                <strong className="font-semibold text-[#172033]">
                  Tell us.
                </strong>
              </p>

              <p>
                Have an idea that could make Jeevan Dev better?{" "}
                <strong className="font-semibold text-[#172033]">
                  We&apos;d love to hear it.
                </strong>
              </p>
            </div>

            {/* SUPPORTING TEXT */}
            <p
              className="
                mt-4
                max-w-[470px]
                text-[11px]
                leading-[1.6]
                text-[#74807B]
              "
            >
              Every suggestion helps us understand what matters to you and
              build a simpler, more connected healthcare experience for
              everyone.
            </p>

            {/* =====================================================
                BUTTONS
            ====================================================== */}
            <div
              className="
                mt-5
                grid
                max-w-[500px]
                grid-cols-1
                gap-2.5
                sm:grid-cols-2
              "
            >
              {/* FEEDBACK BUTTON */}
              <button
                type="button"
                onClick={handleOpenFeedback}
                className="
                  group
                  flex
                  min-h-[62px]
                  items-center
                  gap-3
                  rounded-[15px]
                  bg-[#07876A]
                  px-4
                  text-left
                  text-white
                  shadow-[0_8px_22px_rgba(7,135,106,0.16)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#066F58]
                  hover:shadow-[0_12px_28px_rgba(7,135,106,0.22)]
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-[#07876A]
                  "
                >
                  <MessageCircleHeart size={16} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-bold">
                    I have Feedback
                  </p>

                  <p className="mt-0.5 text-[9.5px] text-white/70">
                    Share your thoughts
                  </p>
                </div>

                <ArrowRight
                  size={15}
                  className="
                    shrink-0
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </button>

           
            </div>
          </div>

          {/* =====================================================
              RIGHT DESKTOP
          ====================================================== */}
          <div
            className="
              relative
              hidden
              min-h-[390px]
              overflow-hidden
              lg:flex
              lg:items-center
              lg:justify-center
            "
          >
            {/* =================================================
                NORMAL IMAGE STATE
            ================================================== */}
            {!showFeedbackForm ? (
              <>
                {/* GLOW */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    h-[320px]
                    w-[320px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-[#D9F3E9]/65
                    blur-[60px]
                  "
                />

                {/* RING */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    h-[290px]
                    w-[290px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    border border-[#07876A]/10
                  "
                />

                {/* TOP LEFT */}
                <div
                  className="
                    absolute
                    left-[5%]
                    top-[12%]
                    z-20
                    -rotate-[4deg]
                    rounded-[14px]
                    border border-[#DFEBE7]
                    bg-white/95
                    px-3
                    py-2
                    shadow-[0_6px_16px_rgba(23,32,51,0.06)]
                  "
                >
                  <div className="flex items-center gap-1.5">
                    <Heart
                      size={11}
                      fill="#17A77C"
                      className="text-[#17A77C]"
                    />

                    <span className="text-[10px] font-semibold text-[#172033]">
                      Something you like?
                    </span>
                  </div>
                </div>

                {/* TOP RIGHT */}
                <div
                  className="
                    absolute
                    right-[5%]
                    top-[13%]
                    z-20
                    rotate-[3deg]
                    rounded-[14px]
                    border border-[#DFEBE7]
                    bg-white/95
                    px-3
                    py-2
                    shadow-[0_6px_16px_rgba(23,32,51,0.06)]
                  "
                >
                  <div className="flex items-center gap-1.5">
                    <CircleAlert
                      size={11}
                      className="text-[#F5A623]"
                    />

                    <span className="text-[10px] font-semibold text-[#172033]">
                      Found a problem?
                    </span>
                  </div>
                </div>

                {/* MIDDLE LEFT */}
                <div
                  className="
                    absolute
                    left-[2%]
                    top-[45%]
                    z-20
                    -rotate-[3deg]
                    rounded-[14px]
                    border border-[#DFEBE7]
                    bg-white/95
                    px-3
                    py-2
                    shadow-[0_6px_16px_rgba(23,32,51,0.06)]
                  "
                >
                  <div className="flex items-center gap-1.5">
                    <Sparkles
                      size={11}
                      className="text-[#F5A623]"
                    />

                    <span className="text-[10px] font-semibold text-[#172033]">
                      Have suggestions?
                    </span>
                  </div>
                </div>

                {/* MIDDLE RIGHT */}
                <div
                  className="
                    absolute
                    right-[2%]
                    top-[45%]
                    z-20
                    rotate-[3deg]
                    rounded-[14px]
                    border border-[#DFEBE7]
                    bg-white/95
                    px-3
                    py-2
                    shadow-[0_6px_16px_rgba(23,32,51,0.06)]
                  "
                >
                  <div className="flex items-center gap-1.5">
                    <MessageCircleHeart
                      size={11}
                      className="text-[#745BE7]"
                    />

                    <span className="text-[10px] font-semibold text-[#172033]">
                      We&apos;d love to hear them!
                    </span>
                  </div>
                </div>

                {/* IMAGE */}
                <img
                  src="/img/feedback-doctor.png"
                  alt="Jeevan Dev feedback"
                  className="
                    relative
                    z-10
                    mt-5
                    max-h-[285px]
                    w-[70%]
                    max-w-[390px]
                    object-contain
                    object-center
                  "
                />

                {/* BOTTOM MESSAGE */}
                <div
                  className="
                    absolute
                    bottom-[6%]
                    left-1/2
                    z-20
                    -translate-x-1/2
                    -rotate-2
                    whitespace-nowrap
                    rounded-full
                    border border-[#CFE9DF]
                    bg-[#E8F7F2]/95
                    px-4
                    py-2
                    shadow-sm
                  "
                >
                  <div className="flex items-center gap-1.5">
                    <Lightbulb
                      size={12}
                      className="text-[#07876A]"
                    />

                    <span className="text-[10px] font-semibold text-[#07876A]">
                      Help us make healthcare better
                    </span>

                    <Heart
                      size={11}
                      className="text-[#07876A]"
                    />
                  </div>
                </div>
              </>
            ) : showSuccess ? (
              /* =================================================
                  SUCCESS STATE
              ================================================== */
              <div
                className="
                  relative
                  z-20
                  flex
                  w-full
                  max-w-[510px]
                  flex-col
                  items-center
                  justify-center
                  px-8
                  py-8
                  text-center
                "
              >
                {/* SUCCESS ICON */}
                <div
                  className="
                    relative
                    flex
                    h-[96px]
                    w-[96px]
                    items-center
                    justify-center
                  "
                >
                  {/* OUTER PULSE */}
                  <div
                    className="
                      absolute
                      h-[90px]
                      w-[90px]
                      animate-ping
                      rounded-full
                      bg-[#07876A]/10
                    "
                  />

                  {/* SOFT CIRCLE */}
                  <div
                    className="
                      absolute
                      h-[76px]
                      w-[76px]
                      animate-pulse
                      rounded-full
                      bg-[#DFF4ED]
                    "
                  />

                  {/* CHECK */}
                  <div
                    className="
                      relative
                      z-10
                      flex
                      h-[58px]
                      w-[58px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#07876A]
                      shadow-[0_10px_30px_rgba(7,135,106,0.24)]
                      transition-all
                      duration-500
                    "
                  >
                    <Check
                      size={28}
                      strokeWidth={3}
                      className="text-white"
                    />
                  </div>
                </div>

                {/* TITLE */}
                <h3
                  className="
                    mt-4
                    text-[22px]
                    font-bold
                    tracking-[-0.03em]
                    text-[#172033]
                  "
                >
                  Feedback submitted!
                </h3>

                {/* DESCRIPTION */}
                <p
                  className="
                    mt-2
                    max-w-[350px]
                    text-[11px]
                    leading-[1.7]
                    text-[#74807B]
                  "
                >
                  Thank you for sharing your thoughts with us. Your feedback
                  helps us make Jeevan Dev better for everyone.
                </p>

                {/* THANK YOU CHIP */}
                <div
                  className="
                    mt-4
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-[#D4EAE2]
                    bg-[#ECF8F4]
                    px-3.5
                    py-2
                  "
                >
                  <Heart
                    size={11}
                    fill="#07876A"
                    className="text-[#07876A]"
                  />

                  <span className="text-[9.5px] font-semibold text-[#07876A]">
                    We appreciate your feedback
                  </span>
                </div>

                {/* LOADING DOTS */}
                <div className="mt-5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#07876A]" />

                  <span
                    className="
                      h-1.5
                      w-1.5
                      animate-bounce
                      rounded-full
                      bg-[#07876A]
                      [animation-delay:150ms]
                    "
                  />

                  <span
                    className="
                      h-1.5
                      w-1.5
                      animate-bounce
                      rounded-full
                      bg-[#07876A]
                      [animation-delay:300ms]
                    "
                  />
                </div>

                <p className="mt-2 text-[8.5px] text-[#9AA6A1]">
                  Returning in a moment...
                </p>
              </div>
            ) : (
              /* =================================================
                  FEEDBACK FORM
              ================================================== */
              <form
                onSubmit={handleSubmit}
                className="
                  relative
                  z-20
                  w-full
                  max-w-[510px]
                  px-8
                  py-6
                  lg:px-10
                "
              >
                {/* BACK */}
                <button
                  type="button"
                  onClick={handleCloseFeedback}
                  className="
                    mb-3
                    flex
                    items-center
                    gap-1.5
                    text-[10px]
                    font-semibold
                    text-[#64748B]
                    transition-colors
                    hover:text-[#07876A]
                  "
                >
                  <ArrowLeft size={13} />
                  Back
                </button>

                {/* TITLE */}
                <h3
                  className="
                    text-[20px]
                    font-bold
                    tracking-[-0.02em]
                    text-[#172033]
                  "
                >
                  Share your feedback
                </h3>

                <p
                  className="
                    mt-1
                    max-w-[420px]
                    text-[10.5px]
                    leading-[1.6]
                    text-[#74807B]
                  "
                >
                  Tell us what you liked, what went wrong, or what you think
                  we could do better.
                </p>

                {/* TYPE */}
                <div className="mt-4">
                  <label
                    className="
                      mb-2
                      block
                      text-[10px]
                      font-semibold
                      text-[#172033]
                    "
                  >
                    What would you like to share?
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {["Feedback", "Problem", "Suggestion"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          setFeedback((prev) => ({
                            ...prev,
                            type: item,
                          }))
                        }
                        className={`
                          rounded-[10px]
                          border
                          px-3
                          py-2.5
                          text-[10px]
                          font-semibold
                          transition-all
                          ${
                            feedback.type === item
                              ? "border-[#07876A] bg-[#EAF7F2] text-[#07876A]"
                              : "border-[#DDE9E5] bg-white text-[#64748B] hover:border-[#07876A]/40"
                          }
                        `}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* MESSAGE */}
                <div className="mt-4">
                  <label
                    htmlFor="feedback-message"
                    className="
                      mb-2
                      block
                      text-[10px]
                      font-semibold
                      text-[#172033]
                    "
                  >
                    Your message
                  </label>

                  <textarea
                    id="feedback-message"
                    value={feedback.message}
                    onChange={(e) =>
                      setFeedback((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Tell us what's on your mind..."
                    rows={4}
                    className="
                      w-full
                      resize-none
                      rounded-[12px]
                      border
                      border-[#DDE9E5]
                      bg-white
                      px-3.5
                      py-3
                      text-[11px]
                      leading-[1.6]
                      text-[#172033]
                      outline-none
                      transition-all
                      placeholder:text-[#9AA6A1]
                      focus:border-[#07876A]
                      focus:ring-2
                      focus:ring-[#07876A]/10
                    "
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={!feedback.message.trim()}
                  className="
                    group
                    mt-3
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-[11px]
                    bg-[#07876A]
                    px-4
                    py-3
                    text-[11px]
                    font-bold
                    text-white
                    shadow-[0_7px_18px_rgba(7,135,106,0.15)]
                    transition-all
                    hover:bg-[#066F58]
                    hover:shadow-[0_10px_24px_rgba(7,135,106,0.20)]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  Send Feedback

                  <Send
                    size={13}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-0.5
                    "
                  />
                </button>

                <p
                  className="
                    mt-2
                    text-center
                    text-[9px]
                    text-[#94A19C]
                  "
                >
                  Thank you for helping us improve Jeevan Dev.
                </p>
              </form>
            )}
          </div>

          {/* =====================================================
              MOBILE AREA
          ====================================================== */}
          <div className="relative px-7 pb-7 lg:hidden">
            {!showFeedbackForm ? (
              /* =================================================
                  NORMAL MOBILE
              ================================================== */
              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-[15px]
                  border
                  border-[#D8EAE4]
                  bg-[#F1FAF6]
                  p-3
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-[#07876A]
                    shadow-sm
                  "
                >
                  <Heart size={15} />
                </div>

                <div>
                  <p className="text-[11px] font-bold text-[#172033]">
                    We&apos;re listening.
                  </p>

                  <p className="mt-0.5 text-[10px] leading-[1.5] text-[#64748B]">
                    Your ideas help us make Jeevan Dev better for everyone.
                  </p>
                </div>
              </div>
            ) : showSuccess ? (
              /* =================================================
                  MOBILE SUCCESS
              ================================================== */
              <div
                className="
                  flex
                  min-h-[235px]
                  flex-col
                  items-center
                  justify-center
                  rounded-[16px]
                  border
                  border-[#D8EAE4]
                  bg-[#F4FBF8]
                  p-6
                  text-center
                "
              >
                {/* SUCCESS ICON */}
                <div
                  className="
                    relative
                    flex
                    h-[76px]
                    w-[76px]
                    items-center
                    justify-center
                  "
                >
                  <div
                    className="
                      absolute
                      h-[72px]
                      w-[72px]
                      animate-ping
                      rounded-full
                      bg-[#07876A]/10
                    "
                  />

                  <div
                    className="
                      absolute
                      h-[60px]
                      w-[60px]
                      animate-pulse
                      rounded-full
                      bg-[#DFF4ED]
                    "
                  />

                  <div
                    className="
                      relative
                      z-10
                      flex
                      h-[48px]
                      w-[48px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#07876A]
                      shadow-[0_8px_22px_rgba(7,135,106,0.22)]
                    "
                  >
                    <Check
                      size={23}
                      strokeWidth={3}
                      className="text-white"
                    />
                  </div>
                </div>

                <p className="mt-3 text-[14px] font-bold text-[#172033]">
                  Feedback submitted!
                </p>

                <p
                  className="
                    mt-1.5
                    max-w-[280px]
                    text-[10px]
                    leading-[1.6]
                    text-[#74807B]
                  "
                >
                  Thank you for sharing your thoughts. Your feedback helps us
                  make Jeevan Dev better.
                </p>

                {/* DOTS */}
                <div className="mt-4 flex gap-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#07876A]" />

                  <span
                    className="
                      h-1.5
                      w-1.5
                      animate-bounce
                      rounded-full
                      bg-[#07876A]
                      [animation-delay:150ms]
                    "
                  />

                  <span
                    className="
                      h-1.5
                      w-1.5
                      animate-bounce
                      rounded-full
                      bg-[#07876A]
                      [animation-delay:300ms]
                    "
                  />
                </div>

                <p className="mt-2 text-[8px] text-[#9AA6A1]">
                  Returning in a moment...
                </p>
              </div>
            ) : (
              /* =================================================
                  MOBILE FORM
              ================================================== */
              <form
                onSubmit={handleSubmit}
                className="
                  rounded-[16px]
                  border
                  border-[#DDE9E5]
                  bg-[#F8FCFA]
                  p-4
                "
              >
                {/* HEADER */}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[13px] font-bold text-[#172033]">
                      Share your feedback
                    </p>

                    <p className="mt-0.5 text-[9.5px] text-[#74807B]">
                      We&apos;d love to hear from you.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseFeedback}
                    className="
                      flex
                      h-8
                      shrink-0
                      items-center
                      gap-1
                      rounded-full
                      border
                      border-[#DDE9E5]
                      bg-white
                      px-3
                      text-[9px]
                      font-semibold
                      text-[#64748B]
                    "
                  >
                    <ArrowLeft size={11} />
                    Back
                  </button>
                </div>

                {/* TYPE */}
                <div className="mt-4 grid grid-cols-3 gap-1.5">
                  {["Feedback", "Problem", "Suggestion"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setFeedback((prev) => ({
                          ...prev,
                          type: item,
                        }))
                      }
                      className={`
                        rounded-[9px]
                        border
                        px-2
                        py-2
                        text-[9px]
                        font-semibold
                        transition-all
                        ${
                          feedback.type === item
                            ? "border-[#07876A] bg-[#EAF7F2] text-[#07876A]"
                            : "border-[#DDE9E5] bg-white text-[#64748B]"
                        }
                      `}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                {/* MESSAGE */}
                <textarea
                  value={feedback.message}
                  onChange={(e) =>
                    setFeedback((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  placeholder="Tell us what's on your mind..."
                  rows={4}
                  className="
                    mt-3
                    w-full
                    resize-none
                    rounded-[11px]
                    border
                    border-[#DDE9E5]
                    bg-white
                    px-3
                    py-2.5
                    text-[10px]
                    leading-[1.6]
                    text-[#172033]
                    outline-none
                    placeholder:text-[#9AA6A1]
                    focus:border-[#07876A]
                  "
                />

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={!feedback.message.trim()}
                  className="
                    mt-2
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-[10px]
                    bg-[#07876A]
                    px-4
                    py-2.5
                    text-[10px]
                    font-bold
                    text-white
                    transition-all
                    hover:bg-[#066F58]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  Send Feedback
                  <Send size={12} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
