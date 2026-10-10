"use client";

import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

const SAMPLE_TYPES = [
  "BLOOD",
  "URINE",
  "SERUM",
  "PLASMA",
  "SWAB",
  "STOOL",
  "SPUTUM",
  "OTHER",
];

export default function LabAddTestDialog({
  onCreateRequest,
  successMessage,
  requestOnlyPatient = false,
}) {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successDetails, setSuccessDetails] = useState(null);

  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("UNSPECIFIED");
  const [patientAddress, setPatientAddress] = useState("");

  const [doctorName, setDoctorName] = useState("");
  const [doctorPhone, setDoctorPhone] = useState("");

  const [testsInput, setTestsInput] = useState("");
  const [sampleType, setSampleType] = useState("BLOOD");
  const [priority, setPriority] = useState("NORMAL");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  /* =========================
     RESET FORM
  ========================= */

  const resetForm = () => {
    setPatientName("");
    setPatientEmail("");
    setPatientPhone("");
    setPatientAge("");
    setPatientGender("UNSPECIFIED");
    setPatientAddress("");

    setDoctorName("");
    setDoctorPhone("");

    setTestsInput("");
    setSampleType("BLOOD");
    setPriority("NORMAL");

    setError("");
  };

  /* =========================
     SUBMIT
  ========================= */

  const submit = async (event) => {
    event.preventDefault();

    const tests = [
      ...new Set(
        testsInput
          .split(/[\n,]+/)
          .map((test) => test.trim())
          .filter(Boolean)
      ),
    ];

    if (patientName.trim().length < 3) {
      setError("Enter the patient's full name.");
      return;
    }

    if (
      patientEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientEmail.trim())
    ) {
      setError("Enter a valid patient email address.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(patientPhone.trim())) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (
      requestOnlyPatient &&
      (!/^\d{1,3}$/.test(patientAge) || Number(patientAge) > 130)
    ) {
      setError("Enter the patient's age between 0 and 130 years.");
      return;
    }

    if (
      doctorPhone.trim() &&
      !/^[6-9]\d{9}$/.test(doctorPhone.trim())
    ) {
      setError("Enter a valid 10-digit referring doctor mobile number.");
      return;
    }

    if (
      !tests.length ||
      tests.length > 20 ||
      tests.some((test) => test.length < 2 || test.length > 150)
    ) {
      setError(
        "Enter 1 to 20 test names, each between 2 and 150 characters."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const result = await onCreateRequest?.({
        fullName: patientName.trim(),
        email: patientEmail.trim().toLowerCase(),
        phoneNumber: patientPhone.trim(),

        ...(requestOnlyPatient
          ? {
              age: Number(patientAge),
              gender: patientGender,
              address: patientAddress.trim(),
            }
          : {}),

        referringDoctorName: doctorName.trim(),
        referringDoctorPhone: doctorPhone.trim(),

        tests,
        sampleType,
        priority,

        requestType: "WALK_IN",
      });

      if (!result?.success) {
        setError(
          result?.message ||
            "Unable to create test request. Check the details and try again."
        );
        return;
      }

      setOpen(false);

      setSuccessDetails({
        patientId:
          result.patientId ||
          result.request?.patient_id ||
          (result.requestOnlyPatient ? "Stored with request" : "-"),

        requestOnlyPatient: Boolean(result.requestOnlyPatient),

        requestId:
          result.orderId ||
          result.request?.order_id ||
          result.requestId ||
          result.request?.id ||
          "-",
      });

      setSuccessOpen(true);
      resetForm();
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to create test request."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     COMMON UI
  ========================= */

  const compactFieldSx = {
    "& .MuiInputLabel-root": {
      fontSize: "10.5px",
      color: "#64748B",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#07876A",
    },

    "& .MuiOutlinedInput-root": {
      minHeight: 36,
      borderRadius: "7px",
      bgcolor: "#FFFFFF",
      fontSize: "11.5px",

      "& fieldset": {
        borderColor: "#DCE4E8",
      },

      "&:hover fieldset": {
        borderColor: "#B8C5CC",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#07876A",
        borderWidth: "1px",
      },
    },

    "& .MuiOutlinedInput-input": {
      fontSize: "11.5px",
      padding: "8px 10px",
    },

    "& .MuiSelect-select": {
      fontSize: "11.5px",
      paddingTop: "8px",
      paddingBottom: "8px",
    },

    "& .MuiFormHelperText-root": {
      mt: 0.35,
      ml: 0.25,
      fontSize: "9px",
      lineHeight: 1.2,
      color: "#94A3B8",
    },
  };

  const sectionBoxSx = {
    p: { xs: 1.3, sm: 1.5 },
    bgcolor: "#FFFFFF",
    border: "1px solid #E3E9ED",
    borderRadius: "9px",
  };

  const sectionTitleSx = {
    mb: 1.1,
    fontSize: "9.5px",
    lineHeight: 1,
    fontWeight: 750,
    color: "#07876A",
    textTransform: "uppercase",
    letterSpacing: "0.065em",
  };

  /* =========================
     JSX
  ========================= */

  return (
    <>
      {/* ADD TEST BUTTON */}

      <Button
        variant="contained"
        startIcon={
          <AddCircleOutlineIcon
            sx={{
              fontSize: "17px !important",
            }}
          />
        }
        onClick={() => {
          setError("");
          setOpen(true);
        }}
        sx={{
          height: 38,
          minHeight: 38,
          width: {
            xs: "100%",
            sm: "auto",
          },
          px: 1.8,
          borderRadius: "7px",
          bgcolor: "#07876A",
          fontSize: "11.5px",
          fontWeight: 700,
          textTransform: "none",
          boxShadow: "none",

          "&:hover": {
            bgcolor: "#066F58",
            boxShadow: "none",
          },
        }}
      >
        Add Test
      </Button>

      {/* =========================
          MAIN DIALOG
      ========================= */}

      <Dialog
        open={open}
        onClose={() => !saving && setOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "920px",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 20px 50px rgba(15, 23, 42, 0.14)",
          },
        }}
      >
        <Box
          component="form"
          onSubmit={submit}
        >
          {/* =========================
              HEADER
          ========================= */}

          <DialogTitle
            sx={{
              px: {
                xs: 1.8,
                sm: 2.5,
              },
              py: 1.4,

              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",

              borderBottom: "1px solid #E8EEF2",
              bgcolor: "#FFFFFF",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "14.5px",
                  fontWeight: 750,
                  color: "#172033",
                  lineHeight: 1.2,
                }}
              >
                Add lab test request
              </Typography>

              <Typography
                sx={{
                  mt: 0.2,
                  fontSize: "10px",
                  color: "#7B8992",
                }}
              >
                Enter patient, test and sample details.
              </Typography>
            </Box>

            <IconButton
              size="small"
              disabled={saving}
              onClick={() => setOpen(false)}
              sx={{
                width: 29,
                height: 29,
                border: "1px solid #E2E8F0",
                borderRadius: "7px",
                color: "#64748B",

                "&:hover": {
                  bgcolor: "#F8FAFC",
                },
              }}
            >
              <CloseIcon
                sx={{
                  fontSize: 16,
                }}
              />
            </IconButton>
          </DialogTitle>

          {/* =========================
              CONTENT
          ========================= */}

          <DialogContent
            sx={{
              px: {
                xs: 1.8,
                sm: 2.5,
              },

              py: "15px !important",

              bgcolor: "#F8FAF9",
            }}
          >
            {/* ERROR */}

            {error ? (
              <Alert
                severity="error"
                sx={{
                  mb: 1.3,
                  py: 0.2,
                  borderRadius: "7px",
                  fontSize: "10.5px",

                  "& .MuiAlert-icon": {
                    fontSize: 17,
                  },
                }}
              >
                {error}
              </Alert>
            ) : null}

            <Stack spacing={1.25}>
              {/* =========================
                  PATIENT DETAILS
              ========================= */}

              <Box sx={sectionBoxSx}>
                <Typography sx={sectionTitleSx}>
                  Patient details
                </Typography>

                <Box
                  sx={{
                    display: "grid",

                    gridTemplateColumns: {
                      xs: "1fr",

                      sm: "repeat(2, minmax(0, 1fr))",

                      md: requestOnlyPatient
                        ? "1.35fr 1.15fr 0.9fr 0.5fr 0.7fr"
                        : "1.3fr 1fr 0.9fr",
                    },

                    gap: 1,
                  }}
                >
                  {/* PATIENT NAME */}

                  <TextField
                    required
                    size="small"
                    label="Patient full name"
                    value={patientName}
                    onChange={(event) =>
                      setPatientName(event.target.value)
                    }
                    sx={compactFieldSx}
                  />

                  {/* EMAIL */}

                  <TextField
                    size="small"
                    type="email"
                    label="Patient email (optional)"
                    value={patientEmail}
                    onChange={(event) =>
                      setPatientEmail(event.target.value)
                    }
                    sx={compactFieldSx}
                  />

                  {/* MOBILE */}

                  <TextField
                    required
                    size="small"
                    label="Mobile number"
                    value={patientPhone}
                    onChange={(event) =>
                      setPatientPhone(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10)
                      )
                    }
                    inputProps={{
                      inputMode: "numeric",
                      maxLength: 10,
                    }}
                    sx={compactFieldSx}
                  />

                  {/* EXTRA PATIENT DATA */}

                  {requestOnlyPatient ? (
                    <>
                      {/* AGE */}

                      <TextField
                        required
                        size="small"
                        type="number"
                        label="Age"
                        value={patientAge}
                        onChange={(event) =>
                          setPatientAge(event.target.value)
                        }
                        inputProps={{
                          min: 0,
                          max: 130,
                        }}
                        sx={compactFieldSx}
                      />

                      {/* SEX */}

                      <TextField
                        select
                        required
                        size="small"
                        label="Sex"
                        value={patientGender}
                        onChange={(event) =>
                          setPatientGender(event.target.value)
                        }
                        sx={compactFieldSx}
                      >
                        <MenuItem
                          value="UNSPECIFIED"
                          sx={{ fontSize: "11.5px" }}
                        >
                          Unspecified
                        </MenuItem>

                        <MenuItem
                          value="FEMALE"
                          sx={{ fontSize: "11.5px" }}
                        >
                          Female
                        </MenuItem>

                        <MenuItem
                          value="MALE"
                          sx={{ fontSize: "11.5px" }}
                        >
                          Male
                        </MenuItem>

                        <MenuItem
                          value="OTHER"
                          sx={{ fontSize: "11.5px" }}
                        >
                          Other
                        </MenuItem>
                      </TextField>

                      {/* ADDRESS */}

                      <TextField
                        size="small"
                        label="Address (optional)"
                        value={patientAddress}
                        onChange={(event) =>
                          setPatientAddress(event.target.value)
                        }
                        sx={{
                          ...compactFieldSx,

                          gridColumn: {
                            xs: "auto",
                            sm: "span 2",
                            md: "1 / -1",
                          },
                        }}
                      />
                    </>
                  ) : null}
                </Box>
              </Box>

              {/* =========================
                  TEST + DOCTOR ROW
              ========================= */}

              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "1.5fr 0.85fr",
                  },

                  gap: 1.25,

                  alignItems: "stretch",
                }}
              >
                {/* =========================
                    TEST DETAILS
                ========================= */}

                <Box sx={sectionBoxSx}>
                  <Typography sx={sectionTitleSx}>
                    Test details
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",

                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "2fr 1fr 0.9fr",
                      },

                      gap: 1,
                      alignItems: "start",
                    }}
                  >
                    {/* TESTS */}

                    <TextField
                      required
                      size="small"
                      label="Tests"
                      placeholder="Example: CBC, Blood sugar"
                      value={testsInput}
                      onChange={(event) =>
                        setTestsInput(event.target.value)
                      }
                      helperText="Separate test names with commas."
                      sx={compactFieldSx}
                    />

                    {/* SAMPLE TYPE */}

                    <TextField
                      select
                      size="small"
                      label="Sample type"
                      value={sampleType}
                      onChange={(event) =>
                        setSampleType(event.target.value)
                      }
                      sx={compactFieldSx}
                    >
                      {SAMPLE_TYPES.map((item) => (
                        <MenuItem
                          key={item}
                          value={item}
                          sx={{
                            fontSize: "11.5px",
                          }}
                        >
                          {item}
                        </MenuItem>
                      ))}
                    </TextField>

                    {/* PRIORITY */}

                    <TextField
                      select
                      size="small"
                      label="Priority"
                      value={priority}
                      onChange={(event) =>
                        setPriority(event.target.value)
                      }
                      sx={compactFieldSx}
                    >
                      <MenuItem
                        value="NORMAL"
                        sx={{
                          fontSize: "11.5px",
                        }}
                      >
                        Normal
                      </MenuItem>

                      <MenuItem
                        value="URGENT"
                        sx={{
                          fontSize: "11.5px",
                        }}
                      >
                        Urgent
                      </MenuItem>
                    </TextField>
                  </Box>
                </Box>

                {/* =========================
                    REFERRING DOCTOR
                ========================= */}

                <Box sx={sectionBoxSx}>
                  <Typography sx={sectionTitleSx}>
                    Referring doctor

                    <Box
                      component="span"
                      sx={{
                        ml: 0.5,
                        color: "#94A3B8",
                        fontSize: "9px",
                        fontWeight: 500,
                        textTransform: "none",
                        letterSpacing: 0,
                      }}
                    >
                      (optional)
                    </Box>
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",

                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, minmax(0, 1fr))",
                        md: "1fr",
                      },

                      gap: 1,
                    }}
                  >
                    {/* DOCTOR NAME */}

                    <TextField
                      size="small"
                      label="Doctor name"
                      value={doctorName}
                      onChange={(event) =>
                        setDoctorName(event.target.value)
                      }
                      sx={compactFieldSx}
                    />

                    {/* DOCTOR MOBILE */}

                    <TextField
                      size="small"
                      label="Doctor mobile"
                      value={doctorPhone}
                      onChange={(event) =>
                        setDoctorPhone(
                          event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10)
                        )
                      }
                      inputProps={{
                        inputMode: "numeric",
                        maxLength: 10,
                      }}
                      sx={compactFieldSx}
                    />
                  </Box>
                </Box>
              </Box>
            </Stack>
          </DialogContent>

          {/* =========================
              FOOTER
          ========================= */}

          <DialogActions
            sx={{
              px: {
                xs: 1.8,
                sm: 2.5,
              },

              py: 1.1,

              gap: 0.5,

              borderTop: "1px solid #E8EEF2",

              bgcolor: "#FFFFFF",
            }}
          >
            {/* CANCEL */}

            <Button
              onClick={() => setOpen(false)}
              disabled={saving}
              sx={{
                height: 34,
                px: 1.6,

                borderRadius: "7px",

                color: "#64748B",

                fontSize: "10.5px",
                fontWeight: 650,

                textTransform: "none",

                "&:hover": {
                  bgcolor: "#F8FAFC",
                },
              }}
            >
              Cancel
            </Button>

            {/* CREATE */}

            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              sx={{
                height: 34,

                px: 2,

                borderRadius: "7px",

                bgcolor: "#07876A",

                fontSize: "10.5px",
                fontWeight: 700,

                textTransform: "none",

                boxShadow: "none",

                "&:hover": {
                  bgcolor: "#066F58",
                  boxShadow: "none",
                },
              }}
            >
              {saving ? "Creating..." : "Create request"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* =========================
          SUCCESS DIALOG
      ========================= */}

      <Dialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle
          sx={{
            px: 2,
            py: 1.4,

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            fontSize: "14px",
            fontWeight: 700,

            color: "#172033",
          }}
        >
          Request created

          <IconButton
            aria-label="Close confirmation"
            onClick={() => setSuccessOpen(false)}
            size="small"
          >
            <CloseIcon
              sx={{
                fontSize: 17,
              }}
            />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            px: 2,
            pb: 2,

            display: "grid",
            gap: 1,

            pt: "6px !important",
          }}
        >
          <Alert
            severity="success"
            sx={{
              py: 0.3,
              fontSize: "10.5px",

              "& .MuiAlert-icon": {
                fontSize: 17,
              },
            }}
          >
            {successMessage ||
              "The patient test request was created successfully."}
          </Alert>

          <Typography
            sx={{
              fontSize: "11.5px",
              color: "#475569",
            }}
          >
            {successDetails?.requestOnlyPatient
              ? "Patient data"
              : "Patient ID"}
            :{" "}
            <Box
              component="strong"
              sx={{
                color: "#172033",
              }}
            >
              {successDetails?.patientId || "-"}
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: "11.5px",
              color: "#475569",
            }}
          >
            Request ID:{" "}
            <Box
              component="strong"
              sx={{
                color: "#172033",
              }}
            >
              {successDetails?.requestId || "-"}
            </Box>
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}