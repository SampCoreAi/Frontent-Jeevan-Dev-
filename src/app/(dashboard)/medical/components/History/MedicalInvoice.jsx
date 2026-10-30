"use client";

import React from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";

const GREEN = "#07876A";
const DARK = "#172B3A";
const MUTED = "#64748b";
const BORDER = "#e2eae7";

const invoice = {
  storeName: "Sanjiv Pharmacy",
  invoiceNumber: "MED-20261010-000002",
  invoiceDate: "10 October 2026",

  patientName: "user",
  patientId: 169,
  age: 21,
  gender: "MALE",

  doctorName: "Aarav",
  doctorId: 183,
  registration: "—",

  orderId: 2,
  version: 1,

  status: "COMPLETED",
  paymentMode: "Cash",

  medicines: [
    {
      name: "Paracita",
      dose: "123",
      duration: "4 days",
      frequency: "Once Daily",
      instruction: "At Bedtime",
      batch: "12312",
      expiry: "14 October 2026",
      quantity: 1,
      price: 171,
      discount: 0,
      amount: 171,
    },
    {
      name: "Tylenol",
      dose: "321",
      duration: "4 days",
      frequency: "Twice Daily",
      instruction: "With Water",
      batch: "12312",
      expiry: "14 October 2026",
      quantity: 1,
      price: 171,
      discount: 0,
      amount: 171,
    },
  ],

  totalQuantity: 2,
  totalUnitPrice: 342,
  gstRate: 2,
  amount: 1191.44,
  total: 1191.44,

  storeAddress:
  "Shop No. 12, Ground Floor, Sai Plaza, Andheri East, Mumbai, Maharashtra - 400069",

contact: "+91 98765 43210",

storeEmail: "sanjivpharmacy@gmail.com",

storeTimings: "9:00 AM - 10:00 PM",
storeTimings1: "10:00 AM - 5:00 PM",
storeTimings2: "Close",

storeDays: "Mon - Fri",
storeDays1: "Sat",
storeDays2: "Sun",
};

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

const SectionLabel = ({ children }) => (
  <Typography
    sx={{
      fontSize: 11,
      fontWeight: 800,
      color: "#81909b",
      letterSpacing: 1,
      mb: 1.2,
    }}
  >
    {children}
  </Typography>
);

const InfoItem1 = ({ label, value }) => (
  <Box>
    <SectionLabel>{label}</SectionLabel>
    <Typography
      sx={{
        fontSize: 14,
        fontWeight: 700,
        color: DARK,
        wordBreak: "break-word",
      }}
    >
      {value || "—"}
    </Typography>
  </Box>
);

const SummaryRow = ({ label, value }) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    spacing={2}
  >
    <Typography fontSize={13} color={MUTED}>
      {label}
    </Typography>

    <Typography fontSize={13} fontWeight={700} color={DARK} textAlign="right">
      {value}
    </Typography>
  </Stack>
);

export default function MedicalInvoice() {
  const handlePrint = () => window.print();

  return (
    <Box
      sx={{
        py: { xs: 3, md: 6 },
        px: { xs: 1.5, sm: 3 },
        bgcolor: "#f3f7f6",
        width: "100%",
        height: "auto",
        minHeight: "auto",
        overflow: "visible",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Box
        id="medical-invoice"
        sx={{
          width: "100%",
          maxWidth: 950,
          mx: "auto",
          bgcolor: "#fff",
          border: `1px solid ${BORDER}`,
          borderRadius: 3,
          p: { xs: 2, sm: 3, md: 4 },
          boxShadow: "0 10px 35px rgba(15,23,42,0.07)",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          pb={3}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 58,
                height: 58,
                flexShrink: 0,
                borderRadius: 2.5,
                bgcolor: "#eaf6f1",
                display: "grid",
                placeItems: "center",
                color: GREEN,
              }}
            >
              <LocalPharmacyOutlinedIcon sx={{ fontSize: 34 }} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: { xs: 21, sm: 25 },
                  fontWeight: 800,
                  color: DARK,
                  lineHeight: 1.3,
                }}
              >
                {invoice.storeName}
              </Typography>

              <Typography fontSize={13} color={MUTED} mt={0.4}>
                Medical Invoice
              </Typography>
            </Box>
          </Stack>

          <Box textAlign={{ xs: "left", sm: "right" }}>
            <Typography
              sx={{
                fontSize: { xs: 15, sm: 19 },
                fontWeight: 800,
                color: DARK,
                wordBreak: "break-word",
              }}
            >
              {invoice.invoiceNumber}
            </Typography>

            <Typography fontSize={13} color={MUTED} mt={0.5}>
              {invoice.invoiceDate}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ borderColor: GREEN, borderBottomWidth: 2 }} />
{/* PATIENT / DOCTOR / ORDER */}
<Grid
  container
  columns={12}
  sx={{
    width: "100%",
    py: 3,
    borderBottom: `1px solid ${BORDER}`,
  }}
