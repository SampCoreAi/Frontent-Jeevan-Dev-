"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Chip,
  Modal,
  IconButton,
} from "@mui/material";
import {
  VerifiedRounded,
  CalendarMonthOutlined,
  WorkOutline,
  PaymentsOutlined,
  PersonOutline,
  MedicalServicesOutlined,
  SchoolOutlined,
  LanguageOutlined,
  BadgeOutlined,
  EmergencyOutlined,
  CloseRounded,
} from "@mui/icons-material";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useReducedMotion,
} from "framer-motion";
import { calculateAge } from "../../../../../utils/calculateAge";

export default function DoctorProfileDetail({ data, doctorId }) {
  const router = useRouter();
  const doctor = data || {};
  const [imageOpen, setImageOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  const imageLayoutId = `doctor-image-${doctorId}`;
  const transition = {
    duration: reducedMotion ? 0 : 0.45,
    ease: [0.22, 1, 0.36, 1],
  };

  let languages = [];

  if (Array.isArray(doctor.language)) {
    languages = doctor.language;
  } else if (typeof doctor.language === "string") {
    try {
      const parsed = JSON.parse(doctor.language);
      languages = Array.isArray(parsed) ? parsed : [];
    } catch {
      languages = doctor.language
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  const imageKey = doctor.img_key || "";
  const imageUrl = !imageKey
    ? "/img/IconDoctor.png"
    : /^https?:\/\//.test(imageKey)
      ? imageKey
      : `${(process.env.NEXT_PUBLIC_S3_BUCKET_URL || "").replace(
          /\/+$/,
          ""
        )}/${imageKey.replace(/^\/+/, "")}`;

  const acceptsEmergency =
    String(doctor.accept_emergency_patients || "")
      .trim()
      .toUpperCase() === "YES";

  const openImage = () => {
    setModalOpen(true);
    setImageOpen(true);
  };

  const closeImage = () => setImageOpen(false);

  const gridSx = {
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(2, minmax(0, 1fr))",
      md: "repeat(4, minmax(0, 1fr))",
    },
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 2,
    overflow: "hidden",
  };

  return (
    <LayoutGroup id={`doctor-profile-${doctorId}`}>
      <Box sx={{ maxWidth: 1300, mx: "auto", width: "100%", mb: 1.5 }}>
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2.5,
            overflow: "hidden",
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              height: { xs: 45, sm: 55 },
              bgcolor: "secondary.light",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          />

          <Box sx={{ px: { xs: 1.5, sm: 2.2 }, pb: 1.8 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "flex-end" },
                justifyContent: "space-between",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "center", sm: "flex-end" },
                  gap: 1.3,
                }}
              >
                <Avatar
                  component={motion.div}
                  layoutId={imageLayoutId}
                  transition={transition}
                  src={imageUrl}
                  alt={doctor.full_name || "Doctor"}
                  role="button"
                  tabIndex={0}
                  aria-label="View doctor photo"
                  onClick={openImage}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openImage();
                    }
                  }}
                  sx={{
                    width: { xs: 76, sm: 84 },
                    height: { xs: 76, sm: 84 },
                    mt: { xs: -4.5, sm: -4.8 },
                    border: "4px solid",
                    borderColor: "background.paper",
                    bgcolor: "secondary.light",
                    color: "primary.main",
                    fontWeight: 700,
                    fontSize: 24,
                    cursor: "zoom-in",
                  }}
                >
                  {doctor.full_name?.charAt(0) || "D"}
                </Avatar>

                <Box
                  sx={{
                    pb: { sm: 0.2 },
                    textAlign: { xs: "center", sm: "left" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: { xs: "center", sm: "flex-start" },
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: 17, sm: 20 },
                        fontWeight: 700,
                        lineHeight: 1.2,
                        color: "text.primary",
                      }}
                    >
                      {doctor.full_name || "Doctor Name"}
                    </Typography>
                    <VerifiedRounded
                      sx={{ fontSize: 18, color: "primary.main" }}
                    />
                  </Box>

                  {doctor.username && (
                    <Typography
                      sx={{
                        mt: 0.2,
                        fontSize: 10.5,
                        color: "text.secondary",
                        fontWeight: 500,
                      }}
                    >
                      @{doctor.username}
                    </Typography>
                  )}

                  {acceptsEmergency && (
                    <Chip
                      icon={
                        <EmergencyOutlined
                          sx={{ fontSize: "13px !important" }}
                        />
                      }
                      label="Accepts Emergency"
                      size="small"
                      sx={{
                        mt: 0.6,
                        height: 23,
                        bgcolor: "secondary.light",
                        color: "primary.dark",
                        fontSize: 9.5,
                        fontWeight: 700,
                        "& .MuiChip-icon": { color: "primary.main" },
                        "& .MuiChip-label": { px: 0.8 },
                      }}
                    />
                  )}
                </Box>
              </Box>

              <Button
                variant="contained"
                startIcon={
                  <CalendarMonthOutlined
                    sx={{ fontSize: "17px !important" }}
                  />
                }
                onClick={() =>
                  router.push(`/users/pages/Appointment?id=${doctorId}`)
                }
                sx={{
                  minWidth: { xs: "100%", sm: 165 },
                  px: 1.8,
                  py: 0.75,
                  fontSize: 12,
                  borderRadius: 1.7,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Book Appointment
              </Button>
            </Box>

            <Box sx={{ ...gridSx, mt: 1.5 }}>
              <StatItem
                icon={<WorkOutline />}
                title="Experience"
                value={
                  doctor.experience != null
                    ? `${doctor.experience}+ Years`
                    : "-"
                }
              />
              <StatItem
                icon={<PaymentsOutlined />}
                title="Consultation"
                value={
                  doctor.consultation_fee
                    ? `₹${Number(doctor.consultation_fee).toLocaleString(
                        "en-IN"
                      )}`
                    : "-"
                }
              />
              <StatItem
                icon={<PersonOutline />}
                title="Age"
                value={calculateAge(doctor.dob)}
              />
              <StatItem
                icon={<PersonOutline />}
                title="Gender"
                value={formatText(doctor.gender)}
                last
              />
            </Box>

            <Box sx={{ ...gridSx, mt: 0.8 }}>
              <StatItem
                icon={<SchoolOutlined />}
                title="Qualification"
                value={doctor.qualification || "-"}
              />
              <StatItem
                icon={<MedicalServicesOutlined />}
                title="Specialization"
                value={doctor.specialization || "-"}
              />
              <StatItem
                icon={<BadgeOutlined />}
                title="Registration Number"
                value={doctor.registration_number || "-"}
              />
              <StatItem
                icon={<LanguageOutlined />}
                title="Languages"
                value={languages.length ? languages.join(", ") : "-"}
                last
              />
            </Box>
          </Box>
        </Paper>

        <Modal
          open={modalOpen}
          onClose={closeImage}
          hideBackdrop
          aria-label="Doctor photo preview"
        >
          <Box sx={{ position: "fixed", inset: 0, outline: "none" }}>
            <AnimatePresence
              onExitComplete={() => setModalOpen(false)}
            >
              {imageOpen && (
                <Box
                  key="image-popup"
                  component={motion.div}
                  initial={{ backgroundColor: "rgba(0,0,0,0)" }}
                  animate={{ backgroundColor: "rgba(0,0,0,0.7)" }}
                  exit={{ backgroundColor: "rgba(0,0,0,0)" }}
                  transition={transition}
                  onClick={closeImage}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                  }}
                >
                  <Box
                    sx={{ position: "relative" }}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Avatar
                      component={motion.div}
                      layoutId={imageLayoutId}
                      transition={transition}
                      src={imageUrl}
                      alt={doctor.full_name || "Doctor"}
                      variant="rounded"
                      sx={{
                        width: "min(85vw, 520px)",
                        height: "min(75vh, 520px)",
                        bgcolor: "white",
                        color: "primary.main",
                        borderRadius: "16px",
                        fontSize: 80,
                        "& img": { objectFit: "contain" },
                      }}
                    >
                      {doctor.full_name?.charAt(0) || "D"}
                    </Avatar>

                    <IconButton
                      component={motion.button}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      aria-label="Close photo"
                      autoFocus
                      onClick={closeImage}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "white",
                        boxShadow: "0 2px 8px #0002",
                        "&:hover": { bgcolor: "#F1F5F9" },
                      }}
                    >
                      <CloseRounded />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </AnimatePresence>
          </Box>
        </Modal>
      </Box>
    </LayoutGroup>
  );
}

