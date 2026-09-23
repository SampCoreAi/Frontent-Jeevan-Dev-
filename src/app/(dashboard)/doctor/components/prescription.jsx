"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";

import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Button,
  Divider,
  Autocomplete,
} from "@mui/material";

import RemoveIcon from "@mui/icons-material/Remove";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  LocalizationProvider,
} from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";
import Alert from "@mui/material/Alert";

import {
  appointmentService,
  prescriptionService,
} from "../services/api";

const PRIMARY_COLOR = "#1E6658";
const WHITE = "#fff";
const TEXT_COLOR = "#000";
const BORDER_COLOR = "#777";

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

  const optionsMap = {
    unit: unitOptions,
    freq: frequencyOptions,
    dose: doseOptions,
    instr: instructionOptions,
  };

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
  medicine_name: row.name,
  dose: row.dose,
  frequency: row.freq,
  duration: "5 days",
  instructions: row.instr,
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

  const addRow = () =>
    setRows([
      ...rows,
      {
        name: "",
        dose: "",
        unit: "Tablet",
        freq: "OD",
        instr: "",
      },
    ]);

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

  // =========================================================
  // DOWNLOAD PDF
  // =========================================================

  const downloadPdf = async () => {
    setIsDownloading(true);

    await waitForImages(pdfRef.current);

    const html2pdf =
      (await import("html2pdf.js")).default;

    await html2pdf()
      .set({
        margin: [0, 0, 0, 0],

        filename: "prescription.pdf",

        image: {
          type: "jpeg",
          quality: 1,
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          scrollY: 0,
        },

        jsPDF: {
          unit: "px",
          format: [794, 1123],
          orientation: "portrait",
        },

        pagebreak: {
          mode: "avoid-all",
        },
      })
      .from(pdfRef.current)
      .save();

    setIsDownloading(false);
  };

  // =========================================================
  // COMMON INPUT STYLE
  // =========================================================

  const inputStyle = {
    "& .MuiInputBase-input": {
      color: TEXT_COLOR,
    },

    "& .MuiInputLabel-root": {
      color: TEXT_COLOR,
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: PRIMARY_COLOR,
    },

    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: BORDER_COLOR,
      },

      "&:hover fieldset": {
        borderColor: PRIMARY_COLOR,
      },

      "&.Mui-focused fieldset": {
        borderColor: PRIMARY_COLOR,
        borderWidth: "2px",
      },
    },

    // Standard TextField
    "& .MuiInput-underline:before": {
      borderBottomColor: BORDER_COLOR,
    },

    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottomColor: PRIMARY_COLOR,
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: PRIMARY_COLOR,
    },
  };

  // =========================================================
  // AUTOCOMPLETE STYLE
  // =========================================================

  const autocompleteStyle = {
    "& .MuiInputBase-root": {
      color: TEXT_COLOR,
    },

    "& .MuiInput-underline:before": {
      borderBottomColor: BORDER_COLOR,
    },

    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottomColor: PRIMARY_COLOR,
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: PRIMARY_COLOR,
    },

    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: BORDER_COLOR,
      },

      "&:hover fieldset": {
        borderColor: PRIMARY_COLOR,
      },

      "&.Mui-focused fieldset": {
        borderColor: PRIMARY_COLOR,
      },
    },

    "& .MuiAutocomplete-popupIndicator": {
      color: PRIMARY_COLOR,
    },

    "& .MuiAutocomplete-clearIndicator": {
      color: PRIMARY_COLOR,
    },
  };

  // =========================================================
  // DATE PICKER INPUT STYLE
  // =========================================================

  const dateInputStyle = {
    "& .MuiInputBase-input": {
      color: TEXT_COLOR,
    },

    "& .MuiInputLabel-root": {
      color: TEXT_COLOR,
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: PRIMARY_COLOR,
    },

    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: BORDER_COLOR,
      },

      "&:hover fieldset": {
        borderColor: PRIMARY_COLOR,
      },

      "&.Mui-focused fieldset": {
        borderColor: PRIMARY_COLOR,
        borderWidth: "2px",
      },
    },

    "& .MuiIconButton-root": {
      color: PRIMARY_COLOR,
    },

    "& .MuiIconButton-root:hover": {
      color: PRIMARY_COLOR,
      backgroundColor:
        "rgba(30, 102, 88, 0.08)",
    },

    "& .MuiSvgIcon-root": {
      color: PRIMARY_COLOR,
    },
  };

  // =========================================================
  // DATE PICKER POPUP STYLE
  // =========================================================

  const datePickerPopupStyle = {
    "& .MuiPaper-root": {
      backgroundColor: WHITE,
    },

    "& .MuiPickersCalendarHeader-root": {
      color: TEXT_COLOR,
    },

    "& .MuiPickersCalendarHeader-label": {
      color: TEXT_COLOR,
      fontWeight: 600,
    },

    "& .MuiPickersCalendarHeader-switchViewButton": {
      color: PRIMARY_COLOR,
    },

    "& .MuiPickersArrowSwitcher-button": {
      color: PRIMARY_COLOR,
    },

    "& .MuiPickersArrowSwitcher-button:hover": {
      backgroundColor:
        "rgba(30, 102, 88, 0.08)",
    },

    // Week days
    "& .MuiDayCalendar-weekDayLabel": {
      color: TEXT_COLOR,
    },

    // Normal dates
    "& .MuiPickersDay-root": {
      color: TEXT_COLOR,
    },

    // Selected date
    "& .MuiPickersDay-root.Mui-selected": {
      backgroundColor:
        `${PRIMARY_COLOR} !important`,
      color: `${WHITE} !important`,
    },

    "& .MuiPickersDay-root.Mui-selected:hover": {
      backgroundColor:
        `${PRIMARY_COLOR} !important`,
    },

    // Today
    "& .MuiPickersDay-root.MuiPickersDay-today": {
      borderColor: PRIMARY_COLOR,
    },

    // Today / Cancel / OK buttons
    "& .MuiPickersLayout-actionBar button": {
      color:
        `${PRIMARY_COLOR} !important`,
    },

    "& .MuiDialogActions-root button": {
      color:
        `${PRIMARY_COLOR} !important`,
    },

    // Icons
    "& .MuiSvgIcon-root": {
      color: PRIMARY_COLOR,
    },

    // Focus
    "& .MuiButtonBase-root:focus": {
      outline: "none",
    },

    "& .MuiButtonBase-root.Mui-focusVisible": {
      outline:
        `2px solid ${PRIMARY_COLOR}`,
      outlineOffset: "-2px",
    },

    // Month
    "& .MuiPickersMonth-monthButton": {
      color: TEXT_COLOR,
    },

    "& .MuiPickersMonth-monthButton.Mui-selected": {
      backgroundColor:
        `${PRIMARY_COLOR} !important`,
      color:
        `${WHITE} !important`,
    },

    // Year
    "& .MuiPickersYear-yearButton": {
      color: TEXT_COLOR,
    },

    "& .MuiPickersYear-yearButton.Mui-selected": {
      backgroundColor:
        `${PRIMARY_COLOR} !important`,
      color:
        `${WHITE} !important`,
    },
  };

  return (
    <Box
      sx={{
        p: 2,
        background: "#f3f6fb",

        // =====================================================
        // GLOBAL MUI GREEN OVERRIDES
        // =====================================================

        "& .MuiInputLabel-root.Mui-focused": {
          color: PRIMARY_COLOR,
        },

        "& .MuiOutlinedInput-root.Mui-focused fieldset": {
          borderColor: PRIMARY_COLOR,
        },

        "& .MuiInput-underline:after": {
          borderBottomColor: PRIMARY_COLOR,
        },

        // Checkbox
        "& .MuiCheckbox-root.Mui-checked": {
          color: PRIMARY_COLOR,
        },

        // Radio
        "& .MuiRadio-root.Mui-checked": {
          color: PRIMARY_COLOR,
        },

        // Select
        "& .MuiSelect-select:focus": {
          backgroundColor: "transparent",
        },

        // Menu selected
        "& .MuiMenuItem-root.Mui-selected": {
          backgroundColor:
            "rgba(30, 102, 88, 0.12)",
          color: PRIMARY_COLOR,
        },

        "& .MuiMenuItem-root.Mui-selected:hover": {
          backgroundColor:
            "rgba(30, 102, 88, 0.18)",
        },

        // Chips
        "& .MuiChip-colorPrimary": {
          backgroundColor: PRIMARY_COLOR,
        },
      }}
    >
      {/* ======================================================
          TOOLBAR
      ====================================================== */}

      <Box
        sx={{
          textAlign: "right",
          mb: 2,
        }}
      >
        {!isPatient && (
          <Button
            onClick={() => window.print()}
            variant="contained"
            sx={{
              mr: 1,
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

        

        <Button
          onClick={downloadPdf}
          variant="contained"
          sx={{
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
          Download Pdf
        </Button>

{!isPatient && isEditable && isTodayAppointment && (
  <Button
    variant="contained"
    onClick={handleSavePrescription}
    sx={{
      backgroundColor: PRIMARY_COLOR,
      color: WHITE,
      marginLeft: 1,

      "&:hover": {
        backgroundColor: PRIMARY_COLOR,
      },

      "&:focus": {
        outline: "none",
      },
    }}
  >
  {apiData?.prescription
  ? "Update Prescription"
  : "Save Prescription"}
  </Button>
)}
      </Box>

      {/* ======================================================
          PRESCRIPTION PAPER
      ====================================================== */}

      <Paper
        ref={pdfRef}
        sx={{
          p: 3,
          borderRadius: 0.5,
          maxWidth: 960,
          mx: "auto",
          background: "#fff",

          display: "flex",
          flexDirection: "column",

          height: "auto",
          overflow: "hidden",
        }}
      >
        {/* ====================================================
            DOCTOR HEADER
        ==================================================== */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            {/* DOCTOR NAME — NOT CHANGED */}
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary"
            >
              {doctor?.name}
            </Typography>

            <Typography variant="body2">
              {doctor?.qualification} (
              {doctor?.specialization})
            </Typography>

            <Typography variant="body2">
              Reg. No:{" "}
              {doctor?.medical_license_no}
            </Typography>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="body2"
              sx={{ mt: 1 }}
            >
              {
                doctor?.hospital_detail?.[0]
                  ?.hospitalName
              }
            </Typography>

            <Typography
              variant="body2"
              sx={{ mt: 1 }}
            >
              {
                doctor?.hospital_detail?.[0]
                  ?.city
              }
              ,{" "}
              {
                doctor?.hospital_detail?.[0]
                  ?.state
              }
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ====================================================
            PATIENT INFO
        ==================================================== */}

        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell>
                <b>Patient Name:</b>{" "}
                {patient?.name}
              </TableCell>

              <TableCell>
                <b>Age:</b>{" "}
                {patient?.age}
              </TableCell>

              <TableCell>
                <b>Date/Time:</b>{" "}
                {dateNow}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <b>Gender:</b>{" "}
                {patient?.gender}
              </TableCell>

              <TableCell>
                <b>Weight:</b>{" "}
                {patient?.weight}
              </TableCell>

              <TableCell>
                <b>Height:</b>{" "}
                {patient?.height}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* ====================================================
            MEDICAL INFO
        ==================================================== */}

     <Table size="small">
  <TableBody>
    <TableRow>
      <TableCell>
        <Box
          display="flex"
          alignItems="flex-start"
          gap={2}
        >
          <Typography
            fontWeight="bold"
            fontSize={14}
            sx={{ mt: 1 }}
          >
            Diagnosis:
          </Typography>

          <Box sx={{ flex: 1 }}>
            <TextField
              variant="standard"
              fullWidth
              multiline
              value={diagnosis}
              disabled={!editable}
              onChange={(e) => {
                if (e.target.value.length <= 250) {
                  setDiagnosis(e.target.value);
                }
              }}
              inputProps={{
                maxLength: 250,
                style: {
                  fontSize: 13,
                },
              }}
            sx={{
      "& .MuiFormHelperText-root": {
        color: "black",
      },
    }}
              helperText={`${diagnosis.length}/250 characters`}
            />
          </Box>
        </Box>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>

        {/* ====================================================
            RX SYMBOL
            KEEP BLUE — AS REQUESTED
        ==================================================== */}

        <Typography
          variant="h5"
          sx={{
            mt: 2,
            color: "#007BFF",
          }}
        >
          ℞
        </Typography>

        {/* ====================================================
            MEDICINE TABLE
        ==================================================== */}

        <Box sx={{ minHeight: "350px" }}>
          <Table
            size="small"
            sx={{
              mt: 1,

              "& th": {
                backgroundColor: "#f0f4f9",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 60 }}>
                  S.No
                </TableCell>

                <TableCell sx={{ width: 240 }}>
                  Medicine Name
                </TableCell>

                <TableCell sx={{ width: 120 }}>
                  Dose
                </TableCell>

                <TableCell sx={{ width: 140 }}>
                  Unit
                </TableCell>

                <TableCell sx={{ width: 140 }}>
                  Frequency
                </TableCell>

                <TableCell sx={{ width: 260 }}>
                  Instructions
                </TableCell>

                <TableCell sx={{ width: 60 }} />

                <TableCell />
              </TableRow>
            </TableHead>

            <TableBody>
              {(isDownloading
                ? rows.filter(
                  (row) =>
                    row.name ||
                    row.dose ||
                    row.unit ||
                    row.freq ||
                    row.instr
                )
                : rows
              ).map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    {idx + 1}
                  </TableCell>

                  {[
                    "name",
                    "dose",
                    "unit",
                    "freq",
                    "instr",
                  ].map((field) => (
                    <TableCell key={field}>
                      {field === "name" ? (
                        <TextField
                          variant="standard"
                          fullWidth
                          disabled={!editable}
                          value={row.name}
                          onChange={(e) => {
                            const newRows =
                              [...rows];

                            newRows[idx].name =
                              e.target.value;

                            setRows(newRows);
                          }}
                          sx={inputStyle}
                        />
                      ) : (
                        <Autocomplete
                          freeSolo
                          fullWidth
                          options={
                            optionsMap[field]
                          }
                          value={
                            row[field] || ""
                          }
                          onChange={(
                            event,
                            newValue
                          ) => {
                            const newRows =
                              [...rows];

                            newRows[idx][field] =
                              newValue || "";

                            setRows(newRows);
                          }}
                          onInputChange={(
                            event,
                            newInputValue
                          ) => {
                            const newRows =
                              [...rows];

                            newRows[idx][field] =
                              newInputValue;

                            setRows(newRows);
                          }}
                          renderInput={(
                            params
                          ) => (
                            <TextField
                              {...params}
                              variant="standard"
                              fullWidth
                              size="small"
                              sx={
                                autocompleteStyle
                              }
                            />
                          )}
                          sx={
                            autocompleteStyle
                          }
                        />
                      )}
                    </TableCell>
                  ))}

                  <TableCell>
                    {!isDownloading &&
                      editable && (
                        <IconButton
                          color="error"
                          onClick={() =>
                            removeRow(idx)
                          }
                        >
                          <RemoveIcon />
                        </IconButton>
                      )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* ==================================================
              ADD MEDICINE
          ================================================== */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 1,
            }}
          >
            {!isDownloading &&
              editable && (
                <Button
                  variant="outlined"
                  onClick={addRow}
                  sx={{
                    color: PRIMARY_COLOR,
                    borderColor:
                      PRIMARY_COLOR,

                    "&:hover": {
                      color: PRIMARY_COLOR,
                      borderColor:
                        PRIMARY_COLOR,
                      backgroundColor:
                        "rgba(30, 102, 88, 0.08)",
                    },

                    "&:focus": {
                      outline: "none",
                    },

                    "&.Mui-focusVisible": {
                      outline:
                        `2px solid ${PRIMARY_COLOR}`,
                    },
                  }}
                >
                  + Add Medicine
                </Button>
              )}
          </Box>
        </Box>

        {/* ====================================================
            FOOTER DIVIDER
        ==================================================== */}

        <Divider
          sx={{
            my: 3,
            borderColor: "#ccc",
          }}
        />

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <Box sx={{ mt: 3 }}>
          {/* ==================================================
              REMARK
          ================================================== */}

          <Box sx={{ mb: 2 }}>
            <Typography>
              <strong>Remark:</strong>
            </Typography>

            {!isDownloading ? (
              <TextField
                fullWidth
                disabled={!editable}
                value={remark}
                onChange={(e) =>
                  setRemark(e.target.value)
                }
                sx={inputStyle}
              />
            ) : (
              <Typography>
                {remark || " "}
              </Typography>
            )}
          </Box>

          {/* ==================================================
              FOLLOW UP DATE
          ================================================== */}

          <Box sx={{ mb: 2 }}>
            <Typography>
              <strong>
                Next Follow-up Date:
              </strong>
            </Typography>

            {!isDownloading ? (
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
              >
                <DatePicker
                  value={followUpDate}
                  disabled={!editable}
                  onChange={(newDate) =>
                    setFollowUpDate(newDate)
                  }
                  format="DD-MM-YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      sx: dateInputStyle,
                    },

                    popper: {
                      sx: datePickerPopupStyle,
                    },

                    desktopPaper: {
                      sx:
                        datePickerPopupStyle,
                    },

                    mobilePaper: {
                      sx:
                        datePickerPopupStyle,
                    },

                    layout: {
                      sx:
                        datePickerPopupStyle,
                    },
                  }}
                />
              </LocalizationProvider>
            ) : (
              <Typography>
                {followUpDate
                  ? followUpDate.format(
                    "DD-MMM-YYYY"
                  )
                  : " "}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ==================================================
              QR + SIGNATURE
          ================================================== */}

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "flex-start",
              mt: 3,
            }}
          >
            {/* QR CODE */}
            <Box
              sx={{
                width: 100,
                height: 100,
                border: "1px solid #ddd",
                borderRadius: 0.5,
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                backgroundColor: "#fff",
              }}
            >
              {qrImage ? (
                <img
                  src={qrImage}
                  alt="Doctor QR"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Typography variant="caption">
                  No QR
                </Typography>
              )}
            </Box>

            {/* DOCTOR SIGNATURE */}
            <Box
              sx={{
                textAlign: "right",
                flexGrow: 1,
                ml: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  color: "#333",
                  mb: 1,
                }}
              >
                ___________________________
              </Typography>

              {/* DOCTOR NAME — NOT CHANGED */}
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                {doctor?.name}
              </Typography>

              <Typography
                sx={{
                  fontSize: 14,
                  color: "#555",
                }}
              >
                {doctor?.qualification}{" "}
                (Internal Medicine)
              </Typography>
            </Box>
          </Box>

          {/* ==================================================
              FOOTER INFO
          ================================================== */}

          <Typography
            variant="caption"
            align="center"
            sx={{
              display: "block",
              mt: 4,
              color: "#666",
              fontSize: 12,
              borderTop:
                "1px solid #ddd",
              pt: 1,
            }}
          >
            For Appointment:{" "}
            <strong>
              +91 {doctor?.mobile}
            </strong>{" "}
            &nbsp;|&nbsp;{" "}
            {
              doctor?.hospital_detail?.[0]
                ?.flatPlotNo
            }
            ,{" "}
            {
              doctor?.hospital_detail?.[0]
                ?.areaLocality
            }{" "}
            ,{" "}
            {
              doctor?.hospital_detail?.[0]
                ?.buildingSociety
            }{" "}
            ,{" "}
            {
              doctor?.hospital_detail?.[0]
                ?.district
            }{" "}
            ,{" "}
            {
              doctor?.hospital_detail?.[0]
                ?.city
            }
            ,{" "}
            {
              doctor?.hospital_detail?.[0]
                ?.pinCode
            }
            ,{" "}
            {
              doctor?.hospital_detail?.[0]
                ?.state
            }{" "}
            &nbsp;|&nbsp;
            <br />
            Timings:{" "}
            {
              doctor?.availability?.[0]
                ?.startTime
            }{" "}
            -{" "}
            {
              doctor?.availability?.[0]
                ?.endTime
            }{" "}
            (
            {
              doctor?.availability?.[0]
                ?.day
            }
            )
          </Typography>
        </Box>
      </Paper>

      {/* ======================================================
          SNACKBAR
      ====================================================== */}

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