>
  {/* PATIENT DETAILS */}
  <Grid
    size={{ xs: 12, sm: 4 }}
    sx={{
      minWidth: 0,
      pr: { sm: 3 },
      pb: { xs: 2.5, sm: 0 },
      borderRight: { sm: `1px solid ${BORDER}` },
    }}
  >
    <SectionLabel>PATIENT DETAILS</SectionLabel>

    <Typography
      sx={{
        fontSize: 16,
        fontWeight: 800,
        color: DARK,
        mb: 1.5,
      }}
    >
      {invoice.patientName}
    </Typography>

    <Stack spacing={1.2}>
      <SummaryRow
        label="Patient ID"
        value={invoice.patientId}
      />

      <SummaryRow
        label="Age / Gender"
        value={`${invoice.age} yrs • ${invoice.gender}`}
      />
    </Stack>
  </Grid>

  {/* PRESCRIBED BY */}
  <Grid
    size={{ xs: 12, sm: 4 }}
    sx={{
      minWidth: 0,
      px: { sm: 3 },
      py: { xs: 2.5, sm: 0 },
      borderRight: { sm: `1px solid ${BORDER}` },
      borderTop: {
        xs: `1px solid ${BORDER}`,
        sm: "none",
      },
    }}
  >
    <SectionLabel>PRESCRIBED BY</SectionLabel>

    <Typography
      sx={{
        fontSize: 16,
        fontWeight: 800,
        color: DARK,
        mb: 1.5,
      }}
    >
      {invoice.doctorName}
    </Typography>

    <Stack spacing={1.2}>
      <SummaryRow
        label="Doctor ID"
        value={invoice.doctorId}
      />

      <SummaryRow
        label="Registration"
        value={invoice.registration}
      />
    </Stack>
  </Grid>

  {/* ORDER DETAILS */}
  <Grid
    size={{ xs: 12, sm: 4 }}
    sx={{
      minWidth: 0,
      pl: { sm: 3 },
      pt: { xs: 2.5, sm: 0 },
      borderTop: {
        xs: `1px solid ${BORDER}`,
        sm: "none",
      },
    }}
  >
    <SectionLabel>ORDER DETAILS</SectionLabel>

    <Stack spacing={1.5}>
      <SummaryRow
        label="Order ID"
        value={invoice.orderId}
      />

      <SummaryRow
        label="Version"
        value={invoice.version}
      />

    <Stack spacing={1.8}>
  <SummaryRow
    label="Payment Method"
    value={invoice.paymentMode}
  />
</Stack>
    </Stack>
  </Grid>