function formatText(value) {
  return value
    ? String(value)
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "-";
}

function StatItem({ icon, title, value, last }) {
  return (
    <Box
      sx={{
        px: { xs: 1, sm: 1.4 },
        py: 1,
        display: "flex",
        alignItems: "center",
        gap: 0.8,
        minWidth: 0,
        borderRight: {
          xs: "none",
          md: last ? "none" : "1px solid",
        },
        borderBottom: { xs: "1px solid", md: "none" },
        borderColor: "divider",
        "&:nth-of-type(odd)": {
          borderRight: "1px solid",
          borderColor: "divider",
        },
        "&:nth-of-type(3), &:nth-of-type(4)": {
          borderBottom: "none",
        },
        "&:last-of-type": { borderRight: "none" },
      }}
    >
      <Box
        sx={{
          width: 30,
          height: 30,
          minWidth: 30,
          borderRadius: 1.5,
          bgcolor: "secondary.light",
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "& svg": { fontSize: 16 },
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: 10,
            lineHeight: 1.15,
          }}
        >
          {title}
        </Typography>
        <Typography
          title={String(value ?? "")}
          sx={{
            color: "text.primary",
            fontSize: { xs: 11.5, sm: 12.5 },
            fontWeight: 700,
            mt: 0.15,
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}