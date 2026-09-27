"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

export default function MedicalRequestDetailsDialog({
  open,
  request,
  loading = false,
  onClose,
  onComplete,
}) {
  const [prescriptionLines, setPrescriptionLines] = useState([]);
  const [invoiceLines, setInvoiceLines] = useState([]);
  const [note, setNote] = useState("");
  const [validation, setValidation] = useState("");

  useEffect(() => {
    if (!request) return;

    const items = (() => {
      if (Array.isArray(request.medicine_items)) {
        return request.medicine_items;
      }

      try {
        const parsed = JSON.parse(
          request.medicine_items || "[]"
        );

        if (Array.isArray(parsed) && parsed.length) {
          return parsed;
        }
      } catch {}

      return [
        {
          medicine_name: request.medicine_name,
          quantity: request.quantity || 1,
          dose: request.dose || request.note || "",
        },
      ];
    })();

    const normalizedPrescription = items.map((item) => ({
      ...item,
      medicine_name:
        item.medicine_name ||
        request.medicine_name ||
        "-",
      quantity: Number(item.quantity || 1),
      dose: item.dose || item.note || "",
    }));

    const normalizedInvoice = normalizedPrescription.map(
      (item) => ({
        ...item,
        batch_number:
          item.batch_number ||
          request.batch_number ||
          "",
        expiry_date:
          item.expiry_date ||
          request.expiry_date ||
          "",
        quantity: Number(item.quantity || 1),
        unit_price:
          item.unit_price ??
          request.unit_price ??
          "",
        gst_rate:
          item.gst_rate ??
          request.gst_rate ??
          "",
      })
    );

    setPrescriptionLines(normalizedPrescription);
    setInvoiceLines(normalizedInvoice);
    setNote(request.note || "");
    setValidation("");
  }, [request]);

  if (!request) return null;

  const status = String(
    request.status || "PENDING"
  ).toUpperCase();

  const isCompleted = status === "COMPLETED";

  const invoiceNumber =
    request.invoice_number ||
    `INV-${new Date(
      request.created_at || Date.now()
    ).getFullYear()}-${String(request.id).padStart(
      6,
      "0"
    )}`;

  const invoiceDate = new Date(
    request.created_at || Date.now()
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const calculatedAmount = invoiceLines.reduce(
    (total, line) => {
      const lineTotal =
        Number(line.quantity || 0) *
        Number(line.unit_price || 0);

      return (
        total +
        lineTotal +
        (lineTotal *
          Number(line.gst_rate || 0)) /
          100
      );
    },
    0
  );

  const getMedicineKey = (medicine = {}) =>
    String(
      medicine.medicine_name ||
        medicine.name ||
        ""
    )
      .trim()
      .toLowerCase();

  const updateLine = (index, field, value) => {
    setInvoiceLines((lines) =>
      lines.map((line, lineIndex) =>
        lineIndex === index
          ? { ...line, [field]: value }
          : line
      )
    );
  };

  const handleRemoveLine = (index) => {
    setInvoiceLines((lines) =>
      lines.filter(
        (_, lineIndex) => lineIndex !== index
      )
    );
  };

  const handleAddBackLine = (prescriptionLine) => {
    setInvoiceLines((lines) => [
      ...lines,
      {
        ...prescriptionLine,
        batch_number: "",
        expiry_date: "",
        quantity: Number(
          prescriptionLine.quantity || 1
        ),
        unit_price: "",
        gst_rate: "",
      },
    ]);
  };

  const handleComplete = () => {
    if (!invoiceLines.length) {
      setValidation(
        "Invoice me kam se kam ek medicine hona chahiye."
      );
      return;
    }

    if (
      invoiceLines.some(
        (line) =>
          !String(line.batch_number).trim() ||
          !line.expiry_date ||
          !String(line.unit_price).trim() ||
          !String(line.gst_rate).trim()
      )
    ) {
      setValidation(
        "Har medicine ke batch, expiry, unit price aur GST details fill karein."
      );
      return;
    }

    if (
      invoiceLines.some(
        (line) =>
          Number(line.quantity) <= 0 ||
          Number(line.unit_price) < 0 ||
          Number(line.gst_rate) < 0
      )
    ) {
      setValidation(
        "Quantity, unit price aur GST valid value honi chahiye."
      );
      return;
    }

    onComplete(
      request.id,
      "COMPLETED",
      note.trim() || null,
      {
        totalAmount: calculatedAmount,
        invoiceItems: invoiceLines,
        batchNumber:
          invoiceLines[0].batch_number,
        expiryDate:
          invoiceLines[0].expiry_date,
        unitPrice: Number(
          invoiceLines[0].unit_price
        ),
        gstRate: Number(
          invoiceLines[0].gst_rate
        ),
        amount: calculatedAmount,
      }
    );
  };

  const statusStyle =
    status === "COMPLETED"
      ? {
          color: "#07876A",
          bgcolor: "#ECFDF5",
          border: "1px solid #A7F3D0",
        }
      : status === "REJECTED"
      ? {
          color: "#DC2626",
          bgcolor: "#FEF2F2",
          border: "1px solid #FECACA",
        }
      : {
          color: "#B45309",
          bgcolor: "#FFFBEB",
          border: "1px solid #FDE68A",
        };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      minHeight: 36,
      fontSize: "12.5px",
      bgcolor: "#FFFFFF",
      borderRadius: "6px",

      "& fieldset": {
        borderColor: "#D8E0E8",
      },

      "&:hover fieldset": {
        borderColor: "#AEBAC6",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#07876A",
        borderWidth: "1px",
      },
    },

    "& .MuiInputBase-input": {
      px: 1,
      py: 0.8,
    },
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          width: "100%",
          maxHeight: "92vh",
          m: {
            xs: 1,
            sm: 2,
          },
          borderRadius: "10px",
          boxShadow:
            "0 16px 50px rgba(15, 23, 42, 0.12)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 0,
          bgcolor: "#FFFFFF",
        }}
      >
        <Box
          sx={{
            px: {
              xs: 1.5,
              sm: 2.5,
            },
            py: 1.7,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            borderBottom: "1px solid #E2E8F0",
          }}
        >
          <Box
            sx={{
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              gap: 1.2,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                flexShrink: 0,
                borderRadius: "8px",
                bgcolor: "#ECFDF5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ReceiptLongOutlinedIcon
                sx={{
                  color: "#07876A",
                  fontSize: 20,
                }}
              />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  color: "#172033",
                  fontSize: {
                    xs: "15px",
                    sm: "17px",
                  },
                  lineHeight: 1.3,
                  fontWeight: 700,
                }}
              >
                Medical Request
              </Typography>

              <Typography
                sx={{
                  mt: 0.2,
                  color: "#64748B",
                  fontSize: "11.5px",
                  lineHeight: 1.4,
                }}
              >
                Invoice #{invoiceNumber}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Chip
              label={status.replaceAll("_", " ")}
              size="small"
              sx={{
                ...statusStyle,
                height: 25,
                borderRadius: "6px",
                fontSize: "10.5px",
                fontWeight: 700,

                "& .MuiChip-label": {
                  px: 1.1,
                },
              }}
            />

            <IconButton
              size="small"
              onClick={onClose}
              disabled={loading}
              sx={{
                width: 32,
                height: 32,
                border: "1px solid #E2E8F0",
                borderRadius: "7px",
                color: "#64748B",
              }}
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          p: {
            xs: 1.5,
            sm: 2.5,
          },
          bgcolor: "#F8FAF9",
        }}
      >
        <Stack spacing={2}>
          {validation && (
            <Alert
              severity="error"
              onClose={() =>
                setValidation("")
              }
              sx={{
                fontSize: "12.5px",
                borderRadius: "7px",
                border: "1px solid #FECACA",
                bgcolor: "#FEF2F2",
              }}
            >
              {validation}
            </Alert>
          )}

          <Box
            sx={{
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: {
                  xs: 1.5,
                  sm: 2,
                },
                py: 1.2,
                borderBottom:
                  "1px solid #E2E8F0",
              }}
            >
              <Typography
                sx={{
                  color: "#172033",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                Request Information
              </Typography>
            </Box>

            <Box
              sx={{
                p: {
                  xs: 1.5,
                  sm: 2,
                },
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 1.5,
              }}
            >
              <InfoItem
                icon={
                  <LocalPharmacyOutlinedIcon />
                }
                label="Medical Store"
                value={
                  request.store_name ||
                  "Medical Store"
                }
                subValue={
                  request.store_address ||
                  request.address ||
                  "Registered store"
                }
              />

              <InfoItem
                icon={
                  <PersonOutlineRoundedIcon />
                }
                label="Patient"
                value={
                  request.patient_name || "-"
                }
              />

              <InfoItem
                icon={
                  <MedicalServicesOutlinedIcon />
                }
                label="Doctor"
                value={
                  request.doctor_name || "-"
                }
              />

              <InfoItem
                icon={
                  <ReceiptLongOutlinedIcon />
                }
                label="Invoice"
                value={invoiceNumber}
                subValue={invoiceDate}
              />
            </Box>
          </Box>

          <Box
            sx={{
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                borderBottom:
                  "1px solid #E2E8F0",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: "#172033",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  Doctor Prescription
                </Typography>

                <Typography
                  sx={{
                    mt: 0.2,
                    color: "#64748B",
                    fontSize: "11px",
                  }}
                >
                  Medicines requested by doctor
                </Typography>
              </Box>

              <Chip
                label={`${prescriptionLines.length} medicine${
                  prescriptionLines.length === 1
                    ? ""
                    : "s"
                }`}
                size="small"
                sx={{
                  height: 24,
                  bgcolor: "#F1F5F9",
                  color: "#475569",
                  fontSize: "10.5px",
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box
              sx={{
                overflowX: "auto",
              }}
            >
              <Box
                sx={{
                  minWidth: 620,
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "50px minmax(220px, 1fr) 130px 100px",
                    alignItems: "center",
                    px: 2,
                    py: 1,
                    bgcolor: "#F8FAFC",
                    borderBottom:
                      "1px solid #E2E8F0",
                  }}
                >
                  {[
                    "#",
                    "MEDICINE",
                    "REQUESTED QTY",
                    "ACTION",
                  ].map((item) => (
                    <Typography
                      key={item}
                      sx={{
                        color: "#64748B",
                        fontSize: "10.5px",
                        fontWeight: 700,
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>

                {prescriptionLines.map(
                  (medicine, index) => {
                    const isRemoved =
                      !invoiceLines.some(
                        (invoiceLine) =>
                          getMedicineKey(
                            invoiceLine
                          ) ===
                          getMedicineKey(
                            medicine
                          )
                      );

                    return (
                      <Box
                        key={`prescription-${medicine.medicine_name}-${index}`}
                        sx={{
                          display: "grid",
                          gridTemplateColumns:
                            "50px minmax(220px, 1fr) 130px 100px",
                          alignItems: "center",
                          px: 2,
                          py: 1.15,
                          borderBottom:
                            index !==
                            prescriptionLines.length -
                              1
                              ? "1px solid #EEF2F6"
                              : "none",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#64748B",
                            fontSize: "12px",
                          }}
                        >
                          {index + 1}
                        </Typography>

                        <Box>
                          <Typography
                            sx={{
                              color: "#172033",
                              fontSize: "12.5px",
                              fontWeight: 600,
                            }}
                          >
                            {medicine.medicine_name ||
                              "-"}
                          </Typography>

                          {medicine.dose && (
                            <Typography
                              sx={{
                                mt: 0.2,
                                color: "#64748B",
                                fontSize: "10.5px",
                              }}
                            >
                              {medicine.dose}
                            </Typography>
                          )}
                        </Box>

                        <Typography
                          sx={{
                            color: "#172033",
                            fontSize: "12.5px",
                            fontWeight: 600,
                          }}
                        >
                          {Number(
                            medicine.quantity || 1
                          )}
                        </Typography>

                        {isRemoved ? (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={
                              <AddRoundedIcon
                                sx={{
                                  fontSize:
                                    "15px !important",
                                }}
                              />
                            }
                            onClick={() =>
                              handleAddBackLine(
                                medicine
                              )
                            }
                            disabled={
                              isCompleted ||
                              loading
                            }
                            sx={{
                              width: "fit-content",
                              minWidth: 0,
                              height: 30,
                              px: 1,
                              borderRadius: "6px",
                              borderColor:
                                "#B7E4D8",
                              color: "#07876A",
                              fontSize: "11px",
                              fontWeight: 600,
                              textTransform: "none",
                            }}
                          >
                            Add
                          </Button>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <CheckCircleOutlineRoundedIcon
                              sx={{
                                fontSize: 15,
                                color: "#07876A",
                              }}
                            />

                            <Typography
                              sx={{
                                color: "#07876A",
                                fontSize: "11px",
                                fontWeight: 600,
                              }}
                            >
                              Added
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    );
                  }
                )}
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.2,
                display: "flex",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                justifyContent: "space-between",
                gap: 0.5,
                borderBottom:
                  "1px solid #E2E8F0",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: "#172033",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  Medicine & Billing Details
                </Typography>

                <Typography
                  sx={{
                    mt: 0.2,
                    color: "#64748B",
                    fontSize: "11px",
                  }}
                >
                  Add batch, expiry and pricing details
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "#64748B",
                  fontSize: "11px",
                }}
              >
                {invoiceLines.length} item(s)
              </Typography>
            </Box>

            {invoiceLines.length === 0 ? (
              <Box
                sx={{
                  py: 5,
                  px: 2,
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#64748B",
                    fontSize: "12.5px",
                  }}
                >
                  No medicines added to invoice.
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  overflowX: "auto",
                }}
              >
                <Box
                  sx={{
                    minWidth: 1030,
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "40px 170px 120px 140px 70px 110px 80px 110px 70px",
                      gap: 1,
                      alignItems: "center",
                      px: 1.5,
                      py: 1,
                      bgcolor: "#F8FAFC",
                      borderBottom:
                        "1px solid #E2E8F0",
                    }}
                  >
                    {[
                      "#",
                      "MEDICINE",
                      "BATCH NO.",
                      "EXPIRY",
                      "QTY",
                      "UNIT PRICE",
                      "GST %",
                      "AMOUNT",
                      "",
                    ].map((item, index) => (
                      <Typography
                        key={`${item}-${index}`}
                        sx={{
                          color: "#64748B",
                          fontSize: "10px",
                          fontWeight: 700,
                        }}
                      >
                        {item}
                      </Typography>
                    ))}
                  </Box>

                  {invoiceLines.map(
                    (medicine, index) => {
                      const lineTotal =
                        Number(
                          medicine.quantity || 0
                        ) *
                        Number(
                          medicine.unit_price || 0
                        ) *
                        (1 +
                          Number(
                            medicine.gst_rate || 0
                          ) /
                            100);

                      return (
                        <Box
                          key={`${medicine.medicine_name}-${index}`}
                          sx={{
                            display: "grid",
                            gridTemplateColumns:
                              "40px 170px 120px 140px 70px 110px 80px 110px 70px",
                            gap: 1,
                            alignItems: "center",
                            px: 1.5,
                            py: 1,
                            borderBottom:
                              index !==
                              invoiceLines.length -
                                1
                                ? "1px solid #EEF2F6"
                                : "none",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#64748B",
                              fontSize: "12px",
                            }}
                          >
                            {index + 1}
                          </Typography>

                          <Typography
                            sx={{
                              color: "#172033",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            {medicine.medicine_name ||
                              "-"}
                          </Typography>

                          <TextField
                            size="small"
                            placeholder="Batch"
                            value={
                              medicine.batch_number
                            }
                            onChange={(event) =>
                              updateLine(
                                index,
                                "batch_number",
                                event.target.value
                              )
                            }
                            disabled={
                              isCompleted ||
                              loading
                            }
                            sx={inputSx}
                          />

                          <TextField
                            size="small"
                            type="date"
                            value={
                              medicine.expiry_date
                            }
                            onChange={(event) =>
                              updateLine(
                                index,
                                "expiry_date",
                                event.target.value
                              )
                            }
                            disabled={
                              isCompleted ||
                              loading
                            }
                            sx={inputSx}
                          />

                          <TextField
                            size="small"
                            type="number"
                            value={
                              medicine.quantity
                            }
                            onChange={(event) =>
                              updateLine(
                                index,
                                "quantity",
                                event.target.value
                              )
                            }
                            disabled={
                              isCompleted ||
                              loading
                            }
                            inputProps={{
                              min: 1,
                            }}
                            sx={inputSx}
                          />

                          <TextField
                            size="small"
                            type="number"
                            placeholder="₹ 0"
                            value={
                              medicine.unit_price
                            }
                            onChange={(event) =>
                              updateLine(
                                index,
                                "unit_price",
                                event.target.value
                              )
                            }
                            disabled={
                              isCompleted ||
                              loading
                            }
                            inputProps={{
                              min: 0,
                            }}
                            sx={inputSx}
                          />

                          <TextField
                            size="small"
                            type="number"
                            placeholder="0"
                            value={
                              medicine.gst_rate
                            }
                            onChange={(event) =>
                              updateLine(
                                index,
                                "gst_rate",
                                event.target.value
                              )
                            }
                            disabled={
                              isCompleted ||
                              loading
                            }
                            inputProps={{
                              min: 0,
                            }}
                            sx={inputSx}
                          />

                          <Typography
                            sx={{
                              color: "#172033",
                              fontSize: "12px",
                              fontWeight: 700,
                            }}
                          >
                            ₹
                            {lineTotal.toFixed(
                              2
                            )}
                          </Typography>

                          <IconButton
                            size="small"
                            onClick={() =>
                              handleRemoveLine(
                                index
                              )
                            }
                            disabled={
                              isCompleted ||
                              loading
                            }
                            sx={{
                              width: 30,
                              height: 30,
                              color: "#DC2626",
                              border:
                                "1px solid #FECACA",
                              borderRadius:
                                "6px",

                              "&:hover": {
                                bgcolor:
                                  "#FEF2F2",
                              },
                            }}
                          >
                            <DeleteOutlineRoundedIcon
                              sx={{
                                fontSize: 17,
                              }}
                            />
                          </IconButton>
                        </Box>
                      );
                    }
                  )}
                </Box>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 300px",
              },
              gap: 2,
              alignItems: "stretch",
            }}
          >
            <Box
              sx={{
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                p: 2,
              }}
            >
              <Typography
                sx={{
                  mb: 1,
                  color: "#172033",
                  fontSize: "12.5px",
                  fontWeight: 700,
                }}
              >
                Delivery Note
              </Typography>

              <TextField
                value={note}
                onChange={(event) =>
                  setNote(event.target.value)
                }
                disabled={
                  isCompleted || loading
                }
                placeholder="Add a note for the patient..."
                multiline
                minRows={3}
                fullWidth
                sx={{
                  ...inputSx,

                  "& .MuiOutlinedInput-root":
                    {
                      minHeight: 88,
                      alignItems:
                        "flex-start",
                      fontSize: "12.5px",
                      bgcolor: "#FFFFFF",
                      borderRadius: "6px",

                      "& fieldset": {
                        borderColor:
                          "#D8E0E8",
                      },

                      "&:hover fieldset":
                        {
                          borderColor:
                            "#AEBAC6",
                        },

                      "&.Mui-focused fieldset":
                        {
                          borderColor:
                            "#07876A",
                          borderWidth:
                            "1px",
                        },
                    },
                }}
              />
            </Box>

            <Box
              sx={{
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent:
                  "space-between",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: "#64748B",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  PAYMENT SUMMARY
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#475569",
                      fontSize: "12px",
                    }}
                  >
                    Items
                  </Typography>

                  <Typography
                    sx={{
                      color: "#172033",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {invoiceLines.length}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 3,
                  pt: 1.5,
                  borderTop:
                    "1px dashed #CBD5E1",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent:
                    "space-between",
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "#172033",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  Grand Total
                </Typography>

                <Typography
                  sx={{
                    color: "#07876A",
                    fontSize: "20px",
                    lineHeight: 1,
                    fontWeight: 800,
                  }}
                >
                  ₹
                  {calculatedAmount.toFixed(
                    2
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>

          {isCompleted && (
            <Box
              sx={{
                pt: 2,
                display: "flex",
                justifyContent:
                  "flex-end",
              }}
            >
              <Box
                sx={{
                  width: 190,
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    borderTop:
                      "1px solid #94A3B8",
                    mb: 0.7,
                  }}
                />

                <Typography
                  sx={{
                    color: "#475569",
                    fontSize: "11.5px",
                    fontWeight: 600,
                  }}
                >
                  Authorized Signature
                </Typography>
              </Box>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: {
            xs: 1.5,
            sm: 2.5,
          },
          py: 1.5,
          bgcolor: "#FFFFFF",
          borderTop: "1px solid #E2E8F0",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          startIcon={
            <ArrowBackOutlinedIcon />
          }
          sx={{
            height: 36,
            px: 1.5,
            color: "#475569",
            borderRadius: "6px",
            textTransform: "none",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          Back
        </Button>

        {!isCompleted && (
          <Button
            variant="contained"
            onClick={handleComplete}
            disabled={loading}
            startIcon={
              <CheckCircleOutlineRoundedIcon />
            }
            sx={{
              height: 38,
              px: 2,
              bgcolor: "#07876A",
              borderRadius: "6px",
              boxShadow: "none",
              textTransform: "none",
              fontSize: "12.5px",
              fontWeight: 600,

              "&:hover": {
                bgcolor: "#066F58",
                boxShadow: "none",
              },
            }}
          >
            {loading
              ? "Completing..."
              : "Complete & Deliver"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

function InfoItem({
  icon,
  label,
  value,
  subValue,
}) {
  return (
    <Box
      sx={{
        minWidth: 0,
        display: "flex",
        alignItems: "flex-start",
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          borderRadius: "7px",
          bgcolor: "#F0FDF9",
          color: "#07876A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          "& svg": {
            fontSize: 17,
          },
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: "#64748B",
            fontSize: "10.5px",
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            mt: 0.15,
            color: "#172033",
            fontSize: "12.5px",
            lineHeight: 1.35,
            fontWeight: 650,
            wordBreak: "break-word",
          }}
        >
          {value}
        </Typography>

        {subValue && (
          <Typography
            sx={{
              mt: 0.15,
              color: "#64748B",
              fontSize: "10.5px",
              lineHeight: 1.35,
              wordBreak: "break-word",
            }}
          >
            {subValue}
          </Typography>
        )}
      </Box>
    </Box>
  );
}