</Grid>
        {/* MEDICINE DETAILS */}
        <Box sx={{ mt: 3.5 }}>
          <Typography fontSize={17} fontWeight={800} color={DARK} mb={2}>
            Medicine Details
          </Typography>

          <Box
            sx={{
              overflowX: "auto",
              border: `1px solid ${BORDER}`,
              borderRadius: 2.5,
            }}
          >
            <Box
              component="table"
              sx={{
                width: "100%",
                minWidth: 720,
                borderCollapse: "collapse",

                "& th": {
                  bgcolor: "#f2f8f5",
                  color: "#647b86",
                  fontSize: 11,
                  fontWeight: 800,
                  textAlign: "left",
                  p: 1.8,
                  whiteSpace: "nowrap",
                },

                "& td": {
                  p: 1.8,
                  fontSize: 13,
                  color: DARK,
                  borderTop: `1px solid ${BORDER}`,
                  whiteSpace: "nowrap",
                },

                "& tbody tr:hover": {
                  bgcolor: "#fbfdfc",
                },
              }}
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>MEDICINE</th>
                  <th>BATCH</th>
                  <th>EXPIRY</th>
                  <th>QTY</th>
                  <th>UNIT PRICE</th>
                  <th>DISCOUNT</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>

              <tbody>
                {invoice.medicines.map((medicine, index) => (
                  <tr key={index}>
                    <td>{String(index + 1).padStart(2, "0")}</td>

                    <td>
                      <Typography fontSize={14} fontWeight={800}>
                        {medicine.name}
                      </Typography>

                      <Typography fontSize={11} color={MUTED} mt={0.4}>
                        {[
                          medicine.dose,
                          medicine.duration,
                          medicine.frequency,
                          medicine.instruction,
                        ]
                          .filter(Boolean)
                          .join(" • ")}
                      </Typography>
                    </td>

                    <td>{medicine.batch}</td>
                    <td>{medicine.expiry}</td>
                    <td>{medicine.quantity}</td>
                    <td>{currency(medicine.price)}</td>
                    <td>{currency(medicine.discount)}</td>
                    <td>
                      <Typography fontSize={13} fontWeight={700}>
                        {currency(medicine.amount)}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Box>
          </Box>
        </Box>

{/* TOTAL SUMMARY - RIGHT SIDE */}
<Grid
  container
  columns={12}
  sx={{
    mt: 1,
    width: "100%",
    justifyContent: "flex-end",
  }}
>
  <Grid size={{ xs: 12, sm: 6 }}>
    <Box
      sx={{
        px: { sm: 1 },
        py: 1,
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <Stack spacing={1.8}>
        <SummaryRow
          label="Total Quantity"
          value={invoice.totalQuantity}
        />

        <SummaryRow
          label="Total Unit Price"
          value={currency(invoice.totalUnitPrice)}
        />

        <SummaryRow
          label="GST Rate"
          value={`${invoice.gstRate}%`}
        />

        <SummaryRow
          label="Amount"
          value={currency(invoice.amount)}
        />

        <Divider
          sx={{
            borderColor: DARK,
            borderBottomWidth: 2,
            my: 0.5,
          }}
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Typography fontSize={17} fontWeight={800} color={DARK}>
            Grand Total
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 23, sm: 28 },
              fontWeight: 900,
              color: GREEN,
              whiteSpace: "nowrap",
            }}
          >
            {currency(invoice.total)}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  </Grid>
</Grid>

    {/* STORE INFORMATION */}
<Grid
  container
  columns={12}
  spacing={2}
  sx={{
    mt: 3,
    p: 2.5,
    bgcolor: "#f5f9f7",
    border: `1px solid ${BORDER}`,
    borderRadius: 2.5,
    width: "100%",
    boxSizing: "border-box",
  }}
>
  <Grid size={{ xs: 12, sm: 4 }}>
    <InfoItem label="STORE ADDRESS" value={invoice.storeAddress} />
  </Grid>

  <Grid size={{ xs: 12, sm: 4 }}>
    <InfoItem
      label="CONTACT DETAILS"
      value={`${invoice.contact} | ${invoice.storeEmail}`}
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 4 }}>
    <InfoItem
      label="STORE TIMINGS"
      value={`${invoice.storeDays} | ${invoice.storeTimings}`}
    />
    <InfoItem1
      value={`${invoice.storeDays1} | ${invoice.storeTimings1}`}
    />
    <InfoItem1
      value={`${invoice.storeDays2} | ${invoice.storeTimings2}`}
    />
  </Grid>
</Grid>
        {/* FOOTER */}
        <Box textAlign="center" mt={3}>
          <Typography fontSize={12} color={MUTED}>
            Thank you for choosing{" "}
            <Box component="span" fontWeight={800} color={DARK}>
              {invoice.storeName}
            </Box>
          </Typography>

          <Stack
            direction="row"
            justifyContent="center"
            mt={2.5}
            className="no-print"
          >
            <Button
              variant="contained"
              startIcon={<PrintOutlinedIcon />}
              onClick={handlePrint}
              sx={{
                bgcolor: GREEN,
                px: 4,
                py: 1.2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 800,
                fontSize: 13,
                "&:hover": {
                  bgcolor: "#056b55",
                },
              }}
            >
              Print Invoice
            </Button>
          </Stack>
        </Box>
      </Box>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }

          #medical-invoice,
          #medical-invoice * {
            visibility: visible !important;
          }

          #medical-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 15px !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }

          .no-print {
            display: none !important;
          }

          @page {
            size: A4;
            margin: 10mm;
          }
        }
      `}</style>
    </Box>
  );
}
