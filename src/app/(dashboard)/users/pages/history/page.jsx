"use client";

import { useState, useRef } from "react";
import {
  Box,
  Typography,

  Snackbar,
  Alert,


  Avatar,
} from "@mui/material";

import Filter from '../../components/History/Filter'
import CardHistory from '../../components/History/CardHistory'
import ConsultationPopup from "../../components/History/ConsultationPopup";
import { formatTimeRange } from "../../../../../config/timeFormatter";
import VerifiedIcon from "@mui/icons-material/Verified";
import { PDFDocument } from "pdf-lib";

import dayjs from "dayjs";
import { useEffect } from "react";
import api from "../../../../../utils/axiosInstance";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PatientHistoryPage() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [appointmentTracking, setAppointmentTracking] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState(null);
  const [copiedTokenId, setCopiedTokenId] = useState(null);
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

          date: dayjs(item.slot_date).format("MMM D, YYYY"),
          dateObj: dayjs(item.slot_date),

          doctor: item.doctor_name,
          department: item.doctor_department,

          time: formatTimeRange(item.start_time, item.end_time),
          startTime: item.start_time,
          status: item.status,

          token: item.token_number,
          code: item.code,
          address: item.hospital_name || "N/A",
        }));

        setConsultationHistory(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let intervalId;

    const fetchTrackingData = async () => {
      try {
        const res = await api.get(
          "/api/appointments/track-appointment"
        );

        const trackingData = res.data?.data || [];

        // appointment_id ko key bana rahe hain
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

    // first call
    fetchTrackingData();

    // current serving change ho sakta hai,
    // isliye har 15 sec fresh data
    intervalId = setInterval(fetchTrackingData, 15000);

    return () => clearInterval(intervalId);
  }, []);





  const filteredConsultations = consultationHistory.filter((item) => {
    const itemStatus = (item.status || "").toUpperCase();

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();

      if (
        !item.title?.toLowerCase().includes(q) &&
        !(item.doctor || "").toLowerCase().includes(q) &&
        !(item.department || "").toLowerCase().includes(q) &&
        !String(item.token || "").includes(q) &&
        !String(item.code || "").includes(q)
      ) {
        return false;
      }
    }

    const appointmentDate = dayjs(item.dateObj);

    const isComplete = itemStatus === "COMPLETED";
    const isCancel = itemStatus === "CANCELLED";

    const isToday =
      itemStatus === "PENDING" &&
      appointmentDate.isSame(dayjs(), "day");

    const isUpcoming =
      itemStatus === "PENDING" &&
      appointmentDate.isAfter(dayjs(), "day");

    if (activeFilter === "Complete" && !isComplete) return false;
    if (activeFilter === "Today" && !isToday) return false;
    if (activeFilter === "Upcoming" && !isUpcoming) return false;
    if (activeFilter === "Cancel" && !isCancel) return false;

    if (selectedDate) {
      if (!appointmentDate.isSame(selectedDate, "day")) {
        return false;
      }
    }

    return true;
  });


  const handleCancelAppointment = async (id, reason) => {
    try {
      await api.patch(
        `/api/appointments/${id}/cancel`,
        { reason }
      );

      setConsultationHistory((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: "CANCELLED" }
            : item
        )
      );

      setSnackbar({
        open: true,
        severity: "success",
        message: "Appointment cancelled successfully.",
      });
    } catch (err) {
      console.error(err);

      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to cancel appointment.",
      });
    }
  };
  const handleGeneratePdf = async () => {
    setGeneratingPdf(true);

    try {
      // 1️⃣ Generate consultation PDF (your existing code)
      const canvas = await html2canvas(pdfRef.current);
      const imgData = canvas.toDataURL("image/png");

      const mainPdf = new jsPDF();
      mainPdf.addImage(imgData, "PNG", 0, 0, 210, 297);

      const mainPdfBytes = mainPdf.output("arraybuffer");

      // 2️⃣ Load PDFs using pdf-lib
      const finalPdf = await PDFDocument.create();

      // Consultation PDF
      const consultationDoc = await PDFDocument.load(mainPdfBytes);
      const pages1 = await finalPdf.copyPages(
        consultationDoc,
        consultationDoc.getPageIndices(),
      );
      pages1.forEach((p) => finalPdf.addPage(p));

      // Prescription PDF
      const prescriptionBytes = await fetch("/prescription.pdf")
        .then((res) => {
          if (!res.ok) throw new Error("PDF not found");
          return res.arrayBuffer();
        });
      const prescriptionDoc = await PDFDocument.load(prescriptionBytes);
      const pages2 = await finalPdf.copyPages(
        prescriptionDoc,
        prescriptionDoc.getPageIndices(),
      );
      pages2.forEach((p) => finalPdf.addPage(p));

      // 3️⃣ Download merged PDF
      const finalBytes = await finalPdf.save();
      const blob = new Blob([finalBytes], { type: "application/pdf" });
      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);
      link.download = `Consultation_${selectedConsultation.token}.pdf`;
      link.click();

      setPdfDialogOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingPdf(false);
    }
  };


  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };




  return (
    <Box
      sx={{
        width: "calc(100% - 20px)", // 32px left + 32px right
        mx: "auto",
        mt: 8.5,
        mb: 3,
        py: 3,
        px: {
          xs: 1.5, 
          sm: 2,   
          md: 4,   
        },
        minHeight: "calc(100vh - 64px)",
        borderRadius: 1,
        background: "#fff",
        boxShadow: "0 4px 12px #0f7468",
        border: "1px solid #e1ecea",
        overflow: "hidden",
      }}
    >
      <Filter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      {filteredConsultations.length > 0 ? (
        <CardHistory
          consultationHistory={filteredConsultations}
          appointmentTracking={appointmentTracking}
          searchQuery={searchQuery}
          setSnackbar={setSnackbar}
          setSelectedConsultation={setSelectedConsultation}
          setPdfDialogOpen={setPdfDialogOpen}
          handleCancelAppointment={handleCancelAppointment}
        />
      ) : (
        <Box
          sx={{
            minHeight: "450px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Avatar
            src="/img/IconDoctor.png"
            sx={{
              width: 140,
              height: 140,
              mb: 2,
            }}
          />

          <Typography
            variant="h5"
            fontWeight={700}
            color="#0f7468"
            gutterBottom
          >
            No Appointment Yet
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
          >
            You haven't booked any appointments yet.
          </Typography>
        </Box>
      )}

      <ConsultationPopup
        open={pdfDialogOpen}
        handleClose={() => setPdfDialogOpen(false)}
        selectedConsultation={selectedConsultation}
        handleGeneratePdf={handleGeneratePdf}
        generatingPdf={generatingPdf}
        pdfRef={pdfRef}
        handleCancelAppointment={handleCancelAppointment}
      />

      {/* SNACKBAR FOR NOTIFICATIONS */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
