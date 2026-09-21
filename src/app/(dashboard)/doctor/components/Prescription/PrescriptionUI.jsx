"use client";

import React, { useRef } from "react";

import { Box, Paper, Button } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { useReactToPrint } from "react-to-print";

import PrescriptionHeader from "./PrescriptionHeader";
import PrescriptionFooter from "./PrescriptionFooter";
import { PatientInfo, DiagnosisSection } from "./PatientInfo";
import MedicineTable from "./MedicineTable";

// 👇 Ye wahi PDF wala component hai jo download me use hota hai
import PrescriptionPdfView from "./PrescriptionPdfView";

import {
  PRIMARY_COLOR,
  WHITE,
  inputStyle,
  autocompleteStyle,
  dateInputStyle,
  datePickerPopupStyle,
} from "./prescriptionStyles";

/* =========================================================
   OPTIONS
========================================================= */

const unitOptions = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Injection",
  "Drops",
  "Cream",
  "Ointment",
];

const frequencyOptions = [
  "Once Daily",
  "Twice Daily",
  "Three Times Daily",
  "Four Times Daily",
  "At Bedtime",
  "Immediately",
];

const doseOptions = ["1", "1/2", "2", "5 ml", "10 ml", "15 ml"];

const instructionOptions = [
  "After Food",
  "Before Food",
  "With Water",
  "At Bedtime",
  "Empty Stomach",
  "After Breakfast",
  "After Lunch",
  "After Dinner",
];

/* =========================================================
   SHARED BUTTON STYLE
========================================================= */

const actionButtonSx = (minSm) => ({
  minWidth: { xs: 64, sm: minSm },
  px: { xs: 1.4, sm: 2 },
  py: { xs: 0.65, sm: 0.75 },
  borderRadius: 1.5,
  fontSize: { xs: "12px", sm: "13px" },
  fontWeight: 600,
  textTransform: "none",
  whiteSpace: "nowrap",
  bgcolor: "primary.main",
  color: WHITE,
  "&:hover": { bgcolor: "primary.dark" },
});

/* =========================================================
   PRINT PAGE STYLE (A4, no browser margins, colors kept)
========================================================= */

