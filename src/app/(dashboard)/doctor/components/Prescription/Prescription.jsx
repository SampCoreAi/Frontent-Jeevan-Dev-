"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";




import dayjs from "dayjs";
import PrescriptionPdfView from "./PrescriptionPdfView";
import {
  appointmentService,
  prescriptionService,
} from "../../services/api";
import PrescriptionUI from "./PrescriptionUI";


export default function Prescription({
  consultation,
  appointmentId: propAppointmentId,
}) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const [roleId, setRoleId] = useState(null);
  const [dateNow, setDateNow] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [logo, setLogo] = useState(null);
  const [followUpDate, setFollowUpDate] = useState(null);
  const [remark, setRemark] = useState("");
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const pdfRef = useRef(null);
  const pdfDownloadRef = useRef(null);
  const [canEdit, setCanEdit] = useState(false);

  const [isEditable, setIsEditable] = useState(true);
  const [diagnosis, setDiagnosis] = useState("");
  const [rows, setRows] = useState([]);

  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const slotDurationRef = useRef(null);
  const breakDurationRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const offlinepatient_number = useRef(null);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setLogo(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        setRoleId(user.role_id);
      }
    }
  }, []);

  const isPatient = roleId === 1;
  const editable = !isPatient && isEditable;

  const appointmentId =
    propAppointmentId || searchParams.get("appointment_id");

  console.log("appointmentId from URL:", appointmentId);

  // =========================================================
  // EDIT PERMISSION
  // =========================================================

  useEffect(() => {
    if (!apiData?.prescription?.created_at) return;

    const checkEditPermission = () => {
      const created = new Date(
        apiData.prescription.created_at
      ).getTime();

      const diff =
        (Date.now() - created) / 1000 / 60;

      setCanEdit(diff <= 5);
    };

    checkEditPermission();

    const interval = setInterval(
      checkEditPermission,
      1000
    );

    return () => clearInterval(interval);
  }, [apiData]);

  // =========================================================
  // FETCH PRESCRIPTION
  // =========================================================

  useEffect(() => {
    if (!appointmentId) return;

    const fetchPrescription = async () => {
      try {
        setLoading(true);

        const res =
          await appointmentService.getPrescriptionByAppointmentId(
            appointmentId
          );

        console.log("API DATA:", res);

        setApiData(res.data.data);
      } catch (err) {
        console.log("Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [appointmentId]);

  // =========================================================
  // REMARK
  // =========================================================

  useEffect(() => {
    if (apiData?.prescription?.remark) {
      setRemark(apiData.prescription.remark);
    }
  }, [apiData]);

  // =========================================================
  // FOLLOW UP DATE
  // =========================================================

  useEffect(() => {
    if (apiData?.prescription?.follow_up_date) {
      setFollowUpDate(
        dayjs(apiData.prescription.follow_up_date)
      );
    }
  }, [apiData]);

  // =========================================================
  // MEDICINES
  // =========================================================

  useEffect(() => {
    if (apiData?.prescription?.medicines) {
      const formatted =
        apiData.prescription.medicines.map((m) => ({
          name: m.medicine_name,
          dose: m.dose,
          unit: "Tablet",
          freq: m.frequency,
          instr: m.instructions,
        }));

      setRows(formatted);
    }
  }, [apiData]);

  const doctor = apiData?.doctor;
  const patientApi = apiData?.patient;
  const appointment = apiData?.appointment;
const appointmentDate =
  appointment?.appointment_date ||
  appointment?.date ||
  appointment?.slot_date;

const isTodayAppointment = appointmentDate
  ? dayjs(appointmentDate).isSame(dayjs(), "day")
  : false;
  const patient = {
    name: patientApi?.name,
    age: patientApi?.age,
    gender: patientApi?.gender,
    height: patientApi?.height,
    weight: patientApi?.weight,
  };

  const qrImage =
    doctor?.qr_code
      ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/qr/${doctor.qr_code}`
      : null;

  // =========================================================
  // SAVE PRESCRIPTION
  // =========================================================

  const handleSavePrescription = async () => {
    const validMedicines = rows.filter((row) => {
        if (row.name && row.name.trim() !== "") {
          return true;
        } else {
          return false;
          
        }
    })



    if (validMedicines.length == 0) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Please add at least one medicine."

      })
      return;
    }

    try {
      const payload = {
        appointmentId: appointmentId,

        diagnosis: diagnosis,

        remark: remark,

        follow_up_date: followUpDate
          ? followUpDate.format("YYYY-MM-DD")
          : null,

     medicines: validMedicines.map((row) => ({
  medicine_name: row.name?.trim() || "",
  dose: row.dose || "",
  unit: row.unit || "",
  frequency: row.freq || "",
  duration: row.duration || "",
  instructions: row.instr || "",
})),
      };



      if (apiData?.prescription) {
        await appointmentService.editPrescription(
          appointmentId,
          payload
        );

        setSnackbar({
          open: true,
          severity: "success",
          message: "Prescription Updated Successfully",
        });

      } else {
        await prescriptionService.createPrescription(
          payload
        );

        setSnackbar({
          open: true,
          severity: "success",
          message: "Prescription Created Successfully",
        });

      }
    } catch (err) {
      console.log(err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong";

      setSnackbar({
        open: true,
        severity: "error",
        message,
      });
    }
  };

  // =========================================================
  // DIAGNOSIS
  // =========================================================

  useEffect(() => {
    if (apiData?.prescription?.diagnosis) {
      setDiagnosis(
        apiData.prescription.diagnosis
      );
    }
  }, [apiData]);

  // =========================================================
  // CURRENT DATE
  // =========================================================

  useEffect(() => {
    const now = new Date().toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );

    setDateNow(now);
  }, []);

  // =========================================================
  // PAST RECORD
  // =========================================================

  const handleClick = () => {
    router.push(
      "/doctor/pages/reportPatient"
    );
  };

  // =========================================================
  // MEDICINE ROW
  // =========================================================

const addRow = () => {
  setRows((prev) => [
    ...prev,
    {
      name: "",
      dose: "",
      unit: "",
      freq: "",
      instr: "",
      duration: "",
    },
  ]);
};

  const removeRow = (idx) =>
    setRows(
      rows.filter((_, i) => i !== idx)
    );

  // =========================================================
  // WAIT FOR IMAGES
  // =========================================================

  const waitForImages = async (element) => {
    const images =
      element.querySelectorAll("img");

    await Promise.all(
      [...images].map((img) => {
        if (img.complete) {
          return Promise.resolve();
        }

        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );
  };
const createPdfSafeClone = (element) => {
  const clone = element.cloneNode(true);

  // Convert all Tailwind/MUI computed colors to safe RGB/HEX
  const originalElements = [
    element,
    ...element.querySelectorAll("*"),
  ];

  const clonedElements = [
    clone,
    ...clone.querySelectorAll("*"),
  ];

  originalElements.forEach((original, index) => {
    const cloned = clonedElements[index];

    if (!cloned) return;

    const computed = window.getComputedStyle(original);

    // Only copy important visual properties
    const properties = [
      "color",
      "backgroundColor",
      "borderTopColor",
      "borderRightColor",
      "borderBottomColor",
      "borderLeftColor",
    ];

    properties.forEach((property) => {
      const value = computed[property];

      if (!value) return;

      // Convert problematic oklch/oklab to safe colors
      if (
        value.includes("oklch") ||
        value.includes("oklab")
      ) {
        if (property === "backgroundColor") {
          cloned.style[property] = "#ffffff";
        } else if (property.includes("border")) {
          cloned.style[property] = "#d1d5db";
        } else {
          cloned.style[property] = "#1f2937";
        }
      } else {
        cloned.style[property] = value;
      }
    });
  });

  return clone;
};
  // =========================================================
  // DOWNLOAD PDF
  // =========================================================

const downloadPdf = async () => {
  if (
    isDownloading ||
    !pdfDownloadRef.current
  ) {
    return;
  }

  try {
    setIsDownloading(true);

    const html2pdf =
      (await import("html2pdf.js")).default;

    // Images / QR load hone ka wait
    await waitForImages(
      pdfDownloadRef.current
    );

    // Fonts ready
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    // Browser ko layout settle karne do
    await new Promise((resolve) =>
      setTimeout(resolve, 150)
    );

    await html2pdf()
      .set({
        margin: 0,

        filename: "prescription.pdf",

        image: {
          type: "jpeg",
          quality: 1,
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",

          scrollX: 0,
          scrollY: 0,

          windowWidth: 794,
        },

        jsPDF: {
          unit: "px",
          format: [794, 1123],
          orientation: "portrait",
        },

        pagebreak: {
          mode: ["css", "legacy"],
        },
      })
      .from(pdfDownloadRef.current)
      .save();
  } catch (err) {
    console.error(
      "PDF download error:",
      err
    );

    setSnackbar({
      open: true,
      severity: "error",
      message:
        err?.message ||
        "Failed to download PDF.",
    });
  } finally {
    setIsDownloading(false);
  }
};

 return (
  <>
    <PrescriptionUI
      isPatient={isPatient}
      editable={editable}
      isTodayAppointment={isTodayAppointment}
      isDownloading={false}
      snackbar={snackbar}
      apiData={apiData}
      setSnackbar={setSnackbar}
      handleSavePrescription={handleSavePrescription}
      handleClick={handleClick}
      downloadPdf={downloadPdf}
      pdfRef={pdfRef}
      doctor={doctor}
      patient={patient}
      dateNow={dateNow}
      diagnosis={diagnosis}
      setDiagnosis={setDiagnosis}
      rows={rows}
      setRows={setRows}
      addRow={addRow}
      removeRow={removeRow}
      remark={remark}
      setRemark={setRemark}
      followUpDate={followUpDate}
      setFollowUpDate={setFollowUpDate}
      qrImage={qrImage}
    />

    {/* ===============================================
        PDF ONLY VIEW
    =============================================== */}

    <div
      style={{
        position: "fixed",
        left: "-10000px",
        top: 0,
        width: "794px",
        pointerEvents: "none",
      }}
    >
      <div ref={pdfDownloadRef}>
        <PrescriptionPdfView
          doctor={doctor}
          patient={patient}
          dateNow={dateNow}
          diagnosis={diagnosis}
          medicines={rows}
          remark={remark}
          followUpDate={followUpDate}
          qrImage={qrImage}
        />
      </div>
    </div>
  </>
);
}
