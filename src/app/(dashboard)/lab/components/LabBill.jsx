"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import QRCode from "qrcode";
import api from "@/utils/axiosInstance";

const show = (value) =>
  value === null || value === undefined || value === "" ? "—" : value;

const money = (value) =>
  value === null || value === undefined || value === ""
    ? "—"
    : `₹${Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

export default function LabBill({
  order = {},
  invoice = {},
  lab = {},
  reportUrl = "",
}) {
  const billRef = useRef(null);
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const tests = Array.isArray(invoice.test_charges)
    ? invoice.test_charges
    : [];

  const subtotal = useMemo(
    () => tests.reduce((sum, test) => sum + Number(test.rate || 0), 0),
    [tests],
  );

  const discount = Number(invoice.discount_amount || 0);
  const otherCharges = Number(invoice.other_charges || 0);
  const total = subtotal - discount + otherCharges;
  const paid = invoice.amount_received;

  const registration = lab?.registration?.registration_data || {};
  const labInfo = registration.labInformation || {};
  const address = registration.labAddress || {};

  const labName =
    lab.labName ||
    lab.lab_name ||
    labInfo.diagnosticLabName ||
    order.lab_name;

  const labEmail = lab.email || labInfo.labContactEmail;

  const labAddress = [
    address.shopUnitNumber,
    address.buildingComplexName,
    address.streetRoadName,
    address.areaLocality,
    address.cityTown,
    address.state,
    address.pinCode,
  ]
    .filter(Boolean)
    .join(", ");

  useEffect(() => {
    if (!reportUrl) {
      setQrImage("");
      return;
    }

    QRCode.toDataURL(reportUrl, { width: 88, margin: 1 })
      .then(setQrImage)
      .catch(() => setQrImage(""));
  }, [reportUrl]);

  const sendInvoice = async () => {
    if (!order.id) {
      setMessage("Order ID nahi mila.");
      return;
    }

    if (!tests.length) {
      setMessage("Invoice mein test details nahi hain.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const html2pdf = (await import("html2pdf.js")).default;
      const fileName = `${order.order_id || order.id}-invoice.pdf`;

      const pdfBlob = await html2pdf()
        .set({
          margin: 0,
          filename: fileName,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(billRef.current)
        .outputPdf("blob");

      const body = new FormData();
      body.append("lab_order_id", String(order.id));
      body.append("test_charges", JSON.stringify(tests));
      body.append("discount_amount", String(discount));
      body.append("other_charges", String(otherCharges));
      body.append("amount_received", String(paid ?? 0));
      body.append("payment_mode", String(invoice.payment_mode || "upi").toLowerCase());
      body.append(
        "invoicePdf",
        new File([pdfBlob], fileName, { type: "application/pdf" }),
      );

      const response = await api.post("/api/labs/invoices", body);
      setMessage(response.data?.message || "Invoice sent successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Invoice bhejne mein error aaya.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <main className="page">
        <article className="bill" ref={billRef}>
          <header className="brand">
            <svg className="logo" viewBox="0 0 64 64" role="img" aria-label="Lab logo">
              <circle cx="32" cy="32" r="29" fill="#e8f1f3" stroke="#253b4a" strokeWidth="3" />
              <path d="M9 34h12l5-12 8 23 7-16 4 5h10" fill="none" stroke="#168c83" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="48" cy="18" r="5" fill="#d66b55" />
            </svg>

            <div>
              <h1 className="brand-name">{show(labName)}</h1>
              <p className="tagline">ACCURATE &amp; AFFORDABLE ALWAYS</p>
            </div>

            <div className="bill-title">
              LABORATORY BILL
              <small>Bill No: {show(invoice.invoice_no)}</small>
            </div>
          </header>

          <section className="section details">
            <div>
              <p className="info"><span className="label">Registration No</span><span>:</span><span className="value">—</span></p>
              <p className="info"><span className="label">Patient Name</span><span>:</span><span className="value">{show(order.patient_name || order.walk_in_patient_name)}</span></p>
              <p className="info"><span className="label">Age / Sex</span><span>:</span><span className="value">{show(order.patient_age || order.walk_in_patient_age)} / {show(order.patient_gender || order.walk_in_patient_gender)}</span></p>
            <p className="info"><span className="label">Location</span><span>:</span><span className="value">{show(labAddress)}</span></p>
            </div>

            <div>
            
              <p className="info"><span className="label">Bill Date</span><span>:</span><span className="value">{show(invoice.created_at)}</span></p>
              <p className="info"><span className="label">Ref. Doctor</span><span>:</span><span className="value">{show(order.doctor_name)}</span></p>
              <p className="info"><span className="label">Payment</span><span>:</span><span className="value">{show(invoice.payment_mode)}</span></p>
            </div>
          </section>

          <section className="section">
            <h2 className="table-title">Test Details</h2>

            <table className="test-table">
              <thead>
                <tr>
                  <th>TEST NAME</th>
                  <th>TEST RATE (₹)</th>
                </tr>
              </thead>
              <tbody>
                {tests.length ? (
                  tests.map((test, index) => (
                    <tr key={`${test.test_code || "test"}-${index}`}>
                      <td>{show(test.test_name || test.test_code)}</td>
                      <td>{money(test.rate)}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td>—</td><td>—</td></tr>
                )}
              </tbody>
            </table>

            <div className="totals">
              <table>
                <tbody>
                  <tr><td>Total Bill Amount</td><td>{tests.length ? money(subtotal) : "—"}</td></tr>
                  <tr><td>Discount</td><td>{money(invoice.discount_amount)}</td></tr>
                  <tr><td>Other Charges</td><td>{money(invoice.other_charges)}</td></tr>
                  <tr className="grand-total"><td>Amount Paid</td><td>{money(paid)}</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <footer className="footer">
            <div className="footer-main">
              <div className="qr-box">
                {qrImage ? (
                  <img className="qr-image" src={qrImage} alt="Scan to view report" width={88} height={88} />
                ) : (
                  <span>—</span>
                )}
                <small>Scan to view report</small>
              </div>

              <div className="signature-area">
                <p className="thanks">Thank You</p>
                <div className="signature"><small>Authorized Signature</small></div>
              </div>
            </div>

            <div className="footer-details">
              <div>
                <b>Working Hours</b><br />
                {show(lab.workingHours)}<br />
                {show(labEmail)}
              </div>

              <div className="lab-address">
                <b>{show(labName)}</b><br />
                {show(labAddress)}
              </div>
            </div>
          </footer>
        </article>
      </main>

      <Button onClick={sendInvoice} disabled={loading} variant="contained">
        {loading ? "Sending..." : "Send"}
      </Button>

      {message && <Typography sx={{ mt: 1 }}>{message}</Typography>}

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 24px; background: #edf0f2; color: #17212b; font: 12px Arial, sans-serif; }
        .page { min-height: 100vh; overflow-x: auto; }
        .bill { position: relative; width: 210mm; min-height: 217mm; margin: auto; padding: 13mm 12mm 60mm; background: #fff; box-shadow: 0 3px 18px #00000018; }
        .brand { display: flex; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 2px solid #253b4a; }
        .logo { width: 52px; height: 52px; flex: none; }
        .brand-name { margin: 0; color: #253b4a; font-size: 23px; letter-spacing: .3px; }
        .tagline { margin: 3px 0 0; color: #61808c; font-size: 9px; font-weight: bold; letter-spacing: 1.3px; }
        .bill-title { margin-left: auto; color: #253b4a; font-size: 12px; font-weight: bold; letter-spacing: 1px; text-align: right; }
        .bill-title small { display: block; margin-top: 5px; color: #687782; font-size: 10px; font-weight: normal; letter-spacing: 0; }
        .section { margin-top: 15px; }
        .details { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 30px; padding: 12px 14px; background: #f5f8f9; border: 1px solid #dbe3e7; border-radius: 5px; }
        .info { display: grid; grid-template-columns: 100px 10px 1fr; gap: 4px; margin: 4px 0; line-height: 1.4; }
        .label { color: #596975; }
        .value { font-weight: 600; }
        .table-title { margin: 0 0 7px; color: #253b4a; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        .test-table th { padding: 9px 10px; background: #253b4a; color: #fff; font-size: 10px; letter-spacing: .5px; text-align: left; }
        .test-table td { padding: 9px 10px; border-bottom: 1px solid #e3e8eb; }
        .test-table th:last-child, .test-table td:last-child { width: 28%; text-align: right; }
        .test-table tbody tr:nth-child(even) { background: #f8fafb; }
        .totals { display: flex; justify-content: flex-end; margin-top: 10px; }
        .totals table { width: 290px; }
        .totals td { padding: 6px 8px; border: 0; }
        .totals td:last-child { font-weight: 600; text-align: right; }
        .grand-total td { border-top: 1px solid #253b4a; font-size: 13px; font-weight: bold; }
        .footer { position: absolute; right: 12mm; bottom: 8mm; left: 12mm; color: #596975; font-size: 9px; line-height: 1.5; }
        .footer-main { display: grid; min-height: 112px; grid-template-columns: 1fr 1fr; align-items: end; padding: 8px 0; }
        .qr-box { width: 120px; text-align: center; }
        .qr-image { display: block; width: 88px; height: 88px; margin: 0 auto; object-fit: contain; }
        .qr-box small { display: block; margin-top: 5px; color: #596975; font-size: 9px; }
        .signature-area { width: 190px; justify-self: end; }
        .thanks { margin: 0 0 20px; color: #253b4a; font-weight: bold; text-align: center; }
        .signature { padding-top: 27px; border-bottom: 1px solid #7d8990; text-align: center; }
        .signature small { display: block; padding: 5px 0; color: #596975; }
        .footer-details { display: flex; justify-content: space-between; gap: 20px; padding: 7px 0 0; border-top: 1px solid #dbe3e7; }
        .footer-details b { color: #253b4a; }
        .lab-address { text-align: right; }
        @media (max-width: 800px) { body { padding: 0; } .bill { margin: 0; } }
        @media print { body { padding: 0; background: #fff; } .bill { margin: 0; box-shadow: none; } @page { size: A4; margin: 0; } }
      `}</style>
    </Box>
  );
}