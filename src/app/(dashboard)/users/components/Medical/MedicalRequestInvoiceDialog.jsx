"use client";

import { Dialog, DialogContent } from "@mui/material";

const nullText = "null";
const hasValue = (value) => value !== null && value !== undefined && value !== "";

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

export default function MedicalRequestInvoiceDialog({ open, onClose, invoice }) {
  if (!open || !invoice) return null;

  const record = Array.isArray(invoice?.data)
    ? invoice.data[0] || {}
    : invoice?.data || invoice;

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
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
      </DialogContent>

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
    </Dialog>
  );
}
