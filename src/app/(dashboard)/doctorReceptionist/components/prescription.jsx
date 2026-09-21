"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

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
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
export default function Prescription() {
  const router = useRouter();
  const qrRef = useRef(null);
  const pdfRef = useRef(null);
  const [dateNow, setDateNow] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [logo, setLogo] = useState(null);
  const [followUpDate, setFollowUpDate] = useState(dayjs("2025-10-23"));
  const [remark, setRemark] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result); // base64 image
      };
      reader.readAsDataURL(file);
    }
  };

  const [patient] = useState({
    name: "Ramesh Verma",
    opdNo: "OPD-4567/25",
    age: "45 Y / Male",
    uhId: "UHID-10293",
    phone: "9876543210",
    department: "General Medicine",
    address: "City Center, Lucknow",
    disease: "Type 2 Diabetes Mellitus",
    doctorName: "Dr. A. B. Sharma (M.D.)",
    mode: "In-person",
    status: "Under Treatment",
    diagnosis: "E11.9: Type 2 diabetes mellitus without complications",
  });

  useEffect(() => {
    const now = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    setDateNow(now);
  }, []);

  const handleClick = () => {
    router.push("/doctor/pages/reportPatient");
  };

  const [rows, setRows] = useState([
    {
      name: "METFORMIN 500MG",
      dose: "1",
      unit: "Tablet",
      freq: "BD",
      instr: "60 Day(s)",
    },
    {
      name: "GLIMY 1MG",
      dose: "1",
      unit: "Tablet",
      freq: "OD",
      instr: "60 Day(s)",
    },
    {
      name: "ATORVA 10MG",
      dose: "1",
      unit: "Tablet",
      freq: "HS",
      instr: "60 Day(s)",
    },
  ]);

  useEffect(() => {
    import("qrious").then((QRious) => {
      new QRious.default({
        element: qrRef.current,
        value: `ABC CLINIC\nDr. A. B. Sharma\nPatient: ${patient.name}\nOPD: ${patient.opdNo}\nDate: ${dateNow}`,
        size: 90,
      });
    });
  }, [patient, dateNow]);

  const addRow = () =>
    setRows([
      ...rows,
      { name: "", dose: "", unit: "Tablet", freq: "OD", instr: "" },
    ]);
  const removeRow = (idx) => setRows(rows.filter((_, i) => i !== idx));

  const downloadPdf = async () => {
    setIsDownloading(true);
    const html2pdf = (await import("html2pdf.js")).default;
    await html2pdf().from(pdfRef.current).save("prescription.pdf");
    setIsDownloading(false);
  };

  return (
    <Box sx={{ p: 2, background: "#f3f6fb" }}>
      {/* Toolbar */}
      <Box sx={{ textAlign: "right", mb: 2 }}>
        <Button
          onClick={() => window.print()}
          variant="contained"
          sx={{
            mr: 1,
            backgroundColor: "#14b8a6",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#0f7468",
            },
          }}
        >
          Print
        </Button>
        <Button
          variant="contained"
          sx={{
            mr: 1,
            backgroundColor: "#14b8a6",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#0f7468",
            },
          }}
          onClick={handleClick}
        >
          Past Record
        </Button>
        <Button
          onClick={downloadPdf}
          variant="contained"
          sx={{
            backgroundColor: "#14b8a6",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#0f7468",
            },
          }}
        >
          Download Pdf
        </Button>
      </Box>

      <Paper
        ref={pdfRef}
        sx={{
          p: 3,
          borderRadius: 0.5,
          maxWidth: 960,
          mx: "auto",
          position: "relative",
          background: "#fff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold" color="primary">
              Dr. A. B. Sharma
            </Typography>
            <Typography variant="body2">
              M.D. (Internal Medicine), Consultant Physician
            </Typography>
            <Typography variant="body2">Reg. No: UP-MC 12345</Typography>
            <Typography variant="body2">www.abcclinic.com</Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="h6" color="error" fontWeight="bold">
              ABC CLINIC
            </Typography>
            <Typography variant="caption">
              Caring for your health, every day
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              City Center, Lucknow
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Patient Info */}
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell>
                <b>Patient Name:</b> {patient.name}
              </TableCell>
              <TableCell>
                <b>OPD No:</b> {patient.opdNo}
              </TableCell>
              <TableCell>
                <b>Date/Time:</b> {dateNow}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Age/Gender:</b> {patient.age}
              </TableCell>
              <TableCell>
                <b>UHID:</b> {patient.uhId}
              </TableCell>
              <TableCell>
                <b>Doctor Name:</b> {patient.doctorName}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Mobile:</b> {patient.phone}
              </TableCell>
              <TableCell>
                <b>Department:</b> {patient.department}
              </TableCell>
              <TableCell>
                <b>Address:</b> {patient.address}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />

        {/* Medical Info */}
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell>
                <b>Diagnosis:</b> {patient.diagnosis}
              </TableCell>
              <TableCell>
                <b>Mode:</b> {patient.mode}
              </TableCell>
              <TableCell>
                <b>Status:</b> {patient.status}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />

        {/* Rx Symbol */}
        <Typography variant="h5" sx={{ mt: 2, color: "#007BFF" }}>
          ℞
        </Typography>

        {/* Medicine Table */}
        <Table
          size="small"
          sx={{ mt: 1, "& th": { backgroundColor: "#f0f4f9" } }}
        >
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Medicine Name</TableCell>
              <TableCell>Dose</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>Instructions</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{idx + 1}</TableCell>
                {["name", "dose", "unit", "freq", "instr"].map((field) => (
                  <TableCell key={field}>
                    <TextField
                      variant="standard"
                      fullWidth
                      size="small"
                      inputProps={{ style: { fontSize: 13, padding: 4 } }}
                      value={row[field]}
                      onChange={(e) => {
                        const newRows = [...rows];
                        newRows[idx][field] = e.target.value;
                        setRows(newRows);
                      }}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  {!isDownloading && (
                    <IconButton color="error" onClick={() => removeRow(idx)}>
                      <RemoveIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Add Medicine Row */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          {!isDownloading && (
            <Button variant="outlined" onClick={addRow}>
              + Add Medicine
            </Button>
          )}
        </Box>

        {/* Footer Section */}
        <Divider sx={{ my: 3, borderColor: "#ccc" }} />

        {/* Remark and Follow-up Date */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ mb: 2, display: "flex" }}>
            <Typography
              sx={{ fontSize: 14, color: "#000", mb: 0.5, mt: 1, mr: 1 }}
            >
              <strong>Remark:</strong>
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={2}
              variant="outlined"
              size="small"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              inputProps={{
                style: { fontSize: 14, color: "#000"  },
              }}
              sx={{ backgroundColor: "#ffffffff" }}
            />
          </Box>

          <Box sx={{ mb: 2, display: "flex" }}>
            <Typography sx={{ fontSize: 14, color: "#000", mb: 0.5, mr: 5 }}>
              <strong>Next Follow-up Date:</strong>
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={followUpDate}
                onChange={(newDate) => setFollowUpDate(newDate)}
                format="DD-MMM-YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    variant: "outlined",
                    sx: { backgroundColor: "#f9f9f9" },
                    inputProps: {
                      style: { fontSize: 14, color: "#000" },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: "#ccc" }} />

        {/* QR and Signature Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mt: 3,
          }}
        >
          {/* QR Code Box */}
          <Box
            sx={{
              width: 90,
              height: 90,
              backgroundColor: "#ffffff",
              border: "1px solid #ddd",
              borderRadius: 0.5,
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <canvas ref={qrRef}></canvas>
          </Box>

          {/* Doctor Signature */}
          <Box sx={{ textAlign: "right", flexGrow: 1, ml: 2 }}>
            <Typography sx={{ fontSize: 14, color: "#333", mb: 1 }}>
              ___________________________
            </Typography>
            <Typography
              sx={{ fontSize: 16, fontWeight: "bold", color: "#000" }}
            >
              Dr. A. B. Sharma
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#555" }}>
              M.D. (Internal Medicine)
            </Typography>
          </Box>
        </Box>

        {/* Footer Info */}
        <Typography
          variant="caption"
          align="center"
          sx={{
            display: "block",
            mt: 4,
            color: "#666",
            fontSize: 12,
            borderTop: "1px solid #ddd",
            pt: 1,
          }}
        >
          For Appointment: <strong>+91 99999 99999</strong> &nbsp;|&nbsp; ABC
          CLINIC, City Center, Lucknow &nbsp;|&nbsp;
          <br />
          Timings: 10:00 AM - 02:00 PM, 06:00 PM - 08:00 PM (Mon–Sat)
        </Typography>
      </Paper>
    </Box>
  );
}
