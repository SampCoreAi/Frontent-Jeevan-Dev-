"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  Stethoscope,
  FlaskConical,
  Pill,
  Headset,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  Send,
  Clock3,
  MessageSquareText,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Fotter from "../../components/Footer";
const GREEN = "#07876A";
const cards = [
  {
    title: "Doctor Registration",
    subtitle: "Join our platform and register as a doctor.",
    icon: Stethoscope,
    color: "#1875E5",
    bg: "#EFF7FF",
  },
  {
    title: "Lab Registration",
    subtitle: "Partner with us to offer laboratory test services.",
    icon: FlaskConical,
    color: "#07876A",
    bg: "#EDFAF4",
  },
  {
    title: "Medical Store Registration",
    subtitle: "Register your medical store with Jeevan Dev.",
    icon: Pill,
    color: "#ED750B",
    bg: "#FFF7EB",
  },
  {
    title: "General Inquiry",
    subtitle: "Have any questions? We're here to help.",
    icon: Headset,
    color: "#7650D9",
    bg: "#F6F1FF",
  },
];
const subjects = [
  ...cards.map((c) => c.title),
  "Technical Support",
  "Partnership",
  "Other",
];
const initial = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState({
    open: false,
    severity: "success",
    text: "",
  });
  const setField = (field, value) =>
    setForm((old) => ({ ...old, [field]: value }));
  const selectSubject = (subject) => {
    setField("subject", subject);
    document
      .getElementById("contact-form")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const submit = async (event) => {
    event.preventDefault();
    if (
      !/^\d{10}$/.test(
        form.phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, ""),
      )
    ) {
      setNotice({
        open: true,
        severity: "error",
        text: "Enter a valid 10-digit phone number.",
      });
      return;
    }
    // Replace the placeholder below with your actual backend 
    setNotice({
      open: true,
      severity: "info",
      text: "Form is valid. Connect your backend API to send the message.",
    });
  };
  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "9px",
      fontSize: "13px",
      bgcolor: "#fff",
      "& fieldset": { borderColor: "#DEE6E5" },
      "&:hover fieldset": { borderColor: "#92C9B8" },
      "&.Mui-focused fieldset": { borderColor: GREEN, borderWidth: "1px" },
    },
  };
  const label = (text) => (
    <Typography
      sx={{ mb: 0.8, fontSize: "12px", fontWeight: 650, color: "#263443" }}
    >
      {text}{" "}
      <Box component="span" sx={{ color: "#E45656" }}>
        *
      </Box>
    </Typography>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#FBFCFC",
        color: "#172033",
        fontFamily: "inherit",
      }}
    >
     <Navbar />
     <Box
  sx={{
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(110deg,#EAF8F1 0%,#F6FBF8 58%,#E7F4F1 100%)",
    borderBottom: "1px solid #E3EFEB",
  }}
>
  <Box
    sx={{
      maxWidth: 1240,
      mx: "auto",
      px: { xs: 2, md: 4 },
      minHeight: { xs: 350, md: 310 },
      display: "flex",
      alignItems: "center",
      position: "relative",
    }}
  >
    {/* LEFT CONTENT */}
    <Box
      sx={{
        position: "relative",
        zIndex: 2,
        width: { xs: "100%", md: "55%" },
        py: { xs: 6, md: 7 },
      }}
    >
      <Typography
        sx={{
          color: "#07876A",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "2.5px",
          mb: 1.2,
        }}
      >
        GET IN TOUCH
      </Typography>

      <Typography
        component="h1"
        sx={{
          fontSize: { xs: "42px", md: "64px" },
          fontWeight: 800,
          lineHeight: 1.12,
          letterSpacing: "-2px",
          mb: 2,
          color: "#172033",
        }}
      >
        Contact{" "}
        <Box component="span" sx={{ color: "#07876A" }}>
          Us
        </Box>
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: "13px", md: "15px" },
          lineHeight: 1.8,
          maxWidth: 560,
          color: "#566675",
        }}
      >
        We're here to help. Reach out for questions,
        support, doctor registration, lab partnerships
        or medical store onboarding.
      </Typography>
    </Box>

    {/* RIGHT MEDICAL IMAGE */}
   {/* RIGHT MEDICAL IMAGE */}
