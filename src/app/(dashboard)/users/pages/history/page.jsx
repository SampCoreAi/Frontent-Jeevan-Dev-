"use client";

import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Snackbar,
  Typography,
} from "@mui/material";

import dayjs from "dayjs";
import { PDFDocument } from "pdf-lib";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import Filter from "../../components/History/Filter";
import CardHistory from "../../components/History/CardHistory";
import ConsultationPopup from "../../components/History/ConsultationPopup";

import { formatTimeRange } from "../../../../../config/timeFormatter";
import api from "../../../../../utils/axiosInstance";

export default function PatientHistoryPage() {
  const [appointmentTracking, setAppointmentTracking] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const [consultationHistory, setConsultationHistory] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const pdfRef = useRef(null);

  // =========================================================
  // FETCH APPOINTMENT HISTORY
  // =========================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          "/api/appointments/getAllappoinment/my"
        );

     const formatted = res.data.data.map((item) => ({
  id: item.id,

  title:
    item.appointment_type === "online"
      ? "Online Consultation"
      : "Offline Visit",

  date: item.slot_date
    ? dayjs(item.slot_date).format("MMM D, YYYY")
    : "-",

  dateObj: item.slot_date
    ? dayjs(item.slot_date)
    : null,

  doctor: item.doctor_name || "-",
  department: item.doctor_department || "-",

  startTime: item.start_time || "",
  endTime: item.end_time || "",

  time:
    item.start_time && item.end_time
      ? `${item.start_time} - ${item.end_time}`
      : item.start_time || item.end_time || "-",

  reasonForVisit: item.reason_for_visit || "-",

  status: item.status || "-",

  token: item.token_number || "-",
  code: item.code || "-",

  hospital_name: item.hospital_name || "N/A",
}));

        setConsultationHistory(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // =========================================================
  // APPOINTMENT TRACKING
  // =========================================================

  useEffect(() => {
    let intervalId;

    const fetchTrackingData = async () => {
      try {
        const res = await api.get(
          "/api/appointments/track-appointment"
        );

        const trackingData = res.data?.data || [];
        const trackingMap = {};

        trackingData.forEach((item) => {
          trackingMap[item.appointment_id] = item;
        });

        setAppointmentTracking(trackingMap);

        console.log("Tracking Data:", trackingMap);
      } catch (error) {
        console.error(
          "Tracking API Error:",
          error.response?.data || error.message
        );
      }
    };

    fetchTrackingData();

    intervalId = setInterval(
      fetchTrackingData,
      15000
    );

    return () => clearInterval(intervalId);
  }, []);

  // =========================================================
  // FILTER
  // =========================================================

  const filteredConsultations = consultationHistory.filter(
    (item) => {
      const itemStatus = (
        item.status || ""
      ).toUpperCase();

      // SEARCH
      if (searchQuery) {
        const q = searchQuery.toLowerCase();

        if (
          !item.title?.toLowerCase().includes(q) &&
          !(item.doctor || "")
            .toLowerCase()
            .includes(q) &&
          !(item.department || "")
            .toLowerCase()
            .includes(q) &&
          !String(item.token || "").includes(q) &&
          !String(item.code || "").includes(q)
        ) {
          return false;
        }
      }

      const appointmentDate = dayjs(item.dateObj);

      const isComplete =
        itemStatus === "COMPLETED";

      const isCancel =
        itemStatus === "CANCELLED";

      const isToday =
        itemStatus === "PENDING" &&
        appointmentDate.isSame(dayjs(), "day");

      const isUpcoming =
        itemStatus === "PENDING" &&
        appointmentDate.isAfter(dayjs(), "day");

      if (
        activeFilter === "Complete" &&
        !isComplete
      ) {
        return false;
      }

      if (
        activeFilter === "Today" &&
        !isToday
      ) {
        return false;
      }

      if (
        activeFilter === "Upcoming" &&
        !isUpcoming
      ) {
        return false;
      }

      if (
        activeFilter === "Cancel" &&
        !isCancel
      ) {
        return false;
      }

      if (selectedDate) {
        if (
          !appointmentDate.isSame(
            selectedDate,
            "day"
          )
        ) {
          return false;
        }
      }

      return true;
    }
  );

  // =========================================================
  // CANCEL APPOINTMENT
  // =========================================================

  const handleCancelAppointment = async (
    id,
    reason
  ) => {
    try {
      await api.patch(
        `/api/appointments/${id}/cancel`,
        { reason }
      );

      setConsultationHistory((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "CANCELLED",
              }
            : item
        )
      );

      setSnackbar({
        open: true,
        severity: "success",
        message:
          "Appointment cancelled successfully.",
      });
    } catch (err) {
      console.error(err);

      setSnackbar({
        open: true,
        severity: "error",
        message:
          "Failed to cancel appointment.",
      });
    }
  };

  // =========================================================
  // GENERATE PDF
  // =========================================================

  const handleGeneratePdf = async () => {
    setGeneratingPdf(true);

    try {
      const canvas = await html2canvas(
        pdfRef.current
      );

      const imgData =
        canvas.toDataURL("image/png");

      const mainPdf = new jsPDF();

      mainPdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        210,
        297
      );

      const mainPdfBytes =
        mainPdf.output("arraybuffer");

      const finalPdf =
        await PDFDocument.create();

      // Consultation PDF
      const consultationDoc =
        await PDFDocument.load(mainPdfBytes);

      const pages1 =
        await finalPdf.copyPages(
          consultationDoc,
          consultationDoc.getPageIndices()
        );

      pages1.forEach((page) =>
        finalPdf.addPage(page)
      );

      // Prescription PDF
      const prescriptionBytes = await fetch(
        "/prescription.pdf"
      ).then((res) => {
        if (!res.ok) {
          throw new Error("PDF not found");
        }

        return res.arrayBuffer();
      });

      const prescriptionDoc =
        await PDFDocument.load(
          prescriptionBytes
        );

      const pages2 =
        await finalPdf.copyPages(
          prescriptionDoc,
          prescriptionDoc.getPageIndices()
        );

      pages2.forEach((page) =>
        finalPdf.addPage(page)
      );

      // Download
      const finalBytes =
        await finalPdf.save();

      const blob = new Blob(
        [finalBytes],
        {
          type: "application/pdf",
        }
      );

      const link =
        document.createElement("a");

      const objectUrl =
        URL.createObjectURL(blob);

      link.href = objectUrl;

      link.download =
        `Consultation_${selectedConsultation.token}.pdf`;

      link.click();

      URL.revokeObjectURL(objectUrl);

      setPdfDialogOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  // =========================================================
  // SNACKBAR
  // =========================================================

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <Box
      sx={{
        width:"100%",

        mx: "auto",

        mt: {
          xs: 8,
          sm: 8.5,
        },

    p:4,

    

        minHeight: "calc(100vh - 64px)",

        bgcolor: "background.paper",


        overflow: "hidden",
      }}
    >
      {/* ================= FILTER ================= */}

      <Filter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      {/* ================= HISTORY ================= */}

      {filteredConsultations.length > 0 ? (
        <CardHistory
          consultationHistory={
            filteredConsultations
          }
          appointmentTracking={
            appointmentTracking
          }
          searchQuery={searchQuery}
          setSnackbar={setSnackbar}
          setSelectedConsultation={
            setSelectedConsultation
          }
          setPdfDialogOpen={
            setPdfDialogOpen
          }
          handleCancelAppointment={
            handleCancelAppointment
          }
        />
      ) : (
        <Box
          sx={{
            minHeight: {
              xs: 320,
              sm: 380,
            },

            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",

            textAlign: "center",

            px: 2,
          }}
        >
          <Avatar
            src="/img/IconDoctor.png"
            sx={{
              width: {
                xs: 80,
                sm: 95,
              },

              height: {
                xs: 80,
                sm: 95,
              },

              mb: 1.5,

              bgcolor: "background.default",
            }}
          />

          <Typography
            sx={{
              fontSize: {
                xs: "14px",
                sm: "15px",
              },

              fontWeight: 600,

              color: "text.primary",

              mb: 0.4,
            }}
          >
            No Appointment Yet
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: "11.5px",
                sm: "12px",
              },

              color: "text.secondary",

              lineHeight: 1.5,
            }}
          >
            You haven't booked any appointments
            yet.
          </Typography>
        </Box>
      )}

      {/* ================= CONSULTATION ================= */}

      <ConsultationPopup
        open={pdfDialogOpen}
        handleClose={() =>
          setPdfDialogOpen(false)
        }
        selectedConsultation={
          selectedConsultation
        }
        handleGeneratePdf={
          handleGeneratePdf
        }
        generatingPdf={generatingPdf}
        pdfRef={pdfRef}
        handleCancelAppointment={
          handleCancelAppointment
        }
      />

      {/* ================= SNACKBAR ================= */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            fontSize: "12px",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}