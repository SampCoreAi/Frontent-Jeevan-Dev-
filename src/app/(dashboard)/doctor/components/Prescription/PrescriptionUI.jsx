"use client";

import React from "react";

import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
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


// =====================================================
// OPTIONS
// =====================================================

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


// =====================================================
// COMPONENT
// =====================================================

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
        // =============================================
        // MAIN CONTAINER
        // =============================================

        width: "100%",
        maxWidth: "100%",
        minWidth: 0,

        p: {
          xs: 1,
          sm: 1,
        },

        backgroundColor: "#e4eceb",

        boxSizing: "border-box",

        overflowX: "hidden",
        overflowY: "visible",

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
          backgroundColor: "rgba(30, 102, 88, 0.12)",
          color: PRIMARY_COLOR,
        },

        "& .MuiMenuItem-root.Mui-selected:hover": {
          backgroundColor: "rgba(30, 102, 88, 0.18)",
        },

        "& .MuiChip-colorPrimary": {
          backgroundColor: PRIMARY_COLOR,
        },
      }}
    >

      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,

          display: "flex",

          justifyContent: "flex-end",

          alignItems: "center",

          flexWrap: "nowrap",

          gap: {
            xs: 0.5,
            sm: 1,
          },

          mb: 2,

          boxSizing: "border-box",
        }}
      >

        {/* ================= PRINT ================= */}

        {!isPatient && (
          <Button
            onClick={() => window.print()}
            variant="contained"
            sx={{
              minWidth: {
                xs: 0,
                sm: 80,
              },

              px: {
                xs: 1.5,
                sm: 2,
              },

              py: {
                xs: 0.8,
                sm: 1,
              },

              fontSize: {
                xs: "12px",
                sm: "14px",
              },

              whiteSpace: "nowrap",

              backgroundColor: PRIMARY_COLOR,

              color: WHITE,

              "&:hover": {
                backgroundColor: PRIMARY_COLOR,
              },

              "&:focus": {
                outline: "none",
              },
            }}
          >
            Print
          </Button>
        )}


        {/* ================= PDF ================= */}

        <Button
          onClick={downloadPdf}
          variant="contained"
          sx={{
            minWidth: {
              xs: 0,
              sm: 80,
            },

            px: {
              xs: 1.5,
              sm: 2,
            },

            py: {
              xs: 0.8,
              sm: 1,
            },

            fontSize: {
              xs: "12px",
              sm: "14px",
            },

            whiteSpace: "nowrap",

            backgroundColor: PRIMARY_COLOR,

            color: WHITE,

            "&:hover": {
              backgroundColor: PRIMARY_COLOR,
            },

            "&:focus": {
              outline: "none",
            },
          }}
        >

          {/* Desktop */}

          <Box
            component="span"
            sx={{
              display: {
                xs: "none",
                sm: "inline",
              },
            }}
          >
            Download Pdf
          </Box>


          {/* Mobile */}

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


        {/* ================= SAVE / UPDATE ================= */}

        {!isPatient &&
          editable &&
          isTodayAppointment && (
            <Button
              variant="contained"
              onClick={handleSavePrescription}
              sx={{
                minWidth: {
                  xs: 0,
                  sm: 80,
                },

                px: {
                  xs: 1.5,
                  sm: 2,
                },

                py: {
                  xs: 0.8,
                  sm: 1,
                },

                fontSize: {
                  xs: "12px",
                  sm: "14px",
                },

                whiteSpace: "nowrap",

                backgroundColor: PRIMARY_COLOR,

                color: WHITE,

                "&:hover": {
                  backgroundColor: PRIMARY_COLOR,
                },

                "&:focus": {
                  outline: "none",
                },
              }}
            >

              {/* Desktop */}

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


              {/* Mobile */}

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
      ===================================================== */}

      <Paper
        ref={pdfRef}
        sx={{
          width: "100%",
          maxWidth: 960,
          minWidth: 0,

          mx: "auto",

          p: {
            xs: 1.5,
            sm: 3,
          },

          borderRadius: 0.5,

          backgroundColor: "#fff",

          display: "flex",

          flexDirection: "column",

          /*
           * IMPORTANT:
           * Previously fixed height was:
           *
           * height: isDownloading ? "1100px" : "auto"
           *
           * This can cause flex layout shifting while
           * generating the PDF.
           */

          height: "auto",

          minHeight: isDownloading
            ? "1100px"
            : "auto",

          boxSizing: "border-box",

          overflowX: "hidden",

          /*
           * Do not hide vertical content during PDF generation.
           */
          overflowY: "visible",
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <Box
          sx={{
            width: "100%",
            minWidth: 0,
          }}
        >
          <PrescriptionHeader
            doctor={doctor}
          />
        </Box>


        {/* =================================================
            PATIENT INFO
        ================================================= */}

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
        ================================================= */}

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
        ================================================= */}

        <Box
          sx={{
            width: "100%",
            minWidth: 0,

            display: "flex",

            flexDirection: "column",

            alignItems: "flex-start",

            /*
             * Prevent Rx and table from getting separated
             * during PDF rendering.
             */
            breakInside: "avoid",
            pageBreakInside: "avoid",
          }}
        >

          {/* ================= RX SYMBOL ================= */}

          <Typography
            component="div"
            sx={{
              mt: 2,
              mb: 1,

              color: "#007BFF",

              fontSize: "30px",

              lineHeight: 1,

              height: "32px",

              flexShrink: 0,
            }}
          >
            ℞
          </Typography>


          {/* ================= MEDICINE TABLE ================= */}

          <Box
            sx={{
              width: "100%",
              minWidth: 0,

              /*
               * Keep the table immediately below Rx.
               */
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
        ================================================= */}

        <Box
          sx={{
            mt: isDownloading ? "auto" : 3,

            flexShrink: 0,

            width: "100%",
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
      ===================================================== */}

      <Snackbar
        open={snackbar.open}
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
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
}