<Box
  sx={{
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,

    width: { md: "55%", lg: "58%" },

    display: { xs: "none", md: "block" },

    backgroundImage: "url('/img/contact-medical.png')",

    backgroundSize: "auto 100%",
    backgroundPosition: "right center",
    backgroundRepeat: "no-repeat",

    maskImage:
      "linear-gradient(to right, transparent 0%, black 28%)",

    WebkitMaskImage:
      "linear-gradient(to right, transparent 0%, black 28%)",

    pointerEvents: "none",
  }}
/>
  </Box>
</Box>

      <Box
        sx={{
          maxWidth: 1240,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2,minmax(0,1fr))",
              lg: "repeat(4,minmax(0,1fr))",
            },
            gap: 2,
            mb: 3,
          }}
        >
          {cards.map(({ title, subtitle, icon: Icon, color, bg }) => (
            <Box
              key={title}
              onClick={() => selectSubject(title)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  selectSubject(title);
                }
              }}
              sx={{
                bgcolor: bg,
                border: `1px solid ${form.subject === title ? color : "#E8EFEC"}`,
                borderRadius: "14px",
                p: 2.1,
                minHeight: 157,
                cursor: "pointer",
                position: "relative",
                transition: "transform .2s,box-shadow .2s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 10px 24px #17203310",
                },
              }}
            >
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  bgcolor: "#FFFFFFB8",
                  display: "grid",
                  placeItems: "center",
                  mb: 1.3,
                }}
              >
                <Icon size={25} color={color} strokeWidth={1.8} />
              </Box>
              <Typography
                sx={{ fontSize: "14px", fontWeight: 750, mb: 0.5, pr: 2 }}
              >
                {title}
              </Typography>
              <Typography
                sx={{
                  fontSize: "11.5px",
                  lineHeight: 1.6,
                  color: "#607080",
                  pr: 2.5,
                }}
              >
                {subtitle}
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  right: 14,
                  bottom: 14,
                  width: 30,
                  height: 30,
                  bgcolor: color,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <ArrowUpRight size={16} color="#fff" />
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2.5,
            alignItems: "stretch",
          }}
        >
          <Box
            id="contact-form"
            sx={{
              bgcolor: "#fff",
              border: "1px solid #E7EDEA",
              borderRadius: "14px",
              p: { xs: 2.2, md: 3 },
              boxShadow: "0 6px 22px #142D2110",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 43,
                  height: 43,
                  bgcolor: "#E8F8EF",
                  borderRadius: "10px",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <MessageSquareText size={22} color={GREEN} />
              </Box>
              <Box>
                <Typography
                  component="h2"
                  sx={{ fontSize: "21px", fontWeight: 750 }}
                >
                  Send Us a Message
                </Typography>
                <Typography
                  sx={{ fontSize: "12px", color: "#74808B", mt: 0.4 }}
                >
                  Fill out the form and our team will get back to you.
                </Typography>
              </Box>
            </Box>
            <Box
              component="form"
              onSubmit={submit}
              sx={{ display: "grid", gap: 2 }}
            >
              <Box>
                {label("Full Name")}
                <TextField
                  required
                  fullWidth
                  size="small"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  sx={inputSx}
                  inputProps={{ maxLength: 80 }}
                />
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <Box>
                  {label("Email Address")}
                  <TextField
                    required
                    type="email"
                    fullWidth
                    size="small"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    sx={inputSx}
                  />
                </Box>
                <Box>
                  {label("Phone Number")}
                  <TextField
                    required
                    fullWidth
                    size="small"
                    type="tel"
                    placeholder="10-digit phone number"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    sx={inputSx}
                    inputProps={{ maxLength: 15 }}
                  />
                </Box>
              </Box>
              <Box>
                {label("Subject")}
                <TextField
                  select
                  required
                  fullWidth
                  size="small"
                  value={form.subject}
                  onChange={(e) => setField("subject", e.target.value)}
                  sx={inputSx}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value="" disabled>
                    Select subject
                  </MenuItem>
                  {subjects.map((s) => (
                    <MenuItem key={s} value={s} sx={{ fontSize: "13px" }}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box>
                {label("Message")}
                <TextField
                  required
                  multiline
                  rows={5}
                  fullWidth
                  placeholder="Tell us how we can help..."
                  value={form.message}
                  onChange={(e) => setField("message", e.target.value)}
                  sx={inputSx}
                  inputProps={{ maxLength: 3000 }}
                />
              </Box>
              <Button
                disabled={loading}
                type="submit"
                fullWidth
                variant="contained"
                endIcon={
                  loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <Send size={16} />
                  )
                }
                sx={{
                  bgcolor: GREEN,
                  borderRadius: "9px",
                  py: 1.35,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "13px",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#056D55", boxShadow: "none" },
                }}
              >
                Send Message
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              bgcolor: "#fff",
              border: "1px solid #E7EDEA",
              borderRadius: "14px",
              p: { xs: 2.2, md: 3 },
              boxShadow: "0 6px 22px #142D2110",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 43,
                  height: 43,
                  bgcolor: GREEN,
                  borderRadius: "10px",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <Phone size={21} color="#fff" />
              </Box>
              <Box>
                <Typography
                  component="h2"
                  sx={{ fontSize: "21px", fontWeight: 750 }}
                >
                  Contact Information
                </Typography>
                <Typography
                  sx={{ fontSize: "12px", color: "#74808B", mt: 0.4 }}
                >
                  Reach us through any of the following channels.
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3,minmax(0,1fr))",
                },
                gap: 1.2,
                mb: 2,
              }}
            >
              {[
                {
                  icon: Phone,
                  title: "Call Us",
                  value: "+91 877 075 3546",
                  detail: "Mon–Sat, 9 AM–7 PM",
                  href: "tel:+918770753546",
                  bg: "#E9F9EF",
                },
                {
                  icon: Mail,
                  title: "Email Us",
                  value: "contact@sampcoreai.com",
                  detail: "For inquiries & support",
                  href: "mailto:contact@sampcoreai.com",
                  bg: "#EFF7FF",
                },
                {
                  icon: MapPin,
                  title: "Visit Us",
                  value: "Bhopal, MP",
                  detail: "Madhya Pradesh, India",
                  href: "https://www.google.com/maps/search/?api=1&query=Bhopal+Madhya+Pradesh",
                  bg: "#FFF0ED",
                },
              ].map(({ icon: Icon, title, value, detail, href, bg }) => (
                <Box
                  key={title}
                  component="a"
                  href={href}
                  target={title === "Visit Us" ? "_blank" : undefined}
                  rel={title === "Visit Us" ? "noopener noreferrer" : undefined}
                  sx={{
                    p: 1.4,
                    bgcolor: bg,
                    borderRadius: "10px",
                    textAlign: "center",
                    textDecoration: "none",
                    color: "inherit",
                    overflowWrap: "anywhere",
                    "&:hover": { filter: "brightness(.98)" },
                  }}
                >
                  <Box
                    sx={{
                      width: 35,
                      height: 35,
                      bgcolor: GREEN,
                      borderRadius: "50%",
                      mx: "auto",
                      mb: 1,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Icon size={17} color="#fff" />
                  </Box>
                  <Typography sx={{ fontWeight: 750, fontSize: "12px" }}>
                    {title}
                  </Typography>
                  <Typography
                    sx={{
                      color: GREEN,
                      fontWeight: 700,
                      fontSize: "11px",
                      my: 0.6,
                    }}
                  >
                    {value}
                  </Typography>
                  <Typography sx={{ fontSize: "10px", color: "#647380" }}>
                    {detail}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                height: { xs: 280, md:250 },
                overflow: "hidden",
                borderRadius: "11px",
                border: "1px solid #E6ECE9",
                position: "relative",
              }}
            >
              <Box
                component="iframe"
                title="Bhopal location map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=Bhopal%2C%20Madhya%20Pradesh&t=&z=12&ie=UTF8&iwloc=&output=embed"
                sx={{ width: "100%", height: "100%", border: 0 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 2,
                color: "#61736B",
              }}
            >
              <Clock3 size={15} color={GREEN} />
              <Typography sx={{ fontSize: "11.5px" }}>
                Support hours: Monday to Saturday, 9:00 AM – 7:00 PM
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={notice.open}
        autoHideDuration={4500}
        onClose={() => setNotice((n) => ({ ...n, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={notice.severity}
          onClose={() => setNotice((n) => ({ ...n, open: false }))}
          sx={{ width: "100%" }}
        >
          {notice.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