const PRINT_PAGE_STYLE = `
  @page {
    size: A4;
    margin: 0;
  }

  html, body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

/* =========================================================
   COMPONENT
========================================================= */

export default function PrescriptionUI(props) {
  const {
    isPatient,
    editable,
    apiData,
    isTodayAppointment,
    isDownloading,

    snackbar,
    setSnackbar,

    handleSavePrescription,
    downloadPdf,
    pdfRef,

    doctor,
    patient,
    dateNow,

    diagnosis,
    setDiagnosis,

    rows,
    setRows,
    addRow,
    removeRow,

    remark,
    setRemark,

    followUpDate,
    setFollowUpDate,

    qrImage,
  } = props;

  /* ---------- PRINT ---------- */

  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    // react-to-print v3+ :
    contentRef: printRef,
    // Agar v2 use kar rahe ho to upar wali line hata kar ye use karo:
    // content: () => printRef.current,

    documentTitle: `Prescription-${patient?.name || "patient"}`,
    pageStyle: PRINT_PAGE_STYLE,
  });

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        p:2,
        mt:1,
        bgcolor: "#F4F7F6",
        boxSizing: "border-box",
        overflowX: "hidden",
        overflowY: "visible",

        /* ---------- GLOBAL INPUT THEME ---------- */

        "& .MuiInputLabel-root.Mui-focused": {
          color: PRIMARY_COLOR,
        },
        "& .MuiOutlinedInput-root.Mui-focused fieldset": {
          borderColor: PRIMARY_COLOR,
        },
        "& .MuiInput-underline:after": {
          borderBottomColor: PRIMARY_COLOR,
        },
        "& .MuiCheckbox-root.Mui-checked": {
          color: PRIMARY_COLOR,
        },
        "& .MuiRadio-root.Mui-checked": {
          color: PRIMARY_COLOR,
        },
        "& .MuiSelect-select:focus": {
          backgroundColor: "transparent",
        },
        "& .MuiMenuItem-root.Mui-selected": {
          backgroundColor: "rgba(7, 135, 106, 0.10)",
          color: PRIMARY_COLOR,
        },
        "& .MuiMenuItem-root.Mui-selected:hover": {
          backgroundColor: "rgba(7, 135, 106, 0.16)",
        },
        "& .MuiChip-colorPrimary": {
          backgroundColor: PRIMARY_COLOR,
        },
      }}
    >
      {/* =====================================================
          TOP ACTION BUTTONS
      ====================================================== */}

      <Box
        sx={{
          width: "100%",
          minWidth: 0,
          display: isDownloading ? "none" : "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          flexWrap: "wrap",
          gap: { xs: 0.7, sm: 1 },
          mb: { xs: 1.2, sm: 1.5 },
        }}
      >
        {/* PRINT (ab window.print() nahi, PDF wala design print hoga) */}
        {!isPatient && (
          <Button
            onClick={handlePrint}
            variant="contained"
            disableElevation
            sx={actionButtonSx(80)}
          >
            Print
          </Button>
        )}

        {/* DOWNLOAD PDF */}
        <Button
          onClick={downloadPdf}
          variant="contained"
          disableElevation
          sx={actionButtonSx(100)}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Download PDF
          </Box>
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
            PDF
          </Box>
        </Button>

        {/* SAVE / UPDATE */}
        {!isPatient && editable && isTodayAppointment && (
          <Button
            variant="contained"
            disableElevation
            onClick={handleSavePrescription}
            sx={actionButtonSx(110)}
          >
            <Box
              component="span"
              sx={{ display: { xs: "none", sm: "inline" } }}
            >
              {apiData?.prescription
                ? "Update Prescription"
                : "Save Prescription"}
            </Box>
            <Box
              component="span"
              sx={{ display: { xs: "inline", sm: "none" } }}
            >
              {apiData?.prescription ? "Update" : "Save"}
            </Box>
          </Button>
        )}
      </Box>

      {/* =====================================================
          PRESCRIPTION PAPER (screen par editable UI)
      ====================================================== */}

      <Paper
        ref={pdfRef}
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 960,
          minWidth: 0,
          mx: "auto",
          p: {
            xs: isDownloading ? 2.5 : 1.5,
            sm: 3,
          },
          bgcolor: "#FFFFFF",
          borderRadius: { xs: 1, sm: 1.5 },
          border: isDownloading ? "none" : "1px solid",
          borderColor: "divider",
          boxShadow: isDownloading ? "none" : "0 2px 10px rgba(0,0,0,0.04)",
          display: "flex",
          flexDirection: "column",
          height: "auto",
          minHeight: "auto",
          boxSizing: "border-box",
          overflow: "visible",
        }}
      >
        {/* HEADER */}
        <Box sx={{ width: "100%", minWidth: 0 }}>
          <PrescriptionHeader doctor={doctor} />
        </Box>

        {/* PATIENT INFORMATION */}
        <Box sx={{ width: "100%", minWidth: 0 }}>
          <PatientInfo
            patient={patient}
            dateNow={dateNow}
            isDownloading={isDownloading}
          />
        </Box>

        {/* DIAGNOSIS */}
        <Box sx={{ width: "100%", minWidth: 0 }}>
          <DiagnosisSection
            diagnosis={diagnosis}
            editable={editable}
            setDiagnosis={setDiagnosis}
            isDownloading={isDownloading}
          />
        </Box>

        {/* MEDICINE TABLE */}
        <Box
          sx={{
            width: "100%",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            breakInside: "avoid",
            pageBreakInside: "avoid",
          }}
        >
          <Box
            sx={{
              width: "100%",
              minWidth: 0,
              flexShrink: 0,
              breakInside: "avoid",
              pageBreakInside: "avoid",
            }}
          >
            <MedicineTable
              rows={rows}
              editable={editable}
              isDownloading={isDownloading}
              addRow={addRow}
              removeRow={removeRow}
              setRows={setRows}
              optionsMap={{
                unit: unitOptions,
                freq: frequencyOptions,
                dose: doseOptions,
                instr: instructionOptions,
              }}
              inputStyle={inputStyle}
              autocompleteStyle={autocompleteStyle}
            />
          </Box>
        </Box>

        {/* FOOTER */}
        <Box
          sx={{
            mt: { xs: 2, sm: 2.5 },
            flexShrink: 0,
            width: "100%",
            breakInside: "avoid",
            pageBreakInside: "avoid",
          }}
        >
          <PrescriptionFooter
            remark={remark}
            setRemark={setRemark}
            followUpDate={followUpDate}
            setFollowUpDate={setFollowUpDate}
            editable={editable}
            isDownloading={isDownloading}
            dateInputStyle={dateInputStyle}
            datePickerPopupStyle={datePickerPopupStyle}
            doctor={doctor}
            qrImage={qrImage}
          />
        </Box>
      </Paper>

      {/* =====================================================
          PRINT ONLY VIEW
          - Screen se bahar rakha hai (display:none NAHI, warna print blank aayega)
          - Yehi PDF wala design print hota hai
      ====================================================== */}

      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          left: "-10000px",
          top: 0,
          pointerEvents: "none",
        }}
      >
        <div ref={printRef}>
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
      </Box>

      {/* =====================================================
          SNACKBAR
      ====================================================== */}

      <Snackbar
        open={snackbar?.open || false}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar?.severity || "success"}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar?.message || ""}
        </Alert>
      </Snackbar>
    </Box>
  );
}