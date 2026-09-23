"use client";

import React, { useEffect, useRef, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import api from "../../../../../utils/axiosInstance";

import { useReactToPrint } from "react-to-print";

import PrescriptionHeader from "./PrescriptionHeader";
import PrescriptionFooter from "./PrescriptionFooter";
import { PatientInfo, DiagnosisSection } from "./PatientInfo";
import MedicineTable from "./MedicineTable";
import LabTestRequestForm from "./LabTestRequestForm";

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
  fontSize: "12px",
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
  const [labTestSummary, setLabTestSummary] = useState({ labName: "", tests: [] });
  const [labTestResetKey, setLabTestResetKey] = useState(0);
  const [patientReports, setPatientReports] = useState([]);
  const [patientLabRequests, setPatientLabRequests] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [cancellingRequestId, setCancellingRequestId] = useState(null);
  const [cancelRequest, setCancelRequest] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

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
    patientId,
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

  const refreshPatientLabData = async () => {
    if (!patientId || isPatient) return;

    try {
      setReportsLoading(true);
      const [reportsResponse, requestsResponse] = await Promise.all([
        api.get("/api/lab-reports"),
        api.get("/api/lab-requests/doctor"),
      ]);
      const reports = reportsResponse?.data?.data || [];
      const requests = requestsResponse?.data?.data || [];
      setPatientReports(
        reports.filter((report) => Number(report.patientId || report.patient_id) === Number(patientId))
      );
      setPatientLabRequests(
        requests.filter((request) => Number(request.patient_id || request.patientId) === Number(patientId))
      );
    } catch (requestError) {
      setSnackbar((current) => ({
        ...current,
        open: true,
        severity: "error",
        message: requestError?.response?.data?.message || "Unable to refresh lab reports.",
      }));
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    if (!patientId || isPatient) return;

    const loadPatientReports = async () => {
      try {
        setReportsLoading(true);
        const [reportsResponse, requestsResponse] = await Promise.all([
          api.get("/api/lab-reports"),
          api.get("/api/lab-requests/doctor"),
        ]);
        const reports = reportsResponse?.data?.data || [];
        const requests = requestsResponse?.data?.data || [];
        setPatientReports(
          reports.filter((report) => Number(report.patientId || report.patient_id) === Number(patientId))
        );
        setPatientLabRequests(
          requests.filter((request) => Number(request.patient_id || request.patientId) === Number(patientId))
        );
      } catch {
        setPatientReports([]);
        setPatientLabRequests([]);
      } finally {
        setReportsLoading(false);
      }
    };

    loadPatientReports();
  }, [isPatient, patientId]);

  const getRequestNote = (request = {}) => request.latest_status_note || request.latestStatusNote || request.status_note || request.note || request.reason || request.statusReason || "";

  const labReportRows = patientLabRequests.flatMap((request) => {
  let tests = request.requested_tests || "-";

  if (typeof tests === "string") {
    try {
      const parsed = JSON.parse(tests);
      tests = Array.isArray(parsed) ? parsed : [tests];
    } catch {
      tests = [tests];
    }
  }

  if (!Array.isArray(tests)) tests = [String(tests)];

  const matchedReport = patientReports.find(
    (item) =>
      Number(item.requestId || item.testRequestId || item.test_request_id) ===
      Number(request.id)
  );

  return tests.map((test, index) => ({
    id: `${request.id}-${index}`,
    labName: request.lab_name,
    testName: test,
    requestId: request.id,
    status: request.status || "PENDING",
    createdAt: request.created_at,
    reportDate:
      request.expected_report_at ||
      request.expectedReportAt ||
      matchedReport?.createdAt ||
      matchedReport?.created_at ||
      matchedReport?.uploadedAt ||
      matchedReport?.uploaded_at ||
      request.created_at,
    report: matchedReport,
  }));
});

  const cancelPendingRequest = async (requestId, reason = null) => {
    try {
      setCancellingRequestId(requestId);
      await api.patch(`/api/lab-requests/${requestId}/cancel`, { note: reason || null });
      setPatientLabRequests((current) => current.map((request) => (
        request.id === requestId ? { ...request, status: "CANCELLED" } : request
      )));
    } catch (requestError) {
      setSnackbar((current) => ({
        ...current,
        open: true,
        severity: "error",
        message: requestError?.response?.data?.message || "Unable to cancel lab request.",
      }));
    } finally {
      setCancellingRequestId(null);
    }
  };
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
        {!isPatient && (
          <LabTestRequestForm
            patientId={patientId}
            storageKey={`doctor-lab-test-${apiData?.appointment?.id || apiData?.appointment?.appointment_id || patientId || "unknown"}`}
            resetKey={labTestResetKey}
            onSummaryChange={setLabTestSummary}
          />
        )}

        {!isPatient && (
          <Button
            variant="outlined"
            startIcon={<DescriptionOutlined />}
            onClick={() => {
              setReportsOpen(true);
              refreshPatientLabData();
            }}
            sx={{ textTransform: "none", borderRadius: 1.5 }}
          >
            Lab Reports{labReportRows.length ? ` (${labReportRows.length})` : ""}
          </Button>
        )}

        {/* =========================
            PRINT
        ========================== */}

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

      <Dialog open={reportsOpen} onClose={() => setReportsOpen(false)} fullWidth maxWidth="sm" aria-labelledby="lab-reports-dialog-title">
        <DialogTitle id="lab-reports-dialog-title">Lab Reports</DialogTitle>
        <DialogContent dividers>
          {reportsLoading ? (
            <Box display="flex" justifyContent="center" py={3}><CircularProgress size={24} /></Box>
          ) : labReportRows.length ? (
            <Box sx={{ display: "grid", gap: 0.75 }}>
              {labReportRows.map((row) => (
                <Box key={row.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, minWidth: 0, py: 0.5, borderBottom: "1px solid", borderColor: "divider" }}>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {row.labName || "Lab"} - {row.testName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "11px", display: "block" }}>
                      Created: {row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}
                    </Typography>
                    <Box
  sx={{
    mt: 0.5,
    display: "flex",
    alignItems: "center",
    gap: 0.7,
    flexWrap: "wrap",
  }}
>
  <Box
    component="span"
    sx={{
      px: 1,
      py: 0.3,
      borderRadius: "6px",
      fontSize: "10.5px",
      fontWeight: 700,
      lineHeight: 1.4,
      bgcolor:
        row.status === "COMPLETED"
          ? "#E8F5E9"
          : row.status === "REPORT_UPLOADED"
          ? "#E3F2FD"
          : row.status === "PROCESSING"
          ? "#EDE7F6"
          : row.status === "SAMPLE_COLLECTED"
          ? "#E0F7FA"
          : row.status === "APPROVED"
          ? "#E8F5E9"
          : row.status === "CANCELLED"
          ? "#FFEBEE"
          : row.status === "REJECTED"
          ? "#FFF3E0"
          : "#FFF8E1",
      color:
        row.status === "COMPLETED"
          ? "#2E7D32"
          : row.status === "REPORT_UPLOADED"
          ? "#1565C0"
          : row.status === "PROCESSING"
          ? "#6A1B9A"
          : row.status === "SAMPLE_COLLECTED"
          ? "#00838F"
          : row.status === "APPROVED"
          ? "#2E7D32"
          : row.status === "CANCELLED"
          ? "#D32F2F"
          : row.status === "REJECTED"
          ? "#E65100"
          : "#F57F17",
    }}
  >
    {row.status?.replaceAll("_", " ")}
  </Box>

  {row.reportDate && (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ fontSize: "11px" }}
    >
      Report Date: {new Date(row.reportDate).toLocaleString()}
    </Typography>
  )}
</Box>
                    {(row.status === "REJECTED" || row.status === "CANCELLED") && (
                      <Typography variant="caption" color={row.status === "CANCELLED" ? "error.main" : "warning.main"} sx={{ fontSize: "11px", display: "block", fontWeight: 600 }}>
                        Reason: {getRequestNote(patientLabRequests.find((request) => Number(request.id) === Number(row.requestId))) || "No reason provided."}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexShrink: 0 }}>
                    {row.report?.downloadUrl ? (
                      <Button size="small" href={row.report.downloadUrl} target="_blank" rel="noreferrer" sx={{ textTransform: "none", flexShrink: 0, fontSize: "12px", minHeight: 32, minWidth: 0, px: 1 }}>
                        Open Report
                      </Button>
                    ) : null}
                    {row.status === "PENDING" ? (
                      <Button
                      size="small"
                      color="error"
                      onClick={() => setCancelRequest(row)}
                      disabled={cancellingRequestId === row.requestId}
                      sx={{ textTransform: "none", flexShrink: 0, fontSize: "12px", minHeight: 32, minWidth: 0, px: 1 }}
                      >
                        {cancellingRequestId === row.requestId ? "Cancelling..." : "Cancel"}
                      </Button>
                    ) : null}
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary" variant="body2">No lab test requests found for this patient.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportsOpen(false)} sx={{ textTransform: "none" }}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(cancelRequest)}
        onClose={() => !cancellingRequestId && setCancelRequest(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: 18, fontWeight: 700, pb: 1 }}>Cancel lab test request?</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 1.25, pt: 1.5, px: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {cancelRequest?.testName} sent to {cancelRequest?.labName || "the selected lab"} will be cancelled. The lab will see the cancelled request in its history.
          </Typography>
          <TextField
            multiline
            minRows={2}
            size="small"
            label="Reason / comment"
            value={cancelReason}
            onChange={(event) => setCancelReason(event.target.value)}
            placeholder="Please tell why this request is being cancelled."
          />
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1.5, pt: 1 }}>
          <Button onClick={() => setCancelRequest(null)} disabled={Boolean(cancellingRequestId)} sx={{ textTransform: "none" }}>
            Keep Request
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              if (!cancelRequest) return;
              await cancelPendingRequest(cancelRequest.requestId, cancelReason.trim() || null);
              setCancelReason("");
              setCancelRequest(null);
            }}
            disabled={Boolean(cancellingRequestId)}
            sx={{ textTransform: "none" }}
          >
            {cancellingRequestId ? "Cancelling..." : "Cancel Request"}
          </Button>
        </DialogActions>
      </Dialog>

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

          {!isDownloading && labTestSummary.tests.length > 0 && (
            <Box
              sx={{
                width: "100%",
                mb: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 0,
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "primary.main", flexShrink: 0 }}>
                Test Name
              </Typography>
              {labTestSummary.labName && (
                <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                  Lab: {labTestSummary.labName}:-
                </Typography>
              )}
              <Typography variant="body2" sx={{ color: "text.primary", flexShrink: 0 }}>
                {labTestSummary.tests.join(", ")}
              </Typography>
            </Box>
          )}

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