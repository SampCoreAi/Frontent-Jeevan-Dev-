"use client";

import React from "react";

import {
  Box,
  Paper,
  Typography,
  Button,
} from "@mui/material";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import PrescriptionHeader from "./PrescriptionHeader";
import PrescriptionFooter from "./PrescriptionFooter";

import {
  PatientInfo,
  DiagnosisSection,
} from "./PatientInfo";

import MedicineTable from "./MedicineTable";

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

const doseOptions = [
  "1",
  "1/2",
  "2",
  "5 ml",
  "10 ml",
  "15 ml",
];

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

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,

        p: {
          xs: 1,
          sm: 1.5,
        },

        bgcolor: "#F4F7F6",

        boxSizing: "border-box",

        overflowX: "hidden",
        overflowY: "visible",

        /* =============================================
           GLOBAL INPUT THEME
        ============================================= */

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

          gap: {
            xs: 0.7,
            sm: 1,
          },

          mb: {
            xs: 1.2,
            sm: 1.5,
          },
        }}
      >
        {/* =========================
            PRINT
        ========================== */}

        {!isPatient && (
          <Button
            onClick={() => window.print()}
            variant="contained"
            disableElevation
            sx={{
              minWidth: {
                xs: 64,
                sm: 80,
              },

              px: {
                xs: 1.4,
                sm: 2,
              },

              py: {
                xs: 0.65,
                sm: 0.75,
              },

              borderRadius: 1.5,

              fontSize: {
                xs: "12px",
                sm: "13px",
              },

              fontWeight: 600,

              textTransform: "none",

              whiteSpace: "nowrap",

              bgcolor: "primary.main",

              color: WHITE,

              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            Print
          </Button>
        )}

        {/* =========================
            DOWNLOAD PDF
        ========================== */}

        <Button
          onClick={downloadPdf}
          variant="contained"
          disableElevation
          sx={{
            minWidth: {
              xs: 64,
              sm: 100,
            },

            px: {
              xs: 1.4,
              sm: 2,
            },

            py: {
              xs: 0.65,
              sm: 0.75,
            },

            borderRadius: 1.5,

            fontSize: {
              xs: "12px",
              sm: "13px",
            },

            fontWeight: 600,

            textTransform: "none",

            whiteSpace: "nowrap",

            bgcolor: "primary.main",

            color: WHITE,

            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          {/* DESKTOP */}

          <Box
            component="span"
            sx={{
              display: {
                xs: "none",
                sm: "inline",
              },
            }}
          >
            Download PDF
          </Box>

          {/* MOBILE */}

          <Box
            component="span"
            sx={{
              display: {
                xs: "inline",
                sm: "none",
              },
            }}
          >
            PDF
          </Box>
        </Button>

        {/* =========================
            SAVE / UPDATE
        ========================== */}

        {!isPatient &&
          editable &&
          isTodayAppointment && (
            <Button
              variant="contained"
              disableElevation
              onClick={handleSavePrescription}
              sx={{
                minWidth: {
                  xs: 64,
                  sm: 110,
                },

                px: {
                  xs: 1.4,
                  sm: 2,
                },

                py: {
                  xs: 0.65,
                  sm: 0.75,
                },

                borderRadius: 1.5,

                fontSize: {
                  xs: "12px",
                  sm: "13px",
                },

                fontWeight: 600,

                textTransform: "none",

                whiteSpace: "nowrap",

                bgcolor: "primary.main",

                color: WHITE,

                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              {/* DESKTOP */}

              <Box
                component="span"
                sx={{
                  display: {
                    xs: "none",
                    sm: "inline",
                  },
                }}
              >
                {apiData?.prescription
                  ? "Update Prescription"
                  : "Save Prescription"}
              </Box>

              {/* MOBILE */}

              <Box
                component="span"
                sx={{
                  display: {
                    xs: "inline",
                    sm: "none",
                  },
                }}
              >
                {apiData?.prescription
                  ? "Update"
                  : "Save"}
              </Box>
            </Button>
          )}
      </Box>

      {/* =====================================================
          PRESCRIPTION PAPER
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

          borderRadius: {
            xs: 1,
            sm: 1.5,
          },

          border: isDownloading
            ? "none"
            : "1px solid",

          borderColor: "divider",

          boxShadow: isDownloading
            ? "none"
            : "0 2px 10px rgba(0,0,0,0.04)",

          display: "flex",

          flexDirection: "column",

          height: "auto",

          // Fixed 1100px blank area removed
          minHeight: "auto",

          boxSizing: "border-box",

          overflow: "visible",
        }}
      >
        {/* =================================================
            PRESCRIPTION HEADER
        ================================================== */}

        <Box
          sx={{
            width: "100%",
            minWidth: 0,
          }}
        >
          <PrescriptionHeader doctor={doctor} />
        </Box>

        {/* =================================================
            PATIENT INFORMATION
        ================================================== */}

        <Box
          sx={{
            width: "100%",
            minWidth: 0,
          }}
        >
          <PatientInfo
            patient={patient}
            dateNow={dateNow}
            isDownloading={isDownloading}
          />
        </Box>

        {/* =================================================
            DIAGNOSIS
        ================================================== */}

        <Box
          sx={{
            width: "100%",
            minWidth: 0,
          }}
        >
          <DiagnosisSection
            diagnosis={diagnosis}
            editable={editable}
            setDiagnosis={setDiagnosis}
            isDownloading={isDownloading}
          />
        </Box>

        {/* =================================================
            RX + MEDICINE TABLE
        ================================================== */}

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
         
          {/* =========================
              MEDICINE TABLE
          ========================== */}

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

        {/* =================================================
            FOOTER
        ================================================== */}

        <Box
          sx={{
            mt: {
              xs: 2,
              sm: 2.5,
            },

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
          SNACKBAR
      ====================================================== */}

      <Snackbar
        open={snackbar?.open || false}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar?.severity || "success"}
          variant="filled"
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
        >
          {snackbar?.message || ""}
        </Alert>
      </Snackbar>
    </Box>
  );
}