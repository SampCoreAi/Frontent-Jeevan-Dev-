"use client";

import { useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@mui/material";

const nullText = "—";
const hasValue = (value) =>
  value !== null &&
  value !== undefined &&
  value !== "" &&
  !(typeof value === "string" && ["null", "undefined"].includes(value.trim().toLowerCase()));

const get = (record, ...keys) => {
  for (const key of keys) {
    if (hasValue(record?.[key])) return record[key];
  }
  return null;
};

const text = (value) => (hasValue(value) ? String(value) : nullText);

const money = (value) => {
  if (!hasValue(value) || !Number.isFinite(Number(value))) return nullText;
  return "₹" + Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (value) => {
  if (!hasValue(value)) return nullText;
  const parts = String(value).slice(0, 10).split("-").map(Number);
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return text(value);
  return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

function InfoRow({ label, value }) {
  return <div className="info-row"><span>{label}</span><strong>{value}</strong></div>;
}

const createInvoicePdf = async (record, medicines, invoiceNumber, createdAt, totalAmount) => {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pageSize = [595.28, 841.89];
  const ink = rgb(0.09, 0.13, 0.2);
  const muted = rgb(0.32, 0.38, 0.46);
  const green = rgb(0.03, 0.53, 0.42);
  const paleGreen = rgb(0.93, 0.97, 0.95);
  const safeText = (value) =>
    String(value ?? nullText)
      .replace(/[^\x20-\x7E]/g, "")
      .slice(0, 90) || nullText;
  const addPage = () => pdf.addPage(pageSize);
  let page = addPage();
  let y = 42;

  const drawText = (value, x, top, size = 9, bold = false, color = ink) => {
    page.drawText(safeText(value), {
      x,
      y: page.getHeight() - top - size,
      size,
      font: bold ? boldFont : font,
      color,
      maxWidth: 500,
    });
  };
  const drawRule = (top, color = rgb(0.86, 0.91, 0.89)) => {
    page.drawLine({
      start: { x: 42, y: page.getHeight() - top },
      end: { x: 553, y: page.getHeight() - top },
      thickness: 0.8,
      color,
    });
  };
  const drawLabel = (value, x, top) =>
    drawText(value, x, top, 7, true, muted);
  const drawInfo = (label, value, x, top, width = 150) => {
    drawText(label, x, top, 8, false, muted);
    drawText(value, x + width - 82, top, 8, true);
  };
  const storeName = get(record, "store_name", "storeName", "medicalStore");

  page.drawRectangle({
    x: 42,
    y: page.getHeight() - 84,
    width: 44,
    height: 44,
    color: paleGreen,
  });
  drawText("+", 56, 47, 24, true, green);
  drawText(storeName, 98, 48, 15, true);
  drawText(invoiceNumber, 390, 48, 11, true);
  drawText(formatDate(createdAt), 420, 66, 8, false, muted);
  drawRule(100);

  drawLabel("PATIENT", 48, 114);
  drawText(get(record, "patient_name", "patientName"), 48, 130, 9, true);
  drawText(`Patient ID: ${text(get(record, "patient_id", "patientId"))}`, 48, 146, 8, false, muted);
  drawLabel("PRESCRIBED BY", 220, 114);
  drawText(get(record, "doctor_name", "doctorName"), 220, 130, 9, true);
  drawText(`Doctor ID: ${text(get(record, "doctor_id", "doctorId"))}`, 220, 146, 8, false, muted);
  drawLabel("ORDER", 396, 114);
  drawInfo("Order ID", text(get(record, "id")), 396, 132, 145);
  drawInfo("Version", text(get(record, "request_version", "requestVersion")), 396, 148, 145);
  drawRule(174);

  page.drawRectangle({
    x: 42,
    y: page.getHeight() - 204,
    width: 511,
    height: 22,
    color: paleGreen,
  });
  drawLabel("#", 48, 183);
  drawLabel("MEDICINE", 73, 183);
  drawLabel("BATCH", 270, 183);
  drawLabel("EXPIRY", 332, 183);
  drawLabel("QTY", 403, 183);
  drawLabel("UNIT PRICE", 438, 183);
  drawLabel("AMOUNT", 500, 183);

  y = 211;
  const rows = medicines.length
    ? medicines
    : [{ medicine_name: get(record, "medicine_name", "medicineName") }];
  rows.forEach((item, index) => {
    if (y > 735) {
      page = addPage();
      y = 42;
    }
    const name = get(item, "medicine_name", "medicineName") || "Medication";
    drawText(String(index + 1).padStart(2, "0"), 48, y, 8);
    drawText(name, 73, y, 8, true);
    drawText(get(item, "batch_number", "batchNumber") || get(record, "batch_number", "batchNumber"), 270, y, 8);
    drawText(formatDate(get(item, "expiry_date", "expiryDate") || get(record, "expiry_date", "expiryDate")), 332, y, 8);
    drawText(get(item, "quantity") ?? get(record, "quantity"), 403, y, 8);
    drawText(money(get(item, "unit_price", "unitPrice") ?? get(record, "unit_price", "unitPrice")), 438, y, 8);
    drawText(money(get(item, "amount", "total_amount") ?? get(record, "amount")), 500, y, 8);

    const detail = [
      get(item, "dose"),
      get(item, "duration") ? `${get(item, "duration")} days` : null,
      get(item, "frequency"),
      get(item, "instructions"),
    ].filter(hasValue).join(" | ");
    if (detail) drawText(detail, 73, y + 12, 7, false, muted);
    y += detail ? 34 : 24;
    drawRule(y - 5);
  });

  y += 18;
  if (y > 700) {
    page = addPage();
    y = 42;
  }
  drawLabel("PAYMENT", 48, y);
  drawInfo("Method", text(get(record, "payment_mode", "paymentMode")), 48, y + 18, 180);
  drawInfo("Status", text(get(record, "status")), 48, y + 34, 180);
  drawInfo("Quantity", text(get(record, "quantity")), 375, y, 170);
  drawInfo("Total Unit Price", money(get(record, "unit_price", "unitPrice")), 375, y + 18, 170);
  drawInfo("GST Rate", hasValue(get(record, "gst_rate", "gstRate")) ? `${get(record, "gst_rate", "gstRate")}%` : nullText, 375, y + 36, 170);
  drawInfo("Amount", money(get(record, "amount")), 375, y + 54, 170);
  drawRule(y + 78, ink);
  drawText("Total", 375, y + 88, 11, true);
  drawText(money(totalAmount), 470, y + 86, 15, true, green);

  const footerY = Math.min(y + 135, 780);
  drawRule(footerY - 8);
  drawLabel("STORE ADDRESS", 48, footerY);
  drawText(get(record, "store_address", "storeAddress", "address"), 48, footerY + 14, 8, false, muted);
  drawLabel("CONTACT", 220, footerY);
  drawText(get(record, "store_contact", "storeContact", "contact"), 220, footerY + 14, 8, false, muted);
  drawLabel("STORE TIMINGS", 396, footerY);
  drawText(get(record, "store_timings", "storeTimings", "timings"), 396, footerY + 14, 8, false, muted);

  return new Blob([await pdf.save()], { type: "application/pdf" });
};

function InvoiceDocument({ record, medicines, invoiceNumber, createdAt, totalAmount }) {
  return (
    <main className="invoice">
          <header className="invoice-header">
            <div className="invoice-brand">
              <div className="invoice-logo">+</div>
              <div>
                <h1 className="invoice-title">
                  {text(get(record, "store_name", "storeName", "medicalStore"))}
                </h1>
                <p className="invoice-subtitle">{nullText}</p>
              </div>
            </div>
            <div className="invoice-meta">
              <strong className="invoice-number">{text(invoiceNumber)}</strong>
              <time className="invoice-date">{formatDate(createdAt)}</time>
            </div>
          </header>

          <section className="details">
            <div>
              <label>PATIENT</label>
              <strong>{text(get(record, "patient_name", "patientName"))}</strong>
              <p>Patient ID: {text(get(record, "patient_id", "patientId"))}</p>
              <p>{nullText}</p>
            </div>
            <div>
              <label>PRESCRIBED BY</label>
              <strong>{text(get(record, "doctor_name", "doctorName"))}</strong>
              <p>Doctor ID: {text(get(record, "doctor_id", "doctorId"))}</p>
              <p>Registration: {nullText}</p>
            </div>
            <div>
              <label>ORDER</label>
              <InfoRow label="Order ID" value={text(get(record, "id"))} />
        
             
              <InfoRow label="Version" value={text(get(record, "request_version", "requestVersion"))} />
             
            </div>
          </section>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>MEDICINE</th><th>BATCH</th><th>EXPIRY</th>
                  <th className="right">QTY</th><th className="right"> UNIT PRICE</th>
                  <th className="right">DISCOUNT</th><th className="right">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {medicines.length ? medicines.map((item, index) => {
                  const details = [
                    get(item, "dose"),
                    get(item, "unit"),
                    hasValue(get(item, "duration"))
                      ? String(get(item, "duration")) + " days"
                      : null,
                    get(item, "frequency"),
                    get(item, "instructions"),
                  ].filter(hasValue).join(" · ");

                  return (
                    <tr key={String(get(item, "medicine_name", "medicineName") || "medicine") + index}>
                      <td>{String(index + 1).padStart(2, "0")}</td>
                      <td className="medicine">
                        {text(get(item, "medicine_name", "medicineName"))}
                        <small>{details || nullText}</small>
                      </td>
                      <td>{text(get(record, "batch_number", "batchNumber"))}</td>
                      <td>{formatDate(get(record, "expiry_date", "expiryDate"))}</td>
                      <td className="right">{text(get(item, "quantity"))}</td>
                      <td className="right">{nullText}</td>
                      <td className="right green">{nullText}</td>
                      <td className="right"><strong>{nullText}</strong></td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="8">{nullText}</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <section className="bottom">
            <div className="payment">
              <h3>Payment</h3>
              <InfoRow label="Method" value={nullText} />
              <InfoRow label="Status" value={text(get(record, "status"))} />
             
            </div>
            <div className="totals">
              <InfoRow label="Quantity" value={text(get(record, "quantity"))} />
              <InfoRow label="Total Unit Price" value={money(get(record, "unit_price", "unitPrice"))} />
              <InfoRow label="GST Rate" value={hasValue(get(record, "gst_rate", "gstRate")) ? text(get(record, "gst_rate", "gstRate")) + "%" : nullText} />
              <InfoRow label="Amount" value={money(get(record, "amount"))} />
              <div className="total">
                <strong>Total</strong>
                <strong>{money(totalAmount)}</strong>
              </div>
            </div>
          </section>

          <footer className="footer">
            <div><label>STORE ADDRESS</label><p>{nullText}</p></div>
            <div><label>CONTACT</label><p>{nullText}</p></div>
            <div><label>STORE TIMINGS</label><p>{nullText}</p></div>
          
          </footer>
    </main>
  );
}

const invoiceStyles = (
  <style jsx global>{`
        * { box-sizing: border-box; }
        .invoice { width: 100%; margin: auto; padding: 8px 20px 20px; color: #172033; font: 10px Arial, sans-serif; }
        .invoice-header, .invoice-brand, .details, .bottom, .footer { display: flex; justify-content: space-between; }
        .invoice-header { align-items: center; gap: 20px; padding: 10px 0 15px; border-bottom: 1px solid #dce8e3; }
        .invoice-brand { align-items: center; justify-content: flex-start; gap: 12px; }
        .invoice-logo { width: 44px; height: 44px; display: grid; place-items: center; flex-shrink: 0; border-radius: 10px; background: #edf7f2; color: #07876a; font-size: 27px; font-weight: 700; }
        .invoice-title { margin: 0 0 4px; font-size: 17px; }
        .invoice-subtitle { margin: 0; color: #07876a; font-size: 11px; font-weight: 600; }
        .invoice-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
        .invoice-number { font-size: 14px; }
        .invoice-date, .details p, .footer p { color: #526174; }
        p { margin: 3px 0; }
        .details { border-top: 1px solid #dce8e3; border-bottom: 1px solid #dce8e3; }
        .details > div { flex: 1; min-width: 0; padding: 12px; border-right: 1px solid #dce8e3; }
        .details > div:last-child { border-right: 0; }
        .details label, .footer label { display: block; margin-bottom: 8px; color: #748094; font-size: 8px; font-weight: 700; letter-spacing: .7px; }
        .details strong { display: block; }
        .details p, .footer p { font-size: 9px; line-height: 1.6; }
        .info-row { display: flex; justify-content: space-between; gap: 10px; margin: 7px 0; }
        .info-row span { color: #526174; }
        .info-row strong { text-align: right; }
        .table-wrap { margin: 7px 0; overflow-x: auto; border: 1px solid #dce8e3; border-radius: 6px; }
        table { width: 100%; border-collapse: collapse; font-size: 9px; }
        th, td { padding: 9px 7px; border-bottom: 1px solid #e8efec; text-align: left; white-space: nowrap; }
        th { background: #f8faf9; color: #526174; font-size: 8px; }
        tbody tr:last-child td { border-bottom: 0; }
        .right { text-align: right; }
        .medicine { font-weight: 700; }
        .medicine small { display: block; margin-top: 3px; color: #748094; font-size: 8px; font-weight: 400; }
        .green { color: #07876a; }
        .bottom { align-items: flex-start; gap: 32px; margin-top: 16px; }
        .payment { width: 50%; padding: 11px; border: 1px solid #dce8e3; border-radius: 6px; }
        .totals { width: 42%; }
        h3 { margin: 0 0 10px; font-size: 10px; }
        .total { display: flex; justify-content: space-between; margin-top: 12px; padding-top: 10px; border-top: 2px solid #172033; font-size: 12px; }
        .total strong:last-child { color: #07876a; font-size: 19px; }
        .footer { gap: 12px; margin-top: 20px; padding: 14px; background: #fbfcfc; border: 1px solid #dce8e3; border-radius: 8px; }
        .footer > div { flex: 1; min-width: 0; }
        @media (max-width: 600px) {
          .invoice { padding: 8px; }
          .invoice-title { font-size: 14px; }
          .invoice-logo { width: 38px; height: 38px; font-size: 23px; }
          .invoice-number { font-size: 11px; }
          .details, .bottom, .footer { flex-direction: column; }
          .details > div { border-right: 0; border-bottom: 1px solid #dce8e3; }
          .details > div:last-child { border-bottom: 0; }
          .payment, .totals, .footer > div { width: 100%; }
          table { min-width: 600px; }
        }
        @media print {
          @page { size: A4; margin: 10mm; }
          .invoice { padding: 6px 18px; }
        }
      `}</style>
);

export default function MedicalRequestInvoiceDialog({
  open,
  onClose,
  invoice,
  pdfWindow,
  onPdfError,
}) {
  const invoiceRef = useRef(null);

  const record = Array.isArray(invoice?.data)
    ? invoice.data[0] || {}
    : invoice?.data || invoice || {};
  const apiMedicines = get(record, "medicine_items", "medicineItems");
  const medicines = Array.isArray(apiMedicines) && apiMedicines.length
    ? apiMedicines
    : get(record, "medicine_name", "medicineName")
      ? [{
          medicine_name: get(record, "medicine_name", "medicineName"),
          quantity: get(record, "quantity"),
        }]
      : [];
  const invoiceNumber = get(record, "invoice_number", "invoiceNumber");
  const createdAt = get(record, "created_at", "createdAt", "invoiceDate");
  const totalAmount = get(record, "total_amount", "totalAmount", "amount");

  useEffect(() => {
    if (!pdfWindow || !invoiceRef.current) return undefined;

    let cancelled = false;
    let pdfUrl;

    const createPdf = async () => {
      try {
        const pdfBlob = await createInvoicePdf(
          record,
          medicines,
          invoiceNumber,
          createdAt,
          totalAmount,
        );

        if (cancelled || pdfWindow.closed) return;
        pdfUrl = URL.createObjectURL(pdfBlob);
        pdfWindow.location.replace(pdfUrl);
      } catch (error) {
        console.error("Could not generate pharmacy invoice PDF:", error);
        if (!pdfWindow.closed) pdfWindow.close();
        onPdfError?.("Could not open the invoice PDF. Please try again.");
      }
    };

    createPdf();

    return () => {
      cancelled = true;
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfWindow, invoice, onPdfError, record, medicines, invoiceNumber, createdAt, totalAmount]);

  if (!invoice || (!pdfWindow && !open)) return null;

  const document = (
    <InvoiceDocument
      record={record}
      medicines={medicines}
      invoiceNumber={invoiceNumber}
      createdAt={createdAt}
      totalAmount={totalAmount}
    />
  );

  if (pdfWindow) {
    return (
      <>
        <div
          ref={invoiceRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: -1,
            width: "190mm",
            background: "#fff",
          }}
        >
          {document}
        </div>
        {invoiceStyles}
      </>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>{document}</DialogContent>
      {invoiceStyles}
    </Dialog>
  );
}
